import * as cdk from '@aws-cdk/core'
import * as amplify from '@aws-cdk/aws-amplify'
import * as codebuild from '@aws-cdk/aws-codebuild'

const GITHUB_OWNER = ''
const GITHUB_REPO = ''
const GITHUB_ACCESS_TOKEN_AWS_SECRET_ID = 'github-access-token'

export class AwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
  }
}
