Integrations

# Metadata

Usage with Next.js Metadata API

## [Introduction](https://fumadocs.vercel.app/docs/ui/open-graph\#introduction)

Next.js provides an useful set of utilities, allowing a flexible experience with Fumadocs.
Fumadocs uses the Next.js Metadata API for SEO.

Make sure to read their [Metadata section](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) for the fundamentals of Metadata API.

## [Open Graph Image](https://fumadocs.vercel.app/docs/ui/open-graph\#open-graph-image)

For docs pages, Fumadocs has a built-in metadata image generator.

You will need a route handler to get started.

app/docs-og/\[...slug\]/route.tsx

```
import { generateOGImage } from 'fumadocs-ui/og';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: 'My App',
  });
}

export function generateStaticParams() {
  return source.generateParams().map((page) => ({
    ...page,
    slug: [...page.slug, 'image.png'],
  }));
}
```

We need to append `image.png` to the end of slugs so that we can access it via `/docs-og/my-page/image.png`.

In your docs page, add the image to metadata.

app/docs/\[\[...slug\]\]/page.tsx

```
import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const image = ['/docs-og', ...slug, 'image.png'].join('/');
  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: image,
    },
    twitter: {
      card: 'summary_large_image',
      images: image,
    },
  } satisfies Metadata;
}
```

### [Font](https://fumadocs.vercel.app/docs/ui/open-graph\#font)

You can also customise the font, options for Satori are also available on the built-in generator.

```
import { generateOGImage } from 'fumadocs-ui/og';

generateOGImage({
  fonts: [\
    {\
      name: 'Roboto',\
      // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.\
      data: robotoArrayBuffer,\
      weight: 400,\
      style: 'normal',\
    },\
  ],
});
```

How is this guide?

GoodBad

[Edit on GitHub](https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/ui/(integrations)/open-graph.mdx)

[Mermaid\\
\\
Rendering diagrams in your docs](https://fumadocs.vercel.app/docs/ui/mermaid) [Twoslash\\
\\
Use Typescript Twoslash in your docs](https://fumadocs.vercel.app/docs/ui/twoslash)

### On this page

[Introduction](https://fumadocs.vercel.app/docs/ui/open-graph#introduction) [Open Graph Image](https://fumadocs.vercel.app/docs/ui/open-graph#open-graph-image) [Font](https://fumadocs.vercel.app/docs/ui/open-graph#font)

Ask AI