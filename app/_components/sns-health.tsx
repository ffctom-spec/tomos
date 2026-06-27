import type { InstagramAnalytics, SnsHealthItem } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

export function SnsHealthView({
  items,
  instagram,
  onBack,
  onNavigateIntegrations,
}: {
  items: SnsHealthItem[];
  instagram: InstagramAnalytics | null;
  onBack: () => void;
  onNavigateIntegrations: () => void;
}) {
  return (
    <ViewFrame title="SNS Health" detail="Instagram / YouTube / Threads / Pinterest" onBack={onBack}>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Instagram API-ready
          </p>
          <h2 className="mt-3 text-2xl font-semibold">
            {instagram?.account ?? "Loading Instagram"}
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["接続状態", instagram?.connectionStatus ?? "loading"],
              ["Followers", instagram ? instagram.followers.toLocaleString() : "-"],
              ["Reach", instagram ? instagram.reach.toLocaleString() : "-"],
              ["Saves", instagram ? instagram.saves.toLocaleString() : "-"],
              ["CTR", "Mock"],
              ["Engagement", instagram?.engagementRate ?? "-"],
              ["課題", "保存理由が弱い"],
              ["改善提案", "冒頭で結論"],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={label}>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-2 text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <PillButton tone="light" onClick={onNavigateIntegrations}>Instagram接続</PillButton>
            <PillButton>改善案を見る</PillButton>
            <PillButton>投稿案を作る</PillButton>
          </div>
        </GlassCard>
        <div className="grid gap-3">
          {items.map((item) => (
            <GlassCard key={item.channel}>
              <p className="text-sm font-medium">{item.channel}</p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {item.issue}
              </p>
              <p className="mt-2 text-sm text-zinc-300">{item.nextPost}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </ViewFrame>
  );
}
