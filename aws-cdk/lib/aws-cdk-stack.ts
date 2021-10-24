import * as cdk from '@aws-cdk/core'
import * as amplify from '@aws-cdk/aws-amplify'
import * as codebuild from '@aws-cdk/aws-codebuild'

export interface AwsCdkStackProps extends cdk.StackProps {
  project: {
    /** Short and descriptive uri-friendly string that uniquely identifies this project within your AWS account. */
    tag: string
    /** Optional domain (or subdomain) name to deploy the project to (must be a route53 hosted zone in AWS account). */
    domainName: string | undefined
    /** Optional non-secret http basic auth username to provide cursory security on preview subdomains. */
    nonSecretPreviewUsername: string | undefined
    /** Optional non-secret http basic auth password to provide cursory security on preview subdomains. */
    nonSecretPreviewPassword: string | undefined
  }
  app: {
    /** App name in Amplify. */
    name: string
    /** App description in Amplify. */
    description?: string
    /** Custom URL rewrite + reverse-proxy rules (refer to Amplify docs for more information). */
    customRules?: Array<amplify.CustomRule>
    /** Environment variables to be passed to the build environment. */
    environmentVariables?: Record<string, string>
  }
  github: {
    /** GitHub username of repository owner. */
    owner: string
    /** GitHub repository name. */
    repository: string
    /** Default branch name (typically 'main' or 'master'). */
    defaultBranch: string
    /** Identifier/name of the secret in aws secrets manager that contains a viable GitHub Personal Access Token (PAT). */
    tokenSecret: string
  }
}

/**
 * Stack that deploys an Amplify app connected to a GitHub repo to the `domainName` specified via props.
 *
 * If a `domainName` is provided via props that corresponds to a Route53 hosted zone, Amplify will deploy to that domain
 * name. It will also build + deploy any code pushed to 'dev', 'qa', and 'preview' branches to their own dedicated subdomains
 * based off the provided `domainName`.
 *
 * {@link https://aws.amazon.com/blogs/mobile/deploying-a-static-website-with-aws-amplify-and-cdk/}
 */
export class AwsCdkStack extends cdk.Stack {
  public readonly amplifyApp: amplify.App

  public readonly domain: amplify.Domain

  public readonly basicAuth: amplify.BasicAuth | undefined

  public readonly branches: Record<'main' | 'dev' | 'qa' | 'preview', amplify.Branch>

  // regarding url rewrites + redirects, note the following potential issues that may impact your project:
  // https://github.com/aws-amplify/amplify-console/issues/97
  // https://github.com/aws-amplify/amplify-console/issues/792 (note the slash hack)
  // related link of interest: https://github.com/riboseinc/terraform-aws-s3-cloudfront-website/issues/1

  constructor(scope: cdk.Construct, id: string, props: AwsCdkStackProps) {
    super(scope, id, props)

    // a good practice would be for aws to generate secure credentials: amplify.BasicAuth.fromGeneratedPassword('username')
    // however to keep the example simple, a 'non secret' provided via stack props is conditionally used to 'secure' preview url's
    if (props.project.nonSecretPreviewUsername && props.project.nonSecretPreviewPassword) {
      this.basicAuth = amplify.BasicAuth.fromCredentials(
        props.project.nonSecretPreviewUsername,
        cdk.SecretValue.plainText(props.project.nonSecretPreviewPassword),
      )
    }

    this.amplifyApp = new amplify.App(this, 'AmplifyApp', {
      appName: props.app.name,
      description: props.app.description,
      customRules: [
        ...(props.app.customRules ? props.app.customRules : []),
        // note: since next export generates static files for each page, do not do not add the amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT
        // rule or any rules similar to it that are intended for 'pure' SPA's (such as those created by CRA / Create React App).
      ],
      environmentVariables: props.app.environmentVariables,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: props.github.owner,
        repository: props.github.repository,
        oauthToken: cdk.SecretValue.secretsManager(props.github.tokenSecret),
        // the following example demonstrates accessing a value from a secret stored as json:
        // oauthToken: cdk.SecretValue.secretsManager('example/secret', {
        //   jsonField: 'objectKey',
        // }),
      }),
      autoBranchCreation: {
        patterns: ['*'],
        basicAuth: this.basicAuth,
      },
      autoBranchDeletion: true,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 1,
        frontend: {
          phases: {
            preBuild: {
              commands: ['yarn install'],
            },
            build: {
              commands: ['yarn build:static'],
            },
          },
          artifacts: {
            // note: this baseDirectory is customized in the NextJS' project's package.json (the NextJS default is `out/`)
            baseDirectory: 'dist',
            files: ['**/*'],
          },
          cache: {
            paths: ['node_modules/**/*'],
          },
        },
      }),
    })

    this.branches = {
      main: this.amplifyApp.addBranch('main'),
      dev: this.amplifyApp.addBranch('dev', {
        basicAuth: this.basicAuth,
      }),
      qa: this.amplifyApp.addBranch('qa', {
        basicAuth: this.basicAuth,
      }),
      preview: this.amplifyApp.addBranch('preview', {
        basicAuth: this.basicAuth,
      }),
    }

    if (props.project.domainName) {
      this.domain = this.amplifyApp.addDomain(props.project.domainName, {
        domainName: props.project.domainName,
        subDomains: [
          {
            branch: this.branches.main,
            prefix: '',
          },
          {
            branch: this.branches.dev,
            prefix: 'dev',
          },
          {
            branch: this.branches.qa,
            prefix: 'qa',
          },
          {
            branch: this.branches.qa,
            prefix: 'qa',
          },
          {
            branch: this.branches.preview,
            prefix: 'preview',
          },
        ],
        // you may optionally want to consider Amplify's features for automatically generating subdomains based on patterns:
        // enableAutoSubdomain: true, // automatically create subdomains for registered branches
        // autoSubdomainCreationPatterns: ['*', 'pr*'], // patterns for branches that should automatically create subdomains
      })
    }
  }
}
