// Edge Function: Send Vehicle Maintenance Completed Email
// Triggered when vehicle maintenance is completed

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
      maintenanceType,
      completionDate,
      serviceDetails,
      nextMaintenanceDate,
      invoiceUrl,
    } = await req.json();

    if (!ownerEmail || !vehiclePlate || !completionDate) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const firstName = ownerName ? ownerName.split(' ')[0] : '';
    const personalizedGreeting = firstName ? `Maintenance completed, ${firstName}! ✅` : "Maintenance completed! ✅";
    
    const headerIllustration = `
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="55" fill="rgba(255,255,255,0.2)"/>
        <rect x="35" y="50" width="50" height="30" rx="3" fill="white" opacity="0.9"/>
        <circle cx="45" cy="85" r="6" fill="white" opacity="0.9"/>
        <circle cx="75" cy="85" r="6" fill="white" opacity="0.9"/>
        <path d="M40 65L50 60L70 60L80 65" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="50" r="8" fill="#10b981"/>
        <path d="M55 60L58 63L65 56" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    const content = `
      <div class="message" style="font-size: 28px; font-weight: 700; margin-bottom: 20px; color: #10b981; text-align: center;">
        ✅ Maintenance Completed!
      </div>
      
      <div class="message" style="text-align: center; font-size: 18px;">
        Great news! The maintenance for your vehicle has been completed and it's now back in service.
      </div>
      
      <div class="info-box" style="background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%); border-left: 4px solid #10b981;">
        <p style="margin: 10px 0; font-size: 18px;"><strong style="color: #10b981;">🔢 Vehicle Plate:</strong> ${vehiclePlate}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">🔧 Maintenance Type:</strong> ${maintenanceType || "Routine"}</p>
        <p style="margin: 10px 0;"><strong style="color: #10b981;">📅 Completion Date:</strong> ${new Date(completionDate).toLocaleString()}</p>
        ${nextMaintenanceDate ? `<p style="margin: 10px 0;"><strong style="color: #10b981;">📅 Next Maintenance:</strong> ${new Date(nextMaintenanceDate).toLocaleDateString()}</p>` : ""}
      </div>
      
      ${serviceDetails ? `
      <div class="message" style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
        <strong style="color: #3B82F6;">📋 Service Details:</strong><br>
        <div style="margin-top: 10px; line-height: 1.8;">
          ${serviceDetails}
        </div>
      </div>
      ` : ""}
      
      <div class="message" style="background-color: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
        <strong style="color: #10b981;">🚗 Ready for Service!</strong><br>
        Your vehicle is now ready for use and has been restored to active service. You can start receiving ride requests again.
      </div>
      
      ${invoiceUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${invoiceUrl}" class="cta-button" style="background-color: #3B82F6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
          📄 View Maintenance Invoice
        </a>
      </div>
      ` : ""}
      
      <div class="note" style="background-color: #F9FAFB;">
        <strong>💡 Note:</strong> ${nextMaintenanceDate 
          ? `Your next scheduled maintenance is on ${new Date(nextMaintenanceDate).toLocaleDateString()}.`
          : "Regular maintenance helps ensure optimal vehicle performance and safety."
        }
      </div>
    `;

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerIllustration: headerIllustration
    });
    const result = await sendEmail({
      to: ownerEmail,
      subject: `Maintenance Completed - ${vehiclePlate}`,
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
    console.error("Error sending vehicle maintenance completed email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

