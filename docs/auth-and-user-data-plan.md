# Auth And User Data Plan

TOMOS is not a public brand site. It is a private workspace for logged-in users.

## Authentication

Production TOMOS requires:

- Login required for all dashboard routes
- Server-side session verification
- User-specific workspace context
- Protected API routes
- Role-aware access control when teams are added

## User Data Isolation

Each user owns:

- Registered brands
- SNS accounts and tokens
- Commerce integrations
- AIO scores
- Approval queues
- Content drafts
- Knowledge Vault assets
- Decision logs
- Revenue and conversion analytics

No user-owned data should be visible to another user.

## Token Security

SNS, analytics, commerce, and AI API tokens must be encrypted at rest. Production should avoid exposing tokens to the browser.

## Publication Model

Default state is private. Content becomes public only after the user explicitly approves publication.
