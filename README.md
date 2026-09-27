# Nitu5 — Shared & Private Mobility Marketplace

> **"Move Together. Pay Fairly. Travel Safely."**

---

## 📌 Product Vision

**Nitu5** is a Nigerian mobility marketplace designed to connect riders with verified private vehicle owners and professional drivers travelling along the same or similar routes.

Unlike traditional ride-hailing platforms where one driver serves a single passenger, Nitu5 makes **shared-route transportation a core part of the daily commute**. Drivers can publish scheduled or leaving-soon journeys with available seats, allowing multiple compatible riders to book seats, negotiate fair prices, and share travel costs.

---

## 🌟 Core Pillars

1. **🚗 SHARE** — Multiple passengers travelling in the same direction share seats and cost.
2. **💬 NEGOTIATE** — Transparent fare suggestions with direct rider-driver negotiation.
3. **🛡️ VERIFY** — Tiered user verification & mandatory **Nitu5 QR Code Verification** before trip start.
4. **🔒 PROTECT** — Integrated Safety Centre with SOS, live trip tracking, and structured dispute management.
5. **💰 EARN & SAVE** — Vehicle owners monetize unused seat capacity while riders access affordable transportation.

---

## 🔥 Key Features

### 🚏 Ride Models & Creation
* **Shared Rides (Primary Experience):** Seat-level pricing on matching routes.
* **Private Rides:** Whole-vehicle bookings for privacy or groups.
* **Trip Types:** Scheduled Trips, Leaving-Soon Trips, and Instant On-Demand Rides.

### 💰 Fare & Pricing System
* **Suggested Range + Negotiation:** Platform-recommended fare ranges with offer & counter-offer capabilities.
* **Earnings Transparency:** Drivers view agreed fares, platform commissions, and net earnings before trip confirmation.

### 🔐 Safety & Trust
* **Tiered Verification:** Account, Identity, Driver & Vehicle verification levels with verified badges.
* **Nitu5 QR Verification:** Unique personal & trip QR codes scanned at pickup (`Scan → Match → Confirm → Start`).
* **Safety Centre:** In-app SOS button, live location sharing, and trusted contacts.

### 💳 Nigerian Payment Ecosystem
* Multi-channel support for **Cash**, **Debit/Credit Cards**, **Bank Transfers**, **USSD**, and **Nitu5 Wallet**.

---

## 📂 Repository Structure

```text
Nitu5/
├── docs/
│   └── NITU5 App.md    # Product Requirements Document (PRD)
├── .gitignore          # Git ignore rules
└── README.md           # Product documentation & overview
```

---

## 🎯 Target MVP Roadmap

* [x] **Product Requirements Definition (PRD v1.0)** — see [PRD.md](./PRD.md) (includes Appendix A: stack review, Appendix B: design note)
* [x] Rider & Driver Authentication + Tiered Verification
* [x] Journey Publishing & Shared-Route Matching Engine
* [x] Fare Negotiation & Seat Reservation System
* [x] QR Verification & Active Trip Safety Engine
* [x] Multi-channel Payment Gateway & Driver Wallet
* [x] Phone app (Expo: rider + driver worlds) & Admin website
* [ ] Real SMS + Paystack + live maps + test-flight builds

## 🖥️ Demo & Progress

* **Design preview (live):** https://htmlpreview.github.io/?https://github.com/Dio360/Nitu5/blob/main/design.html
* **PRD (live):** https://github.com/Dio360/Nitu5/blob/main/PRD.md
* **Progress:** backend Tier 1 complete and tested end-to-end (auth → trips → haggle → QR → ride → pay → rate → disputes → alerts); phone app through driver/rider worlds; admin dashboard live. Runs locally via `docker compose up` + `npm run dev` (see `docs/IMPLEMENTATION_PLAN.md`). Next: real providers, maps, builds.
* **Note:** the full app runs on a local PC by design (zero-cost phase) — clone the repo and follow `docs/IMPLEMENTATION_PLAN.md` §4 to run it.

---

## 📄 License

All rights reserved © 2026 Nitu5 Technologies.
