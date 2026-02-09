// Edge Function: Send Ride Request Confirmation Email
// Triggered when a user successfully requests a ride

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

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

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Your ride is confirmed, ${firstName}!` : "Your ride is confirmed!";

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px;">
        🎉 Ride Request Confirmed!
      </div>
      
      <div class="message">
        We're preparing your luxury transportation experience. ${driverName ? `Your driver ${driverName} is on the way!` : "We're matching you with the perfect driver right now."}
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%); border-left: 4px solid #D4AF37;">
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Pickup:</strong> ${pickupLocation || "TBD"}</p>
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Destination:</strong> ${dropoffLocation || "TBD"}</p>
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Pickup Time:</strong> ${pickupTime ? new Date(pickupTime).toLocaleString() : "As soon as possible"}</p>
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">Vehicle:</strong> ${vehicleType || "Premium"}</p>
        ${packageType ? `<p style="margin: 8px 0;"><strong style="color: #D4AF37;">Package:</strong> ${packageType.charAt(0).toUpperCase() + packageType.slice(1)}</p>` : ""}
        ${ridesRemaining !== undefined ? `<p style="margin: 8px 0;"><strong style="color: #D4AF37;">Rides Remaining:</strong> ${ridesRemaining} this month</p>` : ""}
        ${driverName ? `<p style="margin: 8px 0;"><strong style="color: #D4AF37;">Driver:</strong> ${driverName}</p>` : "<p style="margin: 8px 0;"><strong style="color: #D4AF37;">Driver:</strong> Will be assigned shortly</p>"}
        ${driverPhone ? `<p style="margin: 8px 0;"><strong style="color: #D4AF37;">Contact:</strong> ${driverPhone}</p>` : ""}
      </div>
      
      ${driverName ? `
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">✅ Driver Assigned!</strong><br>
        ${driverName} will be arriving shortly. You can track your ride in real-time through the LuxeRide app.
      </div>
      ` : `
      <div class="message" style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
        <strong style="color: #F59E0B;">⏳ Matching Driver...</strong><br>
        We're finding the perfect driver for you. You'll receive a notification once your driver is assigned.
      </div>
      `}
      
      <div class="note" style="background-color: #F9FAFB; border-left: 4px solid #D4AF37;">
        <strong>💡 Quick Tip:</strong> This ride will be deducted from your monthly subscription allowance. If you need to cancel or modify this request, please do so through the LuxeRide app.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerEmoji: "🎉",
      headerColor: "#10b981"
    });
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

