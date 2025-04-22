[Docs](https://ui.shadcn.com/docs)

Next.js

# Next.js

Install and configure shadcn/ui for Next.js.

**Note:** The following guide is for Tailwind v4. If you are using Tailwind
v3, use `shadcn@2.3.0`.

### [Link to section](https://ui.shadcn.com/docs/installation/next\#create-project) Create project

Run the `init` command to create a new Next.js project or to setup an existing one:

pnpmnpmyarnbun

```relative font-mono text-sm leading-none
pnpm dlx shadcn@latest init

```

Copy

Choose between a Next.js project or a Monorepo.

### [Link to section](https://ui.shadcn.com/docs/installation/next\#add-components) Add Components

You can now start adding components to your project.

pnpmnpmyarnbun

```relative font-mono text-sm leading-none
pnpm dlx shadcn@latest add button

```

Copy

The command above will add the `Button` component to your project. You can then import it like this:

```relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  )
}
```

Copy

[Changelog](https://ui.shadcn.com/docs/changelog) [Vite](https://ui.shadcn.com/docs/installation/vite)

On This Page

- [Create project](https://ui.shadcn.com/docs/installation/next#create-project)
- [Add Components](https://ui.shadcn.com/docs/installation/next#add-components)

Deploy your shadcn/ui app on Vercel

Trusted by OpenAI, Sonos, Chick-fil-A, and more.

Vercel provides tools and infrastructure to deploy apps and features at scale.

Deploy Now [Deploy to Vercel](https://vercel.com/new?utm_source=shadcn_site&utm_medium=web&utm_campaign=docs_cta_deploy_now_callout)