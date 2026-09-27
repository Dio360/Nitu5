# **NITU5**

## **Product Requirements Document (PRD)**

**Product:** Nitu5  
**Category:** Ride-Hailing, Shared Mobility & Private Ride Marketplace  
**Primary Market:** Nigeria  
**Product Model:** Shared Ride \+ Private Ride  
**Document Status:** Product Definition / MVP-to-Scale Blueprint

---

# **1\. Product Vision**

Nitu5 is a Nigerian mobility marketplace that connects riders with private vehicle owners and professional drivers travelling in the same or similar direction.

Unlike a traditional ride-hailing service where one driver primarily serves one passenger or group, Nitu5 makes **shared-route transportation a core part of the experience**.

A driver can publish a journey, indicate available seats and route, and allow multiple riders travelling along the same or similar route to book seats.

Nitu5 also supports conventional private rides for riders who want an entire vehicle.

### **Core proposition**

**Move together. Pay fairly. Travel safely.**

Nitu5 should make transportation:

* More affordable through shared rides  
* More flexible through fare negotiation  
* More accessible by allowing private vehicle owners and professional drivers to participate  
* Safer through identity, vehicle and trip verification  
* More transparent through recorded agreements  
* More convenient through scheduled, leaving-soon and instant rides  
* More trustworthy through ratings, trip history and accountability

---

# **2\. Product Principles**

Every major product decision should follow these principles:

### **1\. Shared rides first**

Shared mobility is Nitu5's primary differentiator.

Private rides should exist, but the product should consistently encourage suitable shared trips before defaulting to private transportation.

### **2\. Trust before transactions**

Users should know:

* Who they are travelling with  
* What vehicle they are entering  
* Where the trip is going  
* What fare was agreed  
* Whether the driver and vehicle are verified  
* Who else is booked on a shared trip

### **3\. Agreement means commitment**

Once a rider and driver agree on the fare and booking is confirmed, the agreement should be respected.

### **4\. Flexibility without chaos**

Drivers and riders should have flexibility to negotiate fares, pickup points and reasonable route deviations, but changes must remain controlled and transparent.

### **5\. Safety is always accessible**

Safety tools should remain available before, during and after a trip.

### **6\. Designed for Nigeria**

Nitu5 should accommodate the realities of Nigerian transportation:

* Cash payments  
* Bank transfers  
* USSD  
* Cards  
* Wallets  
* Traffic  
* Flexible pickup points  
* Major junctions and landmarks  
* Private vehicle owners  
* Professional drivers  
* Variable travel times  
* Negotiated fares

---

# **3\. Target Users**

## **3.1 Riders**

People looking for:

* Affordable transportation  
* Shared transportation  
* Private transportation  
* Scheduled journeys  
* Immediate transportation  
* Intercity transportation  
* Everyday commuting  
* Airport transportation  
* Event transportation  
* Group transportation

## **3.2 Private Vehicle Owners**

People who own cars and want to earn money by:

* Sharing available seats  
* Publishing journeys they are already taking  
* Offering private rides  
* Travelling scheduled routes

## **3.3 Professional Drivers**

Commercial drivers who want to:

* Accept shared passengers  
* Accept private bookings  
* Publish scheduled trips  
* Receive ride requests  
* Increase earnings  
* Build a trusted profile

---

# **4\. Driver Types**

Every driver profile must clearly identify the driver's category.

### **Private Driver**

A private vehicle owner using their personal vehicle.

### **Professional Driver**

A commercial/professional driver providing transportation services.

The distinction should be visible to riders before booking.

---

# **5\. Ride Types**

Nitu5 supports two primary ride types.

## **5.1 Shared Ride**

Multiple riders travelling on the same or similar route share available vehicle seats.

Example:

**Lekki → Ikeja**

Vehicle capacity: 4 passengers

* Rider A → Lekki Phase 1  
* Rider B → Yaba  
* Rider C → Ikeja  
* Rider D → Maryland

Nitu5 determines whether the destinations are sufficiently compatible with the trip.

