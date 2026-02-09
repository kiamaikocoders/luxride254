// Edge Function: Send Subscription Refund Confirmation Email
// Triggered when subscription refund is processed

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
      refundId,
      originalTransactionId,
      refundAmount,
      refundMethod,
      refundDate,
      packageType,
      estimatedArrival,
    } = await req.json();

    if (!userEmail || !refundId || !refundAmount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Refund processed, ${firstName}! 💰` : "Refund processed! 💰";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="60" r="30" fill="white" opacity="0.9"/>
        <path d="M50 60L55 65L70 50" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M45 75L50 70L70 70L75 75" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">
        ✅ Refund Processed!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        Your subscription refund has been successfully processed. The funds will be returned to your original payment method.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">💰 Refund Amount:</strong> KES ${Number(refundAmount).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">🔢 Refund ID:</strong> ${refundId}</p>
        ${originalTransactionId ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📋 Original Transaction:</strong> ${originalTransactionId}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #10b981;">💳 Refund Method:</strong> ${refundMethod || "Original payment method"}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📅 Refund Date:</strong> ${refundDate ? new Date(refundDate).toLocaleString() : new Date().toLocaleString()}</p>
        ${packageType ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📦 Package:</strong> ${packageType.charAt(0).toUpperCase() + packageType.slice(1)}</p>` : ""}
        ${estimatedArrival ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">⏱️ Estimated Arrival:</strong> ${estimatedArrival}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">⏰ Processing Time:</strong><br>
        ${estimatedArrival 
          ? `The refund will be processed and should appear in your account within ${estimatedArrival}.`
          : "The refund will be processed according to your payment provider's timeline."
        }
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💡 Note:</strong> If you don't see the refund in your account after the estimated time, please contact our support team at 
        <a href="mailto:support@luxeride.org" style="color: #10b981; font-weight: 600;">support@luxeride.org</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Refund Processed - ${refundId.slice(0, 8).toUpperCase()}`,
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
    console.error("Error sending subscription refund confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

