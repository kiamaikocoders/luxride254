// Edge Function: Send Trip Completion Receipt Email
// Triggered when a trip is marked as completed

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
      tripDate,
      pickupLocation,
      dropoffLocation,
      distance,
      duration,
      driverName,
      vehicleDetails,
      ridesUsed,
      ridesRemaining,
      packageType,
      feedbackUrl,
    } = await req.json();

    if (!userEmail || !tripId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Format duration (convert minutes to HH:MM:SS format if needed)
    const formatDuration = (mins: number | undefined) => {
      if (!mins) return "N/A";
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
      const seconds = 0;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const tripDateFormatted = tripDate ? new Date(tripDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const pickupTime = tripDate ? new Date(tripDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "";
    const dropoffTime = duration && tripDate ? new Date(new Date(tripDate).getTime() + duration * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "";

    // Generate map URL (using Google Maps Static API format)
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&maptype=roadmap&markers=color:green|label:P|${encodeURIComponent(pickupLocation || '')}&markers=color:purple|label:D|${encodeURIComponent(dropoffLocation || '')}&path=color:0x0000ff|weight:5|${encodeURIComponent(pickupLocation || '')}|${encodeURIComponent(dropoffLocation || '')}&key=YOUR_API_KEY`;

    const content = `
      <div class="message">
        <strong>Ride details</strong>
      </div>
      
      <div style="font-size: 14px; color: #666666; margin-bottom: 20px;">
        ${tripDateFormatted}
      </div>
      
      ${pickupLocation && dropoffLocation ? `
      <div class="map-container">
        <img src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-l+10b981(${encodeURIComponent(pickupLocation)})/pin-s-l+8B5CF6(${encodeURIComponent(dropoffLocation)})/${encodeURIComponent(pickupLocation)}/${encodeURIComponent(dropoffLocation)}/600x300@2x?access_token=pk.eyJ1IjoibHV4ZXJpZGUiLCJhIjoiY2x4ZXJpZGUifQ.example" 
             alt="Route Map" 
             style="width: 100%; height: 200px; object-fit: cover; background-color: #E6E6E6;" />
      </div>
      ` : ""}
      
      <div style="margin: 25px 0;">
        <div class="location-row">
          <div class="location-icon pickup">
            <span style="color: white; font-size: 12px;">P</span>
          </div>
          <div class="location-details">
            <div class="location-name">${pickupLocation || "Pickup location"}</div>
            ${pickupTime ? `<div class="location-time">${pickupTime}</div>` : ""}
          </div>
        </div>
        
        <div class="location-row">
          <div class="location-icon dropoff">
            <span style="color: white; font-size: 12px;">D</span>
          </div>
          <div class="location-details">
            <div class="location-name">${dropoffLocation || "Dropoff location"}</div>
            ${dropoffTime ? `<div class="location-time">${dropoffTime}</div>` : ""}
          </div>
        </div>
      </div>
      
      ${driverName ? `
      <div style="margin: 20px 0;">
        <div style="font-size: 14px; color: #666666; margin-bottom: 5px;">Your driver</div>
        <div style="font-size: 18px; font-weight: 600; color: #1A1A1A;">${driverName}</div>
      </div>
      ` : ""}
      
      ${(duration || distance) ? `
      <div class="ride-summary">
        <div class="ride-summary-icon">🚗</div>
        <div class="ride-summary-text">
          <div class="ride-summary-title">Trip Summary</div>
          <div class="ride-summary-value">
            ${duration ? formatDuration(duration) : ""}${duration && distance ? " • " : ""}${distance ? `${distance} km` : ""}
          </div>
        </div>
      </div>
      ` : ""}
      
      <div class="action-links">
        <a href="${feedbackUrl || 'https://luxeride.org/feedback'}" class="action-link">Download PDF invoice</a>
        <a href="https://luxeride.org/support" class="action-link">Contact support</a>
      </div>
      
      <div class="safety-section">
        <div class="safety-title">Your safety is our priority</div>
        <div class="safety-text">
          We're committed to improving your ride experience and are always looking for ways to ensure you're as safe as possible while riding with us.
        </div>
        <a href="https://luxeride.org/safety" class="safety-link">Learn more →</a>
        <div class="safety-illustration">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="50" fill="#FFD700" opacity="0.2"/>
            <path d="M60 30L70 50H85L75 65L80 85L60 75L40 85L45 65L35 50H50L60 30Z" fill="#D4AF37"/>
          </svg>
        </div>
      </div>
      
      ${ridesRemaining !== undefined ? `
      <div class="info-box">
        <strong>Subscription Status:</strong> This ride has been deducted from your monthly ${packageType ? packageType.charAt(0).toUpperCase() + packageType.slice(1) : ''} subscription allowance.
        ${ridesRemaining > 0 
          ? `<br><br>You have <strong>${ridesRemaining} ride${ridesRemaining === 1 ? '' : 's'}</strong> remaining this month.`
          : ridesRemaining === 0 
          ? `<br><br>You've used all your rides for this month. Renew your subscription to continue enjoying our services.`
          : ""
        }
      </div>
      ` : ""}
      
      <div class="disclaimer-box">
        Not sure why you received this email? This is an automated email. If you need help, please <a href="https://luxeride.org/support">contact support here</a> instead of replying to this email.
      </div>
    `;

    const personalizedGreeting = userName ? `Thanks for riding with us, ${userName.split(' ')[0]}!` : "Thanks for riding with us!";

    const html = getEmailTemplate(content, {
      personalizedGreeting: personalizedGreeting,
      headerEmoji: "🎊",
      headerColor: "#10b981"
    });
    const result = await sendEmail({
      to: userEmail,
      subject: `Trip Receipt - ${tripId.slice(0, 8).toUpperCase()}`,
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
    console.error("Error sending trip completion receipt:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

