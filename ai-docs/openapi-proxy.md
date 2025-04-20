Integrations/ [OpenAPI](https://fumadocs.vercel.app/docs/ui/openapi)

# Creating Proxy

Avoid CORS problem

## [Introduction](https://fumadocs.vercel.app/docs/ui/openapi/proxy\#introduction)

A proxy server is useful for executing HTTP ( `fetch`) requests, as it doesn't have CORS constraints like on the browser.
We can use it for executing HTTP requests on the OpenAPI playground, when the target API endpoints do not have CORS configured correctly.

Warning

Do not use this on unreliable sites and API endpoints, the proxy server will
forward all received headers & body, including HTTP-only `Cookies` and
`Authorization` header.

### [Setup](https://fumadocs.vercel.app/docs/ui/openapi/proxy\#setup)

Create a route handler for proxy server.

/api/proxy/route.ts

```
import { openapi } from '@/lib/source';

export const { GET, HEAD, PUT, POST, PATCH, DELETE } = openapi.createProxy();
```

Follow the [Getting Started](https://fumadocs.vercel.app/docs/ui/openapi) guide if `openapi` server is not yet configured.

And enable the proxy from `createOpenAPI`.

lib/source.ts

```
import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  proxyUrl: '/api/proxy',
});
```

How is this guide?

GoodBad

[Edit on GitHub](https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/ui/(integrations)/openapi/proxy.mdx)

[Configurations\\
\\
Customise Fumadocs OpenAPI](https://fumadocs.vercel.app/docs/ui/openapi/configurations) [Markdown\\
\\
How to write documents](https://fumadocs.vercel.app/docs/ui/markdown)

### On this page

[Introduction](https://fumadocs.vercel.app/docs/ui/openapi/proxy#introduction) [Setup](https://fumadocs.vercel.app/docs/ui/openapi/proxy#setup)

Ask AI