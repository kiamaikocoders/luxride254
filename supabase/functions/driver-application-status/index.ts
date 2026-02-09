// Edge Function: Send Driver Application Status Email
// Triggered when driver application is approved or rejected

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
      status, // "approved" or "rejected"
      rejectionReason,
      onboardingUrl,
      requiredDocuments,
      nextSteps,
    } = await req.json();

    if (!driverEmail || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = driverName ? driverName.split(' ')[0] : '';
    
    if (status.toLowerCase() === "approved") {
      const personalizedGreeting = firstName ? `Congratulations, ${firstName}! 🎉` : "Congratulations! 🎉";
      
      const headerIllustration = `
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
          <path d="M60 30L70 50H85L75 65L80 85L60 75L40 85L45 65L35 50H50L60 30Z" fill="white" opacity="0.9"/>
          <circle cx="60" cy="60" r="10" fill="#10b981"/>
          <path d="M55 60L58 63L65 56" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;

      const content = `
        <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">
          🎊 Application Approved!
        </div>
        
        <div class="message" style="text-align: center; font-size: 18px;">
          We're excited to inform you that your driver application has been approved! Welcome to the LuxeRide team.
        </div>
        
        <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
          <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">✅ Status:</strong> Approved</p>
          <p style="margin: 10px 0;"><strong style="color: #10b981;">📋 Application ID:</strong> ${applicationId || "N/A"}</p>
        </div>
        
        <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
          <strong style="color: #3B82F6; font-size: 18px;">🚀 Next Steps:</strong>
          <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
            ${nextSteps ? nextSteps.split('\n').map((step: string) => `<li style="margin: 8px 0;">${step}</li>`).join('') : `
            <li style="margin: 8px 0;">Complete your driver profile</li>
            <li style="margin: 8px 0;">Upload required documents</li>
            <li style="margin: 8px 0;">Complete onboarding training</li>
            <li style="margin: 8px 0;">Set up your payment details</li>
            `}
          </ul>
        </div>
        
        ${requiredDocuments ? `
        <div class="message" style="background-color: #FFF9E6; padding: 20px; border-radius: 8px; border-left: 4px solid #D4AF37;">
          <strong style="color: #D4AF37; font-size: 18px;">📄 Required Documents:</strong>
          <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
            ${requiredDocuments.split('\n').map((doc: string) => `<li style="margin: 8px 0;">${doc}</li>`).join('')}
          </ul>
        </div>
        ` : ""}
        
        ${onboardingUrl ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${onboardingUrl}" class="cta-button" style="background-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
            🚀 Start Onboarding
          </a>
        </div>
        ` : ""}
        
        <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">💡 You're Almost There!</strong><br>
          Once you complete onboarding, you'll be able to go online and start accepting ride requests. We're here to support you every step of the way.
        </div>
        
        <div class="note" style="background-color: #F9FAFB;">
          <strong>💬 Support:</strong> If you have any questions during onboarding, contact our driver support team at 
          <a href="mailto:drivers@luxeride.org" style="color: #10b981; font-weight: 600;">drivers@luxeride.org</a>
        </div>
      `;

      const html = getEmailTemplate(content, {
        personalizedGreeting: personalizedGreeting,
        headerIllustration: headerIllustration
      });
      const result = await sendEmail({
        to: driverEmail,
        subject: "Driver Application Approved - Welcome to LuxeRide!",
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
    } else {
      // Rejected
      const personalizedGreeting = firstName ? `Application Update, ${firstName}` : "Application Update";
      
      const headerIllustration = `
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
          <circle cx="60" cy="60" r="30" fill="white" opacity="0.9"/>
          <path d="M50 60L70 60" stroke="#EF4444" stroke-width="4" stroke-linecap="round"/>
        </svg>
      `;

      const content = `
        <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #EF4444;">
          Application Status Update
        </div>
        
        <div class="message">
          Thank you for your interest in joining LuxeRide. After careful review, we're unable to approve your driver application at this time.
        </div>
        
        <div class="info-box" style="background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%); border-left: 4px solid #EF4444;">
          <p style="margin: 10px 0;"><strong style="color: #EF4444;">📋 Application ID:</strong> ${applicationId || "N/A"}</p>
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
          We appreciate your interest in LuxeRide. If you believe this decision was made in error, or if your circumstances change, 
          you may submit a new application after 30 days.
        </div>
        
        <div class="note" style="background-color: #F9FAFB;">
          <strong>💬 Questions?</strong> If you have questions about this decision, please contact our support team at 
          <a href="mailto:drivers@luxeride.org" style="color: #EF4444; font-weight: 600;">drivers@luxeride.org</a>
        </div>
      `;

      const html = getEmailTemplate(content, {
        personalizedGreeting: personalizedGreeting,
        headerIllustration: headerIllustration
      });
      const result = await sendEmail({
        to: driverEmail,
        subject: "Driver Application Status Update",
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
    }
  } catch (error) {
    console.error("Error sending driver application status email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

