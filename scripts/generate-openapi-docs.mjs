import { generateFiles } from 'fumadocs-openapi';

// Prefer remote schema URL (build-time fetch + runtime fetch) – falls back to local copy if env is absent.
const schemaUrl =
  process.env.OPENAPI_SCHEMA_URL ?? 'https://api.mor.org/api/v1/openapi.json';

void generateFiles({
  input: [schemaUrl],
  output: './content/docs',
  per: 'operation',
  groupBy: 'tag',
  addGeneratedComment: true,
}); 