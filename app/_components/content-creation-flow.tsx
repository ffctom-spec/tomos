"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ApprovalItem,
  CreativeBriefResponse,
} from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6;

type UploadedAsset = {
  name: string;
  url: string;
};

type PostSimulation = {
  total: number;
  message: string;
  scores: Array<{ label: string; value: number }>;
  performance: Array<{ label: string; value: string }>;
};

type SeriesOpportunity = {
  title: string;
  format: string;
  intent: string;
  score: number;
};

type DistributionPlan = {
  primaryFormat: string;
  order: string[];
  reason: string;
  expectedActions: Array<{ format: string; action: string }>;
  caution: string;
  rollout: Array<{
    day: string;
    format: string;
    theme: string;
    objective: string;
    detail: string;
    hook: string;
  }>;
  recognition: {
    current: string;
    phase: string;
    nextGoal: string;
    priorityThemes: string[];
  };
  conversationStarters: string[];
  confidence: "Low" | "Medium" | "High";
};

const channels = ["Instagram", "YouTube", "Threads"] as const;
const postTypes = ["Carousel", "Reel", "Photo post"] as const;
const structures = ["保存版ガイド", "Before / After", "3つのポイント", "FAQ型"] as const;
const assets = ["AI推奨アセット", "ブランド写真 01", "商品・施工写真 02", "後で選ぶ"] as const;
const objectives = ["保存を増やす", "認知を広げる", "信頼をつくる", "商品導線をつくる", "問い合わせを増やす"] as const;
const audiences = ["家庭菜園の初心者", "庭づくりを始めた人", "ドライガーデン好き", "植物を元気にしたい人", "ライフスタイル・循環に関心がある人"] as const;
const tones = ["専門的で信頼感", "親しみやすく実践的", "カリフォルニアモダン", "上質でブランド感", "ナチュラルで暮らし寄り"] as const;

const fallbackApproval: ApprovalItem = {
  id: "demo-approval",
  type: "Instagramリード文",
  title: "0円でできる土壌改良",
  brand: "VERDNA",
  reason: "保存率改善のため冒頭に結論と保存理由を追加。",
  status: "Pending",
};

function StepButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`min-h-14 border px-4 text-left text-sm font-medium transition ${
        active
          ? "border-white bg-white text-black"
          : "border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/10"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function ContentCreationFlow({
  approval = fallbackApproval,
  instagramConnected = false,
  onBack,
  onCreativeBriefGenerated,
  onDraftSaved,
  onDistributionPlanCreated,
  onPhotoAssetSelected,
  onPostSimulationGenerated,
  onSeriesRolloutPlanned,
  onSeriesOpportunityAdded,
  onConversationStarterSelected,
}: {
  approval?: ApprovalItem;
  instagramConnected?: boolean;
  onBack?: () => void;
  onCreativeBriefGenerated?: () => void;
  onDraftSaved?: () => void;
  onDistributionPlanCreated?: () => void;
  onPhotoAssetSelected?: (fileName: string) => void;
  onPostSimulationGenerated?: () => void;
  onSeriesRolloutPlanned?: () => void;
  onSeriesOpportunityAdded?: (title: string) => void;
  onConversationStarterSelected?: (starter: string) => void;
}) {
  const [step, setStep] = useState<FlowStep>(1);
  const [channel, setChannel] = useState<(typeof channels)[number]>("Instagram");
  const [postType, setPostType] = useState<(typeof postTypes)[number]>("Carousel");
  const [structure, setStructure] = useState<(typeof structures)[number]>("保存版ガイド");
  const [asset, setAsset] = useState<(typeof assets)[number]>("AI推奨アセット");
  const [topic, setTopic] = useState(approval.title);
  const [context, setContext] = useState("");
  const [objective, setObjective] = useState<(typeof objectives)[number]>("保存を増やす");
  const [audience, setAudience] = useState<(typeof audiences)[number]>("家庭菜園の初心者");
  const [tone, setTone] = useState<(typeof tones)[number]>("専門的で信頼感");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contextAnalyzed, setContextAnalyzed] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [creativeBrief, setCreativeBrief] =
    useState<CreativeBriefResponse | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedFirstCopy, setSelectedFirstCopy] = useState("");
  const [editableBody, setEditableBody] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(null);
  const [addedSeriesTitle, setAddedSeriesTitle] = useState("");
  const [addedConversationStarter, setAddedConversationStarter] = useState("");
  const [baselineReach, setBaselineReach] = useState("500");
  const [variantIndex, setVariantIndex] = useState(0);

  useEffect(() => {
    return () => {
      if (uploadedAsset?.url) {
        URL.revokeObjectURL(uploadedAsset.url);
      }
    };
  }, [uploadedAsset]);

  const simulation = useMemo(
    () =>
      getPostSimulation({
        hasImage: Boolean(uploadedAsset) || asset !== "後で選ぶ",
        postType,
        structure,
      }),
    [asset, postType, structure, uploadedAsset],
  );

  const distributionPlan = useMemo(
    () =>
      getDistributionPlan({
        audience,
        hasImage: Boolean(uploadedAsset) || asset !== "後で選ぶ",
        objective,
        postType,
        structure,
        title: selectedTitle || topic,
        tone,
        topic,
      }),
    [asset, audience, objective, postType, selectedTitle, structure, tone, topic, uploadedAsset],
  );

  const stepLabel = useMemo(() => {
    const labels: Record<FlowStep, string> = {
      1: "Channel",
      2: "Post type",
      3: "Structure",
      4: "Asset",
      5: "Founder Context Brain",
      6: "Publish Review",
    };

    return labels[step];
  }, [step]);

  function goNext() {
    setStep((current) => Math.min(current + 1, 6) as FlowStep);
  }

  function selectAndContinue<T extends string>(
    value: T,
    setter: (nextValue: T) => void,
  ) {
    setter(value);
    goNext();
  }

  function goPrevious() {
    if (step === 1) {
      onBack?.();
      return;
    }
    setStep((current) => Math.max(current - 1, 1) as FlowStep);
  }

  async function generateBrief() {
    setIsGenerating(true);
    setGenerationError("");
    setSaved(false);

    try {
      const result = createMockCreativeBrief({
        topic,
        context,
        objective,
        audience,
        tone,
        channel,
        postType,
        structure,
        asset,
        brand: approval.brand,
      });
      setCreativeBrief(result);
      setSelectedTitle(result.finalPost.title);
      setSelectedFirstCopy(result.concept.firstSlideCopy);
      setEditableBody(result.finalPost.body);
      setStep(6);
      onCreativeBriefGenerated?.();
      onPostSimulationGenerated?.();
      onDistributionPlanCreated?.();
      onSeriesRolloutPlanned?.();
    } catch {
      setGenerationError("投稿案の生成に失敗しました。もう一度試してください。");
    } finally {
      setIsGenerating(false);
    }
  }

  function saveDraft() {
    setSaved(true);
    onDraftSaved?.();
  }

  function selectPhoto(file: File | undefined) {
    if (!file) return;

    if (uploadedAsset?.url) {
      URL.revokeObjectURL(uploadedAsset.url);
    }

    const nextAsset = {
      name: file.name,
      url: URL.createObjectURL(file),
    };
    setUploadedAsset(nextAsset);
    setAsset("AI推奨アセット");
    onPhotoAssetSelected?.(file.name);
  }

  function removePhoto() {
    if (uploadedAsset?.url) {
      URL.revokeObjectURL(uploadedAsset.url);
    }
    setUploadedAsset(null);
  }

  function generateLocalVariant() {
    if (!creativeBrief) return;

    const nextIndex = (variantIndex + 1) % creativeBrief.titleOptions.length;
    const nextTitle =
      creativeBrief.titleOptions[nextIndex] ?? creativeBrief.finalPost.title;
    const nextLead =
      creativeBrief.leadOptions[nextIndex] ?? creativeBrief.finalPost.lead;

    setVariantIndex(nextIndex);
    setSelectedTitle(nextTitle);
    setSelectedFirstCopy(creativeBrief.concept.firstSlideCopy);
    setEditableBody(
      `${nextLead}\n\n${creativeBrief.finalPost.body}\n\n別案ポイント: ${structure}として、1枚目で結論をより短く見せる構成です。`,
    );
  }

  function analyzeContext() {
    setContextAnalyzed(true);
  }

  function adoptFounderAngle(
    angle: CreativeBriefResponse["creativeAngles"][number],
  ) {
    setTopic(angle.title);
    setSelectedTitle(angle.title);
    setSelectedFirstCopy(angle.firstSlideCopy);
    setContextAnalyzed(true);
  }

  function adoptCreativeAngle(
    angle: CreativeBriefResponse["creativeAngles"][number],
  ) {
    if (!creativeBrief) return;

    setSelectedTitle(angle.title);
    setSelectedFirstCopy(angle.firstSlideCopy);
    setEditableBody(
      `${angle.title}\n\n${creativeBrief.finalPost.lead}\n\n狙い: ${angle.intent}\n\n${creativeBrief.finalPost.body}`,
    );
  }

  function addSeriesOpportunity(title: string) {
    setAddedSeriesTitle(title);
    onSeriesOpportunityAdded?.(title);
  }

  function addConversationStarter(starter: string) {
    setAddedConversationStarter(starter);
    setEditableBody((current) => `${current}\n\n${starter}`);
    onConversationStarterSelected?.(starter);
  }

  return (
    <ViewFrame
      eyebrow="06 / CONTENT CREATION FLOW"
      detail="承認後の投稿作成を、選択式だけでDraft生成まで進めます。実投稿は行いません。"
      onBack={goPrevious}
      title="Content Creation Flow"
    >
      <div className="mb-6 grid grid-cols-6 border border-white/10">
        {([1, 2, 3, 4, 5, 6] as FlowStep[]).map((item) => (
          <div
            className={`min-h-12 border-r border-white/10 p-3 text-xs last:border-r-0 ${
              item <= step ? "bg-white text-black" : "bg-black/35 text-zinc-500"
            }`}
            key={item}
          >
            {String(item).padStart(2, "0")}
          </div>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Step {step} / 6
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{stepLabel}</h2>
        </div>
        <span className="border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-400">
          Draft only
        </span>
      </div>

      {step < 6 ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <GlassCard>
            {step === 1 ? (
              <OptionGrid
                current={channel}
                items={channels}
                onSelect={(value) => selectAndContinue(value, setChannel)}
              />
            ) : null}
            {step === 2 ? (
              <OptionGrid
                current={postType}
                items={postTypes}
                onSelect={(value) => selectAndContinue(value, setPostType)}
              />
            ) : null}
            {step === 3 ? (
              <OptionGrid
                current={structure}
                items={structures}
                onSelect={(value) => selectAndContinue(value, setStructure)}
              />
            ) : null}
            {step === 4 ? (
              <AssetSelection
                asset={asset}
                uploadedAsset={uploadedAsset}
                onAssetSelect={(value) => selectAndContinue(value, setAsset)}
                onPhotoSelect={selectPhoto}
                onRemovePhoto={removePhoto}
              />
            ) : null}
            {step === 5 ? (
              <CreativeBriefForm
                context={context}
                generationError={generationError}
                isGenerating={isGenerating}
                contextAnalyzed={contextAnalyzed}
                audience={audience}
                objective={objective}
                simulation={simulation}
                tone={tone}
                topic={topic}
                onBack={goPrevious}
                onAnalyzeContext={analyzeContext}
                onContextChange={setContext}
                onFounderAngleAdopt={adoptFounderAngle}
                onGenerate={generateBrief}
                onAudienceChange={setAudience}
                onObjectiveChange={setObjective}
                onToneChange={setTone}
                onTopicChange={setTopic}
              />
            ) : null}
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Approval Source
            </p>
            <h3 className="mt-3 text-xl font-semibold">{approval.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {approval.brand} / {approval.type}
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {approval.reason}
            </p>
            <div className="mt-5 grid gap-3">
              {[
                ["投稿先", channel],
                ["形式", postType],
                ["構成", structure],
                ["素材", asset],
              ].map(([label, value]) => (
                <div
                  className="border border-white/10 bg-white/[0.04] p-4"
                  key={label}
                >
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-2 text-sm text-zinc-200">{value}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      ) : creativeBrief ? (
          <PublishReviewCard
            asset={asset}
            addedSeriesTitle={addedSeriesTitle}
            brief={creativeBrief}
            channel={channel}
            editableBody={editableBody}
            uploadedAsset={uploadedAsset}
            instagramConnected={instagramConnected}
            isGenerating={isGenerating}
            postType={postType}
            saved={saved}
            selectedFirstCopy={selectedFirstCopy}
            selectedTitle={selectedTitle}
            seriesOpportunities={getSeriesOpportunities(topic, structure)}
            simulation={simulation}
            baselineReach={baselineReach}
            distributionPlan={distributionPlan}
            structure={structure}
            onAdjust={() => setStep(5)}
            onAddSeries={addSeriesOpportunity}
            onAngleAdopt={adoptCreativeAngle}
            onBodyChange={setEditableBody}
            onBaselineReachChange={setBaselineReach}
            onConversationStarterSelect={addConversationStarter}
            onRegenerate={generateLocalVariant}
            onSave={saveDraft}
            onTitleSelect={setSelectedTitle}
            addedConversationStarter={addedConversationStarter}
          />
      ) : null}

      {step < 5 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <PillButton onClick={goPrevious}>戻る</PillButton>
          <PillButton tone="light" onClick={goNext}>
            次へ
          </PillButton>
        </div>
      ) : null}
    </ViewFrame>
  );
}

function getPostSimulation({
  hasImage,
  postType,
  structure,
}: {
  hasImage: boolean;
  postType: string;
  structure: string;
}): PostSimulation {
  const visualFit = hasImage ? 84 : 62;
  const saveBoost = structure === "保存版ガイド" ? 10 : structure === "FAQ型" ? 7 : 3;
  const carouselBoost = postType === "Carousel" ? 8 : postType === "Reel" ? 4 : 0;
  const reelBoost = postType === "Reel" ? 7 : 0;
  const topicFit = 84 + (structure === "3つのポイント" ? 4 : 0);
  const savePotential = Math.min(96, 72 + saveBoost + carouselBoost + (hasImage ? 5 : -8));
  const trustSignal = 78 + (structure === "保存版ガイド" ? 5 : 0);
  const seriesPotential = 82 + (structure === "Before / After" ? 6 : 0);
  const total = Math.round(
    (topicFit + visualFit + savePotential + trustSignal + seriesPotential) / 5,
  );
  const reachBase = 2600 + carouselBoost * 90 + reelBoost * 140 + (hasImage ? 900 : -650);
  const savesBase = 120 + saveBoost * 9 + carouselBoost * 8 + (hasImage ? 45 : -35);

  return {
    total,
    message:
      hasImage
        ? "保存型コンテンツとして強い構成です。画像にBefore / Afterがあると、さらに伸びやすくなります。"
        : "構成は強いですが、画像未選択のためVisual Fitと推定リーチを控えめに見積もっています。",
    scores: [
      { label: "Topic Fit", value: topicFit },
      { label: "Visual Fit", value: visualFit },
      { label: "Save Potential", value: savePotential },
      { label: "Trust Signal", value: trustSignal },
      { label: "Series Potential", value: seriesPotential },
    ],
    performance: [
      { label: "推定リーチ", value: `${Math.max(900, reachBase - 400).toLocaleString()} - ${(reachBase + 700).toLocaleString()}` },
      { label: "推定保存数", value: `${Math.max(30, savesBase - 30)} - ${savesBase + 55}` },
      { label: "推定プロフィール遷移", value: `${Math.max(18, Math.round(reachBase * 0.018))} - ${Math.round(reachBase * 0.036)}` },
      { label: "推定エンゲージメント率", value: `${hasImage ? "4.8" : "3.1"}% - ${postType === "Reel" ? "7.2" : "6.4"}%` },
      { label: "推定商品導線クリック", value: `${Math.max(8, Math.round(reachBase * 0.006))} - ${Math.round(reachBase * 0.018)}` },
    ],
  };
}

function getSeriesOpportunities(
  topic: string,
  structure: string,
): SeriesOpportunity[] {
  if (topic.includes("土壌") || topic.includes("土")) {
    return [
      {
        title: "土が固くなる原因3つ",
        format: "Carousel",
        intent: "問題認知を広げる",
        score: 88,
      },
      {
        title: "腐葉土・培養土・堆肥の違い",
        format: "Carousel",
        intent: "保存されやすい比較投稿",
        score: 91,
      },
      {
        title: "2週間後のBefore / After",
        format: "Reel",
        intent: "信頼とシリーズ継続",
        score: 86,
      },
    ];
  }

  return [
    {
      title: `${topic}で失敗しやすい3つの理由`,
      format: "Carousel",
      intent: "不安を具体化する",
      score: 84,
    },
    {
      title: `${topic}のBefore / After`,
      format: structure === "Before / After" ? "Reel" : "Carousel",
      intent: "視覚的に信頼を作る",
      score: 86,
    },
    {
      title: `${topic}のよくある質問`,
      format: "Photo post",
      intent: "AIOと保存導線を作る",
      score: 82,
    },
  ];
}

function getDistributionPlan({
  audience,
  hasImage,
  objective,
  postType,
  structure,
  title,
  tone,
  topic,
}: {
  audience: string;
  hasImage: boolean;
  objective: string;
  postType: string;
  structure: string;
  title: string;
  tone: string;
  topic: string;
}): DistributionPlan {
  const saveFocused = objective.includes("保存") || structure === "保存版ガイド" || structure === "FAQ型";
  const awarenessFocused = objective.includes("認知");
  const productFocused = objective.includes("商品");
  const conversationFocused = objective.includes("問い合わせ") || audience.includes("ライフスタイル");
  const weakMaterial = !hasImage;
  const primaryFormat = weakMaterial || saveFocused || productFocused
    ? "Carousel Feed"
    : awarenessFocused && hasImage
      ? "Reel"
      : conversationFocused
        ? "Story"
        : postType === "Reel"
          ? "Reel"
          : "Carousel Feed";
  const order = productFocused
    ? ["Carousel Feed", "Story", "Reel"]
    : primaryFormat === "Reel"
      ? ["Reel", "Story", "Carousel Feed"]
      : primaryFormat === "Story"
        ? ["Story", "Carousel Feed", "Reel"]
        : ["Carousel Feed", "Story", "Reel"];

  return {
    primaryFormat,
    order,
    reason:
      primaryFormat === "Reel"
        ? "短い動画で興味を作り、その後Storyで反応を集め、Carouselで保存される知識に変える流れと相性が良いというAI運用仮説です。"
        : primaryFormat === "Story"
          ? "まず既存フォロワーの反応を集め、会話から保存型投稿へ展開する流れが向くというAI運用仮説です。"
          : "説明性と保存性が重要なテーマのため、Carousel Feedで知識として残し、Storyで会話を作る流れが向くというAI運用仮説です。",
    expectedActions: [
      { format: "Reel", action: "新規リーチ" },
      { format: "Story", action: "投票・返信・会話" },
      { format: "Carousel Feed", action: "保存・再訪・信頼" },
    ],
    caution:
      "画像や動画が弱い場合は、ReelよりCarouselを優先する提案に切り替えてください。",
    rollout: [
      {
        day: "Day 1",
        format: primaryFormat === "Reel" ? "Reel" : "Carousel Feed",
        theme: title,
        objective: primaryFormat === "Reel" ? "新規リーチを作る" : "保存される知識にする",
        detail: primaryFormat === "Reel" ? "12〜18秒" : "5ページ",
        hook: `肥料を買う前に、${topic}を見直してください。`,
      },
      {
        day: "Day 2",
        format: "Story",
        theme: `${topic}、試したことありますか？`,
        objective: "投票・返信を集める",
        detail: "Poll / Question Sticker",
        hook: "やったことある / まだない",
      },
      {
        day: "Day 4",
        format: "Carousel Feed",
        theme: topic.includes("土") ? "腐葉土・堆肥・培養土。役割の違い" : `${topic}の比較ポイント`,
        objective: "保存される知識にする",
        detail: "5ページ",
        hook: "違いが分かると、選び方が変わります。",
      },
      {
        day: "Day 6",
        format: "Story",
        theme: "次に見たいテーマ",
        objective: "シリーズの方向を確認",
        detail: "投票",
        hook: "次はどちらを見たいですか？",
      },
      {
        day: "Day 7",
        format: "Reel",
        theme: tone.includes("ブランド") ? "ブランドの思想を短く見せる" : `植物を増やす前に、${topic}を見直す`,
        objective: "シリーズの世界観を定着させる",
        detail: "Reel",
        hook: "まず育てるべきは、植物だけではありません。",
      },
    ],
    recognition: {
      current: "1 / 6 投稿",
      phase: "テーマの発見",
      nextGoal: `あと2本で「${topic}シリーズ」の認知を作る`,
      priorityThemes: [
        topic.includes("土") ? "土が固くなる原因3つ" : `${topic}で失敗しやすい原因3つ`,
        topic.includes("土") ? "腐葉土・堆肥・培養土の違い" : `${topic}の比較投稿`,
        "2週間後のBefore / After",
      ],
    },
    conversationStarters: [
      `${topic}、試したことありますか？`,
      "庭や鉢で試している0円アイデアがあれば教えてください。",
      topic.includes("土")
        ? "次は“腐葉土・堆肥・培養土の違い”を見たいですか？"
        : `次は“${topic}の比較”を見たいですか？`,
    ],
    confidence: weakMaterial ? "Medium" : primaryFormat === "Reel" ? "Medium" : "High",
  };
}

function getBaselinePerformance({
  baselineReach,
  distributionPlan,
  simulation,
}: {
  baselineReach: string;
  distributionPlan: DistributionPlan;
  simulation: PostSimulation;
}) {
  const baseline = Math.max(100, Number.parseInt(baselineReach, 10) || 500);
  const formatMultiplier =
    distributionPlan.primaryFormat === "Reel"
      ? 1.45
      : distributionPlan.primaryFormat === "Story"
        ? 0.85
        : 1.22;
  const scoreMultiplier = simulation.total / 100;
  const lowReach = Math.round(baseline * formatMultiplier * (0.9 + scoreMultiplier * 0.25));
  const highReach = Math.round(baseline * formatMultiplier * (1.25 + scoreMultiplier * 0.35));
  const savesLow = Math.round(lowReach * (distributionPlan.primaryFormat === "Carousel Feed" ? 0.038 : 0.02));
  const savesHigh = Math.round(highReach * (distributionPlan.primaryFormat === "Carousel Feed" ? 0.055 : 0.032));
  const profileLow = Math.round(lowReach * 0.018);
  const profileHigh = Math.round(highReach * 0.034);
  const commentsLow = Math.max(2, Math.round(lowReach * 0.006));
  const commentsHigh = Math.max(5, Math.round(highReach * 0.014));
  const clicksLow = Math.max(2, Math.round(lowReach * 0.007));
  const clicksHigh = Math.max(4, Math.round(highReach * 0.018));

  return [
    { label: "推定リーチ", value: `${lowReach.toLocaleString()}〜${highReach.toLocaleString()}` },
    { label: "推定保存数", value: `${savesLow}〜${savesHigh}` },
    { label: "推定プロフィール遷移", value: `${profileLow}〜${profileHigh}` },
    { label: "推定コメント・返信", value: `${commentsLow}〜${commentsHigh}` },
    { label: "推定商品導線クリック", value: `${clicksLow}〜${clicksHigh}` },
    { label: "Confidence", value: distributionPlan.confidence },
  ];
}

function isEggshellTheme(topic: string, context: string) {
  const target = `${topic} ${context}`;
  return (
    target.includes("0円でできる土壌改良") ||
    target.includes("卵") ||
    target.includes("卵殻") ||
    target.includes("ゆで卵")
  );
}

function getFounderContext({
  audience,
  context,
  objective,
  topic,
}: {
  audience: string;
  context: string;
  objective: string;
  topic: string;
}): Array<[string, string]> {
  if (isEggshellTheme(topic, context)) {
    return [
      [
        "本当に伝えたいこと",
        "お金をかけなくても、日常の中に土づくりの入口があること。",
      ],
      [
        "読者に起こしたい行動",
        "ゆで卵の殻を捨てる前に、庭や鉢の土を見直してみること。",
      ],
      [
        "保存される理由",
        "無料・身近・すぐ試せる・家庭菜園に応用しやすい。",
      ],
      [
        "ブランドにとっての意味",
        "VERDNAが、難しい園芸知識を生活の中の小さな発見へ変換するブランドだと伝える。",
      ],
      [
        "AI解釈",
        "食卓から庭へ。捨てるものを循環へ変える、暮らし寄りの土づくり投稿です。",
      ],
    ];
  }

  return [
    [
      "本当に伝えたいこと",
      `${topic}を、難しい専門知識ではなく生活の中で試せる小さな入口として伝えること。`,
    ],
    [
      "読者に起こしたい行動",
      `${audience}が、保存してあとで見返し、自分の庭や暮らしで小さく試すこと。`,
    ],
    [
      "保存される理由",
      "手順・判断基準・失敗しにくい見方がまとまっていて、後で確認しやすいため。",
    ],
    [
      "ブランドにとっての意味",
      "VERDNAが、知識を押し付けずに暮らしの実践へ変換するブランドだと伝える。",
    ],
    [
      "AI解釈",
      `${objective}を主目的に、読者が行動へ移しやすい切り口へ整理する投稿です。`,
    ],
  ];
}

function getFounderCreativeAngles(
  topic: string,
  context: string,
): CreativeBriefResponse["creativeAngles"] {
  if (isEggshellTheme(topic, context)) {
    return [
      {
        name: "A. 食卓から庭へ",
        title: "捨てる前に、土へ。ゆで卵の殻で始める0円の土づくり",
        intent: "食卓の身近な素材から、庭や鉢の土を見直す入口を作る。",
        audience: "家庭菜園や庭づくりの初心者",
        saveReason: "無料・身近・すぐ試せる切り口で、あとで見返したくなる。",
        format: "Carousel",
        visualDirection: "食卓の卵殻、砕いた殻、鉢土の順で暮らしから庭へつなぐ。",
        seriesPotential: "土づくり・堆肥・培養土の比較へ展開しやすい。",
        firstSlideCopy: "捨てる前に、土へ。",
      },
      {
        name: "B. 肥料を買う前に",
        title: "肥料を買う前に。家にある“あれ”を土づくりのきっかけに",
        intent: "買う前に土を観察する習慣を提案し、無理のない実践へつなげる。",
        audience: "植物を元気にしたい初心者",
        saveReason: "買い足しより先にできる見直しとして保存されやすい。",
        format: "Reel / Carousel",
        visualDirection: "肥料売り場ではなく、台所と庭の対比を見せる。",
        seriesPotential: "水やり・土の硬さ・鉢のサイズ確認へ続けられる。",
        firstSlideCopy: "肥料の前に、見直すものがあります。",
      },
      {
        name: "C. 土を育てる習慣",
        title: "植物を増やす前に、まず土を育てる。0円から始める小さな習慣",
        intent: "植物を増やすことより、育ちやすい環境を整える思想を伝える。",
        audience: "庭や植物のある暮らしを整えたい人",
        saveReason: "ブランド思想と実践がつながり、シリーズとして記憶されやすい。",
        format: "Carousel Feed",
        visualDirection: "植物単体ではなく、手元・土・鉢・庭の余白を静かに見せる。",
        seriesPotential: "0円土づくりシリーズとして継続しやすい。",
        firstSlideCopy: "植物を増やす前に、土を育てる。",
      },
    ];
  }

  return [
    {
      name: "A. まず小さく試す",
      title: `${topic}を、今日から小さく試すための保存版ガイド`,
      intent: "難しそうに見えるテーマを、最初の一歩へ分解する。",
      audience: "初心者",
      saveReason: "手順として見返しやすい。",
      format: "Carousel",
      visualDirection: "Before / Afterと手元の写真で理解しやすく見せる。",
      seriesPotential: "基礎編、比較編、失敗回避編へ展開できる。",
      firstSlideCopy: "まずは、小さく試す。",
    },
    {
      name: "B. 買う前に見直す",
      title: `${topic}で買い足す前に、先に見直したい3つのこと`,
      intent: "商品導線の前に信頼を作る。",
      audience: "迷っている読者",
      saveReason: "チェックリストとして保存されやすい。",
      format: "Carousel Feed",
      visualDirection: "チェック項目を静かな資料風に見せる。",
      seriesPotential: "商品紹介や比較表へつなげやすい。",
      firstSlideCopy: "買う前に、見直す。",
    },
    {
      name: "C. 暮らしに変える",
      title: `${topic}を、暮らしの習慣に変える小さな考え方`,
      intent: "ブランドの世界観と実践をつなげる。",
      audience: "ライフスタイルに関心がある読者",
      saveReason: "考え方として共感されやすい。",
      format: "Photo post",
      visualDirection: "余白のある写真と短いコピーで上質に見せる。",
      seriesPotential: "ブランドストーリー投稿へ展開できる。",
      firstSlideCopy: "習慣に変える。",
    },
  ];
}

function createMockCreativeBrief({
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
}: {
  topic: string;
  context: string;
  objective: string;
  audience: string;
  tone: string;
  channel: string;
  postType: string;
  structure: string;
  asset: string;
  brand: string;
}): CreativeBriefResponse {
  const angles = getFounderCreativeAngles(topic, context);
  const selectedAngle =
    angles.find((angle) => angle.title === topic) ?? angles[0];
  const founderContext = getFounderContext({
    audience,
    context,
    objective,
    topic,
  });
  const isEggshell = isEggshellTheme(topic, context);
  const title = selectedAngle?.title ?? topic;
  const lead = isEggshell
    ? "食卓に並ぶゆで卵の殻。捨てる前に、庭や鉢の土を見直すきっかけにしてみませんか。"
    : `${topic}を、難しい知識ではなく今日から見直せる行動に変える投稿です。`;
  const body = isEggshell
    ? "卵殻は、土づくりを見直す身近な入口になります。大切なのは“これだけで必ず育つ”と考えることではなく、日常の素材をきっかけに、土の状態や植物が育ちやすい環境へ目を向けること。\n\nまずは殻をよく乾かし、細かくして、庭や鉢の土を観察する習慣と一緒に取り入れる。無料で始められるからこそ、植物との距離が少し近くなります。"
    : `${topic}は、読者が保存してあとで見返しやすいテーマです。結論、理由、手順、注意点を短く整理し、無理なく試せる行動へつなげます。`;

  return {
    mode: "mock",
    model: "local-founder-context-mock",
    demandHypothesis: {
      reasons: [
        "AI需要仮説として、低コストで始められる実践テーマは保存行動につながりやすい。",
        `${structure}形式にすることで、あとで見返す理由を作りやすい。`,
        `${tone}のトーンで、ブランドの信頼感と生活感を両立しやすい。`,
      ],
      audience,
      saveReason: isEggshell
        ? "無料・身近・すぐ試せる・家庭菜園に応用しやすい。"
        : "判断基準と手順がまとまり、後で確認しやすいため。",
      opportunityScore: isEggshell ? 88 : 82,
      disclaimer:
        "AI推定の投稿機会です。リアルタイムの検索・SNS実データではありません。",
    },
    founderContext: {
      coreMessage: founderContext[0]?.[1] ?? "",
      readerAction: founderContext[1]?.[1] ?? "",
      saveReason: founderContext[2]?.[1] ?? "",
      emotionalValue: "難しそうな知識を、暮らしの中の小さな発見へ変える安心感。",
      brandMeaning: founderContext[3]?.[1] ?? "",
      assumedContext: founderContext[4]?.[1] ?? "",
    },
    knowledgeConfidence: {
      easyToUse: [
        "土づくりを見直す身近な入口",
        "植物が育ちやすい環境を整える習慣のひとつ",
      ],
      conditional: [
        "土の状態や植物の種類により、必要な管理は変わります。",
        "卵殻は万能な肥料ではなく、土を観察するきっかけとして扱います。",
      ],
      needsVerification: [
        "成分効果を断定する表現",
        "すべての植物に同じ効果があるような表現",
      ],
      saferPhrases: [
        "土づくりを見直すきっかけ",
        "育ちやすい環境を整える習慣のひとつ",
      ],
    },
    creativeAngles: angles,
    concept: {
      summary: `${title}を、${audience}が保存して試せる${postType}企画にする。`,
      conclusion: isEggshell
        ? "お金をかけなくても、日常の中に土づくりの入口がある。"
        : `${topic}は、まず小さく見直すことで行動につながる。`,
      visualDirection: selectedAngle?.visualDirection ?? `${asset}を使い、静かな資料感で見せる。`,
      carouselPlan: [
        `1. ${selectedAngle?.firstSlideCopy ?? title}`,
        "2. なぜ今見直すのか",
        "3. すぐ試せる考え方",
        "4. 注意点と安全な表現",
        "5. 保存して次に試すCTA",
      ],
      reelHook: isEggshell
        ? "肥料を買う前に、今日の食卓を見てください。"
        : `${topic}で迷ったら、まずここを見てください。`,
      firstSlideCopy: selectedAngle?.firstSlideCopy ?? title,
      subtitle: "暮らしの中から始める小さな実践",
      reelCuts: [
        "0-3秒: 結論を見せる",
        "3-8秒: 身近な素材を見せる",
        "8-15秒: 行動を1つに絞る",
      ],
      telopIdeas: ["捨てる前に見直す", "0円で始める", "土を育てる習慣"],
    },
    titleOptions: [
      title,
      isEggshell
        ? "捨てる前に、庭へ。卵殻で始める土づくりの見直し"
        : `${topic}で最初に見るべき3つのポイント`,
      isEggshell
        ? "植物を増やす前に、まず土を育てる小さな習慣"
        : `${topic}を保存版で整理する`,
    ],
    leadOptions: [
      lead,
      isEggshell
        ? "お金をかける前に、暮らしの中にある素材から土を見直す。そんな小さな入口をまとめました。"
        : "難しく考えすぎず、まず保存して見返せる形に整理しました。",
      isEggshell
        ? "卵殻は万能ではありません。でも、土を観察する習慣を作るきっかけにはなります。"
        : "迷ったときに戻れる、最初の判断基準です。",
    ],
    finalPost: {
      title,
      lead,
      body,
      cta: "保存して、次に庭や鉢を見るときに見返してください。",
      hashtags: ["#VERDNA", "#土づくり", "#家庭菜園", "#庭のある暮らし", "#保存版"],
      productPath: `${brand}の土・鉢・ガーデングッズの比較導線へ自然につなげる。`,
      aioFaq: [
        "卵殻は土づくりにどう使えますか？",
        "土づくりで最初に見直すことは何ですか？",
        "家庭菜園初心者が始めやすい土の見直し方は？",
      ],
      instagramCaption: `${lead}\n\n${body}\n\n保存して、次の土づくりの参考にしてください。`,
      channelFormat: `${channel} / ${postType} / ${structure}`,
    },
    aiComment:
      "このテーマなら、効能を断定するよりも“暮らしの中で土を見直す入口”として見せる方が、保存・共感・ブランド文脈につながりやすいAI解釈です。",
  };
}

function OptionGrid<T extends string>({
  current,
  items,
  onSelect,
}: {
  current: T;
  items: readonly T[];
  onSelect: (value: T) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <StepButton
          active={current === item}
          key={item}
          onClick={() => onSelect(item)}
        >
          {item}
        </StepButton>
      ))}
    </div>
  );
}

function AssetSelection({
  asset,
  uploadedAsset,
  onAssetSelect,
  onPhotoSelect,
  onRemovePhoto,
}: {
  asset: (typeof assets)[number];
  uploadedAsset: UploadedAsset | null;
  onAssetSelect: (value: (typeof assets)[number]) => void;
  onPhotoSelect: (file: File | undefined) => void;
  onRemovePhoto: () => void;
}) {
  return (
    <div className="grid gap-5">
      <OptionGrid current={asset} items={assets} onSelect={onAssetSelect} />
      <div className="border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">写真アップロード</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              ブラウザ内のプレビューのみ。保存や外部アップロードは行いません。
            </p>
          </div>
          <label className="grid min-h-12 cursor-pointer place-items-center bg-white px-4 text-sm font-medium text-black">
            写真をアップロード
            <input
              accept="image/*"
              className="hidden"
              onChange={(event) => onPhotoSelect(event.target.files?.[0])}
              type="file"
            />
          </label>
        </div>
        <div className="overflow-hidden border border-white/20 bg-zinc-950 p-2">
          {uploadedAsset ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={uploadedAsset.name}
              className="aspect-[4/5] w-full object-cover"
              src={uploadedAsset.url}
            />
          ) : (
            <div className="grid aspect-[4/5] w-full place-items-center bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-300">No image selected</p>
                <p className="mt-2 text-xs text-zinc-500">Dark preview placeholder</p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">
            {uploadedAsset ? uploadedAsset.name : "画像未選択"}
          </p>
          {uploadedAsset ? (
            <PillButton onClick={onRemovePhoto}>画像を外す</PillButton>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CreativeBriefForm({
  context,
  contextAnalyzed,
  generationError,
  isGenerating,
  audience,
  objective,
  simulation,
  tone,
  topic,
  onAnalyzeContext,
  onContextChange,
  onFounderAngleAdopt,
  onBack,
  onGenerate,
  onAudienceChange,
  onObjectiveChange,
  onToneChange,
  onTopicChange,
}: {
  context: string;
  contextAnalyzed: boolean;
  generationError: string;
  isGenerating: boolean;
  audience: (typeof audiences)[number];
  objective: (typeof objectives)[number];
  simulation: PostSimulation;
  tone: (typeof tones)[number];
  topic: string;
  onAnalyzeContext: () => void;
  onBack: () => void;
  onContextChange: (value: string) => void;
  onFounderAngleAdopt: (
    angle: CreativeBriefResponse["creativeAngles"][number],
  ) => void;
  onGenerate: () => void;
  onAudienceChange: (value: (typeof audiences)[number]) => void;
  onObjectiveChange: (value: (typeof objectives)[number]) => void;
  onToneChange: (value: (typeof tones)[number]) => void;
  onTopicChange: (value: string) => void;
}) {
  const founderContext = getFounderContext({
    audience,
    context,
    objective,
    topic,
  });
  const creativeAngles = getFounderCreativeAngles(topic, context);

  return (
    <div>
      <p className="text-sm leading-6 text-zinc-400">
        投稿テーマと背景メモだけで、AIが投稿の意図と切り口を読み取ったように整理します。今回はAPIを使わない高品質mockです。
      </p>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm">
          投稿テーマ
          <input
            className="min-h-12 border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-white/30"
            onChange={(event) => onTopicChange(event.target.value)}
            placeholder="0円でできる土壌改良"
            value={topic}
          />
        </label>
        <label className="grid gap-2 text-sm">
          背景メモ / 会話メモ
          <textarea
            className="min-h-24 border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-white/30"
            onChange={(event) => onContextChange(event.target.value)}
            placeholder={`食卓に並ぶゆで卵の殻を捨てずに、家庭菜園や庭の土づくりに活かせることを伝えたい。
