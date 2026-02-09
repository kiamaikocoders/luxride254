// Edge Function: Send Support Ticket Created Email
// Triggered when user creates support ticket

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
      ticketSubject,
      ticketCategory,
      expectedResponseTime,
      ticketUrl,
      supportContact,
    } = await req.json();

    if (!userEmail || !ticketNumber) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Support ticket received, ${firstName}! 💬` : "Support ticket received! 💬";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M40 50L60 40L80 50L80 70L60 80L40 70Z" fill="white" opacity="0.9"/>
        <circle cx="50" cy="60" r="3" fill="#3B82F6"/>
        <circle cx="60" cy="60" r="3" fill="#3B82F6"/>
        <circle cx="70" cy="60" r="3" fill="#3B82F6"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #3B82F6;">
        ✅ Support Ticket Created
      </div>
      
      <div class="message">
        Thank you ${userName || "there"} for contacting LuxeRide support! We've received your request and our team will respond shortly.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid #3B82F6;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #3B82F6;">🎫 Ticket Number:</strong> ${ticketNumber}</p>
        ${ticketSubject ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">📋 Subject:</strong> ${ticketSubject}</p>` : ""}
        ${ticketCategory ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">📂 Category:</strong> ${ticketCategory}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">📅 Created:</strong> ${new Date().toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">⏱️ Expected Response:</strong> ${expectedResponseTime || "Within 24 hours"}</p>
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6;">📧 What's Next?</strong><br>
        Our support team is reviewing your ticket and will get back to you as soon as possible. 
        You'll receive an email notification when we respond.
      </div>
      
      ${ticketUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${ticketUrl}" class="cta-button" style="background-color: #3B82F6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          👁️ View Ticket
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #FEF3C7; border-left-color: #F59E0B;">
        <strong style="color: #F59E0B;">🚨 Need Immediate Assistance?</strong> For urgent matters, contact us directly at 
        <a href="mailto:${supportContact || 'support@luxeride.org'}" style="color: #F59E0B; font-weight: 600;">${supportContact || 'support@luxeride.org'}</a> 
        or call our support hotline.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Support Ticket Created - ${ticketNumber}`,
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
    console.error("Error sending support ticket created email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

