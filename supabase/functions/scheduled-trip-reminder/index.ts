// Edge Function: Send Scheduled Trip Reminder Email
// Triggered 24 hours and 2 hours before scheduled trip

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
      tripId,
      pickupTime,
      pickupLocation,
      dropoffLocation,
      vehicleType,
      modifyUrl,
      cancelUrl,
    } = await req.json();

    if (!userEmail || !tripId || !pickupTime) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const pickupDate = new Date(pickupTime);
    const hoursUntil = Math.round((pickupDate.getTime() - Date.now()) / (1000 * 60 * 60));
    const reminderType = hoursUntil <= 2 ? "2 hours" : "24 hours";

    const firstName = userName ? userName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Reminder: Your trip is ${reminderType} away, ${firstName}! ⏰` : `Reminder: Your trip is ${reminderType} away! ⏰`;
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <circle cx="60" cy="60" r="30" fill="white" opacity="0.9"/>
        <circle cx="60" cy="60" r="25" stroke="#F59E0B" stroke-width="3" fill="none"/>
        <path d="M60 45L60 60L70 70" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="60" r="3" fill="#F59E0B"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #F59E0B;">
        ⏰ Trip Reminder
      </div>
      
      <div class="message">
        This is a friendly reminder that you have a scheduled trip ${reminderType} from now.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); border-left: 4px solid #F59E0B;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #F59E0B;">⏰ Pickup Time:</strong> ${pickupDate.toLocaleString()}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">🔢 Trip ID:</strong> ${tripId.slice(0, 8).toUpperCase()}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">📍 Pickup Location:</strong> ${pickupLocation || "TBD"}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">🎯 Dropoff Location:</strong> ${dropoffLocation || "TBD"}</p>
        <p style="margin: 10px 0;"><strong style="color: #F59E0B;">🚗 Vehicle Type:</strong> ${vehicleType || "Premium"}</p>
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6;">📱 What's Next?</strong><br>
        Your driver will be assigned shortly before your scheduled pickup time. You'll receive a notification once your driver is on the way.
      </div>
      
      ${modifyUrl || cancelUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        ${modifyUrl ? `<a href="${modifyUrl}" class="cta-button" style="margin-right: 10px; background-color: #3B82F6;">✏️ Modify Trip</a>` : ""}
        ${cancelUrl ? `<a href="${cancelUrl}" class="cta-button" style="background-color: #EF4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">❌ Cancel Trip</a>` : ""}
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💡 Note:</strong> If you need to modify or cancel this trip, please do so at least 30 minutes before the scheduled pickup time.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Reminder: Scheduled Trip ${pickupDate.toLocaleDateString()}`,
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
    console.error("Error sending scheduled trip reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

