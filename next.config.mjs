import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Add webpack config for AppKit SSR externals
  webpack: (config, { isServer }) => {
    // Add externals needed by AppKit/Wagmi for SSR
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // You might have other webpack customizations here
    // Ensure you return the modified config
    return config;
  },
};

export default withMDX(config);
