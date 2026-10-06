# Data model and request state machine

This file is the source of truth for entities, statuses, legal transitions, permissions, and listing-status side effects.

Related specs: [requirements.md](requirements.md) (FR-2, FR-4), [testing.md](testing.md).

## Entities

### User

| Field | Type | Rules |
| --- | --- | --- |
| `id` | string / cuid | Primary key |
| `email` | string | Unique, required |
| `passwordHash` | string | Required; never expose in UI or API responses |
| `displayName` | string | Required |
| `createdAt` | datetime | Required |

User deletion is out of scope. Do not cascade-delete listings in MVP; unpublish instead.

### Listing

| Field | Type | Rules |
| --- | --- | --- |
| `id` | string / cuid | Primary key |
| `ownerId` | User id | Required |
| `title` | string | Required |
| `author` | string | Required |
| `courseCode` | string | Optional |
| `condition` | enum | `new` \| `like_new` \| `good` \| `fair` (UI labels: New, Like new, Good, Fair) |
| `notes` | string | Optional |
| `coverImageUrl` | string | Optional URL |
| `status` | enum | `available` \| `requested` \| `exchanged` \| `unpublished` |
| `createdAt` | datetime | Required |
| `updatedAt` | datetime | Required |

### ExchangeRequest

| Field | Type | Rules |
| --- | --- | --- |
| `id` | string / cuid | Primary key |
| `listingId` | Listing id | Required |
| `requesterId` | User id | Required; must not equal listing owner |
| `pickupNote` | string | Optional |
| `status` | enum | `pending` \| `accepted` \| `declined` \| `completed` \| `cancelled` |
| `createdAt` | datetime | Required |
| `updatedAt` | datetime | Required |

## Invariants

1. A listing has **at most one open request**. Open means status `pending` or `accepted`.
2. Creating a request is allowed only when the listing status is `available`.
3. Listing `requested` means exactly one open request exists.
4. Listing `exchanged` means a `completed` request exists for that listing.
5. Listing `unpublished` never appears in the catalog and cannot be requested.
6. Terminal request statuses (`declined`, `cancelled`, `completed`) are not transitioned further.

## Condition enum (storage vs UI)

| Stored value | UI label |
| --- | --- |
| `new` | New |
| `like_new` | Like new |
| `good` | Good |
| `fair` | Fair |

Zod and Prisma should use the stored values.

## Request state machine

### States

```text
pending ──accept──► accepted ──complete──► completed
   │                    ▲
   ├──decline──► declined
   └──cancel───► cancelled
```

Initial status on create: `pending`.

### Legal transitions

| From | Action | To | Who may call it |
| --- | --- | --- | --- |
| (none) | `create` | `pending` | Authenticated user who is **not** the listing owner, listing must be `available` |
| `pending` | `accept` | `accepted` | Listing **owner** |
| `pending` | `decline` | `declined` | Listing **owner** |
| `pending` | `cancel` | `cancelled` | **Requester** |
| `accepted` | `complete` | `completed` | Listing **owner** or **requester** |

### Illegal transitions (must reject)

Reject all of the following (non-exhaustive list of the important cases; any transition not in the legal table is illegal):

- `create` on own listing
- `create` when listing is `requested`, `exchanged`, or `unpublished`
- `create` when an open request already exists on the listing
- `accept`, `decline`, or `cancel` on any status other than `pending`
- `complete` on any status other than `accepted`
- `accept` or `decline` by anyone other than the owner
- `cancel` by anyone other than the requester
- `complete` by a user who is neither owner nor requester
- Any action by an unauthenticated user
- Transitioning a request the caller cannot view (not owner and not requester)

On rejection, do not change listing or request rows. Return a clear error (for example: “This listing is no longer available.”, “You cannot request your own listing.”, “Only the owner can accept this request.”).

### Listing-status side effects

| Request event | Listing status after success |
| --- | --- |
| `create` → `pending` | `requested` |
| `accept` | remains `requested` |
| `decline` | `available` |
| `cancel` | `available` |
| `complete` | `exchanged` |

Unpublish (owner, listing currently `available` only): listing → `unpublished`. No request row is created or changed.

Completing a request is the only path to listing status `exchanged`.

## Permissions summary

| Action | Owner | Requester | Other signed-in user | Anonymous |
| --- | --- | --- | --- | --- |
| View listing detail | Yes | Yes | Yes | Yes |
| Request listing (if `available`) | No | Yes (as seeker) | Yes | No |
| View request | Yes | Yes | No | No |
| Accept / decline pending | Yes | No | No | No |
| Cancel pending | No | Yes | No | No |
| Complete accepted | Yes | Yes | No | No |
| Edit / unpublish listing | Yes (`available` for unpublish) | No | No | No |

## Seed expectations

Seed data must include:

- At least two users (demo accounts documented in README).
- At least six listings.
- At least one listing in each of `available`, `requested`, and `exchanged`.
- At least one `pending` request and one `accepted` or `completed` request consistent with listing statuses.
