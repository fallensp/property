# 🔧 How to Fix Forge Deployment Script

## ✅ Current Status
- **Current deployment**: WORKING ✅
- **Database**: Connected to AWS RDS ✅
- **All tables**: Created successfully ✅

## ⚠️ The Problem
Every new deployment creates a new release folder, but the `.env` symlink is NOT automatically created for the Laravel backend, causing the "connection to 127.0.0.1 failed" error.

## 🛠️ The Fix - Update Forge Deployment Script

### Step 1: Open Forge Dashboard

1. Go to: https://forge.laravel.com/servers/989994
2. Click on your site: **property-ai.on-forge.com**
3. Click the **"Deployments"** tab on the left sidebar

### Step 2: Replace the Deployment Script

1. You'll see a text editor with the current deployment script
2. **Delete ALL the existing content**
3. **Copy the ENTIRE script** from: `FORGE_DEPLOYMENT_SCRIPT.txt`
4. **Paste it** into the Forge deployment script editor
5. Click **"Save"** button

### Step 3: Test a Deployment

1. Make a small change to your code (or just trigger a deploy)
2. Click **"Deploy Now"** button
3. Watch the deployment log - you should see:
   - ✓ "Creating .env symlink for Laravel..."
   - ✓ "Clearing Laravel caches..."
   - ✓ "Running database migrations..."
   - ✓ "Deployment complete!"

---

## 📋 What the Fixed Script Does

The updated deployment script includes this **critical section**:

```bash
# PART 2: Laravel Backend API
cd backend/api

# CRITICAL: Create .env symlink (THIS WAS MISSING!)
rm -f .env
ln -sf ../../../../.env .env

# Clear Laravel caches
php artisan config:clear
php artisan cache:clear

# Cache configuration
php artisan config:cache

# Run migrations
php artisan migrate --force
```

This ensures that **every new release** gets the `.env` symlink, so Laravel can always find the database configuration.

---

## 🔍 Verification

After updating the deployment script, your next deployment should:

1. ✅ Create `.env` symlink automatically
2. ✅ Connect to AWS RDS (not localhost)
3. ✅ Run migrations successfully
4. ✅ Complete without errors

---

## 🆘 If You Still Get Errors

### Error: "connection to 127.0.0.1 failed"

**Check 1: Verify .env symlink exists**
```bash
ssh -i infra/property-app-key.pem forge@43.217.181.191
cd /home/forge/property-ai.on-forge.com/current/backend/api
ls -la .env
# Should show: .env -> ../../../../.env
```

**Check 2: Verify .env has correct database config**
```bash
grep DB_HOST /home/forge/property-ai.on-forge.com/.env
# Should show: property-db.c5c6u8ko05pq.ap-southeast-5.rds.amazonaws.com
# NOT: localhost or 127.0.0.1
```

**Check 3: Manually fix if needed**
```bash
cd /home/forge/property-ai.on-forge.com/current/backend/api
rm -f .env
ln -sf ../../../../.env .env
php artisan config:clear
php artisan config:cache
```

### Error: "Undefined table: cache"

**Solution:**
```bash
ssh -i infra/property-app-key.pem forge@43.217.181.191
cd /home/forge/property-ai.on-forge.com/current/backend/api
php artisan migrate --force
```

---

## 📊 Directory Structure Reference

```
/home/forge/property-ai.on-forge.com/
├── .env                              # ← Main .env file (has DB config)
├── current -> releases/59460203      # ← Symlink to active release
└── releases/
    └── 59460203/                     # ← Current release
        ├── package.json              # Next.js
        ├── backend/
        │   └── api/
        │       ├── .env -> ../../../../.env  # ← MUST create this symlink
        │       ├── artisan
        │       └── ...
        └── ...
```

The symlink path breakdown:
- `../` → Go to `backend/`
- `../../` → Go to `59460203/` (release root)
- `../../../` → Go to `releases/`
- `../../../../` → Go to site root (where `.env` is)

---

## 🎯 Key Points

1. **The `.env` file lives in the site root**: `/home/forge/property-ai.on-forge.com/.env`
2. **Each new release needs a symlink**: `releases/[ID]/backend/api/.env → ../../../../.env`
3. **The deployment script must create this symlink** for every new deployment
4. **Without the symlink**, Laravel uses default config (localhost PostgreSQL)

---

## ✅ Success Indicators

After fixing the deployment script, you should see in the deployment logs:

```
🔗 Creating .env symlink for Laravel...
✓ .env symlink created
🧹 Clearing Laravel caches...
⚙️  Caching Laravel configuration...
📊 Running database migrations...
✅ Deployment complete!
```

And NO errors about:
- ❌ "connection to server at 127.0.0.1"
- ❌ "fe_sendauth: no password supplied"

---

## 📞 Quick Commands

**SSH to server:**
```bash
ssh -i infra/property-app-key.pem forge@43.217.181.191
```

**Check current .env symlink:**
```bash
ls -la /home/forge/property-ai.on-forge.com/current/backend/api/.env
```

**Test database connection:**
```bash
cd /home/forge/property-ai.on-forge.com/current/backend/api
php artisan tinker --execute="DB::connection()->getPdo(); echo 'OK';"
```

**View deployment logs in Forge:**
- Dashboard → Site → Deployments → Click on a deployment to see logs

---

**Last Updated**: 2025-11-20
**Status**: Ready to update Forge deployment script
