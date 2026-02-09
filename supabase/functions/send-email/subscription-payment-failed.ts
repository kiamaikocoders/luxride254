// Edge Function: Send Subscription Payment Failed Notification Email
// Triggered when subscription payment fails or is declined

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "./_shared/email-client.ts";
import { getEmailTemplate } from "./_shared/templates.ts";

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

    const content = `
      <div class="greeting">Payment Issue - Action Required</div>
      
      <div class="message">
        We encountered an issue processing your ${packageName} package subscription payment. Your subscription may be suspended until payment is resolved.
      </div>
      
      <div class="info-box">
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Amount:</strong> KES ${Number(monthlyFee).toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod || "N/A"}</p>
        ${transactionId ? `<p><strong>Transaction ID:</strong> ${transactionId}</p>` : ""}
        ${failureReason ? `<p><strong>Reason:</strong> ${failureReason}</p>` : ""}
        ${subscriptionStatus ? `<p><strong>Subscription Status:</strong> ${subscriptionStatus}</p>` : ""}
      </div>
      
      <div class="message">
        <strong>Common reasons for payment failure:</strong>
        <ul style="margin-top: 10px; padding-left: 20px;">
          <li>Insufficient funds</li>
          <li>Expired payment method</li>
          <li>Bank/network issues</li>
          <li>Payment method restrictions</li>
        </ul>
      </div>
      
      ${retryUrl ? `
      <div style="text-align: center;">
        <a href="${retryUrl}" class="cta-button">Retry Payment</a>
      </div>
      ` : ""}
      
      <div class="message">
        Please update your payment method or retry the payment to restore your subscription access. If you continue to experience issues, contact our support team.
      </div>
      
      <div class="note">
        <strong>Important:</strong> If payment is not resolved within 24 hours, your subscription will be suspended and you won't be able to request rides. 
        Contact support at <a href="mailto:support@luxeride.com" style="color: #D4AF37;">support@luxeride.com</a> if you need assistance.
      </div>
    `;

    const html = getEmailTemplate(content);
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

