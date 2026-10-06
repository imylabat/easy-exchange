---
name: request-state-machine
description: >-
  Enforces Easy Exchange request transitions, permissions, and listing
  status side effects. Use when implementing or testing create request,
  accept, decline, cancel, complete, listing status, open requests,
  or FR-4 / the request state machine.
---

# Request state machine

All request status changes go through one domain module (planned: `src/lib/requests.ts`). UI must not invent extra transitions.

Canonical table: [specs/data-model.md](../../../specs/data-model.md).  
Requirements: [specs/requirements.md](../../../specs/requirements.md) FR-2.6 and FR-4.x.  
Tests: [specs/testing.md](../../../specs/testing.md).

## Legal transitions (summary)

- `create` → `pending` (not owner; listing `available`) → listing becomes `requested`
- `pending` + owner `accept` → `accepted` (listing stays `requested`)
- `pending` + owner `decline` → `declined` (listing `available`)
- `pending` + requester `cancel` → `cancelled` (listing `available`)
- `accepted` + owner or requester `complete` → `completed` (listing `exchanged`)

At most one open request (`pending` or `accepted`) per listing.

## Rules for code

1. Reject anything not in the legal table; do not mutate rows on rejection.
2. Enforce permissions on the server, not only by hiding buttons.
3. Unpublish is listing-only and only from `available` (FR-2.4).
4. Add Vitest cases for happy paths and illegal transitions before considering the slice done.

Do not add chat, notifications, or extra request states.
