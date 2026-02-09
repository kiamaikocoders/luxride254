// Edge Function: Send Corporate Account Rejected Email
// Triggered when admin rejects corporate account application

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
      rejectionReason,
      appealUrl,
      supportContact,
    } = await req.json();

    if (!corporateEmail || !applicationId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = contactName ? contactName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Application Update, ${firstName}` : "Application Update";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="35" y="40" width="50" height="50" rx="3" fill="white" opacity="0.9"/>
        <path d="M50 60L70 60" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #EF4444;">
        Application Status Update
      </div>
      
      <div class="message">
        Thank you ${contactName || "there"} for your interest in LuxeRide Corporate Services. After careful review, we're unable to approve your corporate account application at this time.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%); border-left: 4px solid #EF4444;">
        <p style="margin: 10px 0;"><strong style="color: #EF4444;">📋 Application ID:</strong> ${applicationId}</p>
        <p style="margin: 10px 0;"><strong style="color: #EF4444;">🏢 Company:</strong> ${companyName || "N/A"}</p>
        <p style="margin: 10px 0;"><strong style="color: #EF4444;">❌ Status:</strong> Not Approved</p>
        ${rejectionReason ? `<p style="margin: 10px 0;"><strong style="color: #EF4444;">📝 Reason:</strong> ${rejectionReason}</p>` : ""}
      </div>
      
      ${rejectionReason ? `
      <div class="message" style="background-color: #FEF2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #EF4444;">
        <strong style="color: #EF4444;">📄 Details:</strong><br>
        ${rejectionReason}
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F9FAFB; padding: 20px; border-radius: 8px;">
        We appreciate your interest in LuxeRide. If your circumstances change or you believe this decision was made in error, 
        you may submit a new application after 30 days.
      </div>
      
      ${appealUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${appealUrl}" class="cta-button" style="background-color: #EF4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
          📝 Appeal Decision
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💬 Questions?</strong> Contact our corporate team at 
        <a href="mailto:${supportContact || 'corporate@luxeride.org'}" style="color: #EF4444; font-weight: 600;">${supportContact || 'corporate@luxeride.org'}</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: corporateEmail,
      subject: "Corporate Account Application Status Update",
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
    console.error("Error sending corporate account rejected email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

