# Coftech Dashboard

Coftech Dashboard is the frontend interface for the Coftech Bot platform.

It provides the web UI for authentication, company and user management, bot setup, prompts, chats, campaigns, integrations, file management, support flows, settings, and real-time bot state updates.

## About Coftech Bot

Coftech Bot is a platform for businesses to create, configure, and manage AI-powered WhatsApp bots.

It helps companies automate customer conversations, answer questions, handle media and voice messages, run campaigns, connect integrations, and escalate chats to human support when needed.

The goal is to give businesses a central place to control their messaging bots while keeping the actual customer experience fast, useful, and personalized.

## Architecture

![Coftech Bot Architecture](public/Coftech Bot Architecture.png)

*Coftech Bot connects the dashboard, backend API, and WhatsApp processor into one automation platform.*

## What It Does

- Provides the dashboard UI for managing Coftech Bot companies, accounts, bots, prompts, campaigns, files, and integrations.
- Connects to the Coftech backend through REST endpoints and GraphQL.
- Uses Socket.IO for real-time bot lifecycle, QR, chat, and support updates.
- Protects pages by role and authentication state.
- Supports localized UI content through `next-i18next`.
- Includes reusable UI components, hooks, slices, RTK Query APIs, and utility providers.

## Tech Stack

- Next.js
- React
- TypeScript
- Chakra UI
- Redux Toolkit / RTK Query
- Zustand
- Apollo Client
- Axios
- Socket.IO Client
- next-i18next

## Project Structure

```text
src/pages/                  Next.js pages and route views
src/components/             Shared UI components
src/store/                  Redux slices, RTK Query APIs, and Zustand auth state
src/utils/                  Shared frontend utilities and providers
src/hooks/                  Reusable React hooks
src/configs/                Axios and protected route configuration
src/constants/              Shared constants and sanitization config
src/theme/                  Chakra theme configuration
src/types/                  TypeScript shared types
src/assets/                 CSS and static source assets
public/                     Public images, fonts, locales, and favicon
apollo-client.js            Apollo GraphQL client setup
next.config.js              Next.js configuration
next-i18next.config.js      i18n configuration
```

## Requirements

- Node.js
- npm
- Access to a Coftech Endpoint backend
- Browser access to the configured dashboard URL

## Environment

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Core variables:

```env
ENVIRONMENT="test"
NEXT_PUBLIC_ENDPOINT_URL=https://coftech-backend-api.coftechservices.com
NEXT_PUBLIC_TEMPORARY_ACCESS=true
```

`NEXT_PUBLIC_ENDPOINT_URL` is used by Axios, Apollo Client, and Socket.IO.

## Install

```bash
npm install
```

## Run

Start the dashboard:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

When the app starts, it:

1. Loads Next.js environment variables.
2. Initializes Chakra, Redux, Apollo, Socket, popup, and error providers.
3. Builds route protection around protected pages.
4. Connects browser API clients to `NEXT_PUBLIC_ENDPOINT_URL`.
5. Renders the requested dashboard page.

## Real-Time Events

The dashboard receives platform updates through Socket.IO.

Supported real-time flows include QR generation, device readiness, bot activation, bot suspension, bot unlinking, initialization cancellation, connection status, chat assignment, message sending status, and support-room updates.

## UI State And Access

The dashboard wraps pages with shared providers for Chakra UI, Redux, Apollo, Socket.IO, popup handling, and error handling.

Route access is controlled through protected route configuration, role checks, and authentication state. Temporary access can be enabled through environment configuration when the backend is unavailable.

## Scripts

```bash
npm run dev        # Start the local development server
npm run build      # Build the Next.js app
npm start          # Start the built Next.js app
npm run prod       # Export the app
npm run lint
npm run type-check
npm run check      # Run lint and type-check
```

## License

This repository is provided under an all-rights-reserved license.

Viewing and local visual inspection are allowed. Copying, editing, modifying, redistributing, reusing, or creating derivative work from this repository is not allowed without prior written permission from Coftech.

See `LICENSE` for details.

## Note

The official Coftech backend servers are currently down. Hosted URLs, webhook endpoints, queues, buckets, and callback values in example configuration files are placeholders until Coftech-managed infrastructure is restored. For that reason, the login page includes a **Continue without backend** option. It signs in with a temporary demo user stored only in the frontend, so protected pages can open while the backend is unavailable.
