# fx-nextjs-stack

Starter/boilerplate for React projects written in TypeScript and powered by [NextJS](https://nextjs.org/) + [TailwindCSS](https://tailwindcss.com/). 

This project is intended for export as a static site (i.e. a client-side SPA) via NextJS' [static export](https://nextjs.org/docs/advanced-features/static-html-export) feature. NextJS' server-side features such as `pages/api`, SSR, etc are not supported by design. 

Features & considerations:

- `yarn` package manager
- build targets `es6` to favour modern web browsers (refer to `tsconfig.json`)
- static exports include trailing slash (refer to `next.config.js`)
- default font is Inter (refer to `tailwind.config.js` and `src/_document.tsx`)

## Development

All project source code is housed under the `src/` folder. NextJS pages are under `src/pages/` and components are under `src/components`.

### Setup

Install project dependencies by running `yarn`.

If you are using VSCode, the `.vscode.sample/` folder provides a sample configuration for VSCode to recognize TailwindCSS directives. Manage your configuration by creating or editing the `.vscode/` folder in the root of your project.

### Workflow

To start the development server:

```bash
yarn dev
```

Refer to `package.json` for available scripts and flags.

The development server can be accessed at: [http://localhost:3100](http://localhost:3100).

If you do not plan to export the project as a static site, [API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed at [http://localhost:3100/api/hello](http://localhost:3100/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Build

Run:

```bash
yarn build:static
```

The generated site will output to the `dist/` folder.

Prior to production deployment, remember to review the files in the `public/` folder (e.g. `favicon.ico`) and consider adding custom error pages: https://nextjs.org/docs/advanced-features/custom-error-page

## Common Additions

Support for TailwindUI/TailwindCSS Headless UI and Hero Icons:

`yarn add @headlessui/react @heroicons/react`

TailwindCSS children:

`yarn add tailwindcss-children` then add to `plugins` array in `tailwind.config.js`.

A css classnames library such as `clsx`:

`yarn add clsx`

## AWS-CDK & Deployment with AWS Amplify

Obtain an AWS account and ensure that it is configured for cli use.

```sh
yarn global add @aws-amplify/cli
yarn global add aws-cdk
```

AWS packages are updated frequently. It is highly recommended to always ensure you are running the latest versions. To check and review for available package updates via yarn's interactive cli tool, run:

```sh
yarn global upgrade-interactive --latest
```

aws-cdk was initialized by running `cdk init --language typescript` in the repo's `aws-cdk/` folder. If you init aws-cdk on your own, note that cdk will use `npm` vs `yarn` so after installing you may want to delete `package-lock.json` and then run `yarn` to generate a `yarn.lock` file.

If you have never used aws-cdk before in your target AWS account, you will need to run `cdk bootstrap` to initialize the base resources that aws-cdk requires to deploy synthesized CloudFormation templates to AWS.

Note: the main project `tsconfig.json` has `./aws-cdk` added to the `exclude` paths.

### Setup


yarn add @aws-cdk/aws-apigateway @aws-cdk/aws-lambda @aws-cdk/aws-amplify @aws-cdk/aws-codecommit 

### Store Github Personal Access Token as AWS Secret

```sh
# add a secret
aws secretsmanager create-secret --name github/token --description "Github Personal Access Token for Deployment" --secret-string XXXX

# retrieve details about a secret
aws secretsmanager describe-secret --secret-id github/token
```

More information: <https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html>

https://github.com/nikovirtala/cdk-amplify-console
