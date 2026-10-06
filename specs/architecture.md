# Architecture specification

Easy Exchange is a single Next.js App Router application. Pages, mutations, and auth run in one process. Domain logic for listings and the request state machine lives in modules that UI and tests both call.

Related specs: [product.md](product.md), [data-model.md](data-model.md), [ui.md](ui.md).

## Technology stack

| Layer | Choice |
| --- | --- |
| App | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS |
| Data | Prisma + SQLite |
| Auth | Auth.js (NextAuth) credentials provider |
| Validation | Zod |
| Unit/integration tests | Vitest |
| End-to-end tests | Playwright |

Do not introduce Redis, a separate Express API, Docker-required services, or OAuth providers in MVP.

## High-level diagram

```text
Browser (React Server Components + Client Components)
        │
        ▼
Next.js App Router
  ├── pages (catalog, listing, dashboard, auth, request)
  └── server actions / route handlers
        │
        ▼
Domain modules
  ├── listings
  └── requests (state machine)   ← core domain
        │
        ▼
Prisma Client  →  SQLite
Auth.js session (JWT is acceptable for MVP)
```

## Architectural rules

1. **Request transitions belong in one domain module** (for example `src/lib/requests.ts`). Pages and actions call that module; they must not each reimplement status rules.
2. **Listing status is a side effect of request transitions** (plus create/unpublish). See [data-model.md](data-model.md).
3. **Authorization is checked in the domain/server layer**, not only by hiding buttons.
4. **Zod schemas** validate create/update inputs on the server; the same shapes may drive client errors.
5. **Prisma is the only persistence API.** No ad-hoc SQL in components.

## Routes

| Route | Auth | Role |
| --- | --- | --- |
| `/` | Public | Catalog |
| `/listings/[id]` | Public | Detail; request if eligible |
| `/listings/new` | Authenticated | Create listing |
| `/listings/[id]/edit` | Owner | Edit listing |
| `/dashboard` | Authenticated | Listings and requests |
| `/login` | Public | Sign in |
| `/register` | Public | Sign up |
| `/requests/[id]` | Owner or requester | Status and actions |
| Auth.js route handler | System | Session |

## Main modules (planned)

| Module | Responsibility |
| --- | --- |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/auth.ts` | Auth.js config, credentials authorize, session helpers |
| `src/lib/validators.ts` | Zod schemas |
| `src/lib/listings.ts` | Create, update, unpublish, catalog query, get by id |
| `src/lib/requests.ts` | `createRequest`, `transitionRequest`, `canUserRequestListing` |
| `src/components/*` | UI listed in [ui.md](ui.md) |

## Planned repository layout

Created only during implementation (not in the spec phase):

```text
easy-exchange/
  specs/
  .cursor/skills/
  prisma/
    schema.prisma
    seed.ts
  src/
    app/
      page.tsx
      listings/[id]/page.tsx
      listings/[id]/edit/page.tsx
      listings/new/page.tsx
      dashboard/page.tsx
      login/page.tsx
      register/page.tsx
      requests/[id]/page.tsx
      api/auth/[...nextauth]/route.ts
    components/
    lib/
    types/
  tests/
    unit/requests.test.ts
    e2e/exchange.spec.ts
  .env.example
  README.md
```

## Implementation order

Follow this order. Do not skip ahead to later features before earlier slices work.

1. Specs + project skills + Cursor rules
2. Scaffold Next.js + Prisma schema + seed
3. Auth
4. Listings CRUD + catalog
5. Request state machine + UI
6. Dashboard
7. Tests + README demo script
8. Bugbot + security review

Step 1 is complete when `specs/` and `.cursor/skills/` exist. Cursor rules (`.cursor/rules/`) may be added at the start of implementation if they are not present yet.

## Out of scope for architecture

Separate mobile clients, message queues, email senders, object storage, and admin services are excluded (see [product.md](product.md) exclusion list).
