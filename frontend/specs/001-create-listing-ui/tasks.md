---

description: "Task list template for feature implementation"
---

# Tasks: Listing Creation Frontend

**Input**: Design documents from `/specs/001-create-listing-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated tests are MANDATORY per Principle II. Capture failing-first coverage tasks for every story before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Update project dependencies for Next.js 14, Tailwind, Shadcn, Zustand, Zod, Vitest, and Playwright in `package.json`
- [X] T002 Configure baseline project settings in `next.config.mjs`, `tsconfig.json`, and `.eslintrc.json`
- [X] T003 Scaffold root layout scaffolding with global providers in `app/layout.tsx` and initial entry in `app/page.tsx`
- [X] T004 Establish Tailwind pipeline via `tailwind.config.ts`, `postcss.config.mjs`, and global styles in `app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Generate Shadcn UI configuration (`components.json`) and scaffold shared primitives under `components/ui/`
- [X] T006 Apply PRD-aligned design tokens and typography scale in `tailwind.config.ts` and `app/globals.css`
- [X] T007 Create listing route shell with layout scaffolding in `app/(listing)/listing/create/layout.tsx` and placeholder page in `app/(listing)/listing/create/page.tsx`
- [X] T008 Implement Zustand store skeleton for wizard state in `app/(listing)/listing/create/state/listing-store.ts`
- [X] T009 Define Zod validation schemas per entity spec in `lib/validation/schemas.ts`
- [X] T010 Seed mock datasets for locations and default listings in `lib/mock-data/locations.ts` and `lib/mock-data/listing-templates.ts`
- [X] T011 Configure Vitest environment and testing utilities in `vitest.config.ts` and `tests/setup.ts`
- [X] T012 Configure Playwright for multi-browser runs with accessibility fixtures in `playwright.config.ts` and `tests/e2e/fixtures/wizard.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Complete Listing Wizard (Priority: P1) 🎯 MVP

**Goal**: Deliver the full multi-step wizard allowing agents to complete a listing draft through preview with mock data.

**Independent Test**: Run the Playwright end-to-end journey to confirm each required input unlocks the next step and the preview reflects submitted data.

### Tests for User Story 1 (MANDATORY — author before implementation) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T013 [P] [US1] Create Playwright happy-path spec covering all wizard steps in `tests/e2e/listing-wizard.spec.ts`
- [X] T014 [P] [US1] Add component validation coverage for step shells in `tests/unit/components/step-card.test.tsx`

### Implementation for User Story 1

- [X] T015 [US1] Implement wizard controller page with step router in `app/(listing)/listing/create/page.tsx`
- [X] T016 [US1] Build progress sidebar with status indicators in `app/(listing)/listing/create/components/progress-sidebar.tsx`
- [X] T017 [US1] Implement generic step container with navigation controls in `app/(listing)/listing/create/components/step-card.tsx`
- [X] T018 [US1] Create listing type step UI using Shadcn cards in `app/(listing)/listing/create/components/steps/listing-type-step.tsx`
- [X] T019 [US1] Create location step with search input and map preview placeholder in `app/(listing)/listing/create/components/steps/location-step.tsx`
- [X] T020 [US1] Implement unit details form with grouped inputs in `app/(listing)/listing/create/components/steps/unit-details-step.tsx`
- [X] T021 [US1] Implement pricing step with currency formatting in `app/(listing)/listing/create/components/steps/price-step.tsx`
- [X] T022 [US1] Implement description step with counters and AI autofill stub in `app/(listing)/listing/create/components/steps/description-step.tsx`
- [X] T023 [US1] Build preview step to render compiled listing summary in `app/(listing)/listing/create/components/steps/preview-step.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Guided Validation & Step Control (Priority: P2)

**Goal**: Provide real-time validation feedback, maintain state across navigation, and accurately reflect progress indicators.

**Independent Test**: Trigger validation errors in Playwright, navigate backward and forward, and confirm state persistence plus updated status indicators.

### Tests for User Story 2 (MANDATORY — author before implementation) ⚠️

- [X] T024 [P] [US2] Add Zustand store unit coverage for validation gating in `tests/unit/state/listing-store.test.ts`
- [X] T025 [P] [US2] Extend Playwright scenarios for error handling and back navigation in `tests/e2e/listing-wizard.spec.ts`

### Implementation for User Story 2

