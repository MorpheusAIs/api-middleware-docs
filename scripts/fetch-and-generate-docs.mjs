import fs from 'fs/promises';
import path from 'path';
import glob from 'fast-glob';
import { generateFiles } from 'fumadocs-openapi';

// Configuration
const REMOTE_URL = 'http://api.mor.org/api/v1/openapi.json';
const LOCAL_SCHEMA_PATH = path.resolve(process.cwd(), 'ai-docs', 'openapi.json');
const TMP_SCHEMA_PATH = path.resolve(process.cwd(), '.tmp-schema.json');

async function fetchAndGenerateDocs() {
  console.log('📚 Starting OpenAPI docs generation workflow...');
  
  // Step 1: Fetch or load the schema
  let schema;
  let sourceDescription = 'unknown source';
  
  try {
    // Try to fetch from remote first
    try {
      sourceDescription = `remote URL: ${REMOTE_URL}`;
      console.log(`Attempting to fetch OpenAPI schema from ${sourceDescription}...`);
      const response = await fetch(REMOTE_URL);
      
      if (response.ok) {
        schema = await response.json();
        console.log(`✅ Successfully fetched schema from ${sourceDescription}.`);

        // Inject default servers array if it is missing so Fumadocs does not fall back to https://example.com
        if (!schema.servers || schema.servers.length === 0) {
          const baseUrl = new URL(REMOTE_URL).origin;
          schema.servers = [{ url: baseUrl, description: 'Default server' }];
          console.log(`ℹ️ Added default server ${baseUrl} to OpenAPI schema (required by Fumadocs).`);
        }
      } else {
        throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`);
      }
    } catch (fetchError) {
      // Fallback to local file
      sourceDescription = `local file: ${LOCAL_SCHEMA_PATH}`;
      console.log(`Remote fetch failed. Falling back to ${sourceDescription}...`);
      
      if (!await fs.stat(LOCAL_SCHEMA_PATH).catch(() => false)) {
        throw new Error(`Fallback file not found at ${LOCAL_SCHEMA_PATH}`);
      }
      
      const localSchemaContent = await fs.readFile(LOCAL_SCHEMA_PATH, 'utf-8');
      schema = JSON.parse(localSchemaContent); // Ensure it's valid JSON
      console.log(`✅ Successfully read schema from ${sourceDescription}.`);
    }
    
    // Save schema to temporary file for processing
    await fs.writeFile(TMP_SCHEMA_PATH, JSON.stringify(schema, null, 2));
    console.log(`✅ Schema saved to temporary file for processing.`);
    
    // Step 2: Generate docs
    console.log('🔧 Generating MDX documentation files...');
    await generateFiles({
      input: [TMP_SCHEMA_PATH],
      output: './content/docs',
      per: 'operation',
      groupBy: 'tag',
      addGeneratedComment: true,
    });
    
    // Step 3: Post-process MDX files to use remote URL
    console.log('🔄 Post-processing generated MDX files to use remote URL...');
    const files = await glob('content/docs/**/*.mdx');
    let patched = 0;
    
    await Promise.all(
      files.map(async (file) => {
        const text = await fs.readFile(file, 'utf8');
        const fixedText = text.replace(/document=\{".*\.json"\}/g, `document={"/openapi.json"}`);
        
        if (fixedText !== text) {
          await fs.writeFile(file, fixedText);
          patched++;
        }
      })
    );
    
    console.log(`✅ Post-processed ${patched} MDX files to use remote URL.`);
    
    // Clean up temporary schema file
    await fs.unlink(TMP_SCHEMA_PATH).catch(() => {});
    
    // Also save to public for local development
    const publicPath = path.resolve(process.cwd(), 'public', 'openapi.json');
    await fs.mkdir(path.dirname(publicPath), { recursive: true });
    await fs.writeFile(publicPath, JSON.stringify(schema, null, 2));
    console.log(`✅ OpenAPI schema also saved to ${publicPath} for local development.`);
    
    console.log('🎉 OpenAPI documentation generation complete!');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

fetchAndGenerateDocs(); 