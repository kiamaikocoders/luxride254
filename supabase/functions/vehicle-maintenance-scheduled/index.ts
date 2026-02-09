// Edge Function: Send Vehicle Maintenance Scheduled Email
// Triggered when maintenance is scheduled for a vehicle

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "../_shared/email-client.ts";
import { getEmailTemplate } from "../_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      ownerEmail,
      ownerName,
      vehiclePlate,
      vehicleMake,
      vehicleModel,
      maintenanceType,
      scheduledDate,
      estimatedDuration,
      serviceCenter,
      contactPhone,
    } = await req.json();

    if (!ownerEmail || !vehiclePlate || !scheduledDate) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = ownerName ? ownerName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Maintenance scheduled, ${firstName}! 🔧` : "Maintenance scheduled! 🔧";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="35" y="50" width="50" height="30" rx="3" fill="white" opacity="0.9"/>
        <circle cx="45" cy="85" r="6" fill="white" opacity="0.9"/>
        <circle cx="75" cy="85" r="6" fill="white" opacity="0.9"/>
        <path d="M40 65L50 60L70 60L80 65" stroke="#3B82F6" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="50" r="8" fill="#3B82F6"/>
        <path d="M55 65L60 60L65 65" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 24px; font-weight: 700; margin-bottom: 15px; color: #3B82F6;">
        🔧 Maintenance Scheduled
      </div>
      
      <div class="message">
        Your vehicle has been scheduled for maintenance to ensure optimal performance and safety.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid #3B82F6;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #3B82F6;">🔢 Vehicle Plate:</strong> ${vehiclePlate}</p>
        ${vehicleMake && vehicleModel ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">🚗 Vehicle:</strong> ${vehicleMake} ${vehicleModel}</p>` : ""}
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">🔧 Maintenance Type:</strong> ${maintenanceType || "Routine"}</p>
        <p style="margin: 10px 0;"><strong style="color: #3B82F6;">📅 Scheduled Date:</strong> ${new Date(scheduledDate).toLocaleString()}</p>
        ${estimatedDuration ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">⏱️ Estimated Duration:</strong> ${estimatedDuration}</p>` : ""}
        ${serviceCenter ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">🏢 Service Center:</strong> ${serviceCenter}</p>` : ""}
        ${contactPhone ? `<p style="margin: 10px 0;"><strong style="color: #3B82F6;">📞 Contact:</strong> ${contactPhone}</p>` : ""}
      </div>
      
      <div class="message" style="background-color: #F0F9FF; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6;">📋 What to Expect:</strong><br>
        Your vehicle will be temporarily unavailable during the maintenance period. 
        We'll notify you once maintenance is completed and your vehicle is back in service.
      </div>
      
      <div class="note" style="background-color: #FEF3C7; border-left-color: #F59E0B;">
        <strong style="color: #F59E0B;">⚠️ Important:</strong> Please ensure your vehicle is available at the scheduled time. 
        If you need to reschedule, contact us at least 24 hours in advance.
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: ownerEmail,
      subject: `Maintenance Scheduled - ${vehiclePlate}`,
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
    console.error("Error sending vehicle maintenance scheduled email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

