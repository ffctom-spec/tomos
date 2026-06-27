import type {
  CreativeBriefRequest,
  CreativeBriefResponse,
} from "@/app/_lib/portal-types";

export const runtime = "nodejs";

function normalizePayload(body: Partial<CreativeBriefRequest>): CreativeBriefRequest {
  return {
    topic: typeof body.topic === "string" && body.topic.trim() ? body.topic : "0円でできる土壌改良",
    context: typeof body.context === "string" ? body.context : "",
    objective: typeof body.objective === "string" ? body.objective : "保存を増やす",
    tone: typeof body.tone === "string" ? body.tone : "専門的で信頼感",
    channel: typeof body.channel === "string" ? body.channel : "Instagram",
    postType: typeof body.postType === "string" ? body.postType : "Carousel",
    structure: typeof body.structure === "string" ? body.structure : "保存版ガイド",
    asset: typeof body.asset === "string" ? body.asset : "AI推奨アセット",
    brand: typeof body.brand === "string" ? body.brand : "TOMOS",
  };
}

function getMockCreativeBrief({
  topic,
  context,
  objective,
  tone,
  channel,
  postType,
  structure,
  asset,
  brand,
}: CreativeBriefRequest): CreativeBriefResponse {
  const contextLine = context.trim()
    ? `補足コンテキスト: ${context.trim()}`
    : "補足コンテキスト: 初心者にも判断しやすい内容として整理。";

  return {
    mode: "mock",
    model: "mock-openai-creative-brief",
    demandHypothesis: {
      reasons: [
        `${topic}は悩みが具体的で、保存して後で見返す動機を作りやすいテーマです。`,
        `${objective}を目的にすると、結論、手順、注意点を短く整理しやすいです。`,
        `${structure}の形式は、AI検索にもSNSにも再利用しやすい知識資産になります。`,
      ],
      audience: `${brand}に関心があり、実践前に失敗を避けたい初心者から中級者。`,
      saveReason: "手順、判断基準、よくある失敗を1投稿で確認できるため。",
      opportunityScore: 86,
      disclaimer: "AI推定の投稿機会です。リアルタイムの検索・SNSトレンドAPIには未接続です。",
    },
    concept: {
      summary: `${topic}を、${tone}のトーンで保存しやすい${channel}投稿にする。`,
      conclusion: `${topic}は、最初に見るべき判断基準を押さえるだけで成果が変わります。`,
      visualDirection: `${asset}を使い、1枚目で結論、以降で手順と注意点を見せる。`,
      carouselPlan: [
        "1枚目: 結論と保存理由",
        "2枚目: よくある失敗",
        "3枚目: 具体的な判断基準",
        "4枚目: 実践手順",
        "5枚目: 商品導線とCTA",
      ],
      reelHook: `知らないと損する、${topic}の最初の判断基準。`,
    },
    titleOptions: [
      `${topic}の始め方`,
      `失敗しない${topic}`,
      `保存版: ${topic}で見るべきポイント`,
    ],
    leadOptions: [
      `${topic}は、難しいテクニックよりも最初の判断が大切です。`,
      `まず何を見ればいいか分かるだけで、${topic}の失敗は減らせます。`,
      `${contextLine} 今回は実践前に確認したいポイントをまとめます。`,
    ],
    finalPost: {
      title: `保存版: ${topic}`,
      lead: `${topic}で迷ったら、まず結論、理由、判断基準の順に確認してください。`,
      body: `${contextLine}\n\n今回は${brand}の視点で、${structure}として使えるように整理します。まず結論を押さえ、次に失敗しやすいポイント、最後に実践手順と商品導線を確認します。`,
      cta: "保存して、実践前のチェックリストとして使ってください。",
      hashtags: [`#${brand}`, "#TOMOS", "#保存版", "#AI推定", "#投稿下書き"],
      productPath: "関連商品、PDFガイド、比較表への導線を投稿末尾に配置。",
      aioFaq: [
        `Q. ${topic}で最初に確認すべきことは？ A. 目的、環境、失敗しやすい条件です。`,
        `Q. 初心者でも実践できますか？ A. 手順を分ければ、小さく始められます。`,
        "Q. 商品導線はどこに入れるべきですか？ A. 判断基準と比較表の後が自然です。",
      ],
      instagramCaption: `${topic}\n\n${objective}ために、今回は${structure}で整理しました。\n\n保存して、次に試す前に見返してください。`,
      channelFormat: `${channel} / ${postType}`,
    },
    aiComment:
      "このテーマなら、最初に結論を見せてから手順化すると、保存・反応につながりやすいAI推定です。",
  };
}

function getJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      demandHypothesis: {
        type: "object",
        additionalProperties: false,
        properties: {
          reasons: { type: "array", items: { type: "string" } },
          audience: { type: "string" },
          saveReason: { type: "string" },
          opportunityScore: { type: "number" },
          disclaimer: { type: "string" },
        },
        required: ["reasons", "audience", "saveReason", "opportunityScore", "disclaimer"],
      },
      concept: {
        type: "object",
        additionalProperties: false,
        properties: {
          summary: { type: "string" },
          conclusion: { type: "string" },
          visualDirection: { type: "string" },
          carouselPlan: { type: "array", items: { type: "string" } },
          reelHook: { type: "string" },
        },
        required: ["summary", "conclusion", "visualDirection", "carouselPlan", "reelHook"],
      },
      titleOptions: { type: "array", items: { type: "string" } },
      leadOptions: { type: "array", items: { type: "string" } },
      finalPost: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          lead: { type: "string" },
          body: { type: "string" },
          cta: { type: "string" },
          hashtags: { type: "array", items: { type: "string" } },
          productPath: { type: "string" },
          aioFaq: { type: "array", items: { type: "string" } },
          instagramCaption: { type: "string" },
          channelFormat: { type: "string" },
        },
        required: [
          "title",
          "lead",
          "body",
          "cta",
          "hashtags",
          "productPath",
          "aioFaq",
          "instagramCaption",
          "channelFormat",
        ],
      },
      aiComment: { type: "string" },
    },
    required: [
      "demandHypothesis",
      "concept",
      "titleOptions",
      "leadOptions",
      "finalPost",
      "aiComment",
    ],
  };
}

export async function POST(request: Request) {
  try {
    const payload = normalizePayload(
      (await request.json()) as Partial<CreativeBriefRequest>,
    );
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

    if (!apiKey) {
      return Response.json(getMockCreativeBrief(payload));
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
          "You are TOMOS AI Creative Brief. Return Japanese JSON only. Create practical brand-operator content plans. Never claim real-time demand, real trend data, or actual metrics. Use phrases like AI需要仮説, AI推定, 想定. Do not include secrets.",
        input: JSON.stringify(payload),
        text: {
          format: {
            type: "json_schema",
            name: "tomos_creative_brief",
            schema: getJsonSchema(),
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI creative brief request failed: ${response.status}`);
    }

    const data: {
      output_text?: string;
      output?: Array<{ content?: Array<{ text?: string }> }>;
    } = await response.json();
    const outputText =
      data.output_text ??
      data.output
        ?.flatMap((item) => item.content ?? [])
        .map((item) => item.text)
        .filter(Boolean)
        .join("\n");

    if (!outputText) {
      throw new Error("OpenAI creative brief response did not include output text");
    }

    const parsed = JSON.parse(outputText) as Omit<
      CreativeBriefResponse,
      "mode" | "model"
    >;

    return Response.json({
      ...parsed,
      mode: "live",
      model,
    } satisfies CreativeBriefResponse);
  } catch (error) {
    return Response.json(
      {
        error: "Creative brief generation failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
