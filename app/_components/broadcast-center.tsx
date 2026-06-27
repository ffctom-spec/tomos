"use client";

import { useState } from "react";
import type { BroadcastIdea } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

function ImpactGrid({ idea }: { idea: BroadcastIdea }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {[
        ["AIO", idea.expectedImpact.aio],
        ["SEO", idea.expectedImpact.seo],
        ["SNS", idea.expectedImpact.sns],
        ["保存率", idea.expectedImpact.saves],
        ["商品導線", idea.expectedImpact.productPath],
      ].map(([label, value]) => (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={label}>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
      ))}
    </div>
  );
}

function MiniList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-400"
          key={item}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BroadcastIntelligenceCard({
  idea,
  expanded,
  onApprove,
  onSelect,
  onToggle,
}: {
  idea: BroadcastIdea;
  expanded: boolean;
  onApprove: (id: string) => void;
  onSelect: (idea: BroadcastIdea) => void;
  onToggle: () => void;
}) {
  return (
    <GlassCard className="p-0">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              01 / AI Publisher Intelligence
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {idea.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              {idea.suggestedBrand} / AIが、今出すべきテーマと次の打ち手を整理します。
            </p>
          </div>
          <div className="min-w-24 text-right">
            <p className="text-4xl font-semibold">{idea.confidenceScore}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              AI Estimate
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-[#070707] p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            A. WHY NOW
          </p>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-zinc-300">
            {idea.whyNow.slice(0, 3).map((reason) => (
              <li className="border-l border-white/20 pl-3" key={reason}>
                {reason}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-zinc-600">Mock / AI推定</p>
        </section>

        <section className="bg-[#070707] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                B. MARKET SIGNAL
              </p>
              <div className="mt-4">
                <MiniList items={idea.hotWords.slice(0, 5)} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-semibold">{idea.expectedImpact.sns}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Opportunity
              </p>
            </div>
          </div>
          <div className="mt-5">
            <MiniList items={idea.trendSources.slice(0, 4)} />
          </div>
        </section>
      </div>

      <div className="grid gap-px bg-white/10 lg:grid-cols-[1fr_1fr]">
        <section className="bg-[#050505] p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            C. CREATIVE DIRECTION
          </p>
          <p className="mt-4 whitespace-pre-line text-lg leading-8 text-zinc-100">
            {idea.suggestedLead}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs text-zinc-500">切り口</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{idea.aiInsight}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-xs text-zinc-500">保存されやすい理由</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {idea.whySelected[0]}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#050505] p-5 sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            D. SIMILAR WINNING CONTENT
          </p>
          <div className="mt-4 grid gap-3">
            {idea.similarWinningContent.slice(0, 3).map((content) => (
              <div
                className="rounded-xl border border-white/10 bg-black/40 p-4"
                key={`${content.channel}-${content.title}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold">{content.title}</h3>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-zinc-400">
                    {content.channel}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  伸びた理由: {content.reason}
                </p>
                <p className="mt-2 text-xs text-zinc-400">{content.estimatedSignal}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-white/10 p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
            E. NEXT ACTION
          </p>
          <button
            className="text-xs text-zinc-500 transition hover:text-zinc-200"
            onClick={onToggle}
            type="button"
          >
            {expanded ? "Close detail" : "More intelligence"}
          </button>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          <PillButton onClick={() => onSelect(idea)}>Review</PillButton>
          <PillButton tone="light" onClick={() => onApprove(idea.id)}>
            Approve
          </PillButton>
          <PillButton>Rewrite</PillButton>
          <PillButton>Create Content</PillButton>
        </div>
      </div>

      {expanded ? (
        <div className="border-t border-white/10 p-5 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Suggested Structure
              </p>
              <div className="mt-3">
                <MiniList items={idea.suggestedStructure} />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Why Selected
              </p>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-zinc-300">
                {idea.whySelected.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Content Opportunities
              </p>
              <div className="mt-3">
                <MiniList items={idea.contentOpportunities} />
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Product Opportunity
              </p>
              <div className="mt-3">
                <MiniList items={idea.productOpportunities} />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ImpactGrid idea={idea} />
          </div>
        </div>
      ) : null}
    </GlassCard>
  );
}

export function BroadcastCenterView({
  ideas,
  onBack,
  onSelect,
  onApprove,
}: {
  ideas: BroadcastIdea[];
  onBack: () => void;
  onSelect: (idea: BroadcastIdea) => void;
  onApprove: (id: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(ideas[0]?.id ?? null);

  return (
    <ViewFrame
      title="AI Publisher Intelligence"
      detail="なぜ今このテーマを投稿すべきかをAIが根拠付きで提案します。"
      onBack={onBack}
    >
      <div className="grid gap-4">
        {ideas.map((idea) => (
          <BroadcastIntelligenceCard
            expanded={expandedId === idea.id}
            idea={idea}
            key={idea.id}
            onApprove={onApprove}
            onSelect={onSelect}
            onToggle={() => setExpandedId((current) => (current === idea.id ? null : idea.id))}
          />
        ))}
      </div>
    </ViewFrame>
  );
}

export function BroadcastDetailView({
  idea,
  onBack,
  onApprove,
}: {
  idea: BroadcastIdea;
  onBack: () => void;
  onApprove: (id: string) => void;
}) {
  return (
    <ViewFrame title="AI Publisher Detail" detail={idea.title} onBack={onBack}>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.78fr]">
        <GlassCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Theme
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{idea.title}</h2>
              <p className="mt-2 text-sm text-zinc-500">{idea.suggestedBrand}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
              {idea.confidenceScore}% Confidence
            </span>
          </div>

          <div className="mt-5 grid gap-4">
            {[
              ["なぜ今？", idea.whyNow.map((item) => `・${item}`).join("\n")],
              ["AI Insight", idea.aiInsight],
              ["Suggested Lead", idea.suggestedLead],
              ["Why Selected", idea.whySelected.map((item) => `・${item}`).join("\n")],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={label}>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-300">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Hot Word</p>
              <div className="mt-3">
                <MiniList items={idea.hotWords} />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Suggested Structure</p>
              <div className="mt-3">
                <MiniList items={idea.suggestedStructure} />
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Expected Impact
            </p>
            <div className="mt-3">
              <ImpactGrid idea={idea} />
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Similar Winning Content
            </p>
            <div className="mt-3 grid gap-3">
              {idea.similarWinningContent.map((content) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={`${content.channel}-${content.title}`}>
                  <p className="text-xs text-zinc-500">{content.channel}</p>
                  <p className="mt-2 text-sm font-semibold">{content.title}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    参考理由: {content.reason}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">{content.estimatedSignal}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Decision
            </p>
            <div className="mt-4 grid gap-2">
              <PillButton onClick={() => onBack()}>Review</PillButton>
              <PillButton tone="light" onClick={() => onApprove(idea.id)}>Approve</PillButton>
              <PillButton>Rewrite</PillButton>
              <PillButton>Create Content</PillButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </ViewFrame>
  );
}
