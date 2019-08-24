'use strict';

const Aws = require('aws-sdk');
const Pipeline = require('./pipeline');

/** CloudFront cache delete */
module.exports.handle = async (event, context) => {
    console.log(JSON.stringify(event));
    try {
        const data = JSON.parse(event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters);

        const cloudfront = new Aws.CloudFront({});
        await cloudfront.createInvalidation({
            DistributionId: data.DistributionId,
            InvalidationBatch: {
                CallerReference: String(new Date().getTime()),
                Paths: {
                    Quantity: 1,
                    Items: ['/*']
                }
            }
        }).promise();

        await Pipeline.putJobSuccess(event["CodePipeline.job"].id, "", context);
    } catch (ex) {
        await Pipeline.putJobFailure(event["CodePipeline.job"].id, ex, context);
    }
};