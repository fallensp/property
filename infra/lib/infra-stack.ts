import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const keyPairName = new cdk.CfnParameter(this, 'Ec2KeyPairName', {
      type: 'AWS::EC2::KeyPair::KeyName',
      description:
        'Existing EC2 key pair name that Forge (or you) will use for SSH access.'
    });

    const allowedSshCidr = new cdk.CfnParameter(this, 'AllowedSshCidr', {
      type: 'String',
      description:
        'CIDR block for SSH (port 22). Replace the default with Laravel Forge IPs or your bastion IP as soon as possible.',
      default: '0.0.0.0/0'
    });

    const instanceTypeParam = new cdk.CfnParameter(this, 'InstanceType', {
      type: 'String',
      description:
        'Instance type for the Forge-managed host (eg. t3.small, t3.medium).',
      default: 't3.small'
    });

    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', { isDefault: true });

    const forgeSecurityGroup = new ec2.SecurityGroup(
      this,
      'ForgeSecurityGroup',
      {
        vpc,
        description: 'Security group for Laravel Forge managed instance',
        allowAllOutbound: true
      }
    );

    forgeSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(allowedSshCidr.valueAsString),
      ec2.Port.tcp(22),
      'SSH from Forge / admin address'
    );
    forgeSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'HTTP traffic'
    );
    forgeSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      'HTTPS traffic'
    );

    const forgeBucket = new s3.Bucket(this, 'ForgeAssetsBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      lifecycleRules: [
        {
          enabled: true,
          noncurrentVersionExpiration: cdk.Duration.days(30)
        }
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false
    });

    const instanceRole = new iam.Role(this, 'ForgeInstanceRole', {
      description:
        'Allows Laravel Forge managed EC2 instance to talk to SSM and S3.',
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonSSMManagedInstanceCore'
        )
      ]
    });

    forgeBucket.grantReadWrite(instanceRole);

    const ubuntuImage = ec2.MachineImage.lookup({
      name: 'ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*',
      owners: ['099720109477'] // Canonical
    });

    const instance = new ec2.Instance(this, 'ForgeInstance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: new ec2.InstanceType(instanceTypeParam.valueAsString),
      machineImage: ubuntuImage,
      securityGroup: forgeSecurityGroup,
      role: instanceRole,
      keyName: keyPairName.valueAsString,
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(60, {
            encrypted: true,
            volumeType: ec2.EbsDeviceVolumeType.GP3
          })
        }
      ]
    });

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: forgeBucket.bucketName,
      description: 'S3 bucket used for app assets/backups'
    });

    new cdk.CfnOutput(this, 'InstanceId', {
      value: instance.instanceId,
      description: 'Forge managed EC2 instance ID'
    });

    new cdk.CfnOutput(this, 'InstancePublicIp', {
      value: instance.instancePublicIp,
      description: 'Public IP to point Forge / DNS at'
    });

    new cdk.CfnOutput(this, 'SecurityGroupId', {
      value: forgeSecurityGroup.securityGroupId,
      description: 'Security group controlling HTTP/HTTPS/SSH'
    });
  }
}
