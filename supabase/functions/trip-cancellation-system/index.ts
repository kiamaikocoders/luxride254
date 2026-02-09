// Edge Function: Send Trip Cancellation Notification (Driver/System Cancelled)
// Triggered when driver or system cancels a trip

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
      cancellationReason,
      rebookUrl,
      supportContact,
    } = await req.json();

    if (!userEmail || !tripId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Trip cancelled, ${firstName} - We're sorry` : "Trip cancelled - We're sorry";

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #F59E0B;">
        ⚠️ Trip Cancelled
      </div>
      
      <div class="message">
        We're sorry to inform you that your trip has been cancelled. We understand this is inconvenient and sincerely apologize for any disruption to your plans.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B;">
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">🔢 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">📝 Reason:</strong> ${cancellationReason || "Unforeseen circumstances"}</p>
      </div>
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">✅ Good News:</strong><br>
        Your ride credit has been restored to your monthly subscription allowance. You can request a new ride at any time.
      </div>
      
      ${rebookUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${rebookUrl}" class="cta-button" style="background-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          🚗 Request New Ride
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💬 Need Help?</strong> If you have questions or concerns about this cancellation, please contact our support team at 
        <a href="mailto:${supportContact || 'support@luxeride.org'}" style="color: #F59E0B; font-weight: 600;">${supportContact || 'support@luxeride.org'}</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerEmoji: "⚠️",
      headerColor: "#F59E0B"
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Trip Cancelled - ${tripId.slice(0, 8).toUpperCase()}`,
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
    console.error("Error sending trip cancellation notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

