[Reown Docs home page![light logo](https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/docs-logo.svg)![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/reown-5552f0bb/images/docs-logo.svg)](https://docs.reown.com/)

Search or ask...

Ctrl K

Search...

Navigation

Installation

[Docs](https://docs.reown.com/overview) [AppKit](https://docs.reown.com/appkit/overview) [WalletKit](https://docs.reown.com/walletkit/overview)

AppKit has support for [Wagmi](https://wagmi.sh/) and [Ethers v6](https://docs.ethers.org/v6/) on Ethereum, [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) on Solana and Bitcoin.
Choose one of these to get started.

These steps are specific to [Next.js](https://nextjs.org/) app router. For
other React frameworks read the [React\\
documentation](https://docs.reown.com/appkit/react/core/installation).

## [​](https://docs.reown.com/appkit/next/core/installation\#installation)  Installation

**If you prefer referring to a video tutorial for this, please [click here](https://docs.reown.com/appkit/next/core/installation#video-tutorial).**

### [​](https://docs.reown.com/appkit/next/core/installation\#appkit-cli)  AppKit CLI

Reown offers a dedicated CLI to set up a minimal version of AppKit in the easiest and quickest way possible.

To do this, please run the command below.

Copy

```bash
npx @reown/appkit-cli

```

After running the command, you will be prompted to confirm the installation of the CLI. Upon your confirmation, the CLI will request the following details:

1. **Project Name**: Enter the name for your project.
2. **Framework**: Select your preferred framework or library. Currently, you have three options: React, Next.js, and Vue.
3. **Network-Specific libraries**: Choose whether you want to install Wagmi, Ethers, Solana, or Multichain (EVM + Solana).

After providing the project name and selecting your preferences, the CLI will install a minimal example of AppKit with your preferred blockchain library. The example will be pre-configured with a `projectId` that will only work on `localhost`.

To fully configure your project, please obtain a `projectId` from the Reown Cloud Dashboard and update your project accordingly.

**Refer to [this section](https://docs.reown.com/appkit/next/core/installation#cloud-configuration) for more information.**

### [​](https://docs.reown.com/appkit/next/core/installation\#custom-installation)  Custom Installation

- Wagmi
- Ethers v5
- Ethers
- Solana
- Bitcoin

npm

Yarn

Bun

pnpm

Copy

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query

```

npm

Yarn

Bun

pnpm

Copy

```bash
npm install @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query

```

npm

Yarn

Bun

pnpm

Copy

```bash
npm install @reown/appkit @reown/appkit-adapter-ethers5 ethers@5.7.2

```

npm

Yarn

Bun

pnpm

Copy

```bash
npm install @reown/appkit @reown/appkit-adapter-ethers ethers

```

npm

Yarn

Bun

pnpm

Copy

```bash
npm install @reown/appkit @reown/appkit-adapter-solana @solana/wallet-adapter-wallets

```

npm

Yarn

Bun

pnpm

Copy

```bash
npm install @reown/appkit @reown/appkit-adapter-bitcoin

```

## [​](https://docs.reown.com/appkit/next/core/installation\#cloud-configuration)  Cloud Configuration

Create a new project on Reown Cloud at [https://cloud.reown.com](https://cloud.reown.com/) and obtain a new project ID.

**Don’t have a project ID?**

Head over to Reown Cloud and create a new project now!

[**Get started**](https://cloud.reown.com/?utm_source=cloud_banner&utm_medium=docs&utm_campaign=backlinks)

## [​](https://docs.reown.com/appkit/next/core/installation\#implementation)  Implementation

- Wagmi
- Ethers v5
- Ethers
- Solana
- Bitcoin

[**wagmi Example** \\
\\
Check the Next wagmi example](https://github.com/reown-com/appkit-web-examples/tree/main/nextjs/next-wagmi-app-router)

For a quick integration, you can use the `createAppKit` function with a unified configuration. This automatically applies the predefined configurations for different adapters like Wagmi, Ethers, or Solana, so you no longer need to manually configure each one individually. Simply pass the common parameters such as projectId, chains, metadata, etc., and the function will handle the adapter-specific configurations under the hood.

This includes WalletConnect, Coinbase and Injected connectors, and the [Blockchain API](https://docs.reown.com/cloud/blockchain-api) as a [transport](https://wagmi.sh/core/api/createConfig#transports)

### [​](https://docs.reown.com/appkit/next/core/installation\#wagmi-config)  Wagmi config

Create a new file for your Wagmi configuration, since we are going to be calling this function on the client and the server it cannot live inside a file with the ‘use client’ directive.

For this example we will create a file called `config/index.tsx` outside our app directory and set up the following configuration

Copy

```tsx
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, arbitrum]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

```

## [​](https://docs.reown.com/appkit/next/core/installation\#importing-networks)  Importing networks

Reown AppKit use [Viem](https://viem.sh/) networks under the hood, which provide a wide variety of networks for EVM chains. You can find all the networks supported by Viem within the `@reown/appkit/networks` path.

Copy

```js
import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum, base, scroll, polygon } from '@reown/appkit/networks'

```

Looking to add a custom network? Check out the [custom networks](https://docs.reown.com/appkit/core/custom-networks) section.

## [​](https://docs.reown.com/appkit/next/core/installation\#ssr-and-hydration)  SSR and Hydration

:::info

- Using cookies is completely optional and by default Wagmi will use `localStorage` instead if the `storage` param is not defined.
- The `ssr` flag will delay the hydration of the Wagmi’s store to avoid hydration mismatch errors.
- AppKit don’t fully support the `ssr` flag.
:::

### [​](https://docs.reown.com/appkit/next/core/installation\#context-provider)  Context Provider

Let’s create now a context provider that will wrap our application and initialized AppKit ( `createAppKit` needs to be called inside a Next Client Component file).

In this example we will create a file called `context/index.tsx` outside our app directory and set up the following configuration

Copy

```tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'appkit-example',
  description: 'AppKit Example',
  url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider

```

### [​](https://docs.reown.com/appkit/next/core/installation\#layout)  Layout

Next, in our `app/layout.tsx` file, we will import our `ContextProvider` component and call [the Wagmi’s function `cookieToInitialState`.](https://wagmi.sh/react/guides/ssr#_2-hydrate-the-cookie)

The `initialState` returned by `cookieToInitialState`, contains the optimistic values that will populate the Wagmi’s store both on the server and client.

Copy

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { headers } from 'next/headers' // added
import ContextProvider from '@/context'

export const metadata: Metadata = {
  title: 'AppKit Example App',
  description: 'Powered by Reown'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  )
}

```

[**wagmi Example** \\
\\
Check the Next wagmi example](https://github.com/reown-com/appkit-web-examples/tree/main/nextjs/next-wagmi-app-router)

For a quick integration, you can use the `createAppKit` function with a unified configuration. This automatically applies the predefined configurations for different adapters like Wagmi, Ethers, or Solana, so you no longer need to manually configure each one individually. Simply pass the common parameters such as projectId, chains, metadata, etc., and the function will handle the adapter-specific configurations under the hood.

This includes WalletConnect, Coinbase and Injected connectors, and the [Blockchain API](https://docs.reown.com/cloud/blockchain-api) as a [transport](https://wagmi.sh/core/api/createConfig#transports)

### [​](https://docs.reown.com/appkit/next/core/installation\#wagmi-config)  Wagmi config

Create a new file for your Wagmi configuration, since we are going to be calling this function on the client and the server it cannot live inside a file with the ‘use client’ directive.

For this example we will create a file called `config/index.tsx` outside our app directory and set up the following configuration

Copy

```tsx
import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, arbitrum]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

```

## [​](https://docs.reown.com/appkit/next/core/installation\#importing-networks)  Importing networks

Reown AppKit use [Viem](https://viem.sh/) networks under the hood, which provide a wide variety of networks for EVM chains. You can find all the networks supported by Viem within the `@reown/appkit/networks` path.

Copy

```js
import { createAppKit } from '@reown/appkit'
import { mainnet, arbitrum, base, scroll, polygon } from '@reown/appkit/networks'

```

Looking to add a custom network? Check out the [custom networks](https://docs.reown.com/appkit/core/custom-networks) section.

## [​](https://docs.reown.com/appkit/next/core/installation\#ssr-and-hydration)  SSR and Hydration

:::info

- Using cookies is completely optional and by default Wagmi will use `localStorage` instead if the `storage` param is not defined.
- The `ssr` flag will delay the hydration of the Wagmi’s store to avoid hydration mismatch errors.
- AppKit don’t fully support the `ssr` flag.
:::

### [​](https://docs.reown.com/appkit/next/core/installation\#context-provider)  Context Provider

Let’s create now a context provider that will wrap our application and initialized AppKit ( `createAppKit` needs to be called inside a Next Client Component file).

In this example we will create a file called `context/index.tsx` outside our app directory and set up the following configuration

Copy

```tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'appkit-example',
  description: 'AppKit Example',
  url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider

```

### [​](https://docs.reown.com/appkit/next/core/installation\#layout)  Layout

Next, in our `app/layout.tsx` file, we will import our `ContextProvider` component and call [the Wagmi’s function `cookieToInitialState`.](https://wagmi.sh/react/guides/ssr#_2-hydrate-the-cookie)

The `initialState` returned by `cookieToInitialState`, contains the optimistic values that will populate the Wagmi’s store both on the server and client.

Copy

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

import { headers } from 'next/headers' // added
import ContextProvider from '@/context'

export const metadata: Metadata = {
  title: 'AppKit Example App',
  description: 'Powered by Reown'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {

  const headersObj = await headers();
  const cookies = headersObj.get('cookie')

  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  )
}

```

In this example we will create a new file called `context/appkit.tsx` outside our app directory and set up the following configuration

Copy

```tsx
"use client";

import { createAppKit } from "@reown/appkit/react";
import { Ethers5Adapter } from "@reown/appkit-adapter-ethers5";
import { mainnet, arbitrum } from "@reown/appkit/networks";

// 1. Get projectId at https://cloud.reown.com
const projectId = "YOUR_PROJECT_ID";

// 2. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new Ethers5Adapter()],
  metadata: metadata,
  networks: [mainnet, arbitrum],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKit() {
  return (
    <YourApp /> //make sure you have configured the <appkit-button> inside
  );
}

```

Next, in your `app/layout.tsx` or `app/layout.jsx` file, import the custom AppKit component.

Copy

```tsx
import "./globals.css";

import { AppKit } from "../context/appkit";

export const metadata = {
  title: "AppKit",
  description: "AppKit Example",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppKit>{children}</AppKit>
      </body>
    </html>
  );
}

```

Make sure that the `url` from the `metadata` matches your domain and subdomain. This will later be used by the [Verify API](https://docs.reown.com/cloud/verify) to tell wallets if your application has been verified or not.

[**ethers Example** \\
\\
Check the Next ethers example](https://github.com/reown-com/appkit-web-examples/tree/main/nextjs/next-ethers-app-router)

In this example we will create a new file called `context/appkit.tsx` outside our app directory and set up the following configuration

Copy

```tsx
"use client";

import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum } from "@reown/appkit/networks";

// 1. Get projectId at https://cloud.reown.com
const projectId = "YOUR_PROJECT_ID";

// 2. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [mainnet, arbitrum],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKit() {
  return (
    <YourApp /> //make sure you have configured the <appkit-button> inside
  );
}

```

Next, in your `app/layout.tsx` or `app/layout.jsx` file, import the custom AppKit component.

Copy

```tsx
import "./globals.css";

import { AppKit } from "../context/appkit";

export const metadata = {
  title: "AppKit",
  description: "AppKit Example",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppKit>{children}</AppKit>
      </body>
    </html>
  );
}

```

Make sure that the `url` from the `metadata` matches your domain and subdomain. This will later be used by the [Verify API](https://docs.reown.com/cloud/verify) to tell wallets if your application has been verified or not.

[**Solana Example** \\
\\
Check the Next Solana example](https://github.com/reown-com/appkit-web-examples/tree/main/nextjs/next-solana-app-router)

AppKit Solana provides a set of React components and hooks to easily connect Solana wallets with your application.

On top of your app set up the following configuration, making sure that all functions are called outside any React component to avoid unwanted rerenders.

Copy

```tsx
// App.tsx
import { createAppKit } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

// 0. Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

// 1. Get projectId from https://cloud.reown.com
const projectId = "YOUR_PROJECT_ID";

// 2. Create a metadata object - optional
const metadata = {
  name: "AppKit",
  description: "AppKit Solana Example",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Create modal
createAppKit({
  adapters: [solanaWeb3JsAdapter],
  networks: [solana, solanaTestnet, solanaDevnet],
  metadata: metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export default function App() {
  return <YourApp />;
}

```

[**Bitcoin Example** \\
\\
Check the Next Bitcoin example](https://github.com/reown-com/appkit-web-examples/tree/main/nextjs/next-bitcoin-app-router)

AppKit Bitcoin provides a set of React components and hooks to easily connect Bitcoin wallets with your application.

On top of your app set up the following configuration, making sure that all functions are called outside any React component to avoid unwanted rerenders.

Copy

```tsx
// App.tsx
import { createAppKit } from '@reown/appkit/react'
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin'
import { bitcoin  } from '@reown/appkit/networks'

// 1. Get projectId from https://cloud.reown.com
const projectId = 'YOUR_PROJECT_ID'

// 2. Set the networks
const networks = [bitcoin]

// 3. Set up Bitcoin Adapter
const bitcoinAdapter = new BitcoinAdapter({
  projectId
})

// 4. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Bitcoin Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// 5. Create modal
createAppKit({
  adapters: [bitcoinAdapter],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration,
    email: false,
    socials: []
  }
})

export default function App() {
  return <YourApp />
}

```

## [​](https://docs.reown.com/appkit/next/core/installation\#bitcoin-provider-interface)  Bitcoin Provider Interface

Copy

```ts
export interface BitcoinConnector extends ChainAdapterConnector, Provider {
  getAccountAddresses(): Promise<BitcoinConnector.AccountAddress[]>;
  signMessage(params: BitcoinConnector.SignMessageParams): Promise<string>;
  sendTransfer(params: BitcoinConnector.SendTransferParams): Promise<string>;
  signPSBT(
    params: BitcoinConnector.SignPSBTParams
  ): Promise<BitcoinConnector.SignPSBTResponse>;
}

```

### [​](https://docs.reown.com/appkit/next/core/installation\#parameters)  Parameters

- SignMessageParams
- SignMessageParams
- SignPSBTParams

Copy

```ts
  export type SignMessageParams = {
    /**
     * The message to be signed
     */
    message: string
    /**
     * The address to sign the message with
     */
    address: string
  }

```

Copy

```ts
  export type SignMessageParams = {
    /**
     * The message to be signed
     */
    message: string
    /**
     * The address to sign the message with
     */
    address: string
  }

```

Copy

```ts
  export type SendTransferParams = {
    /**
     * The amount to be sent in satoshis
     */
    amount: string
    /**
     * The address to send the transfer to
     */
    recipient: string
  }

```

Copy

```ts
  export type SignPSBTParams = {
    /**
     * The PSBT to be signed, string base64 encoded
     */
    psbt: string
    signInputs: {
      /**
       * The address whose private key to use for signing.
       */
      address: string
      /**
       * Specifies which input to sign
       */
      index: number
      /**
       * Specifies which part(s) of the transaction the signature commits to
       */
      sighashTypes: number[]
    }[]

    /**
     * If `true`, the PSBT will be broadcasted after signing. Default is `false`.
     */
    broadcast?: boolean

}

```

### [​](https://docs.reown.com/appkit/next/core/installation\#responses)  Responses

- AccountAddress
- SignPSBTResponse

Copy

```ts
  export type AccountAddress = {
    /**
     * Public address belonging to the account.
     */
    address: string
    /**
     * Public key for the derivation path in hex, without 0x prefix
     */
    publicKey?: string
    /**
     * The derivation path of the address e.g. "m/84'/0'/0'/0/0"
     */
    path?: string
    /**
     * The purpose of the address
     */
    purpose: 'payment' | 'ordinal' | 'stx'
  }

```

Copy

```ts
  export type AccountAddress = {
    /**
     * Public address belonging to the account.
     */
    address: string
    /**
     * Public key for the derivation path in hex, without 0x prefix
     */
    publicKey?: string
    /**
     * The derivation path of the address e.g. "m/84'/0'/0'/0/0"
     */
    path?: string
    /**
     * The purpose of the address
     */
    purpose: 'payment' | 'ordinal' | 'stx'
  }

```

Copy

```ts
  export type SignPSBTResponse = {
    /**
     * The signed PSBT, string base64 encoded
     */
    psbt: string
    /**
     * The `string` transaction id of the broadcasted transaction or `undefined` if not broadcasted
     */
    txid?: string
  }

```

## [​](https://docs.reown.com/appkit/next/core/installation\#trigger-the-modal)  Trigger the modal

- Wagmi
- Ethers v5
- Ethers
- Solana
- Bitcoin

To open AppKit you can use our [**web component**](https://docs.reown.com/appkit/core/components) or build your own button with AppKit [**hooks**](https://docs.reown.com/appkit/core/hooks.mdx#useAppKit).
In this example we are going to use the `<appkit-button>` component.

Web components are global html elements that don’t require importing.

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />
}

```

Learn more about the AppKit web components [here](https://docs.reown.com/appkit/core/components)

To open AppKit you can use our [**web component**](https://docs.reown.com/appkit/core/components) or build your own button with AppKit [**hooks**](https://docs.reown.com/appkit/core/hooks.mdx#useAppKit).
In this example we are going to use the `<appkit-button>` component.

Web components are global html elements that don’t require importing.

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />
}

```

Learn more about the AppKit web components [here](https://docs.reown.com/appkit/core/components)

To open AppKit you can use our [**web component**](https://docs.reown.com/appkit/next/core/components) or build your own button with AppKit [**hooks**](https://docs.reown.com/appkit/next/core/hooks.mdx#useAppKit).

- Web Component
- Hooks

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />;
}

```

Learn more about the AppKit web components [here](https://docs.reown.com/appkit/next/core/components)

Web components are global html elements that don’t require importing.

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />;
}

```

Learn more about the AppKit web components [here](https://docs.reown.com/appkit/next/core/components)

Web components are global html elements that don’t require importing.

You can trigger the modal by calling the `open` function from `useAppKit` hook.

Copy

```tsx
import { useAppKit } from "@reown/appkit/react";

export default function ConnectButton() {
  // 4. Use modal hook
  const { open } = useAppKit();

  return (
    <>
      <button onClick={() => open()}>Open Connect Modal</button>
      <button onClick={() => open({ view: "Networks" })}>
        Open Network Modal
      </button>
    </>
  );
}

```

Learn more about the AppKit hooks [here](https://docs.reown.com/appkit/next/core/hooks)

To open AppKit you can use our [**web component**](https://docs.reown.com/appkit/core/components) or build your own button with AppKit [**hooks**](https://docs.reown.com/appkit/core/hooks.mdx#useAppKit).

- Web Component
- Hooks

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />;
}

```

Learn more about the AppKit web components [here](https://docs.reown.com/appkit/core/components)

Web components are global html elements that don’t require importing.

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />;
}

```

Learn more about the AppKit web components [here](https://docs.reown.com/appkit/core/components)

Web components are global html elements that don’t require importing.

You can trigger the modal by calling the `open` function from `useAppKit` hook.

Copy

```tsx
import { useAppKit } from "@reown/appkit/react";

export default function ConnectButton() {
  // 4. Use modal hook
  const { open } = useAppKit();

  return (
    <>
      <button onClick={() => open()}>Open Connect Modal</button>
      <button onClick={() => open({ view: "Networks" })}>
        Open Network Modal
      </button>
    </>
  );
}

```

Learn more about the AppKit hooks [here](https://docs.reown.com/appkit/core/hooks)

To open AppKit you can use our default web components or build your own logic using AppKit hooks.

- Components
- Hooks

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />;
}

```

Learn more about the AppKit web components [here](https://docs.reown.com/appkit/core/components)

Web components are global html elements that don’t require importing.

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />;
}

```

Learn more about the AppKit web components [here](https://docs.reown.com/appkit/core/components)

Web components are global html elements that don’t require importing.

You can trigger the modal by calling the `open` function from `useAppKit` hook.

Copy

```tsx
import { useAppKit } from "@reown/appkit/react";

export default function ConnectButton() {
  // 4. Use modal hook
  const { open } = useAppKit();

  return (
    <>
      <button onClick={() => open()}>Open Connect Modal</button>
      <button onClick={() => open({ view: "Networks" })}>
        Open Network Modal
      </button>
    </>
  );
}

```

Learn more about the AppKit hooks [here](https://docs.reown.com/appkit/core/hooks)

To open AppKit you can use our default [web components](https://docs.reown.com/appkit/core/components) or build your own logic using [AppKit hooks](https://docs.reown.com/appkit/core/hooks).
In this example we are going to use the `<appkit-button>` component.

Web components are global html elements that don’t require importing.

Copy

```tsx
export default function ConnectButton() {
  return <appkit-button />
}

```

## [​](https://docs.reown.com/appkit/next/core/installation\#smart-contract-interaction)  Smart Contract Interaction

- Wagmi
- Ethers
- Solana

[Wagmi hooks](https://wagmi.sh/react/api/hooks/useReadContract) can help us interact with wallets and smart contracts:

Copy

```tsx
import { useReadContract } from "wagmi";
import { USDTAbi } from "../abi/USDTAbi";

const USDTAddress = "0x...";

function App() {
  const result = useReadContract({
    abi: USDTAbi,
    address: USDTAddress,
    functionName: "totalSupply",
  });
}

```

Read more about Wagmi hooks for smart contract interaction [here](https://wagmi.sh/react/hooks/useReadContract).

[Wagmi hooks](https://wagmi.sh/react/api/hooks/useReadContract) can help us interact with wallets and smart contracts:

Copy

```tsx
import { useReadContract } from "wagmi";
import { USDTAbi } from "../abi/USDTAbi";

const USDTAddress = "0x...";

function App() {
  const result = useReadContract({
    abi: USDTAbi,
    address: USDTAddress,
    functionName: "totalSupply",
  });
}

```

Read more about Wagmi hooks for smart contract interaction [here](https://wagmi.sh/react/hooks/useReadContract).

[Ethers](https://docs.ethers.org/v6/) can help us interact with wallets and smart contracts:

Copy

```tsx
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { BrowserProvider, Contract, formatUnits } from "ethers";

const USDTAddress = "0x617f3112bf5397D0467D315cC709EF968D9ba546";

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [\
  "function name() view returns (string)",\
  "function symbol() view returns (string)",\
  "function balanceOf(address) view returns (uint)",\
  "function transfer(address to, uint amount)",\
  "event Transfer(address indexed from, address indexed to, uint amount)",\
];

function Components() {
  const { address, caipAddress, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  async function getBalance() {
    if (!isConnected) throw Error("User disconnected");

    const ethersProvider = new BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    // The Contract object
    const USDTContract = new Contract(USDTAddress, USDTAbi, signer);
    const USDTBalance = await USDTContract.balanceOf(address);

    console.log(formatUnits(USDTBalance, 18));
  }

  return <button onClick={getBalance}>Get User Balance</button>;
}

```

[@Solana/web3.js](https://solana.com/docs/clients/javascript) library allows for seamless interaction with wallets and smart contracts on the Solana blockchain.

For a practical example of how it works, you can refer to our [lab dApp](https://appkit-lab.reown.com/library/solana/).

Copy

```tsx
import {
  SystemProgram,
  PublicKey,
  Keypair,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js'
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react'
import { useAppKitConnection, type Provider } from '@reown/appkit-adapter-solana/react'

function deserializeCounterAccount(data?: Buffer): { count: number } {
  if (data?.byteLength !== 8) {
    throw Error('Need exactly 8 bytes to deserialize counter')
  }

  return {
    count: Number(data[0])
  }
}

const { address } = useAppKitAccount()
const { connection } = useAppKitConnection()
const { walletProvider } = useAppKitProvider<Provider>('solana')

async function onIncrementCounter() {
  const PROGRAM_ID = new PublicKey('Cb5aXEgXptKqHHWLifvXu5BeAuVLjojQ5ypq6CfQj1hy')

  const counterKeypair = Keypair.generate()
  const counter = counterKeypair.publicKey

  const balance = await connection.getBalance(walletProvider.publicKey)
  if (balance < LAMPORTS_PER_SOL / 100) {
    throw Error('Not enough SOL in wallet')
  }

  const COUNTER_ACCOUNT_SIZE = 8
  const allocIx: TransactionInstruction = SystemProgram.createAccount({
    fromPubkey: walletProvider.publicKey,
    newAccountPubkey: counter,
    lamports: await connection.getMinimumBalanceForRentExemption(COUNTER_ACCOUNT_SIZE),
    space: COUNTER_ACCOUNT_SIZE,
    programId: PROGRAM_ID
  })

  const incrementIx: TransactionInstruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [\
      {\
        pubkey: counter,\
        isSigner: false,\
        isWritable: true\
      }\
    ],
    data: Buffer.from([0x0])
  })

  const tx = new Transaction().add(allocIx).add(incrementIx)

  tx.feePayer = walletProvider.publicKey
  tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash

  await walletProvider.signAndSendTransaction(tx, [counterKeypair])

  const counterAccountInfo = await connection.getAccountInfo(counter, {
    commitment: 'confirmed'
  })

  if (!counterAccountInfo) {
    throw new Error('Expected counter account to have been created')
  }

  const counterAccount = deserializeCounterAccount(counterAccountInfo?.data)

  if (counterAccount.count !== 1) {
    throw new Error('Expected count to have been 1')
  }

  console.log(`[alloc+increment] count is: ${counterAccount.count}`);
}

```

## [​](https://docs.reown.com/appkit/next/core/installation\#extra-configuration)  Extra configuration

Next.js relies on [SSR](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering). This means some specific steps are required to make AppKit work properly.

- Add the following code in the `next.config.js` file

Copy

```ts
// Path: next.config.js
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

```

- [Learn more about SSR with Wagmi](https://wagmi.sh/react/guides/ssr)

## [​](https://docs.reown.com/appkit/next/core/installation\#video-tutorial)  Video Tutorial

How to Integrate AppKit with Next.js \| DevRel Lead Rohit Ramesh \| Reown Tutorials - YouTube

Reown

3.27K subscribers

[How to Integrate AppKit with Next.js \| DevRel Lead Rohit Ramesh \| Reown Tutorials](https://www.youtube.com/watch?v=lxTGqXh7LiA)

Reown

Search

Watch later

Share

Copy link

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

Full screen is unavailable. [Learn More](https://support.google.com/youtube/answer/6276924)

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

More videos

## More videos

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

[Watch on](https://www.youtube.com/watch?v=lxTGqXh7LiA&embeds_referring_euri=https%3A%2F%2Fdocs.reown.com%2F)

0:00

0:00 / 17:49•Live

•

[Watch on YouTube](https://www.youtube.com/watch?v=lxTGqXh7LiA "Watch on YouTube")

Was this page helpful?

YesNo

[Hooks](https://docs.reown.com/appkit/next/core/hooks)

On this page

- [Installation](https://docs.reown.com/appkit/next/core/installation#installation)
- [AppKit CLI](https://docs.reown.com/appkit/next/core/installation#appkit-cli)
- [Custom Installation](https://docs.reown.com/appkit/next/core/installation#custom-installation)
- [Cloud Configuration](https://docs.reown.com/appkit/next/core/installation#cloud-configuration)
- [Implementation](https://docs.reown.com/appkit/next/core/installation#implementation)
- [Trigger the modal](https://docs.reown.com/appkit/next/core/installation#trigger-the-modal)
- [Smart Contract Interaction](https://docs.reown.com/appkit/next/core/installation#smart-contract-interaction)
- [Extra configuration](https://docs.reown.com/appkit/next/core/installation#extra-configuration)
- [Video Tutorial](https://docs.reown.com/appkit/next/core/installation#video-tutorial)