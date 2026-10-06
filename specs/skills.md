# Skills plan

This assignment uses Cursor Skills plus specifications as the implementation contract. Specs in `specs/` remain the source of truth; skills tell the agent **when** and **how** to apply them.

## Project skills (in this repo)

| Skill | Path | When to apply |
| --- | --- | --- |
| Spec-driven development | `.cursor/skills/spec-driven-dev/SKILL.md` | Any planning, implementation, or “add a feature” request |
| Easy Exchange domain | `.cursor/skills/easy-exchange-domain/SKILL.md` | Listings, catalog, users, pickup, MVP scope |
| Request state machine | `.cursor/skills/request-state-machine/SKILL.md` | Request create/accept/decline/cancel/complete, listing status side effects |

These skills should auto-apply from context (no `disable-model-invocation`). They point at specs instead of duplicating tables.

## Native Cursor skills (use later)

| Phase | Skill | Use |
| --- | --- | --- |
| Start of implementation | `/create-rule` | Optional always-on rule: read `specs/` first; TypeScript/Next conventions |
| Implementation | `/create-skill` | Only if a repeated agent mistake needs a new small skill |
| After a vertical slice | `/review` | General review |
| After request + auth code | `/review-bugbot` | Logic bugs in transitions and ownership |
| After auth + mutations | `/review-security` | Authz, hashed passwords, no secret leakage |
| While fixing tests | `/loop` | Optional: re-run failing tests until green |

Do not use `/sdk`, `/automate`, `/autopilot`, or `/split-to-prs` unless the assignment explicitly needs them.

## Imported / external skills

Install or copy **at most two** into the repo if they help implementation. Prefer repo-local copies so graders see them.

Recommended:

1. Next.js App Router best-practices skill (for example Vercel `next-best-practices`) during scaffold and routing.
2. React best-practices or a concise Playwright/webapp-testing skill during UI and e2e.

Do not import a large skills pack. Do not let imported skills override MVP exclusions in [product.md](product.md).

## Prompt practice

When implementing, prompts should:

1. Name the spec files to read first.
2. Name the FR IDs in scope for that slice.
3. Repeat the exclusion list or point to `specs/product.md`.
4. State acceptance (tests or a flow from `user-flows.md`).
5. Implement one implementation-order slice at a time ([architecture.md](architecture.md)).
