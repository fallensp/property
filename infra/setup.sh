#!/bin/bash

################################################################################
# AWS Infrastructure Setup Script
# Project: Property Listing Application
# Region: ap-southeast-5 (Malaysia)
#
# This script automates the creation of:
# - VPC and networking components
# - EC2 instance (t3.small)
# - RDS PostgreSQL instance (db.t3.micro)
# - S3 buckets for media, static assets, and backups
# - IAM roles and policies
################################################################################

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGION="ap-southeast-5"
PROJECT_NAME="property"
VPC_CIDR="10.0.0.0/16"
PUBLIC_SUBNET_1_CIDR="10.0.1.0/24"
PUBLIC_SUBNET_2_CIDR="10.0.2.0/24"
PRIVATE_SUBNET_1_CIDR="10.0.11.0/24"
PRIVATE_SUBNET_2_CIDR="10.0.12.0/24"

# EC2 Configuration
EC2_INSTANCE_TYPE="t3.small"
EC2_KEY_NAME="${PROJECT_NAME}-app-key"
EC2_VOLUME_SIZE=30

# RDS Configuration
RDS_ENGINE="postgres"
RDS_ENGINE_VERSION="15.5"
RDS_INSTANCE_CLASS="db.t3.micro"
RDS_MASTER_USERNAME="admin"
RDS_ALLOCATED_STORAGE=20
RDS_DB_NAME="${PROJECT_NAME}_production"

# S3 Bucket Names (using AWS account ID for uniqueness)
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
S3_MEDIA_BUCKET="${PROJECT_NAME}-media-${AWS_ACCOUNT_ID}"
S3_STATIC_BUCKET="${PROJECT_NAME}-static-${AWS_ACCOUNT_ID}"
S3_BACKUPS_BUCKET="${PROJECT_NAME}-backups-${AWS_ACCOUNT_ID}"

# Output file for created resource IDs
OUTPUT_FILE="./infra/resources.txt"

################################################################################
# Helper Functions
################################################################################

print_step() {
    echo -e "${GREEN}==>${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}WARNING:${NC} $1"
}

print_error() {
    echo -e "${RED}ERROR:${NC} $1"
}

check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
        exit 1
    fi
    print_step "AWS CLI found: $(aws --version)"
}

configure_aws_credentials() {
    print_step "Configuring AWS credentials..."

    # Read credentials from sensitive.txt
    if [ ! -f "./infra/sensitive.txt" ]; then
        print_error "sensitive.txt not found!"
        exit 1
    fi

    # Extract credentials (handling the typos in the file)
    AWS_ACCESS_KEY=$(grep -E "aws_(key|keuy)" ./infra/sensitive.txt | cut -d'=' -f2)
    AWS_SECRET_KEY=$(grep -E "aws_(secret|secrfet)" ./infra/sensitive.txt | cut -d'=' -f2)

    # Configure AWS CLI
    aws configure set aws_access_key_id "$AWS_ACCESS_KEY" --profile ${PROJECT_NAME}
    aws configure set aws_secret_access_key "$AWS_SECRET_KEY" --profile ${PROJECT_NAME}
    aws configure set region "$REGION" --profile ${PROJECT_NAME}
    aws configure set output json --profile ${PROJECT_NAME}

    # Set as default profile for this script
    export AWS_PROFILE=${PROJECT_NAME}

    print_step "AWS credentials configured for profile: ${PROJECT_NAME}"
}

save_resource() {
    echo "$1=$2" >> "$OUTPUT_FILE"
}

################################################################################
# VPC and Networking
################################################################################

create_vpc() {
    print_step "Creating VPC..."

    VPC_ID=$(aws ec2 create-vpc \
        --cidr-block "$VPC_CIDR" \
        --region "$REGION" \
        --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=${PROJECT_NAME}-vpc}]" \
        --query 'Vpc.VpcId' \
        --output text)

    save_resource "VPC_ID" "$VPC_ID"
    print_step "VPC created: $VPC_ID"

    # Enable DNS hostnames
    aws ec2 modify-vpc-attribute \
        --vpc-id "$VPC_ID" \
        --enable-dns-hostnames

    print_step "DNS hostnames enabled"
}

