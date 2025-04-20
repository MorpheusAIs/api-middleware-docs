import { openapi } from '@/lib/source';

// Create the proxy route handlers using the configured openapi instance
export const { GET, HEAD, PUT, POST, PATCH, DELETE } = openapi.createProxy(); 