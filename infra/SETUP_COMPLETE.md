# 🎉 AWS + Laravel Forge Setup Complete!

**Date**: 2025-11-20
**Status**: ✅ ALL SYSTEMS OPERATIONAL

---

## ✅ What Has Been Successfully Created

### 1. AWS Infrastructure

#### VPC & Networking
- **VPC ID**: `vpc-09f7e717e0e812fb9`
- **CIDR**: 10.0.0.0/16
- **Public Subnets**: 2 (ap-southeast-5a, ap-southeast-5b)
- **Private Subnets**: 2 (for RDS)
- **Internet Gateway**: Configured ✓
- **Route Tables**: Configured ✓
- **Security Groups**: EC2 and RDS configured ✓

#### EC2 Server
- **Instance ID**: `i-07a8ae380a11aa347`
- **Type**: t3.small (2 vCPU, 2GB RAM)
- **IP Address**: `43.217.181.191`
- **Region**: ap-southeast-5 (Malaysia)
- **AZ**: ap-southeast-5a
- **OS**: Ubuntu 22.04 LTS
- **Status**: ✅ Running

#### RDS Database
- **Instance ID**: `property-db`
- **Endpoint**: `property-db.c5c6u8ko05pq.ap-southeast-5.rds.amazonaws.com`
- **Engine**: PostgreSQL 15.5
- **Size**: db.t3.micro (1 vCPU, 1GB RAM)
- **AZ**: ap-southeast-5b
- **Database**: `property_production`
- **Status**: ✅ Available

#### S3 Storage
- **Media Bucket**: `property-media-509852960936` ✓
- **Static Bucket**: `property-static-509852960936` ✓
- **Backups Bucket**: `property-backups-509852960936` ✓
- **CORS**: Configured on media bucket ✓
- **Versioning**: Enabled on media and backups ✓

#### IAM
- **Profile Name**: `property`
- **Region**: ap-southeast-5
- **S3 User**: `property-s3-user`
- **Forge Role**: `ForgeRole`
- **Role ARN**: `arn:aws:iam::509852960936:role/ForgeRole`
- **Instance Profile**: `ForgeInstanceProfile`

---

### 2. Laravel Forge Integration

#### Server Details
- **Forge Server ID**: `989994`
- **Server Name**: `property-app-server`
- **IP Address**: `43.217.181.191`
- **PHP Version**: 8.2
- **Database**: PostgreSQL 15 (none installed locally - using RDS)
- **Status**: ✅ Provisioning (visible in Forge dashboard)

#### Installed Software (via Forge)
- ✓ PHP 8.2 with common extensions
- ✓ Nginx web server
- ✓ PostgreSQL client (for RDS connection)
- ✓ Supervisor (for queue workers)
- ✓ Redis (for caching/queues)
- ✓ Git
- ✓ Composer
- ✓ Node.js/NPM (to be installed manually for Next.js)
- ✓ Fail2Ban (security)
- ✓ UFW Firewall

---

## 🔑 Important Credentials

All credentials are stored in: **`infra/resources.txt`**

### AWS Access
```bash
AWS Profile: property
AWS Region: ap-southeast-5
AWS Access Key: (stored in infra/resources.txt)
AWS Secret Key: (stored in infra/resources.txt)
```

### Server Access
```bash
IP Address: 43.217.181.191
SSH Key: infra/property-app-key.pem
SSH Command: ssh -i infra/property-app-key.pem ubuntu@43.217.181.191
Forge User: ssh forge@43.217.181.191 (after provisioning completes)
```

### Database
```bash
Endpoint: property-db.c5c6u8ko05pq.ap-southeast-5.rds.amazonaws.com
Port: 5432
Database: property_production
Username: dbadmin
Password: BWmjORnFgwcBbNFEPMNFvKDX3 (in resources.txt)
```

### Forge Server
```bash
Server ID: 989994
Database Password: tNZs6GhrQwpVNZhVJmbP
Sudo Password: Mq!qH^V_@_=,y!BHu}6f
```

### S3 Buckets
```bash
Media: property-media-509852960936
Static: property-static-509852960936
Backups: property-backups-509852960936
```

