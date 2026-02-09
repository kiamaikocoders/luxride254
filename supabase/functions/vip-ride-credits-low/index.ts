// Edge Function: Send VIP Ride Credits Low Warning Email
// Triggered when VIP user has 3 or fewer rides remaining

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
      ridesRemaining,
      topUpUrl,
      upgradeOptions,
      renewalDate,
    } = await req.json();

    if (!userEmail || ridesRemaining === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const urgency = ridesRemaining <= 1;
    const personalizedGreeting = urgency
      ? (firstName ? `Low ride credits, ${firstName}! ⚠️` : "Low ride credits! ⚠️")
      : (firstName ? `Ride credits reminder, ${firstName} 📊` : "Ride credits reminder 📊");
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="40" y="45" width="40" height="30" rx="3" fill="white" opacity="0.9"/>
        <path d="M50 60L60 50L70 60" stroke="${urgency ? "#EF4444" : "#F59E0B"}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="60" cy="50" r="5" fill="${urgency ? "#EF4444" : "#F59E0B"}"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: ${urgency ? "#EF4444" : "#F59E0B"};">
        ${urgency ? "⚠️" : "📊"} Ride Credits Running Low
      </div>
      
      <div class="message">
        This is a friendly reminder that you have ${ridesRemaining} ride${ridesRemaining === 1 ? '' : 's'} remaining in your monthly subscription allowance.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, ${urgency ? "#FEF2F2" : "#FEF3C7"} 0%, ${urgency ? "#FEE2E2" : "#FDE68A"} 100%); border-left: 4px solid ${urgency ? "#EF4444" : "#F59E0B"};">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: ${urgency ? "#EF4444" : "#F59E0B"};">🚗 Rides Remaining:</strong> ${ridesRemaining} ride${ridesRemaining === 1 ? '' : 's'}</p>
        ${renewalDate ? `<p style="margin: 10px 0;"><strong style="color: ${urgency ? "#EF4444" : "#F59E0B"};">📅 Subscription Renews:</strong> ${new Date(renewalDate).toLocaleDateString()}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: ${urgency ? "#FEF2F2" : "#FEF3C7"}; padding: 20px; border-radius: 8px; border-left: 4px solid ${urgency ? "#EF4444" : "#F59E0B"};">
        <strong style="color: ${urgency ? "#EF4444" : "#F59E0B"};">
          ${ridesRemaining === 1 
            ? "🚨 Only 1 Ride Left!"
            : ridesRemaining === 0
            ? "❌ All Rides Used!"
            : "💡 Consider Topping Up"
          }
        </strong><br>
        ${ridesRemaining === 1 
          ? "You have only 1 ride left! Consider topping up or upgrading your package to ensure uninterrupted service."
          : ridesRemaining === 0
          ? "You've used all your rides for this month. Top up or upgrade to continue using LuxeRide services."
          : "Consider topping up your subscription or upgrading your package to get more rides."
        }
      </div>
      
      ${topUpUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${topUpUrl}" class="cta-button" style="background-color: ${urgency ? "#EF4444" : "#F59E0B"}; box-shadow: 0 4px 12px rgba(${urgency ? "239, 68, 68" : "245, 158, 11"}, 0.3);">
          💰 Top Up Rides Now
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
        <strong>💡 Note:</strong> Your ride credits will reset when your subscription renews. 
        ${renewalDate ? `Your next renewal is on ${new Date(renewalDate).toLocaleDateString()}.` : ""}
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Low Ride Credits - ${ridesRemaining} ride${ridesRemaining === 1 ? '' : 's'} remaining`,
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
    console.error("Error sending VIP ride credits low warning:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

