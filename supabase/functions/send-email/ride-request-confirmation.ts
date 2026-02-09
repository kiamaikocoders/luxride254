// Edge Function: Send Ride Request Confirmation Email
// Triggered when a user successfully requests a ride

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
      pickupLocation,
      dropoffLocation,
      pickupTime,
      vehicleType,
      packageType,
      ridesRemaining,
      driverName,
      driverPhone,
    } = await req.json();

    if (!userEmail || !tripId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const content = `
      <div class="greeting">Hello ${userName || "there"}!</div>
      
      <div class="message">
        Your ride request has been confirmed! We're preparing your luxury transportation experience.
      </div>
      
      <div class="trip-details">
        <p><strong>Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p><strong>Pickup Location:</strong> ${pickupLocation || "TBD"}</p>
        <p><strong>Dropoff Location:</strong> ${dropoffLocation || "TBD"}</p>
        <p><strong>Pickup Time:</strong> ${pickupTime ? new Date(pickupTime).toLocaleString() : "As soon as possible"}</p>
        <p><strong>Vehicle Type:</strong> ${vehicleType || "Premium"}</p>
        <p><strong>Package:</strong> ${packageType ? packageType.charAt(0).toUpperCase() + packageType.slice(1) : "N/A"}</p>
        ${ridesRemaining !== undefined ? `<p><strong>Rides Remaining:</strong> ${ridesRemaining} rides this month</p>` : ""}
        ${driverName ? `<p><strong>Driver:</strong> ${driverName}</p>` : "<p><strong>Driver:</strong> Will be assigned shortly</p>"}
        ${driverPhone ? `<p><strong>Driver Phone:</strong> ${driverPhone}</p>` : ""}
      </div>
      
      ${driverName ? `
      <div class="message">
        Your driver ${driverName} will be arriving shortly. You can track your ride in real-time through the LuxeRide app.
      </div>
      ` : `
      <div class="message">
        We're matching you with the perfect driver. You'll receive a notification once your driver is assigned.
      </div>
      `}
      
      <div class="note">
        <strong>Note:</strong> This ride will be deducted from your monthly subscription allowance. If you need to cancel or modify this request, please do so through the LuxeRide app.
      </div>
    `;

    const html = getEmailTemplate(content);
    const result = await sendEmail({
      to: userEmail,
      subject: `Ride Request Confirmed - Trip ${tripId.slice(0, 8).toUpperCase()}`,
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
    console.error("Error sending ride request confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