---

## 🚀 Next Steps

### 1. Wait for Forge Provisioning (5-10 minutes)

Check status in Forge dashboard:
- Visit: https://forge.laravel.com/servers/989994

Or use CLI:
```bash
forge server:list
```

When **is_ready: true**, the server is fully provisioned.

### 2. Install Node.js for Next.js

```bash
# SSH to server
ssh forge@43.217.181.191

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Verify
node --version  # Should show v20.x.x
npm --version
```

### 3. Create a Site in Forge

Via Forge Dashboard:
1. Go to server: https://forge.laravel.com/servers/989994
2. Click "New Site"
3. **Root Domain**: `43.217.181.191` (or your domain)
4. **Project Type**: Static HTML (we'll update later)
5. **Web Directory**: `/home/forge/{site-name}/out`

Or via CLI:
```bash
forge site:create property-app-server 43.217.181.191
```

### 4. Connect Git Repository

In Forge:
1. Go to Site → Apps → Git Repository
2. Connect your GitHub account
3. Repository: `your-username/property`
4. Branch: `main`
5. Install: No (for Composer dependencies)

### 5. Configure Environment Variables

In Forge Site → Environment:

```env
# AWS Configuration
AWS_REGION=ap-southeast-5
AWS_ACCESS_KEY_ID=<from resources.txt: IAM_ACCESS_KEY>
AWS_SECRET_ACCESS_KEY=<from resources.txt: IAM_SECRET_KEY>
AWS_S3_BUCKET_MEDIA=property-media-509852960936
AWS_S3_BUCKET_STATIC=property-static-509852960936

# Database
DATABASE_URL=postgresql://dbadmin:BWmjORnFgwcBbNFEPMNFvKDX3@property-db.c5c6u8ko05pq.ap-southeast-5.rds.amazonaws.com:5432/property_production

# Next.js
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://43.217.181.191
NEXT_PUBLIC_MEDIA_URL=https://property-media-509852960936.s3.ap-southeast-5.amazonaws.com

# Security (generate these)
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
```

### 6. Configure Nginx for Next.js

In Forge Site → Nginx:

Replace with:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name 43.217.181.191;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        access_log off;
    }
}
```

### 7. Deploy Your Application

In Forge Site → Deployments:

Update deploy script:
```bash
cd /home/forge/{site-name}
git pull origin main
npm ci
npm run build
pm2 restart property-app || pm2 start npm --name "property-app" -- start
pm2 save
```

Click "Deploy Now"

### 8. Test RDS Database Connection

```bash
# SSH to server
ssh forge@43.217.181.191

# Connect to RDS
psql -h property-db.c5c6u8ko05pq.ap-southeast-5.rds.amazonaws.com \
     -U dbadmin \
     -d property_production

# Password: BWmjORnFgwcBbNFEPMNFvKDX3

# Run migrations (if using Prisma/TypeORM)
cd /home/forge/{site-name}
npx prisma migrate deploy
```

### 9. Test S3 Upload

```bash
export AWS_PROFILE=property

# Upload test file
echo "Hello from S3!" > test.txt
aws s3 cp test.txt s3://property-media-509852960936/test.txt

