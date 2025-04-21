Integrations

# llms.txt

Output docs content for large language models

Create a route handler, modify it to include other remark plugins.

app/llms.txt/route.ts

```
import * as fs from 'node:fs/promises';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import remarkMdx from 'remark-mdx';
import { remarkInclude } from 'fumadocs-mdx/config';

export const revalidate = false;

const processor = remark()
  .use(remarkMdx)
  // https://fumadocs.vercel.app/docs/mdx/include
  .use(remarkInclude)
  // gfm styles
  .use(remarkGfm)
  // .use(your remark plugins)
  .use(remarkStringify); // to string

export async function GET() {
  // all scanned content
  const files = await fg(['./content/docs/**/*.mdx']);

  const scan = files.map(async (file) => {
    const fileContent = await fs.readFile(file);
    const { content, data } = matter(fileContent.toString());

    const processed = await processor.process({
      path: file,
      value: content,
    });

    return `file: ${file}
meta: ${JSON.stringify(data, null, 2)}

${processed}`;
  });

  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
}
```

How is this guide?

GoodBad

[Edit on GitHub](https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/ui/(integrations)/llms.mdx)

[Feedback\\
\\
Receive feedback from your users](https://fumadocs.vercel.app/docs/ui/feedback) [Math\\
\\
Writing math equations in Markdown/MDX documents](https://fumadocs.vercel.app/docs/ui/math)

Ask AI