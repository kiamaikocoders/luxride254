# LuxeRide Application Flow

```mermaid
flowchart TD
    Start([User Visits Application]) --> Landing[Landing Page]
    
    Landing --> Browse[Browse Services]
    Landing --> SignUp[Sign Up]
    Landing --> SignIn[Sign In]
    Landing --> Contact[Contact]
    Landing --> About[About Us]
    
    Browse --> Services[Executive Cars VIP Membership<br/>Helicopter Speedboat]
    Services --> Booking[Booking Modal]
    
    SignUp --> Role{Select Role}
    Role -->|User| UserReg[User Registration]
    Role -->|VIP| VIPReg[VIP Registration]
    Role -->|Driver| DriverReg[Driver Application]
    Role -->|Corporate| CorpReg[Corporate Registration]
    
    SignIn --> Auth{Authenticate}
    Auth -->|Success| CheckRole{Check Role}
    Auth -->|Fail| Error[Show Error]
    
    CheckRole -->|User| UserDash[User Dashboard]
    CheckRole -->|VIP| VIPDash[VIP Dashboard]
    CheckRole -->|Driver| DriverDash[Driver Dashboard]
    CheckRole -->|Admin| AdminDash[Admin Dashboard]
    CheckRole -->|Corporate| CorpDash[Corporate Dashboard]
    
    UserReg --> SupabaseAuth[Supabase Auth]
    SupabaseAuth --> CreateProfile[Create Profile]
    CreateProfile --> UserDash
    
    UserDash --> BookRide[Book Ride]
    UserDash --> ViewTrips[My Trips]
    UserDash --> Profile[Profile]
    
    BookRide --> SelectVehicle[Select Vehicle Type]
    SelectVehicle --> EnterDetails[Enter Pickup Dropoff]
    EnterDetails --> CalculateFare[Calculate Fare]
    CalculateFare --> Payment{Payment Method}
    
    Payment -->|M-Pesa| MPesa[M-Pesa Payment]
    Payment -->|Card| Card[Card Payment]
    Payment -->|Bank| Bank[Bank Transfer]
    
    MPesa --> Confirm[Payment Confirmed]
    Card --> Confirm
    Bank --> Confirm
    
    Confirm --> Dispatch[Smart Dispatch]
    Dispatch --> Assign[Assign Driver]
    Assign --> Notify[Notify Driver User]
    Notify --> Track[Real-time Tracking]
    
    Track --> Complete{Ride Complete?}
    Complete -->|Yes| Feedback[Feedback Rating]
    Complete -->|No| Track
    
    Feedback --> Split[Payment Split<br/>Owner 50% Driver 32% Platform 18%]
    Split --> Payout[Weekly Payout Friday]
    
    VIPReg --> VIPAuth[Supabase Auth]
    VIPAuth --> VIPProfile[Create VIP Profile]
    VIPProfile --> VIPPackage[Select Package]
    VIPPackage --> VIPPay[VIP Payment]
    VIPPay --> VIPDash
    
    VIPDash --> VIPRequest[Request Ride]
    VIPDash --> VIPSubs[View Subscriptions]
    VIPDash --> Concierge[Concierge Services]
    
    VIPRequest --> CheckSub{Active Subscription?}
    CheckSub -->|Yes| CheckRides{Rides Remaining?}
    CheckSub -->|No| Subscribe[Subscribe Package]
    
    CheckRides -->|Yes| CreateRequest[Create Service Request]
    CheckRides -->|No| Upgrade[Upgrade Package]
    
    CreateRequest --> VIPDispatch[Smart Dispatch]
    VIPDispatch --> AssignVIP[Assign Premium Driver]
    AssignVIP --> VIPTrack[VIP Tracking]
    
    DriverReg --> DriverAuth[Supabase Auth]
    DriverAuth --> DriverApp[Driver Application]
    DriverApp --> Submit[Submit Application]
    Submit --> Review[Admin Review]
    
    Review --> Decision{Approved?}
    Decision -->|Yes| Onboard[Driver Onboarding]
    Decision -->|No| Rejected[Application Rejected]
    
    Onboard --> DriverDash
    
    DriverDash --> GoOnline[Go Online]
    DriverDash --> ViewReqs[View Requests]
    DriverDash --> Earnings[View Earnings]
    DriverDash --> DriverProf[Driver Profile]
    
    GoOnline --> Wait[Wait for Request]
    ViewReqs --> Accept{Accept Request?}
    Accept -->|Yes| Navigate[Navigate to Pickup]
    Accept -->|No| Wait
    
    Navigate --> Arrive[Arrive at Pickup]
    Arrive --> Start[Start Ride]
    Start --> NavigateDrop[Navigate to Dropoff]
    NavigateDrop --> CompleteRide[Complete Ride]
    CompleteRide --> DriverFeedback[Receive Feedback]
    DriverFeedback --> Earnings
    
    CorpReg --> CorpAuth[Supabase Auth]
    CorpAuth --> CorpApp[Corporate Registration]
    CorpApp --> CorpApproval[Admin Approval]
    CorpApproval --> CorpDash
    
    CorpDash --> TeamBook[Team Booking]
    CorpDash --> Invoices[Monthly Invoices]
    CorpDash --> ManageTeam[Manage Team]
    
    TeamBook --> CorpFlow[Corporate Booking Flow]
    CorpFlow --> MonthlyInv[Monthly Invoice]
    MonthlyInv --> CorpPay[Corporate Payment 14-30 Days]
    
    AdminDash --> ManageDrivers[Manage Drivers]
    AdminDash --> ManageVehicles[Manage Vehicles]
    AdminDash --> ManageBookings[Manage Bookings]
    AdminDash --> ManageUsers[Manage Users]
    AdminDash --> Reports[Analytics Reports]
    AdminDash --> Applications[Review Applications]
    
    ManageDrivers --> Approve[Approve Reject Driver]
    ManageVehicles --> Maintenance[Schedule Maintenance]
    ManageBookings --> Manual[Manual Dispatch]
    
    Dispatch --> AI[AI Features]
    AI --> Forecast[Demand Forecasting]
    AI --> Pricing[Dynamic Pricing]
    AI --> Fraud[Fraud Detection]
    AI --> PredMaintenance[Predictive Maintenance]
    AI --> Recommend[Recommendation Engine]
    
    Landing --> Chat[AI Chat Support]
    UserDash --> Chat
    VIPDash --> Chat
    DriverDash --> Chat
    
    Landing --> Mobile{Mobile Apps}
    Mobile --> VIPApp[VIP Mobile App]
    Mobile --> DriverApp2[Driver Mobile App]
    
    VIPApp --> VIPDash
    DriverApp2 --> DriverDash
    
    classDef userFlow fill:#e1f5ff,stroke:#01579b
    classDef vipFlow fill:#fff3e0,stroke:#e65100
    classDef driverFlow fill:#f3e5f5,stroke:#4a148c
    classDef adminFlow fill:#ffebee,stroke:#b71c1c
    classDef corporateFlow fill:#e8f5e9,stroke:#1b5e20
    classDef paymentFlow fill:#fff9c4,stroke:#f57f17
    classDef aiFlow fill:#f1f8e9,stroke:#33691e
    
    class UserDash,UserReg,BookRide,ViewTrips,Profile userFlow
    class VIPDash,VIPReg,VIPPackage,VIPRequest,VIPSubs vipFlow
    class DriverDash,DriverReg,DriverApp,GoOnline,ViewReqs,Earnings driverFlow
    class AdminDash,ManageDrivers,ManageVehicles,ManageBookings,Reports adminFlow
    class CorpDash,CorpReg,CorpApp,TeamBook,Invoices corporateFlow
    class Payment,MPesa,Card,Bank,Confirm,Split,Payout paymentFlow
    class AI,Forecast,Pricing,Fraud,PredMaintenance,Recommend aiFlow
```