- [X] T026 [US2] Implement validation orchestration with Zod resolvers in `app/(listing)/listing/create/state/listing-store.ts`
- [X] T027 [US2] Create reusable validation banner component in `app/(listing)/listing/create/components/validation-banner.tsx`
- [X] T028 [US2] Wire inline error messaging and accessibility hooks across step components in `app/(listing)/listing/create/components/steps/*`
- [X] T029 [US2] Build wizard orchestration hook for navigation and persistence in `app/(listing)/listing/create/hooks/use-listing-wizard.ts`
- [X] T030 [US2] Update progress sidebar to display blocked/in-progress states in `app/(listing)/listing/create/components/progress-sidebar.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Media & Preview Readiness (Priority: P3)

**Goal**: Deliver gallery management, platform toggles, and preview fidelity that reflects media ordering and publishing options.

**Independent Test**: Run Playwright media scenarios to enforce minimum photo counts, reorder assets, and confirm preview synchronization.

### Tests for User Story 3 (MANDATORY — author before implementation) ⚠️

- [X] T031 [P] [US3] Add media uploader component tests for constraints in `tests/unit/components/media-uploader.test.tsx`
- [X] T032 [P] [US3] Extend Playwright gallery coverage for minimum photos and reorder in `tests/e2e/listing-wizard.spec.ts`

### Implementation for User Story 3

- [X] T033 [US3] Implement media uploader with drag-and-drop support in `app/(listing)/listing/create/components/media-uploader.tsx`
- [X] T034 [US3] Build gallery step with collections and alerts in `app/(listing)/listing/create/components/steps/gallery-step.tsx`
- [X] T035 [US3] Implement platform posting step with toggles and scheduling in `app/(listing)/listing/create/components/steps/platform-step.tsx`
- [X] T036 [US3] Extend preview step to display media carousels and platform summary in `app/(listing)/listing/create/components/steps/preview-step.tsx`
- [X] T037 [US3] Add media ordering and minimum count logic to store in `app/(listing)/listing/create/state/listing-store.ts`
- [X] T038 [US3] Update validation schema and mock data for media metadata in `lib/validation/schemas.ts` and `lib/mock-data/listing-templates.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T039 Capture accessibility and visual regression reports in `tests/e2e/reports/accessibility.md`
- [ ] T040 Run Lighthouse performance script and archive results in `docs/qa/performance-report.md`
- [ ] T041 Update quickstart verification steps with final commands in `specs/001-create-listing-ui/quickstart.md`
- [ ] T042 Document release notes and screenshots in `docs/qa/listing-wizard-review.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories proceed sequentially by priority (P1 → P2 → P3) to honor validation layering
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - lays base wizard experience
- **User Story 2 (P2)**: Depends on US1 for step scaffolding; enhances validation and navigation
- **User Story 3 (P3)**: Depends on US1 for preview shell and on US2 for validation/state hooks

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Shared utilities/hooks before dependent components
- Component implementation before state wiring when possible
- Preview updates after contributing data sources are complete
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks touching different config files (T001–T004) can run in parallel once coordinated
- Foundational tasks T005–T012 can be distributed by specialty (theming, data, testing) after T001–T004
- Within US1, step components (T018–T022) can be built concurrently once step shell (T015–T017) exists
- US3 media tasks (T033–T036) can parallelize once uploader base (T033) is available

---

## Parallel Example: User Story 1

```bash
# After completing T015–T017:
Task: "T018 [US1] Create listing type step UI in app/(listing)/listing/create/components/steps/listing-type-step.tsx"
Task: "T019 [US1] Create location step with map preview in app/(listing)/listing/create/components/steps/location-step.tsx"
Task: "T020 [US1] Implement unit details form in app/(listing)/listing/create/components/steps/unit-details-step.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run Playwright happy-path spec and component tests
5. Demo end-to-end listing creation with mock data

### Incremental Delivery

1. Setup + Foundational → baseline wizard infrastructure
2. Add User Story 1 → Happy-path wizard complete → Validate & demo
3. Layer User Story 2 → Validation and navigation guardrails → Validate & demo
4. Layer User Story 3 → Media richness and preview fidelity → Validate & demo

### Parallel Team Strategy

- After Foundational phase:
  - Developer A: User Story 1 step components (T018–T022)
  - Developer B: User Story 1 preview & orchestrator (T015–T017, T023)
  - QA/Automation: Maintain Playwright specs (T013, T025, T032)
- Subsequent phases allow similar splits (validation vs state vs media) while keeping story ownership clear
