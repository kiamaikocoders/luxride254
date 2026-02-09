// Edge Function: Send Subscription Status Verification Required Email
// Triggered when trip is completed but user's subscription status is unclear or expired

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      adminEmail,
      tripId,
      userId,
      userEmail,
      subscriptionStatus,
      packageType,
      ridesRemaining,
      tripDate,
      adminDashboardUrl,
    } = await req.json();

    if (!adminEmail || !tripId || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const personalizedGreeting = "⚠️ Subscription Verification Required";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="60" r="30" fill="white" opacity="0.9"/>
        <path d="M60 45L60 60L70 70" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="3" fill="#F59E0B"/>
        <path d="M55 75L65 75" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #F59E0B;">
        ⚠️ Subscription Verification Required
      </div>
      
      <div class="message" style="background-color: #FEF3C7; padding: 20px; border-left: 4px solid #F59E0B; border-radius: 8px;">
        A trip was completed but the user's subscription status requires manual verification.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #F59E0B;">🔢 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">👤 User ID:</strong> ${userId}</p>
        ${userEmail ? `<p style="margin: 10px 0;"><strong style="color: #F59E0B;">📧 User Email:</strong> ${userEmail}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">📅 Trip Date:</strong> ${tripDate ? new Date(tripDate).toLocaleString() : "N/A"}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">📊 Subscription Status:</strong> ${subscriptionStatus || "Unknown"}</p>
        ${packageType ? `<p style="margin: 10px 0;"><strong style="color: #F59E0B;">📦 Package Type:</strong> ${packageType}</p>` : ""}
        ${ridesRemaining !== undefined ? `<p style="margin: 10px 0;"><strong style="color: #F59E0B;">🚗 Rides Remaining:</strong> ${ridesRemaining}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 18px;">📋 Action Required:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          <li style="margin: 8px 0;">Verify user's subscription status</li>
          <li style="margin: 8px 0;">Check if subscription is active and valid</li>
          <li style="margin: 8px 0;">Verify ride allowance if applicable</li>
          <li style="margin: 8px 0;">Take appropriate action based on findings</li>
        </ul>
      </div>
      
      ${adminDashboardUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${adminDashboardUrl}" class="cta-button" style="background-color: #F59E0B; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
          🔍 Review in Admin Dashboard
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #FEF3C7; border-left-color: #F59E0B;">
        <strong style="color: #F59E0B;">💡 Note:</strong> This verification ensures proper subscription management and prevents unauthorized ride usage.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: adminEmail,
      subject: `Subscription Verification Required - Trip ${tripId.slice(0, 8).toUpperCase()}`,
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
    console.error("Error sending subscription status verification email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

