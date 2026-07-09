# Coftech Dashboard

Coftech Dashboard is the frontend interface for the Coftech Bot platform. It includes the dashboard UI, authentication screen, protected pages, bot management views, campaign pages, integrations, prompts, chats, and related visual flows.

## Environment

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Current values:

```env
ENVIRONMENT="test"
NEXT_PUBLIC_ENDPOINT_URL=https://coftech-backend-api.coftechservices.com
NEXT_PUBLIC_TEMPORARY_ACCESS=true
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## License

This repository is provided under an all-rights-reserved license.

Viewing and local visual inspection are allowed. Copying, editing, modifying, redistributing, reusing, or creating derivative work from this repository is not allowed without prior written permission from Coftech.

See `LICENSE` for details.

## Note

The official Coftech backend servers are currently down. Hosted URLs, webhook endpoints, queues, buckets, and callback values in example configuration files are placeholders until Coftech-managed infrastructure is restored. For that reason, the login page includes a **Continue without backend** option. It signs in with a temporary demo user stored only in the frontend, so protected pages can open while the backend is unavailable.