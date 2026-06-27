# Always-On AI Engine

TOMOS is a 24-hour AI Brand Operating System.

The system is not a static dashboard. It is designed to keep running in the background: researching, analyzing, proposing, improving, and routing only the decisions that require executive approval to the user.

## Engines

TOMOS separates work into always-on engines:

- Research Engine
- AIO Engine
- SNS Engine
- Commerce Engine
- Content Review Engine
- Knowledge Vault Engine
- Learning Loop Engine
- Approval Engine

## Engine Status

Each engine can report one of the following states:

- Running
- Monitoring
- Queued
- Waiting approval
- Learning
- Paused

## Current Implementation

The current UI uses sample data to show the target operating model.

## Production Implementation

In production, TOMOS should connect to:

- Cron jobs for scheduled work
- Webhooks for external events
- SNS APIs for account and post performance
- Analytics APIs for traffic and conversion data
- EC APIs for product and sales data
- AI APIs for research, review, generation, and scoring

All data must be separated per user. External publication must happen only after explicit user approval.