Shared rides are the **primary Nitu5 experience**.

## **5.2 Private Ride**

One rider or group books the entire vehicle.

The rider pays for the vehicle rather than individual seats.

Private rides are useful when:

* The rider wants privacy  
* Multiple passengers are travelling together  
* The route is not suitable for sharing  
* The rider requires greater flexibility

---

# **6\. Trip Creation**

Drivers can create two main types of trips.

## **6.1 Scheduled Trip**

Driver specifies:

* Origin  
* Destination  
* Route  
* Potential stops  
* Departure date  
* Departure time  
* Available seats  
* Vehicle  
* Trip type  
* Fare  
* One-way/return  
* Trip description

## **6.2 Leaving Soon**

For trips departing relatively soon.

The driver can publish available seats and riders nearby or along the route can join.

## **6.3 Instant Ride**

Nitu5 should also support an on-demand experience similar to conventional ride-hailing.

The rider requests a ride immediately.

Drivers can accept the request and negotiate/confirm the fare where applicable.

This provides the convenience users expect from services such as traditional ride-hailing while preserving Nitu5's shared-trip identity.

---

# **7\. Fare System**

Nitu5 uses a **suggested fare \+ negotiation model**.

The platform provides a recommended fare range based on relevant journey characteristics.

The rider can propose a fare.

The driver can:

* Accept  
* Counter-offer  
* Decline

Example:

**Nitu5 suggested range:** ₦2,500–₦3,200

Rider offers:

**₦2,700**

Driver:

**Accept ₦2,700**

The agreed fare becomes part of the booking record.

---

# **8\. Shared-Ride Pricing**

For shared rides, pricing is primarily **per passenger/seat**.

Example:

Driver publishes:

**Lekki → Ikeja**  
₦3,000 per passenger  
4 seats

If three passengers book:

**₦3,000 × 3 \= ₦9,000 gross trip value**

The driver sees their expected earnings and Nitu5's applicable fee before accepting.

---

# **9\. Private-Ride Pricing**

Private rides use a vehicle-level fare.

Example:

**Lekki → Ikeja**

Private ride:

**₦8,000**

The rider books the entire vehicle.

---

# **10\. Seat Booking**

Nitu5 supports:

### **Individual seat booking**

A rider can reserve one seat.

### **Multiple-seat booking**

A rider can reserve multiple seats for:

* Friends  
* Family  
* Colleagues

### **Whole-vehicle booking**

A rider can book the entire vehicle as a private ride.

Shared seating remains the priority experience.

Once confirmed, booked seats are reserved and cannot be sold to another rider.

---

# **11\. Shared-Ride Matching**

Nitu5 should match riders based on:

* Origin  
* Destination  
* Route compatibility  
* Pickup location  
* Drop-off location  
* Departure time  
* Available seats  
* Vehicle capacity  
* Driver preferences  
* Rider preferences

The platform should prioritize trips where the rider can join with **minimal disruption to the existing journey**.

---

# **12\. Route Deviation**

Nitu5 adopts **C \+ B**.

The platform should identify whether a rider's requested pickup/drop-off creates a reasonable route deviation.

The system can recommend:

> "This passenger adds approximately X distance/time to your route."

The driver then decides whether to accept.

### **Driver controls**

Driver can:

* Accept deviation  
* Reject deviation  
* Suggest another pickup/drop-off point

### **Rider visibility**

The rider should understand:

* Whether the destination is on-route  
* Whether a deviation is involved  
* Any additional fare  
* Any expected time impact

A passenger should not be able to force a driver into a major detour.

---

# **13\. Pickup & Drop-off**

Nitu5 should recommend practical pickup points rather than automatically requiring door-to-door service.

Preferred locations include:

* Major junctions  
* Bus stops  
* Landmarks  
* Shopping centres  
* Transport hubs  
* Commercial areas  
* Main roads  
* Safe public locations

Example:

Instead of:

> "Pick me up at my house."

Nitu5 may suggest:

> **Ajah Bus Stop**

The driver and rider may agree on another reasonable location.

