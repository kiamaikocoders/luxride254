// Edge Function: Send Feedback Received Confirmation Email
// Triggered when user submits feedback

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
      feedbackId,
      tripId,
      rating,
      thankYouMessage,
      followUpDate,
    } = await req.json();

    if (!userEmail || !feedbackId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = userName ? userName.split(' ')[0] : '';
    const ratingEmoji = rating >= 4 ? "⭐" : rating >= 3 ? "👍" : "📝";
    const isLowRating = rating <= 2;
    const personalizedGreeting = firstName 
      ? `Thanks for your feedback, ${firstName}! ${rating >= 4 ? "🌟" : "🙏"}` 
      : `Thanks for your feedback! ${rating >= 4 ? "🌟" : "🙏"}`;
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <path d="M60 30C45 30 33 42 33 57C33 72 45 84 60 84C75 84 87 72 87 57C87 42 75 30 60 30Z" fill="white" opacity="0.9"/>
        <path d="M50 55L55 60L70 45" stroke="#D4AF37" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="60" cy="60" r="8" fill="#D4AF37"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: ${rating >= 4 ? '#10b981' : rating >= 3 ? '#F59E0B' : '#EF4444'}; text-align: center;">
        ${rating >= 4 ? '🌟' : rating >= 3 ? '👍' : '💬'} Feedback Received!
      </div>
      
      <div class="message" style="text-align: center;">
        We've received your feedback and truly appreciate you taking the time to share your experience with us.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, ${rating >= 4 ? '#F0FDF4' : rating >= 3 ? '#FEF3C7' : '#FEF2F2'} 0%, ${rating >= 4 ? '#D1FAE5' : rating >= 3 ? '#FDE68A' : '#FEE2E2'} 100%); border-left: 4px solid ${rating >= 4 ? '#10b981' : rating >= 3 ? '#F59E0B' : '#EF4444'};">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: ${rating >= 4 ? '#10b981' : rating >= 3 ? '#F59E0B' : '#EF4444'};">${ratingEmoji} Rating:</strong> ${rating}/5</p>
        <p style="margin: 10px 0;"><strong style="color: ${rating >= 4 ? '#10b981' : rating >= 3 ? '#F59E0B' : '#EF4444'};">📋 Feedback ID:</strong> ${feedbackId.slice(0, 8).toUpperCase()}</p>
        ${tripId ? `<p style="margin: 10px 0;"><strong style="color: ${rating >= 4 ? '#10b981' : rating >= 3 ? '#F59E0B' : '#EF4444'};">🚗 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>` : ""}
      </div>
      
      ${thankYouMessage ? `
      <div class="message" style="background-color: #F9FAFB; padding: 20px; border-radius: 8px;">
        ${thankYouMessage}
      </div>
      ` : `
      <div class="message" style="background-color: #F9FAFB; padding: 20px; border-radius: 8px;">
        Your feedback helps us improve our services and maintain the high standards you expect from LuxeRide.
      </div>
      `}
      
      ${isLowRating && followUpDate ? `
      <div class="note" style="background-color: #FEF3C7; border-left-color: #F59E0B;">
        <strong>📞 Follow-up:</strong> We take your feedback seriously. Our team will review your comments and may reach out to you around ${new Date(followUpDate).toLocaleDateString()} to discuss how we can improve.
      </div>
      ` : ""}
      
      ${rating >= 4 ? `
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">🎉 We're Thrilled!</strong><br>
        Thank you for the amazing rating! We're so glad you enjoyed your LuxeRide experience.
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💡 Your Opinion Matters:</strong> We're committed to providing the best possible experience. 
        Thank you for helping us serve you better!
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Thank You for Your Feedback${rating ? ` - ${rating}/5` : ""}`,
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
    console.error("Error sending feedback received confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

