# fx-nextjs-stack

This project is a boilerplate/starter for React projects written in TypeScript and powered by [NextJS](https://nextjs.org/) and [TailwindCSS](https://tailwindcss.com/).

This project reflects an opinionated foundation for a certain flavour of modern front-end projects. It is intended to support a particular development workflow by streamlining the "spin up" of new projects.

The configuration is intended to support build/export of a static site via NextJS' [static export](https://nextjs.org/docs/advanced-features/static-html-export) feature.

Additional considerations:

- `yarn` package manager
- build targets `es6` (refer to `tsconfig.json`)
- exports with trailing slash (refer to `next.config.js`)

If you are using VSCode, the `.vscode.sample/` folder provides a sample configuration for VSCode to recognize TailwindCSS directives.The sample configuration can be incorporated into the folder `.vscode/` in the root of your project.

## Development

Project code including NextJS pages and components should be added to the `src/` folder.

To start the development server:

```bash
yarn dev
```

Refer to `package.json` for available scripts and flags.

The development server can be accesed at: [http://localhost:3100](http://localhost:3100).

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3100/api/hello](http://localhost:3100/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
