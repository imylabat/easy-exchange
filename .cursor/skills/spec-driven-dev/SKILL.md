---
name: spec-driven-dev
description: >-
  Implements Easy Exchange only from specs/ and refuses MVP exclusions.
  Use when writing code, adding features, changing behavior, scaffolding,
  planning implementation slices, or when the user mentions specs, requirements,
  FR IDs, or scope.
---

# Spec-driven development

`specs/` is the source of truth. Do not invent product behavior that is not specified.

## Before writing code

1. Read the specs relevant to the slice:
   - [specs/product.md](../../../specs/product.md) — MVP and exclusion list
   - [specs/requirements.md](../../../specs/requirements.md) — FR / NFR / user stories
   - [specs/architecture.md](../../../specs/architecture.md) — stack and implementation order
   - plus data-model, user-flows, ui, or testing as needed
2. Implement **one** implementation-order slice at a time (architecture.md).
3. If the user request conflicts with a spec, stop and say so. Update the spec only if the user explicitly changes requirements.

## Scope lock

Never add items from the exclusion list in `specs/product.md` (payments, shipping, chat, email, ISBN, uploads, ratings, admin, multi-campus, mobile apps, and the rest of that list).

## After changing behavior

If implementation needs a rule that is not in the specs, ask to update the spec first. Do not leave silent product decisions only in code.

## Acceptance

A slice is done when the cited FRs are met and the tests described in [specs/testing.md](../../../specs/testing.md) for that slice can be written or pass. Do not start the Next.js app, Prisma schema, or dependencies unless the user asked for implementation and specs already exist.
