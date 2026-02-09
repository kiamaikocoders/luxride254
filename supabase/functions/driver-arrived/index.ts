// Edge Function: Send Driver Arrived Notification Email
// Triggered when driver arrives at pickup location

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
      driverName,
      driverPhone,
      vehiclePlate,
      pickupLocation,
    } = await req.json();

    if (!userEmail || !tripId || !driverName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Your driver has arrived, ${firstName}!` : "Your driver has arrived!";

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">
        ✅ Driver Arrived!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        ${driverName} has arrived at your pickup location and is waiting for you.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">👤 Driver:</strong> ${driverName}</p>
        ${driverPhone ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📞 Contact:</strong> <a href="tel:${driverPhone}" style="color: #10b981; text-decoration: none;">${driverPhone}</a></p>` : ""}
        ${vehiclePlate ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">🔢 Vehicle Plate:</strong> ${vehiclePlate}</p>` : ""}
        ${pickupLocation ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📍 Pickup Location:</strong> ${pickupLocation}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #10b981;">🔢 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
      </div>
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">🚀 Ready to Go!</strong><br>
        Please proceed to your pickup location. Your driver is ready to begin your luxury ride experience.
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💡 Tip:</strong> If you can't find your driver, call them directly at ${driverPhone || "the number provided in the app"}.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerEmoji: "✅",
      headerColor: "#10b981"
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Your driver has arrived - ${driverName}`,
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
    console.error("Error sending driver arrived notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

