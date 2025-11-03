# Implementation Plan: Portal Listings Landing

**Branch**: `002-portal-landing-page` | **Date**: 2025-10-23 | **Spec**: [/Users/ivan/Project/property/specs/002-portal-landing-page/spec.md](/Users/ivan/Project/property/specs/002-portal-landing-page/spec.md)
**Input**: Feature specification from `/specs/002-portal-landing-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver the Listings landing page shown in `portal-landing.png`, preserving layout fidelity, client-side filters, and tab states so agents can review inventory at a glance and launch the existing listing wizard via the “Create listing” CTA. Implementation will reuse the established Next.js 14 + Shadcn stack, extend mock data to drive filtering, and emphasize UX polish and accessibility per constitution principles.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x with React 18 (Next.js 14 App Router)  
**Primary Dependencies**: Shadcn UI primitives (Radix + Tailwind), Zustand state management, Zod validation, existing mock data utilities  
**Storage**: Client-side state only; extend mock listing dataset under `lib/mock-data`  
**Testing**: Playwright journeys for landing page flows; Vitest + React Testing Library for component coverage  
**Target Platform**: Modern evergreen desktop browsers (Chrome, Edge, Safari, Firefox)  
**Project Type**: Web single-application frontend (Next.js)  
**Lean Constraints**: Reuse existing components/hooks; limit new UI dependencies to justified layout gaps; keep new components under 75 LOC or log follow-up refactor tasks  
**Constraints**: Must satisfy WCAG 2.1 AA, align with reference layout, and avoid backend/database dependencies  
**Scale/Scope**: Single Listings landing screen supporting ~200 mock listings with tabbed segments and search/filter interactions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Readability Guard** (Principle I) — Existing ESLint + Prettier + TypeScript strict mode will block merges; landing page components will be split by concern (layout, filters, dataset) to keep files <300 lines with follow-up tasks logged if exceeded.
- **Testing Guard** (Principle II) — Playwright journey will verify default tab, filtering, and CTA navigation; Vitest unit tests will cover filter utilities and listing card rendering with failing-first assertions.
- **Experience Guard** (Principle III) — Layout, typography, and badge colors will follow `portal-landing.png` using Shadcn tokens; accessibility checklist covers keyboard navigation, ARIA labels for filters, and focus management.
- **Lean Guard** (Principle IV) — Implement using current component library; any proposed UI dependency (e.g., table helper) requires explicit approval in plan and will default to in-house patterns; mock data reuse avoids backend scope creep.

*Post-design review*: Research confirmed no new dependencies or backend scope; all guards remain satisfied without exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/002-portal-landing-page/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
app/
├── layout.tsx
├── page.tsx
├── (portal)/
│   └── portal/
│       └── listings/
│           ├── page.tsx
│           ├── components/
│           │   ├── listings-header.tsx
│           │   ├── listings-filters.tsx
│           │   ├── listings-tabs.tsx
│           │   ├── listings-table.tsx
│           │   └── empty-state.tsx
│           └── hooks/
│               └── use-listings-filter.ts
components/
├── ui/
└── icons/
lib/
├── mock-data/
│   └── listings.ts
└── utils/
    └── formatting.ts
tests/
├── e2e/
│   └── portal-listings.spec.ts
└── unit/
    └── portal/
        ├── listings-filters.test.tsx
        └── listings-table.test.tsx
```

**Structure Decision**: Extend the single Next.js app by adding a `portal/listings` route with feature-scoped components and hooks, keep shared primitives in `components/ui`, store mock listing data under `lib/mock-data`, and place tests in `tests/e2e` and `tests/unit/portal` to mirror existing project conventions.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | — | — |
