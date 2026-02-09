// Edge Function: Send Payment Reminder Email (Corporate Accounts)
// Triggered 7 days and 3 days before invoice due date

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      corporateEmail,
      companyName,
      contactName,
      invoiceNumber,
      amountDue,
      dueDate,
      paymentUrl,
      supportContact,
    } = await req.json();

    if (!corporateEmail || !invoiceNumber || !amountDue || !dueDate) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const dueDateObj = new Date(dueDate);
    const daysUntilDue = Math.ceil((dueDateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const urgency = daysUntilDue <= 3 ? "urgent" : "upcoming";

    const firstName = contactName ? contactName.split(' ')[0] : '';
    const personalizedGreeting = urgency
      ? (firstName ? `Urgent payment reminder, ${firstName}! ⚠️` : "Urgent payment reminder! ⚠️")
      : (firstName ? `Payment reminder, ${firstName} 💰` : "Payment reminder 💰");
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="60" r="30" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="25" stroke="${urgency ? "#EF4444" : "#F59E0B"}" stroke-width="3" fill="none"/>
        <path d="M60 45L60 60L70 70" stroke="${urgency ? "#EF4444" : "#F59E0B"}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="3" fill="${urgency ? "#EF4444" : "#F59E0B"}"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: ${urgency ? "#EF4444" : "#F59E0B"};">
        ${urgency ? "⚠️" : "💰"} Payment Reminder
      </div>
      
      <div class="message">
        This is a friendly reminder that your invoice payment is ${urgency === "urgent" ? "due soon" : "approaching"}.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, ${urgency ? "#FEF2F2" : "#FEF3C7"} 0%, ${urgency ? "#FEE2E2" : "#FDE68A"} 100%); border-left: 4px solid ${urgency ? "#EF4444" : "#F59E0B"};">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: ${urgency ? "#EF4444" : "#F59E0B"};">💵 Amount Due:</strong> KES ${Number(amountDue).toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: ${urgency ? "#EF4444" : "#F59E0B"};">📋 Invoice Number:</strong> ${invoiceNumber}</p>
        <p style="margin: 10px 0;"><strong style="color: ${urgency ? "#EF4444" : "#F59E0B"};">📅 Due Date:</strong> ${dueDateObj.toLocaleDateString()}</p>
        <p style="margin: 10px 0;"><strong style="color: ${urgency ? "#EF4444" : "#F59E0B"};">⏱️ Days Remaining:</strong> ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}</p>
      </div>
      
      ${paymentUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${paymentUrl}" class="cta-button" style="background-color: ${urgency ? "#EF4444" : "#F59E0B"}; box-shadow: 0 4px 12px rgba(${urgency ? "239, 68, 68" : "245, 158, 11"}, 0.3);">
          💳 Pay Invoice Now
        </a>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: ${urgency ? "#FEF2F2" : "#FEF3C7"}; padding: 20px; border-radius: 8px; border-left: 4px solid ${urgency ? "#EF4444" : "#F59E0B"};">
        <strong style="color: ${urgency ? "#EF4444" : "#F59E0B"};">
          ${urgency ? "🚨" : "💡"} ${urgency ? "Action Required!" : "Please Pay Soon"}
        </strong><br>
        Please ensure payment is processed before the due date to avoid any service interruptions. 
        ${urgency === "urgent" ? "This is your final reminder before the due date." : ""}
      </div>
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💬 Need Assistance?</strong> Contact your account manager or 
        <a href="mailto:${supportContact || 'corporate@luxeride.org'}" style="color: ${urgency ? "#EF4444" : "#F59E0B"}; font-weight: 600;">${supportContact || 'corporate@luxeride.org'}</a> 
        if you have questions about this invoice.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: corporateEmail,
      subject: `Payment Reminder: Invoice ${invoiceNumber} - ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'} remaining`,
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
    console.error("Error sending corporate payment reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

