---

description: "Task list for Portal Listings Landing implementation"
---

# Tasks: Portal Listings Landing

**Input**: Design documents from `/specs/002-portal-landing-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated tests are recommended per Principle II. Capture failing-first coverage tasks for every story before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold feature-specific route structure

- [X] T001 Create portal listings route directories and placeholder page component in `app/(portal)/portal/listings/page.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data and state utilities required by all user stories

- [X] T002 Seed mock listing dataset with status buckets in `lib/mock-data/listings.ts`
- [X] T003 Define filter option constants and status metadata in `app/(portal)/portal/listings/constants.ts`
- [X] T004 Implement shared formatting helpers for prices and metrics in `lib/utils/formatting.ts`
- [X] T005 Build `use-listings-filter.ts` hook to manage filter state, derived counts, and grid/list toggles in `app/(portal)/portal/listings/hooks/use-listings-filter.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Agent reviews listing portfolio (Priority: P1) 🎯 MVP

**Goal**: Deliver the Listings landing page layout with hero header, tabs, and listing cards showing mock data

**Independent Test**: Load `/portal/listings` and confirm hero header, default Online tab, and listing cards render with mock data fields

### Tests for User Story 1 (MANDATORY — author before implementation) ⚠️

- [X] T006 [P] [US1] Write Playwright spec validating default load state in `tests/e2e/portal-listings.spec.ts`
- [X] T007 [P] [US1] Add Vitest snapshot/structure test for listing cards in `tests/unit/portal/listings-table.test.tsx`

### Implementation for User Story 1

- [X] T008 [US1] Implement listings header with title, search bar container, and action buttons in `app/(portal)/portal/listings/components/listings-header.tsx`
- [X] T009 [US1] Implement status tabs with counts and active styling in `app/(portal)/portal/listings/components/listings-tabs.tsx`
- [X] T010 [US1] Build table/list component to render listing cards with badges and metrics in `app/(portal)/portal/listings/components/listings-table.tsx`
- [X] T011 [US1] Create empty-state component matching portal copy in `app/(portal)/portal/listings/components/empty-state.tsx`
- [X] T012 [US1] Compose listings page wiring mock data, tabs, and table in `app/(portal)/portal/listings/page.tsx`

**Checkpoint**: User Story 1 delivers a fully navigable landing page reflecting the provided mock layout

---

## Phase 4: User Story 2 - Agent filters and sorts listings (Priority: P2)

**Goal**: Enable search, dropdown filters, sort controls, and empty-state responses

**Independent Test**: Apply search and multiple filters, confirm results update immediately and “Clear” restores default list with Online tab active

### Tests for User Story 2 (MANDATORY — author before implementation) ⚠️

- [X] T013 [P] [US2] Add Vitest coverage for filter reducer utilities in `tests/unit/portal/listings-filters.test.tsx`
- [X] T014 [P] [US2] Extend Playwright spec with search and filter scenarios in `tests/e2e/portal-listings.spec.ts`

### Implementation for User Story 2

- [X] T015 [US2] Implement filter controls component with search input, dropdowns, and sort selector in `app/(portal)/portal/listings/components/listings-filters.tsx`
- [X] T016 [US2] Enhance `use-listings-filter.ts` to handle applied filters, derived counts, and clear/reset actions
- [X] T017 [US2] Integrate filter state with `page.tsx` and ensure empty-state component triggers when no matches are found in `app/(portal)/portal/listings/page.tsx`

**Checkpoint**: User Story 2 enables agents to narrow listings and recover defaults without page reloads

---

## Phase 5: User Story 3 - Agent initiates new listing (Priority: P3)

**Goal**: Ensure “Create listing” CTA navigates to the existing wizard with accessibility support

**Independent Test**: Click “Create listing” and confirm the wizard opens in the current window with focus transferred to the stepper

### Tests for User Story 3 (MANDATORY — author before implementation) ⚠️

- [X] T018 [P] [US3] Update Playwright journey to assert CTA navigation to the wizard route in `tests/e2e/portal-listings.spec.ts`

### Implementation for User Story 3

- [X] T019 [US3] Wire CTA button to navigate to the existing wizard entry URL in `app/(portal)/portal/listings/components/listings-header.tsx`
- [X] T020 [US3] Add focus management and aria-labels for CTA and “More actions” button in `app/(portal)/portal/listings/components/listings-header.tsx`

**Checkpoint**: CTA launches the wizard without regressions to listing overview functionality

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation, and lean scope audit

- [X] T021 Update quickstart instructions with portal landing verification steps in `specs/002-portal-landing-page/quickstart.md`
- [X] T022 Document accessibility audit results in `docs/qa/portal-listings-accessibility.md`
- [X] T023 Conduct lean scope audit summarizing unused code/dependencies in `docs/qa/lean-audit.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must complete before foundational work
- **Foundational (Phase 2)**: Depends on Setup; blocks all user stories
- **User Stories (Phase 3-5)**: Execute in priority order (US1 → US2 → US3) to maintain independent increments
- **Polish (Final Phase)**: Runs after user stories are complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on foundational utilities; no other story dependencies
- **User Story 2 (P2)**: Depends on US1 components and foundational hook
- **User Story 3 (P3)**: Depends on US1 header and navigation scaffolding

### Within Each User Story

- Author failing-first tests before implementation tasks
- Build shared components before wiring them into the page
- Compose the page after child components exist
- Ensure navigation or state wiring happens after UI composition

### Parallel Opportunities

- Foundational tasks T002–T004 can proceed in parallel once T001 completes
- US1 component builds (T008–T011) can run concurrently after tests (T006–T007) start
- US2 filter logic (T015–T017) may parallelize once T015 component structure exists
- Polish tasks T021–T023 can run concurrently post feature completion

---

## Parallel Example: User Story 1

```bash
# After T006–T007 are authored:
Task: "T008 [US1] Implement listings header in app/(portal)/portal/listings/components/listings-header.tsx"
Task: "T009 [US1] Implement status tabs in app/(portal)/portal/listings/components/listings-tabs.tsx"
Task: "T010 [US1] Build listings table in app/(portal)/portal/listings/components/listings-table.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Deliver User Story 1 (layout + mock data display)
4. Validate via Playwright default-state test
5. Review with stakeholders before enabling filters or CTA navigation

### Incremental Delivery

1. MVP (US1) provides immediate visibility of listings
2. Layer US2 for filtering and sorting to improve manageability
3. Add US3 CTA navigation to enable quick access to the wizard
4. Polish phase finalizes documentation, accessibility, and lean audits
