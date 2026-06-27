import type { BroadcastIdea } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

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
  return (
    <ViewFrame title="Broadcast Center" detail="今日発信すべきテーマ一覧" onBack={onBack}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ideas.map((idea) => (
          <GlassCard key={idea.id} onClick={() => onSelect(idea)}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold">{idea.title}</h2>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                {idea.priority}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-500">{idea.suggestedBrand}</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["AIO", idea.aioScore],
                ["SNS", idea.snsPotential],
                ["Product", idea.productFit],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={label}>
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-2 text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2" onClick={(event) => event.stopPropagation()}>
              <PillButton tone="light" onClick={() => onApprove(idea.id)}>
                承認して制作へ
              </PillButton>
              <PillButton onClick={() => onSelect(idea)}>詳細</PillButton>
              <PillButton>保留</PillButton>
            </div>
          </GlassCard>
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
    <ViewFrame title="Broadcast Detail" detail={idea.title} onBack={onBack}>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            なぜ今このテーマか
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-300">
            AIO Score {idea.aioScore}、SNS Potential {idea.snsPotential}、
            Product Fit {idea.productFit}。検索意図と保存理由が明確です。
          </p>
          <div className="mt-5 grid gap-3">
            {[
              ["どのSNSで出すか", "Instagram / Threads / YouTube / Blog"],
              ["YouTube構成", "問題提起、失敗例、解決手順、商品導線"],
              ["Instagramリード文", "結論を1枚目に置き、保存理由を明示"],
              ["Threads投稿", "問いかけと失敗談で会話化"],
              ["Blog見出し", "FAQと比較表を含むAIO構造"],
              ["FAQ", "初心者が迷う3問を追加"],
              ["商品導線", "比較表の後に自然に配置"],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={label}>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-2 text-sm text-zinc-300">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Decision
          </p>
          <div className="mt-4 grid gap-2">
            <PillButton tone="light" onClick={() => onApprove(idea.id)}>
              制作承認
            </PillButton>
            <PillButton>リライト依頼</PillButton>
            <PillButton>保留</PillButton>
          </div>
        </GlassCard>
      </div>
    </ViewFrame>
  );
}
