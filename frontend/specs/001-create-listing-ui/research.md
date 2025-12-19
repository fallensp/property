# Research: Listing Creation Frontend

## UI Framework & Project Base
- **Decision**: Use Next.js 14 App Router with TypeScript for the listing wizard.
- **Rationale**: Provides server-rendered hydration with excellent developer tooling, integrates seamlessly with Shadcn generation scripts, and supports route grouping for step-based flows while remaining purely frontend when using client components.
- **Alternatives considered**:
  - **Vite + React**: Faster startup but lacks built-in routing conventions and would require manual SSR decisions; less alignment with Shadcn defaults.
  - **Create React App**: Deprecated for modern builds and lacks routing/SSR flexibility required for SEO-friendly previews.
  - **Remix**: Strong routing but heavier emphasis on loaders/actions which are unnecessary for a mock-data-only UI.

## Component Library Integration
- **Decision**: Scaffold Shadcn UI components with Tailwind CSS and Radix UI primitives.
- **Rationale**: Matches the “modern and reusable” requirement, offers accessible primitives out of the box, and allows tailoring to PRD-specific design tokens while maintaining consistent theming.
- **Alternatives considered**:
  - **Material UI**: Component-heavy with opinionated aesthetics conflicting with supplied screenshots; more work to restyle.
  - **Chakra UI**: Simple but less aligned with Shadcn design language; would require overriding tokens extensively.
  - **Custom from scratch**: Would slow delivery, increasing risk around UX fidelity and accessibility compliance.

## State Management & Validation
- **Decision**: Manage wizard state with Zustand and validate inputs using Zod schemas.
- **Rationale**: Zustand offers simple, lightweight store management with minimal boilerplate, ideal for multi-step forms. Zod ensures shared validation logic between UI components and tests, helping meet Principle II.
- **Alternatives considered**:
  - **Redux Toolkit**: Reliable but heavier and unnecessary for scope; additional boilerplate.
  - **React Context + Reducer**: Simpler but harder to isolate/store state outside React tree (e.g., for tests); less ergonomic dev tools.
  - **Yup**: Capable validation but less TypeScript-friendly compared to Zod’s inferred types.

## Mock Data Strategy
- **Decision**: Store mock datasets (locations, template listings, media placeholders) under `lib/mock-data` with utility factories for tests and previews.
- **Rationale**: Keeps UI self-sufficient without backend dependencies, enabling deterministic Playwright scripts and consistent preview content that matches PRD expectations.
- **Alternatives considered**:
  - **Static JSON in public/**: Easy to load but complicates typed access and mocking for tests.
  - **MirageJS or MSW**: Powerful but unnecessary overhead when no network layer exists; adds complexity for little gain.

## Testing Approach
- **Decision**: Use Vitest + React Testing Library for component-level testing and Playwright for end-to-end wizard coverage.
- **Rationale**: Vitest integrates smoothly with Next.js and provides fast feedback loops; Playwright supports multi-step form automation, screenshot comparisons, and accessibility audits satisfying Constitution Principle II and III.
- **Alternatives considered**:
  - **Jest**: Mature but slower; Vitest offers better DX with Vite-powered Next integration.
  - **Cypress**: Great for E2E but heavier runtime and limited cross-browser support vs Playwright’s multi-engine testing.
  - **Storybook tests only**: Helpful for visuals but insufficient for journey validation and automated gating.

## Performance & Accessibility Tooling
- **Decision**: Validate performance budgets with Lighthouse CI runs on throttled 3G Fast profile and use Axe (via Playwright) for accessibility scanning.
- **Rationale**: Aligns directly with constitution guardrails, offering repeatable, automated measurements across steps and ensuring look-and-feel priority includes inclusive design.
- **Alternatives considered**:
  - **Manual Chrome DevTools auditing**: Useful for spot checks but lacks automated gating.
  - **WebPageTest**: Detailed but slower feedback and external dependency (overkill for local wizard).
