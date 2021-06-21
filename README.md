# fx-nextjs-stack

Boilerplate/starter for React projects written in TypeScript and powered by [NextJS](https://nextjs.org/) and [TailwindCSS](https://tailwindcss.com/).

This is an opinionated foundation for a particular flavour of a JS-driven front-end project. It supports a development workflow by streamlining the "spin up" of new projects.

The configuration is intended to support building + exporting a static site via NextJS' [static export](https://nextjs.org/docs/advanced-features/static-html-export) feature.

Features & considerations:

- `yarn` package manager
- build targets `es6` (refer to `tsconfig.json`)
- exports with trailing slash (refer to `next.config.js`)
- default font is Inter (refer to `tailwind.config.js` and `src/_document.tsx`)

If you are using VSCode, the `.vscode.sample/` folder provides a sample configuration for VSCode to recognize TailwindCSS directives. Manage your configuration by creating or editing the `.vscode/` folder in the root of your project. 

## Development

Project code including NextJS pages and components should be added to the `src/` folder.

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

