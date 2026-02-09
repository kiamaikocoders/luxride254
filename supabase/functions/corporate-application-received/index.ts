// Edge Function: Send Corporate Account Application Received Email
// Triggered when corporate account application is submitted

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
      applicationId,
      applicationDate,
      statusCheckUrl,
      expectedReviewTime,
    } = await req.json();

    if (!corporateEmail || !applicationId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = contactName ? contactName.split(' ')[0] : '';
    const personalizedGreeting = firstName 
      ? `Thanks for choosing LuxeRide Corporate, ${firstName}! 🏢` 
      : "Thanks for choosing LuxeRide Corporate! 🏢";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="35" y="40" width="50" height="50" rx="3" fill="white" opacity="0.9"/>
        <rect x="40" y="50" width="15" height="10" fill="#D4AF37"/>
        <rect x="60" y="50" width="20" height="10" fill="#D4AF37"/>
        <rect x="40" y="65" width="40" height="5" fill="#D4AF37"/>
        <rect x="40" y="75" width="30" height="5" fill="#D4AF37"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #3B82F6;">
        ✨ Corporate Application Received!
      </div>
      
      <div class="message">
        Thank you ${contactName || "there"} for your interest in LuxeRide Corporate Services! We've successfully received your corporate account application for <strong>${companyName || "your company"}</strong>.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid #3B82F6;">
        <p style="margin: 8px 0;"><strong style="color: #3B82F6;">📋 Application ID:</strong> ${applicationId}</p>
        <p style="margin: 8px 0;"><strong style="color: #3B82F6;">🏢 Company:</strong> ${companyName || "N/A"}</p>
        <p style="margin: 8px 0;"><strong style="color: #3B82F6;">📅 Application Date:</strong> ${applicationDate ? new Date(applicationDate).toLocaleString() : new Date().toLocaleString()}</p>
        <p style="margin: 8px 0;"><strong style="color: #3B82F6;">📊 Status:</strong> <span style="color: #F59E0B;">Under Review</span></p>
        ${expectedReviewTime ? `<p style="margin: 8px 0;"><strong style="color: #3B82F6;">⏱️ Expected Review Time:</strong> ${expectedReviewTime}</p>` : "<p style="margin: 8px 0;"><strong style="color: #3B82F6;">⏱️ Expected Review Time:</strong> 3-5 business days</p>"}
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 18px;">🚀 What happens next?</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          <li style="margin: 8px 0;">Our corporate team will review your application</li>
          <li style="margin: 8px 0;">We'll verify your company details and requirements</li>
          <li style="margin: 8px 0;">You'll receive an email notification once reviewed</li>
          <li style="margin: 8px 0;">If approved, we'll set up your corporate account</li>
        </ul>
      </div>
      
      ${statusCheckUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${statusCheckUrl}" class="cta-button" style="background-color: #3B82F6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          📊 Check Application Status
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💬 Questions?</strong> Contact our corporate team at 
        <a href="mailto:corporate@luxeride.org" style="color: #3B82F6; font-weight: 600;">corporate@luxeride.org</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: corporateEmail,
      subject: `Corporate Account Application Received - ${companyName || "LuxeRide"}`,
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
    console.error("Error sending corporate application received email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

