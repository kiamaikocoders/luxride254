// Edge Function: Send Trip Cancellation Notification (User Cancelled)
// Triggered when user cancels a trip

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
      cancellationTime,
      ridesRestored,
      ridesRemaining,
      cancellationReason,
    } = await req.json();

    if (!userEmail || !tripId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Trip cancelled, ${firstName}` : "Trip cancelled";

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #F59E0B;">
        ✅ Trip Cancelled
      </div>
      
      <div class="message">
        Your trip has been successfully cancelled. The ride credit has been restored to your monthly subscription allowance.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B;">
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">🔢 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">⏰ Cancellation Time:</strong> ${cancellationTime ? new Date(cancellationTime).toLocaleString() : new Date().toLocaleString()}</p>
        ${ridesRestored !== undefined ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">🔄 Ride Credit Restored:</strong> ${ridesRestored} ride${ridesRestored === 1 ? '' : 's'}</p>` : ""}
        ${ridesRemaining !== undefined ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">🚗 Rides Remaining:</strong> ${ridesRemaining} rides this month</p>` : ""}
        ${cancellationReason ? `<p style="margin: 10px 0;"><strong style="color: #F59E0B;">📝 Reason:</strong> ${cancellationReason}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">💡 Good News!</strong><br>
        You can request a new ride anytime through the LuxeRide app. Your subscription allowance remains intact.
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>📋 Note:</strong> If you need to cancel future trips, you can do so through the LuxeRide app up to 5 minutes before the scheduled pickup time.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerEmoji: "❌",
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

