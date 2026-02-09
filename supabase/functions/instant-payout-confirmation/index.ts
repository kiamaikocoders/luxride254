// Edge Function: Send Instant Payout Confirmation Email
// Triggered when driver requests instant payout

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      driverEmail,
      driverName,
      payoutId,
      amount,
      processingFee,
      netAmount,
      payoutMethod,
      estimatedArrival,
      sourceTrips,
    } = await req.json();

    if (!driverEmail || !payoutId || !amount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = driverName ? driverName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Instant payout processing, ${firstName}! ⚡` : "Instant payout processing! ⚡";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="50" r="20" fill="white" opacity="0.9"/>
        <path d="M50 70L60 60L70 70" stroke="#D4AF37" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="60" cy="50" r="8" fill="#D4AF37"/>
        <path d="M55 45L60 40L65 45" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #D4AF37;">
        ⚡ Instant Payout Processing
      </div>
      
      <div class="message">
        Your instant payout request has been received and is being processed.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%); border-left: 4px solid #D4AF37;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #D4AF37;">💰 Net Amount:</strong> KES ${Number(netAmount || amount).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">💵 Amount:</strong> KES ${Number(amount).toLocaleString()}</p>
        ${processingFee ? `<p style="margin: 10px 0;"><strong style="color: #D4AF37;">💸 Processing Fee:</strong> KES ${Number(processingFee).toLocaleString()}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">🔢 Payout ID:</strong> ${payoutId}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">💳 Payout Method:</strong> ${payoutMethod || "M-Pesa"}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">⏱️ Estimated Arrival:</strong> ${estimatedArrival || "Within 1-2 hours"}</p>
        ${sourceTrips !== undefined ? `<p style="margin: 10px 0;"><strong style="color: #D4AF37;">🚗 Source Trips:</strong> ${sourceTrips} trip${sourceTrips === 1 ? '' : 's'}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">⏰ Processing Now!</strong><br>
        Your instant payout is being processed and should arrive in your account shortly. 
        ${estimatedArrival ? `Expected arrival: ${estimatedArrival}` : "You'll receive a notification once the funds are available."}
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💡 Note:</strong> Instant payouts include a small processing fee. 
        Regular weekly payouts (every Friday) have no processing fees.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: driverEmail,
      subject: `Instant Payout Processing - KES ${Number(netAmount || amount).toLocaleString()}`,
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
    console.error("Error sending instant payout confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