## Key Components

### Authentication & Authorization
- **Supabase Auth**: Handles all user authentication
- **Role-Based Access**: User, VIP User, Driver, Admin, Corporate
- **Session Management**: Real-time session tracking

### Booking & Dispatch System
- **Smart Dispatch**: AI-powered driver assignment
- **Real-time Tracking**: Live location updates
- **Dynamic Pricing**: AI-based fare calculation
- **Multiple Vehicle Tiers**: Gold, Platinum, Diamond

### Payment Processing
- **Payment Methods**: M-Pesa, Cards, Bank Transfer
- **Automated Split**: Owner (50%), Driver (32%), Platform (18%)
- **Payout Cycles**: Weekly (Friday) or Instant (with fee)
- **Corporate Billing**: Monthly invoices with 14-30 day terms

### AI Features
- **Demand Forecasting**: Predict ride demand
- **Dynamic Pricing**: Adjust fares based on demand
- **Fraud Detection**: Monitor suspicious activities
- **Predictive Maintenance**: Schedule vehicle maintenance
- **Recommendation Engine**: Suggest optimal routes/services

### Platforms
- **Web Application**: Main landing page and admin dashboard
- **VIP Web Portal**: Dedicated VIP user interface
- **Mobile Apps**: React Native apps for VIP users and drivers

