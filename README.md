# LuxRide - Premium Ride Subscription Platform

A comprehensive, enterprise-grade ride-sharing platform built with modern web technologies. LuxRide offers a subscription-based model with tiered service packages (Gold, Platinum, Diamond) featuring professional drivers, vehicle fleet management, and a complete admin dashboard for operations.

**Live Demo**: [https://luxerideorg.vercel.app](https://luxerideorg.vercel.app)

---

## 🎯 Overview

LuxRide is a full-stack ride-sharing application designed for urban premium transportation services. The platform includes:

- **User Application**: Premium ride booking with subscription packages
- **Driver Application**: Real-time ride acceptance and management (Mobile - React Native)
- **Admin Dashboard**: Comprehensive operations and fleet management
- **Backend**: Supabase for real-time database and authentication

### Key Features

✅ **Subscription-Based Pricing Model**
- Gold, Platinum, and Diamond packages
- Unlimited ride benefits with included ride quotas
- Monthly billing with ride credit allocation

✅ **Real-Time Operations**
- Live driver tracking and assignment
- Real-time service request updates
- Instant escalation notifications
- Live dispute and cancellation management

✅ **Premium Service Tiers**
- Ride request management with instant driver matching
- Escalation queue for priority issues
- Dispute resolution with ride credit refunds
- Cancellation management with policy-based refunds
- Optional security personnel for Diamond tier

✅ **Complete Admin Control**
- Dashboard with real-time metrics
- User and driver management
- Vehicle fleet tracking
- Analytics and reporting
- Activity logging

---

## 🏗️ Architecture

### Project Structure

```
luxride254/
├── src/                              # Main web application (89.7% TypeScript)
│   ├── components/                   # Reusable React components
│   ├── pages/                        # Page components
│   ├── lib/                          # Utilities and API clients
│   │   └── supabaseClient.ts        # Supabase configuration
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript type definitions
│   └── App.tsx                       # Main application entry
│
├── admin/                            # Admin dashboard system
│   ├── components/                   # Admin-specific components
│   ├── pages/                        # Admin pages (dashboard, users, drivers, etc.)
│   ├── hooks/                        # Admin hooks (authentication, realtime)
│   ├── types.ts                      # Admin type definitions
│   ├── routes.tsx                    # Admin routing configuration
│   └── README.md                     # Admin documentation
│
├── mobile-apps/                      # Mobile applications
│   ├── luxeride-driver-app/         # Driver app (React Native/Expo)
│   └── luxeride-vip-app/            # VIP customer app (React Native/Expo)
│
├── email-templates/                  # Email communication templates
│   ├── confirm-signup.html
│   ├── reset-password.html
│   ├── magic-link.html
│   └── README.md                     # Email template documentation
│
├── public/                           # Static assets
└── package.json                      # Dependencies and scripts

```

### Technology Stack

**Frontend (89.7% TypeScript)**
- **Framework**: React 18.3 with Vite
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom animations
- **State Management**: TanStack React Query
- **Form Handling**: React Hook Form + Zod validation
- **Maps**: Mapbox GL + react-map-gl for location services
- **Data Visualization**: Chart.js + Recharts
- **Animation**: GSAP, Three.js for 3D effects
- **Icons**: Lucide React

**Mobile (React Native)**
- **Framework**: Expo 53
- **Navigation**: React Navigation v6
- **Maps**: React Native Maps
- **Database**: Supabase JS Client

**Backend & Database**
- **Platform**: Supabase (PostgreSQL-based)
- **Authentication**: Supabase Auth with email/magic link support
- **Real-Time**: Supabase Realtime subscriptions
- **Database Language**: PLpgSQL (2.1% of codebase)

**Styling & UI**
- HTML (6.8%)
- CSS (1.2%)
- Tailwind CSS with custom theme

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ with npm
- Git
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kiamaikocoders/luxride254.git
   cd luxride254
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Mapbox Configuration
   VITE_MAPBOX_TOKEN=your_mapbox_token
   
   # API Configuration
   VITE_API_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📱 Platform Components

### Web Application (Main)
User-facing ride booking platform with:
- Account signup and authentication
- Subscription package selection
- Ride request interface with map integration
- Real-time ride tracking
- Ride history and management
- Account settings and profile management

**Access**: `/` (home)

### Admin Dashboard
Operations center for platform management:

**Key Sections:**
- **Dashboard**: Real-time metrics and alerts
- **Service Requests**: Manage ride assignments
- **Escalations**: Priority issue queue
- **Disputes**: Customer dispute resolution
- **Cancellations**: Refund processing
- **Users**: Subscription and account management
- **Drivers**: Driver profiles and status
- **Vehicles**: Fleet management
- **Analytics**: Platform statistics and reporting

**Access**: `/admin/login` → `/admin/dashboard`

**Documentation**: See [admin/README.md](./admin/README.md)

### Mobile Applications

**Driver App** (`mobile-apps/luxeride-driver-app/`)
- Real-time ride notifications
- Ride acceptance/rejection interface
- Navigation and routing
- Earnings tracking
- Performance metrics

**VIP Customer App** (`mobile-apps/luxeride-vip-app/`)
- On-demand ride booking
- Real-time driver tracking
- Rating and feedback system
- Subscription management
- Ride history

**Setup:**
```bash
cd mobile-apps/luxeride-driver-app
npm install
npm start  # or npm run android/ios
```

---

## 🗄️ Database Schema

### Core Tables

**Users & Authentication**
- `users` - User accounts and profiles
- `package_subscriptions` - Subscription tier assignments
- `wallet_transactions` - Ride credit transactions

**Service Management**
- `service_requests` - Ride bookings
- `escalations` - Priority issues
- `disputes` - Customer complaints
- `cancellations` - Cancelled rides

**Fleet Management**
- `drivers` - Driver profiles
- `vehicles` - Vehicle fleet
- `security_personnel` - Security staff (Diamond tier)

**Operations**
- `activity_logs` - Admin action tracking

---

## 🔐 Authentication & Security

- **Email Authentication**: Signup, login, and password recovery
- **Magic Links**: Passwordless authentication option
- **Session Management**: Secure session handling with auto-logout
- **Role-Based Access**: Admin and user role separation
- **Email Templates**: Professional branded email communications

See [email-templates/README.md](./email-templates/README.md) for email template details.

---

## 🎨 Design System

### Brand Colors
- **Primary Gold**: `#D4AF37` - Premium brand color
- **Gold Gradient**: `#D4AF37` → `#F4D03F`
- **Dark Text**: `#1A1A1A`
- **Light Gray**: `#FAFAFA`

### UI Components
Built with shadcn/ui providing:
- Accessible components (WCAG compliant)
- Customizable theming
- Responsive design patterns
- Dark/light mode support

---

## 📡 Real-Time Features

LuxRide uses **Supabase Realtime** for live updates:

- Service requests update instantly when status changes
- Escalations appear in real-time on admin dashboard
- Driver location updates for ride tracking
- Dispute and cancellation notifications
- Vehicle and driver status synchronization

---

## 💳 Subscription Model

### Package Tiers

| Feature | Gold | Platinum | Diamond |
|---------|------|----------|---------|
| Rides/Month | 10 | 25 | 50 |
| Priority Support | - | ✓ | ✓ |
| Driver Quality | Standard | Premium | Premium |
| Security Option | - | - | ✓ |
| Cancellation Refund | 100% before assignment | 100% before assignment | 100% before assignment |

### Refund Policy

- **Before Assignment**: 100% refund, no fee
- **After Assignment**: 80% refund, no fee
- **After Driver Arrival**: 50% refund, KES 500 fee
- **Ride Started**: 0% refund, no fee

Refunds are processed as **ride credits** in the subscription model (not money transfers).

---

## 📊 Admin Features

### Real-Time Dashboard
- Active rides count
- Pending service requests
- Escalations by priority
- Fleet status overview
- User metrics

### Service Request Management
- View all pending requests
- Assign drivers and vehicles
- Assign security personnel (Diamond packages)
- Real-time status tracking
- Automatic matching algorithms

### Escalation Queue
- Priority-based ordering
- Automatic escalation triggers:
  - Dispatch timeout (5 minutes)
  - Payment verification failure
  - Driver timeout (3 minutes)
  - Ride timeout (exceeds duration)
- Resolution tracking with notes

### Dispute Resolution
- Customer complaint review
- Full/partial/no refund options
- Ride credit processing
- Resolution documentation

### Analytics & Reporting
- Ride completion rates
- Fleet utilization
- Driver performance metrics
- Revenue tracking
- User subscription breakdown

---

## 🔧 Development Guide

### Environment Setup

```bash
# Install Node.js dependencies
npm install

# Create environment configuration
cp .env.example .env.local

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Project Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Production build optimization |
| `npm run build:dev` | Development mode build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |

### Folder Structure Guidelines

- **components/**: Reusable, stateless React components
- **pages/**: Full-page components with routing
- **hooks/**: Custom React hooks for logic reuse
- **lib/**: Utility functions and API clients
- **types/**: TypeScript interface definitions
- **admin/**: Admin-specific features (isolated module)
- **email-templates/**: HTML email templates

---

## 📚 Documentation

- **[Admin Dashboard](./admin/README.md)** - Complete admin operations guide
- **[Email Templates](./email-templates/README.md)** - Email communication templates
- **[API Integration](./docs/API.md)** - API endpoints and usage (if available)

---

## 🐛 Troubleshooting

### Supabase Connection Issues
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Ensure Supabase project is active and accessible
- Check network connectivity

### Real-Time Updates Not Working
- Verify Supabase Realtime is enabled
- Check browser console for WebSocket connection errors
- Ensure user is authenticated for real-time subscriptions

### Map Not Displaying
- Verify `VITE_MAPBOX_TOKEN` is set correctly
- Check Mapbox account has active billing
- Ensure map container has height CSS property

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist && npm run build`
- Verify Node.js version: `node --version` (should be 18+)

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Connect repository to Vercel
# Set environment variables in Vercel dashboard:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_MAPBOX_TOKEN

# Deploy
vercel deploy
```

**Live URL**: https://luxerideorg.vercel.app

### Other Platforms

LuxRide can be deployed to:
- Netlify
- GitHub Pages (with routing configuration)
- AWS Amplify
- Google Cloud Platform
- Azure Static Web Apps

---

## 📈 Future Enhancements

- [ ] Advanced analytics with predictive modeling
- [ ] Machine learning for driver-rider matching
- [ ] Bulk operations and CSV exports
- [ ] Enhanced email notification system
- [ ] Driver performance scoring system
- [ ] Revenue analytics and financial reporting
- [ ] Advanced search and filtering
- [ ] User communication tools (in-app chat)
- [ ] Loyalty and rewards program
- [ ] Integration with payment gateways (Stripe, PayPal)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. All rights reserved © LuxRide.

---

## 📞 Support & Contact

For questions, issues, or inquiries about LuxRide:

- **Email**: support@luxerideorg.com
- **GitHub Issues**: [Report an issue](https://github.com/kiamaikocoders/luxride254/issues)
- **Organization**: [kiamaikocoders](https://github.com/kiamaikocoders)

---

## 🏆 Credits

Built using modern web technologies and best practices in full-stack development.

**Tech Stack Contributors:**
- React & Vite communities
- shadcn/ui & Radix UI
- Supabase
- Tailwind CSS
- Expo & React Native

---

**Last Updated**: May 4, 2026