0円で始められる身近な素材として見せたい。
初心者が“これなら自分もできる”と思える投稿にしたい。`}
            value={context}
          />
        </label>
        <div>
          <p className="mb-2 text-sm">投稿目的</p>
          <OptionGrid
            current={objective}
            items={objectives}
            onSelect={onObjectiveChange}
          />
        </div>
        <div>
          <p className="mb-2 text-sm">読者</p>
          <OptionGrid
            current={audience}
            items={audiences}
            onSelect={onAudienceChange}
          />
        </div>
        <div>
          <p className="mb-2 text-sm">表現トーン</p>
          <OptionGrid current={tone} items={tones} onSelect={onToneChange} />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <PillButton onClick={onAnalyzeContext}>AIが投稿の背景を読む</PillButton>
        <PillButton tone="light" onClick={onGenerate}>
          {isGenerating ? "AIが投稿案を作成中…" : "AIに投稿案を作る"}
        </PillButton>
      </div>
      {contextAnalyzed ? (
        <div className="mt-5 grid gap-5">
          <div className="border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              AIが読み取った投稿の背景
            </p>
            <p className="mt-3 text-xs leading-5 text-zinc-500">
              Mock / AI解釈。科学・栽培に関する断定を避け、投稿の意図を整理しています。
            </p>
            <FounderContextPreview contextItems={founderContext} />
          </div>
          <CreativeAnglesStepCard
            angles={creativeAngles}
            selectedTitle={topic}
            onAdopt={onFounderAngleAdopt}
          />
        </div>
      ) : null}
      <PostSimulationPanel simulation={simulation} />
      {generationError ? (
        <p className="mt-4 border border-white/20 bg-white/5 p-4 text-sm text-zinc-100">
          {generationError}
        </p>
      ) : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <PillButton onClick={onBack}>戻る</PillButton>
        <PillButton tone="light" onClick={onGenerate}>
          {isGenerating ? "AIが投稿案を作成中…" : "AIに投稿案を作る"}
        </PillButton>
      </div>
    </div>
  );
}

function FounderContextPreview({
  contextItems,
}: {
  contextItems: Array<[string, string]>;
}) {
  return (
    <div className="mt-4 grid gap-3">
      {contextItems.map(([label, value]) => (
        <div
          className="border border-white/10 bg-black/30 p-4"
          key={label}
        >
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
        </div>
      ))}
    </div>
  );
}

function CreativeAnglesStepCard({
  angles,
  selectedTitle,
  onAdopt,
}: {
  angles: CreativeBriefResponse["creativeAngles"];
  selectedTitle: string;
  onAdopt: (angle: CreativeBriefResponse["creativeAngles"][number]) => void;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        Creative Angles
      </p>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        投稿の背景から、保存・理解・ブランド文脈につながる切り口を3案に整理します。
      </p>
      <div className="mt-4 grid gap-3">
        {angles.map((angle) => (
          <div
            className={`border p-4 ${
              selectedTitle === angle.title
                ? "border-white bg-white text-black"
                : "border-white/10 bg-black/30 text-zinc-200"
            }`}
            key={angle.name}
          >
            <p className={`text-xs ${selectedTitle === angle.title ? "text-zinc-600" : "text-zinc-500"}`}>
              {angle.name}
            </p>
            <h3 className="mt-2 text-lg font-semibold">{angle.title}</h3>
            <div className="mt-3 grid gap-2 text-sm leading-6">
              <p>狙い: {angle.intent}</p>
              <p>推奨形式: {angle.format}</p>
              <p>Visual Direction: {angle.visualDirection}</p>
            </div>
            <button
              className={`mt-4 min-h-12 w-full px-4 text-sm font-medium transition ${
                selectedTitle === angle.title
                  ? "bg-black text-white"
                  : "border border-white/10 bg-white text-black hover:bg-zinc-200"
              }`}
              onClick={() => onAdopt(angle)}
              type="button"
            >
              この案を採用
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostSimulationPanel({ simulation }: { simulation: PostSimulation }) {
  return (
    <div className="mt-5 grid gap-4">
      <div className="border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          AIが見るポイント
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            "タイトルの分かりやすさ",
            "画像とテーマの一致",
            "保存されやすさ",
            "コメントされやすさ",
            "商品導線の自然さ",
            "シリーズ化のしやすさ",
          ].map((item) => (
            <p
              className="border border-white/10 bg-black/30 p-3 text-xs text-zinc-400"
              key={item}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
      <div className="border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          AI Command Score
        </p>
        <div className="mt-3 flex items-end gap-2">
          <p className="text-5xl font-semibold">{simulation.total}</p>
          <p className="pb-2 text-sm text-zinc-500">/ 100</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-zinc-400">{simulation.message}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {simulation.scores.map((score) => (
            <MetricCard
              key={score.label}
              label={score.label}
              value={String(score.value)}
            />
          ))}
        </div>
      </div>
      <div className="border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          7日間のAI推定パフォーマンス
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {simulation.performance.map((item) => (
            <MetricCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-zinc-500">
          AI推定レンジ。実際の結果はアカウント状況、投稿時間、画像品質、フォロワー反応により変動します。
        </p>
      </div>
    </div>
  );
}

function PublishReviewCard({
  addedSeriesTitle,
  addedConversationStarter,
  asset,
  baselineReach,
  brief,
  channel,
  distributionPlan,
  editableBody,
  uploadedAsset,
  instagramConnected,
  isGenerating,
  postType,
  saved,
  selectedFirstCopy,
  selectedTitle,
  seriesOpportunities,
  simulation,
  structure,
  onAdjust,
  onAddSeries,
  onAngleAdopt,
  onBaselineReachChange,
  onBodyChange,
  onConversationStarterSelect,
  onRegenerate,
  onSave,
  onTitleSelect,
}: {
  addedSeriesTitle: string;
  addedConversationStarter: string;
  asset: string;
  baselineReach: string;
  brief: CreativeBriefResponse;
  channel: string;
  distributionPlan: DistributionPlan;
  editableBody: string;
  uploadedAsset: UploadedAsset | null;
  instagramConnected: boolean;
  isGenerating: boolean;
  postType: string;
  saved: boolean;
  selectedFirstCopy: string;
  selectedTitle: string;
  seriesOpportunities: SeriesOpportunity[];
  simulation: PostSimulation;
  structure: string;
  onAdjust: () => void;
  onAddSeries: (title: string) => void;
  onAngleAdopt: (angle: CreativeBriefResponse["creativeAngles"][number]) => void;
  onBaselineReachChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onConversationStarterSelect: (value: string) => void;
  onRegenerate: () => void;
  onSave: () => void;
  onTitleSelect: (value: string) => void;
}) {
  const statusMessage = instagramConnected
    ? "Instagram Draft Ready"
    : "Instagram未接続です。TOMOS内の下書きとして保存しました。";

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <GlassCard>
        <div className="mb-5 border-b border-white/10 pb-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            06 / POST SIMULATOR
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            このような投稿になります
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">
            プレビュー以外はモノクロ資料パネルとして整理しています。アップロード画像のみフルカラーで表示します。
          </p>
        </div>
        <PostPreview
          asset={asset}
          brand={brief.finalPost.hashtags[0]?.replace("#", "") ?? "TOMOS"}
          cta={brief.finalPost.cta}
          lead={brief.finalPost.lead}
          postType={postType}
          selectedFirstCopy={selectedFirstCopy}
          selectedTitle={selectedTitle}
          uploadedAsset={uploadedAsset}
        />

        <DistributionDirectorCard distributionPlan={distributionPlan} />

        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Publish Review
        </p>
        <h2 className="mt-3 text-3xl font-semibold">この内容を投稿しますか？</h2>

        <div className="mt-5 border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            AI Post Concept Preview
          </p>
          <div className="mt-4 grid gap-3">
            {[
              ["採用したタイトル", selectedTitle],
              ["1枚目コピー", selectedFirstCopy],
              ["小見出し", brief.concept.subtitle],
              ["Visual Direction", brief.concept.visualDirection],
              ["Instagram caption", brief.finalPost.instagramCaption],
              ["商品導線", brief.finalPost.productPath],
            ].map(([label, value]) => (
              <div
                className="border border-white/10 bg-black/30 p-4"
                key={label}
              >
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            {brief.concept.carouselPlan.slice(0, 5).map((item) => (
              <p className="text-xs leading-5 text-zinc-500" key={item}>
                {item}
              </p>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            {brief.concept.reelCuts.map((item) => (
              <p className="text-xs leading-5 text-zinc-400" key={item}>
                Reel: {item}
              </p>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            AIコメント: {brief.aiComment}
          </p>
        </div>

        <div className="mt-5 border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            AI需要仮説
          </p>
          <div className="mt-3 grid gap-2">
            {brief.demandHypothesis.reasons.map((reason) => (
              <p className="text-sm leading-6 text-zinc-300" key={reason}>
                {reason}
              </p>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <MetricCard label="想定読者" value={brief.demandHypothesis.audience} />
            <MetricCard
              label="投稿機会スコア"
              value={`${brief.demandHypothesis.opportunityScore} / AI推定`}
            />
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            保存されやすい理由: {brief.demandHypothesis.saveReason}
          </p>
          <p className="mt-4 text-xs leading-5 text-zinc-500">
            {brief.demandHypothesis.disclaimer}
          </p>
        </div>

        <div className="mt-4 border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            投稿イメージ
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-200">
            {brief.concept.summary}
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {brief.aiComment}
          </p>
          <div className="mt-4 grid gap-2">
            {brief.concept.carouselPlan.slice(0, 5).map((item) => (
              <p className="text-xs leading-5 text-zinc-500" key={item}>
                {item}
              </p>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            Reel hook: {brief.concept.reelHook}
          </p>
        </div>

        <KnowledgeConfidenceCard brief={brief} />

        <CreativeAnglesCard
          angles={brief.creativeAngles}
          selectedTitle={selectedTitle}
          onAdopt={onAngleAdopt}
        />

        <div className="mt-4">
          <p className="mb-3 text-sm text-zinc-400">タイトル候補</p>
          <div className="grid gap-2">
            {brief.titleOptions.map((title) => (
              <button
                className={`min-h-12 rounded-2xl border px-4 text-left text-sm transition ${
                  selectedTitle === title
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/10"
                }`}
                key={title}
                onClick={() => onTitleSelect(title)}
                type="button"
              >
                {title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs text-zinc-500">採用タイトル</p>
          <p className="mt-2 text-lg font-semibold text-white">{selectedTitle}</p>
          <p className="mt-4 text-xs text-zinc-500">リード文候補</p>
          <div className="mt-2 grid gap-2">
            {brief.leadOptions.slice(0, 3).map((lead) => (
              <p className="border border-white/10 bg-black/30 p-3 text-xs leading-5 text-zinc-400" key={lead}>
                {lead}
              </p>
            ))}
          </div>
          <p className="mb-3 text-sm text-zinc-400">投稿本文</p>
          <textarea
            className="min-h-52 w-full border border-white/10 bg-black/40 p-4 text-sm leading-7 text-zinc-100 outline-none focus:border-white/30"
            onChange={(event) => onBodyChange(event.target.value)}
            value={editableBody}
          />
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            {brief.finalPost.hashtags.join(" ")}
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-300">
            {brief.finalPost.cta}
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            商品導線: {brief.finalPost.productPath}
          </p>
          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-zinc-500">
            Instagram caption: {brief.finalPost.instagramCaption}
          </p>
        </div>

        {saved ? (
          <p className="mt-4 border border-white/20 bg-white/10 p-4 text-sm text-zinc-100">
            {statusMessage}
          </p>
        ) : null}
      </GlassCard>

      <GlassCard>
        <div className="grid gap-3 md:hidden">
          <MetricCard
            label="最優先フォーマット"
            value={distributionPlan.primaryFormat}
          />
          <MetricCard
            label="推奨配信順"
            value={distributionPlan.order.join(" → ")}
          />
          <MetricCard
            label="7日間の最初のアクション"
            value={`${distributionPlan.rollout[0]?.day} / ${distributionPlan.rollout[0]?.format}`}
          />
          <MetricCard
            label="Topic Recognition"
            value={distributionPlan.recognition.current}
          />
        </div>

        <div className="grid gap-3">
          {[
            ["投稿先", channel],
            ["形式", postType],
            ["構成", structure],
            ["使用素材", asset],
            ["投稿形式", brief.finalPost.channelFormat],
            ["公開状態", "Draft only / 実投稿なし"],
          ].map(([label, value]) => (
            <div
              className="border border-white/10 bg-white/[0.04] p-4"
              key={label}
            >
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            AI推定パフォーマンス
          </p>
          <label className="mt-4 grid gap-2 text-sm">
            通常投稿の平均リーチ
            <input
              className="min-h-12 border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-white/30"
              inputMode="numeric"
              onChange={(event) => onBaselineReachChange(event.target.value)}
              value={baselineReach}
            />
          </label>
          <p className="mt-2 text-xs text-zinc-500">
            Instagram未接続時は仮想ベースライン 500 を初期表示。
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="AI Command" value={`${simulation.total} / 100`} />
            <MetricCard
              label="最優先形式"
              value={distributionPlan.primaryFormat}
            />
            {getBaselinePerformance({
              baselineReach,
              distributionPlan,
              simulation,
            }).map((item) => (
              <MetricCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500">
            AI推定レンジ。実際の結果は、アカウント状況、投稿時間、画像品質、フォロワー反応、外部要因により変動します。
          </p>
        </div>

        <RolloutAndRecognitionCard distributionPlan={distributionPlan} />

        <ConversationStarterCard
          addedConversationStarter={addedConversationStarter}
          starters={distributionPlan.conversationStarters}
          onSelect={onConversationStarterSelect}
        />

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            AIO FAQ
          </p>
          <div className="mt-3 grid gap-2">
            {brief.finalPost.aioFaq.slice(0, 3).map((faq) => (
              <p className="text-xs leading-5 text-zinc-400" key={faq}>
                {faq}
              </p>
            ))}
          </div>
        </div>

        <SeriesOpportunityPanel
          addedSeriesTitle={addedSeriesTitle}
          opportunities={seriesOpportunities}
          onAdd={onAddSeries}
        />

        <div className="mt-5 grid gap-2">
          <PillButton tone="light" onClick={onSave}>
            Instagramへ下書き保存
          </PillButton>
          <PillButton onClick={onRegenerate}>
            {isGenerating ? "AIが別案を作成中…" : "別案を生成"}
          </PillButton>
          <PillButton onClick={onAdjust}>構成を調整</PillButton>
        </div>
      </GlassCard>
    </div>
  );
}

function PostPreview({
  asset,
  brand,
  cta,
  lead,
  postType,
  selectedFirstCopy,
  selectedTitle,
  uploadedAsset,
}: {
  asset: string;
  brand: string;
  cta: string;
  lead: string;
  postType: string;
  selectedFirstCopy: string;
  selectedTitle: string;
  uploadedAsset: UploadedAsset | null;
}) {
  const isReel = postType === "Reel";
  const isCarousel = postType === "Carousel";

  return (
    <div className="mb-5 overflow-hidden border border-white/20 bg-black/70">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <p className="text-sm font-semibold">{brand}</p>
          <p className="text-xs text-zinc-500">Instagram Preview / {postType}</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
          {isCarousel ? "1 / 5" : isReel ? "Reel Preview" : "Photo"}
        </span>
      </div>
      <div className="relative bg-zinc-950 p-2">
        {uploadedAsset ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={uploadedAsset.name}
            className="aspect-square w-full border border-white/15 object-cover"
            src={uploadedAsset.url}
          />
        ) : (
          <div className="grid aspect-square w-full place-items-center border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015))]">
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-300">{asset}</p>
              <p className="mt-2 text-xs text-zinc-500">Preview placeholder</p>
            </div>
          </div>
        )}
        {isReel ? (
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid size-16 place-items-center border border-white/20 bg-black/65 text-2xl text-white">
              ▶
            </div>
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-3 text-lg">
            <span>♡</span>
            <span>□</span>
            <span>↗</span>
          </div>
          <span className="text-xl">▱</span>
        </div>
        <p className="text-sm font-semibold">{selectedTitle}</p>
        <p className="mt-2 text-base font-semibold text-white">{selectedFirstCopy}</p>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{lead}</p>
        <p className="mt-3 text-xs text-zinc-500">
          ハッシュタグ 5件 / CTA: {cta}
        </p>
      </div>
    </div>
  );
}

function DistributionDirectorCard({
  distributionPlan,
}: {
  distributionPlan: DistributionPlan;
}) {
  return (
    <div className="mb-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        AI Distribution Director
      </p>
      <h3 className="mt-2 text-2xl font-semibold">AI運用仮説</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        投稿の目的・読者・素材・構成から、AIが今回の配信順とシリーズ戦略を提案します。
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricCard
          label="今回の最優先フォーマット"
          value={distributionPlan.primaryFormat}
        />
        <MetricCard
          label="推奨配信順"
          value={distributionPlan.order.join(" → ")}
        />
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <p className="text-xs text-zinc-500">なぜこの順番か</p>
        <p className="mt-2 text-sm leading-6 text-zinc-300">
          {distributionPlan.reason}
        </p>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {distributionPlan.expectedActions.map((item) => (
          <div
            className="rounded-2xl border border-white/10 bg-black/30 p-4"
            key={item.format}
          >
            <p className="text-sm font-medium">{item.format}</p>
            <p className="mt-2 text-xs leading-5 text-zinc-500">{item.action}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-5 text-zinc-500">
        注意点: {distributionPlan.caution}
      </p>
    </div>
  );
}

function RolloutAndRecognitionCard({
  distributionPlan,
}: {
  distributionPlan: DistributionPlan;
}) {
  return (
    <div className="mt-5 grid gap-4">
      <details className="rounded-3xl border border-white/10 bg-white/[0.04] p-5" open>
        <summary className="cursor-pointer text-sm font-semibold">
          7-Day Content Rollout
        </summary>
        <div className="mt-4 grid gap-3">
          {distributionPlan.rollout.map((item) => (
            <div
              className="rounded-2xl border border-white/10 bg-black/30 p-4"
              key={`${item.day}-${item.theme}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">{item.day}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                  {item.format}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-200">{item.theme}</p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                目的: {item.objective} / 形式: {item.detail}
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-400">
                冒頭3秒: {item.hook}
              </p>
            </div>
          ))}
        </div>
      </details>

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Topic Recognition Plan
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <MetricCard
            label="現在のシリーズ進行数"
            value={distributionPlan.recognition.current}
          />
          <MetricCard
            label="認知フェーズ"
            value={distributionPlan.recognition.phase}
          />
        </div>
        <p className="mt-4 text-sm leading-6 text-zinc-300">
          {distributionPlan.recognition.nextGoal}
        </p>
        <div className="mt-3 grid gap-2">
          {distributionPlan.recognition.priorityThemes.map((theme) => (
            <p
              className="rounded-2xl border border-white/10 bg-black/30 p-3 text-xs leading-5 text-zinc-400"
              key={theme}
            >
              {theme}
            </p>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-zinc-500">
          投稿本数はAI運用仮説です。実際の認知・リーチは、アカウント状況、投稿品質、投稿時間、反応などにより変動します。
        </p>
      </div>
    </div>
  );
}

function ConversationStarterCard({
  addedConversationStarter,
  starters,
  onSelect,
}: {
  addedConversationStarter: string;
  starters: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <details className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <summary className="cursor-pointer text-sm font-semibold">
        Conversation Starter
      </summary>
      <div className="mt-4 grid gap-3">
        {starters.map((starter) => (
          <div
            className="rounded-2xl border border-white/10 bg-black/30 p-4"
            key={starter}
          >
            <p className="text-sm leading-6 text-zinc-300">{starter}</p>
            <button
              className="mt-3 min-h-11 w-full rounded-full border border-white/10 px-4 text-sm text-zinc-200 transition hover:bg-white/10"
              onClick={() => onSelect(starter)}
              type="button"
            >
              投稿文に追加
            </button>
          </div>
        ))}
      </div>
      {addedConversationStarter ? (
        <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
          投稿文に追加しました: {addedConversationStarter}
        </p>
      ) : null}
    </details>
  );
}

function KnowledgeConfidenceCard({
  brief,
}: {
  brief: CreativeBriefResponse;
}) {
  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        Knowledge Confidence
      </p>
      <p className="mt-3 text-xs leading-5 text-zinc-500">
        AI解釈。栽培・科学・植物生理に関する断定は避け、必要に応じて確認してください。
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ConfidenceColumn
          items={brief.knowledgeConfidence.easyToUse}
          title="そのまま使いやすい表現"
        />
        <ConfidenceColumn
          items={brief.knowledgeConfidence.conditional}
          title="条件付きで表現"
        />
        <ConfidenceColumn
          items={brief.knowledgeConfidence.needsVerification}
          title="根拠確認が必要"
        />
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
        <p className="text-xs text-zinc-500">安全な言い換え案</p>
        <div className="mt-2 grid gap-2">
          {brief.knowledgeConfidence.saferPhrases.map((phrase) => (
            <p className="text-sm leading-6 text-zinc-300" key={phrase}>
              {phrase}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfidenceColumn({
  items,
  title,
}: {
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-zinc-500">{title}</p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <p className="text-xs leading-5 text-zinc-300" key={item}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

function CreativeAnglesCard({
  angles,
  selectedTitle,
  onAdopt,
}: {
  angles: CreativeBriefResponse["creativeAngles"];
  selectedTitle: string;
  onAdopt: (angle: CreativeBriefResponse["creativeAngles"][number]) => void;
}) {
  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        Creative Angles
      </p>
      <div className="mt-4 grid gap-3">
        {angles.map((angle) => (
          <div
            className="rounded-2xl border border-white/10 bg-black/30 p-4"
            key={angle.name}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold">{angle.name}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {angle.title}
                </p>
              </div>
              <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                {angle.format}
              </span>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                ["狙い", angle.intent],
                ["想定読者", angle.audience],
                ["保存される理由", angle.saveReason],
                ["Visual Direction", angle.visualDirection],
                ["Series Potential", angle.seriesPotential],
              ].map(([label, value]) => (
                <div
                  className="rounded-2xl border border-white/10 bg-white/[0.035] p-3"
                  key={label}
                >
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-300">{value}</p>
                </div>
              ))}
            </div>
            <button
              className={`mt-4 min-h-11 w-full rounded-full border px-4 text-sm transition ${
                selectedTitle === angle.title
                  ? "border-white bg-white text-black"
                  : "border-white/10 text-zinc-200 hover:bg-white/10"
              }`}
              onClick={() => onAdopt(angle)}
              type="button"
            >
              この案を採用
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SeriesOpportunityPanel({
  addedSeriesTitle,
  opportunities,
  onAdd,
}: {
  addedSeriesTitle: string;
  opportunities: SeriesOpportunity[];
  onAdd: (title: string) => void;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
        Next Actions — Series Opportunity
      </p>
      <p className="mt-3 text-sm leading-6 text-zinc-400">
        この投稿を起点に、同じ悩みを持つ人へ連続して届ける次の3投稿です。
      </p>
      <div className="mt-4 grid gap-3">
        {opportunities.map((item) => (
          <div
            className="rounded-2xl border border-white/10 bg-black/30 p-4"
            key={item.title}
          >
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="mt-2 text-xs leading-5 text-zinc-500">
              {item.format} / 狙い: {item.intent}
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Series Score {item.score}
            </p>
            <button
              className="mt-3 min-h-11 w-full rounded-full border border-white/10 px-4 text-sm text-zinc-200 transition hover:bg-white/10"
              onClick={() => onAdd(item.title)}
              type="button"
            >
              次の投稿候補に追加
            </button>
          </div>
        ))}
      </div>
      {addedSeriesTitle ? (
        <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
          {addedSeriesTitle} を次の投稿候補に追加しました
        </p>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{value}</p>
    </div>
  );
}
