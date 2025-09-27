#!/bin/bash

echo "🚗 Setting up LuxeRide Mobile Apps..."

# Install dependencies for VIP app
echo "📱 Installing VIP app dependencies..."
cd luxeride-vip-app
npm install
cd ..

# Install dependencies for Driver app
echo "🚙 Installing Driver app dependencies..."
cd luxeride-driver-app
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To run the apps:"
echo "  VIP App:    cd luxeride-vip-app && npm start"
echo "  Driver App: cd luxeride-driver-app && npm start"
echo ""
echo "📋 Environment files are already configured with your Supabase credentials"
echo "🔗 Both apps are connected to your existing VIP platform database"
