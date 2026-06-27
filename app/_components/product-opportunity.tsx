import type { ProductOpportunity } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

export function ProductOpportunityView({
  items,
  onBack,
  onAction,
}: {
  items: ProductOpportunity[];
  onBack: () => void;
  onAction: (title: string) => void;
}) {
  return (
    <ViewFrame title="Product Opportunity" detail="AIが商品機会を提案" onBack={onBack}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <GlassCard key={item.item}>
            <h2 className="text-2xl font-semibold">{item.item}</h2>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["市場性", item.market],
                ["ブランド適合", item.brandFit],
                ["利益可能性", item.profit],
                ["AIO向き", item.aioFit],
                ["SNS映え", item.snsLook],
                ["推奨度", item.recommendation],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={label}>
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <PillButton tone="light" onClick={() => onAction(`${item.item}を採用`)}>
                採用
              </PillButton>
              <PillButton onClick={() => onAction(`${item.item}を調査依頼`)}>
                調査依頼
              </PillButton>
              <PillButton onClick={() => onAction(`${item.item}を保留`)}>
                保留
              </PillButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </ViewFrame>
  );
}
