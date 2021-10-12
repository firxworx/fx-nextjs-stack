import * as cdk from '@aws-cdk/core'
import * as amplify from '@aws-cdk/aws-amplify'
import * as codebuild from '@aws-cdk/aws-codebuild'

// references:
// https://aws.amazon.com/blogs/mobile/deploying-a-static-website-with-aws-amplify-and-cdk/

export interface AwsCdkStackProps extends cdk.StackProps {
  project: {
    tag: string
    domain: string
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
    /** aws secrets manager secret id that corresponds to github personal access token */
    tokenSecretId: string
  }
}

// ses, https redirect w/ route53 patterns, etc
// https://github.com/tsmith512/tsmith-cdk/blob/3ffe29d88c2002443d87f13ee6d59c8a9e556f62/lib/tsmith-com-stack.ts

// this guy gave up on amplify and went with codepipeline to s3
// https://github.com/shariqanwar20/Virtual-Lolly-With-AWS/blob/e114994e98f961c69dbbd90b94b76af6b94f6d22/backend/lib/backend-stack.ts

export class AwsCdkStack extends cdk.Stack {
  public readonly amplifyApp: amplify.App

  public readonly domain: amplify.Domain

  public readonly branches: {
    readonly main: amplify.Branch
    readonly dev: amplify.Branch
    readonly staging: amplify.Branch
  }

  constructor(scope: cdk.Construct, id: string, props: AwsCdkStackProps) {
    super(scope, id, props)

    // note default amplify role may not have sufficient permissions to deploy ssr apps
    // const role = new iam.Role(this, 'AmplifyRole', {
    //   assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
    // })
    // role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')) // example

    this.amplifyApp = new amplify.App(this, 'AmplifyApp', {
      appName: props.app.name,
      description: props.app.description,
      customRules: [
        amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT, // @todo research if right
        ...(props.app.customRules ? props.app.customRules : []),
      ], // @todo redirect/rewrite rules // { source: .., target: .., status: .., }
      environmentVariables: props.app.environmentVariables,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: props.github.owner,
        repository: props.github.repository,
        oauthToken: cdk.SecretValue.secretsManager(props.github.tokenSecretId),
        // oauthToken: cdk.SecretValue.secretsManager('[Secret-Name]', {
        //   jsonField: '[Secret-Key]',
        // }),
      }),
      autoBranchCreation: {
        patterns: ['*'],
        basicAuth: amplify.BasicAuth.fromGeneratedPassword('username'),
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
            baseDirectory: '/', // '.next' if not static
            files: '**/*',
          },
          // cache: {
          //   paths: ['node_modules/**/*', '.next/cache/**/*'], // not sure next cache
          // },
        },
      }),
    })

    // buildSpec: codebuild.BuildSpec.fromObjectToYaml({
    //   version: "1.0",
    //   frontend: {
    //     phases: {
    //       preBuild: {
    //         commands: ["yarn install"],
    //       },
    //       build: {
    //         commands: ["yarn run build"],
    //       },
    //     },
    //     artifacts: {
    //       baseDirectory: ".next",
    //       files: "**/*",
    //     },
    //     cache: {
    //       paths: "node_modules/**/*",
    //     },
    //   },
    //   appRoot: "frontend",
    // }),

    this.branches = {
      main: this.amplifyApp.addBranch('main'),
      dev: this.amplifyApp.addBranch('dev', {
        basicAuth: amplify.BasicAuth.fromGeneratedPassword('username'),
      }),
      staging: this.amplifyApp.addBranch('staging', {
        basicAuth: amplify.BasicAuth.fromGeneratedPassword('username'),
      }),
    }

    // this.domain = this.amplifyApp.addDomain(props.project.domain)

    this.domain = this.amplifyApp.addDomain(props.project.domain, {
      // enableAutoSubdomain: true, // automatically create subdomains for registered branches
      // autoSubdomainCreationPatterns: ['*', 'pr*'], // patterns for branches that should automatically create subdomains
      // subDomains: [
      //   {
      //     branch: this.branches.dev,
      //     prefix: 'dev',
      //   },
      //   {
      //     branch: this.branches.staging,
      //     prefix: 'staging',
      //   },
      //   {
      //     branch: this.branches.main,
      //     prefix: '',
      //   },
      // ],
    })

    this.domain.mapSubDomain(this.branches.dev, 'dev')
    this.domain.mapSubDomain(this.branches.staging, 'staging')

    // map main/master branch to domain root
    this.domain.mapRoot(this.branches.main)
    this.domain.mapSubDomain(this.branches.main, 'www') // @todo - or addSubdomain()??
  }
}
