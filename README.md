# TOMOS

TOMOS is a private AI Brand Operating System for user-owned brands, SNS operations, AIO intelligence, content review, commerce analytics, and approval-based execution.

## Beta 0.1 API-ready MVP Scope

TOMOS Beta 0.1 is an API-ready MVP. The UI shows the intended production operating screen, information architecture, and AI engine structure, while all data is currently mock data.

Current scope:

- Private Workspace / Login required in production
- TOMOS Command Center
- Always-on AI Engines
- Today's Executive Brief
- Executive Approval workflow
- Your Brand Portfolio
- Broadcast Center
- Content Review AI
- SNS Health
- Commerce Analytics
- Product Opportunity
- Knowledge Vault
- 24h Activity Timeline
- AI Decision Log
- Automation Rules

The dashboard is locally interactive. Approval actions, broadcast preparation, content rewrite application, system health counters, activity timeline entries, and decision logs update in browser state. State resets on refresh.

Build stability is the priority for Beta 0.1: the app should compile cleanly on Vercel before deeper API, auth, and database work begins.

## API-Ready Demo

The data layer is separated into:

- `app/_lib/portal-types.ts`
- `app/_lib/portal-data.ts`
- `app/_lib/api-client.ts`

`api-client.ts` currently returns mock data and is designed to be replaced by authenticated API calls later.

Health endpoint:

```bash
GET /api/health
```

Response:

```json
{
  "status": "ok",
  "app": "TOMOS",
  "version": "0.1-beta",
  "mode": "api-ready-demo"
}
```

## Planned Integrations

- Authentication and user workspace isolation
- Database for user-owned brands, approvals, content assets, and logs
- OpenAI GPT via the `/api/ai` route for research, review, routing, and generation
- Google Gemini via the `/api/ai` route for alternate AI review and command generation
- Anthropic API as a later optional provider
- Google / YouTube APIs for content and performance metrics
- Meta APIs for Instagram and Threads operations
- Pinterest API for discovery and performance
- Shopify or commerce APIs for product clicks, orders, and revenue
- Cron and webhook workers for always-on operation
- Token encryption for SNS and commerce integrations

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For GPT/Gemini integration, set these variables locally or in Vercel:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.2
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

When keys are missing, `/api/ai` returns mock responses so the iPhone-ready MVP still works and Vercel rendering does not fail.

Run checks:

```bash
npm run lint
npm run build
```

## Deployment

The app is designed for Vercel deployment.

1. Connect the GitHub repository.
2. Add production environment variables based on `.env.example`.
3. Deploy the `main` branch.
4. Confirm `/api/health` returns `0.1-beta`.

## Next Development Steps

- Add authentication and route protection.
- Create database schema and persistence layer.
- Replace mock client functions with authenticated API calls.
- Add real approval mutations and audit logs.
- Connect SNS, analytics, commerce, and AI APIs.
- Add background jobs for Daily Brief, Broadcast Mission, Learning Loop, and Knowledge Vault updates.