Safety and convenience should influence recommendations.

---

# **14\. Trip Changes**

Once a rider has booked a trip, the driver cannot freely alter the agreement.

### **Minor changes**

Reasonable minor adjustments can be made.

### **Major changes**

Major changes include:

* Fare  
* Route  
* Departure time  
* Vehicle  
* Pickup arrangement  
* Drop-off arrangement

Affected riders must be informed.

Where appropriate, they must approve the change.

If the rider does not accept the change, they receive protected cancellation treatment.

### **Emergency exception**

Changes caused by:

* Vehicle breakdown  
* Accident  
* Emergency  
* Road closure  
* Security issue  
* Other legitimate circumstances

may follow emergency procedures.

---

# **15\. Unfilled Shared Seats**

Nitu5 adopts the following rule:

Once a shared trip has a confirmed booking, the driver is generally expected to proceed.

Nitu5 continues searching for additional compatible passengers until shortly before departure.

Example:

Vehicle capacity: 4

Confirmed:

* Passenger 1  
* Passenger 2

Empty:

* 2 seats

Nitu5 continues matching.

If no additional riders are found, the driver still proceeds with the confirmed passengers unless a legitimate cancellation circumstance applies.

This protects rider confidence and prevents drivers from repeatedly cancelling under-filled trips.

---

# **16\. Trip Commitment**

Once both parties agree and booking is confirmed, the trip becomes a commitment.

### **Driver cancellation**

Cancellation without a legitimate reason may result in:

* Cancellation fee  
* Reduced trip reliability score  
* Reduced marketplace visibility  
* Temporary restrictions for repeated abuse

### **Rider cancellation**

Riders also have cancellation rules.

The consequences depend on:

* How early they cancel  
* Whether the driver is already travelling to pickup  
* Whether the trip has started  
* Whether there is a legitimate reason

Emergency and safety situations should be treated differently.

---

# **17\. Driver Verification**

Nitu5 uses tiered verification.

## **Level 1 — Account Verified**

* Phone  
* Email  
* Basic profile

## **Level 2 — Identity Verified**

* Government identification  
* Identity/selfie confirmation  
* Driver licence where applicable

## **Level 3 — Driver & Vehicle Verified**

Verification of:

* Driver  
* Vehicle ownership/authorization  
* Vehicle registration  
* Vehicle images  
* Required documents  
* Applicable insurance/documentation  
* Relevant vehicle checks

## **Level 4 — Fully Verified**

Additional applicable checks and safety verification.

Fully verified drivers receive a prominent verification badge.

---

# **18\. Rider Verification**

Riders should also have verification levels.

A rider profile may display:

* Phone verified  
* Identity verified  
* Completed trips  
* Rating  
* Account age  
* Verification badge

Verification requirements may increase for certain activities or risk levels.

---

# **19\. Vehicle Profiles**

Every driver vehicle profile should contain:

* Vehicle photos  
* Make  
* Model  
* Colour  
* Registration/plate information  
* Vehicle category  
* Seating capacity  
* Relevant vehicle description  
* Verification status

Before entering a vehicle, riders should be able to compare the displayed vehicle information with the physical vehicle.

---

# **20\. Nitu5 QR Verification**

QR verification is a major Nitu5 trust feature.

Every user has a Nitu5 identity QR.

Each trip also has a unique trip QR.

## **Trip verification**

Before departure:

**Scan → Match → Confirm → Start Trip**

The process verifies:

* Rider  
* Driver  
* Vehicle  
* Trip  
* Relevant route/booking information

## **Failed scan**

First failure:

* Allow retry  
* Explain the issue

Repeated failure:

* Prevent trip start  
* Trigger Nitu5 safety/support review  
* Record the incident

This should be visually distinctive and become part of Nitu5's brand identity.

---

# **21\. Safety Centre**

Nitu5 should have a dedicated Safety Centre.

Available to both riders and drivers.

### **Core safety features**

* SOS  
* Live trip tracking  
* Share trip  
* Trusted contacts  
* Safety reporting  
* Emergency assistance  
* Trip information  
* Driver/rider identification  
* Vehicle information

