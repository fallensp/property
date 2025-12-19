# Quickstart: Listing Creation Frontend

## Prerequisites
- Node.js 20.x
- pnpm 9.x
- Git LFS (optional, for large imagery)

## Environment Setup
1. Install dependencies  
   ```bash
   pnpm install
   ```
2. Initialize Shadcn component library (only once)  
   ```bash
   pnpm dlx shadcn@latest init
   pnpm shadcn add button card dialog form input textarea select switch tabs tooltip
   ```
3. Generate base UI primitives into `components/ui/` ensuring tokens match PRD styling.

## Development Workflow
1. Start the Next.js dev server  
   ```bash
   pnpm dev
   ```
   - App served at http://localhost:3000
   - Access listing wizard via `/listing/create`
2. Populate mock data files under `lib/mock-data/` to reflect PRD scenarios (listing templates, location suggestions, media placeholders).
3. Use Storybook (optional but recommended) to review discrete components  
   ```bash
   pnpm storybook
   ```

## Testing & Validation
- Run unit and component tests  
  ```bash
  pnpm test
  ```
- Execute end-to-end wizard journey with Playwright (headed for UX review)  
  ```bash
  pnpm test:e2e
  ```
- Validate accessibility and visual drift using Playwright + Axe and screenshot comparisons.

## Performance & QA
- Trigger Lighthouse CI script on throttled 3G Fast to confirm LCP and interaction budgets  
  ```bash
  pnpm lint:perf
  ```
- Capture preview screenshots and compare with PRD-provided imagery before sign-off.

## Mock Data Management
- Mock datasets live in `lib/mock-data/`. Update factory utilities when PRD changes fields or validations.
- Use deterministic seeds so automated tests and previews remain stable across runs.
