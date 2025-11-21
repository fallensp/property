# AWS Infrastructure Setup Plan

## Project Overview
Next.js 14 property listing application deployment to AWS infrastructure in Malaysia region, managed via Laravel Forge.

## Infrastructure Summary

| Resource | Specification | Purpose |
|----------|--------------|---------|
| **Region** | ap-southeast-5 (Malaysia) | Primary deployment region |
| **EC2** | t3.small (2 vCPU, 2GB RAM) | Application server |
| **RDS** | MySQL 8.0 / PostgreSQL 15 | Database server |
| **S3** | Multiple buckets | Media storage, static assets, backups |
| **VPC** | Custom VPC with subnets | Network isolation |

---

## 1. Prerequisites

### AWS Credentials
From `infra/sensitive.txt` (stored locally, not in Git):
- **Access Key**: `<stored in infra/sensitive.txt>`
- **Secret Key**: `<stored in infra/sensitive.txt>`
- **Region**: ap-southeast-5

### Local Requirements
- AWS CLI v2 installed
- SSH key generation tools (ssh-keygen)
- (Optional) Terraform >= 1.5 for IaC

---

## 2. VPC & Networking Setup

### VPC Configuration
```bash
# VPC CIDR: 10.0.0.0/16
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --region ap-southeast-5 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=property-app-vpc}]'
```

### Subnets
- **Public Subnet 1**: 10.0.1.0/24 (for EC2, NAT Gateway)
- **Public Subnet 2**: 10.0.2.0/24 (for high availability)
- **Private Subnet 1**: 10.0.11.0/24 (for RDS primary)
- **Private Subnet 2**: 10.0.12.0/24 (for RDS standby)

### Internet Gateway
- Attach to VPC for public internet access
- Configure route table for public subnets (0.0.0.0/0 → IGW)

### Security Groups

#### EC2 Security Group
| Type | Port | Source | Description |
|------|------|--------|-------------|
| SSH | 22 | Your IP / Forge IPs | Server management |
| HTTP | 80 | 0.0.0.0/0 | Web traffic |
| HTTPS | 443 | 0.0.0.0/0 | Secure web traffic |

#### RDS Security Group
| Type | Port | Source | Description |
|------|------|--------|-------------|
| MySQL/PostgreSQL | 3306/5432 | EC2 Security Group | Database access |

---

## 3. EC2 Instance Setup

### Instance Specifications
- **AMI**: Ubuntu 22.04 LTS (ami-xxxxxx for ap-southeast-5)
- **Instance Type**: t3.small
- **Storage**: 30GB GP3 SSD (3000 IOPS, 125 MB/s throughput)
- **Monitoring**: CloudWatch detailed monitoring enabled

### EC2 Setup Commands
```bash
# Create key pair
aws ec2 create-key-pair \
  --key-name property-app-key \
  --region ap-southeast-5 \
  --query 'KeyMaterial' \
  --output text > property-app-key.pem

chmod 400 property-app-key.pem

# Launch instance (after VPC/subnet creation)
aws ec2 run-instances \
  --image-id ami-xxxxxx \
  --instance-type t3.small \
  --key-name property-app-key \
  --security-group-ids sg-xxxxxx \
  --subnet-id subnet-xxxxxx \
  --block-device-mappings 'DeviceName=/dev/sda1,Ebs={VolumeSize=30,VolumeType=gp3}' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=property-app-server}]' \
  --region ap-southeast-5
```

### Elastic IP
```bash
# Allocate and associate Elastic IP
aws ec2 allocate-address \
  --domain vpc \
  --region ap-southeast-5

aws ec2 associate-address \
  --instance-id i-xxxxxx \
  --allocation-id eipalloc-xxxxxx \
  --region ap-southeast-5
```

### Instance Profile (IAM Role)
Create EC2 instance role with S3 access for media uploads and backups.

---

## 4. S3 Buckets Configuration

### Bucket Structure
1. **property-app-media-{unique-id}**: Property images, videos, floorplans
2. **property-app-static-{unique-id}**: Next.js static exports, CDN assets
3. **property-app-backups-{unique-id}**: Database and application backups

### S3 Setup Commands
```bash
# Media bucket
aws s3api create-bucket \
  --bucket property-app-media-{unique-id} \
  --region ap-southeast-5 \
  --create-bucket-configuration LocationConstraint=ap-southeast-5

# Configure CORS for media uploads
aws s3api put-bucket-cors \
  --bucket property-app-media-{unique-id} \
  --cors-configuration file://cors-config.json

# Enable versioning for backups bucket
aws s3api put-bucket-versioning \
  --bucket property-app-backups-{unique-id} \
  --versioning-configuration Status=Enabled
```

