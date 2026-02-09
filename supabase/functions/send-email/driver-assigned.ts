// Edge Function: Send Driver Assigned Notification Email
// Triggered when a driver is assigned to a trip

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "./_shared/email-client.ts";
import { getEmailTemplate } from "./_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      userEmail,
      userName,
      tripId,
      driverName,
      driverPhone,
      vehicleMake,
      vehicleModel,
      vehiclePlate,
      estimatedArrival,
      trackingUrl,
    } = await req.json();

    if (!userEmail || !tripId || !driverName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const content = `
      <div class="greeting">Great news, ${userName || "there"}!</div>
      
      <div class="message">
        Your driver has been assigned and is on their way to pick you up!
      </div>
      
      <div class="info-box">
        <p><strong>Driver:</strong> ${driverName}</p>
        ${driverPhone ? `<p><strong>Contact:</strong> ${driverPhone}</p>` : ""}
        ${vehicleMake && vehicleModel ? `<p><strong>Vehicle:</strong> ${vehicleMake} ${vehicleModel}</p>` : ""}
        ${vehiclePlate ? `<p><strong>License Plate:</strong> ${vehiclePlate}</p>` : ""}
        ${estimatedArrival ? `<p><strong>Estimated Arrival:</strong> ${estimatedArrival}</p>` : ""}
      </div>
      
      ${trackingUrl ? `
      <div style="text-align: center;">
        <a href="${trackingUrl}" class="cta-button">Track Your Ride</a>
      </div>
      ` : ""}
      
      <div class="message">
        Your driver will contact you when they arrive at the pickup location. Please be ready for your luxury ride experience.
      </div>
      
      <div class="note">
        <strong>Tip:</strong> Keep your phone nearby so you don't miss your driver's call. You can also track the ride in real-time through the LuxeRide app.
      </div>
    `;

    const html = getEmailTemplate(content);
    const result = await sendEmail({
      to: userEmail,
      subject: `Your Driver is on the Way - ${driverName}`,
      html,
    });

    if (result.success) {
      return new Response(JSON.stringify({ success: true, messageId: result.id }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(JSON.stringify({ success: false, error: result.error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error sending driver assigned notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

