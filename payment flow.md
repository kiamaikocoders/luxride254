# LuxeRide Payment Architecture Overview

## 1. Payment Architecture Overview
Client → LuxeRide Merchant Account (Till / Bank) → Automated Split → Owner & Chauffeur Payout

---

## 2. Step-by-Step Flow

### Step 1 — Booking & Fare Confirmation
- Client selects service (Gold / Platinum / Diamond or Chopper / Boat).
- App/web shows final fare (including VAT, surcharges, tips if applicable).
- Client confirms payment method:
  - M-Pesa STK Push (primary for Kenya)
  - Credit/Debit Card (Visa, Mastercard, Amex)
  - Bank Transfer (corporate accounts)
  - USD/EUR payment (international clients)

### Step 2 — Payment to LuxeRide
- All payments go to LuxeRide's merchant account (M-Pesa till number / bank account).
- No driver cash handling unless pre-approved offline booking (rare).
- Real-time payment confirmation triggers dispatch release.

### Step 3 — Revenue Allocation Logic
Automated settlement rules in LuxeRide backend:

| Component            | Formula         | Notes                                      |
|--------------------- |----------------|--------------------------------------------|
| Vehicle Owner Share  | Fare × Owner % | Paid to partner bank or M-Pesa business account |
| Chauffeur Share      | Fare × Chauffeur % | Paid to chauffeur M-Pesa personal account |
| LuxeRide Commission  | Fare × Platform % | Retained in LuxeRide account              |

**Example for Diamond-tier fare KES 12,000:**
- Owner (50%) → KES 6,000
- Chauffeur (32%) → KES 3,840
- LuxeRide (18%) → KES 2,160

### Step 4 — Payout Cycle
- Weekly Payouts (Friday) — default for all partners & chauffeurs.
- Instant Payout Option for chauffeurs at small processing fee.
- Corporate/event bookings: payouts happen after client invoice settlement (14–30 days).

### Step 5 — Corporate/Event Billing
- Monthly consolidated invoice includes:
  - Trip details, date/time, driver, vehicle tier.
  - SLA compliance summary.
  - Total payable amount in KES/USD.
- Corporate client pays into LuxeRide account → funds flow through standard split logic.

---

## 3. Partner & Chauffeur Transparency

### Safeguards
- Partner Portal – Owners & chauffeurs can log in to see trip history, earnings, and SLA score.
- Automatic Splits – Reduce disputes by locking payment rules in the system.
- Fraud Flags – Alerts if a trip was completed but payment didn’t go through till (cash handling exceptions).

**Partner Portal / Chauffeur App Dashboard includes:**
- Trip history with timestamps.
- Earnings breakdown per trip.
- SLA performance rating.
- Upcoming scheduled bookings.
- Payout history & next payout date.

---

## 4. Fraud & Compliance Controls
- Payment Verification – Trip cannot be marked “complete” unless payment is confirmed in LuxeRide’s account.
- Cash Exception Log – Any cash trip logged with reason & approval (rare).
- Payout Hold Option – If SLA breach, LuxeRide can withhold or adjust payout for that trip.

---

## 5. Why This Works for Premium Model
- Full control of cash flow → ensures quality enforcement.
- Simplifies corporate accounting → single invoice for multi-service bookings.
- Protects owners & chauffeurs → no disputes over cash handling.
- Supports cross-service billing → easy to combine car + chopper + boat in one invoice.
