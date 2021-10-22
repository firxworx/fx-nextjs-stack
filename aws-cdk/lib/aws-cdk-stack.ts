import * as cdk from '@aws-cdk/core'
import * as amplify from '@aws-cdk/aws-amplify'
import * as codebuild from '@aws-cdk/aws-codebuild'

// references:
// https://aws.amazon.com/blogs/mobile/deploying-a-static-website-with-aws-amplify-and-cdk/

export interface AwsCdkStackProps extends cdk.StackProps {
  project: {
    tag: string
    domain: string | undefined
  }
  app: {
    name: string
    description?: string
    customRules?: Array<amplify.CustomRule>
    environmentVariables?: Record<string, string>
  }
  github: {
    /** github username of repo owner */
    owner: string
    /** github repository name */
    repository: string
    /** default branch name (typically 'main' or 'master') */
    defaultBranch: string
    /** identifier/name of the secret in aws secrets manager that contains an applicable github personal access token */
    tokenSecret: string
  }
}

export class AwsCdkStack extends cdk.Stack {
  public readonly amplifyApp: amplify.App

  public readonly domain: amplify.Domain

  public readonly basicAuth: amplify.BasicAuth | undefined

  public readonly branches: {
    readonly main: amplify.Branch
    readonly dev: amplify.Branch
    readonly staging: amplify.Branch
  }

  constructor(scope: cdk.Construct, id: string, props: AwsCdkStackProps) {
    super(scope, id, props)

    // best practice is for aws generate secure credentials: amplify.BasicAuth.fromGeneratedPassword('username')
    this.basicAuth = amplify.BasicAuth.fromCredentials('preview', cdk.SecretValue.plainText('fx-nextjs-stack'))

    this.amplifyApp = new amplify.App(this, 'AmplifyApp', {
      appName: props.app.name,
      description: props.app.description,
      customRules: [
        ...(props.app.customRules ? props.app.customRules : []),
        amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT,
      ],
      environmentVariables: props.app.environmentVariables,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: props.github.owner,
        repository: props.github.repository,
        oauthToken: cdk.SecretValue.secretsManager(props.github.tokenSecret),
        // the following example shows how to access a value from a secret stored as json
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
        version: '1.0',
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
            baseDirectory: '/dist', // use '.next' if not static
            files: '**/*',
          },
          cache: {
            paths: ['node_modules/**/*', '.next/cache/**/*'],
          },
        },
      }),
    })

    this.branches = {
      main: this.amplifyApp.addBranch('main'),
      dev: this.amplifyApp.addBranch('dev', {
        basicAuth: this.basicAuth,
      }),
      staging: this.amplifyApp.addBranch('staging', {
        basicAuth: this.basicAuth,
      }),
    }

    if (props.project.domain) {
      this.domain = this.amplifyApp.addDomain(props.project.domain, {
        // enableAutoSubdomain: true, // automatically create subdomains for registered branches
        // autoSubdomainCreationPatterns: ['*', 'pr*'], // patterns for branches that should automatically create subdomains
        domainName: props.project.domain,
        subDomains: [
          {
            branch: this.branches.dev,
            prefix: 'dev',
          },
          {
            branch: this.branches.staging,
            prefix: 'staging',
          },
          {
            branch: this.branches.main,
            prefix: 'www',
          },
        ],
      })
    }
  }
}