create_internet_gateway() {
    print_step "Creating Internet Gateway..."

    IGW_ID=$(aws ec2 create-internet-gateway \
        --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=${PROJECT_NAME}-igw}]" \
        --query 'InternetGateway.InternetGatewayId' \
        --output text)

    save_resource "IGW_ID" "$IGW_ID"

    # Attach to VPC
    aws ec2 attach-internet-gateway \
        --internet-gateway-id "$IGW_ID" \
        --vpc-id "$VPC_ID"

    print_step "Internet Gateway created and attached: $IGW_ID"
}

create_subnets() {
    print_step "Creating subnets..."

    # Get availability zones
    AZ1=$(aws ec2 describe-availability-zones \
        --region "$REGION" \
        --query 'AvailabilityZones[0].ZoneName' \
        --output text)

    AZ2=$(aws ec2 describe-availability-zones \
        --region "$REGION" \
        --query 'AvailabilityZones[1].ZoneName' \
        --output text)

    # Public Subnet 1
    PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
        --vpc-id "$VPC_ID" \
        --cidr-block "$PUBLIC_SUBNET_1_CIDR" \
        --availability-zone "$AZ1" \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-1}]" \
        --query 'Subnet.SubnetId' \
        --output text)

    save_resource "PUBLIC_SUBNET_1" "$PUBLIC_SUBNET_1"

    # Public Subnet 2
    PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
        --vpc-id "$VPC_ID" \
        --cidr-block "$PUBLIC_SUBNET_2_CIDR" \
        --availability-zone "$AZ2" \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-2}]" \
        --query 'Subnet.SubnetId' \
        --output text)

    save_resource "PUBLIC_SUBNET_2" "$PUBLIC_SUBNET_2"

    # Private Subnet 1 (for RDS)
    PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
        --vpc-id "$VPC_ID" \
        --cidr-block "$PRIVATE_SUBNET_1_CIDR" \
        --availability-zone "$AZ1" \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-private-1}]" \
        --query 'Subnet.SubnetId' \
        --output text)

    save_resource "PRIVATE_SUBNET_1" "$PRIVATE_SUBNET_1"

    # Private Subnet 2 (for RDS)
    PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
        --vpc-id "$VPC_ID" \
        --cidr-block "$PRIVATE_SUBNET_2_CIDR" \
        --availability-zone "$AZ2" \
        --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-private-2}]" \
        --query 'Subnet.SubnetId' \
        --output text)

    save_resource "PRIVATE_SUBNET_2" "$PRIVATE_SUBNET_2"

    print_step "Subnets created in AZ1 ($AZ1) and AZ2 ($AZ2)"
}

create_route_tables() {
    print_step "Creating route tables..."

    # Create public route table
    PUBLIC_RT=$(aws ec2 create-route-table \
        --vpc-id "$VPC_ID" \
        --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-rt}]" \
        --query 'RouteTable.RouteTableId' \
        --output text)

    save_resource "PUBLIC_RT" "$PUBLIC_RT"

    # Add route to Internet Gateway
    aws ec2 create-route \
        --route-table-id "$PUBLIC_RT" \
        --destination-cidr-block "0.0.0.0/0" \
        --gateway-id "$IGW_ID"

    # Associate public subnets with public route table
    aws ec2 associate-route-table \
        --route-table-id "$PUBLIC_RT" \
        --subnet-id "$PUBLIC_SUBNET_1"

    aws ec2 associate-route-table \
        --route-table-id "$PUBLIC_RT" \
        --subnet-id "$PUBLIC_SUBNET_2"

    print_step "Route tables configured"
}