### **SOS**

Both parties can trigger SOS.

The interface should be extremely simple and accessible during an active trip.

---

# **22\. Safety Reports**

Users can report:

* Unsafe driving  
* Harassment  
* Threats  
* Wrong vehicle  
* Wrong driver/rider  
* Suspicious activity  
* Intoxication concerns  
* Route concerns  
* Payment fraud  
* Identity mismatch  
* Other safety incidents

Safety cases receive priority over ordinary payment disputes.

---

# **23\. Ratings & Reputation**

Nitu5 uses a two-way rating system.

### **Riders rate drivers**

Possible categories:

* Safe driving  
* Punctuality  
* Vehicle cleanliness  
* Communication  
* Behaviour  
* Pickup convenience

### **Drivers rate riders**

Possible categories:

* Punctuality  
* Communication  
* Behaviour  
* Respect  
* Pickup readiness

Only users who participated in a completed trip can submit a trip rating.

---

# **24\. New User Reputation**

Ratings should not be treated as definitive after only one or two trips.

New users can display:

> **New to Nitu5**

As users complete trips, their profile can show:

* Rating  
* Completed trips  
* Verification  
* Membership duration  
* Relevant badges

Example:

**John A.**  
⭐ 4.9  
127 completed trips  
✓ Fully Verified  
Private Driver  
Member since 2026

---

# **25\. Fraud & Dispute System**

Nitu5 should provide a structured dispute process.

Users can report:

* Fake payments  
* Payment outside the platform  
* Wrong fare  
* Fake bookings  
* QR mismatch  
* Wrong vehicle  
* Wrong person  
* Fake documentation  
* Cancellation abuse  
* No-show abuse  
* Rating manipulation  
* Harassment  
* Threats

---

# **26\. Dispute Process**

**Trip/Payment**

↓

**Dispute opened**

↓

**Evidence collected**

↓

**Nitu5 review**

↓

**Decision**

↓

**Funds released / refunded / adjusted**

Evidence may include:

* Booking record  
* Fare negotiation  
* Accepted offer  
* Payment record  
* QR verification  
* Trip status  
* Location/trip information  
* In-app communication  
* Cancellation record  
* Photos  
* Submitted evidence

For eligible disputes, Nitu5 can temporarily hold disputed funds while the case is reviewed.

---

# **27\. Payment Methods**

Nitu5 should support a broad Nigerian payment ecosystem:

* Cash  
* Debit/Credit Card  
* Bank Transfer  
* USSD  
* Nitu5 Wallet  
* Other appropriate Nigerian payment methods as the product expands

The agreed fare must always be recorded inside Nitu5 regardless of payment method.

---

# **28\. Digital Payment**

For digital payments:

1. Rider selects payment method.  
2. Fare is authorized/secured.  
3. Booking is confirmed.  
4. QR verification occurs.  
5. Trip starts.  
6. Trip completes.  
7. Settlement follows Nitu5's normal payment/dispute rules.

---

# **29\. Cash Payment**

For cash:

1. Fare is agreed inside Nitu5.  
2. Booking is confirmed.  
3. Trip begins.  
4. Rider pays according to the agreed terms.  
5. Driver confirms receipt.

Cash payments should still create a digital trip record.

---

# **30\. Nitu5 Wallet**

The wallet should eventually allow users to:

* Add money  
* Receive refunds  
* Receive promotional credits  
* Pay for rides  
* Receive driver earnings  
* Track transactions

Drivers should have a clear earnings balance and transaction history.

---

# **31\. Nitu5 Revenue Model**

Nitu5 adopts:

### **Shared Ride**

Lower platform commission.

Purpose:

* Encourage shared mobility  
* Increase driver participation  
* Keep rider prices attractive  
* Grow transaction volume

### **Private Ride**

Standard platform commission.

### **Premium Driver Membership**

Optional membership introduced as the marketplace matures.

Potential benefits:

