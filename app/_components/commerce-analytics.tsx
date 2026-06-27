import type { CommerceAnalyticsItem } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

export function CommerceAnalyticsView({
  items,
  onBack,
  onProduct,
}: {
  items: CommerceAnalyticsItem[];
  onBack: () => void;
  onProduct: () => void;
}) {
  return (
    <ViewFrame title="Commerce Analytics" detail="売上・CV測定画面" onBack={onBack}>
      <div className="grid gap-3">
        {items.map((item) => (
          <GlassCard key={item.post}>
            <h2 className="text-xl font-semibold">{item.post}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
              {[
                ["投稿別流入", item.traffic],
                ["商品クリック", item.productClicks],
                ["購入数", item.purchases],
                ["CVR", item.cvr],
                ["売上", item.revenue],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={label}>
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-zinc-400">売れた理由: {item.soldReason}</p>
            <p className="mt-2 text-sm text-zinc-500">売れなかった理由: {item.missedReason}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <PillButton>商品導線を改善</PillButton>
              <PillButton tone="light" onClick={onProduct}>次の商品候補を見る</PillButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </ViewFrame>
  );
}
