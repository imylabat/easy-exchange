# Product specification

Easy Exchange is a campus textbook exchange. Students list books they no longer need, other students request those books, and the two parties complete a local handoff. There are no payments, no shipping, and no in-app messaging.

This file is the product source of truth. Implementation must not expand scope beyond the MVP defined here.

## Target users

- **Primary:** college students who have finished a course and want to pass a textbook to someone taking it next.
- **Secondary:** students looking for a used copy of a required book from someone on campus.

## Primary use case

A student lists a book. Another student finds it, requests it, and the owner accepts or declines. If accepted, they arrange a campus pickup in person (using the optional pickup note). Either participant marks the exchange complete. The listing then leaves the public catalog.

## Product concept

The product is the **exchange lifecycle**, not large-scale discovery:

**list → request → accept/decline → complete**

Search exists so a student can find a specific title or course code. The core value is a visible, permissioned request handshake between two people.

Local handoff only. Pickup details are unstructured text on the request (for example, “Butler Library lobby, Thursday 3pm”). The app does not schedule, map, or notify.

## MVP features

1. Sign up and log in with email and password.
2. Profile identity limited to a display name (shown on listings and requests).
3. Create, edit, and unpublish a book listing.
4. Browse and search the catalog of **available** listings.
5. Request a listing (with optional pickup note).
6. Owner accept or decline; requester cancel while pending; either party complete when accepted.
7. Dashboard of my listings, incoming requests, and outgoing requests.

## Listing fields (MVP)

| Field | Required | Notes |
| --- | --- | --- |
| Title | Yes | Textbook title |
| Author | Yes | |
| Course code | No | Free text (for example `COMS 4115`) |
| Condition | Yes | `new`, `like new`, `good`, or `fair` |
| Notes | No | Extra context (highlights, edition, missing pages) |
| Cover image URL | No | URL only; no file uploads |
| Status | System | See [data-model.md](data-model.md) |

## Request fields (MVP)

| Field | Required | Notes |
| --- | --- | --- |
| Listing | Yes | Target listing |
| Requester | Yes | Authenticated user |
| Pickup note | No | How/when/where to meet |
| Status | System | See [data-model.md](data-model.md) |

## Authentication (MVP)

- Credentials in the application database (Auth.js credentials provider).
- No OAuth, no email verification, no password reset.
- Seed at least two demo accounts so graders can log in without registering.

## MVP exclusion list

Do **not** implement any of the following unless a specification is explicitly updated first:

- Payments, pricing, or “for sale” listings
- Shipping, mailing addresses, or maps
- In-app chat or email notifications
- ISBN lookup or barcode scanning
- File uploads (including cover images)
- Ratings, reviews, or reputation
- Recommendations, wishlists, or watchlists
- Admin dashboard or moderation queue
- Multi-campus or public internet marketplace features
- Native or hybrid mobile apps
- Real-time push/websocket updates (request pages may refresh or be reloaded)

If an implementation prompt asks for an excluded item, refuse and point to this list.

## Success for the assignment

The app is successful when a grader can log in as two seeded users and complete the full loop: list (or use a seeded available listing), request, accept, complete, and see the listing leave the catalog. Decline and cancel must also work and return the listing to available.