* Increased visibility  
* Additional driver tools  
* Priority opportunities  
* Enhanced profile benefits  
* Potential commission advantages  
* Additional business features

There should be **no mandatory driver subscription at launch**.

---

# **32\. Driver Earnings Transparency**

Before accepting a trip, drivers should clearly see:

**Agreed fare**

**Nitu5 fee**

**Estimated driver earnings**

Example:

Fare: ₦5,000  
Nitu5 fee: ₦500  
Driver earnings: ₦4,500

This prevents confusion and builds trust.

---

# **33\. Driver Dashboard**

Drivers should have access to:

* Current trip  
* Upcoming trips  
* Available shared trips  
* Ride requests  
* Earnings  
* Completed trips  
* Ratings  
* Cancellation record  
* Vehicle profile  
* Verification status  
* Wallet  
* Support  
* Safety Centre

---

# **34\. Rider Dashboard**

Riders should see:

* Search/request ride  
* Nearby shared trips  
* Scheduled trips  
* Private rides  
* Upcoming bookings  
* Current trip  
* Past trips  
* Wallet  
* Payment history  
* Ratings  
* Saved locations  
* Trusted contacts  
* Safety Centre  
* Support

---

# **35\. Trip Discovery**

The rider should be able to search by:

* From  
* To  
* Date  
* Time  
* Number of passengers  
* Shared/private preference

Nitu5 should prioritize compatible **shared trips** before presenting private options where appropriate.

---

# **36\. Trip Card**

A shared-trip listing should clearly show:

**Driver**

**Driver type**

**Rating**

**Verification**

**Vehicle**

**Origin**

**Destination**

**Departure time**

**Available seats**

**Fare per seat**

**Route compatibility**

**Pickup options**

**Trip type**

The rider should understand the trip before opening the full details.

---

# **37\. Booking Flow**

Recommended shared-ride flow:

**Search**

↓

**Find compatible trip**

↓

**View driver \+ vehicle**

↓

**View route**

↓

**Select seat(s)**

↓

**Propose/accept fare**

↓

**Driver accepts**

↓

**Booking confirmed**

↓

**Payment authorization / payment arrangement**

↓

**Pickup**

↓

**QR verification**

↓

**Trip starts**

↓

**Live trip**

↓

**Trip completed**

↓

**Payment settlement**

↓

**Rating**

---

# **38\. Instant Ride Flow**

**Request ride**

↓

**Nitu5 identifies suitable drivers**

↓

**Driver receives request**

↓

**Fare accepted/negotiated**

↓

**Booking confirmed**

↓

**Driver travels to pickup**

↓

**QR verification**

↓

**Trip starts**

↓

**Trip completed**

↓

**Payment**

↓

**Rating**

---

# **39\. Shared Trip Lifecycle**

### **Before trip**

* Published  
* Searching for riders  
* Booking open  
* Booking confirmed  
* Nearly full  
* Full

### **During trip**

* Driver arriving  
* Pickup  
* QR verified  
* Trip started  
* Passenger pickup/drop-off events  
* Trip in progress

### **After trip**

* Completed  
* Payment settled  
* Ratings available

---

# **40\. Multi-Passenger Trip Management**

A driver should be able to see all confirmed passengers for a shared trip.

For each passenger:

* Name  
* Profile image where appropriate  
* Rating  
* Verification  
* Pickup  
* Drop-off  
* Seat  
* Fare  
* Booking status

Passengers should only see information necessary for a safe and useful shared journey.

---

# **41\. Passenger Pickup Sequence**

For shared rides, Nitu5 should intelligently organize pickups/drop-offs where practical.

The driver should receive a clear sequence such as:

**1\. Pickup A**

**2\. Pickup B**

**3\. Pickup C**

**4\. Drop-off A**

**5\. Drop-off B**

The route should minimize unnecessary delays.

---

# **42\. Driver Cancellation Protection**

Repeated cancellations should have consequences.

Nitu5 should monitor:

* Cancellation rate  
* Late cancellations  
* No-shows  
* Trip completion rate  
* Rider complaints

Drivers with repeated unreliable behaviour may receive:

