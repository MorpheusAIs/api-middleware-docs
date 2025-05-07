import { generateFiles } from 'fumadocs-openapi';
import fs from 'node:fs/promises';
import glob from 'fast-glob';

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

const REMOTE_DOC_URL = 'https://api.mor.org/api/v1/openapi.json';

// Post-process generated MDX to point to remote URL instead of local path
async function patchGeneratedFiles() {
  const files = await glob(['content/docs/**/*.mdx']);
  await Promise.all(
    files.map(async (file) => {
      const text = await fs.readFile(file, 'utf8');
      const patched = text.replace(/document=\{".*openapi\.json"\}/g, `document={"${REMOTE_DOC_URL}"}`);
      if (patched !== text) await fs.writeFile(file, patched);
    })
  );
}

await patchGeneratedFiles(); 