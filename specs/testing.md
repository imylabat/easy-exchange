# Testing specification

Tests prove the exchange loop and the state machine, not visual polish.

Related specs: [requirements.md](requirements.md), [data-model.md](data-model.md), [user-flows.md](user-flows.md).

## Levels

### 1. Domain unit tests (Vitest)

Target: `src/lib/requests.ts` (or equivalent) and listing side effects.

Must cover:

- Create request: listing `available` → request `pending`, listing `requested` (FR-4.1).
- Cannot request own listing (FR-4.2).
- Cannot request `requested`, `exchanged`, or `unpublished` listing (FR-4.3).
- Accept: owner only; `pending` → `accepted`; listing stays `requested` (FR-4.4).
- Decline: owner only; listing returns `available` (FR-4.5).
- Cancel: requester only; listing returns `available` (FR-4.6).
- Complete: owner or requester; listing `exchanged` (FR-4.7).
- Illegal: complete while `pending`; accept while `declined`; second open request (FR-4.8, FR-2.6).
- Unauthorized role rejected for each action.

### 2. Server-layer tests

- Unauthenticated create listing and create request denied (FR-1.4).
- Non-owner cannot accept/decline or edit listing (FR-2.2, FR-4.4).

These may be Vitest tests of server actions with a test database, or HTTP tests. Prefer a disposable SQLite file for tests.

### 3. Playwright happy path (one primary e2e)

Using seeded accounts:

1. Seeker logs in.
2. Seeker requests a seeded **available** listing.
3. Owner logs in (second browser context or sequential logout/login).
4. Owner accepts.
5. Either party completes.
6. Assert listing is absent from the catalog.

Optional second e2e (nice if time): decline restores catalog visibility.

### 4. Manual demo script (graders)

Document in README when the app exists:

1. Log in as demo owner (`specs` will not invent final emails until seed exists; use placeholders `owner@campus.edu` / `seeker@campus.edu` unless seed chooses others — then README must match seed).
2. Show catalog, open an available listing, request as seeker.
3. Accept as owner, complete, confirm listing gone from `/`.
4. Show decline or cancel on another pending listing if seeded.

Password for demo users must be in README and seed only (not a production secret).

## Seed data for tests

NFR-4: ≥2 users, ≥6 listings, statuses `available` / `requested` / `exchanged` represented.

Unit tests may construct records in isolation and need not depend on the full seed.

## What not to test in MVP

- Visual regression screenshots
- Load / performance
- OAuth
- Email delivery
- Mobile native apps

## Commands (planned)

Document exact scripts in README at implementation:

- Unit: `npm test` or `npx vitest`
- E2E: `npx playwright test`

Tests must be runnable locally against SQLite without extra infrastructure.
