# Additional Email Scenarios for LuxeRide Edge Functions

This document outlines all email scenarios beyond the 6 authentication templates that should be implemented as Supabase Edge Functions for the LuxeRide platform.

## ⚠️ Important: Subscription-Based Model

**LuxeRide uses a subscription-based payment model, NOT per-ride payments:**

- **Users pay monthly subscription fees**: Gold (KES 150,000), Platinum (KES 300,000), Diamond (KES 500,000)
- **Rides are included** in the subscription - users request rides which are deducted from their monthly allowance
- **No fare calculation per trip** - rides are "free" once you have an active subscription
- **No per-ride payment confirmations** - only subscription payment confirmations
- **Revenue sharing** happens at the subscription level (50% owner, 32% driver, 18% platform)
- **Trip receipts** show trip details and subscription usage, NOT payment/fare breakdowns

All email scenarios below reflect this subscription-based model.

---

## 📧 Trip & Booking Related Emails

### 1. **Ride Request Confirmation**
**Trigger**: When a user successfully requests a ride (subscription-based)
**Recipient**: User
**Purpose**: Confirm ride request details, provide trip ID, pickup time, and subscription status
**Variables**:
- `{{ .TripID }}`
- `{{ .PickupLocation }}`
- `{{ .DropoffLocation }}`
- `{{ .PickupTime }}`
- `{{ .VehicleType }}`
- `{{ .PackageType }}` (Gold/Platinum/Diamond)
- `{{ .RidesRemaining }}` (rides left in monthly allowance)
- `{{ .DriverName }}` (if assigned)
- `{{ .DriverPhone }}` (if assigned)

---

### 2. **Driver Assigned Notification**
**Trigger**: When a driver is assigned to a trip
**Recipient**: User
**Purpose**: Notify user that their driver has been assigned and provide driver details
**Variables**:
- `{{ .TripID }}`
- `{{ .DriverName }}`
- `{{ .DriverPhone }}`
- `{{ .VehicleMake }}`
- `{{ .VehicleModel }}`
- `{{ .VehiclePlate }}`
- `{{ .EstimatedArrival }}`
- `{{ .TrackingURL }}`

---

### 3. **Driver En Route Notification**
**Trigger**: When driver starts navigating to pickup location
**Recipient**: User
**Purpose**: Alert user that driver is on the way
**Variables**:
- `{{ .TripID }}`
- `{{ .DriverName }}`
- `{{ .EstimatedArrival }}`
- `{{ .TrackingURL }}`

---

### 4. **Driver Arrived Notification**
**Trigger**: When driver arrives at pickup location
**Recipient**: User
**Purpose**: Notify user that driver has arrived
**Variables**:
- `{{ .TripID }}`
- `{{ .DriverName }}`
- `{{ .DriverPhone }}`
- `{{ .VehiclePlate }}`
- `{{ .PickupLocation }}`

---

### 5. **Trip Started Notification**
**Trigger**: When driver starts the trip
**Recipient**: User
**Purpose**: Confirm trip has started and provide tracking link
**Variables**:
- `{{ .TripID }}`
- `{{ .StartTime }}`
- `{{ .EstimatedDuration }}`
- `{{ .TrackingURL }}`

---

### 6. **Trip Completion Receipt**
**Trigger**: When trip is marked as completed
**Recipient**: User
**Purpose**: Provide trip receipt with trip details, subscription usage, and feedback link
**Variables**:
- `{{ .TripID }}`
- `{{ .TripDate }}`
- `{{ .PickupLocation }}`
- `{{ .DropoffLocation }}`
- `{{ .Distance }}`
- `{{ .Duration }}`
- `{{ .DriverName }}`
- `{{ .VehicleDetails }}`
- `{{ .RidesUsed }}` (total rides used this month)
- `{{ .RidesRemaining }}` (rides left in monthly allowance)
- `{{ .PackageType }}`
- `{{ .FeedbackURL }}`
- `{{ .ReceiptPDF }}` (optional)

