# Private Workspace Model

TOMOS runs as a login-only private workspace.

## Private By Default

User-owned brands, SNS integrations, sales data, AIO scores, drafts, approval items, and AI decision logs are private by default.

## Public Only After Approval

The only assets that may become public are:

- User-approved articles
- User-approved videos
- User-approved SNS posts
- User-approved brand pages

## Production Requirements

- Route protection for all workspace pages
- User-scoped database access
- Encrypted API tokens
- Audit logs for approval and publication
- Clear separation between draft, approved, and published states
