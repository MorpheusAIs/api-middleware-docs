# User Guide

The CLI tool that automates setups and installing components.

## [Installation](https://fumadocs.vercel.app/docs/cli\#installation)

Initialize a config for CLI:

npmpnpmyarnbun

```
npx @fumadocs/cli
```

You can change the output paths of components in the config.

### [Components](https://fumadocs.vercel.app/docs/cli\#components)

Select and install components.

npmpnpmyarnbun

```
npx @fumadocs/cli add
```

You can pass component names directly.

npmpnpmyarnbun

```
npx @fumadocs/cli add banner files
```

#### [How the magic works?](https://fumadocs.vercel.app/docs/cli\#how-the-magic-works)

The CLI fetches the latest version of component from the GitHub repository of Fumadocs.
When you install the component, it is guaranteed to be up-to-date.

In addition, it also transforms import paths.
Make sure to use the latest version of CLI

This is highly Inspired by Shadcn UI.

### [Customise](https://fumadocs.vercel.app/docs/cli\#customise)

A simple way to customise Fumadocs layouts.

npmpnpmyarnbun

```
npx @fumadocs/cli customise
```

### [Tree](https://fumadocs.vercel.app/docs/cli\#tree)

Generate files tree for Fumadocs UI `Files` component, using the `tree` command from your terminal.

npmpnpmyarnbun

```
npx @fumadocs/cli tree ./my-dir ./output.tsx
```

You can output MDX file too:

npmpnpmyarnbun

```
npx @fumadocs/cli tree ./my-dir ./output.mdx
```

See help for further details:

npmpnpmyarnbun

```
npx @fumadocs/cli tree -h
```

#### [Example Output](https://fumadocs.vercel.app/docs/cli\#example-output)

output.tsx

```
import { File, Folder, Files } from 'fumadocs-ui/components/files';

export default (
  <Files>
    <Folder name="app">
      <File name="layout.tsx" />
      <File name="page.tsx" />
      <File name="global.css" />
    </Folder>
    <Folder name="components">
      <File name="button.tsx" />
      <File name="tabs.tsx" />
      <File name="dialog.tsx" />
    </Folder>
    <File name="package.json" />
  </Files>
);
```

### [Initialize Features](https://fumadocs.vercel.app/docs/cli\#initialize-features)

Some features of Fumadocs require copying code to get started, it is similar to `codemod` but for configuring features automatically.

npmpnpmyarnbun

```
npx @fumadocs/cli init
```

Please note that some features may change your existing code, make sure to commit your changes to Git before running it.

How is this guide?

GoodBad

[Edit on GitHub](https://github.com/fuma-nama/fumadocs/blob/dev/apps/docs/content/docs/cli/index.mdx)

### On this page

[Installation](https://fumadocs.vercel.app/docs/cli#installation) [Components](https://fumadocs.vercel.app/docs/cli#components) [How the magic works?](https://fumadocs.vercel.app/docs/cli#how-the-magic-works) [Customise](https://fumadocs.vercel.app/docs/cli#customise) [Tree](https://fumadocs.vercel.app/docs/cli#tree) [Example Output](https://fumadocs.vercel.app/docs/cli#example-output) [Initialize Features](https://fumadocs.vercel.app/docs/cli#initialize-features)

Ask AI