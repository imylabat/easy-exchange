# Requirements specification

Requirements are testable. IDs are stable; tests and implementation notes should cite them.

Related specs: [product.md](product.md), [data-model.md](data-model.md), [user-flows.md](user-flows.md), [testing.md](testing.md).

## User stories

| ID | Story |
| --- | --- |
| US-1 | As a student, I want to create an account with email, password, and display name so that my listings and requests are tied to me. |
| US-2 | As a student, I want to log in and stay logged in across page loads so that I can manage exchanges without re-entering credentials every click. |
| US-3 | As an owner, I want to list a textbook with title, author, condition, and optional course code so that someone in the next class can find it. |
| US-4 | As an owner, I want to edit or unpublish a listing so that I do not get requests for a book I already gave away or no longer wish to offer. |
| US-5 | As a seeker, I want to browse available listings and search by title, author, or course code so that I can find a book I need. |
| US-6 | As a seeker, I want to open a listing and request it with a short pickup note so that the owner knows I am interested and how I can meet. |
| US-7 | As an owner, I want to accept or decline a pending request so that I control who gets the book. |
| US-8 | As either party on an accepted request, I want to mark the exchange complete so that the listing leaves the available catalog. |
| US-9 | As a seeker, I want to cancel a pending request so that I can look for a different copy. |
| US-10 | As a student, I want a dashboard of my listings and my incoming and outgoing requests so that I can see what needs action. |

Out-of-scope stories (do not implement): pay for a book; message the other student in-app; look up a book by ISBN; rate the other student.

## Functional requirements

### Auth

| ID | Requirement | Test idea |
| --- | --- | --- |
| FR-1.1 | A visitor can register with email, password, and display name. Emails are unique. | Duplicate email is rejected. |
| FR-1.2 | Passwords are stored hashed, never plaintext. | Persistence layer stores a hash, not the raw password. |
| FR-1.3 | A registered user can log in with email and password and log out. | Session is present after login and gone after logout. |
| FR-1.4 | Unauthenticated users can view the catalog and listing detail. They cannot create listings or requests, nor transition requests. | Unauthenticated POST/action is denied. |
| FR-1.5 | Protected pages (`/dashboard`, `/listings/new`, listing edit, request actions) redirect unauthenticated users to `/login`. | Unauthenticated visit redirects. |

### Listings

| ID | Requirement | Test idea |
| --- | --- | --- |
| FR-2.1 | An authenticated user can create a listing with required title, author, and condition. Optional: course code, notes, cover image URL. New listings start as `available`. | Create with required fields succeeds; missing title fails. |
| FR-2.2 | Only the owner can edit a listing. | Other user cannot update. |
| FR-2.3 | The owner can unpublish an `available` listing (status `unpublished`). Unpublished listings leave the catalog and cannot be requested. | Catalog query excludes unpublished. |
| FR-2.4 | The owner cannot unpublish a listing that has an `accepted` request. They may unpublish `available` listings. If a listing is `requested` with only a `pending` request, unpublish is allowed only after that pending request is cancelled or declined, **or** unpublish may cancel the pending request and set listing to `unpublished`. **Chosen rule:** unpublish is allowed for `available` only. For `requested` or `exchanged`, unpublish is rejected with a clear error. | Unpublish `available` succeeds; unpublish `requested` fails. |
| FR-2.5 | Only `available` listings appear in the public catalog. | Seeded `requested` and `exchanged` listings are absent from `/`. |
| FR-2.6 | A listing may have at most one **open** request (`pending` or `accepted`). Creating a request sets listing status to `requested`. | Second request on the same listing is rejected. |
| FR-2.7 | Condition must be one of: `new`, `like new`, `good`, `fair`. | Other values fail validation. |

### Catalog

| ID | Requirement | Test idea |
| --- | --- | --- |
| FR-3.1 | Catalog lists `available` listings, newest first. | Ordering matches `createdAt` descending. |
| FR-3.2 | Search is case-insensitive against title, author, and course code. Empty query returns all available listings. | Matching and empty-query cases. |
| FR-3.3 | Listing detail shows title, author, condition, notes, course code, cover URL if present, owner display name, and status. | Detail page contains these fields. |
| FR-3.4 | Request action is shown only when the viewer is authenticated, is not the owner, and the listing is `available`. Otherwise show login or an explanation (own listing / not available). | Owner does not see Request. |

### Requests

| ID | Requirement | Test idea |
| --- | --- | --- |
| FR-4.1 | An eligible user can create a request with an optional pickup note. | Create succeeds; listing becomes `requested`; request is `pending`. |
| FR-4.2 | A user cannot request their own listing. | Domain function rejects. |
| FR-4.3 | A user cannot create a request unless the listing is `available`. | Reject `requested`, `exchanged`, `unpublished`. |
| FR-4.4 | Owner can **accept** a `pending` request on their listing. Status becomes `accepted`. Listing stays `requested`. | Permission and status checks. |
| FR-4.5 | Owner can **decline** a `pending` request. Request becomes `declined`. Listing returns to `available`. | Side effect on listing. |
| FR-4.6 | Requester can **cancel** a `pending` request. Request becomes `cancelled`. Listing returns to `available`. | Owner cannot cancel (owner declines instead). |
| FR-4.7 | Either the owner or the requester can **complete** an `accepted` request. Request becomes `completed`. Listing becomes `exchanged`. | Both roles succeed; a third user fails. |
| FR-4.8 | Illegal transitions are rejected with a clear message (see [data-model.md](data-model.md)). | Completing `pending` fails; accepting `declined` fails. |
| FR-4.9 | Request detail is visible only to the listing owner and the requester. | Other authenticated users are denied. |

### Dashboard

| ID | Requirement | Test idea |
| --- | --- | --- |
| FR-5.1 | Dashboard shows three sections: My listings, Incoming requests (on my listings), Outgoing requests (I made). | Seeded user sees expected rows. |
| FR-5.2 | Each request row shows current status and links to the request and listing. | Status badge matches data. |

### Validation and errors

| ID | Requirement | Test idea |
| --- | --- | --- |
| FR-6.1 | Forms show field-level errors for missing or invalid required fields (Zod). | Submit empty listing form. |
| FR-6.2 | Invalid state transitions and authorization failures show a user-visible message (not a blank 500). | Request own listing; request already-held listing. |

## Non-functional requirements

| ID | Requirement |
| --- | --- |
| NFR-1 | TypeScript throughout application source. |
| NFR-2 | Layout usable at approximately 1280px desktop and 375px mobile width (stacked, simple). |
| NFR-3 | Prisma + SQLite for local/dev; graders need no cloud database. |
| NFR-4 | Seed data includes at least 2 users and at least 6 listings covering `available`, `requested`, and `exchanged`. |
| NFR-5 | Core request transitions covered by automated tests (see [testing.md](testing.md)). |
| NFR-6 | No secrets committed. `.env.example` documents required variables. |
| NFR-7 | App starts with documented install and `npm run dev` (or equivalent) in the README. |
| NFR-8 | Single Next.js process: pages and mutations in one app (no separate backend service). |