---

### 7. **Trip Cancellation Notification (User Cancelled)**
**Trigger**: When user cancels a trip
**Recipient**: User
**Purpose**: Confirm cancellation and note that ride credit is restored to subscription
**Variables**:
- `{{ .TripID }}`
- `{{ .CancellationTime }}`
- `{{ .RidesRestored }}` (ride credit restored to monthly allowance)
- `{{ .RidesRemaining }}` (updated rides left)
- `{{ .CancellationReason }}`

---

### 8. **Trip Cancellation Notification (Driver/System Cancelled)**
**Trigger**: When driver or system cancels a trip
**Recipient**: User
**Purpose**: Notify user of cancellation and offer rebooking options
**Variables**:
- `{{ .TripID }}`
- `{{ .CancellationReason }}`
- `{{ .RebookURL }}`
- `{{ .SupportContact }}`

---

### 9. **Scheduled Trip Reminder**
**Trigger**: 24 hours and 2 hours before scheduled trip
**Recipient**: User
**Purpose**: Remind user of upcoming scheduled trip
**Variables**:
- `{{ .TripID }}`
- `{{ .PickupTime }}`
- `{{ .PickupLocation }}`
- `{{ .DropoffLocation }}`
- `{{ .VehicleType }}`
- `{{ .ModifyURL }}`
- `{{ .CancelURL }}`

---

## 💳 Subscription Payment Related Emails

### 10. **Subscription Payment Confirmation**
**Trigger**: When subscription payment is successfully processed
**Recipient**: User
**Purpose**: Confirm subscription payment and activate package
**Variables**:
- `{{ .TransactionID }}`
- `{{ .PackageType }}` (Gold/Platinum/Diamond)
- `{{ .MonthlyFee }}`
- `{{ .PaymentMethod }}`
- `{{ .PaymentDate }}`
- `{{ .SubscriptionStartDate }}`
- `{{ .SubscriptionEndDate }}`
- `{{ .RidesIncluded }}`
- `{{ .ReceiptURL }}`

---

### 11. **Subscription Payment Failed Notification**
**Trigger**: When subscription payment fails or is declined
**Recipient**: User
**Purpose**: Alert user of payment failure and provide retry options
**Variables**:
- `{{ .TransactionID }}`
- `{{ .PackageType }}`
- `{{ .MonthlyFee }}`
- `{{ .PaymentMethod }}`
- `{{ .FailureReason }}`
- `{{ .RetryURL }}`
- `{{ .SupportContact }}`
- `{{ .SubscriptionStatus }}` (will be suspended if payment fails)

---

### 12. **Subscription Refund Confirmation**
**Trigger**: When subscription refund is processed (e.g., cancellation within refund period)
**Recipient**: User
**Purpose**: Confirm refund has been processed
**Variables**:
- `{{ .RefundID }}`
- `{{ .OriginalTransactionID }}`
- `{{ .RefundAmount }}`
- `{{ .RefundMethod }}`
- `{{ .RefundDate }}`
- `{{ .PackageType }}`
- `{{ .EstimatedArrival }}` (for bank transfers)

---

### 13. **Payout Notification (Driver/Partner)**
**Trigger**: When weekly payout is processed (Friday)
**Recipient**: Driver or Car Owner
**Purpose**: Notify of payout with earnings breakdown based on subscription revenue share
**Variables**:
- `{{ .PayoutID }}`
- `{{ .PayoutPeriod }}`
- `{{ .TotalEarnings }}`
- `{{ .TripCount }}` (number of trips completed)
- `{{ .OwnerShare }}` (for car owners - 50% of subscription revenue from their vehicles)
- `{{ .DriverShare }}` (for drivers - 32% of subscription revenue from their trips)
- `{{ .PlatformCommission }}` (18% retained by LuxeRide)
- `{{ .PayoutMethod }}`
- `{{ .PayoutDate }}`
- `{{ .EarningsBreakdown }}` (trip-by-trip with subscription package details)

