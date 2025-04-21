import { generateFiles } from 'fumadocs-openapi';
import path from 'node:path';

void generateFiles({
  input: [path.resolve('./ai-docs/openapi.json')], // Use absolute path for input schema
  output: './content/docs', // Change output path to generate directly into content/docs
  per: 'operation', // Generate one page per operation
  groupBy: 'tag', // Keep grouping by tag, but now directly under /docs
  addGeneratedComment: true, // Add a comment indicating auto-generation
}); 