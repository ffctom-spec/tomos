# Environment Variables

TOMOS uses environment variables for API keys and access tokens.

## Rule

Never commit secrets to GitHub.

Use:

- `.env.local` for local development
- Vercel Environment Variables for deployed environments
- Encrypted database storage for user SNS tokens in production

## Current Variables

```bash
NEXT_PUBLIC_APP_NAME=TOMOS
NEXT_PUBLIC_APP_VERSION=0.2-beta
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
YOUTUBE_API_KEY=
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
INSTAGRAM_BUSINESS_ACCOUNT_ID=
PINTEREST_ACCESS_TOKEN=
SHOPIFY_ACCESS_TOKEN=
DATABASE_URL=
CRON_SECRET=
```

## Production Notes

All API calls that use secrets must run in server-side routes. Browser code should call TOMOS API routes only.
