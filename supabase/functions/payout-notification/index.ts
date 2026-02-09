// Edge Function: Send Payout Notification Email (Driver/Partner)
// Triggered when weekly payout is processed (Friday)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      recipientEmail,
      recipientName,
      recipientType, // "driver" or "partner"
      payoutId,
      payoutPeriod,
      totalEarnings,
      tripCount,
      ownerShare,
      driverShare,
      platformCommission,
      payoutMethod,
      payoutDate,
      earningsBreakdown,
    } = await req.json();

    if (!recipientEmail || !payoutId || !totalEarnings) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const isPartner = recipientType === "partner" || ownerShare !== undefined;
    const shareAmount = isPartner ? ownerShare : driverShare;

    const firstName = recipientName ? recipientName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Weekly payout processed, ${firstName}! 💰` : "Weekly payout processed! 💰";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="50" r="20" fill="white" opacity="0.9"/>
        <path d="M50 70L60 60L70 70" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="60" cy="50" r="8" fill="#10b981"/>
        <path d="M45 75L50 70L70 70L75 75" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">
        💰 Weekly Payout Processed!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        Your weekly payout for ${payoutPeriod || "the payment period"} has been successfully processed.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">💰 Total Earnings:</strong> KES ${Number(totalEarnings).toLocaleString()}</p>
        ${shareAmount ? `<p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">💵 Your Share:</strong> KES ${Number(shareAmount).toLocaleString()} (${isPartner ? "50%" : "32%"} of subscription revenue)</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #10b981;">🔢 Payout ID:</strong> ${payoutId}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📆 Payout Period:</strong> ${payoutPeriod || "N/A"}</p>
        ${tripCount !== undefined ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">🚗 Trips Completed:</strong> ${tripCount}</p>` : ""}
        ${platformCommission ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📊 Platform Commission:</strong> KES ${Number(platformCommission).toLocaleString()} (18%)</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #10b981;">💳 Payout Method:</strong> ${payoutMethod || "M-Pesa"}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📅 Payout Date:</strong> ${payoutDate ? new Date(payoutDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
      </div>
      
      ${earningsBreakdown && earningsBreakdown.length > 0 ? `
      <div class="message" style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6;">📊 Earnings Breakdown:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          ${earningsBreakdown.slice(0, 5).map((trip: any) => 
            `<li style="margin: 8px 0;">${trip.date || "N/A"}: KES ${Number(trip.amount || 0).toLocaleString()} - ${trip.packageType || "N/A"} package</li>`
          ).join('')}
          ${earningsBreakdown.length > 5 ? `<li style="margin: 8px 0;">... and ${earningsBreakdown.length - 5} more trips</li>` : ""}
        </ul>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">${isPartner ? "🤝" : "👏"} Thank You!</strong><br>
        ${isPartner 
          ? "Thank you for being a valued LuxeRide partner. Your earnings are based on subscription revenue from trips using your vehicles."
          : "Thank you for your excellent service as a LuxeRide driver. Your earnings are based on subscription revenue from your completed trips."
        }
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>📅 Next Payout:</strong> Your next weekly payout will be processed next Friday. 
        Keep up the great work!
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: recipientEmail,
      subject: `Weekly Payout Processed - KES ${Number(totalEarnings).toLocaleString()}`,
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
    console.error("Error sending payout notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

