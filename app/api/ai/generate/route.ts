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
    audience: typeof body.audience === "string" ? body.audience : "家庭菜園の初心者",
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
  audience,
  tone,
  channel,
  postType,
  structure,
  asset,
  brand,
}: CreativeBriefRequest): CreativeBriefResponse {
  const contextLine = context.trim()
    ? `補足コンテキスト: ${context.trim()}`
    : "補足コンテキスト: 日常の中にある小さな素材を、土づくりの入口として見せたい。";
  const isEggshell = context.includes("卵") || topic.includes("卵") || topic.includes("殻");
  const firstCopy = isEggshell ? "捨てる前に、土へ。" : `${topic}を、まず見直す。`;

  return {
    mode: "mock",
    model: "mock-openai-creative-brief",
    demandHypothesis: {
      reasons: [
        `${topic}は悩みが具体的で、保存して後で見返す動機を作りやすいテーマです。`,
        `${objective}を目的にすると、結論、手順、注意点を短く整理しやすいです。`,
        `${structure}の形式は、AI検索にもSNSにも再利用しやすい知識資産になります。`,
      ],
      audience: `${audience}。${brand}の投稿から、難しい知識より先に実践の入口を知りたい人。`,
      saveReason: "手順、判断基準、よくある失敗を1投稿で確認できるため。",
      opportunityScore: 86,
      disclaimer: "AI推定の投稿機会です。リアルタイムの検索・SNSトレンドAPIには未接続です。",
    },
    founderContext: {
      coreMessage: isEggshell
        ? "お金をかけなくても、日常の中に土づくりの入口があること。"
        : `${topic}を、難しい専門知識ではなく生活や実践に近い入口として伝えること。`,
      readerAction: isEggshell
        ? "ゆで卵の殻を捨てる前に、庭や鉢の土を見直してみること。"
        : `${topic}を自分の環境で小さく試す前に、観察するポイントを確認すること。`,
      saveReason: "無料・身近・すぐ試せる・後で見返せる判断基準があるため。",
      emotionalValue: "難しそうな園芸を、暮らしの中の小さな発見へ変える安心感。",
      brandMeaning: `${brand}が、難しい知識を生活の中の実践へ翻訳するブランドだと伝える。`,
      assumedContext: "AI解釈。違う場合は編集できます。",
    },
    knowledgeConfidence: {
      easyToUse: [
        isEggshell
          ? "卵殻を土づくりの素材として活用する"
          : `${topic}を土づくりや観察のきっかけとして紹介する`,
        "身近な素材から小さく始める",
      ],
      conditional: [
        "植物や土への影響は土壌状態、量、分解状態に左右されるため断定しない",
        "すぐ効く、必ず改善する、という表現は避ける",
      ],
      needsVerification: [
        "特定成分が短期間で植物生育を改善するという科学的因果",
        "病害虫や健康効果に関する断定",
      ],
      saferPhrases: [
        "土づくりを見直す小さなきっかけとして",
        "植物が育ちやすい環境を整える習慣のひとつとして",
        "少量から試し、土の状態を観察しながら続ける",
      ],
    },
    creativeAngles: [
      {
        name: isEggshell ? "食卓から庭へ" : "暮らしから実践へ",
        title: isEggshell
          ? "捨てる前に、土へ。ゆで卵の殻で始める0円の土づくり"
          : `${topic}を暮らしの中から始める`,
        intent: "暮らしの中の循環を見せる。",
        audience,
        saveReason: "無料・身近・すぐ試せるため。",
        format: "Carousel",
        visualDirection: isEggshell
          ? "ゆで卵の殻 → 砕く手元 → 土へ混ぜる手元 → 植物の寄り。"
          : "素材 → 手元 → 実践 → 結果の順に見せる。",
        seriesPotential: "暮らし起点のシリーズ化に向く",
        firstSlideCopy: firstCopy,
      },
      {
        name: "肥料を買う前に",
        title: `肥料を買う前に。${topic}で見直したい最初のポイント`,
        intent: "0円・初心者・すぐできるという保存動機を作る。",
        audience,
        saveReason: "買う前の判断基準として保存されやすい。",
        format: "Reel",
        visualDirection: "冒頭で素材を見せ、3秒で結論、手元カットで手順化。",
        seriesPotential: "比較・商品導線へ展開しやすい",
        firstSlideCopy: "買う前に、まず観察。",
      },
      {
        name: "土を育てる習慣",
        title: `植物を増やす前に、まず土を育てる。${topic}から始める小さな習慣`,
        intent: "単発ノウハウではなく、ブランドの思想として見せる。",
        audience,
        saveReason: "習慣化の考え方として後で見返せる。",
        format: "Photo post / Carousel",
        visualDirection: "静かな寄り写真と短いコピーでブランド感を出す。",
        seriesPotential: "ブランドストーリー化しやすい",
        firstSlideCopy: "まず、土を育てる。",
      },
    ],
    concept: {
      summary: `${topic}を、${tone}のトーンで保存しやすい${channel}投稿にする。`,
      conclusion: `${topic}は、最初に見るべき判断基準を押さえるだけで成果が変わります。`,
      visualDirection: `${asset}を使い、1枚目で結論、以降で手順と注意点を見せる。`,
      carouselPlan: [
        `1枚目: ${firstCopy}`,
        "2枚目: 今日の食卓や暮らしにあるものが、庭の習慣になる。",
        "3枚目: 少量から土づくりの素材として考える。",
        "4枚目: すぐ効く魔法ではなく、土を観察する習慣として見せる。",
        "5枚目: 次回テーマと保存CTA",
      ],
      reelHook: `知らないと損する、${topic}の最初の判断基準。`,
      firstSlideCopy: firstCopy,
      subtitle: isEggshell
        ? "ゆで卵の殻で始める0円の土づくり"
        : `${topic}を小さく始める保存版`,
      reelCuts: ["素材を見せる", "手元で砕く/準備する", "土へ入れる", "植物とCTA"],
      telopIdeas: ["捨てる前に", "少量から", "土を観察", "保存して試す"],
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
      "“必ず効く”とは断定せず、“土づくりを見直す身近な入り口”として見せることで、信頼感と保存性の両方を高めるAI仮説です。",
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
      founderContext: {
        type: "object",
        additionalProperties: false,
        properties: {
          coreMessage: { type: "string" },
          readerAction: { type: "string" },
          saveReason: { type: "string" },
          emotionalValue: { type: "string" },
          brandMeaning: { type: "string" },
          assumedContext: { type: "string" },
        },
        required: [
          "coreMessage",
          "readerAction",
          "saveReason",
          "emotionalValue",
          "brandMeaning",
          "assumedContext",
        ],
      },
      knowledgeConfidence: {
        type: "object",
        additionalProperties: false,
        properties: {
          easyToUse: { type: "array", items: { type: "string" } },
          conditional: { type: "array", items: { type: "string" } },
          needsVerification: { type: "array", items: { type: "string" } },
          saferPhrases: { type: "array", items: { type: "string" } },
        },
        required: ["easyToUse", "conditional", "needsVerification", "saferPhrases"],
      },
      creativeAngles: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            title: { type: "string" },
            intent: { type: "string" },
            audience: { type: "string" },
            saveReason: { type: "string" },
            format: { type: "string" },
            visualDirection: { type: "string" },
            seriesPotential: { type: "string" },
            firstSlideCopy: { type: "string" },
          },
          required: [
            "name",
            "title",
            "intent",
            "audience",
            "saveReason",
            "format",
            "visualDirection",
            "seriesPotential",
            "firstSlideCopy",
          ],
        },
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
          firstSlideCopy: { type: "string" },
          subtitle: { type: "string" },
          reelCuts: { type: "array", items: { type: "string" } },
          telopIdeas: { type: "array", items: { type: "string" } },
        },
        required: [
          "summary",
          "conclusion",
          "visualDirection",
          "carouselPlan",
          "reelHook",
          "firstSlideCopy",
          "subtitle",
          "reelCuts",
          "telopIdeas",
        ],
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
      "founderContext",
      "knowledgeConfidence",
      "creativeAngles",
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
          "You are TOMOS Founder Context Brain. Return Japanese JSON only. Infer founder intent from short notes, but label inference as AI解釈 or AI仮説. Create practical brand-operator content plans, creative angles, knowledge confidence, and safe wording. Never claim real-time demand, real trend data, actual metrics, or scientific causality without verification. Avoid strong claims like 必ず効く or 根が必ず元気になる. Use phrases like AI需要仮説, AI推定, 想定, 根拠確認が必要. Do not include secrets.",
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
