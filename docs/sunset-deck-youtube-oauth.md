# SUNSET DECK YouTube OAuth setup

## Google Cloud

1. Enable **YouTube Data API v3** in the Google Cloud project.
2. Configure the OAuth consent screen.
3. Create a Web application OAuth client.
4. Authorize the SUNSET DECK YouTube channel account with the scope:
   - `https://www.googleapis.com/auth/youtube.force-ssl`
5. Obtain a long-lived refresh token using offline access and consent prompting.

## Vercel environment variables

Add the following as encrypted server-side variables for Preview and Production:

```text
YOUTUBE_OAUTH_CLIENT_ID=
YOUTUBE_OAUTH_CLIENT_SECRET=
YOUTUBE_OAUTH_REFRESH_TOKEN=
```

Do not use the `NEXT_PUBLIC_` prefix. Redeploy after adding or changing the values.

## API flow

- The browser sends the current authenticated Supabase access token to `/api/sunset-deck/youtube/schedule`.
- The route verifies that token with Supabase Auth.
- The server exchanges the stored refresh token for a temporary Google access token.
- The server calls `videos.update` with only the `status` part.
- Scheduled publication sends `privacyStatus: private` and an ISO 8601 `publishAt` value.
- Immediate publication sets `privacyStatus` to `public` or `unlisted`.

## YouTube constraints

- Scheduled publication is available only for a private video that has never been published.
- A scheduled video must be sent as private when `publishAt` is set.
- A past `publishAt` time can publish the video immediately; the application rejects times less than one minute ahead.
- API projects may be subject to Google verification and YouTube API audit requirements.

## Smoke test

1. Upload a test video manually to the intended channel as private.
2. Approve the matching episode in SUNSET DECK.
3. Enter its YouTube video ID.
4. Select public and set a time at least several minutes in the future.
5. Press **YouTubeへ公開予約**.
6. Confirm the scheduled state in YouTube Studio.
