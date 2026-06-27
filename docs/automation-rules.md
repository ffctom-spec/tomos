# Automation Rules

Automation Rules define how TOMOS operates without requiring the user to perform daily work.

The user should not manually check every source, analyze every metric, or prepare every content asset. TOMOS should run the operating loop and surface only the decisions that need approval.

## Planned Rules

- 毎朝 Daily Brief 作成
- 毎日 Content Opportunity 抽出
- 毎週 SNS Health 分析
- 毎週 Commerce Analytics 更新
- 毎月 Brand Asset Review

## Rule Output

Each automation rule should generate one of the following:

- Broadcast Mission
- Executive Approval
- AI Decision Log
- Knowledge Vault update
- Learning Loop recommendation
- Commerce improvement
- AIO improvement

## Current Implementation

The current version displays sample automation rules in the Command Center.

## Production Implementation

Production TOMOS should run rules using Cron, queues, Webhooks, SNS APIs, Analytics APIs, EC APIs, and AI APIs.

Rules must run inside a user-specific data boundary. Drafts, logs, scores, tokens, and private brand data must not be shared across users.
