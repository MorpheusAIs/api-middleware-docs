    // scripts/fetch-openapi.mjs
    import fs from 'fs/promises';
    import path from 'path';

    // Configuration
    const prodUrl = process.env.NEXT_PUBLIC_API_BASE_URL_PROD;
    const devUrl = process.env.NEXT_PUBLIC_API_BASE_URL_DEV;
    const useRemote = prodUrl || devUrl;
    const backendUrl = prodUrl || devUrl; // Only used if useRemote is true
    const localSchemaSourcePath = path.resolve(process.cwd(), 'ai-docs', 'openapi.json');
    // Decide where to save it, e.g., in public or src
    const outputPath = path.resolve(process.cwd(), 'public', 'openapi.json');
    // Or: const outputPath = path.resolve(process.cwd(), 'src', 'schema', 'openapi.json');

    async function fetchAndSaveSchema() {
        let schema;
        let sourceDescription = 'unknown source'; // Initialize source description

        try {
            if (useRemote && backendUrl) {
                const openApiUrl = `${backendUrl}/openapi.json`;
                sourceDescription = `remote URL: ${openApiUrl}`;
                console.log(`Attempting to fetch OpenAPI schema from ${sourceDescription}...`);
                const response = await fetch(openApiUrl);
                if (!response.ok) {
                    // If fetch fails when env vars are set, treat as error.
                    throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`);
                }
                schema = await response.json();
                console.log(`✅ Successfully fetched schema from ${sourceDescription}.`);

            } else {
                sourceDescription = `local file: ${localSchemaSourcePath}`;
                console.log(`No backend URL environment variables set or they are empty. Using ${sourceDescription}...`);
                if (!await fs.stat(localSchemaSourcePath).catch(() => false)) {
                     throw new Error(`Fallback file not found at ${localSchemaSourcePath}`);
                }
                const localSchemaContent = await fs.readFile(localSchemaSourcePath, 'utf-8');
                schema = JSON.parse(localSchemaContent); // Ensure it's valid JSON
                console.log(`✅ Successfully read schema from ${sourceDescription}.`);
            }

            // Ensure output directory exists and write the schema
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, JSON.stringify(schema, null, 2));
            console.log(`✅ OpenAPI schema saved to ${outputPath}`);

        } catch (error) {
            console.error(`❌ Error processing OpenAPI schema from ${sourceDescription}: ${error.message}`);
            // Exit with error code if fetching or reading/parsing fails.
            process.exit(1);
        }
    }

    fetchAndSaveSchema();