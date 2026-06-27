import type { KnowledgeVaultItem } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

export function KnowledgeVaultView({
  items,
  onBack,
  onSelect,
}: {
  items: KnowledgeVaultItem[];
  onBack: () => void;
  onSelect: (item: KnowledgeVaultItem) => void;
}) {
  return (
    <ViewFrame title="Knowledge Vault" detail="知識資産管理画面" onBack={onBack}>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <GlassCard key={item.title} onClick={() => onSelect(item)}>
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              {item.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </ViewFrame>
  );
}

export function KnowledgeDetailView({
  item,
  onBack,
}: {
  item: KnowledgeVaultItem;
  onBack: () => void;
}) {
  return (
    <ViewFrame title={item.title} detail="Knowledge Detail" onBack={onBack}>
      <GlassCard>
        <p className="text-sm leading-7 text-zinc-300">{item.description}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {[
            ["AI引用ブロック", "要約、根拠、比較、FAQを短く構造化。"],
            ["YouTube化", "導入、課題、解決、商品導線へ分解。"],
            ["Podcast化", "寝ながら聞けるKnowledge Castへ変換。"],
            ["Blog化", "検索意図別に見出しを展開。"],
            ["SNS展開", "Instagram、Threads、Pinterestへ再利用。"],
          ].map(([label, value]) => (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={label}>
              <p className="text-xs text-zinc-500">{label}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <PillButton tone="light">資産化を承認</PillButton>
        </div>
      </GlassCard>
    </ViewFrame>
  );
}
