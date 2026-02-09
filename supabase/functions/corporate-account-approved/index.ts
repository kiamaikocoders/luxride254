// Edge Function: Send Corporate Account Approved Email
// Triggered when admin approves corporate account

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
      accountManagerName,
      accountManagerEmail,
      accountManagerPhone,
      applicationId,
      corporatePortalUrl,
      billingTerms,
      supportContact,
    } = await req.json();

    if (!corporateEmail || !companyName || !applicationId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const personalizedGreeting = `Welcome to LuxeRide Corporate, ${companyName}! 🏢`;
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="35" y="40" width="50" height="50" rx="3" fill="white" opacity="0.9"/>
        <rect x="40" y="50" width="15" height="10" fill="#3B82F6"/>
        <rect x="60" y="50" width="20" height="10" fill="#3B82F6"/>
        <rect x="40" y="65" width="40" height="5" fill="#3B82F6"/>
        <rect x="40" y="75" width="30" height="5" fill="#3B82F6"/>
        <circle cx="60" cy="45" r="5" fill="#10b981"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #3B82F6; text-align: center;">
        🎊 Corporate Account Approved!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        We're excited to inform you that your corporate account application has been approved! Your company is now set up to enjoy premium transportation services.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid #3B82F6;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #3B82F6;">✅ Status:</strong> Active</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">🏢 Company:</strong> ${companyName}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">📋 Application ID:</strong> ${applicationId}</p>
        ${accountManagerName ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">👤 Account Manager:</strong> ${accountManagerName}</p>` : ""}
        ${accountManagerEmail ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">📧 Email:</strong> ${accountManagerEmail}</p>` : ""}
        ${accountManagerPhone ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">📞 Phone:</strong> ${accountManagerPhone}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">💰 Billing Terms:</strong> ${billingTerms || "Monthly invoices, 14-30 day payment terms"}</p>
      </div>
      
      <div class="message" style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); padding: 25px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 20px;">🎁 Your Corporate Account Includes:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 2;">
          <li style="margin: 10px 0;">👤 Dedicated account manager</li>
          <li style="margin: 10px 0;">📄 Monthly consolidated invoicing</li>
          <li style="margin: 10px 0;">👥 Team booking management</li>
          <li style="margin: 10px 0;">⚡ Priority dispatch</li>
          <li style="margin: 10px 0;">🕐 24/7 corporate support</li>
        </ul>
      </div>
      
      ${corporatePortalUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${corporatePortalUrl}" class="cta-button" style="background-color: #3B82F6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          🏢 Access Corporate Portal
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F0FDF4; border-left-color: #10b981;">
        <strong style="color: #10b981;">🚀 Getting Started:</strong> Your account manager will contact you shortly to help set up your team and answer any questions. 
        For immediate assistance, contact <a href="mailto:${supportContact || 'corporate@luxeride.org'}" style="color: #3B82F6; font-weight: 600;">${supportContact || 'corporate@luxeride.org'}</a>
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: corporateEmail,
      subject: `Corporate Account Approved - Welcome ${companyName}!`,
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
    console.error("Error sending corporate account approved email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

