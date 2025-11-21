# Laravel Forge Integration Guide

This guide explains how to connect your AWS EC2 instance to Laravel Forge for easy server management and deployment.

## Prerequisites

Before starting, ensure you have:
- [x] Completed the AWS infrastructure setup (`./infra/setup.sh`)
- [x] EC2 instance running and accessible
- [x] SSH key file (`./infra/property-app-key.pem`)
- [x] Elastic IP address from `./infra/resources.txt`
- [ ] Laravel Forge account (sign up at https://forge.laravel.com)

---

## Step 1: Get EC2 Connection Details

From `./infra/resources.txt`, you'll need:

```bash
ELASTIC_IP=<your-elastic-ip>
EC2_KEY_NAME=property-app-key
```

Your SSH key is located at: `./infra/property-app-key.pem`

---

## Step 2: Add Server to Laravel Forge

### 2.1 Create New Server (Custom VPS)

1. Log in to Laravel Forge: https://forge.laravel.com
2. Click **"Create Server"**
3. Select **"Custom VPS"** as the server provider
4. Fill in the server details:

| Field | Value |
|-------|-------|
| **Server Name** | property-app-server |
| **IP Address** | `<ELASTIC_IP from resources.txt>` |
| **SSH Port** | 22 |
| **PHP Version** | 8.2 or 8.3 |
| **Database** | None (using RDS) |
| **Server Type** | App Server |

### 2.2 Provision Server

1. Click **"Create Server"**
2. Laravel Forge will attempt to connect via SSH
3. **If connection fails**, you need to add your SSH key manually (see Step 3)

---

## Step 3: Configure SSH Access

### Option A: Using Forge's Automatic Setup (Recommended)

If Forge can't connect automatically, follow these steps:

1. **On your local machine**, copy the contents of the private key:
   ```bash
   cat ./infra/property-app-key.pem
   ```

2. **In Laravel Forge**:
   - Go to your server page
   - Click on **"SSH Keys"** in the sidebar
   - Add the key contents to Forge

### Option B: Manual SSH Key Upload to EC2

If you prefer to add Forge's public key to your EC2 instance:

1. **Get Forge's SSH public key**:
   - In Forge, go to **Profile** → **SSH Keys**
   - Copy your Forge SSH public key

2. **Connect to your EC2 instance**:
   ```bash
   ssh -i ./infra/property-app-key.pem ubuntu@<ELASTIC_IP>
   ```

3. **Add Forge's public key to authorized_keys**:
   ```bash
   echo "<Forge's public key>" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

4. **Update EC2 security group** to allow Forge's IP addresses (if restricting SSH):
   - Get current Forge IP ranges from: https://forge.laravel.com/docs/servers
   - Add to EC2 security group inbound rules for port 22

---

## Step 4: Install Additional Software

After Forge successfully connects, install Node.js for Next.js:

### 4.1 Connect via Forge Terminal

1. Go to your server in Forge
2. Click **"Terminal"** or use SSH:
   ```bash
   ssh forge@<ELASTIC_IP>
   ```

### 4.2 Install Node.js 18+

```bash
# Update package manager
sudo apt update

# Install Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x

# Install PM2 for process management
sudo npm install -g pm2

# Install pnpm (optional, faster than npm)
sudo npm install -g pnpm
```

### 4.3 Install PostgreSQL Client (for RDS connectivity)

```bash
sudo apt-get install -y postgresql-client

# Test RDS connection
psql -h <RDS_ENDPOINT from resources.txt> -U admin -d property_production

# Enter password from resources.txt when prompted
```

---

## Step 5: Create Site in Forge

### 5.1 Add New Site

1. In Forge, go to your server page
2. Click **"New Site"**
3. Fill in site details:

| Field | Value |
|-------|-------|
| **Root Domain** | `<ELASTIC_IP>` or your domain name |
| **Project Type** | Static HTML |
| **Web Directory** | `/home/forge/<site-name>/out` |

> **Note**: We'll change this to Next.js output directory after deployment

### 5.2 Install Repository

1. Go to **Apps** → **Git Repository**
2. Connect your GitHub/GitLab/Bitbucket account
3. Fill in repository details:
   - **Repository**: `your-username/property-app`
   - **Branch**: `main`
   - **Install Composer Dependencies**: No

---

## Step 6: Configure Environment Variables

### 6.1 Set Environment Variables in Forge

1. Go to **Environment** tab in your site
2. Add all variables from `./infra/.env.example`:
   - Fill in values from `./infra/resources.txt`
   - Generate JWT_SECRET and SESSION_SECRET:
     ```bash
     openssl rand -base64 32
     ```

3. Click **"Save"** to update the `.env` file

### 6.2 Upload `.env` File (Alternative Method)

You can also upload the `.env` file directly:

```bash
# On your local machine, create .env from template
cp ./infra/.env.example ./.env

# Edit .env with actual values from resources.txt
nano ./.env

# Upload to server via SCP
scp -i ./infra/property-app-key.pem ./.env forge@<ELASTIC_IP>:/home/forge/<site-name>/.env
```

---

## Step 7: Create Deployment Script

### 7.1 Update Deploy Script in Forge

1. Go to **Deployments** tab
2. Replace the default script with this Next.js deployment script:

```bash
cd /home/forge/<site-name>

# Pull latest code
git pull origin main

# Install dependencies
npm ci

# Build Next.js application
npm run build

# Restart PM2 process
pm2 restart property-app || pm2 start npm --name "property-app" -- start -- -p 3000

# Save PM2 configuration
pm2 save
```

### 7.2 Configure Deployment

1. **Enable Quick Deploy**: Toggle "Quick Deploy" to auto-deploy on git push
2. **Deploy Branch**: Set to `main` or your preferred branch

---

## Step 8: Configure Nginx

### 8.1 Update Nginx Configuration

1. Go to **Nginx** tab in your site
2. Replace the configuration with this Next.js-optimized config:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name <ELASTIC_IP or your-domain.com>;

    root /home/forge/<site-name>;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    index index.html index.htm index.php;

    charset utf-8;

    # Static files from Next.js build
    location /_next/static/ {
        alias /home/forge/<site-name>/.next/static/;
        expires 365d;
        access_log off;
    }

    # Public files
    location /static/ {
        alias /home/forge/<site-name>/public/;
        expires 7d;
    }

    # Proxy all other requests to Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:3000/health;
        access_log off;
    }

    access_log off;
    error_log  /var/log/nginx/<site-name>-error.log error;

    error_page 404 /index.php;

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

3. Click **"Update"** to save the configuration

---

## Step 9: SSL Certificate (Optional but Recommended)

### If Using a Domain Name:

1. Point your domain's A record to the Elastic IP
2. In Forge, go to **SSL** tab
3. Click **"LetsEncrypt"**
4. Enter your domain and click **"Obtain Certificate"**

### If Using IP Address Only:

- Skip SSL for now
- Access via `http://<ELASTIC_IP>`
- You can add SSL later when you have a domain

---

## Step 10: Deploy Application

### 10.1 Initial Deployment

1. In Forge, go to **Deployments** tab
2. Click **"Deploy Now"**
3. Monitor the deployment log for any errors

### 10.2 Verify Deployment

1. **Check PM2 status**:
   ```bash
   ssh forge@<ELASTIC_IP>
   pm2 status
   ```

2. **Check application logs**:
   ```bash
   pm2 logs property-app
   ```

3. **Test the application**:
   - Visit `http://<ELASTIC_IP>` in your browser
   - Verify the property listing application loads

---

## Step 11: Post-Deployment Configuration

### 11.1 Database Setup

Connect to your RDS instance and create initial database structure:

```bash
# From EC2 instance
psql -h <RDS_ENDPOINT> -U admin -d property_production

# Run migrations (if using Prisma/TypeORM)
cd /home/forge/<site-name>
npx prisma migrate deploy
```

### 11.2 Test S3 Integration

1. Try uploading a property image through the application
2. Verify it appears in the S3 media bucket:
   ```bash
   aws s3 ls s3://property-media/ --recursive
   ```

### 11.3 Set Up PM2 Monitoring

```bash
# Monitor application
pm2 monit

# Set up startup script (so PM2 restarts on server reboot)
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u forge --hp /home/forge

# Save current PM2 processes
pm2 save
```

---

## Step 12: Set Up Automated Backups

### 12.1 Database Backups to S3

Create a backup script:

```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

Add this content:

```bash
#!/bin/bash

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="property_db_${TIMESTAMP}.sql"

# Dump database
PGPASSWORD="<RDS_PASSWORD>" pg_dump \
  -h <RDS_ENDPOINT> \
  -U admin \
  -d property_production \
  -F c \
  -f "/tmp/${BACKUP_FILE}"

# Upload to S3
aws s3 cp "/tmp/${BACKUP_FILE}" "s3://property-backups/database/"

# Clean up local file
rm "/tmp/${BACKUP_FILE}"

# Delete backups older than 30 days
aws s3 ls s3://property-backups/database/ | while read -r line; do
    createDate=$(echo $line | awk {'print $1" "$2'})
    createDate=$(date -d "$createDate" +%s)
    olderThan=$(date -d "30 days ago" +%s)
    if [[ $createDate -lt $olderThan ]]; then
        fileName=$(echo $line | awk {'print $4'})
        aws s3 rm "s3://property-backups/database/${fileName}"
    fi
done
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/backup-db.sh
```

### 12.2 Schedule Backups with Cron

```bash
# Edit crontab
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /usr/local/bin/backup-db.sh >> /var/log/db-backup.log 2>&1
```

---

## Step 13: Monitoring & Maintenance

### 13.1 Set Up CloudWatch Monitoring (Optional)

Install CloudWatch agent:

```bash
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### 13.2 Monitor Application Health

Create a monitoring script in Forge:

1. Go to **Monitoring** → **Uptime Monitors**
2. Add monitor for `http://<ELASTIC_IP>/health`
3. Set check interval (e.g., every 5 minutes)

### 13.3 Set Up Log Rotation

Ensure PM2 logs don't fill up disk:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs property-app --lines 100

# Check if port 3000 is in use
sudo lsof -i :3000

# Restart application
pm2 restart property-app
```

### Can't connect to RDS

```bash
# Test network connectivity
telnet <RDS_ENDPOINT> 5432

# Check security group allows EC2 access
# Verify DB credentials in .env file
```

### Nginx errors

```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/<site-name>-error.log

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo service nginx restart
```

### S3 upload failures

```bash
# Check IAM credentials in .env
# Verify bucket CORS configuration
aws s3api get-bucket-cors --bucket property-media

# Test S3 access from EC2
aws s3 ls s3://property-media/
```

---

## Security Checklist

- [ ] EC2 security group restricts SSH to known IPs only
- [ ] RDS is not publicly accessible
- [ ] S3 buckets have proper access policies
- [ ] SSL certificate installed (if using domain)
- [ ] Environment variables secured (not committed to git)
- [ ] Database password is strong and stored securely
- [ ] Automated backups are running
- [ ] PM2 is configured to restart on server reboot
- [ ] CloudWatch monitoring enabled
- [ ] Log rotation configured

---

## Useful Commands

```bash
# Connect to server via SSH
ssh forge@<ELASTIC_IP>

# View application logs
pm2 logs property-app

# Restart application
pm2 restart property-app

# Deploy latest changes
cd /home/forge/<site-name>
git pull && npm ci && npm run build && pm2 restart property-app

# Connect to database
psql -h <RDS_ENDPOINT> -U admin -d property_production

# Check S3 usage
aws s3 ls s3://property-media/ --recursive --human-readable --summarize

# Monitor server resources
htop

# Check disk usage
df -h
```

---

## Next Steps

1. Set up CI/CD pipeline for automated deployments
2. Configure CDN (CloudFront) for static assets
3. Implement monitoring and alerting
4. Set up staging environment
5. Create disaster recovery plan

---

**Document Version**: 1.0
**Last Updated**: 2025-11-20
**Status**: Ready for Implementation