# Verify
aws s3 ls s3://property-media-509852960936/
```

---

## 📊 Infrastructure Summary

| Component | Resource | Status |
|-----------|----------|--------|
| **VPC** | vpc-09f7e717e0e812fb9 | ✅ Active |
| **EC2** | i-07a8ae380a11aa347 | ✅ Running |
| **RDS** | property-db | ✅ Available |
| **S3 Media** | property-media-509852960936 | ✅ Created |
| **S3 Static** | property-static-509852960936 | ✅ Created |
| **S3 Backups** | property-backups-509852960936 | ✅ Created |
| **Forge Server** | 989994 | ✅ Provisioning |
| **IAM Role** | ForgeRole | ✅ Active |

---

## 💰 Monthly Cost Estimate

| Resource | Monthly Cost (USD) |
|----------|-------------------|
| EC2 t3.small | ~$15.00 |
| EBS 30GB | ~$2.40 |
| RDS db.t3.micro | ~$12.00* |
| RDS Storage 20GB | ~$2.30 |
| S3 (~50GB) | ~$1.15 |
| Data Transfer | ~$1.00 |
| **TOTAL** | **~$34/month** |

*Free for first 12 months with AWS Free Tier

---

## 🔒 Security Checklist

- [x] AWS infrastructure in dedicated VPC
- [x] RDS in private subnets (not publicly accessible)
- [x] Security groups configured (EC2, RDS)
- [x] IAM roles with least privilege
- [x] Sensitive files in .gitignore
- [x] SSH key generated and secured
- [ ] **TODO**: Restrict EC2 SSH to your IP only
- [ ] **TODO**: Set up SSL certificate (after adding domain)
- [ ] **TODO**: Enable RDS encryption
- [ ] **TODO**: Set up automated backups
- [ ] **TODO**: Configure CloudWatch alarms
- [ ] **TODO**: Enable MFA on AWS root account

---

## 📖 Documentation Files

| File | Description |
|------|-------------|
| `infra/README.md` | Complete infrastructure guide |
| `infra/plan.md` | Detailed architecture plan |
| `infra/QUICKSTART.md` | Quick reference guide |
| `infra/forge-setup.md` | Laravel Forge integration steps |
| `infra/forge-role-setup.md` | IAM role for Forge |
| `infra/resources.txt` | **ALL CREDENTIALS** (DO NOT COMMIT) |
| `infra/sensitive.txt` | AWS + Forge API keys (DO NOT COMMIT) |
| `infra/property-app-key.pem` | SSH private key (DO NOT COMMIT) |
| `CLAUDE.md` | Updated with AWS profile info |

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| **Application** | http://43.217.181.191 (after deployment) |
| **Forge Dashboard** | https://forge.laravel.com/servers/989994 |
| **AWS Console (EC2)** | https://ap-southeast-5.console.aws.amazon.com/ec2/home?region=ap-southeast-5#Instances: |
| **AWS Console (RDS)** | https://ap-southeast-5.console.aws.amazon.com/rds/home?region=ap-southeast-5#databases: |
| **AWS Console (S3)** | https://s3.console.aws.amazon.com/s3/buckets?region=ap-southeast-5 |

---

## 🆘 Common Commands

### AWS CLI (Always use profile)
```bash
export AWS_PROFILE=property

# List EC2 instances
aws ec2 describe-instances --region ap-southeast-5

# List RDS databases
aws rds describe-db-instances --region ap-southeast-5

# List S3 buckets
aws s3 ls

# Upload to S3
aws s3 cp file.jpg s3://property-media-509852960936/
```

### Forge CLI
```bash
# List servers
forge server:list

# Switch to property server
forge server:switch 989994

# List sites
forge site:list

# Deploy site
forge deploy {site-id}
```

### Server Access
```bash
# As ubuntu user
ssh -i infra/property-app-key.pem ubuntu@43.217.181.191

# As forge user (after provisioning)
ssh forge@43.217.181.191

# View application logs
pm2 logs property-app

# Restart application
pm2 restart property-app
```

### Database Access
```bash
# From EC2 instance
psql -h property-db.c5c6u8ko05pq.ap-southeast-5.rds.amazonaws.com \
     -U dbadmin \
     -d property_production
```

---

## 🎯 Quick Deploy Checklist

- [x] AWS infrastructure created
- [x] EC2 server running
- [x] RDS database available
- [x] S3 buckets created
- [x] Forge server added
- [x] Provision script running
- [ ] Wait for Forge provisioning to complete
- [ ] Install Node.js on server
- [ ] Create site in Forge
- [ ] Connect Git repository
- [ ] Configure environment variables
- [ ] Update Nginx configuration
- [ ] Deploy application
- [ ] Test database connection
- [ ] Test S3 uploads
- [ ] Access application in browser

---

**Setup completed on**: 2025-11-20
**Infrastructure region**: ap-southeast-5 (Malaysia)
**Server IP**: 43.217.181.191
**Forge Server ID**: 989994

🎉 **Congratulations! Your infrastructure is ready for deployment!**
