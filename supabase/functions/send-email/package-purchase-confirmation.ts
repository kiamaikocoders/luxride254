// Edge Function: Send VIP Package Purchase Confirmation Email
// Triggered when VIP user purchases/activates a package subscription

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "./_shared/email-client.ts";
import { getEmailTemplate } from "./_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      userEmail,
      userName,
      packageType,
      monthlyFee,
      ridesIncluded,
      subscriptionStartDate,
      subscriptionEndDate,
      paymentMethod,
      transactionId,
      receiptUrl,
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

    const packageBenefits: Record<string, string[]> = {
      gold: [
        "20 premium rides per month",
        "Real-time ride tracking",
        "Trip history access",
        "Basic support",
      ],
      platinum: [
        "40 premium rides per month",
        "All Gold features",
        "Add up to 3 family members",
        "24/7 concierge service",
      ],
      diamond: [
        "60 premium rides per month",
        "All Platinum features",
        "Unlimited family members",
        "Security detail included",
        "Personal account manager",
        "Priority dispatch",
      ],
    };

    const benefits = packageBenefits[packageType.toLowerCase()] || packageBenefits.gold;

    const content = `
      <div class="greeting">Welcome to LuxeRide ${packageName}!</div>
      
      <div class="message">
        Thank you for choosing LuxeRide ${packageName}! Your subscription has been activated and you're now part of our premium transportation community.
      </div>
      
      <div class="info-box">
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Monthly Fee:</strong> KES ${Number(monthlyFee).toLocaleString()}</p>
        <p><strong>Rides Included:</strong> ${ridesIncluded || "N/A"} rides per month</p>
        <p><strong>Subscription Start:</strong> ${subscriptionStartDate ? new Date(subscriptionStartDate).toLocaleDateString() : "Today"}</p>
        <p><strong>Subscription End:</strong> ${subscriptionEndDate ? new Date(subscriptionEndDate).toLocaleDateString() : "N/A"}</p>
        ${paymentMethod ? `<p><strong>Payment Method:</strong> ${paymentMethod}</p>` : ""}
        ${transactionId ? `<p><strong>Transaction ID:</strong> ${transactionId}</p>` : ""}
      </div>
      
      <div class="message">
        <strong>Your ${packageName} Package Benefits:</strong>
        <ul style="margin-top: 10px; padding-left: 20px;">
          ${benefits.map(benefit => `<li>${benefit}</li>`).join('')}
        </ul>
      </div>
      
      ${receiptUrl ? `
      <div style="text-align: center;">
        <a href="${receiptUrl}" class="cta-button">Download Receipt</a>
      </div>
      ` : ""}
      
      <div class="message">
        You can now start requesting rides through the LuxeRide mobile app. Each ride will be deducted from your monthly allowance. 
        Your subscription will automatically renew each month.
      </div>
      
      <div class="note">
        <strong>Getting Started:</strong> Download the LuxeRide mobile app to start requesting rides. 
        If you have any questions, our support team is available 24/7 at 
        <a href="mailto:support@luxeride.com" style="color: #D4AF37;">support@luxeride.com</a>
      </div>
    `;

    const html = getEmailTemplate(content);
    const result = await sendEmail({
      to: userEmail,
      subject: `Welcome to LuxeRide ${packageName}!`,
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
    console.error("Error sending package purchase confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

