// Edge Function: Send Support Ticket Response Email
// Triggered when admin responds to support ticket

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
      ticketNumber,
      responseMessage,
      respondedBy,
      responseDate,
      ticketUrl,
    } = await req.json();

    if (!userEmail || !ticketNumber || !responseMessage) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `We've responded to your ticket, ${firstName}! 💬` : "We've responded to your ticket! 💬";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M40 50L60 40L80 50L80 70L60 80L40 70Z" fill="white" opacity="0.9"/>
        <path d="M50 60L55 65L70 50" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #10b981;">
        ✅ Response Received!
      </div>
      
      <div class="message">
        We've responded to your support ticket. Please review our response below.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">🎫 Ticket Number:</strong> ${ticketNumber}</p>
        ${respondedBy ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">👤 Responded By:</strong> ${respondedBy}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📅 Response Date:</strong> ${responseDate ? new Date(responseDate).toLocaleString() : new Date().toLocaleString()}</p>
      </div>
      
      <div class="message" style="background-color: #F9FAFB; padding: 25px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6; font-size: 18px;">📝 Our Response:</strong><br><br>
        <div style="line-height: 1.8; color: #333333;">
          ${responseMessage}
        </div>
      </div>
      
      ${ticketUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${ticketUrl}" class="cta-button" style="background-color: #3B82F6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          💬 View Full Conversation
        </a>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6;">💡 Need More Help?</strong><br>
        If you have any follow-up questions or need further assistance, please reply to this ticket or contact our support team.
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>👍 Was this helpful?</strong> Let us know if your issue has been resolved or if you need additional support.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Response to Ticket ${ticketNumber}`,
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
    console.error("Error sending support ticket response email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

