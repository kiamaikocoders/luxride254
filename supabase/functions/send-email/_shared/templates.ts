// Email Templates - Shared template functions
// All templates use LuxeRide brand colors and styling

export function getEmailTemplate(content: string): string {
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
            font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #FAFAFA;
            color: #1A1A1A;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #FFFFFF;
        }
        .email-header {
            background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .logo {
            color: #FFFFFF;
            font-family: 'Montserrat', sans-serif;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }
        .email-body {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1A1A1A;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #1A1A1A;
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
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #C19B2A;
        }
        .info-box {
            background-color: #FAFAFA;
            border-left: 4px solid #D4AF37;
            padding: 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #1A1A1A;
        }
        .info-box strong {
            color: #D4AF37;
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
            color: #999999;
            margin-bottom: 10px;
        }
        .footer-link {
            color: #D4AF37;
            text-decoration: none;
        }
        .note {
            margin-top: 20px;
            padding: 15px;
            background-color: #FAFAFA;
            border-left: 4px solid #D4AF37;
            font-size: 14px;
            color: #999999;
        }
        .trip-details {
            background-color: #FAFAFA;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .trip-details p {
            margin: 8px 0;
            color: #1A1A1A;
        }
        .trip-details strong {
            color: #D4AF37;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <div class="logo">LUXERIDE</div>
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

