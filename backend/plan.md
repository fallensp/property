# Backend Implementation Plan

Comprehensive plan to stand up a Laravel-based backend that powers the create-listing experience (and future listing workflows) for the property portal.

---

## 1. Project Scaffolding & Tooling
1. Install Laravel (v11.x) into `backend/` via `composer create-project laravel/laravel backend-api`.
2. Configure PHP 8.3+, Node 20+ (for Vite if needed), and Sail/Docker for consistent dev environments.
3. Add baseline tooling:
   - PHPStan + Larastan, Pint (code style), PHPUnit, Pest (optional), Laravel Pint hook in CI.
   - Laravel Telescope enabled for local debugging only.
4. Define `.env.example` with Supabase PostgreSQL credentials, Forge-managed Redis for queue/cache, Mailpit (local) + Resend (prod) mail drivers, AWS S3 keys, Google Maps API keys.
5. Configure GitHub Actions workflow for backend (composer install, caches, phpunit, pint, phpstan) and pair with Forge Quick Deploy scripts for staging/production.

## 2. Domain Modeling & Database Schema
1. Primary tables:
   - `listings`: core listing metadata (title, status, pricing, developer_id, etc.).
   - `listing_locations`: address lines, coordinates, bumi lot flag, geocoding metadata.
   - `property_types`, `property_sub_types`, `property_unit_types`: lookup tables mirroring frontend enumerations.
   - `developers`, `agents`, `users`.
   - `media_assets` (optional for gallery uploads).
2. Relationships:
   - Listing `belongsTo` developer, agent, property_type, property_sub_type, property_unit_type.
   - Listing `hasOne` listing_location.
3. Migration order: lookup tables → users/developers/agents → listings → listing_locations → ancillary tables (media, audits).
4. Add UUIDs as public IDs (use `HasUlids` or `Ramsey\Uuid`).
5. Include soft deletes on listings and related tables.

## 3. Seed Data & Reference Catalogs
1. Port existing mock data from `lib/mock-data` into seeders/factories.
2. Seed property metadata tables with consistent slugs/keys to ensure FE/BE parity.
3. Create developer + agent factories for testing.
4. Optional: add `php artisan import:mock-listings` command to bootstrap local DB with demo listings.

## 4. API Surface (Laravel HTTP Controllers)
1. Authentication & Session
   - Use Laravel Sanctum for SPA token auth.
   - Endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/auth/user`.
2. Listing Creation Flow
   - `POST /api/listings` to create draft listing.
   - `PATCH /api/listings/{listing}` for step-wise updates (location, pricing, media, etc.).
   - `GET /api/listings/{listing}` to hydrate the UI.
3. Metadata Endpoints
   - `GET /api/metadata/property-types` with nested subtypes/unit types.
   - `GET /api/locations/suggestions?query=` for search suggestions (powered by Google Places API with DB caching).
4. Issue Reporting (future)
   - Placeholder endpoint if feature resurfaces; skip for now but document interface.
5. Validation errors should map cleanly to field names used in frontend forms.

## 5. Application Services & Business Logic
1. `ListingService` orchestrates creation, updates, state transitions.
2. `LocationService` handles Google Maps geocoding/places resolution and bumi lot logic.
3. Use Form Request classes for validation (e.g., `StoreListingRequest`, `UpdateListingLocationRequest`).
4. Add domain events: `ListingCreated`, `ListingLocationUpdated` for auditing/notifications.
5. Policies / Gates ensure only authorized agents can modify their listings.

## 6. Integration & Data Contracts
1. Define response DTOs/resources (`ListingResource`, `ListingLocationResource`) that mirror frontend expectations.
2. Maintain schema docs (OpenAPI via `laravel-swagger` or `scribe`) for FE–BE alignment.
3. Establish versioning strategy (`/api/v1/...`) and deprecation guidelines.
4. Document error structure (e.g., `{ message, errors: { field: [] } }`) and share with FE.

## 7. Testing Strategy
1. Feature tests for each endpoint covering happy path and validation failures.
2. Unit tests for services (e.g., location normalization, property type filtering).
3. Database factories + Pest parallel testing for speed.
4. Contract tests (optional) using JSON schema snapshots to keep FE mocks in sync.
5. Add smoke tests to CI pipeline (e.g., `php artisan test --parallel`).

## 8. DevOps, Observability & Environments
1. Environments: local, staging, production (all provisioned through Forge with Quick Deploy).
2. Deployment flow: GitHub Actions run tests → Forge Quick Deploy executes composer install, migrations, cache clear, queue restart.
3. Database: Supabase-hosted PostgreSQL with PITR + read replicas; network peering or secure SSL connection to Forge app.
4. Infrastructure services: Forge-managed Redis for queues/cache; AWS S3 for media storage with CloudFront CDN and signed URLs; Resend for transactional email.
5. Observability: Laravel logs shipped to CloudWatch (via AWS integration) and error tracking via Sentry; health checks wired into Forge/CloudWatch alarms.

## 9. Delivery Roadmap (Suggested Order)
1. Week 1: Scaffold project, configure tooling, create migrations + seed metadata tables.
2. Week 2: Implement authentication, listing CRUD skeleton, metadata endpoints.
3. Week 3: Flesh out location module (geocoding integration stub, bumi lot logic) + validation.
4. Week 4: Harden security (policies), add events, finalize API resources, write docs.
5. Week 5: Complete automated tests, load demo data, run staging deployment, handoff to FE for wiring.

---

This plan establishes the Laravel backend foundation while aligning with the confirmed create-listing UI flows. Update iteratively as new requirements land.***
