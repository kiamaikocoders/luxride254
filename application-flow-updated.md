# LuxeRide Application Flow - Updated Architecture

## Mobile-First Subscription-Based Model

```mermaid
flowchart TD
    Start([User Visits luxeride.com]) --> Landing[Landing Page<br/>Marketing & Information]
    
    Landing --> Browse[Browse Services]
    Landing --> Packages[View Packages<br/>Gold Platinum Diamond]
    Landing --> Contact[Contact Forms]
    Landing --> Partnerships[Partnership Applications]
    
    Packages --> SelectPackage{User Clicks Package}
    
    SelectPackage -->|Mobile Device| DeepLink[Deep Link<br/>luxeride-vip://subscribe?package=gold]
    SelectPackage -->|Desktop| DownloadModal[Download Modal<br/>QR Code + Store Links]
    
    DeepLink -->|App Installed| OpenApp[Open Mobile App]
    DeepLink -->|App Not Installed| AppStore[Redirect to App Store]
    
    DownloadModal --> AppStoreiOS[App Store iOS]
    DownloadModal --> AppStoreAndroid[Play Store Android]
    
    AppStore --> Install[User Installs App]
    AppStoreiOS --> Install
    AppStoreAndroid --> Install
    
    Install --> OpenApp
    
    OpenApp --> CheckAuth{Authenticated?}
    
    CheckAuth -->|No| SignUp[Sign Up Screen]
    CheckAuth -->|Yes| CheckSubscription{Has Active Subscription?}
    
    SignUp --> CreateAccount[Create Account<br/>Role: user only]
    CreateAccount --> PackageSelection[Package Selection Screen]
    
    CheckSubscription -->|Yes| Dashboard[Mobile Dashboard]
    CheckSubscription -->|No| PackageSelection
    
    PackageSelection --> ChoosePackage{Select Package}
    
    ChoosePackage -->|Gold| GoldDetails[Gold Package Details<br/>20 rides/month<br/>KES 150,000]
    ChoosePackage -->|Platinum| PlatinumDetails[Platinum Package Details<br/>40 rides/month<br/>KES 300,000]
    ChoosePackage -->|Diamond| DiamondDetails[Diamond Package Details<br/>60 rides/month<br/>KES 500,000]
    
    GoldDetails --> Payment[Payment Screen]
    PlatinumDetails --> Payment
    DiamondDetails --> Payment
    
    Payment --> PaymentMethod{Payment Method}
    
    PaymentMethod -->|M-Pesa| MPesa[M-Pesa STK Push]
    PaymentMethod -->|Card| Card[Card Payment]
    
    MPesa --> Confirm[Payment Confirmed]
    Card --> Confirm
    
    Confirm --> ActivateSubscription[Activate Subscription<br/>package_subscriptions table]
    ActivateSubscription --> Dashboard
    
    Dashboard --> CheckPackageType{Package Type?}
    
    CheckPackageType -->|Gold| GoldFeatures[Gold Features:<br/>- Request Rides 20/month<br/>- Track Rides<br/>- View Trip History<br/>- Basic Support]
    CheckPackageType -->|Platinum| PlatinumFeatures[Platinum Features:<br/>- All Gold Features<br/>- 40 rides/month<br/>- Add Family Members up to 3<br/>- 24/7 Concierge]
    CheckPackageType -->|Diamond| DiamondFeatures[Diamond Features:<br/>- All Platinum Features<br/>- 60 rides/month<br/>- Unlimited Family Members<br/>- Security Detail Included<br/>- Personal Account Manager<br/>- Priority Dispatch]
    
    GoldFeatures --> RequestRide[Request Ride]
    PlatinumFeatures --> RequestRide
    DiamondFeatures --> RequestRide
    
    RequestRide --> CheckRidesRemaining{Rides Remaining?}
    
    CheckRidesRemaining -->|Yes| EnterDetails[Enter Pickup & Dropoff]
    CheckRidesRemaining -->|No| UpgradePrompt[Upgrade Package<br/>or Wait for Renewal]
    
    EnterDetails --> SmartDispatch[Smart Dispatch System]
    SmartDispatch --> AssignDriver[Assign Nearest Available Driver]
    AssignDriver --> Notify[Notify Driver & User]
    Notify --> TrackRide[Real-time Ride Tracking]
    
    TrackRide --> Complete{Ride Complete?}
    Complete -->|No| TrackRide
    Complete -->|Yes| DeductRide[Deduct from Rides Included<br/>rides_used++]
    DeductRide --> Feedback[Feedback & Rating]
    Feedback --> Dashboard
    
    Dashboard --> ViewTrips[View Trip History]
    Dashboard --> ManageSubscription[Manage Subscription]
    Dashboard --> Profile[Profile Settings]
    
    ManageSubscription --> Renew[Renew Package]
    ManageSubscription --> Upgrade[Upgrade Package]
    ManageSubscription --> Cancel[Cancel Subscription]
    
    Renew --> Payment
    Upgrade --> PackageSelection
    Cancel --> NoAccess[No Access to Services]
    
    %% Driver Flow
    Landing --> DriverApp[Driver App Download]
    DriverApp --> DriverSignIn[Driver Sign In]
    DriverSignIn --> DriverAuth{Driver Authenticated?}
    DriverAuth -->|No| DriverSignUp[Driver Sign Up]
    DriverAuth -->|Yes| DriverDash[Driver Dashboard]
    
    DriverSignUp --> DriverApplication[Driver Application:<br/>- License Number<br/>- Vehicle Details<br/>- Background Check]
    DriverApplication --> AdminReview[Admin Review]
    AdminReview --> Approved{Approved?}
    Approved -->|Yes| DriverOnboarding[Driver Onboarding]
    Approved -->|No| Rejected[Application Rejected]
    
    DriverOnboarding --> DriverDash
    
    DriverDash --> GoOnline[Go Online]
    GoOnline --> WaitRequest[Wait for Ride Requests]
    WaitRequest --> ReceiveRequest[Receive Ride Request]
    ReceiveRequest --> Accept{Accept Request?}
    
    Accept -->|Yes| NavigatePickup[Navigate to Pickup]
    Accept -->|No| WaitRequest
    
    NavigatePickup --> ArrivePickup[Arrive at Pickup]
    ArrivePickup --> StartRide[Start Ride]
    StartRide --> NavigateDropoff[Navigate to Dropoff]
    NavigateDropoff --> CompleteRide[Complete Ride]
    CompleteRide --> UpdateEarnings[Update Earnings]
    UpdateEarnings --> WeeklyPayout[Weekly Payout Friday]
    WeeklyPayout --> DriverDash
    
    %% Admin Flow
    Landing --> AdminLogin[Admin Login /admin-login]
    AdminLogin --> AdminAuth{Admin Authenticated?}
    AdminAuth -->|Yes| AdminDash[Admin Dashboard]
    AdminAuth -->|No| AdminLogin
    
    AdminDash --> ManageUsers[Manage Users]
    AdminDash --> ManageSubscriptions[Manage Subscriptions]
    AdminDash --> ManageDrivers[Manage Drivers]
    AdminDash --> ManageVehicles[Manage Vehicles]
    AdminDash --> ViewBookings[View All Bookings]
    AdminDash --> ViewEarnings[View Earnings & Reports]
    AdminDash --> ViewFeedback[View Customer Feedback]
    AdminDash --> ReviewApplications[Review Applications]
    
    ManageSubscriptions --> CreateSubscription[Create Subscription]
    ManageSubscriptions --> UpdateSubscription[Update Subscription]
    ManageSubscriptions --> SuspendSubscription[Suspend Subscription]
    
    ManageDrivers --> ApproveDriver[Approve Driver]
    ManageDrivers --> SuspendDriver[Suspend Driver]
    ManageDrivers --> ViewDriverPerformance[View Driver Performance]
    
    %% Partnership Forms Web Only
    Landing --> CarOwnerForm[Car Owner Partnership Form]
    Landing --> ChauffeurForm[Chauffeur Application Form]
    Landing --> CorporateForm[Corporate Account Form]
    
    CarOwnerForm --> SubmitForm[Submit Form]
    ChauffeurForm --> SubmitForm
    CorporateForm --> SubmitForm
    
    SubmitForm --> AdminReview
    
    %% Styling
    classDef webFlow fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef mobileFlow fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef subscriptionFlow fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef driverFlow fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef adminFlow fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef paymentFlow fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    
    class Landing,Browse,Contact,Partnerships,CarOwnerForm,ChauffeurForm,CorporateForm,AdminLogin webFlow
    class OpenApp,SignUp,CreateAccount,PackageSelection,Dashboard,RequestRide,TrackRide,ViewTrips mobileFlow
    class Packages,SelectPackage,GoldDetails,PlatinumDetails,DiamondDetails,ActivateSubscription,CheckSubscription subscriptionFlow
    class DriverApp,DriverDash,GoOnline,WaitRequest,ReceiveRequest driverFlow
    class AdminDash,ManageUsers,ManageSubscriptions,ManageDrivers,AdminReview adminFlow
    class Payment,PaymentMethod,MPesa,Card,Confirm,WeeklyPayout paymentFlow
```