### Lifecycle Policies
- Media: Transition to IA after 90 days, Glacier after 365 days
- Backups: Keep 30-day retention, expire older backups

### Bucket Policies
- Public read access for media bucket (images/videos)
- Private access for backups bucket
- CloudFront origin access for static assets

---

## 5. RDS Database Setup

### Database Specifications
- **Engine**: MySQL 8.0 or PostgreSQL 15 (to be confirmed)
- **Instance Class**: db.t3.small (2 vCPU, 2GB RAM)
- **Storage**: 20GB GP3 with autoscaling (up to 100GB)
- **Multi-AZ**: Optional (recommended for production)
- **Backup Retention**: 7 days
- **Backup Window**: 03:00-04:00 UTC+8 (11:00-12:00 UTC)
- **Maintenance Window**: Sunday 04:00-05:00 UTC+8 (12:00-13:00 UTC)

### RDS Setup Commands
```bash
# Create DB subnet group (requires 2+ private subnets)
aws rds create-db-subnet-group \
  --db-subnet-group-name property-app-db-subnet \
  --db-subnet-group-description "Property app database subnets" \
  --subnet-ids subnet-private1 subnet-private2 \
  --region ap-southeast-5

# Create RDS instance (MySQL example)
aws rds create-db-instance \
  --db-instance-identifier property-app-db \
  --db-instance-class db.t3.small \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password {SECURE_PASSWORD} \
  --allocated-storage 20 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-rds-xxxxxx \
  --db-subnet-group-name property-app-db-subnet \
  --backup-retention-period 7 \
  --preferred-backup-window 03:00-04:00 \
  --preferred-maintenance-window sun:04:00-sun:05:00 \
  --publicly-accessible false \
  --region ap-southeast-5
```

### Database Configuration
- **Database Name**: property_app_production
- **Character Set**: utf8mb4 (MySQL) / UTF8 (PostgreSQL)
- **Collation**: utf8mb4_unicode_ci (MySQL)

---

## 6. IAM Configuration

### IAM User for Application
```bash
# Create IAM user for S3 access
aws iam create-user \
  --user-name property-app-s3-user

# Create access key
aws iam create-access-key \
  --user-name property-app-s3-user
```

### IAM Policies

