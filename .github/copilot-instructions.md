# Copilot instructions for RentLog (draft, Week 03; the team refines and submits this in Week 04)

RentLog helps renters document apartment condition (move-in and move-out reports with photos) and track out-of-pocket maintenance expenses, then prepare evidence for a landlord. Requirements are in `spec.md`; planning decisions are in `docs/architecture.md`.

## Tech stack
- Next.js App Router, with the app in `RentLog/`. TypeScript in **strict mode**, Tailwind CSS.
- Database: **MongoDB** (proposed: MongoDB Atlas with **Mongoose**). Use one cached connection exported from `lib/db.ts`; never open a new connection per request.
- Auth: *to be decided by the team (Auth.js or Clerk).* Update this section once chosen.
- Photos and receipts: store files outside MongoDB (proposed: Vercel Blob) and keep only their URLs in documents.

## Data model
- Entities: `User`, `Apartment`, `ConditionReport` (with embedded `observations`), `Expense`. Models live in `models/<Name>.ts`; shared types live in `types/`.
- Every Apartment, ConditionReport and Expense has an `ownerId`. **Every query must filter by the signed-in user's id.** Return 404 for records the user doesn't own and never reveal that they exist.
- Money is `amountCents` (a positive integer) plus a `currency` code. Never use floats for money, and never add amounts in different currencies together.

## Code conventions
- No `any`. Component props use an `interface` named `<Component>Props`.
- Server Components by default. Add `'use client'` only for state, event handlers or browser APIs, and keep client components small.
- Route handlers validate their input and return `{ error: string }` with 400 for invalid input, 401 when signed out, 404 when not found, and 500 with a safe message for unexpected errors.
- Naming: components `PascalCase.tsx`, utilities `camelCase.ts`, route folders kebab-case.
- Styling: Tailwind utilities with the team's design tokens from `app/globals.css` (defined by Elizabeth). Reuse shared components before creating new ones. Mobile-first; layouts must work at 360 px wide.
- Accessibility: every input has a label, every action works with the keyboard, and images have meaningful `alt` text.

## Workflow
- One branch per issue: `feature/<short-name>`. Never push directly to `main`; open a pull request and get one teammate's review.
- Run `npm run lint` and `npm run build` inside `RentLog/` before opening a pull request.