---

### 14. **Instant Payout Confirmation**
**Trigger**: When driver requests instant payout (from subscription revenue share)
**Recipient**: Driver
**Purpose**: Confirm instant payout processing
**Variables**:
- `{{ .PayoutID }}`
- `{{ .Amount }}` (driver share from subscription revenue)
- `{{ .ProcessingFee }}`
- `{{ .NetAmount }}`
- `{{ .PayoutMethod }}`
- `{{ .EstimatedArrival }}`
- `{{ .SourceTrips }}` (number of trips this payout covers)

---

## 🏢 Corporate Account Emails

### 15. **Monthly Invoice Generation (Corporate Accounts)**
**Trigger**: End of month for corporate accounts (if corporate accounts use different billing)
**Recipient**: Corporate Account Manager
**Purpose**: Send monthly consolidated invoice for corporate subscription packages
**Variables**:
- `{{ .InvoiceNumber }}`
- `{{ .InvoiceDate }}`
- `{{ .CompanyName }}`
- `{{ .BillingPeriod }}`
- `{{ .PackageType }}` (Corporate Gold/Platinum/Diamond)
- `{{ .MonthlyFee }}`
- `{{ .TripCount }}` (trips used)
- `{{ .TotalAmount }}`
- `{{ .TripDetails }}` (list of trips - optional)
- `{{ .PaymentDueDate }}`
- `{{ .InvoicePDF }}`
- `{{ .PaymentURL }}`

---

### 16. **Payment Reminder (Corporate)**
**Trigger**: 7 days and 3 days before invoice due date
**Recipient**: Corporate Account Manager
**Purpose**: Remind of upcoming payment due date
**Variables**:
- `{{ .InvoiceNumber }}`
- `{{ .AmountDue }}`
- `{{ .DueDate }}`
- `{{ .PaymentURL }}`
- `{{ .SupportContact }}`

---

### 17. **Corporate Invoice Payment Confirmation**
**Trigger**: When corporate subscription invoice is paid
**Recipient**: Corporate Account Manager
**Purpose**: Confirm invoice payment and subscription activation/renewal
**Variables**:
- `{{ .InvoiceNumber }}`
- `{{ .PaymentAmount }}`
- `{{ .PaymentDate }}`
- `{{ .PaymentMethod }}`
- `{{ .PackageType }}`
- `{{ .SubscriptionRenewed }}` (true/false)
- `{{ .NewExpirationDate }}` (if renewed)
- `{{ .ReceiptPDF }}`

---

## 👤 Application & Onboarding Emails

### 18. **Driver Application Received**
**Trigger**: When driver submits application
**Recipient**: Driver Applicant
**Purpose**: Acknowledge application submission
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .ApplicantName }}`
- `{{ .ApplicationDate }}`
- `{{ .NextSteps }}`
- `{{ .StatusCheckURL }}`
- `{{ .ExpectedReviewTime }}`

---

### 19. **Driver Application Approved**
**Trigger**: When admin approves driver application
**Recipient**: Driver Applicant
**Purpose**: Welcome approved driver and provide onboarding instructions
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .DriverName }}`
- `{{ .OnboardingURL }}`
- `{{ .RequiredDocuments }}`
- `{{ .NextSteps }}`
- `{{ .SupportContact }}`

---

### 20. **Driver Application Rejected**
**Trigger**: When admin rejects driver application
**Recipient**: Driver Applicant
**Purpose**: Notify of rejection with reason and appeal options
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .RejectionReason }}`
- `{{ .AppealURL }}`
- `{{ .ReapplyDate }}` (if applicable)
- `{{ .SupportContact }}`

---

### 21. **Car Owner Partnership Application Received**
**Trigger**: When car owner submits partnership application
**Recipient**: Car Owner Applicant
**Purpose**: Acknowledge application submission
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .ApplicantName }}`
- `{{ .VehicleDetails }}`
- `{{ .ApplicationDate }}`
- `{{ .StatusCheckURL }}`
- `{{ .ExpectedReviewTime }}`

