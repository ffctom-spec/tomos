import type {
  AiConsoleRequest,
  AiConsoleResponse,
  AiProvider,
  AiReviewRequest,
  AiReviewResponse,
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
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

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

function getMockReview({
  content,
  brand,
  channel,
}: AiReviewRequest): AiReviewResponse {
  return {
    mode: "mock",
    model: "mock-openai-review",
    summary: `${brand} / ${channel}向けに、AIO・SEO・SNS・ブランド適合・CV導線の観点でレビューしました。APIキー未設定のためmock responseです。`,
    scores: [
      { label: "AIO引用適性", score: 86, note: "FAQ化しやすい具体テーマです。" },
      { label: "SEO", score: 78, note: "検索意図を冒頭に明記すると改善します。" },
      { label: "SNS保存性", score: 82, note: "比較表と手順化で保存率が上がります。" },
      { label: "ブランド適合", score: 90, note: `${brand}の専門性と相性が良い内容です。` },
      { label: "CV導線", score: 72, note: "商品導線は自然ですが、選び方FAQが必要です。" },
    ],
    rewrite: `${content}\n\n補足: 結論、理由、具体手順、よくある失敗、次の行動の順に整理すると、AIにもユーザーにも引用されやすくなります。`,
    nextActions: [
      "冒頭に結論を1文で追加",
      "FAQを3問追加",
      "商品導線は比較表の後に配置",
    ],
  };
}

export async function reviewContentWithOpenAI(
  payload: AiReviewRequest,
): Promise<AiReviewResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  if (!apiKey) {
    return getMockReview(payload);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions:
        "You are TOMOS Content Review AI. Review content for AIO citation fit, SEO, SNS save/share potential, brand fit, and conversion path. Return concise JSON only.",
      input: JSON.stringify(payload),
      text: {
        format: {
          type: "json_schema",
          name: "tomos_content_review",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              scores: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    label: { type: "string" },
                    score: { type: "number" },
                    note: { type: "string" },
                  },
                  required: ["label", "score", "note"],
                },
              },
              rewrite: { type: "string" },
              nextActions: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: ["summary", "scores", "rewrite", "nextActions"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI review request failed: ${response.status}`);
  }

  const data: { output_text?: string } = await response.json();
  const parsed = JSON.parse(data.output_text ?? "{}") as Omit<
    AiReviewResponse,
    "mode" | "model"
  >;

  return {
    mode: "live",
    model,
    summary: parsed.summary,
    scores: parsed.scores,
    rewrite: parsed.rewrite,
    nextActions: parsed.nextActions,
  };
}
