# UI specification

Keep the interface small. Do not add a design system, marketing site, or extra pages.

Related specs: [architecture.md](architecture.md) routes, [user-flows.md](user-flows.md).

## Pages and views

| Route | Purpose | Empty / error states |
| --- | --- | --- |
| `/` | Catalog of available listings; search | “No listings match your search.” If catalog empty: “No books are available yet.” |
| `/listings/[id]` | Detail; Request when eligible | Unknown id: not found. Not available: hide Request, explain status. |
| `/listings/new` | Create listing | Validation errors on fields. Unauthenticated: redirect to login. |
| `/listings/[id]/edit` | Owner edit / unpublish | Non-owner: forbidden. Unpublish not allowed unless `available`. |
| `/dashboard` | My listings, incoming requests, outgoing requests | Each section may show “None yet.” |
| `/login` | Email + password | Invalid credentials message. |
| `/register` | Email, password, display name | Duplicate email and validation errors. |
| `/requests/[id]` | Status badge and legal actions only | Forbidden if not a participant. Unknown id: not found. |

## Components

| Component | Role |
| --- | --- |
| `Navbar` | Catalog, Dashboard (if signed in), Login/Logout, New listing (if signed in) |
| `ListingCard` | Title, author, condition, optional course code; links to detail |
| `ListingForm` | Create and edit fields; Zod-backed errors |
| `SearchBar` | Query string for title / author / course code |
| `RequestActions` | Buttons allowed for current user and status only |
| `RequestStatusBadge` | `pending`, `accepted`, `declined`, `completed`, `cancelled` |
| `AuthForm` | Login and register |
| `DashboardLists` | Three dashboard sections |

## Request actions by state (UI)

Show only legal actions from [data-model.md](data-model.md):

| Status | Owner sees | Requester sees |
| --- | --- | --- |
| `pending` | Accept, Decline | Cancel |
| `accepted` | Complete | Complete |
| `declined` | None (status only) | None |
| `cancelled` | None | None |
| `completed` | None | None |

Hiding a button is not sufficient; the server must still reject illegal actions.

## Visual constraints

- Tailwind utility classes; no requirement for a component library.
- Usable at ~1280px and ~375px: stack cards and forms on small widths.
- Status must be readable as text, not color alone (badge includes the word).
- Cover image: if `coverImageUrl` is present, render it; if missing, omit (no upload widget).

## Copy constraints

- Use “request”, “accept”, “decline”, “complete”, “listing” — not “buy”, “cart”, “order”, or “message”.
- Pickup note helper text should say the meetup is arranged in person, not in the app.
