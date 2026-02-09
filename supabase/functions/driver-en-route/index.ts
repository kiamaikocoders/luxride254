// Edge Function: Send Driver En Route Notification Email
// Triggered when driver starts navigating to pickup location

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
      estimatedArrival,
      trackingUrl,
    } = await req.json();

    if (!userEmail || !tripId || !driverName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `${driverName} is on the way, ${firstName}!` : `${driverName} is on the way!`;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #10b981;">
        🚗 Driver En Route!
      </div>
      
      <div class="message">
        Great news! ${driverName} has started navigating to your pickup location and will arrive shortly.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">👤 Driver:</strong> ${driverName}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">🔢 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        ${estimatedArrival ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">⏱️ Estimated Arrival:</strong> ${estimatedArrival}</p>` : ""}
      </div>
      
      ${trackingUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${trackingUrl}" class="cta-button" style="background-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          📍 Track Your Ride Live
        </a>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
        <strong style="color: #F59E0B;">⏰ Be Ready!</strong><br>
        Please be ready at your pickup location. Your driver will contact you when they arrive.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerEmoji: "📍",
      headerColor: "#10b981"
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `${driverName} is on the way!`,
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
    console.error("Error sending driver en route notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

