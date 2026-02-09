// Edge Function: Send Car Owner Partnership Approved Email
// Triggered when admin approves car owner partnership

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
      partnerName,
      applicationId,
      partnershipTerms,
      revenueShare,
      onboardingUrl,
      partnerPortalUrl,
      supportContact,
    } = await req.json();

    if (!ownerEmail || !applicationId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = partnerName ? partnerName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Congratulations, ${firstName}! 🎉` : "Congratulations! 🎉";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="30" y="45" width="60" height="35" rx="3" fill="white" opacity="0.9"/>
        <circle cx="45" cy="85" r="7" fill="white" opacity="0.9"/>
        <circle cx="75" cy="85" r="7" fill="white" opacity="0.9"/>
        <path d="M40 60L50 55L70 55L80 60" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="45" r="8" fill="#10b981"/>
        <path d="M55 60L58 63L65 56" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">
        🎊 Partnership Approved!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        We're excited to inform you that your car owner partnership application has been approved! Welcome to the LuxeRide partner network.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">✅ Status:</strong> Approved</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📋 Application ID:</strong> ${applicationId}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">💰 Revenue Share:</strong> ${revenueShare || "50% of subscription revenue"}</p>
        ${partnershipTerms ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📄 Partnership Terms:</strong> ${partnershipTerms}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 18px;">🚀 Next Steps:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          <li style="margin: 8px 0;">Complete your partner profile</li>
          <li style="margin: 8px 0;">Set up your payment details</li>
          <li style="margin: 8px 0;">Access your partner portal</li>
          <li style="margin: 8px 0;">Start earning with LuxeRide</li>
        </ul>
      </div>
      
      ${onboardingUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${onboardingUrl}" class="cta-button" style="background-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          🚀 Start Onboarding
        </a>
      </div>
      ` : ""}
      
      ${partnerPortalUrl ? `
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${partnerPortalUrl}" class="cta-button" style="background-color: #3B82F6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          🏢 Access Partner Portal
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💬 Support:</strong> If you have questions, contact our partnership team at 
        <a href="mailto:${supportContact || 'partners@luxeride.org'}" style="color: #10b981; font-weight: 600;">${supportContact || 'partners@luxeride.org'}</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: ownerEmail,
      subject: "Partnership Approved - Welcome to LuxeRide!",
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
    console.error("Error sending car owner partnership approved email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

