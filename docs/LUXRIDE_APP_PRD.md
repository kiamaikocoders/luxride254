# LuxRide App — Product Requirements Document (PRD)

**Version:** 1.0  
**Last updated:** March 2025  
**Scope:** Full system behavior, app logic, user flows, subscription models, driver flows, and supporting systems for the LuxRide (LuxeRide) platform and mobile app development.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Subscription Models](#3-subscription-models)
4. [User Flow (VIP / Rider)](#4-user-flow-vip--rider)
5. [Driver Flow](#5-driver-flow)
6. [Admin Dashboard Flow](#6-admin-dashboard-flow)
7. [Other Flows](#7-other-flows)
8. [App-Specific Implementation Notes](#8-app-specific-implementation-notes-for-app-version)
9. [Glossary and Reference](#9-glossary-and-reference)
10. [Document References](#10-document-references)

---

## 1. Executive Summary

LuxRide is a **subscription-based luxury chauffeur platform** (no per-ride payment). Users pay monthly for VIP packages (Gold, Platinum, Diamond) that include a fixed number of rides. The system comprises:

- **Web app** — Marketing, applications (chauffeur, car owner, corporate), sign-in, profile, corporate team management
- **VIP mobile app** — Subscriber dashboard, ride requests, trip history, family members, profile
- **Driver mobile app** — Go online/offline, view assigned trips, map, update trip status, complete rides
- **Admin dashboard** — Service requests, driver/vehicle/security assignment, escalations, disputes, cancellations, users, drivers, vehicles, analytics, finances, applications
- **Backend** — Supabase (Postgres, Auth, Realtime, Edge Functions) for all logic, notifications, and integrations

This PRD describes how the system works end-to-end so the **app version** of LuxRide can be built and aligned with web and admin.

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LUXRIDE PLATFORM                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Web (Vite/React)     │  VIP App (Expo)    │  Driver App (Expo)  │  Admin     │
│  - Landing, sign-in   │  - Dashboard       │  - Map, trips       │  - Ops     │
│  - Applications       │  - Request ride     │  - Online toggle    │  - Assign  │
│  - Corporate/Team     │  - My trips        │  - Status updates   │  - Reports │
│  - Profile, VIP page  │  - Family, Profile │  - Profile          │            │
└───────────┬───────────┴──────────┬─────────┴──────────┬──────────┴─────┬──────┘
            │                      │                    │                │
            └──────────────────────┴────────────────────┴────────────────┘
                                           │
                              ┌────────────▼────────────┐
                              │   SUPABASE BACKEND      │
                              │   - Auth                │
                              │   - Postgres (tables)   │
                              │   - Realtime            │
                              │   - Edge Functions      │
                              │   - Storage             │
                              └─────────────────────────┘
```

### 2.2 Tech Stack

| Layer | Technology |
|-------|------------|
| Web | Vite, React, TypeScript, Tailwind, shadcn-ui, TanStack Query, CopilotKit (chat) |
| VIP App | React Native, Expo, TypeScript, React Navigation, Supabase, React Native Maps, Expo Location |
| Driver App | Same as VIP app (shared `mobile-apps/shared-config`) |
| Admin | React (same repo), protected routes, `useAdminAuth`, Realtime |
| Backend | Supabase: Auth, Postgres, Realtime, Edge Functions (Deno) |
| Env | Web: `VITE_SUPABASE_*`; Mobile: `EXPO_PUBLIC_SUPABASE_*` |

### 2.3 Key Data Entities

- **users** — Auth + role (`user` | `driver` | `admin` | `security`), `corporate_account_id` for corporate users
- **package_subscriptions** — `user_id`, `package_type`, `rides_included`, `rides_used`, `family_members_*`, `security_included`, `status`, dates
- **service_requests** — Ride requests: `user_id`, `subscription_id`, pickup/destination, `request_type`, `status`, `assigned_driver_id`, `assigned_vehicle_id`, `assigned_security_id`
- **trips** — Completed trip record; **trip_tracking** — live location per trip
- **drivers** — `user_id`, `vehicle_id`, `is_online`, `current_location`, rating, etc.
- **vehicles** — `owner_id`, `driver_id`, category, status, maintenance
- **security_personnel** — For Diamond package assignments
- **family_members** — Linked to `subscription_id` (Platinum/Diamond)
- **escalations**, **disputes**, **cancellations** — Ops and refunds (ride credits)

---

## 3. Subscription Models

### 3.1 VIP Package Tiers (Individual)

| Tier | Monthly fee (KES) | Rides/month | Family members | Security | Positioning |
|------|-------------------|-------------|-----------------|----------|-------------|
| **Gold** | 150,000 | 20 | 0 | No | Busy professionals |
| **Platinum** | 300,000 | 40 | Up to 3 | Optional | Families, “Most Popular” |
| **Diamond** | 500,000 | 60 | Unlimited | Included | Executives, account manager |

- **Source of truth (UI):** `src/components/VIPMembershipSection.tsx` — `membershipTiers`.
- **DB:** `package_subscriptions` — `package_type` (`gold` | `platinum` | `diamond`), `monthly_fee`, `rides_included`, `rides_used`, `family_members_allowed`, `family_members_added`, `security_included`, `status` (`active` | `suspended` | `cancelled`), `start_date`, `end_date`.

### 3.2 Corporate Packages

- **Types:** `corporate_gold`, `corporate_platinum`, `corporate_diamond` (in `admin/types.ts` and DB).
- **Difference from individual:** Billing and user management (invoice, payment terms, corporate account admin, team members). Ride logic (rides included, security for Diamond) is the same as individual tiers.
- **Corporate accounts:** `corporate_accounts` table; `users.corporate_account_id`; admin assigns `admin_user_id` for the account.

### 3.3 Subscription Rules (App Logic)

1. **Ride creation (VIP app):**
   - User must have an **active** subscription (`status = 'active'`).
   - Must have **remaining rides:** `rides_used < rides_included`.
   - If no active subscription → show “No Active VIP Package” and concierge contact (current Dashboard behavior).
   - If no rides left → block “Request Service” and show upgrade/contact message.

2. **Ride deduction:**
   - On **trip completion** (e.g. `service_requests.status` → `completed`), backend (or trigger) increments `package_subscriptions.rides_used` for the request’s `subscription_id`.
   - Refunds (disputes/cancellations) are **ride credits** (no cash); admin can restore rides.

3. **Diamond-only behavior:**
   - Admin assigns **security** to a service request (`assigned_security_id`) when appropriate; no change to VIP app UI except optional “Security assigned” in trip details.

4. **Family members:**
   - Platinum: up to 3; Diamond: unlimited. Stored in `family_members` linked to `subscription_id`. App screens (e.g. FamilyScreen) allow add/remove within limit.

---

## 4. User Flow (VIP / Rider)

### 4.1 Entry and Auth

- **Sign up:** Web (`SignUp`, `auth/Register`) or VIP app (`SignUpScreen`, `auth/Register`) → Supabase Auth; create/link `users` row with `role: 'user'` (or `vip_user` if distinguished).
- **Sign in:** Web `SignIn` or VIP app → after login, redirect by role:
  - **Web:** `admin` → `/admin`, `driver` → `/driver-dashboard`, else → `/profile`.
  - **VIP app:** If no session → Sign In screen; after login → main app (Dashboard or Request Ride).

### 4.2 VIP App Navigation and Screens

- **Home / Dashboard** (`DashboardScreen`)
  - If **no active subscription:** Show “No Active VIP Package” + concierge email/phone (e.g. concierge@luxeride.com, +254 700 000 000). No ride request.
  - If **active subscription:** Show package card (tier name, rides remaining, progress bar), Security Detail (yes/no), Family (count if applicable). “Request Ride” CTA. Recent completed trips (e.g. last 3 from `service_requests` where `status = 'completed'`).
- **Request Ride** (`RequestRideScreen`)
  - **Preconditions (enforce in app):** Active subscription and `rides_used < rides_included`. If not met, redirect to Dashboard or show error.
  - **Current state:** Placeholder “Request Service” button; **TODO:** real implementation (pickup/destination, request type, scheduled vs ASAP) → create `service_requests` row with `user_id`, `subscription_id`, `request_type`, `status: 'pending'`.
  - **After submit:** Show confirmation; request appears in “My Trips” as pending until admin assigns driver.
- **My Trips** (`MyTripsScreen`)
  - List user’s `service_requests` (all or by status). Show status: pending → assigned → in_progress → completed (and cancelled). Optional: trip tracking when status is assigned/in_progress (read from `trip_tracking` or driver location).
- **Family** (`FamilyScreen`)
  - List/add/remove `family_members` for current subscription; enforce `family_members_added <= family_members_allowed` (Platinum 3, Diamond unlimited).
- **Profile** (`ProfileScreen`, `Profile`)
  - View/edit profile, settings, about, sign out. Link to upgrade/contact for subscription changes.

### 4.3 Ride Lifecycle (Rider Perspective)

1. **Request** — User submits ride (VIP app or future web). Record: `service_requests` with `status: 'pending'`.
2. **Assigned** — Admin assigns driver (+ vehicle; + security for Diamond). Status → `assigned`. Notifications (e.g. `driver-assigned` edge function) can email/push.
3. **In progress** — Driver confirms pickup → status `in_progress`. Rider can see “Trip in progress” and optionally live tracking.
4. **Completed** — Driver completes trip → status `completed`. Backend deducts one ride from subscription; user gets trip receipt (e.g. `trip-completion-receipt`), “Rides remaining” updates on Dashboard.
5. **Cancelled** — User/driver/admin/system cancels → `cancellations` and refund policy applied (ride credit only); see Section 7.

### 4.4 UI Behavior by Subscription Tier

- **Gold:** Dashboard shows 20 rides, no family section (or 0), no security. Request ride when rides remaining > 0.
- **Platinum:** 40 rides, Family section (max 3), optional security (info only; assignment still admin-driven). Same request/trip flow.
- **Diamond:** 60 rides, Family (unlimited), Security “included” (shown in dashboard); in admin, security is assigned to requests. Optional “Account manager” mention in app copy.
- **No subscription:** Dashboard shows “No Active VIP Package” and contact; no Request Ride. App can still show Profile, About, Sign out.

---

## 5. Driver Flow

### 5.1 Onboarding

- **Apply:** Web `ChauffeurApplication` → form + documents (license, CV, passport, etc.) → `chauffeur_applications` (+ `applications`). Edge: `driver-application-received`.
- **Review:** Admin `Applications` (filter type chauffeur) → approve/reject. Edge: `driver-application-status` (approval/rejection email).
- **Post-approval:** Driver account (user with `role: 'driver'`) can sign in to **Driver app**; `drivers` row linked to `user_id`, optionally `vehicle_id` assigned by admin.

### 5.2 Driver App Screens and Logic

- **Map / Home** (`DriverMapScreen`)
  - **Online/offline:** Toggle updates `drivers.is_online` and `last_updated`. Only when online does admin consider for assignment (convention; assignment remains manual in admin).
  - **Location:** Request foreground location permission; periodically update `drivers.current_location` (e.g. PostGIS point) and `last_updated`.
  - **Current trip:** Load one `service_requests` where `assigned_driver_id = driver.id` and `status` in (`assigned`, `in_progress`). If none, show “No active trip”.
  - **Trip actions:**
    - When status `assigned`: show pickup/destination; button **Confirm pickup** → set `service_requests.status` to `in_progress`.
    - When status `in_progress`: button **Complete trip** → set `status` to `completed`. Backend/trigger then deducts ride from user’s subscription and may send `trip-completion-receipt`.
  - **Map:** Show driver location and optionally pickup/destination markers.
- **Trips list** (`DriverTripsScreen`)
  - List trips (e.g. assigned to this driver), filter by status or date.
- **Profile** (`DriverProfileScreen`)
  - View profile, ratings, sign out.

### 5.3 Driver Assignment (Admin, Not In-App Accept)

- Drivers **do not** “accept” requests in the app. **Admin** assigns driver + vehicle (and for Diamond, security) from Service Requests. Driver app then shows the assigned trip and driver performs status updates (confirm pickup, complete).

### 5.4 Earnings and Payouts

- **Config:** `admin/config.ts` has `paymentSplit` (owner 50%, driver 32%, platform 18%) “for reference, not used in subscription model.” Actual payout logic (e.g. monthly vs per-ride) is per business rules (see BUSINESS_MODEL_CLARIFICATIONS.md).
- **Edge functions:** `payout-notification`, `instant-payout-confirmation` for driver communications.

---

## 6. Admin Dashboard Flow

### 6.1 Access and Routes

- **URL:** `/admin` → redirect to `/admin/login`. After login (admin role), redirect to `/admin/dashboard`.
- **Auth:** Only `users.role === 'admin'` (or admin_users table check); `ProtectedRoute` and `useAdminAuth`.

### 6.2 Main Sections

| Route | Purpose |
|-------|--------|
| Dashboard | Metrics, recent activity, priority alerts, quick links |
| Service Requests | List/filter (all, VIP, scheduled, ASAP); **assign driver + vehicle**; for Diamond, **assign security**; update status (pending → assigned → in_progress → completed / cancelled). Realtime updates. |
| Escalations | View by priority; resolve with notes; track resolution time. Auto-created e.g. on dispatch timeout, payment failure, driver timeout, etc. |
| Disputes | Review disputes; resolve with full/partial/no refund as **ride credits**. |
| Cancellations | View cancellations; apply policy (refund as credits); process refund. |
| Users | View users, subscription details, rides_used/rides_included. |
| Drivers | View drivers, online/offline, rating, vehicle. |
| Vehicles | View fleet, status, maintenance, owner/driver. |
| Rides | View rides/trips. |
| Analytics | Platform stats, ride status, fleet, user metrics. |
| Finances | Subscriptions, ride usage, revenue view. |
| Applications | Chauffeur, car owner, corporate — filter by type; approve/reject. |
| Settings | Admin/config. |

### 6.3 Assignment Workflow (Summary)

1. New request appears with `status: pending`.
2. Admin selects driver and vehicle (and for Diamond, security) and assigns → `status: assigned`.
3. Driver sees trip in app and confirms pickup → `in_progress`.
4. Driver completes → `completed`; ride deducted from subscription; receipt sent.

### 6.4 Cancellation Policy (Admin Config)

- **Before assignment:** 100% refund (ride credit), no fee.
- **After assignment:** 80% refund (ride credit), no fee.
- **After driver arrived:** 50% refund (ride credit), KES 500 fee.
- **After ride started:** 0% refund, no fee.

### 6.5 SLA Targets (Reference)

- Dispatch assignment: 3 minutes.
- Escalation response: critical 15 min, high 30 min, medium 2 h, low 24 h.
- Dispute resolution: 48 h; refund processing: 24 h.

---

## 7. Other Flows

### 7.1 Corporate Accounts

- **Apply:** Web `CorporateAccounts` / `CorporateRegistration` → `corporate_account_applications` (company, contacts, services, documents). Edge: `corporate-application-received`.
- **Review:** Admin approves/rejects. Edges: `corporate-account-approved`, `corporate-account-rejected`.
- **Billing:** `corporate-invoice-generation`, `corporate-invoice-payment-confirmation`, `corporate-payment-reminder`.
- **Team:** Corporate admin uses **Manage Team** (web) to add users under same `corporate_account_id`. Reports page for usage/reports.

### 7.2 Car Owner Partnership

- **Apply:** Web `CarOwnerPartnership` → `car_owner_applications` (vehicle, documents, etc.). Edges: `car-owner-application-received`, `car-owner-partnership-approved/rejected`.
- **Post-approval:** Vehicle registered in `vehicles`; owner linked; can be assigned to drivers by admin.

### 7.3 Security Personnel (Diamond)

- **Table:** `security_personnel`; `security_applications` for applications.
- **Usage:** Admin assigns `assigned_security_id` on `service_requests` for Diamond requests when needed.

### 7.4 Support and Chat

- **Web:** LuxeRideChat (CopilotKit) floating button on non-admin routes.
- **Edge:** `support-ticket-created`, `support-ticket-response` for ticket notifications.

### 7.5 Escalations and Disputes

- **Escalation types:** dispatch_timeout, payment_failure, driver_timeout, ride_timeout, verification_failure, user_complaint, driver_issue, technical_problem. Priority: critical, high, medium, low.
- **Dispute resolution:** full/partial/no refund or credit; all refunds in subscription model are **ride credits**.

### 7.6 Notifications and Edge Functions (Summary)

- **Ride lifecycle:** ride-request-confirmation, driver-assigned, driver-arrived, driver-en-route, trip-started, trip-completion-receipt, trip-cancellation-system, trip-cancellation-user, scheduled-trip-reminder.
- **Subscription/payments:** subscription-payment-confirmation, subscription-payment-failed, subscription-refund-confirmation, subscription-status-verification, package-purchase-confirmation, vip-subscription-renewed, vip-subscription-expired, vip-subscription-renewal-reminder, vip-ride-credits-low, vip-package-upgrade-confirmation.
- **Corporate:** corporate-application-received, corporate-account-approved/rejected, corporate-invoice-generation, corporate-invoice-payment-confirmation, corporate-payment-reminder.
- **Driver/fleet:** driver-application-received, driver-application-status, vehicle-maintenance-scheduled/completed, payout-notification, instant-payout-confirmation.
- **Car owner:** car-owner-application-received, car-owner-partnership-approved/rejected.
- **Support/ops:** support-ticket-created, support-ticket-response, fraud-detection, fraud-alert, sla-breach-alert, chatbot.
- **Dispatch/analytics:** smart-dispatch (optional LLM-based vehicle suggestion), demand-forecast, predictive-maintenance.

---

## 8. App-Specific Implementation Notes (for App Version)

### 8.1 VIP App — Must-Haves

- **Dashboard:** Enforce “active subscription + rides remaining”; else show no-package or no-rides-left state and block request.
- **Request Ride:** Implement full flow: pickup/destination (and optionally address), request type (ride, airport_transfer, etc.), scheduled vs ASAP → insert `service_requests` with `user_id`, `subscription_id`, `request_type: 'ride'` (or other), `status: 'pending'`. Validate subscription and ride count before insert.
- **My Trips:** Subscribe to `service_requests` for current user (or use polling); show status and, when assigned, driver/vehicle info and optional live tracking.
- **Family:** CRUD on `family_members` with limit from `package_subscriptions.family_members_allowed`.
- **Profile:** Ensure subscription tier and “Rides remaining” are visible where useful (e.g. dashboard; optional in profile).

### 8.2 Driver App — Must-Haves

- **Online toggle and location:** Keep `is_online` and `current_location` (and `last_updated`) in sync; only show “assignable” trips when online (admin side convention).
- **Single active trip:** One trip in `assigned` or `in_progress` at a time per driver; clear UX for “Confirm pickup” and “Complete trip” with status updates to `service_requests`.
- **Realtime:** Optional: subscribe to `service_requests` for assigned_driver_id to get new assignments and status changes without refresh.

### 8.3 Shared (Both Apps)

- **Auth:** Use shared Supabase client and auth from `mobile-apps/shared-config`; handle session expiry and redirect to sign-in.
- **Types/constants:** Use `shared-config/types.ts` and `constants.ts` (package types, request status, trip status, roles) so app and backend stay aligned.
- **Env:** `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

### 8.4 Backend Gaps to Close for App

- **Ride deduction:** Ensure a trigger or edge function runs on `service_requests.status` → `completed` to increment `package_subscriptions.rides_used` for the request’s `subscription_id`.
- **Request creation RLS/policies:** VIP app inserts into `service_requests`; ensure RLS allows authenticated user to insert with their `user_id` and valid `subscription_id` (and optionally server-side check for ride count).

---

## 9. Glossary and Reference

- **Service request** — A single ride request (one row in `service_requests`). Lifecycle: pending → assigned → in_progress → completed (or cancelled).
- **Ride credit** — Unit of refund in subscription model; restores one ride to the user’s allowance (no cash).
- **Package / subscription** — `package_subscriptions` row: tier, rides included/used, family/security flags, status, dates.
- **Assignment** — Admin assigns driver + vehicle (+ security for Diamond) to a pending request; driver does not “accept” in app.
- **Request types** — ride, airport_transfer, speedboat, helicopter, security (from constants); used in `service_requests.request_type`.

---

## 10. Document References

- **admin/README.md** — Admin features, subscription model, assignment workflow, escalation types, cancellation policy.
- **admin/config.ts** — SLA targets, cancellation policy, payment split, colors.
- **BUSINESS_MODEL_CLARIFICATIONS.md** — Open questions on pricing, revenue share, documents, corporate/chauffeur/owner flows.
- **mobile-apps/README.md** — VIP and Driver app structure, env, shared-config.
- **mobile-apps/shared-config/types.ts** — DB types; **constants.ts** — PackageTypes, ServiceRequestStatus, UserRoles, RequestTypes.
- **src/components/VIPMembershipSection.tsx** — Gold/Platinum/Diamond copy and pricing (UI source of truth for tiers).

---

*This PRD is the single reference for how the LuxRide system works for app development. Update it when subscription rules, flows, or admin behavior change.*
