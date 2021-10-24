# fx-nextjs-stack

Starter/boilerplate for static-site-generated (SSG) React projects written in TypeScript with [NextJS](https://nextjs.org/) + [TailwindCSS](https://tailwindcss.com/).

The `build:static` script in `package.json` will build the project and output a NextJS [static export](https://nextjs.org/docs/advanced-features/static-html-export) to the `dist/` folder.

An AWS CDK stack in the `aws-cdk/` folder will create a new AWS Amplify project that connects to a Github repo and will automatically deploy code pushed to the repo. This feature supports deployment to an optional custom subdomain or domain.

Features & considerations:

- `yarn` package manager
- build targets `es6` to favour modern web browsers (refer to `tsconfig.json`)
- static exports include trailing slash (refer to `next.config.js`)
- default font is Inter (refer to `tailwind.config.js` and `src/_document.tsx`)
- deployment to AWS via AWS Amplify is defined using AWS CDK as the infrastructure-as-code (IaC) solution

## Project Structure

All NextJS-related code is housed under the `src/` folder. NextJS pages are stored in `src/pages` and general components are stored in `src/components`.

There is no `src/pages/api` folder as this project is intended for static export and therefore does not support [NextJS API routes](https://nextjs.org/docs/api-routes/introduction) by design.

The `aws-cdk/` folder 

## Development

Install project dependencies by running `yarn`.

If you are using VSCode, the `.vscode.sample/` folder provides a sample configuration that enables VSCode to recognize TailwindCSS directives. You can create or edit the `.vscode/` folder in your project's root based on this example.

### Workflow

To start the development server:

```bash
yarn dev
```

Refer to `package.json` for available scripts and flags.

The development server can be accessed at: [http://localhost:3150](http://localhost:3150).

The development port can be changed by editing the scripts in `package.json`.

### Build

Run:

```bash
yarn build:static
```

The generated site will output to the `dist/` folder.

Prior to production deployment, remember to review the files in the `public/` folder (e.g. to set a custom `favicon.ico`) and consider adding custom error pages: <https://nextjs.org/docs/advanced-features/custom-error-page>.

### Common Additions

TailwindCSS children:

`yarn add tailwindcss-children` then add to `plugins` array in `tailwind.config.js`.

## Deployment with AWS CDK + Amplify

AWS Amplify is a convenient solution that's suitable for smaller projects that do not require advanced AWS features or need to make effective use of any AWS service that isn't already supported by Amplify, as-preconfigured by Amplify. 

### Disclaimer & precautions

Even though Amplify is implemented with well-known AWS services under the hood, it abstracts away a great deal of customizability, control, logging, and troubleshooting capabilities that are generally required for business-class / enterprise-class projects.

At the time of writing, Amplify also has notable limitations with its rewrite/reverse-proxy features and its inability to handle query strings effectively in common business/app scenarios.

Please note that deployment to AWS or any other hosting provider may incur usage charges. You are responsible for any fees resulting from using AWS or any other provider.

The Amplify-GitHub integration may create a webhook within your project's GitHub repo. If you wish to destroy or recreate the AWS CDK stack, you may need to manually delete the webhook from within GitHub. From within a given GitHub repo, you can find the page to manage webhooks via: Settings > Webhooks.

### AWS Prerequisites

- AWS account
- aws-cli installed (confirm with `aws --version`)
- aws-cli correctly configured with valid `~/.aws/config` and `~/.aws/credentials`

The IAM account that you use must have IAM Role(s) associated with it that provide sufficient permissions to create resources on AWS Amplify.

### AWS-CDK Installation

Ensure that the the amplify cli and aws-cdk is globally installed:

```sh
yarn global add @aws-amplify/cli
yarn global add aws-cdk
```

AWS packages are updated frequently. Always ensure you are working with the latest version. Package versions for the globally installed AWS CDK should match the package versions of any aws-cdk related packages in the project.

To check for and review updates for global packages via yarn's interactive cli tool, run:

```sh
yarn global upgrade-interactive --latest
```

To check for and review updates for packages in the project, run the following from the project repo folder:

```sh
yarn upgrade-interactive --latest
```

### AWS-CDK bootstrap

If  in your AWS account, run `cdk bootstrap` from the `aws-cdk/` folder. This will create the appropriate resource dependencies (such as an S3 bucket) in the AWS account.

If this is your first time running AWS-CDK in the AWS account you will be using, run `cdk bootstrap` from the `aws-cdk/` folder. This will initialize the base resources (such as an S3 bucket) that aws-cdk requires to deploy synthesized CloudFormation templates to AWS.

Note: the main project `tsconfig.json` has `./aws-cdk` added to the `exclude` paths.

### Github Personal Access Token (PAT) as AWS Secret

Amplify requires a GitHub [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) (PAT) to access your project's GitHub repo.

The PAT must have the following required scopes: `admin:repo_hook`, `read:packages`, `repo`.

Take careful security precautions with PAT's because they provide access to all resources in a given GitHub account. At the time of writing, they cannot be locked down to a specific organization or even to specific repos.

Once you have a PAT, you can add it as a Secret to AWS Secrets Manager in your AWS Account via the AWS CLI:

```sh
# add a secret (replace 'XXXX' with your PAT secret value)
aws secretsmanager create-secret --name github/token --description "Github Personal Access Token for Deployment" --secret-string XXXX

# to retrieve and print out details about a secret
aws secretsmanager describe-secret --secret-id github/token
```

AWS Secrets Manager is a bit of a price gouge - they charge $0.40/mo per Secret at the time of writing. Please be aware of all AWS charges before you proceed. 

More information: <https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html>

### Environment setup

The`aws-cdk/bin/aws-cdk-stack.ts` executable uses `dotenv` to read in the environment values from `.env`.

To use the AWS-CDK example as-coded, create an `.env` file based on the provided `.env.sample` file. Specify details about your project's GitHub repo and optionally the (sub)domain name you wish to deploy to.

The `AWS_CDK_PROJECT_TAG` should be short and descriptive lowercase string that's a valid URI component (i.e. alphanumeric, dashes, etc) that uniquely identifies your project within your AWS account.

The stack is implemented such that code pushed to `dev`, `qa`, or `preview` branches will be deployed to their own subdomain based off of the given project `domainName`.

The `AWS_CDK_NON_SECRET_PREVIEW_BASIC_AUTH_USERNAME` and `AWS_CDK_NON_SECRET_PREVIEW_BASIC_AUTH_PASSWORD` variables can be optionally set. These are for _non-secret_ credentials (e.g. "preview" and "demo") that will provide cursory basic auth protection of non-production preview URL's. Both the username and password environment variables must be set for this optional setting to be applied.

Domains must be registered via AWS Route53. If your domain is registered with a different registrar, then the (sub)domain must be configured as a Route53 Hosted Zone such that Route53 is the DNS provider for the domain name that you provide.

### CDK Deploy

All AWS CDK commands (`cdk`) should be run from the `aws-cdk/` folder.

You should review the stack code in `aws-cdk.ts` and `aws-cdk-stack.ts` prior to deploying and make any customizations.

Run `cdk synth` to synthestize a CloudFormation template that's deployable to AWS.

Run `cdk deploy` to synthesize and deploy the stack.

If you make changes to the AWS-CDK stack, run `cdk diff` to compare the deployed stack with the current state of the synthesized stack.

Find "Amplify" from within the AWS Console (<https://console.aws.amazon.com>) to manage your Amplify setup via the UI.
