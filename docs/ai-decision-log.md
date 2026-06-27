# AI Decision Log

AI Decision Log explains why TOMOS made a recommendation.

It turns AI output from a black box into an operating record that the user can quickly judge.

## Required Fields

Each decision log should include:

- 根拠
- 想定効果
- リスク
- 次のアクション

## Purpose

Decision logs help the user understand:

- Why a topic was selected
- Why a brand was chosen
- Why a content asset should be rewritten
- Why a product route was recommended
- Why an AIO improvement matters
- What the expected upside and risk are

## Current Implementation

The current Command Center uses sample decision logs.

## Production Implementation

In production, decision logs should be generated from real inputs:

- Search signals
- SNS performance
- Commerce analytics
- AIO scoring
- Content review results
- Knowledge Vault coverage
- User approval history

All logs must be user-specific and private. External publication is allowed only after user approval.
