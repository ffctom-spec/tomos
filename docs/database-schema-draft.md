# Database Schema Draft

This draft describes the first production schema direction.

## Core Tables

- `users`
- `workspaces`
- `brands`
- `brand_assets`
- `approval_items`
- `broadcast_missions`
- `content_reviews`
- `aio_metrics`
- `sns_accounts`
- `sns_metrics`
- `commerce_events`
- `product_opportunities`
- `knowledge_vault_items`
- `activity_logs`
- `decision_logs`
- `automation_rules`
- `api_connections`

## Important Fields

Most tables should include:

- `id`
- `workspace_id`
- `user_id`
- `status`
- `created_at`
- `updated_at`

Approval and publication tables should also include:

- `approved_by`
- `approved_at`
- `published_at`
- `visibility`
- `audit_log_id`

## Production Notes

Use workspace-scoped queries by default. Add row-level security or equivalent access guards before connecting real user data.
