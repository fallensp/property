# 🔧 Fix: Connect Git Repository to Forge

## ❌ Current Problem
Your Forge site has NO code because it's not connected to Git repository!

## ✅ Solution: Connect Git Repository

### Step 1: Go to Forge Dashboard

1. Visit: https://forge.laravel.com/servers/989994
2. Click on your site: **property-ai.on-forge.com**
3. Click **"Apps"** tab in the left sidebar
4. Click **"Git Repository"**

### Step 2: Connect Your Repository

**Option A: If Repository is Already Connected**
- You should see repository info
- Click **"Update Repository"** if needed

**Option B: If NOT Connected (Current Issue)**

1. Click **"Install Repository"**

2. **Source Control Provider**: Choose your provider
   - GitHub
   - GitLab
   - Bitbucket

3. **Repository**: Enter your repository
   ```
   fallensp/property
   ```
   (or your actual GitHub username/repo)

4. **Branch**:
   ```
   main
   ```

5. **Install Composer Dependencies**: ✅ Check this

6. Click **"Install Repository"**

### Step 3: Wait for Initial Installation

Forge will:
- Clone your repository
- Run `composer install`
- Create first release
- Run your deployment script

This takes **2-5 minutes**.

---

## 🔍 Alternative: Check Current Git Connection

If you think it's already connected, check the **Apps** section:

### Via Forge API:
```bash
# Get site info
forge site:list
```

### Via SSH:
```bash
ssh -i infra/property-app-key.pem forge@43.217.181.191
cd /home/forge/property-ai.on-forge.com

# Check if repository exists
ls -la repository/

# Check if .git exists
ls -la .git/
```

---

## 📋 After Connecting Git

Once Git is connected, Forge will:

1. ✅ Create `repository/` directory
2. ✅ Clone your code
3. ✅ Create `releases/` with actual code
4. ✅ Run deployment script
5. ✅ Create `current` symlink

Then your `/backend/api/` will have:
- ✅ `artisan` file
- ✅ `app/` directory
- ✅ `routes/` directory
- ✅ All your Laravel code

---

## 🚨 If Repository Connection Fails

### Common Issues:

**1. SSH Key Not Added to GitHub**

In Forge → Server → **SSH Keys**:
- Copy the public key
- Add to GitHub: Settings → SSH Keys → New SSH Key

**2. Wrong Repository Name**
- Make sure format is: `username/repo-name`
- No `.git` extension
- No `https://` prefix

**3. Private Repository**
- Ensure GitHub App is authorized
- Or add Forge's SSH key to repository deploy keys

---

## ✅ Verification After Setup

Once connected, trigger a deployment:

1. Go to **Deployments** tab
2. Click **"Deploy Now"**
3. Watch the deployment log

You should see:
```
Cloning repository...
Installing composer dependencies...
Creating .env symlink...
Running migrations...
✅ Deployment complete!
```

Then test:
```bash
ssh -i infra/property-app-key.pem forge@43.217.181.191
cd /home/forge/property-ai.on-forge.com/current/backend/api
ls -la artisan  # Should exist now!
php artisan route:list | grep login
```

---

## 📞 Quick Check Commands

**Check if Git is connected:**
```bash
ssh forge@43.217.181.191
cd /home/forge/property-ai.on-forge.com
ls -la repository/  # Should exist if Git is connected
```

**Check latest deployment:**
```bash
cd /home/forge/property-ai.on-forge.com/current
ls -la  # Should have all your code, not just storage/
```

---

**Action Required**: Connect your Git repository to Forge now!
