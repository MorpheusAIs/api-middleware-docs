import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import ContextProvider from '@/context/ContextProvider';
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/config';
import type { Metadata } from "next";
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Morpheus API Gateway",
  description: "API Gateway connecting Web2 clients to the Morpheus-Lumerin AI Marketplace",
};

export default async function Layout({ children }: { children: ReactNode }) {
  const cookieHeader = (await headers()).get('cookie');
  const initialState = cookieToInitialState(config, cookieHeader);

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ContextProvider initialState={initialState}>
          <Providers>
            <RootProvider>{children}</RootProvider>
            <Toaster 
              theme="dark" 
              position="bottom-center"
              closeButton
              richColors
            />
          </Providers>
        </ContextProvider>
      </body>
    </html>
  );
}
