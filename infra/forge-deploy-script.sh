#!/bin/bash
# Laravel Forge Deployment Script
# Property Listing Application (Next.js + Laravel API)
# This script should be added to your Forge deployment configuration

set -e

echo "🚀 Starting deployment..."

cd /home/forge/property-ai.on-forge.com/releases/$FORGE_RELEASE

# ==========================================
# PART 1: Next.js Frontend
# ==========================================
echo ""
echo "📦 Installing Next.js dependencies..."
npm ci --prefer-offline --no-audit

echo "🔨 Building Next.js application..."
npm run build

# ==========================================
# PART 2: Laravel Backend API
# ==========================================
echo ""
echo "📦 Installing Laravel dependencies..."
cd backend/api
composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

echo "🔗 Creating .env symlink for Laravel..."
rm -f .env
ln -sf ../../../../.env .env

echo "🧹 Clearing Laravel caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "⚙️  Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "📊 Running database migrations..."
php artisan migrate --force

echo "🔄 Optimizing Laravel..."
php artisan optimize

# ==========================================
# PART 3: Update symlinks and restart
# ==========================================
cd /home/forge/property-ai.on-forge.com

echo "🔗 Updating current symlink..."
ln -sfn releases/$FORGE_RELEASE current

echo "🔄 Restarting services..."
# Restart Next.js with PM2 (if using PM2)
if command -v pm2 &> /dev/null; then
    pm2 restart property-app || pm2 start npm --name "property-app" -- start --prefix /home/forge/property-ai.on-forge.com/current
    pm2 save
fi

# Restart PHP-FPM
sudo systemctl reload php8.2-fpm

echo ""
echo "✅ Deployment complete!"
echo "📝 Release: $FORGE_RELEASE"
echo "🌐 Next.js: http://43.217.181.191"
echo "🔌 API: /backend/api"
