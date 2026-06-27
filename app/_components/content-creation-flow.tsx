"use client";

import { useMemo, useState } from "react";
import { generateCreativeBrief } from "@/app/_lib/api-client";
import type {
  ApprovalItem,
  CreativeBriefResponse,
} from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6;

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
}: {
  approval?: ApprovalItem;
  instagramConnected?: boolean;
  onBack?: () => void;
  onCreativeBriefGenerated?: () => void;
  onDraftSaved?: () => void;
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
              <OptionGrid
                current={asset}
                items={assets}
                onSelect={(value) => selectAndContinue(value, setAsset)}
              />
            ) : null}
            {step === 5 ? (
              <CreativeBriefForm
                context={context}
                generationError={generationError}
                isGenerating={isGenerating}
                objective={objective}
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
          brief={creativeBrief}
          channel={channel}
          editableBody={editableBody}
          instagramConnected={instagramConnected}
          isGenerating={isGenerating}
          postType={postType}
          saved={saved}
          selectedTitle={selectedTitle}
          structure={structure}
          onAdjust={() => setStep(5)}
          onBodyChange={setEditableBody}
          onRegenerate={generateBrief}
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

function CreativeBriefForm({
  context,
  generationError,
  isGenerating,
  objective,
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

function PublishReviewCard({
  asset,
  brief,
  channel,
  editableBody,
  instagramConnected,
  isGenerating,
  postType,
  saved,
  selectedTitle,
  structure,
  onAdjust,
  onBodyChange,
  onRegenerate,
  onSave,
  onTitleSelect,
}: {
  asset: string;
  brief: CreativeBriefResponse;
  channel: string;
  editableBody: string;
  instagramConnected: boolean;
  isGenerating: boolean;
  postType: string;
  saved: boolean;
  selectedTitle: string;
  structure: string;
  onAdjust: () => void;
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

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-200">{value}</p>
    </div>
  );
}
