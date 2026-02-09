// Edge Function: Send Subscription Payment Failed Notification Email
// Triggered when subscription payment fails or is declined

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
      transactionId,
      packageType,
      monthlyFee,
      paymentMethod,
      failureReason,
      retryUrl,
      subscriptionStatus,
    } = await req.json();

    if (!userEmail || !packageType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const packageNames: Record<string, string> = {
      gold: "Gold",
      platinum: "Platinum",
      diamond: "Diamond",
    };

    const packageName = packageNames[packageType.toLowerCase()] || packageType;

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Payment issue, ${firstName} - Action needed ⚠️` : "Payment issue - Action needed ⚠️";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M60 30L75 55H90L80 70L85 90L60 75L35 90L40 70L30 55H45L60 30Z" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="8" fill="#EF4444"/>
        <path d="M55 60L65 60" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #EF4444;">
        ⚠️ Payment Failed
      </div>
      
      <div class="message">
        We encountered an issue processing your ${packageName} package subscription payment. Your subscription may be suspended until payment is resolved.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%); border-left: 4px solid #EF4444;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #EF4444;">📦 Package:</strong> ${packageName}</p>
        <p style="margin: 10px 0;"><strong style="color: #EF4444;">💰 Amount:</strong> KES ${Number(monthlyFee).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #EF4444;">💳 Payment Method:</strong> ${paymentMethod || "N/A"}</p>
        ${transactionId ? `<p style="margin: 10px 0;"><strong style="color: #EF4444;">🔢 Transaction ID:</strong> ${transactionId}</p>` : ""}
        ${failureReason ? `<p style="margin: 10px 0;"><strong style="color: #EF4444;">❌ Reason:</strong> ${failureReason}</p>` : ""}
        ${subscriptionStatus ? `<p style="margin: 10px 0;"><strong style="color: #EF4444;">📊 Subscription Status:</strong> ${subscriptionStatus}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
        <strong style="color: #F59E0B; font-size: 18px;">💡 Common reasons for payment failure:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          <li style="margin: 8px 0;">Insufficient funds</li>
          <li style="margin: 8px 0;">Expired payment method</li>
          <li style="margin: 8px 0;">Bank/network issues</li>
          <li style="margin: 8px 0;">Payment method restrictions</li>
        </ul>
      </div>
      
      ${retryUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${retryUrl}" class="cta-button" style="background-color: #EF4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
          🔄 Retry Payment Now
        </a>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">✅ Quick Fix:</strong><br>
        Please update your payment method or retry the payment to restore your subscription access. If you continue to experience issues, contact our support team.
      </div>
      
      <div class="note" style="background-color: #FEF2F2; border-left-color: #EF4444;">
        <strong>⏰ Important:</strong> If payment is not resolved within 24 hours, your subscription will be suspended and you won't be able to request rides. 
        Contact support at <a href="mailto:support@luxeride.org" style="color: #EF4444; font-weight: 600;">support@luxeride.org</a> if you need assistance.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Payment Failed - ${packageName} Subscription`,
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
    console.error("Error sending subscription payment failed notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

