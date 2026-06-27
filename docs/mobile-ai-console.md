# Mobile AI Console

Mobile AI Console makes TOMOS usable from iPhone 16 Pro as an approval-first AI Brand Operating System.

## Purpose

The user can send a short instruction to TOMOS and choose either GPT or Gemini as the provider.

Typical prompts:

- 今日のExecutive Approvalから最優先を1つ選ぶ
- Broadcast MissionのAIO/SNS/Commerce観点を要約する
- 承認前にリスクだけ抽出する
- 次のKnowledge Vault化アクションを出す

## API Route

`POST /api/ai`

Request:

```json
{
  "provider": "openai",
  "prompt": "今日のExecutive Approvalから最優先を1つ選んでください。"
}
```

Response:

```json
{
  "provider": "openai",
  "mode": "live",
  "model": "gpt-5.2",
  "output": "..."
}
```

## Providers

- OpenAI GPT: `OPENAI_API_KEY`, `OPENAI_MODEL`
- Google Gemini: `GEMINI_API_KEY`, `GEMINI_MODEL`

If keys are missing, TOMOS returns a mock response. This keeps the iPhone and Vercel experience stable before production credentials are configured.

## iPhone Notes

TOMOS includes a web app manifest and mobile viewport settings so it can be added to the iPhone home screen as a standalone private workspace.
