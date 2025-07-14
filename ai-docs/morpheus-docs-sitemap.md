# Morpheus API Gateway Documentation Sitemap

**Base URL**: https://openbeta.mor.org/docs

## Site Structure Overview

```
openbeta.mor.org/
├── / (Home)
├── /chat
├── /test  
├── /docs (Documentation Hub)
└── /admin (Login/Dashboard)
```

## Documentation Pages Structure

### 1. Getting Started Section
- **Welcome Page** (`/docs`)
  - Overview of API Gateway Documentation
  - Quick links to all sections
  
- **What is the API Gateway** (`/docs/what-is-api-gateway`)
  - Morpheus Compute Router explanation
  - Session types (Pay with MOR vs Stake MOR)
  - API Gateway purpose and benefits
  - Open Beta program details
  - Base URL: `https://api.mor.org/api/v1`
  - Swagger UI: `https://api.mor.org/docs`
  
- **How to Use the API Gateway** (`/docs/how-to-use-api-gateway`)
  - 5-step quick start guide with screenshots:
    1. Sign up/Login
    2. Access Admin Dashboard
    3. Create API Key
    4. Configure Automation
    5. Start Testing
    
- **API Gateway One-Sheeter** (`/docs/api-gateway-one-sheeter`)
  - Visual infographic/diagram
  - Download link for one-page summary

### 2. How-To Guides Section
- **Creating an API Key** (`/docs/creating-api-key`)
  - Detailed Swagger UI instructions
  - Step-by-step with cURL examples:
    1. Access Swagger UI
    2. Register user account
    3. Login to get access token
    4. Create API key
    5. Set automation settings
    
- **Viewing Models** (`/docs/viewing-models`)
  - How to view available models
  - Understanding model responses (ID, blockchainID, tags)
  - Using models in chat completions
  - Historical models endpoint
  
- **Using Swagger UI** (`/docs/using-swagger-ui`)
  - Complete Swagger UI walkthrough
  - 3-step configuration process:
    1. Auth (Account, Login, API Key)
    2. Config (Model selection, Automation)
    3. Chat (Send prompts)

### 3. Integration Guides Section
- **Cursor IDE Integration** (`/docs/cursor-integration`)
  - Prerequisites and setup
  - 7-step integration process
  - Configuration settings
  
- **Brave Leo Integration** (`/docs/integration-brave-leo`)
  - Prerequisites and setup
  - 8-step integration process
  - Browser configuration
  
- **Open Web-UI Integration** (`/docs/integration-open-web-ui`)
  - Status: Coming Soon
  
- **Eliza Integration** (`/docs/integration-eliza`)
  - Status: Coming Soon

### 4. External Links
- Swagger UI: https://api.mor.org/docs
- Morpheus Website: https://mor.org/
- Twitter: https://x.com/MorpheusAIs
- Discord: https://discord.gg/morpheusai
- GitHub: https://github.com/MorpheusAIs/
- Postman Collection: Available in docs
- Feedback Form: Google Docs spreadsheet

## Key Information Summary

### API Configuration
- **Base URL**: `https://api.mor.org/api/v1`
- **Authentication**: Bearer token (API Key)
- **API Key Format**: `sk-{prefix}.{full_key}`
- **Supported Models**: Dynamic list via `/api/v1/models` endpoint

### Main Features
1. OpenAI-compatible API
2. Automated session management
3. Multiple model support
4. No wallet connection needed (Open Beta)
5. FREE access during beta

### Integration Compatibility
- OpenAI API compatible tools
- Cursor IDE
- Brave Leo browser
- Open Web-UI (coming soon)
- Eliza (coming soon)
- Any tool supporting custom OpenAI endpoints 