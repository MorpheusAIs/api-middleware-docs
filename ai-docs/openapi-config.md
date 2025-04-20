Integrations/ [OpenAPI](https://fumadocs.vercel.app/docs/ui/openapi)

# Configurations

Customise Fumadocs OpenAPI

## [File Generator](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#file-generator)

Pass options to the `generateFiles` function.

### [Input](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#input)

An array of input files.
Allowed:

- File Paths
- External URLs
- Wildcard

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  input: ['./unkey.json'],
});
```

On Next.js server, the schema is dynamically fetched when the `APIPage` component renders.

For Vercel

If the schema is passed as a file path, ensure the page **will not** be re-rendered after build.

### [Output](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#output)

Path to the output directory.

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  output: '/content/docs',
});
```

### [Per](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#per)

Customise how the page is generated, default to `operation`.

| mode | Generate a page for |
| --- | --- |
| tag | each tag |
| file | each schema |
| operation | each operation (method of endpoint) |

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  per: 'tag',
});
```

### [Group By](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#group-by)

In `operation` mode, you can group output files with folders.

| Group by | Description |
| --- | --- |
| tag | `{tag}/{page}.mdx` (Each operation can only contain `1` tag) |
| route | `{api-endpoint}/{page}.mdx` |
| none | `{page}.mdx` (default) |

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  per: 'operation',
  groupBy: 'tag',
});
```

### [Name](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#name)

A function that controls the output path of files.

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  name: (type, file) => {
    return; // filename
  },
});
```

### [Imports](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#imports)

Add additional imports on the top of MDX files.

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  imports: [\
    {\
      names: ['Component1', 'Component2'],\
      from: '@/components/ui/api',\
    },\
  ],
});
```

### [Frontmatter](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#frontmatter)

Customise the frontmatter of MDX files.

By default, it includes:

| property | description |
| --- | --- |
| `title` | Page title |
| `description` | Page description |
| `full` | Always true, added for Fumadocs UI |
| `method` | Available method of operation ( `operation` mode) |
| `route` | Route of operation ( `operation` mode) |

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  input: ['./petstore.yaml'],
  output: './content/docs',
  frontmatter: (title, description) => ({
    myProperty: 'hello',
  }),
});
```

### [Add Generated Comment](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#add-generated-comment)

Add a comment to the top of generated files indicating they are auto-generated.

```
import { generateFiles } from 'fumadocs-openapi';

void generateFiles({
  input: ['./petstore.yaml'],
  output: './content/docs',
  // Add default comment
  addGeneratedComment: true,

  // Or provide a custom comment
  addGeneratedComment: 'Custom auto-generated comment',

  // Or disable comments
  addGeneratedComment: false,
});
```

### [Tag Display Name](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#tag-display-name)

Adding `x-displayName` to OpenAPI Schema can control the display name of your tags.

openapi.yaml

```
tags:
  - name: test
    description: this is a tag.
    x-displayName: My Test Name
```

## [OpenAPI Server](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#openapi-server)

The server to render pages.

### [Generate Code Samples](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#generate-code-samples)

Generate custom code samples for each API endpoint.

```
import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  generateCodeSamples(endpoint) {
    return [\
      {\
        lang: 'js',\
        label: 'JavaScript SDK',\
        source: "console.log('hello')",\
      },\
    ];
  },
});
```

In addition, you can also specify code samples via OpenAPI schema.

```
paths:
  /plants:
    get:
      x-codeSamples:
        - lang: js
          label: JavaScript SDK
          source: |
            const planter = require('planter');
            planter.list({ unwatered: true });
```

#### [Disable Code Sample](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#disable-code-sample)

You can disable the code sample for a specific language, for example, to disable cURL:

```
import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  generateCodeSamples(endpoint) {
    return [\
      {\
        lang: 'curl',\
        label: 'cURL',\
        source: false,\
      },\
    ];
  },
});
```

### [Renderer](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#renderer)

Customise components in the page.

```
import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  renderer: {
    Root(props) {
      // your own (server) component
    },
  },
});
```

## [Advanced](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#advanced)

### [Using API Page](https://fumadocs.vercel.app/docs/ui/openapi/configurations\#using-api-page)

This is not a public API, use it carefully.

To use the `APIPage` component in your MDX files:

```
---
title: Delete Api
full: true
---

<APIPage
  document="./unkey.json"
  operations={[{ path: '/v1/apis.deleteApi', method: 'post' }]}
  hasHead={false}
/>
```

| Prop | Description |
| --- | --- |
| `document` | OpenAPI Schema |
| `operations` | Operations (API endpoints) to be rendered |
| `hasHead` | Enable to render the heading of operation |

How is this guide?

GoodBad

[Edit on GitHub](https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/ui/(integrations)/openapi/configurations.mdx)

[OpenAPI\\
\\
Generating docs for OpenAPI schema](https://fumadocs.vercel.app/docs/ui/openapi) [Creating Proxy\\
\\
Avoid CORS problem](https://fumadocs.vercel.app/docs/ui/openapi/proxy)

### On this page

[File Generator](https://fumadocs.vercel.app/docs/ui/openapi/configurations#file-generator) [Input](https://fumadocs.vercel.app/docs/ui/openapi/configurations#input) [Output](https://fumadocs.vercel.app/docs/ui/openapi/configurations#output) [Per](https://fumadocs.vercel.app/docs/ui/openapi/configurations#per) [Group By](https://fumadocs.vercel.app/docs/ui/openapi/configurations#group-by) [Name](https://fumadocs.vercel.app/docs/ui/openapi/configurations#name) [Imports](https://fumadocs.vercel.app/docs/ui/openapi/configurations#imports) [Frontmatter](https://fumadocs.vercel.app/docs/ui/openapi/configurations#frontmatter) [Add Generated Comment](https://fumadocs.vercel.app/docs/ui/openapi/configurations#add-generated-comment) [Tag Display Name](https://fumadocs.vercel.app/docs/ui/openapi/configurations#tag-display-name) [OpenAPI Server](https://fumadocs.vercel.app/docs/ui/openapi/configurations#openapi-server) [Generate Code Samples](https://fumadocs.vercel.app/docs/ui/openapi/configurations#generate-code-samples) [Disable Code Sample](https://fumadocs.vercel.app/docs/ui/openapi/configurations#disable-code-sample) [Renderer](https://fumadocs.vercel.app/docs/ui/openapi/configurations#renderer) [Advanced](https://fumadocs.vercel.app/docs/ui/openapi/configurations#advanced) [Using API Page](https://fumadocs.vercel.app/docs/ui/openapi/configurations#using-api-page)

Ask AI