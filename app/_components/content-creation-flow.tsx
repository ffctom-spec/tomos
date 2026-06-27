"use client";

import { useEffect, useMemo, useState } from "react";
import { generateCreativeBrief } from "@/app/_lib/api-client";
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

const channels = ["Instagram", "YouTube", "Threads"] as const;
const postTypes = ["Carousel", "Reel", "Photo post"] as const;
const structures = ["保存版ガイド", "Before / After", "3つのポイント", "FAQ型"] as const;
const assets = ["AI推奨アセット", "ブランド写真 01", "商品・施工写真 02", "後で選ぶ"] as const;
const objectives = ["保存を増やす", "認知を広げる", "商品導線をつくる", "問い合わせを増やす"] as const;
const tones = ["専門的で信頼感", "親しみやすい", "高級感・ブランド感", "カリフォルニアモダン"] as const;

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
      className={`min-h-14 rounded-2xl border px-4 text-left text-sm font-medium transition ${
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
  onPhotoAssetSelected,
  onPostSimulationGenerated,
  onSeriesOpportunityAdded,
}: {
  approval?: ApprovalItem;
  instagramConnected?: boolean;
  onBack?: () => void;
  onCreativeBriefGenerated?: () => void;
  onDraftSaved?: () => void;
  onPhotoAssetSelected?: (fileName: string) => void;
  onPostSimulationGenerated?: () => void;
  onSeriesOpportunityAdded?: (title: string) => void;
}) {
  const [step, setStep] = useState<FlowStep>(1);
  const [channel, setChannel] = useState<(typeof channels)[number]>("Instagram");
  const [postType, setPostType] = useState<(typeof postTypes)[number]>("Carousel");
  const [structure, setStructure] = useState<(typeof structures)[number]>("保存版ガイド");
  const [asset, setAsset] = useState<(typeof assets)[number]>("AI推奨アセット");
  const [topic, setTopic] = useState(approval.title);
  const [context, setContext] = useState("");
  const [objective, setObjective] = useState<(typeof objectives)[number]>("保存を増やす");
  const [tone, setTone] = useState<(typeof tones)[number]>("専門的で信頼感");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [creativeBrief, setCreativeBrief] =
    useState<CreativeBriefResponse | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [editableBody, setEditableBody] = useState("");
  const [saved, setSaved] = useState(false);
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(null);
  const [addedSeriesTitle, setAddedSeriesTitle] = useState("");
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

  const stepLabel = useMemo(() => {
    const labels: Record<FlowStep, string> = {
      1: "Channel",
      2: "Post type",
      3: "Structure",
      4: "Asset",
      5: "AI Creative Brief",
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
      const result = await generateCreativeBrief({
        topic,
        context,
        objective,
        tone,
        channel,
        postType,
        structure,
        asset,
        brand: approval.brand,
      });
      setCreativeBrief(result);
      setSelectedTitle(result.finalPost.title);
      setEditableBody(result.finalPost.body);
      setStep(6);
      onCreativeBriefGenerated?.();
      onPostSimulationGenerated?.();
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
    setEditableBody(
      `${nextLead}\n\n${creativeBrief.finalPost.body}\n\n別案ポイント: ${structure}として、1枚目で結論をより短く見せる構成です。`,
    );
  }

  function addSeriesOpportunity(title: string) {
    setAddedSeriesTitle(title);
    onSeriesOpportunityAdded?.(title);
  }

  return (
    <ViewFrame
      detail="承認後の投稿作成を、選択式だけでDraft生成まで進めます。実投稿は行いません。"
      onBack={goPrevious}
      title="Content Creation Flow"
    >
      <div className="mb-5 grid grid-cols-6 gap-2">
        {([1, 2, 3, 4, 5, 6] as FlowStep[]).map((item) => (
          <div
            className={`h-2 rounded-full ${
              item <= step ? "bg-white" : "bg-white/10"
            }`}
            key={item}
          />
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Step {step} / 6
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{stepLabel}</h2>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
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
                objective={objective}
                simulation={simulation}
                tone={tone}
                topic={topic}
                onBack={goPrevious}
                onContextChange={setContext}
                onGenerate={generateBrief}
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
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
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
            selectedTitle={selectedTitle}
            seriesOpportunities={getSeriesOpportunities(topic, structure)}
            simulation={simulation}
            structure={structure}
            onAdjust={() => setStep(5)}
            onAddSeries={addSeriesOpportunity}
            onBodyChange={setEditableBody}
            onRegenerate={generateLocalVariant}
            onSave={saveDraft}
            onTitleSelect={setSelectedTitle}
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
  const ctaStrength = 78 + (structure === "保存版ガイド" ? 5 : 0);
  const seriesPotential = 82 + (structure === "Before / After" ? 6 : 0);
  const total = Math.round(
    (topicFit + visualFit + savePotential + ctaStrength + seriesPotential) / 5,
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
      { label: "CTA Strength", value: ctaStrength },
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
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">写真アップロード</p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              ブラウザ内のプレビューのみ。保存や外部アップロードは行いません。
            </p>
          </div>
          <label className="grid min-h-12 cursor-pointer place-items-center rounded-full bg-white px-4 text-sm font-medium text-black">
            写真をアップロード
            <input
              accept="image/*"
              className="hidden"
              onChange={(event) => onPhotoSelect(event.target.files?.[0])}
              type="file"
            />
          </label>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900">
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
  generationError,
  isGenerating,
  objective,
  simulation,
  tone,
  topic,
  onContextChange,
  onBack,
  onGenerate,
  onObjectiveChange,
  onToneChange,
  onTopicChange,
}: {
  context: string;
  generationError: string;
  isGenerating: boolean;
  objective: (typeof objectives)[number];
  simulation: PostSimulation;
  tone: (typeof tones)[number];
  topic: string;
  onBack: () => void;
  onContextChange: (value: string) => void;
  onGenerate: () => void;
  onObjectiveChange: (value: (typeof objectives)[number]) => void;
  onToneChange: (value: (typeof tones)[number]) => void;
  onTopicChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm leading-6 text-zinc-400">
        テーマを短く入力するだけで、AIが投稿企画・需要仮説・投稿例まで作成します。
      </p>
      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          AI投稿の狙い
        </p>
        <p className="mt-3 text-sm leading-6 text-zinc-300">
          “0円でできる”のような低ハードルな切り口で、初心者の保存行動と次の実践を狙う投稿です。
        </p>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm">
          投稿テーマ / タイトル
          <input
            className="min-h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-white outline-none focus:border-white/30"
            onChange={(event) => onTopicChange(event.target.value)}
            placeholder="0円でできる土壌改良"
            value={topic}
          />
        </label>
        <label className="grid gap-2 text-sm">
          補足コンテキスト
          <textarea
            className="min-h-24 rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-white/30"
            onChange={(event) => onContextChange(event.target.value)}
            placeholder="初心者向け、梅雨前、家庭菜園で使える内容"
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
          <p className="mb-2 text-sm">トーン</p>
          <OptionGrid current={tone} items={tones} onSelect={onToneChange} />
        </div>
      </div>
      <PostSimulationPanel simulation={simulation} />
      {generationError ? (
        <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
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

function PostSimulationPanel({ simulation }: { simulation: PostSimulation }) {
  return (
    <div className="mt-5 grid gap-4">
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
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
              className="rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-zinc-400"
              key={item}
            >
              {item}
            </p>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
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
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
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
  asset,
  brief,
  channel,
  editableBody,
  uploadedAsset,
  instagramConnected,
  isGenerating,
  postType,
  saved,
  selectedTitle,
  seriesOpportunities,
  simulation,
  structure,
  onAdjust,
  onAddSeries,
  onBodyChange,
  onRegenerate,
  onSave,
  onTitleSelect,
}: {
  addedSeriesTitle: string;
  asset: string;
  brief: CreativeBriefResponse;
  channel: string;
  editableBody: string;
  uploadedAsset: UploadedAsset | null;
  instagramConnected: boolean;
  isGenerating: boolean;
  postType: string;
  saved: boolean;
  selectedTitle: string;
  seriesOpportunities: SeriesOpportunity[];
  simulation: PostSimulation;
  structure: string;
  onAdjust: () => void;
  onAddSeries: (title: string) => void;
  onBodyChange: (value: string) => void;
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
        <PostPreview
          asset={asset}
          brand={brief.finalPost.hashtags[0]?.replace("#", "") ?? "TOMOS"}
          cta={brief.finalPost.cta}
          lead={brief.finalPost.lead}
          postType={postType}
          selectedTitle={selectedTitle}
          uploadedAsset={uploadedAsset}
        />

        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Publish Review
        </p>
        <h2 className="mt-3 text-3xl font-semibold">この内容を投稿しますか？</h2>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
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

        <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
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

        <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs text-zinc-500">採用タイトル</p>
          <p className="mt-2 text-lg font-semibold text-white">{selectedTitle}</p>
          <p className="mt-4 text-xs text-zinc-500">リード文候補</p>
          <div className="mt-2 grid gap-2">
            {brief.leadOptions.slice(0, 3).map((lead) => (
              <p className="rounded-2xl border border-white/10 bg-black/30 p-3 text-xs leading-5 text-zinc-400" key={lead}>
                {lead}
              </p>
            ))}
          </div>
          <p className="mb-3 text-sm text-zinc-400">投稿本文</p>
          <textarea
            className="min-h-52 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-7 text-zinc-100 outline-none focus:border-white/30"
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
          <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
            {statusMessage}
          </p>
        ) : null}
      </GlassCard>

      <GlassCard>
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
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              key={label}
            >
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-200">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Post Simulator
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MetricCard label="AI Command" value={`${simulation.total} / 100`} />
            <MetricCard
              label="保存見込み"
              value={
                simulation.scores.find((score) => score.label === "Save Potential")
                  ?.value.toString() ?? "0"
              }
            />
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500">
            AI推定レンジ。実データやリアルタイム予測ではありません。
          </p>
        </div>

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
  selectedTitle,
  uploadedAsset,
}: {
  asset: string;
  brand: string;
  cta: string;
  lead: string;
  postType: string;
  selectedTitle: string;
  uploadedAsset: UploadedAsset | null;
}) {
  const isReel = postType === "Reel";
  const isCarousel = postType === "Carousel";

  return (
    <div className="mb-5 overflow-hidden rounded-[2rem] border border-white/10 bg-black/50">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <p className="text-sm font-semibold">{brand}</p>
          <p className="text-xs text-zinc-500">Instagram Preview / {postType}</p>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
          {isCarousel ? "1 / 5" : isReel ? "Reel Preview" : "Photo"}
        </span>
      </div>
      <div className="relative bg-zinc-900">
        {uploadedAsset ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={uploadedAsset.name}
            className="aspect-square w-full object-cover"
            src={uploadedAsset.url}
          />
        ) : (
          <div className="grid aspect-square w-full place-items-center bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015))]">
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-300">{asset}</p>
              <p className="mt-2 text-xs text-zinc-500">Preview placeholder</p>
            </div>
          </div>
        )}
        {isReel ? (
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid size-16 place-items-center rounded-full bg-black/55 text-2xl text-white">
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
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{lead}</p>
        <p className="mt-3 text-xs text-zinc-500">
          ハッシュタグ 5件 / CTA: {cta}
        </p>
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
