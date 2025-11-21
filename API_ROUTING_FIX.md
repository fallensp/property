# 🔧 API Routing Issue - 404 on /auth/login

## ❌ The Problem

**Frontend is calling:** `/auth/login`
**Laravel route is:** `/api/auth/login`

Your Laravel routes in `routes/api.php` automatically get the `/api` prefix.

## ✅ Two Solutions (Choose One)

---

### **Solution 1: Update Frontend API Base URL** ⭐ Recommended

Change your frontend to include `/api` in the base URL.

#### If Using Axios:
```javascript
// In your API configuration file
const api = axios.create({
  baseURL: 'https://property-api.embrace.ventures/api',  // Add /api here
  // ... other config
});

// Then your calls work as before:
api.post('/auth/login', credentials)  // → https://property-api.embrace.ventures/api/auth/login
```

#### If Using Fetch:
```javascript
const API_BASE_URL = 'https://property-api.embrace.ventures/api';

fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  // ... other config
})
```

#### Environment Variable (Best Practice):
```env
# .env.local (Vercel)
NEXT_PUBLIC_API_URL=https://property-api.embrace.ventures/api
```

```typescript
// In your API config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

---

### **Solution 2: Remove `/api` Prefix from Laravel Routes**

If you want routes without `/api` prefix.

#### Step 1: SSH to Server
```bash
ssh -i infra/property-app-key.pem forge@43.217.181.191
cd /home/forge/property-api.embrace.ventures/current/backend/api
```

#### Step 2: Edit bootstrap/app.php

Find this section:
```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    // ...
)
```

Change to:
```php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    // Remove the automatic /api prefix
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
)
```

#### Step 3: Move routes from api.php to web.php

Or manually register api routes without prefix:

```php
// In bootstrap/app.php
->withRouting(
    web: __DIR__.'/../routes/web.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
    then: function () {
        // Register API routes without /api prefix
        Route::middleware('api')
            ->group(base_path('routes/api.php'));
    }
)
```

#### Step 4: Clear Route Cache
```bash
php artisan route:clear
php artisan route:cache
```

#### Step 5: Commit and Deploy
```bash
git add bootstrap/app.php
git commit -m "Remove /api prefix from routes"
git push
```

Then deploy in Forge.

---

## 🧪 Testing

### After Solution 1 (Add /api to frontend):
```bash
# Should work:
curl -X POST https://property-api.embrace.ventures/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### After Solution 2 (Remove /api prefix):
```bash
# Should work:
curl -X POST https://property-api.embrace.ventures/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🎯 Current Route List

Your current API routes (all have `/api` prefix):

```
POST   /api/auth/login              → AuthController@login
GET    /api/auth/me                 → AuthController@me (requires auth)
POST   /api/auth/logout             → AuthController@logout (requires auth)
GET    /api/metadata/property-types → MetadataController@propertyTypes
GET    /api/locations/suggestions   → LocationController@suggestions
GET    /api/listings                → ListingController@index (requires auth)
POST   /api/listings                → ListingController@store (requires auth)
GET    /api/listings/{id}           → ListingController@show (requires auth)
PUT    /api/listings/{id}           → ListingController@update (requires auth)
DELETE /api/listings/{id}           → ListingController@destroy (requires auth)
```

---

## 📝 Which Solution Should You Choose?

### ✅ **Solution 1** (Update Frontend) - RECOMMENDED
**Pros:**
- ✅ Industry standard (`/api` prefix is common)
- ✅ No changes to backend
- ✅ Clear separation (web routes vs API routes)
- ✅ Easier to version later (`/api/v1`, `/api/v2`)
- ✅ Better for CDN/Cloudflare caching rules

**Cons:**
- ❌ Need to update frontend code

### ⚠️ **Solution 2** (Remove /api prefix)
**Pros:**
- ✅ Frontend code works as-is

**Cons:**
- ❌ Non-standard (most APIs use `/api` prefix)
- ❌ Harder to differentiate web vs API routes
- ❌ More complex Nginx/Cloudflare configuration
- ❌ Harder to version API later

---

## 🔍 How to Check Current Nginx Configuration

```bash
ssh -i infra/property-app-key.pem forge@43.217.181.191

# Check document root
ls -la /home/forge/property-api.embrace.ventures/current/backend/api/public/

# List all routes
cd /home/forge/property-api.embrace.ventures/current/backend/api
php artisan route:list
```

---

## ✅ Recommended: Solution 1 + CORS Configuration

Since you're hosting frontend on Vercel, also ensure CORS is configured:

### Update Laravel .env:
```bash
ssh -i infra/property-app-key.pem forge@43.217.181.191
nano /home/forge/property-api.embrace.ventures/.env
```

Add:
```env
SANCTUM_STATEFUL_DOMAINS=property-api.embrace.ventures,your-vercel-app.vercel.app
FRONTEND_URL=https://your-vercel-app.vercel.app
SESSION_DOMAIN=.embrace.ventures
```

### Update config/cors.php:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],

'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:3000'),
],

'allowed_methods' => ['*'],

'allowed_headers' => ['*'],

'supports_credentials' => true,
```

Then clear cache:
```bash
cd /home/forge/property-api.embrace.ventures/current/backend/api
php artisan config:clear
php artisan config:cache
```

---

## 🎯 Final Test

Once fixed, test from frontend:

```javascript
// Your frontend code
const response = await fetch('https://property-api.embrace.ventures/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  })
});

console.log(response.status); // Should be 200 or 422, not 404
```

---

**Recommendation: Use Solution 1 and update your frontend to include `/api` in the base URL!**
