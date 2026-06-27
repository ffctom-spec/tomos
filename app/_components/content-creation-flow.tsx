"use client";

import { useMemo, useState } from "react";
import type { ApprovalItem } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

type FlowStep = 1 | 2 | 3 | 4 | 5 | 6;

type Draft = {
  caption: string;
  hashtags: string[];
  cta: string;
};

const channels = ["Instagram", "YouTube", "Threads"] as const;
const postTypes = ["Carousel", "Reel", "Photo post"] as const;
const structures = ["保存版ガイド", "Before / After", "3つのポイント", "FAQ型"] as const;
const assets = ["AI推奨アセット", "ブランド写真 01", "商品・施工写真 02", "後で選ぶ"] as const;

const fallbackApproval: ApprovalItem = {
  id: "demo-approval",
  type: "Instagramリード文",
  title: "0円でできる土壌改良",
  brand: "VERDNA",
  reason: "保存率改善のため冒頭に結論と保存理由を追加。",
  status: "Pending",
};

function buildDraft({
  approval,
  structure,
}: {
  approval: ApprovalItem;
  structure: string;
}): Draft {
  return {
    caption: `${approval.title}\n\n${approval.reason}\n\n今回は${approval.brand}の視点で、${structure}として保存しやすく整理しました。まず結論、次に理由、最後に実践ポイントを確認してください。`,
    hashtags: [`#${approval.brand}`, "#TOMOS", "#保存版", "#AI下書き"],
    cta: "保存して、次の投稿準備や商品導線の確認に使ってください。",
  };
}

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
  onBack,
  onDraftSaved,
}: {
  approval?: ApprovalItem;
  onBack?: () => void;
  onDraftSaved?: () => void;
}) {
  const [step, setStep] = useState<FlowStep>(1);
  const [channel, setChannel] = useState<(typeof channels)[number]>("Instagram");
  const [postType, setPostType] = useState<(typeof postTypes)[number]>("Carousel");
  const [structure, setStructure] = useState<(typeof structures)[number]>("保存版ガイド");
  const [asset, setAsset] = useState<(typeof assets)[number]>("AI推奨アセット");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saved, setSaved] = useState(false);

  const stepLabel = useMemo(() => {
    const labels: Record<FlowStep, string> = {
      1: "Channel",
      2: "Post type",
      3: "Structure",
      4: "Asset",
      5: "Generate",
      6: "Publish Review",
    };

    return labels[step];
  }, [step]);

  function goNext() {
    setStep((current) => Math.min(current + 1, 6) as FlowStep);
  }

  function goPrevious() {
    if (step === 1) {
      onBack?.();
      return;
    }
    setStep((current) => Math.max(current - 1, 1) as FlowStep);
  }

  function generateDraft() {
    setIsGenerating(true);
    window.setTimeout(() => {
      setDraft(buildDraft({ approval, structure }));
      setIsGenerating(false);
      setStep(6);
    }, 650);
  }

  function saveDraft() {
    setSaved(true);
    onDraftSaved?.();
  }

  return (
    <ViewFrame
      detail="承認後の投稿作成を、選択式だけでDraft生成まで進めるPhase 1 UI。実投稿は行いません。"
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
                onSelect={(value) => setChannel(value)}
              />
            ) : null}
            {step === 2 ? (
              <OptionGrid
                current={postType}
                items={postTypes}
                onSelect={(value) => setPostType(value)}
              />
            ) : null}
            {step === 3 ? (
              <OptionGrid
                current={structure}
                items={structures}
                onSelect={(value) => setStructure(value)}
              />
            ) : null}
            {step === 4 ? (
              <OptionGrid
                current={asset}
                items={assets}
                onSelect={(value) => setAsset(value)}
              />
            ) : null}
            {step === 5 ? (
              <div>
                <p className="text-sm leading-6 text-zinc-400">
                  選択内容を確認して、ローカル固定テンプレートで下書きを生成します。
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
              </div>
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
          </GlassCard>
        </div>
      ) : (
        <PublishReviewCard
          asset={asset}
          channel={channel}
          draft={draft ?? buildDraft({ approval, structure })}
          postType={postType}
          saved={saved}
          structure={structure}
          onAdjust={() => setStep(3)}
          onSave={saveDraft}
        />
      )}

      {step < 6 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <PillButton onClick={goPrevious}>戻る</PillButton>
          {step === 5 ? (
            <PillButton tone="light" onClick={generateDraft}>
              {isGenerating ? "AIが下書き作成中…" : "下書きを生成"}
            </PillButton>
          ) : (
            <PillButton tone="light" onClick={goNext}>
              次へ
            </PillButton>
          )}
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

function PublishReviewCard({
  asset,
  channel,
  draft,
  postType,
  saved,
  structure,
  onAdjust,
  onSave,
}: {
  asset: string;
  channel: string;
  draft: Draft;
  postType: string;
  saved: boolean;
  structure: string;
  onAdjust: () => void;
  onSave: () => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <GlassCard>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          Publish Review
        </p>
        <h2 className="mt-3 text-3xl font-semibold">この内容を投稿しますか？</h2>
        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-zinc-200">
            {draft.caption}
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            {draft.hashtags.join(" ")}
          </p>
          <p className="mt-4 text-sm leading-6 text-zinc-300">{draft.cta}</p>
        </div>
        {saved ? (
          <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
            Instagram下書きに保存済み
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
            ["公開状態", "Draft only / 実投稿なし"],
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
        <div className="mt-5 grid gap-2">
          <PillButton tone="light" onClick={onSave}>
            Instagramへ下書き保存
          </PillButton>
          <PillButton onClick={onAdjust}>構成を調整</PillButton>
        </div>
      </GlassCard>
    </div>
  );
}
