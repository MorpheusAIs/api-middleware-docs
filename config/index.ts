import { cookieStorage, createStorage } from 'wagmi';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet, arbitrum } from '@reown/appkit/networks';

// Get projectId from https://cloud.reown.com
// Make sure to set this environment variable in your .env.local file
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  // In a real app, you might want to throw an error or handle this case more gracefully
  console.warn(
    'NEXT_PUBLIC_PROJECT_ID is not defined. Using default placeholder. Get your ID from https://cloud.reown.com',
  );
  // Using a placeholder to allow the app to run, but features will be limited.
  // Replace this with a proper error or default handling as needed.
  // throw new Error("Project ID is not defined");
}

// Define the networks you want to support using AppKit's network definitions
export const networks = [mainnet, arbitrum];

// Set up the Wagmi Adapter (Config)
// The adapter will create the Wagmi config internally
export const wagmiAdapter = new WagmiAdapter({
  // Provide the necessary configuration directly to the adapter
  projectId: projectId || 'YOUR_PROJECT_ID_PLACEHOLDER', // Use placeholder if undefined
  networks, // Pass the AppKit networks array
  ssr: true, // Enable SSR support
  storage: createStorage({
    storage: cookieStorage, // Use cookie storage for SSR persistence
  }),
  // Add other adapter-specific configurations if needed
});

// Export the Wagmi config generated by the adapter
export const config = wagmiAdapter.wagmiConfig; 