Integrations

# OpenAPI

Generating docs for OpenAPI schema

## [Manual Setup](https://fumadocs.vercel.app/docs/ui/openapi\#manual-setup)

Install the required packages.

npmpnpmyarnbun

```
npm install fumadocs-openapi shiki
```

### [Generate Styles](https://fumadocs.vercel.app/docs/ui/openapi\#generate-styles)

The interactive UI of OpenAPI integration is styled with Tailwind CSS, it doesn't include a pre-built stylesheet.
You must use it with Tailwind CSS configured.

Add the package to `@source` in your Tailwind CSS configuration.

Tailwind CSS

```
@import 'tailwindcss';
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';

@source '../node_modules/fumadocs-openapi/dist/**/*.js';
```

### [Configure Pages](https://fumadocs.vercel.app/docs/ui/openapi\#configure-pages)

Create an OpenAPI instance on the server. Fumadocs OpenAPI renders the pages on server-side.

lib/source.ts

```
import { createOpenAPI, attachFile } from 'fumadocs-openapi/server';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  pageTree: {
    // adds a badge to each page item in page tree
    attachFile,
  },
  // other props
});

export const openapi = createOpenAPI({
  // options
});
```

Add `APIPage` to your MDX Components, so that you can use it in MDX files.

mdx-components.tsx

```
import defaultComponents from 'fumadocs-ui/mdx';
import { APIPage } from 'fumadocs-openapi/ui';
import { openapi } from '@/lib/source';
import type { MDXComponents } from 'mdx/types';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,
    ...components,
  };
}
```

It is a React Server Component.

### [Generate Files](https://fumadocs.vercel.app/docs/ui/openapi\#generate-files)

You can generate MDX files directly from your OpenAPI schema.

Create a script:

scripts/generate-docs.mjs

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  input: ['./unkey.json'], // the OpenAPI schemas
  output: './content/docs',
});
```

Only OpenAPI 3.0 and 3.1 are supported.

Generate docs with the script:

```
node ./scripts/generate-docs.mjs
```

## [Features](https://fumadocs.vercel.app/docs/ui/openapi\#features)

The official OpenAPI integration supports:

- Basic API endpoint information
- Interactive API playground
- Example code to send request (in different programming languages)
- Response samples and TypeScript definitions
- Request parameters and body generated from schemas

### [Demo](https://fumadocs.vercel.app/docs/ui/openapi\#demo)

[View demo](https://fumadocs.vercel.app/docs/openapi).

How is this guide?

GoodBad

[Edit on GitHub](https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/ui/(integrations)/openapi/index.mdx)

[Typescript\\
\\
Generate docs from Typescript definitions](https://fumadocs.vercel.app/docs/ui/typescript) [Configurations\\
\\
Customise Fumadocs OpenAPI](https://fumadocs.vercel.app/docs/ui/openapi/configurations)

### On this page

[Manual Setup](https://fumadocs.vercel.app/docs/ui/openapi#manual-setup) [Generate Styles](https://fumadocs.vercel.app/docs/ui/openapi#generate-styles) [Configure Pages](https://fumadocs.vercel.app/docs/ui/openapi#configure-pages) [Generate Files](https://fumadocs.vercel.app/docs/ui/openapi#generate-files) [Features](https://fumadocs.vercel.app/docs/ui/openapi#features) [Demo](https://fumadocs.vercel.app/docs/ui/openapi#demo)

Ask AI