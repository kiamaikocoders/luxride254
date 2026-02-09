// Edge Function: Send Trip Completion Receipt Email
// Triggered when a trip is marked as completed

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
      tripDate,
      pickupLocation,
      dropoffLocation,
      distance,
      duration,
      driverName,
      vehicleDetails,
      ridesUsed,
      ridesRemaining,
      packageType,
      feedbackUrl,
    } = await req.json();

    if (!userEmail || !tripId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const content = `
      <div class="greeting">Thank you for riding with LuxeRide!</div>
      
      <div class="message">
        Your trip has been completed. Here's a summary of your journey:
      </div>
      
      <div class="trip-details">
        <p><strong>Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p><strong>Date:</strong> ${tripDate ? new Date(tripDate).toLocaleString() : new Date().toLocaleString()}</p>
        <p><strong>Pickup:</strong> ${pickupLocation || "N/A"}</p>
        <p><strong>Dropoff:</strong> ${dropoffLocation || "N/A"}</p>
        ${distance ? `<p><strong>Distance:</strong> ${distance} km</p>` : ""}
        ${duration ? `<p><strong>Duration:</strong> ${duration} minutes</p>` : ""}
        ${driverName ? `<p><strong>Driver:</strong> ${driverName}</p>` : ""}
        ${vehicleDetails ? `<p><strong>Vehicle:</strong> ${vehicleDetails}</p>` : ""}
        ${packageType ? `<p><strong>Package:</strong> ${packageType.charAt(0).toUpperCase() + packageType.slice(1)}</p>` : ""}
        ${ridesUsed !== undefined ? `<p><strong>Rides Used This Month:</strong> ${ridesUsed}</p>` : ""}
        ${ridesRemaining !== undefined ? `<p><strong>Rides Remaining:</strong> ${ridesRemaining} rides</p>` : ""}
      </div>
      
      <div class="message">
        We hope you enjoyed your premium transportation experience. Your feedback helps us maintain our high standards.
      </div>
      
      ${feedbackUrl ? `
      <div style="text-align: center;">
        <a href="${feedbackUrl}" class="cta-button">Rate Your Experience</a>
      </div>
      ` : ""}
      
      <div class="note">
        <strong>Subscription Note:</strong> This ride has been deducted from your monthly subscription allowance. 
        ${ridesRemaining !== undefined && ridesRemaining > 0 
          ? `You have ${ridesRemaining} ride${ridesRemaining === 1 ? '' : 's'} remaining this month.`
          : ridesRemaining === 0 
          ? "You've used all your rides for this month. Renew your subscription to continue enjoying our services."
          : ""
        }
      </div>
    `;

    const html = getEmailTemplate(content);
    const result = await sendEmail({
      to: userEmail,
      subject: `Trip Receipt - ${tripId.slice(0, 8).toUpperCase()}`,
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
    console.error("Error sending trip completion receipt:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