* Warnings  
* Reduced visibility  
* Temporary restrictions  
* Additional verification/review

The objective is accountability rather than punishment.

---

# **43\. Rider Cancellation Protection**

The same principle applies to riders.

Repeated:

* No-shows  
* Last-minute cancellations  
* Fake bookings  
* Payment abuse

may affect their ability to make future bookings.

Legitimate emergencies should be treated differently.

---

# **44\. Notifications**

Important notifications should include:

### **Riders**

* Booking confirmation  
* Fare accepted  
* Driver accepted  
* Driver approaching  
* Pickup reminder  
* QR verification reminder  
* Trip started  
* Trip completed  
* Payment confirmation  
* Driver cancellation  
* Route/time change  
* Safety alerts

### **Drivers**

* New booking  
* Fare offer  
* Fare counter-offer  
* Booking confirmation  
* New passenger  
* Trip reminder  
* Route deviation request  
* Cancellation  
* Payment confirmation  
* Safety alert

---

# **45\. Support**

Nitu5 should provide in-app support for:

* Booking problems  
* Payment problems  
* Driver/rider disputes  
* Verification  
* Cancellation  
* Lost items  
* Safety incidents  
* Fraud  
* Account problems

Safety cases should have priority handling.

---

# **46\. Lost & Found**

After a completed trip, users should be able to report lost belongings.

The trip record should make it easy to identify:

* Driver  
* Vehicle  
* Date  
* Route  
* Other relevant trip details

Communication should remain controlled through Nitu5.

---

# **47\. Notifications & Communication**

Rider-driver communication should be available within the trip context.

Communication should support:

* Text messages  
* Standard quick messages  
* Pickup instructions  
* Location clarification

Personal contact information should not need to be exposed unnecessarily.

---

# **48\. Trust Profile**

Every user should gradually build a Nitu5 reputation.

The profile can contain:

* Verification  
* Rating  
* Completed trips  
* Cancellation behaviour  
* User type  
* Vehicle information for drivers  
* Membership duration  
* Relevant badges

The objective is to make trust visible before a transaction.

---

# **49\. Recommended Nitu5 Badges**

Potential badges:

### **✓ Identity Verified**

Identity verification completed.

### **🚗 Vehicle Verified**

Vehicle information verified.

### **⭐ Trusted Driver**

Based on defined completed-trip and reliability criteria.

### **🛡 Fully Verified**

Higher verification level completed.

### **🆕 New to Nitu5**

For users without sufficient trip history.

Badges should be based on clear rules rather than subjective judgement.

---

# **50\. Business Model**

Nitu5 can eventually generate revenue from:

1. Ride commissions  
2. Premium driver memberships  
3. Business/corporate transportation  
4. Intercity transportation  
5. Fleet partnerships  
6. Event transportation  
7. Airport transportation  
8. Promotional partnerships  
9. Corporate accounts  
10. Additional premium marketplace services

The initial focus should remain on building a reliable shared-ride marketplace.

---

# **51\. Corporate & Business Accounts**

A later expansion can allow companies to create business accounts.

Features could include:

* Employee transportation  
* Corporate ride booking  
* Business billing  
* Multiple employees  
* Travel records  
* Company payment methods  
* Scheduled transportation

This creates a B2B opportunity beyond individual riders.

---

# **52\. Intercity Shared Travel**

Nitu5 should eventually support longer journeys such as:

**Lagos → Ibadan**

**Lagos → Benin**

**Abuja → Kaduna**

**Lagos → Ilorin**

Drivers can publish scheduled journeys with available seats.

This is particularly compatible with Nitu5's shared-seat model.

---

# **53\. Event Transportation**

Nitu5 can support:

* Weddings  
* Conferences  
* Concerts  
* Religious events  
* Corporate events  
* Sporting events  
* Festivals

Drivers can publish trips around major events.

---

# **54\. Airport Transportation**

Nitu5 can eventually provide:

* Airport pickup  
* Airport drop-off  
* Shared airport rides  
* Private airport rides  
* Scheduled airport trips

