# Business Model Clarifications & Requirements

This document outlines the key clarifications needed before continuing with development. It covers application procedures, required documents, pricing models, and cost breakdowns.

---

## 1. Application Procedures & Required Documents

### 1.1 Car Owner Partnership

#### Current Implementation Status
- ✅ Multi-step form implemented (Personal, Vehicle, Documents)
- ✅ File upload system in place
- ✅ Basic validation implemented
- ⚠️ Document requirements need clarification

#### Questions Needing Clarification

**A. Required Documents - What specific documents are mandatory?**
- [ ] Vehicle Registration Certificate (logbook) - **Required?**
- [ ] Insurance Certificate (comprehensive) - **Required?**
- [ ] Owner's National ID/Passport - **Required?**
- [ ] Vehicle Inspection Certificate - **Required?**
- [ ] Service History Records - **Optional or Required?**
- [ ] Good Conduct Certificate - **Required for owner?**
- [ ] Business Registration (if registered business) - **When applicable?**
- [ ] Tax Compliance Certificate (KRA PIN) - **Required?**
- [ ] Proof of Ownership - **Required? Additional to logbook?**

**B. Application Review Process - What is the exact procedure?**
1. **Initial Submission**
   - User submits form with documents
   - System confirms receipt via email
   - Status: `pending`

2. **Document Verification** - **Who reviews? What's the timeline?**
   - [ ] Automated validation vs manual review?
   - [ ] Expected review time (e.g., 24 hours, 3-5 business days)?
   - [ ] Who performs the review (admin team, operations team)?

3. **Vehicle Inspection** - **Required? When?**
   - [ ] Physical inspection required?
   - [ ] Virtual inspection acceptable?
   - [ ] Inspection by LuxeRide team or third party?
   - [ ] Cost of inspection - who pays?

4. **Approval Process** - **What are the criteria?**
   - [ ] Vehicle age limit (e.g., maximum 10 years old)?
   - [ ] Vehicle make/model restrictions?
   - [ ] Mileage limitations?
   - [ ] Condition requirements?
   - [ ] Insurance requirements (comprehensive vs third party)?

5. **Partnership Agreement** - **Next steps after approval?**
   - [ ] Contract signing process?
   - [ ] Partnership terms and conditions?
   - [ ] Revenue sharing agreement (50% owner, 32% driver, 18% platform)?
   - [ ] Payment setup (bank account, M-Pesa Till number)?

6. **Onboarding** - **What happens after approval?**
   - [ ] Vehicle registration in system?
   - [ ] GPS/tracking device installation?
   - [ ] Driver assignment or owner provides driver?
   - [ ] Training provided?

---

### 1.2 Corporate Accounts

#### Current Implementation Status
- ✅ Multi-step form implemented (Company, Services, Documents)
- ✅ File upload system in place
- ✅ Services selection implemented
- ⚠️ Document requirements and approval process need clarification

#### Questions Needing Clarification

**A. Required Documents - What specific documents are mandatory?**
- [ ] Business Registration Certificate - **Required?**
- [ ] Tax Compliance Certificate (KRA PIN) - **Required?**
- [ ] Company Profile - **Required? What format?**
- [ ] Certificate of Incorporation - **Required?**
- [ ] VAT Registration Certificate (if applicable) - **Required?**
- [ ] Bank Account Details - **For invoicing - required?**
- [ ] Authorized Signatory Documents - **Required?**
- [ ] Previous Transportation Contracts - **Optional or required?**
- [ ] Financial Statements (for credit terms) - **When required?**

**B. Corporate Account Types - Different tiers?**
- [ ] **Corporate Gold** - What are the terms?
  - Monthly subscription fee?
  - Number of rides included?
  - Credit limit?
  - Payment terms (Net 30, Net 60)?
  
- [ ] **Corporate Platinum** - What are the terms?
  - Monthly subscription fee?
  - Number of rides included?
  - Credit limit?
  - Payment terms?
  