---

### 22. **Car Owner Partnership Approved**
**Trigger**: When admin approves car owner partnership
**Recipient**: Car Owner
**Purpose**: Welcome partner and provide onboarding details
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .PartnerName }}`
- `{{ .PartnershipTerms }}`
- `{{ .RevenueShare }}`
- `{{ .OnboardingURL }}`
- `{{ .PartnerPortalURL }}`
- `{{ .SupportContact }}`

---

### 23. **Car Owner Partnership Rejected**
**Trigger**: When admin rejects car owner partnership
**Recipient**: Car Owner Applicant
**Purpose**: Notify of rejection with reason
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .RejectionReason }}`
- `{{ .AppealURL }}`
- `{{ .SupportContact }}`

---

### 24. **Corporate Account Application Received**
**Trigger**: When corporate account application is submitted
**Recipient**: Corporate Applicant
**Purpose**: Acknowledge application submission
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .CompanyName }}`
- `{{ .ContactName }}`
- `{{ .ApplicationDate }}`
- `{{ .StatusCheckURL }}`
- `{{ .ExpectedReviewTime }}`

---

### 25. **Corporate Account Approved**
**Trigger**: When admin approves corporate account
**Recipient**: Corporate Account Manager
**Purpose**: Welcome corporate client and provide account access
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .CompanyName }}`
- `{{ .AccountManagerName }}`
- `{{ .AccountManagerEmail }}`
- `{{ .AccountManagerPhone }}`
- `{{ .CorporatePortalURL }}`
- `{{ .BillingTerms }}`
- `{{ .SupportContact }}`

---

### 26. **Corporate Account Rejected**
**Trigger**: When admin rejects corporate account application
**Recipient**: Corporate Applicant
**Purpose**: Notify of rejection with reason
**Variables**:
- `{{ .ApplicationID }}`
- `{{ .RejectionReason }}`
- `{{ .AppealURL }}`
- `{{ .SupportContact }}`

---

## ⭐ VIP Membership Emails

### 27. **VIP Package Purchase Confirmation**
**Trigger**: When VIP user purchases a package
**Recipient**: VIP User
**Purpose**: Confirm package purchase and provide subscription details
**Variables**:
- `{{ .PackageType }}` (Gold/Platinum/Diamond)
- `{{ .PackagePrice }}`
- `{{ .RidesIncluded }}`
- `{{ .SubscriptionStartDate }}`
- `{{ .SubscriptionEndDate }}`
- `{{ .PaymentMethod }}`
- `{{ .ReceiptURL }}`
- `{{ .VIPPortalURL }}`

---

### 28. **VIP Subscription Renewal Reminder**
**Trigger**: 7 days and 3 days before subscription expires
**Recipient**: VIP User
**Purpose**: Remind user to renew subscription
**Variables**:
- `{{ .PackageType }}`
- `{{ .ExpirationDate }}`
- `{{ .RidesRemaining }}`
- `{{ .RenewalURL }}`
- `{{ .UpgradeOptions }}`

---

### 29. **VIP Subscription Expired**
**Trigger**: When VIP subscription expires
**Recipient**: VIP User
**Purpose**: Notify of expiration and offer renewal
**Variables**:
- `{{ .PackageType }}`
- `{{ .ExpirationDate }}`
- `{{ .RenewalURL }}`
- `{{ .UpgradeOptions }}`
- `{{ .SupportContact }}`

---

### 30. **VIP Subscription Renewed**
**Trigger**: When VIP user renews subscription
**Recipient**: VIP User
**Purpose**: Confirm renewal and provide new subscription details
**Variables**:
- `{{ .PackageType }}`
- `{{ .NewExpirationDate }}`
- `{{ .RidesIncluded }}`
- `{{ .PaymentAmount }}`
- `{{ .ReceiptURL }}`

