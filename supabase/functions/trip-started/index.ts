// Edge Function: Send Trip Started Notification Email
// Triggered when driver starts the trip

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
      startTime,
      estimatedDuration,
      trackingUrl,
    } = await req.json();

    if (!userEmail || !tripId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Your trip has started, ${firstName}!` : "Your trip has started!";

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #D4AF37; text-align: center;">
        🚀 Trip Started!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        Your luxury ride is now in progress. Sit back, relax, and enjoy the journey!
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%); border-left: 4px solid #D4AF37;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #D4AF37;">🔢 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">⏰ Start Time:</strong> ${startTime ? new Date(startTime).toLocaleString() : "Now"}</p>
        ${estimatedDuration ? `<p style="margin: 10px 0;"><strong style="color: #D4AF37;">⏱️ Estimated Duration:</strong> ${estimatedDuration} minutes</p>` : ""}
      </div>
      
      ${trackingUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${trackingUrl}" class="cta-button">
          📍 Track Your Trip Live
        </a>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">✨ Enjoy Your Ride!</strong><br>
        You can track your trip in real-time through the LuxeRide app. We'll notify you when you arrive at your destination.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerEmoji: "🚀",
      headerColor: "#D4AF37"
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Trip Started - ${tripId.slice(0, 8).toUpperCase()}`,
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
    console.error("Error sending trip started notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