create_security_groups() {
    print_step "Creating security groups..."

    # EC2 Security Group
    EC2_SG=$(aws ec2 create-security-group \
        --group-name "${PROJECT_NAME}-ec2-sg" \
        --description "Security group for EC2 instance" \
        --vpc-id "$VPC_ID" \
        --query 'GroupId' \
        --output text)

    save_resource "EC2_SG" "$EC2_SG"

    # Add tags
    aws ec2 create-tags \
        --resources "$EC2_SG" \
        --tags "Key=Name,Value=${PROJECT_NAME}-ec2-sg"

    # SSH (22) - You may want to restrict this to your IP
    aws ec2 authorize-security-group-ingress \
        --group-id "$EC2_SG" \
        --protocol tcp \
        --port 22 \
        --cidr 0.0.0.0/0

    # HTTP (80)
    aws ec2 authorize-security-group-ingress \
        --group-id "$EC2_SG" \
        --protocol tcp \
        --port 80 \
        --cidr 0.0.0.0/0

    # HTTPS (443)
    aws ec2 authorize-security-group-ingress \
        --group-id "$EC2_SG" \
        --protocol tcp \
        --port 443 \
        --cidr 0.0.0.0/0

    print_step "EC2 security group created: $EC2_SG"
    print_warning "SSH is open to 0.0.0.0/0. Consider restricting to your IP address."

    # RDS Security Group
    RDS_SG=$(aws ec2 create-security-group \
        --group-name "${PROJECT_NAME}-rds-sg" \
        --description "Security group for RDS instance" \
        --vpc-id "$VPC_ID" \
        --query 'GroupId' \
        --output text)

    save_resource "RDS_SG" "$RDS_SG"

    aws ec2 create-tags \
        --resources "$RDS_SG" \
        --tags "Key=Name,Value=${PROJECT_NAME}-rds-sg"

    # PostgreSQL (5432) from EC2 security group
    aws ec2 authorize-security-group-ingress \
        --group-id "$RDS_SG" \
        --protocol tcp \
        --port 5432 \
        --source-group "$EC2_SG"

    print_step "RDS security group created: $RDS_SG"
}

################################################################################
# EC2 Instance
################################################################################

create_key_pair() {
    print_step "Creating EC2 key pair..."

    aws ec2 create-key-pair \
        --key-name "$EC2_KEY_NAME" \
        --query 'KeyMaterial' \
        --output text > "./infra/${EC2_KEY_NAME}.pem"

    chmod 400 "./infra/${EC2_KEY_NAME}.pem"

    print_step "Key pair created: ./infra/${EC2_KEY_NAME}.pem"
    print_warning "Keep this key file secure! You'll need it to connect to the EC2 instance."
}

create_ec2_instance() {
    print_step "Creating EC2 instance..."

    # Get latest Ubuntu 22.04 AMI for the region
    AMI_ID=$(aws ec2 describe-images \
        --owners 099720109477 \
        --filters "Name=name,Values=ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*" \
        --query 'sort_by(Images, &CreationDate)[-1].ImageId' \
        --output text)

    print_step "Using AMI: $AMI_ID (Ubuntu 22.04 LTS)"

    # Create instance
    INSTANCE_ID=$(aws ec2 run-instances \
        --image-id "$AMI_ID" \
        --instance-type "$EC2_INSTANCE_TYPE" \
        --key-name "$EC2_KEY_NAME" \
        --security-group-ids "$EC2_SG" \
        --subnet-id "$PUBLIC_SUBNET_1" \
        --block-device-mappings "DeviceName=/dev/sda1,Ebs={VolumeSize=${EC2_VOLUME_SIZE},VolumeType=gp3}" \
        --associate-public-ip-address \
        --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${PROJECT_NAME}-app-server}]" \
        --query 'Instances[0].InstanceId' \
        --output text)

    save_resource "INSTANCE_ID" "$INSTANCE_ID"

    print_step "EC2 instance launched: $INSTANCE_ID"
    print_step "Waiting for instance to be running..."

    aws ec2 wait instance-running --instance-ids "$INSTANCE_ID"

    print_step "Instance is running!"
}

allocate_elastic_ip() {
    print_step "Allocating Elastic IP..."

    ALLOCATION_ID=$(aws ec2 allocate-address \
        --domain vpc \
        --query 'AllocationId' \
        --output text)

    save_resource "ALLOCATION_ID" "$ALLOCATION_ID"

    # Wait a moment for instance to be fully ready
    sleep 5

    # Associate with instance
    aws ec2 associate-address \
        --instance-id "$INSTANCE_ID" \
        --allocation-id "$ALLOCATION_ID"

    # Get the public IP
    ELASTIC_IP=$(aws ec2 describe-addresses \
        --allocation-ids "$ALLOCATION_ID" \
        --query 'Addresses[0].PublicIp' \
        --output text)

    save_resource "ELASTIC_IP" "$ELASTIC_IP"

    print_step "Elastic IP allocated and associated: $ELASTIC_IP"
}

################################################################################
# S3 Buckets
################################################################################

