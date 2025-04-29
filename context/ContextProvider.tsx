'use client';

import React, { type ReactNode } from 'react';
import { config, projectId, wagmiAdapter } from '@/config'; // Import config, projectId, adapter
// Import networks directly for createAppKit, matching those in config/index.ts
import { mainnet, arbitrum, base } from '@reown/appkit/networks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiProvider, type State } from 'wagmi';

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  // Ensure projectId is handled if missing, consistent with config file
  console.warn('Project ID missing in ContextProvider.');
  // Provide a fallback or throw error based on your app's needs
}

// Set up metadata for your application
const metadata = {
  name: 'Your App Name', // Replace with your app's name
  description: 'Your App Description', // Replace with your app's description
  url: 'https://yourapp.com', // Replace with your app's URL (origin must match domain & subdomain)
  icons: ['https://your-icon-url.com/icon.png'], // Replace with your app's icon URL
};

// Define the networks specifically for createAppKit, matching the config
const appKitNetworks = [mainnet, arbitrum, base];

// Create the AppKit instance (modal)
// This should ideally be done outside the component function if it doesn't depend on props/state
createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId || 'YOUR_PROJECT_ID_PLACEHOLDER', // Use placeholder if undefined
  // Use the directly imported networks for createAppKit
  networks: appKitNetworks,
  // defaultNetwork: mainnet, // Optional: Set a default network if needed
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    // Add other features like email, socials if needed
  },
});

// Define the props for the ContextProvider
interface ContextProviderProps {
  children: ReactNode;
  initialState: State | undefined; // Accept initialState for SSR
}

// Create the ContextProvider component
function ContextProvider({ children, initialState }: ContextProviderProps) {
  return (
    // Provide the Wagmi config and initialState to WagmiProvider
    <WagmiProvider config={config} initialState={initialState}>
      {/* Provide the QueryClient to QueryClientProvider */}
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider; 