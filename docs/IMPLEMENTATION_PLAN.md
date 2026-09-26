# Nitu5 — Detailed Implementation Plan (PRD v1.0 → Build)
> **LOCAL-FIRST, ZERO-SUBSCRIPTION EDITION — v2**

Source of truth: `docs/NITU5 App.md` (62 sections), `README.md` product vision.
North Star: *“Every available vehicle seat is a potential mobility resource”* (`docs/NITU5 App.md:1645-1651`).
Pillars: SHARE / NEGOTIATE / VERIFY / PROTECT / EARN (`docs/NITU5 App.md:1578-1598`).

**Hard constraints (user-locked):**
1. No subscriptions — everything runs free/local for now.
2. DB on local device (PostgreSQL + PostGIS + Redis via Docker).
3. Files on Cloudflare R2 API, but S3Mock locally (same S3 API, swap via 1 env var).
4. Email via Resend free tier (ZeptoMail as later swap), Mailpit locally.
5. No AWS / Vercel — host on this PC via Docker Compose + Caddy + Cloudflare Tunnel.

Current repo: docs-only + this plan + `docker-compose.yml`. Remote `origin → https://github.com/Dio360/Nitu5.git`.

---

## 0. Architectural Decisions (locked, local-first)

### ADR-001 — Monorepo + TypeScript end-to-end (unchanged)
```text
Nitu5/
├── apps/
│   ├── mobile/      # Expo React Native (rider + driver, role switch)
│   ├── admin/       # Next.js back-office (verification, disputes, safety)
│   └── api/         # NestJS REST + WebSocket gateway
├── packages/
│   ├── ui/          # Nitu5 Design System (Trust Green #0A7A3B etc.)
│   ├── domain/      # Shared fare/matching/QR rules, zod schemas
│   ├── email/       # React Email templates (Resend-compatible)
│   ├── api-client/  # Typed client (OpenAPI-generated)
│   └── config/      # eslint, tsconfig, jest
├── services/
│   └── worker/      # BullMQ: matching fan-out, settlement, reminders
├── infra/           # Caddyfile, tunnel docs (no Terraform for now)
└── docs/            # PRD, plan, ADRs, runbooks
```

### ADR-002 — Mobile: Expo React Native + OSM (no Google)
- Expo Router, React Query + Zustand, `expo-camera` for QR.
- Maps: `react-native-maps` with **OpenStreetMap tiles** (free) + Nominatim geocode + self-hosted OSRM later. `MapProvider` interface so Google can plug in later without touching screens.
- Verdict: **zero map bill for MVP; corridors still cached in PostGIS.**

### ADR-003 — Backend: NestJS modular monolith + LOCAL Postgres/PostGIS + Redis
- Modules: `auth, users, verification, vehicles, trips, bookings, negotiations, qr, safety, payments, wallet, ratings, disputes, notifications, support`.
- **DB:** `postgis/postgis:16-3.4` container, volume `pgdata`. Redis `redis:7-alpine` for seat holds (10-min TTL, PRD §10), OTP rate-limit, live GPS pub/sub. BullMQ for jobs.
- Manage with **DBeaver Community (free)**. Backups: `scripts/backup-db.ps1` → `pg_dump` to `./backups/`.
- Verdict: **no Neon/Supabase/RDS. Local Docker only.**

### ADR-004 — Maps & Routing (free)
- Geocode: Nominatim (public demo rate-limited → self-host later via Docker if needed).
- Routing: OSRM public demo for dev → `osrm/osrm-backend` Docker with Nigeria extract when volume grows.
- Pickup rule unchanged: snap to junction/bus-stop/landmark ≤400m (PRD §13).

### ADR-005 — Auth: Phone OTP **mocked locally**, Termii later
- `SmsProvider` interface: `ConsoleSmsProvider` (prints OTP to API logs + Mailpit) in dev; `TermiiProvider` in prod via env swap. No SMS spend during build.
- JWT access (15m) + rotating refresh (30d, device-bound). Roles: `RIDER, PRIVATE_DRIVER, PROFESSIONAL_DRIVER, ADMIN, SUPPORT`.

### ADR-006 — Payments: ledger-first, **manual/transfer-first**, Paystack later
- All fares recorded in-ledger regardless of rail (PRD §27). Dev: cash + manual-transfer confirm + internal wallet ledger (no gateway keys needed).
- `PaymentProvider` interface ready for Paystack/Flutterwave when you go live. Commission split at capture: shared lower %, private standard (PRD §31).
- Verdict: **build the full ledger + cash flow now; plug Paystack keys later, zero code change.**

### ADR-007 — Files: S3Mock local → R2 later (same S3 API)
- Dev: **S3Mock** (`adobe/s3mock`, free, no login) at `localhost:9090`, bucket `nitu5` (auto-created by the API via CreateBucket). Prod swap: set `S3_ENDPOINT=https://<account>.r2.cloudflarestorage.com` + R2 keys. R2 free 10GB, zero egress — no sub.
- Private bucket + 15-min presigned URLs for IDs/vehicle photos/evidence (NDPR-friendly).
- Verdict: **S3Mock now, R2 when public. One env change.**

