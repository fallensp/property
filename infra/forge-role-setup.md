# Laravel Forge - IAM Role Setup Guide

## ✅ Role ARN Created

Your IAM Role for Laravel Forge has been successfully created!

**Role ARN:**
```
arn:aws:iam::509852960936:role/ForgeRole
```

---

## 🔧 How to Use This in Laravel Forge

### Step 1: Copy the Role ARN

Copy this ARN (you'll need to paste it in Forge):
```
arn:aws:iam::509852960936:role/ForgeRole
```

### Step 2: In Laravel Forge Dashboard

1. **Go to**: https://forge.laravel.com
2. **Navigate to**: Account → Server Providers → AWS
3. **Paste the Role ARN** in the field shown in your screenshot
4. **Click "Add Credentials"** or "Save"

### Step 3: Forge Will Verify Access

Forge will test the role to ensure it has proper permissions to:
- Launch EC2 instances
- Manage security groups
- Configure load balancers
- Manage instance profiles

---

## ✅ What Permissions Were Granted

The ForgeRole has been configured with these permissions:

1. **AmazonEC2FullAccess**
   - Launch and manage EC2 instances
   - Create and modify security groups
   - Manage key pairs
   - View instance details

2. **ElasticLoadBalancingFullAccess**
   - Create and manage load balancers (if needed)
   - Configure health checks
   - Manage target groups

3. **Custom Forge Policy**
   - Pass IAM roles to EC2 instances
   - Create instance profiles
   - Manage IAM for server automation

---

## 🔐 Security Notes

### Trust Relationship
The role trusts:
- **EC2 Service**: `ec2.amazonaws.com`
- This allows EC2 instances to assume this role

### Instance Profile
An instance profile has been created:
- **Name**: `ForgeInstanceProfile`
- **ARN**: `arn:aws:iam::509852960936:instance-profile/ForgeInstanceProfile`

This allows EC2 instances launched by Forge to use the role automatically.

---

## 🚀 Using with Your Existing Server

### Option 1: Connect Existing Server to Forge

Since you already have an EC2 instance (`i-07a8ae380a11aa347`), you can add it to Forge as a **Custom VPS**:

1. **In Forge**: Create Server → Custom VPS
2. **Server Details**:
   - Name: `property-app-server`
   - IP Address: `43.217.181.191`
   - SSH Port: `22`
   - PHP Version: `8.2` or `8.3`

3. **SSH Key**: Use `infra/property-app-key.pem`

**Note**: You don't need the IAM Role ARN for connecting an existing server. The IAM Role is only needed if you want Forge to **create new servers** on your behalf.

### Option 2: Let Forge Create New Servers

If you want Forge to automatically provision new servers:

1. **Add AWS Credentials** using the Role ARN above
2. **Create Server** → AWS
3. Forge will use your credentials to launch instances automatically

---

## 🛠️ Troubleshooting

### "Invalid Role ARN"
- Ensure you copied the complete ARN
- Check there are no extra spaces
- Verify format: `arn:aws:iam::509852960936:role/ForgeRole`

### "Insufficient Permissions"
If Forge reports permission errors, verify the policies:

```bash
export AWS_PROFILE=property

# Check attached policies
aws iam list-attached-role-policies --role-name ForgeRole

# Should show:
# - AmazonEC2FullAccess
# - ElasticLoadBalancingFullAccess
# - ForgeCustomPolicy
```

### Need More Permissions?

If Forge requires additional permissions for specific features:

```bash
export AWS_PROFILE=property

# Example: Add S3 access
aws iam attach-role-policy \
  --role-name ForgeRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess
```

---

## 📋 Quick Reference

| Item | Value |
|------|-------|
| **Role Name** | ForgeRole |
| **Role ARN** | arn:aws:iam::509852960936:role/ForgeRole |
| **Instance Profile** | ForgeInstanceProfile |
| **Trust Entity** | ec2.amazonaws.com |
| **Permissions** | EC2 Full, ELB Full, Custom IAM |

---

## 🎯 Next Steps

### For Existing Server Setup:
1. ✅ Skip the IAM Role setup in Forge
2. 📝 Follow "Custom VPS" instructions in `infra/forge-setup.md`
3. 🔑 Use SSH key: `infra/property-app-key.pem`
4. 🌐 Use IP: `43.217.181.191`

### For New Server Provisioning:
1. ✅ Add the IAM Role ARN to Forge
2. 🚀 Let Forge create and manage servers automatically
3. 🔧 Forge will handle server provisioning and setup

---

## 💡 Recommendation

Since you **already have an EC2 instance running**, I recommend:

1. **Use the existing EC2 instance** (`43.217.181.191`)
2. **Add it to Forge as a Custom VPS** (no IAM Role needed)
3. **Save the IAM Role** for future server provisioning

This is more cost-effective and you can start deploying immediately!

---

**Role Created**: 2025-11-20
**Region**: ap-southeast-5 (Malaysia)
**Status**: ✅ Active and Ready
