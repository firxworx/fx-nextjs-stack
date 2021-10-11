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

