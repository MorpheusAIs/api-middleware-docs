import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { createOpenAPI, attachFile } from 'fumadocs-openapi/server';

// Configure the primary loader and export the result directly
export const mainDocs = loader({
  baseUrl: '/docs',
  rootDir: 'docs',
  source: docs.toFumadocsSource(),
  pageTree: {
    attachFile,
  },
});

// Re-export destructured functions for convenience if still needed elsewhere
export const { getPage, getPages, pageTree } = mainDocs;

// Configure the OpenAPI instance
export const openapi = createOpenAPI({
  // Enable proxy
  proxyUrl: '/api/proxy',
});
