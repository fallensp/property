# Implementation Plan: Listing Creation Frontend

**Branch**: `001-create-listing-ui` | **Date**: 2025-10-22 | **Spec**: [/Users/ivan/Project/property/specs/001-create-listing-ui/spec.md](/Users/ivan/Project/property/specs/001-create-listing-ui/spec.md)
**Input**: Feature specification from `/specs/001-create-listing-ui/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Deliver a pixel-faithful, multi-step listing creation wizard that mirrors the PRD layouts using Shadcn UI components, Tailwind styling, and Radix primitives. The app operates entirely on the client with mock data to simulate API responses, prioritizing smooth step transitions, consistent validation feedback, and high-fidelity visuals across desktop and mobile breakpoints.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x with React 18 (Next.js 14 App Router)  
**Primary Dependencies**: Shadcn UI component collection (Radix UI + Tailwind CSS), Zustand state management, Zod for schema validation  
**Storage**: Client-side session state only (no persistent storage)  
**Testing**: Playwright for E2E wizard coverage, Vitest + React Testing Library for component validation  
**Target Platform**: Modern evergreen desktop and mobile browsers (Chrome, Edge, Safari, Firefox)  
**Project Type**: Web single-application frontend (Next.js)  
**Performance Goals**: Step load Largest Contentful Paint ≤ 2.5s on 3G Fast; interactive validation feedback ≤ 150ms p95  
**Constraints**: No backend integration; must function with mock data; accessibility must satisfy WCAG 2.1 AA; reuse Shadcn primitives for consistency  
**Scale/Scope**: Single listing creation wizard covering eight steps defined in PRD; supports single agent workflow per session

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Quality Guard** (Principle I) — ESLint + Prettier configurations will be enforced via Next.js defaults; integrate TypeScript strict mode and Storybook visual checks to validate component reuse impacts. Dependency additions limited to Shadcn generator, Radix primitives, Tailwind plugins, Zustand, and testing libraries documented above.
- **Testing Guard** (Principle II) — Establish Vitest suites for component validation and Playwright flows that fail prior to feature completion (e.g., missing price should block submission). CI will run `pnpm test` and `pnpm test:e2e` ensuring regression coverage.
- **Experience Guard** (Principle III) — Implement UI following PRD imagery, using Shadcn tokens for spacing/typography; capture accessibility checklist per step (focus order, ARIA labels, helper copy) within design handoff docs. Preview will be compared against provided screenshots during QA.
- **Performance Guard** (Principle IV) — Measure LCP/interaction budgets using Lighthouse CI on throttled 3G Fast profile; ensure wizard state updates remain under 150ms p95 through Zustand profiling. Any deviation triggers remediation tasks before sign-off.

*Post-design review*: Research, data model, and contracts align with the guardrails above; no violations identified.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
├── (listing)/
│   ├── layout.tsx
│   └── listing/
│       ├── layout.tsx
│       └── create/
│           ├── page.tsx
│           ├── components/
│           │   ├── progress-sidebar.tsx
│           │   ├── step-card.tsx
│           │   ├── media-uploader.tsx
│           │   └── validation-banner.tsx
│           ├── hooks/
│           │   └── use-listing-wizard.ts
│           └── state/
│               └── listing-store.ts
components/
├── ui/               # Generated shadcn primitives
└── icons/
lib/
├── mock-data/
│   ├── locations.ts
│   └── listing-templates.ts
└── validation/
    └── schemas.ts
public/
└── images/           # PRD-aligned placeholder imagery
tests/
├── e2e/
│   └── listing-wizard.spec.ts
└── unit/
    └── components/
        └── media-uploader.test.tsx
```

**Structure Decision**: Adopt a single Next.js app structure with feature-scoped directories under `app/(listing)/listing/create` for modularity, shared `components/ui` generated via Shadcn, and dedicated `lib` folders for mock data and validation logic. Tests live alongside the app in `tests/e2e` and `tests/unit` to reinforce discipline per constitution principles.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | — | — |
