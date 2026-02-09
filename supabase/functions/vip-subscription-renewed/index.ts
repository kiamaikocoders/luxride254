// Edge Function: Send VIP Subscription Renewed Email
// Triggered when VIP user renews subscription

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
      newExpirationDate,
      ridesIncluded,
      paymentAmount,
      receiptUrl,
    } = await req.json();

    if (!userEmail || !packageType || !newExpirationDate) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const packageNames: Record<string, string> = {
      gold: "Gold",
      platinum: "Platinum",
      diamond: "Diamond",
    };
    const packageName = packageNames[packageType.toLowerCase()] || packageType;

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Subscription renewed, ${firstName}! 🎉` : "Subscription renewed! 🎉";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M60 25L75 50H90L70 65L80 95L60 80L40 95L50 65L30 50H45L60 25Z" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="8" fill="#10b981"/>
        <path d="M55 60L58 63L65 56" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">
        🎊 Subscription Renewed!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        Your ${packageName} package subscription has been successfully renewed! You can continue enjoying premium transportation services.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">✨ Package:</strong> ${packageName}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📅 New Expiration Date:</strong> ${new Date(newExpirationDate).toLocaleDateString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">🚗 Rides Included:</strong> ${ridesIncluded || "N/A"} rides per month</p>
        ${paymentAmount ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">💰 Payment Amount:</strong> KES ${Number(paymentAmount).toLocaleString()}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">✅ Active & Ready!</strong><br>
        Your subscription is now active and you can request rides immediately. All your ${packageName} package benefits are restored.
      </div>
      
      ${receiptUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${receiptUrl}" class="cta-button" style="background-color: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
          📄 Download Receipt
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>🙏 Thank You:</strong> We appreciate your continued trust in LuxeRide. Enjoy your premium transportation experience!
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Subscription Renewed - ${packageName} Package`,
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
    console.error("Error sending VIP subscription renewed email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

