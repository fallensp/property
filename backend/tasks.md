# Backend Implementation Task Breakdown

Task list derived from `plan.md`, ordered to unblock dependencies. Mark tasks as complete during implementation.

## 1. Project Setup
1.1 Initialize Laravel project (`composer create-project laravel/laravel backend-api`).  
1.2 Configure PHP 8.3+, Node 20, Sail/Docker tooling; ensure Forge compatibility.  
1.3 Add dev tooling: Pint, PHPStan/Larastan, PHPUnit/Pest, Telescope (local).  
1.4 Create `.env.example` with Supabase Postgres, Forge Redis, AWS S3/CloudFront, Google Maps, Resend credentials.  
1.5 Wire GitHub Actions CI (install deps, cache builds, run lint/tests).  
1.6 Configure Forge Quick Deploy script (composer install, migrate, cache clear, queue:restart).

## 2. Database & Models
2.1 Design migrations for lookup tables (`property_types`, `property_sub_types`, `property_unit_types`).  
2.2 Create `developers`, `agents`, `users` tables with relationships.  
2.3 Build `listings` table (ULID id, status, pricing, foreign keys).  
2.4 Build `listing_locations` table (addresses, coordinates, bumi flag, Google metadata).  
2.5 Optional `media_assets` table for listing galleries.  
2.6 Implement Eloquent models + relationships; enable soft deletes + casts.

## 3. Seeders & Factories
3.1 Port property metadata from FE mock data.  
3.2 Create developer/agent factories + seeders.  
3.3 Add `listing` + `listing_location` factories for tests/demos.  
3.4 Implement optional `import:mock-listings` artisan command.

## 4. Services & Business Logic
4.1 Implement `ListingService` (create/update, step orchestration).  
4.2 Implement `LocationService` with Google Places/geocode integration + caching.  
4.3 Create Form Requests for each API operation (store/update listing, location).  
4.4 Add domain events (`ListingCreated`, `ListingLocationUpdated`) + listeners.  
4.5 Define policies/gates for listings (agent permissions).

## 5. HTTP Layer / APIs
5.1 Sanctum auth setup (login, logout, current user).  
5.2 Listing endpoints (`POST /api/listings`, `PATCH /api/listings/{id}`, `GET /api/listings/{id}`).  
5.3 Metadata endpoint (`GET /api/metadata/property-types`).  
5.4 Location suggestions endpoint (Google Places proxy with caching).  
5.5 API Resources (ListingResource, ListingLocationResource) + error format standardization.  
5.6 Document endpoints via OpenAPI/Scribe.

## 6. Infrastructure & Integrations
6.1 Configure Supabase Postgres connection + migrations in each environment.  
6.2 Set up Forge-managed Redis (queues cache).  
6.3 Integrate AWS S3 storage + CloudFront CDN (signed URLs for media).  
6.4 Configure Resend for transactional emails (local Mailpit fallback).  
6.5 Set up logging to CloudWatch and error tracking via Sentry.  
6.6 Ensure Forge health checks/alarms and queue workers are configured.

## 7. Testing (Final Step)
7.1 Write unit tests for services (ListingService, LocationService).  
7.2 Add feature tests for API endpoints (auth, listings, metadata, suggestions).  
7.3 Configure Pest/PHPUnit parallel testing in CI.  
7.4 Add smoke tests to deployment pipeline.  
7.5 Validate seeders/factories via test coverage.