create_s3_buckets() {
    print_step "Creating S3 buckets..."

    # Media bucket
    if aws s3api head-bucket --bucket "$S3_MEDIA_BUCKET" 2>/dev/null; then
        print_warning "Bucket $S3_MEDIA_BUCKET already exists. Skipping..."
    else
        aws s3api create-bucket \
            --bucket "$S3_MEDIA_BUCKET" \
            --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION"

        # Enable versioning
        aws s3api put-bucket-versioning \
            --bucket "$S3_MEDIA_BUCKET" \
            --versioning-configuration Status=Enabled

        print_step "Media bucket created: $S3_MEDIA_BUCKET"
    fi

    # Static bucket
    if aws s3api head-bucket --bucket "$S3_STATIC_BUCKET" 2>/dev/null; then
        print_warning "Bucket $S3_STATIC_BUCKET already exists. Skipping..."
    else
        aws s3api create-bucket \
            --bucket "$S3_STATIC_BUCKET" \
            --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION"

        print_step "Static bucket created: $S3_STATIC_BUCKET"
    fi

    # Backups bucket
    if aws s3api head-bucket --bucket "$S3_BACKUPS_BUCKET" 2>/dev/null; then
        print_warning "Bucket $S3_BACKUPS_BUCKET already exists. Skipping..."
    else
        aws s3api create-bucket \
            --bucket "$S3_BACKUPS_BUCKET" \
            --region "$REGION" \
            --create-bucket-configuration LocationConstraint="$REGION"

        # Enable versioning for backups
        aws s3api put-bucket-versioning \
            --bucket "$S3_BACKUPS_BUCKET" \
            --versioning-configuration Status=Enabled

        print_step "Backups bucket created: $S3_BACKUPS_BUCKET"
    fi

    save_resource "S3_MEDIA_BUCKET" "$S3_MEDIA_BUCKET"
    save_resource "S3_STATIC_BUCKET" "$S3_STATIC_BUCKET"
    save_resource "S3_BACKUPS_BUCKET" "$S3_BACKUPS_BUCKET"
}

configure_s3_cors() {
    print_step "Configuring CORS for media bucket..."

    # Create CORS configuration
    cat > /tmp/cors-config.json <<EOF
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

    aws s3api put-bucket-cors \
        --bucket "$S3_MEDIA_BUCKET" \
        --cors-configuration file:///tmp/cors-config.json

    print_step "CORS configured for media bucket"
    rm /tmp/cors-config.json
}

################################################################################
# RDS Database
################################################################################

create_db_subnet_group() {
    print_step "Creating DB subnet group..."

    aws rds create-db-subnet-group \
        --db-subnet-group-name "${PROJECT_NAME}-db-subnet-group" \
        --db-subnet-group-description "Subnet group for ${PROJECT_NAME} database" \
        --subnet-ids "$PRIVATE_SUBNET_1" "$PRIVATE_SUBNET_2" \
        --tags "Key=Name,Value=${PROJECT_NAME}-db-subnet-group"

    print_step "DB subnet group created"
}

create_rds_instance() {
    print_step "Creating RDS PostgreSQL instance..."

    # Generate a random password
    RDS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

    aws rds create-db-instance \
        --db-instance-identifier "${PROJECT_NAME}-db" \
        --db-instance-class "$RDS_INSTANCE_CLASS" \
        --engine "$RDS_ENGINE" \
        --engine-version "$RDS_ENGINE_VERSION" \
        --master-username "$RDS_MASTER_USERNAME" \
        --master-user-password "$RDS_PASSWORD" \
        --allocated-storage "$RDS_ALLOCATED_STORAGE" \
        --storage-type gp3 \
        --vpc-security-group-ids "$RDS_SG" \
        --db-subnet-group-name "${PROJECT_NAME}-db-subnet-group" \
        --backup-retention-period 7 \
        --preferred-backup-window "03:00-04:00" \
        --preferred-maintenance-window "sun:04:00-sun:05:00" \
        --publicly-accessible false \
        --tags "Key=Name,Value=${PROJECT_NAME}-db" \
        --no-deletion-protection

    save_resource "RDS_MASTER_USERNAME" "$RDS_MASTER_USERNAME"
    save_resource "RDS_PASSWORD" "$RDS_PASSWORD"

    print_step "RDS instance creation initiated"
    print_step "Waiting for RDS instance to be available (this may take 5-10 minutes)..."

    aws rds wait db-instance-available --db-instance-identifier "${PROJECT_NAME}-db"

    # Get the endpoint
    RDS_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier "${PROJECT_NAME}-db" \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)

    save_resource "RDS_ENDPOINT" "$RDS_ENDPOINT"

    print_step "RDS instance available: $RDS_ENDPOINT"
    print_warning "Database password saved to $OUTPUT_FILE - keep it secure!"
}

