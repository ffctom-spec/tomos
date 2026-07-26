# SUNSET DECK YouTube Publishing

## Implemented

- Publishing queue for approved episodes
- YouTube video ID storage
- Privacy setting: private, unlisted, public
- Scheduled publication date and time
- Publishing states: not ready, ready, scheduled, published, failed
- Manual published-state confirmation
- Supabase persistence and owner-scoped RLS

## Next integration step

Connect a server-side YouTube Data API worker. The browser must never receive the YouTube OAuth client secret or refresh token. The worker should read scheduled rows, update the corresponding YouTube video, and write the result back to `publish_state`, `published_at`, or `publish_error`.
