// Edge Function: Send VIP Package Upgrade Confirmation Email
// Triggered when VIP user upgrades package

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
      oldPackageType,
      newPackageType,
      upgradePrice,
      newRidesIncluded,
      newBenefits,
      receiptUrl,
    } = await req.json();

    if (!userEmail || !oldPackageType || !newPackageType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const packageNames: Record<string, string> = {
      gold: "Gold",
      platinum: "Platinum",
      diamond: "Diamond",
    };
    const oldPackageName = packageNames[oldPackageType.toLowerCase()] || oldPackageType;
    const newPackageName = packageNames[newPackageType.toLowerCase()] || newPackageType;

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Upgrade confirmed, ${firstName}! 🚀` : "Upgrade confirmed! 🚀";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M40 70L55 55L70 70" stroke="#10b981" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M60 30L60 55" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="8" fill="#10b981"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">
        🎊 Upgrade Confirmed!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        Congratulations! Your subscription has been successfully upgraded from ${oldPackageName} to ${newPackageName}!
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">⬆️ Previous Package:</strong> ${oldPackageName}</p>
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">✨ New Package:</strong> ${newPackageName}</p>
        ${upgradePrice ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">💰 Upgrade Price:</strong> KES ${Number(upgradePrice).toLocaleString()}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #10b981;">🚗 New Rides Included:</strong> ${newRidesIncluded || "N/A"} rides per month</p>
      </div>
      
      ${newBenefits ? `
      <div class="message" style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); padding: 25px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 20px;">🎁 Your New ${newPackageName} Benefits:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 2;">
          ${newBenefits.split('\n').map((benefit: string) => `<li style="margin: 10px 0;">${benefit}</li>`).join('')}
        </ul>
      </div>
      ` : `
      <div class="message" style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); padding: 25px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 20px;">🎁 Your New ${newPackageName} Benefits:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 2;">
          <li style="margin: 10px 0;">${newRidesIncluded || "More"} premium rides per month</li>
          <li style="margin: 10px 0;">All ${oldPackageName} features</li>
          <li style="margin: 10px 0;">Enhanced premium services</li>
        </ul>
      </div>
      `}
      
      ${receiptUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${receiptUrl}" class="cta-button" style="background-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          📄 Download Receipt
        </a>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">✅ Active Now!</strong><br>
        Your upgrade is now active! You can immediately start enjoying all ${newPackageName} package benefits.
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>🙏 Thank You:</strong> We're excited to provide you with an even better premium transportation experience!
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Package Upgraded to ${newPackageName}!`,
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
    console.error("Error sending VIP package upgrade confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

