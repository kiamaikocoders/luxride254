# LuxeRide Admin Dashboard

Complete admin dashboard for managing all platform operations including service requests, escalations, disputes, cancellations, users, drivers, vehicles, and analytics.

## Features

### ✅ Implemented

1. **Authentication & Authorization**
   - Admin login with role verification
   - Protected routes with session management
   - Auto-logout on unauthorized access

2. **Dashboard Overview**
   - Real-time metrics and statistics
   - Recent activity feed
   - Priority alerts
   - Quick access to key sections

3. **Service Requests Management**
   - View all service requests with filters
   - Manual driver and vehicle assignment
   - Security assignment for Diamond packages
   - Real-time updates via Supabase Realtime

4. **Escalation Queue**
   - View all escalations by priority
   - Resolve escalations with notes
   - Track resolution time
   - Automatic escalation creation

5. **Dispute Resolution**
   - Review customer disputes
   - Process refunds (ride credits in subscription model)
   - Full/partial/no refund options
   - Resolution tracking

6. **Cancellation & Refunds**
   - View all cancellations
   - Process refunds based on cancellation policy
   - Track refund status
   - Automatic policy application

7. **User & Subscription Management**
   - View all users
   - See subscription details
   - Track ride usage (rides_used / rides_included)
   - Filter and search users

8. **Driver Management**
   - View all drivers
   - See driver status (online/offline)
   - View ratings and experience
   - Track vehicle assignments

9. **Vehicle Management**
   - View all vehicles
   - Track vehicle status
   - View maintenance records
   - See owner and driver assignments

10. **Analytics & Reporting**
    - Platform statistics
    - Ride status breakdown
    - Fleet status
    - User metrics

## Database Tables

The admin system uses the following database tables:

- `service_requests` - Service requests from users
- `escalations` - Escalated issues
- `disputes` - Customer disputes
- `cancellations` - Cancelled rides
- `wallet_transactions` - Transaction history (for subscription model, tracks ride usage)
- `users` - User accounts
- `drivers` - Driver profiles
- `vehicles` - Vehicle fleet
- `package_subscriptions` - User subscriptions
- `security_personnel` - Security staff
- `activity_logs` - Admin activity tracking

## Architecture

```
admin/
├── components/
│   ├── Layout.tsx          # Main layout with sidebar navigation
│   └── ProtectedRoute.tsx  # Route protection wrapper
├── hooks/
│   ├── useAdminAuth.ts     # Authentication hook
│   └── useRealtime.ts      # Real-time data subscriptions
├── pages/
│   ├── Login.tsx           # Admin login page
│   ├── Dashboard.tsx       # Overview dashboard
│   ├── ServiceRequests.tsx # Service request management
│   ├── Escalations.tsx     # Escalation queue
│   ├── Disputes.tsx        # Dispute resolution
│   ├── Cancellations.tsx   # Cancellation management
│   ├── Users.tsx           # User management
│   ├── Drivers.tsx         # Driver management
│   ├── Vehicles.tsx        # Vehicle management
│   └── Analytics.tsx       # Analytics dashboard
├── types.ts                # TypeScript type definitions
├── config.ts               # Configuration constants
├── utils/
│   └── format.ts           # Formatting utilities
└── routes.tsx              # Route definitions
```

## Usage

### Accessing the Admin Dashboard

1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. Redirected to `/admin/dashboard`

### Routes

- `/admin/login` - Login page
- `/admin/dashboard` - Main dashboard
- `/admin/service-requests` - Service requests management
- `/admin/escalations` - Escalations queue
- `/admin/disputes` - Dispute resolution
- `/admin/cancellations` - Cancellations & refunds
- `/admin/users` - Users & subscriptions
- `/admin/drivers` - Driver management
- `/admin/vehicles` - Vehicle management
- `/admin/analytics` - Analytics & reports

## Key Features

### Subscription Model

This admin dashboard is built for a **subscription-based model** where:
- Users pay monthly for packages (Gold, Platinum, Diamond)
- Packages include a certain number of rides
- No per-ride payment - rides are deducted from subscription
- Refunds are processed as ride credits, not money

### Real-Time Updates

All pages use Supabase Realtime subscriptions for live updates:
- Service requests update automatically
- Escalations appear in real-time
- Disputes and cancellations update live
- Driver and vehicle status updates instantly

### Assignment Workflow

1. Service request is created (status: `pending`)
2. Admin views pending requests
3. Admin selects driver and vehicle
4. System assigns and updates status to `assigned`
5. Driver accepts and status becomes `in_progress`
6. Ride completes and status becomes `completed`
7. Ride count is deducted from user's subscription

### Escalation System

Escalations are automatically created when:
- Dispatch timeout (5 minutes without assignment)
- Payment verification fails
- Driver timeout (doesn't accept within 3 minutes)
- Ride timeout (exceeds expected duration)
- Verification failures

Admin can:
- View escalations by priority
- Resolve with notes
- Track resolution time

### Dispute Resolution

Disputes can be:
- Reviewed with full context
- Resolved with full/partial/no refund
- Processed as ride credits (not money)
- Tracked with resolution notes

### Cancellation Policy

Cancellation refunds follow policy:
- Before assignment: 100% refund, no fee
- After assignment: 80% refund, no fee
- After driver arrived: 50% refund, KES 500 fee
- After ride started: 0% refund, no fee

## Integration

The admin routes are integrated into the main App.tsx:

```tsx
import { AdminRoutes } from "../admin/routes";

<Route path="/admin/*" element={<AdminRoutes />} />
```

## Environment

Uses existing Supabase configuration from `src/lib/supabaseClient.ts`.

## Future Enhancements

- [ ] Advanced analytics with charts and graphs
- [ ] Export functionality (CSV, PDF)
- [ ] Bulk operations
- [ ] Advanced filtering and search
- [ ] Email notifications for escalations
- [ ] Activity log export
- [ ] User communication tools
- [ ] Driver performance metrics
- [ ] Revenue reports (for future monetization)

