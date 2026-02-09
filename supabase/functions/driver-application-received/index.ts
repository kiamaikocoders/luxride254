// Edge Function: Send Driver Application Received Email
// Triggered when driver submits application

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
      applicationId,
      applicationDate,
      nextSteps,
      statusCheckUrl,
      expectedReviewTime,
    } = await req.json();

    if (!driverEmail || !applicationId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = driverName ? driverName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Thanks for applying, ${firstName}! 🎉` : "Thanks for applying! 🎉";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M60 30L70 50H85L75 65L80 85L60 75L40 85L45 65L35 50H50L60 30Z" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="8" fill="#D4AF37"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #D4AF37;">
        ✨ Application Received!
      </div>
      
      <div class="message">
        Thank you ${driverName || "there"} for your interest in joining the LuxeRide team! We've successfully received your driver application and we're excited to review it.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%); border-left: 4px solid #D4AF37;">
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">📋 Application ID:</strong> ${applicationId}</p>
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">📅 Application Date:</strong> ${applicationDate ? new Date(applicationDate).toLocaleString() : new Date().toLocaleString()}</p>
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">📊 Status:</strong> <span style="color: #F59E0B;">Under Review</span></p>
        ${expectedReviewTime ? `<p style="margin: 8px 0;"><strong style="color: #D4AF37;">⏱️ Expected Review Time:</strong> ${expectedReviewTime}</p>` : "<p style="margin: 8px 0;"><strong style="color: #D4AF37;">⏱️ Expected Review Time:</strong> 2-3 business days</p>"}
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 18px;">🚀 What happens next?</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          ${nextSteps ? nextSteps.split('\n').map((step: string) => `<li style="margin: 8px 0;">${step}</li>`).join('') : `
          <li style="margin: 8px 0;">Our team will carefully review your application</li>
          <li style="margin: 8px 0;">We'll verify your documents and credentials</li>
          <li style="margin: 8px 0;">You'll receive an email notification once reviewed</li>
          <li style="margin: 8px 0;">If approved, we'll guide you through onboarding</li>
          `}
        </ul>
      </div>
      
      ${statusCheckUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${statusCheckUrl}" class="cta-button">
          📊 Check Application Status
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💬 Questions?</strong> If you have any questions about your application, contact our driver support team at 
        <a href="mailto:drivers@luxeride.org" style="color: #D4AF37; font-weight: 600;">drivers@luxeride.org</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: driverEmail,
      subject: "Driver Application Received - LuxeRide",
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
    console.error("Error sending driver application received email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

