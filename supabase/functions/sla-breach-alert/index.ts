// Edge Function: Send SLA Breach Alert Email
// Triggered when SLA is breached (e.g., driver assignment delay)

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
      slaRequirement,
      actualTime,
      breachDuration,
      impact,
      adminDashboardUrl,
    } = await req.json();

    if (!adminEmail || !tripId || !slaRequirement) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const personalizedGreeting = "⚠️ SLA Breach Alert";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M60 30L70 50H85L75 65L80 85L60 75L40 85L45 65L35 50H50L60 30Z" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="8" fill="#F59E0B"/>
        <path d="M55 60L65 60" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #F59E0B;">
        ⚠️ SLA Breach Alert
      </div>
      
      <div class="message" style="background-color: #FEF3C7; padding: 20px; border-left: 4px solid #F59E0B; border-radius: 8px;">
        A service level agreement (SLA) breach has been detected for trip ${tripId.slice(0, 8).toUpperCase()}.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #F59E0B;">🔢 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">📋 SLA Requirement:</strong> ${slaRequirement}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">⏰ Actual Time:</strong> ${actualTime || "N/A"}</p>
        ${breachDuration ? `<p style="margin: 10px 0;"><strong style="color: #F59E0B;">⏱️ Breach Duration:</strong> ${breachDuration}</p>` : ""}
        ${impact ? `<p style="margin: 10px 0;"><strong style="color: #F59E0B;">📊 Impact:</strong> ${impact}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 18px;">📋 Recommended Actions:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          <li style="margin: 8px 0;">Review trip details and assignment timeline</li>
          <li style="margin: 8px 0;">Identify root cause of the delay</li>
          <li style="margin: 8px 0;">Take corrective action if needed</li>
          <li style="margin: 8px 0;">Document breach for reporting</li>
        </ul>
      </div>
      
      ${adminDashboardUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${adminDashboardUrl}" class="cta-button" style="background-color: #F59E0B; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
          🔍 View Trip Details
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #FEF3C7; border-left-color: #F59E0B;">
        <strong style="color: #F59E0B;">💡 Note:</strong> SLA breaches may impact customer satisfaction and service quality. 
        Review and address promptly to maintain service standards.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: adminEmail,
      subject: `SLA Breach Alert - Trip ${tripId.slice(0, 8).toUpperCase()}`,
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
    console.error("Error sending SLA breach alert:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