- [ ] **Corporate Diamond** - What are the terms?
  - Monthly subscription fee?
  - Number of rides included?
  - Credit limit?
  - Payment terms?

**C. Application Review Process - What is the exact procedure?**
1. **Initial Submission**
   - Company submits application with documents
   - System confirms receipt
   - Status: `pending`

2. **Credit Assessment** - **Required? Process?**
   - [ ] Credit check performed?
   - [ ] Minimum company size/employee count?
   - [ ] Financial vetting process?
   - [ ] Credit limit determination criteria?

3. **Approval Process**
   - [ ] Who approves corporate accounts?
   - [ ] Approval timeline (e.g., 5-10 business days)?
   - [ ] Approval criteria (revenue, employee count, industry)?

4. **Account Setup** - **After approval?**
   - [ ] Corporate package assignment?
   - [ ] Invoice generation setup?
   - [ ] Payment terms configuration?
   - [ ] Dedicated account manager assignment?
   - [ ] Corporate portal access setup?

5. **Billing & Payment**
   - [ ] Monthly invoice generation - automatic?
   - [ ] Payment methods accepted (bank transfer, check, M-Pesa)?
   - [ ] Late payment penalties?
   - [ ] Credit limit monitoring?

---

### 1.3 Chauffeur Applications

#### Current Implementation Status
- ✅ Multi-step form implemented (Personal, Professional, Documents)
- ✅ Categorized file upload (license front/back, CV, passport)
- ✅ Profile photo upload
- ✅ Professional information collection
- ⚠️ Additional documents and approval process need clarification

#### Questions Needing Clarification

**A. Required Documents - What specific documents are mandatory?**
- [x] Driving License (Front) - **Already implemented**
- [x] Driving License (Back) - **Already implemented**
- [x] CV/Resume - **Already implemented**
- [x] Passport Photo - **Already implemented**
- [ ] **Good Conduct Certificate** - **Required? Missing from form**
- [ ] **National ID/Passport** - **Required? Missing from form**
- [ ] **PSV Badge** - **Required? (Public Service Vehicle license)**
- [ ] **Medical Certificate** - **Required?**
- [ ] **Background Check Authorization** - **Required?**
- [ ] **Reference Letters** - **Optional or required? How many?**
- [ ] **Previous Employment Certificates** - **Optional or required?**

**B. Application Review Process - What is the exact procedure?**
1. **Initial Submission**
   - Applicant submits form with documents
   - System confirms receipt
   - Status: `pending`

2. **Document Verification**
   - [ ] License validity check - automated or manual?
   - [ ] License category verification (BCE, etc.)?
   - [ ] Expected review time (e.g., 3-5 business days)?

3. **Background Check** - **Required? Process?**
   - [ ] Criminal background check performed?
   - [ ] Who performs it (LuxeRide, third party)?
   - [ ] Cost - who pays?
   - [ ] Timeline for completion?

4. **Interview Process** - **Required? Format?**
   - [ ] Phone screening?
   - [ ] In-person interview?
   - [ ] Video interview?
   - [ ] Driving assessment/test?
   - [ ] Timeline (e.g., within 7 days of application)?

5. **Medical Examination** - **Required?**
   - [ ] Medical certificate required?
   - [ ] Who conducts the exam?
   - [ ] Cost - who pays?
   - [ ] Frequency (annual renewal)?

6. **Training & Certification** - **After approval?**
   - [ ] Orientation program?
   - [ ] Defensive driving training?
   - [ ] Customer service training?
   - [ ] LuxeRide standards training?
   - [ ] Timeline and duration?

7. **Onboarding** - **Final steps?**
   - [ ] Uniform/attire provided?
   - [ ] Mobile app access setup?
   - [ ] Vehicle assignment (if applicable)?
   - [ ] Payment method setup (M-Pesa, bank)?
   - [ ] Performance metrics explanation?

