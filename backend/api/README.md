# Property Portal Backend

Laravel 12 API powering the property create-listing experience. This backend exposes listing CRUD, metadata catalogs, and Google-powered location services while integrating with Supabase PostgreSQL, Forge-managed Redis, AWS S3/CloudFront, and Resend.

## Tech Stack
- **Framework:** Laravel 12 (PHP 8.3+)
- **Database:** Supabase PostgreSQL (SSL required)
- **Cache/Queue:** Forge-managed Redis
- **Storage/CDN:** AWS S3 + CloudFront (signed URLs)
- **Maps:** Google Places & Geocoding APIs
- **Auth:** Laravel Sanctum (SPA tokens)
- **Mail:** Resend (Mailpit for local)
- **Tooling:** Pint, PHPStan/Larastan, PHPUnit, Laravel Sail

## Getting Started
```bash
cd backend/api
composer install
cp .env.example .env   # fill Supabase, Redis, AWS, Google, Resend secrets
php artisan key:generate
php artisan migrate
php artisan serve
```

For Docker-based dev, use Laravel Sail:
```bash
./vendor/bin/sail up
./vendor/bin/sail artisan migrate
```

## Useful Commands
- `composer lint` – run Laravel Pint formatting.
- `composer analyse` – run PHPStan/Larastan static analysis.
- `composer test` – run the PHPUnit suite.
- `php artisan queue:work` – process Redis queue workers.
- `php artisan migrate --seed` – run migrations with seed data.

## Project Structure Highlights
- `app/` – domain logic, services, policies, etc.
- `database/migrations` – schema for listings, locations, metadata tables.
- `routes/api.php` – Sanctum-protected API routes.
- `config/services.php` – credentials for Google Maps, Resend, Sentry.

## Environment Variables
Key settings in `.env`:
- `DB_*` / `SUPABASE_*` – Supabase PostgreSQL details (`DB_SSLMODE=require`).
- `CACHE_STORE=redis`, `QUEUE_CONNECTION=redis` – Forge Redis cluster.
- `FILESYSTEM_DISK=s3`, `AWS_*`, `AWS_CLOUDFRONT_DOMAIN`.
- `GOOGLE_MAPS_API_KEY`, `GOOGLE_MAPS_PLACES_SESSION_TTL`.
- `RESEND_API_KEY`, `MAIL_MAILER=resend`.
- `SENTRY_LARAVEL_DSN`, `SENTRY_TRACES_SAMPLE_RATE`.

## CI/CD & Deployment
- GitHub Actions (TODO) runs Pint, PHPStan, PHPUnit before merge.
- Forge Quick Deploy handles composer install, migrations, cache clears, and queue restarts on staging/production.

## Next Steps
See `../tasks.md` for the detailed implementation backlog (schema, services, endpoints, observability).***
