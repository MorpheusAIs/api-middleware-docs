import { generateFiles } from 'fumadocs-openapi';
import path from 'node:path';

void generateFiles({
  input: [path.resolve('./ai-docs/openapi.json')], // Use absolute path for input schema
  output: './content/docs/api', // Use relative path for output
  per: 'operation', // Generate one page per operation
  groupBy: 'tag', // Group pages by tag into subfolders
  addGeneratedComment: true, // Add a comment indicating auto-generation
}); 