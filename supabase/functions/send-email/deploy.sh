#!/bin/bash
# Deployment script for LuxeRide email edge functions
# Run from project root: ./supabase/functions/send-email/deploy.sh
# Make sure you're logged into Supabase CLI: supabase login

echo "🚀 Deploying LuxeRide Email Edge Functions..."

# Navigate to project root
cd "$(dirname "$0")/../../.." || exit

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first."
    exit 1
fi

# Deploy each function (functions are in send-email subdirectory)
echo "📧 Deploying send-email/ride-request-confirmation..."
supabase functions deploy send-email/ride-request-confirmation --no-verify-jwt

echo "📧 Deploying send-email/driver-assigned..."
supabase functions deploy send-email/driver-assigned --no-verify-jwt

echo "📧 Deploying send-email/trip-completion-receipt..."
supabase functions deploy send-email/trip-completion-receipt --no-verify-jwt

echo "📧 Deploying send-email/subscription-payment-confirmation..."
supabase functions deploy send-email/subscription-payment-confirmation --no-verify-jwt

echo "📧 Deploying send-email/subscription-payment-failed..."
supabase functions deploy send-email/subscription-payment-failed --no-verify-jwt

echo "📧 Deploying send-email/driver-application-status..."
supabase functions deploy send-email/driver-application-status --no-verify-jwt

echo "📧 Deploying send-email/package-purchase-confirmation..."
supabase functions deploy send-email/package-purchase-confirmation --no-verify-jwt

echo "✅ All email functions deployed successfully!"
echo ""
echo "⚠️  Don't forget to set environment variables in Supabase dashboard:"
echo "   - RESEND_API_KEY"
echo "   - FROM_EMAIL"

