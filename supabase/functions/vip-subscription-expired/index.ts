// Edge Function: Send VIP Subscription Expired Email
// Triggered when VIP subscription expires

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      userEmail,
      userName,
      packageType,
      expirationDate,
      renewalUrl,
      upgradeOptions,
      supportContact,
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

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Your subscription has expired, ${firstName} ⏰` : "Your subscription has expired ⏰";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="60" r="30" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="25" stroke="#EF4444" stroke-width="3" fill="none"/>
        <path d="M60 45L60 60L70 70" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="3" fill="#EF4444"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #EF4444;">
        ⏰ Subscription Expired
      </div>
      
      <div class="message">
        Your ${packageName} package subscription has expired. To continue enjoying LuxeRide services, please renew your subscription.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%); border-left: 4px solid #EF4444;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #EF4444;">📦 Package:</strong> ${packageName}</p>
        <p style="margin: 10px 0;"><strong style="color: #EF4444;">📅 Expiration Date:</strong> ${expirationDate ? new Date(expirationDate).toLocaleDateString() : "Recently"}</p>
        <p style="margin: 10px 0;"><strong style="color: #EF4444;">❌ Status:</strong> Expired</p>
      </div>
      
      <div class="message" style="background-color: #FEF2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #EF4444;">
        <strong style="color: #EF4444;">⚠️ Service Unavailable</strong><br>
        Your subscription benefits are currently unavailable. Renew now to restore access to premium transportation services.
      </div>
      
      ${renewalUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${renewalUrl}" class="cta-button" style="background-color: #EF4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
          🔄 Renew Subscription Now
        </a>
      </div>
      ` : ""}
      
      ${upgradeOptions ? `
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6;">🚀 Upgrade Options:</strong><br>
        ${upgradeOptions}
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💬 Need Help?</strong> Contact our support team at 
        <a href="mailto:${supportContact || 'support@luxeride.org'}" style="color: #EF4444; font-weight: 600;">${supportContact || 'support@luxeride.org'}</a> 
        if you have questions about renewing your subscription.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Your ${packageName} Subscription Has Expired`,
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
    console.error("Error sending VIP subscription expired email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

