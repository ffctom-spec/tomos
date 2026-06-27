# Instagram Integration Plan

TOMOS Beta 0.2 adds an Instagram-ready mock analytics endpoint.

## Environment Variables

Set these in `.env.local` or Vercel Environment Variables:

```bash
META_APP_ID=
META_APP_SECRET=
META_ACCESS_TOKEN=
INSTAGRAM_BUSINESS_ACCOUNT_ID=
```

Do not commit real values to GitHub.

## API Route

`GET /api/integrations/instagram`

Today this returns mock analytics:

- Connection Status
- Instagram Account
- Business / Creator Account requirement
- Last sync
- Followers
- Reach
- Impressions
- Saves
- Engagement rate
- Top posts
- SNS Health Score

## Production Replacement

Replace the mock response with Meta Instagram Graph API calls using a server-side access token. The token should be encrypted at rest and never exposed to the browser.

Expected production data:

- Account metadata
- Media insights
- Reach
- Impressions
- Saves
- Engagement
- Top posts
- Post-level health signals

## Requirement

The Instagram account must be a Business or Creator account connected to the required Meta app and permissions.
