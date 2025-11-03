# Research: Portal Listings Landing

## Layout Composition
- **Decision**: Structure the Listings landing page using feature-scoped components (header, filters, tabs, list) that map 1:1 with the reference mock.
- **Rationale**: Breaking the page into focused components keeps files short (≤75 LOC primary components) and supports reuse of UI primitives like Shadcn buttons and badges while maintaining readability.
- **Alternatives considered**:
  - **Single monolithic page component**: Faster to scaffold but would exceed readability budgets and complicate testing.
  - **Adopting a third-party table layout**: Would reduce manual markup but risk layout drift from the provided design.

## Listing Data & Filtering
- **Decision**: Extend `lib/mock-data` with a `listings.ts` dataset and client-side filtering utilities referenced by Zustand/React state.
- **Rationale**: Keeps the iteration frontend-only as requested, avoids backend dependencies, and enables deterministic Playwright tests.
- **Alternatives considered**:
  - **Live API integration**: Out of scope; violates “no backend needed” directive.
  - **Embedding data inline in components**: Harder to reuse across tests and future API integration.

## Filter Interaction Patterns
- **Decision**: Use controlled inputs/selects for filters and provide real-time filtering feedback with empty-state fallbacks.
- **Rationale**: Mirrors user expectations from the reference page and aligns with Cohesive User Experience principle.
- **Alternatives considered**:
  - **Debounced filtering with delayed updates**: Adds perceived lag and complexity without value.
  - **Modal-based filter panel**: Deviates from provided layout.

## CTA Navigation
- **Decision**: Route the “Create listing” button to the existing wizard entry point defined in feature `001-create-listing-ui`.
- **Rationale**: Ensures consistency and leverages proven flows without duplicating logic.
- **Alternatives considered**:
  - **Temporary placeholder modal**: Fails to meet core requirement of launching the wizard.
  - **Redirect to an external URL**: Breaks integrated experience and introduces context switching.

## UI Library Consideration
- **Decision**: Continue with Shadcn/Tailwind primitives and only introduce an additional UI helper if internal components cannot satisfy a gap (currently none identified).
- **Rationale**: Aligns with Lean Delivery Discipline by avoiding dependencies unless a clear deficit emerges during implementation.
- **Alternatives considered**:
  - **Adopt a data-table package (e.g., TanStack Table)**: Offers advanced features but requires significant styling overrides to match mock; deferred until real pagination/sorting needs arise.
  - **Build bespoke grid system**: Redundant given existing Tailwind layout utilities.
