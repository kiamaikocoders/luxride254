// Email Templates - Shared template functions
// All templates use LuxeRide brand colors and styling
// Enhanced with Bolt-inspired design elements for better visual appeal

export function getEmailTemplate(content: string, options?: {
  personalizedGreeting?: string;
  headerIllustration?: string;
  headerColor?: string; // Primary color for header (default: gold)
  headerEmoji?: string; // Large emoji icon for header
  showMap?: boolean;
  mapUrl?: string;
}): string {
  const personalizedGreeting = options?.personalizedGreeting || "";
  const headerIllustration = options?.headerIllustration || "";
  const headerColor = options?.headerColor || "#D4AF37"; // Default to gold
  const headerEmoji = options?.headerEmoji || "";
  
  // Generate header gradient based on color
  const getHeaderGradient = (color: string) => {
    const gradients: Record<string, string> = {
      "#D4AF37": "linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)", // Gold
      "#10b981": "linear-gradient(135deg, #10b981 0%, #059669 100%)", // Green
      "#3B82F6": "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", // Blue
      "#F59E0B": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", // Orange
      "#EF4444": "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)", // Red
    };
    return gradients[color] || gradients["#D4AF37"];
  };
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LuxeRide</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #F5F5F5;
            color: #1A1A1A;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .email-header {
            background: ${getHeaderGradient(headerColor)};
            padding: 40px 30px 35px;
            text-align: center;
            position: relative;
        }
        .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
        }
        .email-header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -5%;
            width: 150px;
            height: 150px;
            background: rgba(255,255,255,0.08);
            border-radius: 50%;
        }
        .header-emoji {
            font-size: 64px;
            line-height: 1;
            margin-bottom: 15px;
            display: block;
        }
        .logo {
            color: #FFFFFF;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .header-greeting {
            color: #FFFFFF;
            font-size: 24px;
            font-weight: 700;
            margin-top: 15px;
            position: relative;
            z-index: 1;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .header-subtitle {
            color: rgba(255,255,255,0.95);
            font-size: 16px;
            margin-top: 8px;
            position: relative;
            z-index: 1;
        }
        .email-body {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1A1A1A;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #333333;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .cta-button {
            display: inline-block;
            background-color: #D4AF37;
            color: #FFFFFF;
            padding: 16px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: all 0.3s;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        .cta-button:hover {
            background-color: #C19B2A;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
        }
        .info-box {
            background-color: #FFF9E6;
            border-left: 4px solid #D4AF37;
            padding: 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #1A1A1A;
            border-radius: 8px;
        }
        .info-box strong {
            color: #D4AF37;
        }
        .safety-section {
            background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%);
            padding: 30px;
            margin: 30px 0;
            border-radius: 12px;
            text-align: center;
        }
        .safety-title {
            font-size: 24px;
            font-weight: 700;
            color: #1A1A1A;
            margin-bottom: 15px;
        }
        .safety-text {
            font-size: 16px;
            color: #333333;
            line-height: 1.8;
            margin-bottom: 20px;
        }
        .safety-link {
            color: #10b981;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
        }
        .safety-illustration {
            margin: 20px 0;
            text-align: center;
        }
        .alternative-link {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #E6E6E6;
            font-size: 14px;
            color: #999999;
            line-height: 1.8;
        }
        .alternative-link a {
            color: #D4AF37;
            word-break: break-all;
        }
        .email-footer {
            background-color: #FAFAFA;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #E6E6E6;
        }
        .footer-text {
            font-size: 14px;
            color: #666666;
            margin-bottom: 10px;
        }
        .footer-link {
            color: #D4AF37;
            text-decoration: none;
        }
        .note {
            margin-top: 20px;
            padding: 15px;
            background-color: #F9F9F9;
            border-left: 4px solid #D4AF37;
            font-size: 14px;
            color: #666666;
            border-radius: 6px;
        }
        .trip-details {
            background-color: #FAFAFA;
            padding: 25px;
            border-radius: 12px;
            margin: 25px 0;
            border: 1px solid #E6E6E6;
        }
        .trip-details p {
            margin: 10px 0;
            color: #1A1A1A;
            font-size: 15px;
        }
        .trip-details strong {
            color: #D4AF37;
            font-weight: 600;
        }
        .map-container {
            margin: 25px 0;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #E6E6E6;
        }
        .map-container img {
            width: 100%;
            height: auto;
            display: block;
        }
        .ride-summary {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 20px;
            background-color: #FAFAFA;
            border-radius: 8px;
            margin: 20px 0;
        }
        .ride-summary-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
        }
        .ride-summary-text {
            flex: 1;
        }
        .ride-summary-title {
            font-size: 14px;
            color: #666666;
            margin-bottom: 5px;
        }
        .ride-summary-value {
            font-size: 18px;
            font-weight: 600;
            color: #1A1A1A;
        }
        .location-row {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid #E6E6E6;
        }
        .location-row:last-child {
            border-bottom: none;
        }
        .location-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .location-icon.pickup {
            background-color: #10b981;
        }
        .location-icon.dropoff {
            background-color: #8B5CF6;
        }
        .location-details {
            flex: 1;
        }
        .location-name {
            font-size: 16px;
            font-weight: 600;
            color: #1A1A1A;
            margin-bottom: 5px;
        }
        .location-time {
            font-size: 14px;
            color: #666666;
        }
        .action-links {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #E6E6E6;
        }
        .action-link {
            display: inline-block;
            margin-right: 20px;
            color: #D4AF37;
            text-decoration: none;
            font-weight: 600;
            font-size: 15px;
        }
        .action-link:hover {
            text-decoration: underline;
        }
        .disclaimer-box {
            background-color: #FFF9E6;
            padding: 15px;
            border-radius: 8px;
            margin-top: 30px;
            font-size: 13px;
            color: #666666;
            line-height: 1.6;
        }
        .disclaimer-box a {
            color: #10b981;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            ${headerEmoji ? `<div class="header-emoji">${headerEmoji}</div>` : ""}
            <div class="logo">LUXERIDE</div>
            ${personalizedGreeting ? `<div class="header-greeting">${personalizedGreeting}</div>` : ""}
        </div>
        
        <div class="email-body">
            ${content}
        </div>
        
        <div class="email-footer">
            <div class="footer-text">
                <strong>LuxeRide Kenya</strong><br>
                Premium Transportation Services
            </div>
            <div class="footer-text" style="margin-top: 15px;">
                Questions? Contact us at 
                <a href="mailto:support@luxeride.com" class="footer-link">support@luxeride.com</a>
            </div>
            <div class="footer-text" style="margin-top: 15px; font-size: 12px;">
                © 2024 LuxeRide. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
  `.trim();
}

