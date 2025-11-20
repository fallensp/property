# Property infrastructure CDK

This CDK app provisions the base AWS resources that Laravel Forge will
attach to:

- **ForgeInstance** – Ubuntu 22.04 EC2 instance in the default VPC with SSH/HTTP/HTTPS
  access opened through a dedicated security group. The instance uses an IAM
  role with SSM access (AmazonSSMManagedInstanceCore) plus read/write access to the assets bucket.
- **ForgeAssetsBucket** – Private, versioned S3 bucket for application assets or
  backups. The bucket is encrypted, enforces SSL, and retains data if the stack
  is destroyed.

## Parameters

| Name | Description |
| --- | --- |
| `Ec2KeyPairName` | **Required.** Existing EC2 key pair name that Forge or your ops team will use for SSH. |
| `AllowedSshCidr` | CIDR block that can open port 22. Defaults to `0.0.0.0/0`; replace with Forge IP ranges or your office IP. |
| `InstanceType` | EC2 instance type (default `t3.small`). |

## Usage

1. Ensure the AWS CLI is configured (region `ap-southeast-3`). Run `aws sts get-caller-identity`
   to confirm the credentials have access.
2. From the repo root: `cd infra && npm install`.
3. (First-time per account/region) `npx cdk bootstrap`.
4. Synthesize once to cache the default VPC lookup: `npx cdk synth`.
5. Deploy with your parameters:

   ```bash
   npx cdk deploy \
     --parameters Ec2KeyPairName=forge-admin \
     --parameters AllowedSshCidr=203.0.113.5/32 \
     --parameters InstanceType=t3.small
   ```

6. After deployment the stack outputs the bucket name, instance ID, public IP,
   and associated security group so you can plug those into Forge and DNS.

Use `npx cdk diff` to review changes before the next deployment.
