// Edge Function: Send Subscription Payment Confirmation Email
// Triggered when subscription payment is successfully processed

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
      transactionId,
      packageType,
      monthlyFee,
      paymentMethod,
      paymentDate,
      subscriptionStartDate,
      subscriptionEndDate,
      ridesIncluded,
      receiptUrl,
    } = await req.json();

    if (!userEmail || !packageType || !monthlyFee) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const packageNames: Record<string, string> = {
      gold: "Gold",
      platinum: "Platinum",
      diamond: "Diamond",
    };

    const packageName = packageNames[packageType.toLowerCase()] || packageType;

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Welcome to ${packageName}, ${firstName}! 🎉` : `Welcome to ${packageName}! 🎉`;
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M60 25L75 50H90L70 65L80 95L60 80L40 95L50 65L30 50H45L60 25Z" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="10" fill="#D4AF37"/>
        <text x="60" y="65" text-anchor="middle" fill="#1A1A1A" font-size="12" font-weight="bold">${packageName.charAt(0)}</text>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #D4AF37; text-align: center;">
        🎊 Subscription Activated!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        Your ${packageName} package is now active! Start enjoying premium transportation right away.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%); border-left: 4px solid #D4AF37;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #D4AF37;">✨ Package:</strong> ${packageName}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">💰 Monthly Fee:</strong> KES ${Number(monthlyFee).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">💳 Payment Method:</strong> ${paymentMethod || "N/A"}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">🔢 Transaction ID:</strong> ${transactionId || "N/A"}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">📅 Payment Date:</strong> ${paymentDate ? new Date(paymentDate).toLocaleString() : new Date().toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">📆 Subscription Start:</strong> ${subscriptionStartDate ? new Date(subscriptionStartDate).toLocaleDateString() : "Today"}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">📆 Subscription End:</strong> ${subscriptionEndDate ? new Date(subscriptionEndDate).toLocaleDateString() : "N/A"}</p>
        <p style="margin: 10px 0;"><strong style="color: #D4AF37;">🚗 Rides Included:</strong> ${ridesIncluded || "N/A"} rides per month</p>
      </div>
      
      <div class="message" style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); padding: 25px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 20px;">🎁 Your ${packageName} Package Includes:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 2;">
          <li style="margin: 10px 0;">${ridesIncluded || "Multiple"} premium rides per month</li>
          ${packageType.toLowerCase() === "platinum" || packageType.toLowerCase() === "diamond" 
            ? "<li style=\"margin: 10px 0;\">👨‍👩‍👧‍👦 Add family members</li>" 
            : ""
          }
          ${packageType.toLowerCase() === "diamond" 
            ? "<li style=\"margin: 10px 0;\">🛡️ Security detail included</li><li style=\"margin: 10px 0;\">👤 Personal account manager</li><li style=\"margin: 10px 0;\">⚡ Priority dispatch</li>" 
            : ""
          }
        </ul>
      </div>
      
      ${receiptUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${receiptUrl}" class="cta-button">
          📄 Download Receipt
        </a>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">🚀 You're All Set!</strong><br>
        You can now start requesting rides through the LuxeRide mobile app. Each ride will be deducted from your monthly allowance.
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💡 Important:</strong> Your subscription will automatically renew monthly. You can manage your subscription settings in the LuxeRide app.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Subscription Activated - ${packageName} Package`,
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
    console.error("Error sending subscription payment confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