#### S3 Access Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::property-app-media-*/*",
        "arn:aws:s3:::property-app-media-*",
        "arn:aws:s3:::property-app-static-*/*",
        "arn:aws:s3:::property-app-static-*"
      ]
    }
  ]
}
```

#### EC2 Instance Role Policy
Allow EC2 to access S3 for media uploads and backups without storing credentials on the instance.

---

## 7. Laravel Forge Integration

### Prerequisites for Forge
- [x] EC2 instance running Ubuntu 22.04 LTS
- [x] Public IP address (Elastic IP)
- [x] SSH key pair (.pem file)
- [ ] Security group allowing Forge IP addresses

### Forge IP Addresses to Whitelist
Add these IPs to EC2 security group (SSH port 22):
- Check Laravel Forge documentation for current IP ranges
- Alternatively, allow your office/home IP address

### Server Connection Details
Prepare this information for Forge:
- **IP Address**: {ELASTIC_IP}
- **SSH Port**: 22
- **SSH User**: ubuntu
- **SSH Key**: Contents of property-app-key.pem
- **PHP Version**: 8.2+
- **Database**: Remote (RDS endpoint)

### Post-Forge Setup
After connecting to Forge:
1. Install Node.js 18+ for Next.js
2. Configure environment variables
3. Set up deployment script for Next.js build
4. Configure Nginx for Next.js application
5. Set up SSL certificate (Let's Encrypt)
6. Configure connection to RDS database

---

## 8. Cost Estimation (Monthly)

| Resource | Specification | Estimated Cost (USD) |
|----------|--------------|---------------------|
| EC2 t3.small | 2 vCPU, 2GB RAM | ~$15 |
| EBS GP3 Storage | 30GB | ~$2.40 |
| RDS db.t3.small | 2 vCPU, 2GB RAM | ~$25 |
| RDS Storage | 20GB GP3 | ~$2.30 |
| S3 Storage | ~50GB (estimated) | ~$1.15 |
| S3 Requests | Media uploads/downloads | ~$1 |
| Data Transfer | 10GB egress (estimated) | ~$0.90 |
| Elastic IP | 1 static IP | Free (when associated) |
| **Total** | | **~$47.75/month** |

*Note: Costs may vary based on actual usage. Free tier eligible for first 12 months (EC2 t3.micro, RDS db.t3.micro).*

---

## 9. Deployment Checklist

### Phase 1: Network Setup
- [ ] Create VPC
- [ ] Create subnets (2 public, 2 private)
- [ ] Create and attach Internet Gateway
- [ ] Configure route tables
- [ ] Create security groups (EC2, RDS)

### Phase 2: Compute & Storage
- [ ] Generate SSH key pair
- [ ] Launch EC2 instance (t3.small)
- [ ] Allocate and associate Elastic IP
- [ ] Create S3 buckets (media, static, backups)
- [ ] Configure S3 CORS and policies
- [ ] Create IAM roles and users

### Phase 3: Database
- [ ] Create DB subnet group
- [ ] Launch RDS instance (MySQL/PostgreSQL)
- [ ] Note RDS endpoint and credentials
- [ ] Test database connectivity from EC2

### Phase 4: Laravel Forge
- [ ] Add server to Forge
- [ ] Install Node.js 18+
- [ ] Configure environment variables
- [ ] Set up deployment script
- [ ] Configure Nginx for Next.js
- [ ] Install SSL certificate

### Phase 5: Application Deployment
- [ ] Clone repository to server
- [ ] Install dependencies (npm install)
- [ ] Build Next.js application (npm run build)
- [ ] Configure environment variables
- [ ] Test application functionality
- [ ] Configure PM2 or systemd for Next.js

### Phase 6: Testing & Monitoring
- [ ] Test property listing creation
- [ ] Test media uploads to S3
- [ ] Verify database operations
- [ ] Set up CloudWatch alarms
- [ ] Configure backup automation
- [ ] Load testing

---

## 10. Environment Variables

Required environment variables for the application:

```bash
# AWS Configuration
AWS_REGION=ap-southeast-5
AWS_ACCESS_KEY_ID={IAM_USER_ACCESS_KEY}
AWS_SECRET_ACCESS_KEY={IAM_USER_SECRET_KEY}
AWS_S3_BUCKET_MEDIA=property-app-media-{unique-id}
AWS_S3_BUCKET_STATIC=property-app-static-{unique-id}

# Database Configuration
DATABASE_URL=mysql://admin:{password}@{rds-endpoint}:3306/property_app_production
# OR for PostgreSQL
# DATABASE_URL=postgresql://admin:{password}@{rds-endpoint}:5432/property_app_production

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_ENABLE_THEME_TOGGLE=true

# Application URLs
NEXT_PUBLIC_API_URL=https://{your-domain.com}
NEXT_PUBLIC_MEDIA_URL=https://{media-bucket}.s3.ap-southeast-5.amazonaws.com
```

---

## 11. Security Best Practices

### Network Security
- [x] VPC with private subnets for RDS
- [ ] Network ACLs for additional subnet-level security
- [ ] VPC Flow Logs for network monitoring
- [ ] AWS WAF for application firewall (optional)

### Access Control
- [ ] Principle of least privilege for IAM policies
- [ ] MFA for AWS root account
- [ ] Rotate AWS access keys every 90 days
- [ ] Use EC2 instance roles instead of storing credentials
- [ ] Restrict security group rules to specific IPs

### Data Protection
- [ ] Enable S3 bucket encryption (AES-256)
- [ ] Enable RDS encryption at rest
- [ ] SSL/TLS for all data in transit
- [ ] Regular automated backups
- [ ] Backup testing and restoration drills

### Monitoring & Compliance
- [ ] Enable CloudTrail for API logging
- [ ] Set up CloudWatch alarms for critical metrics
- [ ] Configure AWS Config for compliance tracking
- [ ] Regular security audits using AWS Trusted Advisor

---

## 12. Next Steps

1. **Confirm configuration details** (database engine, bucket names)
2. **Run setup script** to configure AWS CLI and create resources
3. **Document credentials** securely (use AWS Secrets Manager)
4. **Connect server to Laravel Forge**
5. **Deploy application and test**

---

## Additional Resources

- [AWS CLI Command Reference](https://docs.aws.amazon.com/cli/)
- [Laravel Forge Documentation](https://forge.laravel.com/docs/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)

---

**Document Version**: 1.0
**Last Updated**: 2025-11-20
**Owner**: Ivan
**Status**: Planning Phase
