# Morpheus Documentation Integration Plan

## Overview
This plan outlines how to integrate the Morpheus API Gateway documentation from https://openbeta.mor.org/docs into your existing Next.js Fumadocs site while maintaining best practices for documentation structure and user experience.

## Current Site Analysis

### Existing Structure
```
content/docs/
├── index.mdx                    # Current landing page
├── auth/                        # Authentication endpoints
├── automation/                  # Automation endpoints
├── chat/                        # Chat completion endpoints
├── models/                      # Model management endpoints
├── session/                     # Session management endpoints
└── unknown/                     # Misc endpoints
```

### Key Technologies
- **Framework**: Next.js with App Router
- **Documentation Engine**: Fumadocs
- **Content Format**: MDX
- **API Documentation**: OpenAPI-generated from schema
- **Styling**: Tailwind CSS with Fumadocs UI components

## Proposed Integration Structure

### New Folder Organization
```
content/docs/
├── index.mdx                    # New unified landing page
├── getting-started/             # Getting Started section
│   ├── index.mdx               # Section overview
│   ├── what-is-api-gateway.mdx # From Morpheus docs
│   ├── quickstart.mdx          # From "how-to-use-api-gateway"
│   └── one-sheeter.mdx         # API Gateway one-page summary
├── guides/                      # How-to Guides
│   ├── index.mdx               # Guides overview
│   ├── create-api-key.mdx     # Creating API keys
│   ├── view-models.mdx        # Viewing available models
│   └── use-swagger-ui.mdx     # Using Swagger UI
├── integrations/               # Integration Guides
│   ├── index.mdx              # Integrations overview
│   ├── cursor.mdx             # Cursor IDE integration
│   ├── brave-leo.mdx          # Brave Leo integration
│   ├── open-web-ui.mdx        # Open Web-UI (placeholder)
│   └── eliza.mdx              # Eliza (placeholder)
├── api-reference/              # Renamed from individual folders
│   ├── index.mdx              # API Reference overview
│   ├── auth/                  # Keep existing structure
│   ├── automation/            # Keep existing structure
│   ├── chat/                  # Keep existing structure
│   ├── models/                # Keep existing structure
│   ├── session/               # Keep existing structure
│   └── unknown/               # Keep existing structure
└── meta.json                  # Navigation configuration
```

## Implementation Steps

### Step 1: Content Strategy (Task #1)
- **Goal**: Create a unified documentation experience
- **Approach**:
  - User guides (from Morpheus) as primary content
  - API reference as technical documentation
  - Clear separation but easy navigation between sections

### Step 2: Folder Structure Creation (Task #2)
```bash
# Create new directories
mkdir -p content/docs/getting-started
mkdir -p content/docs/guides  
mkdir -p content/docs/integrations
mkdir -p content/docs/api-reference

# Move existing API docs
mv content/docs/auth content/docs/api-reference/
mv content/docs/automation content/docs/api-reference/
mv content/docs/chat content/docs/api-reference/
mv content/docs/models content/docs/api-reference/
mv content/docs/session content/docs/api-reference/
mv content/docs/unknown content/docs/api-reference/
```

### Step 3: Content Migration (Tasks #3-4)
1. Convert Morpheus markdown to MDX format
2. Add proper frontmatter to each file
3. Download and relocate images to `/public/images/morpheus/`
4. Update image paths in content

### Step 4: Navigation Configuration (Tasks #5, #8)
Create `content/docs/meta.json`:
```json
{
  "pages": [
    "index",
    {
      "title": "Getting Started",
      "pages": [
        "getting-started/index",
        "getting-started/what-is-api-gateway",
        "getting-started/quickstart",
        "getting-started/one-sheeter"
      ]
    },
    {
      "title": "Guides",
      "pages": [
        "guides/index",
        "guides/create-api-key",
        "guides/view-models",
        "guides/use-swagger-ui"
      ]
    },
    {
      "title": "Integrations",
      "pages": [
        "integrations/index",
        "integrations/cursor",
        "integrations/brave-leo",
        "integrations/open-web-ui",
        "integrations/eliza"
      ]
    },
    {
      "title": "API Reference",
      "pages": ["api-reference/*"]
    }
  ]
}
```

### Step 5: New Landing Page (Task #6)
Create a comprehensive `content/docs/index.mdx` that:
- Introduces both user guides and API reference
- Provides quick navigation cards
- Shows common use cases
- Highlights key features

### Step 6: External Links Integration (Task #9)
Add to `app/layout.config.tsx`:
```tsx
export const baseOptions: BaseLayoutProps = {
  nav: {
    // ... existing config
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs',
      active: 'nested-url',
    },
    {
      text: 'Swagger UI',
      url: 'https://api.mor.org/docs',
      newWindow: true,
    },
    {
      text: 'Discord',
      url: 'https://discord.gg/morpheusai',
      newWindow: true,
    },
  ],
};
```

## Content Conversion Guidelines

### Frontmatter Template
```mdx
---
title: "Page Title"
description: "Brief description for SEO"
---
```

### Image Handling
- Original: `![Alt text](https://openbeta.mor.org/_next/image?url=%2Fimages%2F...)`
- New: `![Alt text](/images/morpheus/...)`

### Link Updates
- Internal links: Convert to relative paths
- External links: Keep as-is, ensure `newWindow` for external sites

## Benefits of This Structure

1. **Clear Separation**: User guides vs API reference
2. **Progressive Disclosure**: Start with concepts, move to implementation
3. **Consistent Navigation**: Unified sidebar with logical grouping
4. **SEO Friendly**: Proper URL structure and metadata
5. **Maintainable**: Clear folder structure for future updates

## Migration Checklist

- [ ] Backup current documentation
- [ ] Create new folder structure
- [ ] Migrate and convert Morpheus content
- [ ] Download and relocate all images
- [ ] Update navigation configuration
- [ ] Create new landing page
- [ ] Test all internal links
- [ ] Verify image loading
- [ ] Check mobile responsiveness
- [ ] Update search configuration
- [ ] Deploy and test in production 