**C. Qualification Criteria - What are the minimum requirements?**
- [ ] Minimum years of driving experience (e.g., 3+ years)?
- [ ] Valid license categories required (e.g., BCE)?
- [ ] Minimum age requirement?
- [ ] Clean driving record requirement (no accidents/convictions)?
- [ ] Language requirements (English, Swahili minimum)?
- [ ] Education requirements?
- [ ] Physical fitness requirements?

---

## 2. Pricing Model & Cost Breakdown

### 2.1 Package Pricing & Ride Allocation

#### Current Package Structure

| Package | Monthly Fee | Rides Included | Cost Per Ride | Status |
|---------|-------------|----------------|---------------|--------|
| **Gold** | KES 150,000 | 20 rides | KES 7,500/ride | ✅ Defined |
| **Platinum** | KES 300,000 | 40 rides | KES 7,500/ride | ✅ Defined |
| **Diamond** | KES 500,000 | 60 rides | KES 8,333/ride | ⚠️ Inconsistent pricing |

#### Questions Needing Clarification

**A. Package Pricing Structure**
- [ ] **Why is Diamond package cost per ride higher?** (KES 8,333 vs KES 7,500)
  - Should all packages have the same cost per ride?
  - Or does Diamond include additional services/value?
  - Should we adjust Diamond to 66-67 rides to match KES 7,500/ride?

- [ ] **What happens if user exceeds their monthly ride allowance?**
  - Additional rides at what rate? (e.g., KES 7,500 per additional ride)
  - Is there a limit on additional rides?
  - Is there a premium rate for additional rides?
  - Or are additional rides not allowed?

- [ ] **What happens to unused rides at month end?**
  - Do they roll over to next month?
  - Or do they expire?
  - Maximum rollover limit?
  - If they expire, do we pro-rate or full refund?

- [ ] **Corporate package pricing - Same structure?**
  - Are corporate packages priced differently?
  - Bulk discounts for high-volume companies?
  - Custom pricing for enterprise clients?

**B. Ride Definition & Allocation**
- [ ] **What constitutes one "ride"?**
  - Point A to Point B (single destination)?
  - What about round trips? (counted as 1 or 2 rides?)
  - Multiple stops in one journey? (counted as 1 ride or multiple?)
  - Wait time included? (e.g., 30 minutes waiting = 1 ride or extra charge?)

- [ ] **Distance/time limits per ride?**
  - Maximum distance per included ride? (e.g., within Nairobi only)
  - Maximum duration per included ride?
  - Inter-city trips - do they count as 1 ride or multiple?
  - Airport transfers - special rules?

- [ ] **Package benefits beyond rides?**
  - Priority booking - how is this quantified?
  - Guaranteed availability - what does this mean?
  - Concierge services - included or extra charge?
  - Security detail (Diamond) - included or optional extra?

---

### 2.2 Revenue Sharing & Driver Payment

#### Current Revenue Split (from payment flow.md)
- **Vehicle Owner**: 50%
- **Chauffeur**: 32%
- **Platform (LuxeRide)**: 18%

#### Questions Needing Clarification

**A. Revenue Sharing Model - How does it work with subscriptions?**

**Option 1: Monthly Revenue Allocation (Recommended for Subscription Model)**
```
Monthly Subscription = KES 150,000 (Gold, 20 rides)

Revenue Allocation:
- Vehicle Owner: 50% = KES 75,000/month (fixed)
- Chauffeur: 32% = KES 48,000/month (fixed)
- Platform: 18% = KES 27,000/month (fixed)

Per Ride Allocation:
- Vehicle Owner: KES 3,750/ride
- Chauffeur: KES 2,400/ride
- Platform: KES 1,350/ride
```

**Questions:**
- [ ] **Is this the correct model?** (Fixed monthly allocation regardless of rides taken)
- [ ] **Or should it be per-ride based?** (Owner/Driver paid only when rides are completed)
  - If per-ride: How to handle unused rides? (Owner/Driver still get paid or not?)
  
