# Quick Start - AWS Infrastructure

## 🎉 Setup Complete!

Your AWS infrastructure has been successfully created and configured.

---

## 📊 Created Resources

### Server
- **EC2 Instance**: `i-07a8ae380a11aa347`
- **Public IP**: `43.217.181.191`
- **Instance Type**: t3.small (2 vCPU, 2GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **SSH Key**: `infra/property-app-key.pem`

### Database
- **RDS Instance**: `property-db`
- **Endpoint**: `property-db.c5c6u8ko05pq.ap-southeast-5.rds.amazonaws.com`
- **Engine**: PostgreSQL 15.5
- **Size**: db.t3.micro (1 vCPU, 1GB RAM)
- **Database**: `property_production`
- **Username**: `dbadmin`
- **Password**: Check `infra/resources.txt`

### Storage (S3)
- **Media Bucket**: `property-media-509852960936`
- **Static Bucket**: `property-static-509852960936`
- **Backups Bucket**: `property-backups-509852960936`

### Networking
- **VPC**: `vpc-09f7e717e0e812fb9`
- **Region**: ap-southeast-5 (Malaysia)
- **Public Subnets**: 2
- **Private Subnets**: 2

---

## 🚀 Next Steps

### 1. Connect to Your Server
```bash
chmod 400 infra/property-app-key.pem
ssh -i infra/property-app-key.pem ubuntu@43.217.181.191
```

### 2. Set Up Environment Variables
```bash
# Copy the template
cp infra/.env.example .env

# Edit with actual values from infra/resources.txt
nano .env
```

**Required values:**
- `AWS_ACCESS_KEY_ID` - From `IAM_ACCESS_KEY` in resources.txt
- `AWS_SECRET_ACCESS_KEY` - From `IAM_SECRET_KEY` in resources.txt
- `DATABASE_URL` - Use RDS endpoint and password from resources.txt
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `SESSION_SECRET` - Generate with: `openssl rand -base64 32`

### 3. Deploy with Laravel Forge (Recommended)

Follow the detailed guide: `infra/forge-setup.md`

**Quick steps:**
1. Add server to Forge with IP: `43.217.181.191`
2. Upload SSH key: `infra/property-app-key.pem`
3. Install Node.js 18+
4. Create site and connect Git repository
5. Configure environment variables
6. Deploy!

### 4. Manual Deployment (Alternative)

If not using Forge, SSH to the server and:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL client
sudo apt-get install -y postgresql-client

# Install PM2
sudo npm install -g pm2

# Clone your repository
git clone https://github.com/your-username/property.git
cd property

# Install dependencies
npm install

# Create .env file with values from infra/resources.txt
nano .env

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "property-app" -- start
pm2 save
pm2 startup
```

---

## 🔧 Essential Commands

### AWS CLI (Always use --profile property)
```bash
# Method 1: With flag
aws s3 ls --profile property

# Method 2: Export profile (recommended)
export AWS_PROFILE=property
aws s3 ls
```

### Server Management
```bash
# SSH to server
ssh -i infra/property-app-key.pem ubuntu@43.217.181.191

# Check application status
pm2 status

# View logs
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

# Password: Check infra/resources.txt
```

### S3 Operations
```bash
export AWS_PROFILE=property

# List media files
aws s3 ls s3://property-media-509852960936/

# Upload file
aws s3 cp file.jpg s3://property-media-509852960936/

# Sync folder
aws s3 sync ./public/images s3://property-static-509852960936/images/
```

---

## 📁 Important Files

| File | Description | Commit to Git? |
|------|-------------|----------------|
| `infra/README.md` | Complete infrastructure guide | ✅ Yes |
| `infra/plan.md` | Detailed architecture docs | ✅ Yes |
| `infra/forge-setup.md` | Forge integration guide | ✅ Yes |
| `infra/setup.sh` | Setup script | ✅ Yes |
| `infra/.env.example` | Environment template | ✅ Yes |
| `infra/resources.txt` | **Resource IDs & passwords** | ❌ **NEVER** |
| `infra/sensitive.txt` | **AWS credentials** | ❌ **NEVER** |
| `infra/*.pem` | **SSH private keys** | ❌ **NEVER** |
| `.env` | **App environment vars** | ❌ **NEVER** |

---

## 💰 Cost Estimate

| Resource | Monthly Cost (USD) |
|----------|-------------------|
| EC2 t3.small | ~$15 |
| RDS db.t3.micro | ~$12 (free for 12 months) |
| EBS Storage (30GB) | ~$2.40 |
| RDS Storage (20GB) | ~$2.30 |
| S3 Storage (~50GB) | ~$1.15 |
| Data Transfer | ~$1 |
| **Total** | **~$34/month** |

*Free tier reduces this to ~$18/month for the first 12 months*

---

## 🔒 Security Reminders

- [ ] Restrict EC2 SSH access to your IP only (currently 0.0.0.0/0)
- [ ] Enable MFA on AWS root account
- [ ] Rotate IAM access keys every 90 days
- [ ] Keep `infra/resources.txt` secure (contains passwords)
- [ ] Never commit `.env` or `infra/resources.txt` to git
- [ ] Set up CloudWatch alarms for monitoring
- [ ] Enable RDS encryption (for production)
- [ ] Configure automated backups

---

## ❓ Troubleshooting

### Can't SSH to EC2
```bash
# Check key permissions
chmod 400 infra/property-app-key.pem

# Verify IP
grep ELASTIC_IP infra/resources.txt

# Check security group allows your IP
aws ec2 describe-security-groups --group-ids sg-0f922f5ce850088d2 --profile property
```

### Can't Connect to Database
```bash
# RDS is in private subnet - must connect from EC2
# First SSH to EC2, then connect to RDS

ssh -i infra/property-app-key.pem ubuntu@43.217.181.191
psql -h property-db.c5c6u8ko05pq.ap-southeast-5.rds.amazonaws.com -U dbadmin -d property_production
```

### S3 Upload Fails
```bash
# Verify IAM credentials
export AWS_PROFILE=property
aws sts get-caller-identity

# Check bucket exists
aws s3 ls | grep property-

# Test CORS
curl -I https://property-media-509852960936.s3.ap-southeast-5.amazonaws.com
```

---

## 📞 Need Help?

- **Full Documentation**: See `infra/README.md`
- **Forge Setup**: See `infra/forge-setup.md`
- **Infrastructure Plan**: See `infra/plan.md`
- **All Credentials**: See `infra/resources.txt` (KEEP SECURE!)

---

**Setup Date**: 2025-11-20
**Region**: ap-southeast-5 (Malaysia)
**Status**: ✅ All Resources Running
