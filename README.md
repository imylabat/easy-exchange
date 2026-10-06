# Easy Exchange

Campus textbook exchange for students: **list → request → accept/decline → complete**. Local pickup only. No payments, shipping, or in-app chat.

## Specifications (source of truth)

- [Product](specs/product.md) — users, MVP, exclusion list
- [Requirements](specs/requirements.md) — user stories, functional and non-functional requirements
- [Architecture](specs/architecture.md) — stack, structure, implementation order
- [Data model](specs/data-model.md) — entities and request state machine
- [User flows](specs/user-flows.md)
- [UI](specs/ui.md)
- [Testing](specs/testing.md)
- [Skills](specs/skills.md) — Cursor Skills for planning and implementation

Project skills live under [`.cursor/skills/`](.cursor/skills/).

## Local setup

```bash
cp .env.example .env
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000). This slice is the Next.js + Prisma foundation only (no auth or catalog UI yet).

### Demo accounts (seeded)

| Email | Password | Role in seed data |
| --- | --- | --- |
| `owner@campus.edu` | `campus-demo` | Owns most listings |
| `seeker@campus.edu` | `campus-demo` | Has pending, accepted, and completed requests |

Passwords are stored hashed (`passwordHash`). Do not commit `.env` or the SQLite file.

### Useful commands

```bash
npm run dev          # development server
npx prisma migrate dev
npx prisma db seed
npx tsc --noEmit     # type check
npm run build
```