- [ ] **Multiple vehicles per owner** - How to allocate?
  - Same split per vehicle?
  - Or aggregate allocation?

- [ ] **Multiple drivers per vehicle** - How to split driver share?
  - If vehicle has 2 drivers sharing shifts, how is 32% divided?
  - Based on rides completed by each driver?

**B. Driver Payment Calculation**

- [ ] **Base payment structure:**
  - Fixed monthly salary + commission?
  - Pure commission based on rides completed?
  - Hybrid model (base + variable)?

- [ ] **Payment schedule:**
  - Weekly payouts (as mentioned in payment flow.md)?
  - Monthly salary?
  - Instant payout option - what's the fee?

- [ ] **Additional compensation:**
  - Tips - who receives? (Driver keeps 100% or split?)
  - Overtime pay?
  - Performance bonuses?
  - Referral bonuses?

- [ ] **Deductions:**
  - Uniform costs?
  - Training fees?
  - Equipment costs (phone, app access)?
  - Any other deductions?

**C. Owner Payment Calculation**

- [ ] **Owner receives 50% of what?**
  - Of monthly subscription? (Fixed)
  - Of per-ride value? (Variable based on rides)
  - Minimum guarantee even if vehicle not used?

- [ ] **Owner responsibilities:**
  - Vehicle maintenance - owner's cost?
  - Fuel - owner's cost or platform's?
  - Insurance - owner maintains?
  - GPS/tracking device - who provides/maintains?

- [ ] **Payment schedule:**
  - Weekly payouts?
  - Monthly payouts?
  - Payment method (bank, M-Pesa)?

---

### 2.3 Trip Pricing & Additional Charges

#### Questions Needing Clarification

**A. Additional Charges Beyond Package**

- [ ] **Additional rides (beyond package allowance):**
  - Rate per additional ride? (e.g., KES 7,500)
  - Same rate as package or premium rate?

- [ ] **Special services:**
  - Airport transfers - standard ride or premium?
  - Inter-city trips - how priced?
  - Event transportation - special pricing?
  - Security detail (if not included) - pricing?
  - Wait time - how charged? (e.g., KES 500 per 30 minutes)

- [ ] **Distance/time-based charges:**
  - Is there a maximum distance included in package?
  - Extra charge for trips beyond certain distance?
  - Extra charge for trips beyond certain duration?

- [ ] **Vehicle upgrades:**
  - User requests higher tier vehicle than package - upgrade fee?
  - How is upgrade fee calculated?
  - Does it count as ride or additional charge?

**B. Cancellation & Refund Policy**

- [ ] **Cancellation by user:**
  - Before driver assigned - full refund or ride restored?
  - After driver assigned - ride restored or additional charge?
  - After driver arrived - ride restored or forfeited?
  - After ride started - no refund, correct?

- [ ] **Cancellation by driver/platform:**
  - Compensation to user? (free ride, upgrade, refund?)
  - Impact on driver/owner payment?

**C. Corporate Account Pricing**

- [ ] **Corporate pricing model:**
  - Same per-ride cost (KES 7,500)?
  - Bulk discounts?
  - Custom pricing for high-volume clients?

- [ ] **Invoicing:**
  - Monthly consolidated invoice?
  - Include ride details (date, time, driver, vehicle)?
  - Payment terms (Net 30, Net 60)?
  - Late payment fees?

- [ ] **Credit limits:**
  - How determined?
  - Monitoring and alerts?
  - Payment holds when limit exceeded?

---

## 3. Operational Clarifications

### 3.1 Ride Booking & Fulfillment

- [ ] **Booking process:**
  - Real-time booking or scheduled only?
  - Advance booking allowed (e.g., 24 hours)?
  - Minimum notice period?