################################################################################
# IAM Configuration
################################################################################

create_iam_resources() {
    print_step "Creating IAM user for S3 access..."

    IAM_USER="${PROJECT_NAME}-s3-user"

    # Create IAM user
    aws iam create-user \
        --user-name "$IAM_USER" || print_warning "User may already exist"

    # Create policy for S3 access
    cat > /tmp/s3-policy.json <<EOF
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
        "arn:aws:s3:::${S3_MEDIA_BUCKET}/*",
        "arn:aws:s3:::${S3_MEDIA_BUCKET}",
        "arn:aws:s3:::${S3_STATIC_BUCKET}/*",
        "arn:aws:s3:::${S3_STATIC_BUCKET}",
        "arn:aws:s3:::${S3_BACKUPS_BUCKET}/*",
        "arn:aws:s3:::${S3_BACKUPS_BUCKET}"
      ]
    }
  ]
}
EOF

    # Create policy
    POLICY_ARN=$(aws iam create-policy \
        --policy-name "${PROJECT_NAME}-s3-access-policy" \
        --policy-document file:///tmp/s3-policy.json \
        --query 'Policy.Arn' \
        --output text 2>/dev/null || echo "Policy may already exist")

    if [ "$POLICY_ARN" != "Policy may already exist" ]; then
        # Attach policy to user
        aws iam attach-user-policy \
            --user-name "$IAM_USER" \
            --policy-arn "$POLICY_ARN"
    fi

    # Create access key
    ACCESS_KEY_OUTPUT=$(aws iam create-access-key --user-name "$IAM_USER" 2>/dev/null || echo "")

    if [ -n "$ACCESS_KEY_OUTPUT" ]; then
        IAM_ACCESS_KEY=$(echo "$ACCESS_KEY_OUTPUT" | grep -o '"AccessKeyId": "[^"]*' | cut -d'"' -f4)
        IAM_SECRET_KEY=$(echo "$ACCESS_KEY_OUTPUT" | grep -o '"SecretAccessKey": "[^"]*' | cut -d'"' -f4)

        save_resource "IAM_USER" "$IAM_USER"
        save_resource "IAM_ACCESS_KEY" "$IAM_ACCESS_KEY"
        save_resource "IAM_SECRET_KEY" "$IAM_SECRET_KEY"

        print_step "IAM user and access keys created"
    else
        print_warning "Access key may already exist for user $IAM_USER"
    fi

    rm /tmp/s3-policy.json
}

################################################################################
# Main Execution
################################################################################

main() {
    echo "============================================"
    echo "  AWS Infrastructure Setup"
    echo "  Project: ${PROJECT_NAME}"
    echo "  Region: ${REGION}"
    echo "============================================"
    echo ""

    # Initialize output file
    > "$OUTPUT_FILE"
    echo "# AWS Resources Created on $(date)" >> "$OUTPUT_FILE"
    echo "# Project: ${PROJECT_NAME}" >> "$OUTPUT_FILE"
    echo "# Region: ${REGION}" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"

    # Pre-flight checks
    check_aws_cli
    configure_aws_credentials

    # VPC and Networking
    create_vpc
    create_internet_gateway
    create_subnets
    create_route_tables
    create_security_groups

    # EC2
    create_key_pair
    create_ec2_instance
    allocate_elastic_ip

    # S3
    create_s3_buckets
    configure_s3_cors

    # RDS
    create_db_subnet_group
    create_rds_instance

    # IAM
    create_iam_resources

    echo ""
    echo "============================================"
    echo "  Setup Complete!"
    echo "============================================"
    echo ""
    echo "All resource IDs and credentials saved to: $OUTPUT_FILE"
    echo ""
    echo "Next steps:"
    echo "1. Review $OUTPUT_FILE for all resource details"
    echo "2. Connect to EC2 instance: ssh -i ./infra/${EC2_KEY_NAME}.pem ubuntu@$ELASTIC_IP"
    echo "3. Add server to Laravel Forge using the key file and IP address"
    echo "4. Configure environment variables using the template"
    echo "5. Deploy your application"
    echo ""
    print_warning "Keep the key file and credentials secure!"
    echo ""
}

# Run main function
main
