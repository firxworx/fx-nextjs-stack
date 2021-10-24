#!/usr/bin/env node

import 'source-map-support/register'
import * as dotenv from 'dotenv'
import * as cdk from '@aws-cdk/core'
import { AwsCdkStack } from '../lib/aws-cdk-stack'

dotenv.config({ path: __dirname + '/../../.env' })

const app = new cdk.App()

/**
 * {@link https://docs.aws.amazon.com/cdk/latest/guide/environments.html}
 */
const env = {
  region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
}

new AwsCdkStack(app, 'AwsCdkStack', {
  env,
  description: `AWS Amplify Stack - ${process.env.AWS_CDK_DOMAIN ?? process.env.AWS_CDK_PROJECT_TAG ?? ''}`,
  project: {
    tag: (process.env.AWS_CDK_PROJECT_TAG ?? 'fx').toLowerCase(),
    domainName: process.env.AWS_CDK_DOMAIN,
    nonSecretPreviewUsername: process.env.AWS_CDK_NON_SECRET_PREVIEW_BASIC_AUTH_USERNAME,
    nonSecretPreviewPassword: process.env.AWS_CDK_NON_SECRET_PREVIEW_BASIC_AUTH_PASSWORD,
  },
  app: {
    name: process.env.AWS_CDK_AMPLIFY_APP_NAME ?? process.env.AWS_CDK_PROJECT_TAG ?? 'fx-nextjs-stack',
    description: process.env.AWS_CDK_AMPLIFY_APP_DESCRIPTION ?? 'fx-nextjs-stack deploy via aws-cdk',
  },
  github: {
    owner: String(process.env.AWS_CDK_GITHUB_OWNER),
    repository: String(process.env.AWS_CDK_GITHUB_REPOSITORY),
    defaultBranch: String(process.env.AWS_CDK_GITHUB_DEFAULT_BRANCH),
    tokenSecret: String(process.env.AWS_CDK_GITHUB_TOKEN_SECRET),
  },
})
