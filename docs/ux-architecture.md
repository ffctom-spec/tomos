# TOMOS UX Architecture

TOMOS Beta 0.2 is structured as an interactive AI Brand Operating System, not a single dashboard.

## Level 1

Command Center

The Command Center is the first screen. It shows only the information needed for executive judgment:

- TOMOS Beta 0.2
- Private AI Brand Operating System
- System Health
- Pending Approvals
- Today’s Brief
- AI Engines
- Quick Actions

## Level 2

Primary operating screens:

1. Executive Brief
2. Approval Center
3. Brand Portfolio
4. Broadcast Center
5. Content Review AI
6. SNS Health
7. Commerce Analytics
8. Product Opportunity
9. Knowledge Vault
10. Integrations

Each Level 2 screen is reachable from the Command Center, desktop sidebar, or mobile quick action bar.

## Level 3

Detail screens:

- Approval Item Detail
- Brand Detail
- Broadcast Detail
- Knowledge Detail

These screens hold detail that should not clutter the executive home screen.

## User Behavior

The user is an approver, not an operator.

Expected actions:

- Review the Executive Brief
- Open the Approval Center
- Approve, request revision, hold, or reject
- Drill into detail only when needed
- Check SNS, commerce, product, and integration status

## Approval Flow

1. AI creates a proposal.
2. TOMOS places it in Approval Center.
3. User opens the card or detail screen.
4. User chooses approve, revision request, hold, or reject.
5. Local state updates immediately in Beta 0.2.
6. Activity Timeline and Decision Log record the action.

Production should persist these events to the database with an audit trail.

## Mobile Executive Mode

Mobile is the primary surface.

Design goals:

- One-handed operation
- Bottom quick action bar
- Large metrics
- Short labels
- Details moved into Level 3
- Approval decisions always visible

Desktop remains an Operating Center with a sidebar. Tablet behaves as a manager view.

## API Expansion

Current implementation uses local state and mock data. The hierarchy is designed to map later to routes such as:

- `/dashboard`
- `/approvals`
- `/brands`
- `/broadcast`
- `/content-review`
- `/sns`
- `/commerce`
- `/products`
- `/knowledge`
- `/integrations`

Future API-backed expansion:

- OpenAI for Executive Brief, Content Review AI, and AIO recommendations
- Instagram Graph API for SNS Health
- YouTube, Analytics, Search Console, and commerce APIs for performance data
- Database persistence for approvals, activity logs, and user-owned brand data
- Encrypted storage for SNS and commerce tokens