## Key Architectural Changes

### 1. Web Application (luxeride.com)
**Purpose:** Marketing & Admin Only

**Available:**
- ✅ Landing page with package showcase
- ✅ Contact forms
- ✅ Partnership applications (Car Owner, Chauffeur, Corporate)
- ✅ Admin dashboard (`/admin`)
- ✅ About/Contact pages

**Removed:**
- ❌ User sign up/login (mobile-only)
- ❌ User dashboard (mobile-only)
- ❌ Payment processing (mobile-only)
- ❌ Per-ride booking (subscription-based only)

### 2. Mobile Application
**Purpose:** All User Features

**Flow:**
```
Download App → Sign Up → Select Package → Pay → Dashboard → Request Rides
```

**Features:**
- Package selection (Gold/Platinum/Diamond)
- Payment processing
- User dashboard
- Request rides
- Track rides
- Manage subscription
- Trip history

### 3. Database Architecture
- **Role:** All users have `role = 'user'` (no `'vip_user'`)
- **Access:** Determined by `package_subscriptions` table
- **Constraint:** `role IN ('user', 'driver', 'admin', 'security')`

### 4. Package-Based Access
- **Gold:** 20 rides/month, basic features
- **Platinum:** 40 rides/month, family members, concierge
- **Diamond:** 60 rides/month, unlimited family, security, priority

### 5. Flow Summary

**Web:**
```
Landing → Browse → See Packages → Download App → (Everything else in mobile app)
```

**Mobile:**
```
App → Sign Up → Select Package → Pay → Dashboard → Request Rides → Track → Complete
```

**Admin:**
```
Admin Login → Dashboard → Manage Users/Subscriptions/Drivers/Vehicles
```

## Differences from Previous Flow

| Previous | Updated |
|----------|---------|
| Web signup/login | Mobile-only |
| Web user dashboard | Mobile-only |
| Role: `'user'` vs `'vip_user'` | Role: `'user'` only |
| Package selection on web | Redirects to app stores |
| Per-ride payment | Monthly subscription only |
| Check role AND subscription | Check subscription only |

