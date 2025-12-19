# Quickstart: Portal Listings Landing

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Run unit tests for portal listings utilities**
   ```bash
   pnpm test -- --run tests/unit/portal
   ```

3. **Execute Playwright journey for the landing page**
   ```bash
   pnpm test:e2e tests/e2e/portal-listings.spec.ts
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```
   Visit `http://localhost:3000/portal/listings` and confirm:
   - Online tab loads by default with mock listings visible
   - Search for “USJ 5” narrows results and “Clear filters” restores the list
   - “Create listing” navigates to the multi-step listing wizard in a new view

5. **Run lint and lean scope audit**
   ```bash
   pnpm lint
   pnpm run lean:check   # script will be added/updated during implementation if missing
   ```
