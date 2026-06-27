import type {
  AiConsoleRequest,
  AiConsoleResponse,
  AiProvider,
} from "@/app/_lib/portal-types";

const tomosSystemPrompt =
  "You are TOMOS, a private AI Brand Operating System. Respond in Japanese. Focus on executive approval, brand operation, AIO, SNS, commerce, and next actions. Keep the answer concise and actionable for a user operating from iPhone.";

function getFallbackResponse(provider: AiProvider, prompt: string): AiConsoleResponse {
  return {
    provider,
    mode: "mock",
    model: provider === "openai" ? "mock-gpt" : "mock-gemini",
    output: `Demo Mode: ${provider === "openai" ? "GPT" : "Gemini"} APIキー未設定のため、TOMOSがローカル応答を返しています。\n\n受信した指示: ${prompt}\n\n次の推奨アクション:\n1. Executive Approvalに回す判断だけを抽出\n2. Broadcast Mission化できるテーマを1つ選定\n3. AIO / SNS / Commerceの観点で再スコアリング`,
  };
}

async function callOpenAi(prompt: string): Promise<AiConsoleResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-5.2";

  if (!apiKey) {
    return getFallbackResponse("openai", prompt);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: tomosSystemPrompt,
      input: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const data: {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        text?: string;
      }>;
    }>;
  } = await response.json();

  const output =
    data.output_text ??
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((item) => item.text)
      .filter(Boolean)
      .join("\n") ??
    "OpenAIから応答を取得しましたが、表示可能なテキストがありません。";

  return {
    provider: "openai",
    mode: "live",
    model,
    output,
  };
}

async function callGemini(prompt: string): Promise<AiConsoleResponse> {
  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

  if (!apiKey) {
    return getFallbackResponse("gemini", prompt);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: tomosSystemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data: {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
        }>;
      };
    }>;
  } = await response.json();

  const output =
    data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n") ??
    "Geminiから応答を取得しましたが、表示可能なテキストがありません。";

  return {
    provider: "gemini",
    mode: "live",
    model,
    output,
  };
}

export async function runAiConsole({
  provider,
  prompt,
}: AiConsoleRequest): Promise<AiConsoleResponse> {
  const normalizedPrompt = prompt.trim();

  if (!normalizedPrompt) {
    return getFallbackResponse(provider, "今日のTOMOS Executive Briefを要約");
  }

  if (provider === "gemini") {
    return callGemini(normalizedPrompt);
  }

  return callOpenAi(normalizedPrompt);
}