This can become a high-value use case.

---

# **55\. Product Differentiation**

Nitu5 should not position itself simply as another Uber/Bolt alternative.

Its core distinction is:

### **Traditional ride-hailing**

**Passenger → Driver → Trip**

### **Nitu5**

**Driver → Route → Available Seats → Multiple Compatible Riders**

This makes Nitu5 a **route-based mobility marketplace**, not merely a taxi-hailing service.

---

# **56\. MVP Priority**

The initial product should prioritize the features that make the core marketplace work.

## **Tier 1 — Essential**

* Rider registration  
* Driver registration  
* Driver verification  
* Vehicle verification  
* Driver profiles  
* Rider profiles  
* Shared rides  
* Private rides  
* Scheduled trips  
* Leaving-soon trips  
* Instant rides  
* Route matching  
* Seat booking  
* Fare negotiation  
* Pickup/drop-off management  
* Booking confirmation  
* QR verification  
* Payments  
* Driver earnings  
* Ratings  
* Safety Centre  
* SOS  
* Trip tracking  
* Dispute reporting  
* Cancellation management  
* Notifications  
* Support

## **Tier 2 — Important**

* Wallet  
* Trusted contacts  
* Advanced driver reputation  
* Route deviation recommendations  
* Saved locations  
* Lost & found  
* Better trip discovery  
* Intercity rides

## **Tier 3 — Expansion**

* Premium Driver Membership  
* Corporate accounts  
* Event transportation  
* Airport marketplace  
* Fleet partnerships  
* Advanced loyalty/rewards  
* Promotional marketplace  
* Additional mobility services

---

# **57\. Key Product Metrics**

Nitu5 should monitor:

### **Marketplace**

* Number of active riders  
* Number of active drivers  
* Number of shared trips  
* Number of private trips  
* Booking conversion  
* Completed trips  
* Repeat riders  
* Repeat drivers

### **Shared Mobility**

* Average seats booked per trip  
* Average vehicle occupancy  
* Percentage of trips with multiple riders  
* Average empty seats  
* Matching success rate

### **Reliability**

* Driver cancellation rate  
* Rider cancellation rate  
* Trip completion rate  
* Late cancellation rate  
* No-show rate

### **Trust & Safety**

* Verification completion  
* QR verification success  
* Safety reports  
* Fraud reports  
* Dispute frequency  
* Resolution time  
* Serious incident rate

### **Financial**

* Gross ride value  
* Nitu5 revenue  
* Driver earnings  
* Average fare  
* Shared vs private revenue  
* Premium membership adoption

---

# **58\. Nitu5's Core Experience**

The ideal Nitu5 experience should feel like:

> **"I'm already going there — why not take people going the same way?"**

A driver should be able to publish:

**"I'm leaving Lekki for Ikeja at 7:00 AM. I have 3 seats available."**

Nitu5 finds compatible riders.

Riders see:

**Verified driver → Verified vehicle → Route → Fare → Available seat → Rating**

They negotiate if necessary.

They book.

They meet at a convenient pickup point.

They scan the Nitu5 QR.

The trip starts.

Everyone reaches their destination.

Payment is completed.

Both parties rate each other.

That is the fundamental Nitu5 loop.

---

# **59\. Final Product Strategy**

Nitu5 should be built around five interconnected pillars:

### **1\. SHARE**

Multiple passengers can travel together.

### **2\. NEGOTIATE**

Riders and drivers can agree on a fair fare.

### **3\. VERIFY**

People, vehicles and trips can be verified.

### **4\. PROTECT**

Safety, QR verification, tracking, disputes and accountability protect users.

### **5\. EARN**

Drivers can monetize available vehicle capacity while riders gain access to potentially more affordable transportation.

---

# **60\. Nitu5 Product Positioning**

### **Short positioning**

**Nitu5 — Move Together. Pay Fairly. Travel Safely.**

### **Product description**

Nitu5 is a Nigerian mobility marketplace connecting riders with verified private vehicle owners and professional drivers for shared and private journeys.

