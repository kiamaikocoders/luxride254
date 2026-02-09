// Edge Function: Send Fraud Alert Notification Email
// Triggered when fraud detection system flags suspicious activity

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
      alertType,
      severity,
      userId,
      transactionId,
      suspiciousActivity,
      adminDashboardUrl,
    } = await req.json();

    if (!adminEmail || !alertType || !severity) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const severityColors: Record<string, string> = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#10b981",
    };
    const severityColor = severityColors[severity.toLowerCase()] || "#999999";

    const personalizedGreeting = `🚨 Fraud Alert - ${severity.toUpperCase()} Severity`;
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M60 30L70 50H85L75 65L80 85L60 75L40 85L45 65L35 50H50L60 30Z" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="8" fill="${severityColor}"/>
        <path d="M55 60L65 60" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: ${severityColor};">
        🚨 Fraud Alert - Action Required
      </div>
      
      <div class="message" style="background-color: ${severityColor}20; padding: 20px; border-left: 4px solid ${severityColor}; border-radius: 8px;">
        <strong style="color: ${severityColor}; font-size: 18px;">Alert Type:</strong> ${alertType}<br>
        <strong style="color: ${severityColor}; font-size: 18px;">Severity:</strong> <span style="color: ${severityColor}; font-weight: bold; font-size: 20px;">${severity.toUpperCase()}</span>
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, ${severityColor}15 0%, ${severityColor}25 100%); border-left: 4px solid ${severityColor};">
        ${userId ? `<p style="margin: 10px 0;"><strong style="color: ${severityColor};">👤 User ID:</strong> ${userId}</p>` : ""}
        ${transactionId ? `<p style="margin: 10px 0;"><strong style="color: ${severityColor};">🔢 Transaction ID:</strong> ${transactionId}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: ${severityColor};">⏰ Alert Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      ${suspiciousActivity ? `
      <div class="message" style="background-color: #FEF2F2; padding: 20px; border-radius: 8px; border-left: 4px solid #EF4444;">
        <strong style="color: #EF4444;">⚠️ Suspicious Activity Detected:</strong><br>
        <div style="margin-top: 10px; line-height: 1.8;">
          ${suspiciousActivity}
        </div>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 18px;">📋 Recommended Actions:</strong>
        <ul style="margin-top: 15px; padding-left: 25px; line-height: 1.8;">
          <li style="margin: 8px 0;">Review the flagged activity in the admin dashboard</li>
          <li style="margin: 8px 0;">Verify user account and transaction details</li>
          <li style="margin: 8px 0;">Take appropriate action based on severity</li>
          <li style="margin: 8px 0;">Document findings for compliance</li>
        </ul>
      </div>
      
      ${adminDashboardUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${adminDashboardUrl}" class="cta-button" style="background-color: ${severityColor}; box-shadow: 0 4px 12px ${severityColor}50;">
          🔍 View in Admin Dashboard
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: ${severityColor}15; border-left-color: ${severityColor};">
        <strong style="color: ${severityColor};">⏰ Urgency:</strong> ${severity === "high" 
          ? "This is a HIGH severity alert. Immediate action is required."
          : severity === "medium"
          ? "This is a MEDIUM severity alert. Review and take action soon."
          : "This is a LOW severity alert. Review when convenient."
        }
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: adminEmail,
      subject: `[${severity.toUpperCase()}] Fraud Alert: ${alertType}`,
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
    console.error("Error sending fraud alert:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

