// Edge Function: Send Car Owner Partnership Application Received Email
// Triggered when car owner submits partnership application

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      ownerEmail,
      ownerName,
      applicationId,
      vehicleDetails,
      applicationDate,
      statusCheckUrl,
      expectedReviewTime,
    } = await req.json();

    if (!ownerEmail || !applicationId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = ownerName ? ownerName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Thanks for partnering with us, ${firstName}! 🤝` : "Thanks for partnering with us! 🤝";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="30" y="45" width="60" height="35" rx="3" fill="white" opacity="0.9"/>
        <circle cx="45" cy="85" r="7" fill="white" opacity="0.9"/>
        <circle cx="75" cy="85" r="7" fill="white" opacity="0.9"/>
        <path d="M40 60L50 55L70 55L80 60" stroke="#D4AF37" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="45" r="8" fill="#D4AF37"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #D4AF37;">
        ✨ Partnership Application Received!
      </div>
      
      <div class="message">
        Thank you ${ownerName || "there"} for your interest in partnering with LuxeRide! We've successfully received your car owner partnership application and we're excited to review it.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%); border-left: 4px solid #D4AF37;">
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">📋 Application ID:</strong> ${applicationId}</p>
        ${vehicleDetails ? `<p style="margin: 8px 0;"><strong style="color: #D4AF37;">🚗 Vehicle:</strong> ${vehicleDetails}</p>` : ""}
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">📅 Application Date:</strong> ${applicationDate ? new Date(applicationDate).toLocaleString() : new Date().toLocaleString()}</p>
        <p style="margin: 8px 0;"><strong style="color: #D4AF37;">📊 Status:</strong> <span style="color: #F59E0B;">Under Review</span></p>
        ${expectedReviewTime ? `<p style="margin: 8px 0;"><strong style="color: #D4AF37;">⏱️ Expected Review Time:</strong> ${expectedReviewTime}</p>` : "<p style="margin: 8px 0;"><strong style="color: #D4AF37;">⏱️ Expected Review Time:</strong> 3-5 business days</p>"}
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 18px;">🚀 What happens next?</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          <li style="margin: 8px 0;">Our partnership team will review your application</li>
          <li style="margin: 8px 0;">We'll verify your vehicle documents and details</li>
          <li style="margin: 8px 0;">You'll receive an email notification once reviewed</li>
          <li style="margin: 8px 0;">If approved, we'll guide you through onboarding</li>
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
        <strong>💬 Questions?</strong> Contact our partnership team at 
        <a href="mailto:partners@luxeride.org" style="color: #D4AF37; font-weight: 600;">partners@luxeride.org</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: ownerEmail,
      subject: "Car Owner Partnership Application Received - LuxeRide",
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
    console.error("Error sending car owner application received email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