---

### 31. **VIP Ride Credits Low Warning**
**Trigger**: When VIP user has 3 or fewer rides remaining
**Recipient**: VIP User
**Purpose**: Warn user about low ride credits
**Variables**:
- `{{ .RidesRemaining }}`
- `{{ .TopUpURL }}`
- `{{ .UpgradeOptions }}`
- `{{ .RenewalDate }}`

---

### 32. **VIP Package Upgrade Confirmation**
**Trigger**: When VIP user upgrades package
**Recipient**: VIP User
**Purpose**: Confirm upgrade and provide new benefits
**Variables**:
- `{{ .OldPackageType }}`
- `{{ .NewPackageType }}`
- `{{ .UpgradePrice }}`
- `{{ .NewRidesIncluded }}`
- `{{ .NewBenefits }}`
- `{{ .ReceiptURL }}`

---

## 🚗 Vehicle & Maintenance Emails

### 33. **Vehicle Maintenance Scheduled**
**Trigger**: When maintenance is scheduled for a vehicle
**Recipient**: Car Owner
**Purpose**: Notify of scheduled maintenance
**Variables**:
- `{{ .VehiclePlate }}`
- `{{ .VehicleMake }}`
- `{{ .VehicleModel }}`
- `{{ .MaintenanceType }}`
- `{{ .ScheduledDate }}`
- `{{ .EstimatedDuration }}`
- `{{ .ServiceCenter }}`
- `{{ .ContactPhone }}`

---

### 34. **Vehicle Maintenance Completed**
**Trigger**: When vehicle maintenance is completed
**Recipient**: Car Owner
**Purpose**: Notify that vehicle is ready and back in service
**Variables**:
- `{{ .VehiclePlate }}`
- `{{ .MaintenanceType }}`
- `{{ .CompletionDate }}`
- `{{ .ServiceDetails }}`
- `{{ .NextMaintenanceDate }}`
- `{{ .InvoiceURL }}`

---

## 🔔 System & Admin Emails

### 35. **Fraud Alert Notification**
**Trigger**: When fraud detection system flags suspicious activity
**Recipient**: Admin
**Purpose**: Alert admin of potential fraud
**Variables**:
- `{{ .AlertType }}`
- `{{ .Severity }}`
- `{{ .UserID }}`
- `{{ .TransactionID }}`
- `{{ .SuspiciousActivity }}`
- `{{ .AdminDashboardURL }}`

---

### 36. **SLA Breach Alert**
**Trigger**: When SLA is breached (e.g., driver assignment delay)
**Recipient**: Admin
**Purpose**: Alert admin of SLA breach
**Variables**:
- `{{ .TripID }}`
- `{{ .SLARequirement }}`
- `{{ .ActualTime }}`
- `{{ .BreachDuration }}`
- `{{ .Impact }}`
- `{{ .AdminDashboardURL }}`

---

### 37. **Subscription Status Verification Required**
**Trigger**: When trip is completed but user's subscription status is unclear or expired
**Recipient**: Admin
**Purpose**: Alert admin to verify subscription status manually
**Variables**:
- `{{ .TripID }}`
- `{{ .UserID }}`
- `{{ .UserEmail }}`
- `{{ .SubscriptionStatus }}`
- `{{ .PackageType }}`
- `{{ .RidesRemaining }}`
- `{{ .TripDate }}`
- `{{ .AdminDashboardURL }}`

---

## 💬 Feedback & Support Emails

### 38. **Feedback Received Confirmation**
**Trigger**: When user submits feedback
**Recipient**: User
**Purpose**: Acknowledge feedback submission
**Variables**:
- `{{ .FeedbackID }}`
- `{{ .TripID }}`
- `{{ .Rating }}`
- `{{ .ThankYouMessage }}`
- `{{ .FollowUpDate }}` (if low rating)

---

