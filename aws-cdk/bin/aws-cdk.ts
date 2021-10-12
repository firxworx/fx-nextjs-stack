#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { AwsCdkStack } from '../lib/aws-cdk-stack'

const app = new cdk.App()

/**
 * @see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
 */
const env = {
  region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
}

new AwsCdkStack(app, 'AwsCdkStack', {
  env,
})
