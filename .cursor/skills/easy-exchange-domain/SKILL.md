---
name: easy-exchange-domain
description: >-
  Applies Easy Exchange campus textbook domain language and MVP scope.
  Use when working on listings, catalog, search, users, auth, dashboard,
  pickup notes, owners, seekers, or product copy.
---

# Easy Exchange domain

Campus textbook exchange. Local in-person handoff only.

## Vocabulary

| Term | Meaning |
| --- | --- |
| Listing | A book an owner offers |
| Request | Handshake for one listing between seeker and owner |
| Owner | Listing creator |
| Seeker / requester | User who requested the listing |
| Exchange | Completed local handoff (`completed` request, listing `exchanged`) |
| Pickup note | Unstructured meetup text; not chat, not notifications |

Do not use buy, cart, order, payment, or shipping language in UI or schema.

## MVP behavior

- Auth: email + password (Auth.js credentials). No OAuth, verification, or password reset in MVP.
- Catalog shows only `available` listings. Search is case-insensitive on title, author, course code.
- Cover images are optional URLs only (no uploads).
- Dashboard: my listings, incoming requests, outgoing requests.

Full field lists and exclusions: [specs/product.md](../../../specs/product.md).  
Pages and components: [specs/ui.md](../../../specs/ui.md).  
Stories and FRs: [specs/requirements.md](../../../specs/requirements.md).

Request statuses and transitions are **not** defined here — use the `request-state-machine` skill and [specs/data-model.md](../../../specs/data-model.md).
