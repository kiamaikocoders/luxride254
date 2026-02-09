// Edge Function: Send Driver Application Status Email
// Triggered when driver application is approved or rejected

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { sendEmail } from "./_shared/email-client.ts";
import { getEmailTemplate } from "./_shared/templates.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const {
      driverEmail,
      driverName,
      applicationId,
      status, // "approved" or "rejected"
      rejectionReason,
      onboardingUrl,
      requiredDocuments,
      nextSteps,
    } = await req.json();

    if (!driverEmail || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    if (status.toLowerCase() === "approved") {
      const content = `
        <div class="greeting">Congratulations, ${driverName || "there"}!</div>
        
        <div class="message">
          We're excited to inform you that your driver application has been approved! Welcome to the LuxeRide team.
        </div>
        
        <div class="info-box">
          <p><strong>Application ID:</strong> ${applicationId || "N/A"}</p>
          <p><strong>Status:</strong> Approved</p>
        </div>
        
        <div class="message">
          <strong>Next Steps:</strong>
          <ul style="margin-top: 10px; padding-left: 20px;">
            ${nextSteps ? nextSteps.split('\n').map((step: string) => `<li>${step}</li>`).join('') : `
            <li>Complete your driver profile</li>
            <li>Upload required documents</li>
            <li>Complete onboarding training</li>
            <li>Set up your payment details</li>
            `}
          </ul>
        </div>
        
        ${requiredDocuments ? `
        <div class="message">
          <strong>Required Documents:</strong>
          <ul style="margin-top: 10px; padding-left: 20px;">
            ${requiredDocuments.split('\n').map((doc: string) => `<li>${doc}</li>`).join('')}
          </ul>
        </div>
        ` : ""}
        
        ${onboardingUrl ? `
        <div style="text-align: center;">
          <a href="${onboardingUrl}" class="cta-button">Start Onboarding</a>
        </div>
        ` : ""}
        
        <div class="message">
          Once you complete onboarding, you'll be able to go online and start accepting ride requests. We're here to support you every step of the way.
        </div>
        
        <div class="note">
          <strong>Support:</strong> If you have any questions during onboarding, contact our driver support team at 
          <a href="mailto:drivers@luxeride.com" style="color: #D4AF37;">drivers@luxeride.com</a>
        </div>
      `;

      const html = getEmailTemplate(content);
      const result = await sendEmail({
        to: driverEmail,
        subject: "Driver Application Approved - Welcome to LuxeRide!",
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
    } else {
      // Rejected
      const content = `
        <div class="greeting">Application Update</div>
        
        <div class="message">
          Thank you for your interest in joining LuxeRide. After careful review, we're unable to approve your driver application at this time.
        </div>
        
        <div class="info-box">
          <p><strong>Application ID:</strong> ${applicationId || "N/A"}</p>
          <p><strong>Status:</strong> Not Approved</p>
          ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
        </div>
        
        ${rejectionReason ? `
        <div class="message">
          <strong>Details:</strong><br>
          ${rejectionReason}
        </div>
        ` : ""}
        
        <div class="message">
          We appreciate your interest in LuxeRide. If you believe this decision was made in error, or if your circumstances change, 
          you may submit a new application after 30 days.
        </div>
        
        <div class="note">
          <strong>Questions?</strong> If you have questions about this decision, please contact our support team at 
          <a href="mailto:drivers@luxeride.com" style="color: #D4AF37;">drivers@luxeride.com</a>
        </div>
      `;

      const html = getEmailTemplate(content);
      const result = await sendEmail({
        to: driverEmail,
        subject: "Driver Application Status Update",
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
    }
  } catch (error) {
    console.error("Error sending driver application status email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