- [ ] **Driver assignment:**
  - Automatic assignment or manual dispatch?
  - Criteria for assignment (proximity, availability, rating)?
  - Driver acceptance required before confirmation?

- [ ] **Vehicle assignment:**
  - How is vehicle tier matched to package?
  - Can Gold package users request Platinum/Diamond vehicles?
  - Upgrade process and fees?

### 3.2 Package Management

- [ ] **Package upgrades/downgrades:**
  - Can users upgrade mid-month?
  - Prorated billing?
  - Can users downgrade mid-month?
  - Refund policy?

- [ ] **Package renewals:**
  - Automatic renewal or manual?
  - Auto-payment setup required?
  - Renewal reminder process?
  - Grace period for payment?

- [ ] **Package cancellation:**
  - Notice period required?
  - Refund policy for unused rides?
  - Cancellation fees?

### 3.3 Quality & SLA

- [ ] **Service level agreements:**
  - Response time for ride requests?
  - Driver arrival time (e.g., within 15 minutes)?
  - Vehicle condition standards?
  - Driver behavior standards?

- [ ] **Quality monitoring:**
  - Customer ratings/reviews system?
  - Driver ratings impact payment?
  - Vehicle ratings impact owner payment?
  - Minimum rating thresholds?

- [ ] **Dispute resolution:**
  - Process for ride disputes?
  - Refund/adjustment process?
  - Timeline for resolution?

---

## 4. Technical Implementation Clarifications

### 4.1 Payment Processing

- [ ] **Payment gateway integration:**
  - Which payment provider? (M-Pesa, Stripe, Flutterwave?)
  - Subscription billing setup?
  - Auto-renewal payment processing?
  - Failed payment handling?

- [ ] **Payment reconciliation:**
  - Automatic payout calculation?
  - Manual approval required?
  - Reporting and statements?

### 4.2 Data & Reporting

- [ ] **Required reports:**
  - Revenue reports (daily, weekly, monthly)?
  - Driver/owner earnings statements?
  - Ride completion reports?
  - Package utilization reports?
  - Corporate account statements?

- [ ] **Analytics:**
  - Package performance metrics?
  - Customer retention metrics?
  - Driver/owner performance metrics?
  - Vehicle utilization metrics?

---

## 5. Legal & Compliance

### 5.1 Regulatory Requirements

- [ ] **Licensing:**
  - Required business licenses for LuxeRide?
  - PSV licensing requirements?
  - Vehicle licensing requirements?

- [ ] **Insurance:**
  - Required insurance coverage?
  - Passenger insurance requirements?
  - Driver insurance requirements?
  - Vehicle insurance requirements?

- [ ] **Data Protection:**
  - GDPR compliance requirements?
  - Local data protection laws?
  - Customer data retention policies?

### 5.2 Contracts & Agreements

- [ ] **Required contracts:**
  - Customer terms of service?
  - Car owner partnership agreement?
  - Driver employment/contractor agreement?
  - Corporate account agreement?

---

## 6. Next Steps & Priority

### High Priority (Required for MVP)
1. ✅ Clarify document requirements for all three applications
2. ✅ Define approval processes and timelines
3. ✅ Confirm package pricing structure (especially Diamond inconsistency)
4. ✅ Define revenue sharing model (fixed monthly vs per-ride)
5. ✅ Clarify what happens with unused rides
6. ✅ Define additional ride pricing

### Medium Priority (Required for Launch)
7. Define corporate package structure
8. Clarify driver payment structure
9. Define cancellation/refund policies
10. Define SLA and quality standards

### Low Priority (Post-Launch Enhancements)
11. Advanced reporting requirements
12. Analytics and metrics
13. Advanced package features

---

## Summary

This document captures all the critical questions that need answers before we can:
- Complete the application forms with proper validation
- Implement the correct pricing and payment logic
- Set up accurate revenue sharing calculations
- Build proper approval workflows
- Create comprehensive user agreements