### 39. **Support Ticket Created**
**Trigger**: When user creates support ticket
**Recipient**: User
**Purpose**: Confirm ticket creation and provide ticket number
**Variables**:
- `{{ .TicketNumber }}`
- `{{ .TicketSubject }}`
- `{{ .TicketCategory }}`
- `{{ .ExpectedResponseTime }}`
- `{{ .TicketURL }}`
- `{{ .SupportContact }}`

---

### 40. **Support Ticket Response**
**Trigger**: When admin responds to support ticket
**Recipient**: User
**Purpose**: Notify user of response
**Variables**:
- `{{ .TicketNumber }}`
- `{{ .ResponseMessage }}`
- `{{ .RespondedBy }}`
- `{{ .ResponseDate }}`
- `{{ .TicketURL }}`

---

## 📊 Summary

**Total Additional Email Scenarios: 40**

### Categories Breakdown:
- **Trip & Booking**: 9 emails (subscription-based, no per-ride payments)
- **Subscription Payment**: 5 emails (monthly subscription payments only)
- **Corporate Accounts**: 3 emails (corporate subscription billing)
- **Application & Onboarding**: 9 emails
- **VIP Membership**: 6 emails (package subscriptions)
- **Vehicle & Maintenance**: 2 emails
- **System & Admin**: 3 emails
- **Feedback & Support**: 3 emails

### Key Model Notes:
- **No Per-Ride Payments**: All users pay monthly subscription (Gold: KES 150,000, Platinum: KES 300,000, Diamond: KES 500,000)
- **Rides Included**: Rides are deducted from monthly allowance, no fare calculation per trip
- **Revenue Sharing**: Driver/Partner payouts based on subscription revenue share (50% owner, 32% driver, 18% platform)
- **No Fare Breakdowns**: Trip receipts show trip details and subscription usage, not payment details

### Implementation Priority:

**High Priority** (Core User Experience):
1. Ride Request Confirmation (subscription-based)
2. Driver Assigned Notification
3. Trip Completion Receipt (with subscription usage info)
4. Subscription Payment Confirmation
5. Subscription Payment Failed Notification
6. Driver Application Approved/Rejected
7. VIP Package Purchase Confirmation (subscription activation)

**Medium Priority** (Operational):
8. Payout Notifications
9. Monthly Invoice Generation
10. Trip Cancellation Notifications
11. Scheduled Trip Reminders
12. Vehicle Maintenance Notifications

**Low Priority** (Nice to Have):
13. All other notifications

---

## 🔧 Edge Function Implementation Notes

Each email scenario should be implemented as a Supabase Edge Function that:
1. Receives trigger data (via database webhooks or API calls)
2. Fetches necessary data from database
3. Renders email template with variables
4. Sends email via email service (SendGrid, AWS SES, etc.)
5. Logs email send status in database
6. Handles errors gracefully

### Recommended Edge Function Structure:
```
supabase/functions/
├── send-email/
│   ├── index.ts (main handler)
│   └── templates/
│       ├── trip-booking-confirmation.html
│       ├── driver-assigned.html
│       ├── payment-confirmation.html
│       └── ... (all other templates)
```

### Database Triggers Needed:
- `service_requests` or `trips` table: INSERT, UPDATE (status changes)
- `subscription_payments` table: INSERT, UPDATE (status changes) - for subscription payments
- `package_subscriptions` table: INSERT, UPDATE (status/expiration/rides_used)
- `driver_applications` table: UPDATE (status changes)
- `car_owner_applications` table: UPDATE (status changes)
- `corporate_account_applications` table: UPDATE (status changes)
- `payouts` table: INSERT (when payout processed - based on subscription revenue share)

---

## 📝 Next Steps

1. Create email templates for high-priority scenarios
2. Set up Supabase Edge Functions for email sending
3. Configure database triggers/webhooks
4. Integrate with email service provider
5. Test email delivery and rendering
6. Set up email logging and monitoring
7. Implement email preferences/unsubscribe functionality

