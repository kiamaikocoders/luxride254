// Edge Function: Send Monthly Invoice Generation Email (Corporate Accounts)
// Triggered at end of month for corporate accounts

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
      invoiceDate,
      billingPeriod,
      packageType,
      monthlyFee,
      tripCount,
      totalAmount,
      tripDetails,
      paymentDueDate,
      invoicePdf,
      paymentUrl,
    } = await req.json();

    if (!corporateEmail || !invoiceNumber || !totalAmount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = contactName ? contactName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Monthly invoice ready, ${firstName}! 📄` : "Monthly invoice ready! 📄";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="40" y="40" width="40" height="50" rx="2" fill="white" opacity="0.9"/>
        <path d="M45 50L55 50M45 60L70 60M45 70L65 70" stroke="#3B82F6" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #3B82F6;">
        📄 Monthly Invoice Generated
      </div>
      
      <div class="message">
        Your monthly invoice for ${billingPeriod || "the billing period"} has been generated and is ready for payment.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid #3B82F6;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #3B82F6;">📋 Invoice Number:</strong> ${invoiceNumber}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">📅 Invoice Date:</strong> ${invoiceDate ? new Date(invoiceDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">📆 Billing Period:</strong> ${billingPeriod || "N/A"}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">🏢 Company:</strong> ${companyName || "N/A"}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">📦 Package:</strong> ${packageType ? packageType.charAt(0).toUpperCase() + packageType.slice(1) : "Corporate"}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">💰 Monthly Fee:</strong> KES ${Number(monthlyFee || totalAmount).toLocaleString()}</p>
        ${tripCount !== undefined ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">🚗 Trips Used:</strong> ${tripCount}</p>` : ""}
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #3B82F6;">💵 Total Amount Due:</strong> KES ${Number(totalAmount).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">⏰ Payment Due Date:</strong> ${paymentDueDate ? new Date(paymentDueDate).toLocaleDateString() : "N/A"}</p>
      </div>
      
      ${tripDetails && tripDetails.length > 0 ? `
      <div class="message" style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6;">🚗 Trip Summary:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          ${tripDetails.slice(0, 5).map((trip: any) => `<li style="margin: 8px 0;">${trip.date || "N/A"}: ${trip.pickup || "N/A"} → ${trip.dropoff || "N/A"}</li>`).join('')}
          ${tripDetails.length > 5 ? `<li style="margin: 8px 0;">... and ${tripDetails.length - 5} more trips</li>` : ""}
        </ul>
      </div>
      ` : ""}
      
      ${invoicePdf ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${invoicePdf}" class="cta-button" style="background-color: #3B82F6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          📄 Download Invoice PDF
        </a>
      </div>
      ` : ""}
      
      ${paymentUrl ? `
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${paymentUrl}" class="cta-button" style="background-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          💳 Pay Invoice Now
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #FEF3C7; border-left-color: #F59E0B;">
        <strong style="color: #F59E0B;">💡 Payment Terms:</strong> Payment is due within ${paymentDueDate ? Math.ceil((new Date(paymentDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 30} days. 
        For questions about this invoice, contact your account manager or 
        <a href="mailto:corporate@luxeride.org" style="color: #F59E0B; font-weight: 600;">corporate@luxeride.org</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: corporateEmail,
      subject: `Monthly Invoice ${invoiceNumber} - ${companyName || "LuxeRide Corporate"}`,
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
    console.error("Error sending corporate invoice:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

