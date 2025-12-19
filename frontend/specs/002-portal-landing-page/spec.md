# Feature Specification: Portal Listings Landing

**Feature Branch**: `002-portal-landing-page`  
**Created**: 2025-10-23  
**Status**: Draft  
**Input**: User description: "create the portal landing page according to [portal-landing.png 1316x977] , follow the layout , build the frontend only, create listing link to our existing wizard."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Agent reviews listing portfolio (Priority: P1)

An authenticated property agent lands on the Listings overview page and uses the filters and tabs to inspect active listings, mirroring the layout provided in the reference design.

**Why this priority**: The page must deliver immediate visibility into the agent’s inventory; without this overview the portal landing lacks core value.

**Independent Test**: Load the landing page, verify the search and filter controls render, tabs switch between listing states, and the listings table displays summary cards matching the provided design data.

**Automated Tests**: High-level UI journey test that loads the landing page, confirms default "Online" tab state, and verifies at least one listing card renders with the expected fields.

**Experience & Accessibility Notes**: Copy, spacing, icon placement, and badge colors should follow the reference design; ensure headings and controls expose semantic roles, labels, and keyboard navigation order consistent with WCAG 2.1 AA.

**Lean Scope Guard**: Reuse existing Shadcn components, typography tokens, and badge/pill styles from the listing wizard project; avoid introducing new UI libraries or unused abstractions.

**Acceptance Scenarios**:

1. **Given** the agent opens the Listings page, **When** the page loads, **Then** the hero heading, search bar, filter controls, summary tabs, and first page of listing cards are visible in the same order as the reference layout.
2. **Given** the agent selects the "Draft" tab, **When** the state changes, **Then** the tab styling updates to active and the listing list replaces content with the appropriate draft placeholder entries.

---

### User Story 2 - Agent filters and sorts listings (Priority: P2)

An agent narrows down listings using the search input, filter dropdowns, and sort selector to find specific inventory without leaving the page.

**Why this priority**: Agents depend on rapid filtering to manage large inventories; these controls are prominent in the design and must be functional to meet expectations.

**Independent Test**: Enter sample keywords, change filter dropdowns, and toggle the sort selector to confirm the listings list reflects the filters applied and the clear/reset affordance behaves as expected.

**Automated Tests**: Component tests for filter dropdown interactions and a journey test verifying that entering a keyword reduces the result count and that "Clear" restores the default list.

**Experience & Accessibility Notes**: Provide visible focus states, ensure dropdowns have accessible labels, and align placeholder/tooltip text with the design copy.

**Lean Scope Guard**: Leverage existing input, select, and pill components; keep filtering logic scoped to client-side mock data until backend integration is prioritized.

**Acceptance Scenarios**:

1. **Given** multiple listings are visible, **When** the agent searches for "Glenmarie", **Then** only listings containing "Glenmarie" in the displayed fields remain visible and the search term persists until cleared.

---

### User Story 3 - Agent initiates new listing (Priority: P3)

An agent uses the “Create listing” call-to-action to jump into the existing multi-step listing wizard without losing context.

**Why this priority**: The landing page is a springboard to the listing wizard; the CTA must link directly to the established flow to support new inventory creation.

**Independent Test**: Click the “Create listing” button and verify the browser navigates to the existing listing wizard entry route already implemented in the project.

**Automated Tests**: Journey test confirming the CTA triggers navigation to the wizard URL and the page transition completes without errors.

**Experience & Accessibility Notes**: Match the button styling, placement, and hover states in the reference; provide descriptive aria-labels for screen-reader users and ensure focus moves to the new page on navigation.

**Lean Scope Guard**: Reuse the existing navigation hook or router pattern used elsewhere in the portal; do not duplicate wizard initialization logic.

**Acceptance Scenarios**:

1. **Given** the agent is on the Listings page, **When** they click “Create listing”, **Then** they are taken to the existing listing creation wizard start screen within the same session.

---

### Edge Cases

- Empty search or filters return zero results; display a friendly empty state panel matching brand tone and maintain access to the “Create listing” CTA.
- Network or data load lag: show skeleton rows or loading indicators aligned with the design system so the layout remains stable.
- Agents with accessibility settings rely on keyboard navigation and screen readers; ensure all interactive controls are reachable and properly labeled.
- Large inventories requiring pagination or virtual scrolling should retain layout consistency without degrading performance or readability.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The landing page MUST render the hero heading, search bar, filter panel, listing tabs, and listing cards in the layout order depicted in `portal-landing.png`.
- **FR-002**: The search input MUST filter visible listings in real time based on property name, location, or identifier fields present in the mock dataset.
- **FR-003**: Each filter dropdown (Listing type, Category, Property type, Upgrade, Unit type, More) MUST apply client-side filtering using available mock attributes and display applied state.
- **FR-004**: The tab bar MUST switch between status buckets (Online, Draft, Offline, Expired) and refresh the listing list accordingly.
- **FR-005**: The “Create listing” button MUST deep-link to the existing multi-step listing wizard route established in the `001-create-listing-ui` feature.
- **FR-006**: Listing cards MUST display badges, thumbnail, property title, address, price, attribute icons, and metrics exactly as specified in the reference layout, using mock data where API data is unavailable.
- **FR-007**: The “More actions” dropdown MUST expose the available bulk actions region defined in the design, even if options are non-interactive placeholders for now, while remaining visually accurate.

### Testing Requirements *(Principle II)*

- **TR-001**: Automated UI tests MUST verify the default Online tab renders at least one listing card with all required fields populated.
- **TR-002**: Automated tests MUST cover search and filter interactions, ensuring filtered results update and the clear/reset state restores the default list.
- **TR-003**: Navigation tests MUST confirm the “Create listing” button routes to the existing wizard without throwing client-side errors.

### Experience & Accessibility Requirements *(Principle III)*

- **XR-001**: Typography, spacing, and badge colors MUST align with the reference design tokens and brand guidelines.
- **XR-002**: Interactive controls MUST expose descriptive labels or aria attributes so screen readers can identify their purpose.
- **XR-003**: Focus order MUST follow visual layout, with visible focus indicators on buttons, tabs, and dropdowns; the page must remain usable via keyboard only.

### Lean Scope Requirements *(Principle IV)*

- **LR-001**: Existing shared components (inputs, selects, badges, tabs) MUST be reused; creating new primitives requires documented approval.
- **LR-002**: Data handling MUST stay client-side with the provided mock dataset; integrating live APIs is deferred to a future feature.
- **LR-003**: Styling overrides MUST leverage existing Tailwind/Shadcn tokens; avoid introducing new global styles unless required by the design and documented in follow-up tasks.

### Key Entities *(include if feature involves data)*

- **Listing Summary**: Represents the data shown in each card, including property identifiers, pricing, status, impressions, and visibility indicators.
- **Filter State**: Captures the active search term, selected dropdown values, and current tab to drive the listings query and UI states.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Usability testing shows 90% of agents can identify a specific listing using search or filters within 30 seconds.
- **SC-002**: Task completion logs confirm 95% of agents reach the listing wizard via the “Create listing” CTA without encountering navigation errors.
- **SC-003**: 90% of surveyed agents rate the page as “visually aligned” or higher compared to the provided reference layout.
- **SC-004**: Support tickets regarding missing listings overview or navigation from the landing page remain at zero during pilot release.
