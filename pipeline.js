'use strict';

const Aws = require('aws-sdk');
const codePipeline = new Aws.CodePipeline();

exports.putJobSuccess = (async(jobId, message, context) => {
    try {
        await codePipeline.putJobSuccessResult({
            jobId: jobId,
        }).promise();
        context.succeed(message);
    } catch (ex) {
        context.fail(ex);
    }
});

exports.putJobFailure = (async(jobId, message, context) => {
    await codePipeline.putJobFailureResult({
        jobId: jobId,
        failureDetails: {
            message: JSON.stringify(message),
            type: 'JobFailed',
            externalExecutionId: context.invokeid
        }
    }).promise();
    context.fail(message);
});