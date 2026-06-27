# API Integration Plan

TOMOS is structured so mock data can be replaced by authenticated API responses.

## Current Client Layer

`app/_lib/api-client.ts` exposes mock fetch functions:

- `getExecutiveBrief()`
- `getAiEngines()`
- `getApprovalItems()`
- `getUserBrands()`
- `getBroadcastIdeas()`
- `getSnsHealth()`
- `getCommerceAnalytics()`
- `getProductOpportunities()`
- `getActivityTimeline()`
- `getDecisionLogs()`

## Planned API Groups

- Auth API: session, workspace, roles
- Brand API: user-owned brands and visibility status
- Approval API: approve, request revision, hold, reject
- Broadcast API: daily missions and channel drafts
- AIO API: FAQ, glossary, comparison tables, citation scoring
- SNS API: Instagram, YouTube, Shorts, Threads, Pinterest metrics
- Commerce API: product clicks, purchases, CVR, revenue
- Learning Loop API: post-publication outcomes and next recommendations
- Knowledge Vault API: reusable knowledge assets

## Production Requirement

All API responses must be scoped to the authenticated user. External publication must occur only after explicit user approval.
