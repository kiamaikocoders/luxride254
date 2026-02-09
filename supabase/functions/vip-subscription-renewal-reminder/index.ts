// Edge Function: Send VIP Subscription Renewal Reminder Email
// Triggered 7 days and 3 days before subscription expires

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
      ridesRemaining,
      renewalUrl,
      upgradeOptions,
    } = await req.json();

    if (!userEmail || !packageType || !expirationDate) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const expDate = new Date(expirationDate);
    const daysUntilExpiry = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const urgency = daysUntilExpiry <= 3 ? "urgent" : "upcoming";

    const packageNames: Record<string, string> = {
      gold: "Gold",
      platinum: "Platinum",
      diamond: "Diamond",
    };
    const packageName = packageNames[packageType.toLowerCase()] || packageType;

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = urgency === "urgent" 
      ? (firstName ? `Urgent: Renew your subscription, ${firstName}! ⚠️` : "Urgent: Renew your subscription! ⚠️")
      : (firstName ? `Renewal reminder, ${firstName} ⏰` : "Renewal reminder ⏰");
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="60" r="30" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="25" stroke="${urgency === "urgent" ? "#EF4444" : "#F59E0B"}" stroke-width="3" fill="none"/>
        <path d="M60 45L60 60L70 70" stroke="${urgency === "urgent" ? "#EF4444" : "#F59E0B"}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="3" fill="${urgency === "urgent" ? "#EF4444" : "#F59E0B"}"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: ${urgency === "urgent" ? "#EF4444" : "#F59E0B"};">
        ${urgency === "urgent" ? "⚠️" : "⏰"} Renewal Reminder
      </div>
      
      <div class="message">
        This is a friendly reminder that your ${packageName} package subscription ${urgency === "urgent" ? "expires soon" : "is approaching expiration"}.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, ${urgency === "urgent" ? "#FEF2F2" : "#FEF3C7"} 0%, ${urgency === "urgent" ? "#FEE2E2" : "#FDE68A"} 100%); border-left: 4px solid ${urgency === "urgent" ? "#EF4444" : "#F59E0B"};">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: ${urgency === "urgent" ? "#EF4444" : "#F59E0B"};">📦 Package:</strong> ${packageName}</p>
        <p style="margin: 10px 0;"><strong style="color: ${urgency === "urgent" ? "#EF4444" : "#F59E0B"};">📅 Expiration Date:</strong> ${expDate.toLocaleDateString()}</p>
        <p style="margin: 10px 0;"><strong style="color: ${urgency === "urgent" ? "#EF4444" : "#F59E0B"};">⏱️ Days Remaining:</strong> ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}</p>
        ${ridesRemaining !== undefined ? `<p style="margin: 10px 0;"><strong style="color: ${urgency === "urgent" ? "#EF4444" : "#F59E0B"};">🚗 Rides Remaining:</strong> ${ridesRemaining} ride${ridesRemaining === 1 ? '' : 's'}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: ${urgency === "urgent" ? "#FEF2F2" : "#FEF3C7"}; padding: 20px; border-radius: 8px; border-left: 4px solid ${urgency === "urgent" ? "#EF4444" : "#F59E0B"};">
        <strong style="color: ${urgency === "urgent" ? "#EF4444" : "#F59E0B"};">${urgency === "urgent" ? "🚨" : "💡"} ${urgency === "urgent" ? "Action Required!" : "Don't Miss Out!"}</strong><br>
        ${urgency === "urgent" 
          ? "Renew now to avoid service interruption. Your subscription will expire in just a few days!"
          : "Renew your subscription to continue enjoying premium transportation services without interruption."
        }
      </div>
      
      ${renewalUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${renewalUrl}" class="cta-button" style="background-color: ${urgency === "urgent" ? "#EF4444" : "#F59E0B"}; box-shadow: 0 4px 12px rgba(${urgency === "urgent" ? "239, 68, 68" : "245, 158, 11"}, 0.3);">
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
        <strong>💡 Note:</strong> If your subscription expires, you won't be able to request rides until you renew. 
        Renew now to maintain uninterrupted service.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `${urgency === "urgent" ? "Urgent: " : ""}Renew Your ${packageName} Subscription - ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'} remaining`,
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
    console.error("Error sending VIP subscription renewal reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

