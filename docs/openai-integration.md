# OpenAI Integration

TOMOS Beta 0.2 adds the OpenAI integration foundation.

## Environment Variables

Set these in `.env.local` for local development or Vercel Environment Variables for production:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Do not commit real values to GitHub.

## API Routes

`POST /api/ai/review`

Request:

```json
{
  "content": "庭の土をよくする方法を紹介します。",
  "brand": "VERDNA",
  "channel": "Instagram"
}
```

If `OPENAI_API_KEY` is configured, TOMOS calls the OpenAI Responses API and asks for a structured content review covering:

- AIO citation fit
- SEO
- SNS save/share potential
- Brand fit
- Conversion path

If the key is missing, TOMOS returns a mock response so the UI and Vercel deployment remain stable.

## Connected Engines

- Executive Brief
- Content Review AI
- AIO Intelligence
- Broadcast Center
- Product Opportunity

## Production Notes

OpenAI calls must remain server-side. Client components should call TOMOS API routes, never OpenAI directly.
