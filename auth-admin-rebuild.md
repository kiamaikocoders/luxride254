# LuxeRide Auth & Admin Dashboard Rebuild Plan

## 1. Auth Flow Redesign
- **Delete all current auth logic and UI.**
- **Sign Up Page:**
  - Fields: Username, Email, Password, Confirm Password.
  - Add a dropdown for Role selection: "Passenger" or "Driver".
  - On submit, create user in Supabase with selected role.
- **Sign In Page:**
  - Fields: Email, Password.
  - On submit, authenticate and redirect based on role.
- **Profile Page:**
  - Show user details (name, email, role) in a modern, user-friendly layout.
  - Allow profile updates and password changes.
  - Remove blank/unstyled page issues.

## 2. Admin Dashboard Isolation
- **Make admin dashboard a completely independent app section.**
  - Remove main site navbar and unrelated UI from admin view.
  - When logged in as admin, only show admin dashboard and its features.
  - Prevent access to main site pages from admin dashboard.
- **Admin Login:**
  - Separate login page for admins.
  - On successful login, redirect to admin dashboard only.

## 3. Admin Dashboard Features
- **Implement all discussed features:**
  - Real-time stats (users, drivers, vehicles, trips, payments, feedback).
  - Partner portal: car history, payment splits, trip details, car tagging.
  - Application monitoring: car owner forms, chauffeur applications, driver details, corporate accounts.
  - Search, filters, analytics, actionable insights, notifications, activity logs.
  - Role-based access control for admin actions.
  - Responsive, modern UI with dark mode.

## 4. Navigation & Routing
- **Separate routing for admin and main app.**
  - Admin routes only accessible to admin users.
  - Main app routes for passengers and drivers.

## 5. Implementation Steps
1. Remove existing auth and admin dashboard code.
2. Build new Sign Up, Sign In, and Profile pages with role selection and modern UI.
3. Create a dedicated admin login and dashboard, isolated from the main app.
4. Implement all admin dashboard features and data integrations.
5. Set up routing and access control for admin and main app sections.
6. Test all flows for user, driver, and admin roles.
7. Polish UI/UX for consistency and responsiveness.

---

**Next:**
- Confirm this plan, then proceed to implementation step-by-step.