### ADR-008 — Email: Resend (free 3k/mo) + Mailpit local
- Dev: **Mailpit** (`axllent/mailpit`) at `localhost:8025` catches everything, zero sends.
- Prod: **Resend** free tier via `EmailProvider` interface; ZeptoMail/SES swappable later. Templates in `packages/email` (React Email).
- Verdict: **Mailpit now, Resend key only when you need real sends.**

### ADR-009 — Hosting: this PC (no AWS/Vercel)
- `docker-compose.yml` runs: `db, redis, s3, mailpit` (+ `api`, `worker` uncommented once Dockerfiles exist). Caddy as reverse proxy (`localhost` → services). Remote phone testing via **`cloudflared tunnel` (free)** or Tailscale.
- Rules: PC stays on, no sleep during dev; nightly `pg_dump` + backups to external drive (S3Mock is ephemeral dev storage).
- CI: GitHub Actions free (public repo): lint → typecheck → test → `docker compose config` validate.
- Verdict: **$0 hosting until traction. Migrate to cloud only when leaving the PC.**

### ADR-010 — Observability without subs
- Errors: **Sentry free tier (5k events/mo)** OR self-hosted **GlitchTip** (Sentry-compatible, Docker). Start with Sentry free; move to GlitchTip if you exceed.
- Analytics: **PostHog self-host Docker** (or PostHog Cloud free 1M events) for funnels §57. Start with Cloud free, self-host if needed.
- Logs: Docker JSON logs + `docker compose logs`. No Datadog/New Relic.

---

## 1. Design System Phase (Phase 0 — Week 1-2) — unchanged
Tokens locked: Trust Green `#0A7A3B`, Amber `#F59E0B`, SOS Red `#D92D20`, Ink `#101828`. Preview: `docs/design-system-preview.html`. Build `packages/ui` (NativeWind) + Storybook. TripCard per PRD §36, fare sheet §7, QR `Scan→Match→Confirm→Start` §20, earnings split §32.

## 2. Domain & Data Model (Phase 1 — Week 2-3) — unchanged schema
See v1 plan for full Prisma schema (User/Vehicle/Trip/Booking/Negotiation/QrSession/SafetyReport/Dispute/LedgerEntry/Rating/Notification). Seat-hold via local Redis, commitment rules §15-16, deviation C+B §12.

## 3. Phased Build (local milestones)
- **Phase A (3-5):** Auth (mock OTP) → profiles → vehicle CRUD (S3 presigned URLs) → verification queue L1-L4. **Run:** `docker compose up db redis s3 mailpit`, `pnpm --filter api dev`.
- **Phase B (5-7):** Scheduled/Leaving-Soon create, OSM search + PostGIS corridor match, lifecycle states §39.
- **Phase C (7-9):** Offer/counter/accept/decline, seat reservation (Redis), earnings preview, trip-change approvals §14, pickup optimizer §41.
- **Phase D (9-11):** Personal+Trip QR, live GPS via Socket.io, Safety Centre + SOS (Mailpit SMS log + console), masked chat §47.
- **Phase E (11-13):** Cash/manual-transfer settlement + wallet ledger, dashboards §33-34, two-way ratings §23-24.
- **Phase F (13-15):** Disputes §25-26, cancellations §42-43, lost & found §46, notifications §44, support §45 → **MVP exit (Tier 1 §56).**
- **Phase G/H:** Tier 2/3 only after live keys (Paystack, Termii, R2, Google) are funded.

## 4. Local Runbook
```powershell
# first boot
docker compose up -d db redis s3 mailpit
docker compose ps
# db: localhost:5432 (nitu5/nitu5) · redis: 6379 · s3 API: 9090 · mailpit SMTP: 1025 UI: 8025
# bucket nitu5 is auto-created by the API on first upload (CreateBucket)
# verify
docker compose logs db --tail 20
```
API env (see `.env.example`): `DATABASE_URL=postgresql://nitu5:nitu5@localhost:5432/nitu5`, `REDIS_URL=redis://localhost:6379`, `S3_ENDPOINT=http://localhost:9090`, `SMTP_HOST=localhost:1025`, `SMS_PROVIDER=console`, `MAP_PROVIDER=osm`.

## 5. Testing & Gates — free tools only
Vitest/Jest unit (fare/matching/ledger) ≥80%, Pact contract, Detox/Maestro E2E (search→negotiate→book→QR→complete→pay→rate), k6 smoke for double-book race. No paid QA SaaS.

## 6. Metrics (§57) — PostHog free from day 1
Marketplace, occupancy, reliability, trust (QR success, dispute SLA), financial (GMV split shared/private).

## 7. Risks (local edition)
PC sleeps → disable sleep; disk dies → nightly dumps; OSM rate limits → cache + self-host OSRM extract; SMS unpaid → mock OTP until Termii funded.

## Immediate Next Steps
1. `docker compose up -d` infra (done via this change).
2. Scaffold Turborepo + `packages/domain` + `packages/ui` tokens.
3. `apps/api` NestJS + Prisma against local PostGIS; `apps/mobile` Expo against `http://<PC-LAN-IP>:3000` + tunnel for device testing.
4. Vertical slice: mock-OTP → L1 → vehicle photo (S3Mock) → L3 badge.
