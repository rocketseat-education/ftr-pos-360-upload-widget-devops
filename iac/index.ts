import * as aws from "@pulumi/aws";

const firstBucket = new aws.s3.BucketV2("primeiro-bucket", {
    bucket: 'primeiro-bucket-pos-full-stack-360',
    tags: {
        IAC: "true",
    },
});

const secondBucket = new aws.s3.BucketV2("segundo-bucket", {
    bucket: 'segundo-bucket-pos-full-stack-360',
    tags: {
        IAC: "true",
    },
});


const ecr = new aws.ecr.Repository("primeiro-ecr", {
    name: 'primeiro-ecr',
    imageTagMutability: 'IMMUTABLE',
    tags: {
        IAC: "true",
    }
});

export const firstBucketName = firstBucket.id;
export const firstBucketRegion = firstBucket.region;
export const firstBucketArn = firstBucket.arn;

export const secondBucketName = secondBucket.id;
export const secondBucketRegion = secondBucket.region;
export const secondBucketArn = secondBucket.arn;

export const ecrName = ecr.name;
export const ecrRepositoryUrl = ecr.repositoryUrl;