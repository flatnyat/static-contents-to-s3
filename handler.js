'use strict';

const Aws = require('aws-sdk');
const NodeZip = require('node-zip');
const MimeTypes = require('mime-types');

module.exports.deploy = async (event, context) => {
    console.log(JSON.stringify(event));

    const data = event["CodePipeline.job"].data;

    const artifactBucket = data.inputArtifacts[0].location.s3Location.bucketName;
    const artifactKey = data.inputArtifacts[0].location.s3Location.objectKey;

    const S3 = new Aws.S3({ region: 'ap-northeast-1' });
    const object = await S3.getObject({ Bucket: artifactBucket, Key: artifactKey }).promise();
    const zip = new NodeZip(object.Body, { base64: false, checkCRC32: true });

    const files = Object.keys(zip.files);
    console.log(files);

    const userData = JSON.parse(data.actionConfiguration.configuration.UserParameters);
    const objects = await S3.listObjects({ Bucket: userData.bucket, MaxKeys: 1000 }).promise();
    await Promise.all(objects.Contents.map((content) => {
        return S3.deleteObject({ Bucket: userData.bucket, Key: content.Key }).promise();
    }));

    await Promise.all(files.map((i) => {
        const f = zip.files[i];
        return S3.putObject({
            Bucket: userData.bucket,
            Key   : f.name,
            Body  : Buffer.from(f.asBinary(), 'binary'),
            ContentType: MimeTypes.lookup(f.name) || 'application/octet-stream',
        }).promise();
    }));

    const codePipeline = new Aws.CodePipeline();
    await codePipeline.putJobSuccessResult({
        jobId: event["CodePipeline.job"].id
    }).promise();

    context.succeed("")
};
