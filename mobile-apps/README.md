# 🚗 LuxeRide Mobile Apps

This directory contains the mobile applications for the LuxeRide VIP concierge platform.

## 📱 Apps Overview

### **LuxeRide VIP App** (`luxeride-vip-app/`)
- **Purpose**: Client app for VIP users
- **Features**: Package management, ride requests, family management, trip tracking
- **Target Users**: VIP subscribers with active packages

### **LuxeRide Driver App** (`luxeride-driver-app/`)
- **Purpose**: Simplified driver interface
- **Features**: Navigation, trip management, location tracking
- **Target Users**: Professional drivers

### **Shared Configuration** (`shared-config/`)
- **Purpose**: Common utilities, types, and configurations
- **Contents**: Supabase client, database types, authentication, constants

---

## 🚀 Quick Setup

### **Prerequisites**
- Node.js 18+ and npm
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (for iOS development) or Android Studio (for Android)
- Supabase project with VIP platform database

### **1. Install Dependencies**

```bash
# VIP App
cd luxeride-vip-app
npm install

# Driver App  
cd ../luxeride-driver-app
npm install
```

### **2. Configure Environment**

Create `.env` files in both app directories:

```bash
# luxeride-vip-app/.env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# luxeride-driver-app/.env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### **3. Update Supabase Configuration**

Edit the shared configuration files:
- `shared-config/supabase.ts` - Update with your Supabase URL and keys
- `shared-config/types.ts` - Ensure database types match your schema

### **4. Run the Apps**

```bash
# VIP App
cd luxeride-vip-app
npm start

# Driver App (in another terminal)
cd luxeride-driver-app  
npm start
```

---

## 🏗️ Architecture

### **Shared Backend Integration**
Both mobile apps connect to the same Supabase backend as your VIP web platform:

- **Database**: Same tables (`package_subscriptions`, `service_requests`, etc.)
- **Authentication**: Same user accounts and roles
- **Real-time**: Live updates for trip tracking and notifications

### **App-Specific Features**

#### **VIP App Features**
- ✅ Package dashboard with ride usage
- ✅ Simple ride request (no pricing)
- ✅ Family member management
- ✅ Trip history and tracking
- ✅ Real-time driver location
- ✅ Profile management

#### **Driver App Features**
- ✅ Online/offline status toggle
- ✅ Current trip navigation
- ✅ Pickup/destination markers
- ✅ Trip status updates
- ✅ Location tracking
- ✅ Simplified interface (no payments)

---

## 🔧 Development

### **Project Structure**
```
mobile-apps/
├── shared-config/           # Common configuration
│   ├── supabase.ts         # Supabase client
│   ├── types.ts            # Database types
│   ├── auth.ts             # Authentication service
│   └── constants.ts        # App constants
├── luxeride-vip-app/       # VIP user app
│   ├── src/
│   │   ├── navigation/     # Tab navigation
│   │   ├── screens/        # App screens
│   │   └── components/     # Reusable components
│   └── App.tsx            # Main app entry
└── luxeride-driver-app/    # Driver app
    ├── src/
    │   ├── navigation/     # Tab navigation
    │   ├── screens/        # App screens
    │   └── components/     # Reusable components
    └── App.tsx            # Main app entry
```

### **Key Technologies**
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** for navigation
- **Supabase** for backend
- **React Native Maps** for mapping
- **Expo Location** for GPS

---

## 📋 Testing Checklist

### **VIP App Testing**
- [ ] Sign in with VIP user account
- [ ] View package dashboard
- [ ] Request a ride
- [ ] View trip history
- [ ] Manage family members
- [ ] Real-time trip tracking

### **Driver App Testing**
- [ ] Sign in with driver account
- [ ] Toggle online/offline status
- [ ] View assigned trips
- [ ] Navigate to pickup/destination
- [ ] Update trip status
- [ ] Location tracking

### **Integration Testing**
- [ ] VIP requests appear in driver app
- [ ] Real-time location updates
- [ ] Trip status synchronization
- [ ] Notification delivery

---

## 🚀 Deployment

### **Development Builds**
```bash
# VIP App
cd luxeride-vip-app
expo build:android
expo build:ios

# Driver App
cd luxeride-driver-app
expo build:android
expo build:ios
```

### **Production Considerations**
- Update environment variables for production
- Configure app store metadata
- Set up push notifications
- Test on physical devices
- Configure app signing certificates

---

## 🔗 Integration with Web Platform

The mobile apps are designed to work seamlessly with your existing VIP web platform:

1. **Same Database**: All data is shared between web and mobile
2. **Same Authentication**: Users can sign in on any platform
3. **Real-time Sync**: Changes appear instantly across all platforms
4. **Unified Experience**: Consistent branding and functionality

---

## 📞 Support

For development questions or issues:
- Check the existing VIP platform code for reference
- Review Supabase documentation for backend integration
- Test with your existing database and user accounts

The mobile apps are built to complement your existing VIP platform, providing native mobile experiences for your VIP clients and drivers.
