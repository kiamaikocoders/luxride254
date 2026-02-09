// Edge Function: Send Subscription Payment Confirmation Email
// Triggered when subscription payment is successfully processed

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

    const content = `
      <div class="greeting">Welcome to LuxeRide ${packageName}!</div>
      
      <div class="message">
        Your subscription payment has been successfully processed. Your ${packageName} package is now active!
      </div>
      
      <div class="info-box">
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Monthly Fee:</strong> KES ${Number(monthlyFee).toLocaleString()}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod || "N/A"}</p>
        <p><strong>Transaction ID:</strong> ${transactionId || "N/A"}</p>
        <p><strong>Payment Date:</strong> ${paymentDate ? new Date(paymentDate).toLocaleString() : new Date().toLocaleString()}</p>
        <p><strong>Subscription Start:</strong> ${subscriptionStartDate ? new Date(subscriptionStartDate).toLocaleDateString() : "Today"}</p>
        <p><strong>Subscription End:</strong> ${subscriptionEndDate ? new Date(subscriptionEndDate).toLocaleDateString() : "N/A"}</p>
        <p><strong>Rides Included:</strong> ${ridesIncluded || "N/A"} rides per month</p>
      </div>
      
      <div class="message">
        <strong>Your ${packageName} Package Includes:</strong>
        <ul style="margin-top: 10px; padding-left: 20px;">
          <li>${ridesIncluded || "Multiple"} premium rides per month</li>
          ${packageType.toLowerCase() === "platinum" || packageType.toLowerCase() === "diamond" 
            ? "<li>Add family members</li>" 
            : ""
          }
          ${packageType.toLowerCase() === "diamond" 
            ? "<li>Security detail included</li><li>Personal account manager</li><li>Priority dispatch</li>" 
            : ""
          }
        </ul>
      </div>
      
      ${receiptUrl ? `
      <div style="text-align: center;">
        <a href="${receiptUrl}" class="cta-button">Download Receipt</a>
      </div>
      ` : ""}
      
      <div class="message">
        You can now start requesting rides through the LuxeRide mobile app. Each ride will be deducted from your monthly allowance.
      </div>
      
      <div class="note">
        <strong>Important:</strong> Your subscription will automatically renew monthly. You can manage your subscription settings in the LuxeRide app.
      </div>
    `;

    const html = getEmailTemplate(content);
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

