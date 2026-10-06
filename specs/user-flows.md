# User flows

Flows describe expected behavior for implementation and for the demo script in [testing.md](testing.md).

Actors: **Owner** (lists a book), **Seeker** (requests a book).

## Flow A — Owner lists a book

1. User registers or logs in.
2. User opens `/listings/new`.
3. User submits title, author, and condition (optional course code, notes, cover URL).
4. App creates an `available` listing and redirects to `/listings/[id]`.
5. Listing appears on `/` in the catalog.

**Failure:** missing required fields → field-level errors, no listing created.

## Flow B — Seeker requests a book

1. Seeker opens `/` (optionally searches by title, author, or course code).
2. Seeker opens an `available` listing they do not own.
3. Seeker submits Request with optional pickup note.
4. App creates a `pending` request and sets listing status to `requested`.
5. Listing no longer appears as requestable (catalog excludes it; detail does not offer Request to others).
6. Seeker dashboard shows an outgoing `pending` request. Owner dashboard shows an incoming `pending` request.

**Failure:** seeker not logged in → prompt to log in. Own listing → no Request action. Listing not `available` → clear error.

## Flow C — Owner accepts; either party completes

1. Owner opens the incoming `pending` request (`/requests/[id]` or dashboard).
2. Owner accepts.
3. Request is `accepted`; listing stays `requested`.
4. Owner and seeker meet in person using the pickup note (outside the app).
5. Either party opens the request and marks complete.
6. Request is `completed`; listing is `exchanged` and absent from the catalog.

## Flow D — Decline or cancel

**Decline**

1. Owner declines a `pending` request.
2. Request is `declined`; listing returns to `available`.
3. Another user may request it.

**Cancel**

1. Seeker cancels a `pending` request.
2. Request is `cancelled`; listing returns to `available`.

Accepted requests cannot be declined or cancelled in MVP. Completing is the only forward path from `accepted`.

## Flow E — Guardrails

1. Logged-out user on listing detail sees a path to `/login`, not a working Request submit.
2. Owner does not see Request on their own listing.
3. Completing a `pending`, `declined`, or `cancelled` request is impossible.
4. Accepting after decline is impossible.
5. A second seeker cannot create a request while one is open (`pending` or `accepted`).
6. Users who are neither owner nor requester cannot open `/requests/[id]`.

## Flow F — Unpublish

1. Owner edits an `available` listing or chooses unpublish.
2. Listing status becomes `unpublished`.
3. Listing disappears from the catalog and cannot be requested.

Unpublish of `requested` or `exchanged` listings is rejected (FR-2.4).
