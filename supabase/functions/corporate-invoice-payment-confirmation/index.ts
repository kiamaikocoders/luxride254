// Edge Function: Send Corporate Invoice Payment Confirmation Email
// Triggered when corporate invoice is paid

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      corporateEmail,
      companyName,
      contactName,
      invoiceNumber,
      paymentAmount,
      paymentDate,
      paymentMethod,
      packageType,
      subscriptionRenewed,
      newExpirationDate,
      receiptPdf,
    } = await req.json();

    if (!corporateEmail || !invoiceNumber || !paymentAmount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = contactName ? contactName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Payment confirmed, ${firstName}! ✅` : "Payment confirmed! ✅";
    
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
        ✅ Payment Confirmed!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        Thank you! Your invoice payment has been successfully processed.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">💰 Payment Amount:</strong> KES ${Number(paymentAmount).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📋 Invoice Number:</strong> ${invoiceNumber}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📅 Payment Date:</strong> ${paymentDate ? new Date(paymentDate).toLocaleString() : new Date().toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">💳 Payment Method:</strong> ${paymentMethod || "N/A"}</p>
        ${packageType ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📦 Package:</strong> ${packageType.charAt(0).toUpperCase() + packageType.slice(1)}</p>` : ""}
        ${subscriptionRenewed ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">✅ Subscription Status:</strong> Renewed</p>` : ""}
        ${newExpirationDate ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📅 New Expiration Date:</strong> ${new Date(newExpirationDate).toLocaleDateString()}</p>` : ""}
      </div>
      
      ${subscriptionRenewed ? `
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">🎉 Subscription Renewed!</strong><br>
        Your corporate subscription has been renewed and is active until ${newExpirationDate ? new Date(newExpirationDate).toLocaleDateString() : "the next billing cycle"}.
      </div>
      ` : ""}
      
      ${receiptPdf ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${receiptPdf}" class="cta-button" style="background-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          📄 Download Receipt
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>🙏 Thank You:</strong> We appreciate your business. If you have any questions about this payment, contact 
        <a href="mailto:corporate@luxeride.org" style="color: #10b981; font-weight: 600;">corporate@luxeride.org</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: corporateEmail,
      subject: `Payment Confirmed - Invoice ${invoiceNumber}`,
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
    console.error("Error sending corporate invoice payment confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