Its signature experience allows drivers to publish routes with available seats and lets compatible riders travelling in the same direction join the journey, negotiate fares and share the trip.

---

# **61\. Final Locked Decisions**

| Product Area | Decision |
| ----- | ----- |
| Ride model | Shared \+ Private |
| Priority | Shared rides first |
| Driver types | Private owners \+ Professional drivers |
| Trip creation | Scheduled \+ Leaving Soon |
| Instant rides | Yes |
| Fare | Nitu5 suggested range \+ negotiation |
| Seat booking | Individual \+ multiple \+ whole vehicle |
| Pickup | Nitu5 suggestions \+ agreed alternatives |
| Verification | Tiered verification |
| QR | Personal \+ Trip QR |
| QR failure | Retry → repeated failure triggers safety review |
| Safety | Full Safety Centre \+ SOS |
| Ratings | Two-way ratings \+ trip history |
| Fraud | Structured dispute system |
| Payments | Cash \+ digital methods |
| Commission | Shared/private differentiated |
| Driver subscription | Optional later |
| Trip changes | Major changes require rider protection/approval |
| Unfilled shared trips | Continue matching; trip generally proceeds |
| Route deviations | Nitu5 recommends \+ driver approves |
| Cancellation | Commitment-based |
| Marketplace identity | Shared-route mobility marketplace |

---

# **62\. Product North Star**

The ultimate goal is not simply to complete more rides.

It is to make **every available vehicle seat a potential mobility resource**.

If a vehicle is already travelling from Lekki to Ikeja with three empty seats, Nitu5 should make it possible for compatible people along that route to use those seats safely, conveniently and fairly.

That is the core idea that should distinguish Nitu5 from conventional ride-hailing.

---

# **Appendix A — Implementation Plan Review (Build Note, Sep 2026)**

**Framework:** TypeScript everywhere — NestJS backend (`apps/api`), Expo React Native phone app (`apps/mobile`), Next.js admin website (`apps/admin`), one shared workspace.

**Database:** PostgreSQL 16 + PostGIS (trips need map points; money needs strict tables). Small fast store: Redis (seat holds, codes). Background jobs: BullMQ worker.

**Authentication:** Phone-number login codes (mock sender prints to console in dev; real SMS later). Short-life access pass (15 min) + long-life refresh pass (30 days). Roles: rider, private driver, professional driver, staff. Four trust levels L1–L4 plus car checks.

**File storage:** Any S3-style store. Free local mock (S3Mock) now; Cloudflare R2 later — same language, one setting changes.

**Where it runs (for now):** **Everything on one local PC — the app AND the database.** Docker boxes for Postgres, Redis, file mock, mail catcher; backend on port 3000, admin site on 3001, phone app via Expo Go on the same WiFi. No cloud, no paid services yet.

**Why these decisions:**
- One language everywhere = one person can fix anything, shared money/seat rules can't drift apart.
- Postgres + PostGIS = map search and money records stay correct (no loose data).
- Phone codes = Nigeria is phone-first; no passwords to forget or leak.
- S3-style files = private photo links, easy move to real cloud later.
- Local PC first = ₦0 cost while learning and testing; cloud only when real users arrive.

# **Appendix B — Design Preview Note (design.html, Sep 2026)**

**File:** `design.html` (repo root) — one page showing colors (Bolt green `#34BB78`, ink, warm grey, highlight yellow, danger red), typography scale (hero/title/body/meta/fare), five styled buttons, three sample inputs, one trip card. Open by double-clicking.

**Refinement requested and applied (one specific change): clearer inputs.**
Before: thin 1px grey border, no visible sign of where you type.
After: roomier boxes (13px padding, 16px text) and a visible focus state — border turns Bolt green (2px) with a soft green glow. Click any box in `design.html` to see it. Verified in the file before saving.

**Earlier style history (for the record):** started Trust-green, tried Uber/Bolt-simple and youthful QR, then Gumroad chunk, then settled on Bolt-style clean (green + warm greys) with plain words everywhere (no underscores on screen).

