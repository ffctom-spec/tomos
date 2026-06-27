import type { UserBrand } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

export function BrandPortfolioView({
  brands,
  onBack,
  onSelect,
}: {
  brands: UserBrand[];
  onBack: () => void;
  onSelect: (brand: UserBrand) => void;
}) {
  return (
    <ViewFrame title="Brand Portfolio" detail="ユーザー所有ブランド一覧" onBack={onBack}>
      <div className="grid gap-3 md:grid-cols-2">
        {brands.map((brand) => (
          <GlassCard key={brand.id} onClick={() => onSelect(brand)}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">{brand.name}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {brand.domain}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                {brand.publicStatus}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                ["AIO", brand.aioScore],
                ["SNS", brand.snsHealth],
                ["Assets", brand.knowledgeAssets],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3" key={label}>
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-2 text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              Commerce Potential: {brand.commercePotential} / Approval数: {brand.approvalsPending}
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              次の推奨アクション: {brand.nextAction}
            </p>
          </GlassCard>
        ))}
      </div>
    </ViewFrame>
  );
}

export function BrandDetailView({
  brand,
  onBack,
  onNavigate,
}: {
  brand: UserBrand;
  onBack: () => void;
  onNavigate: (view: "broadcast" | "content-review" | "product" | "sns-health") => void;
}) {
  return (
    <ViewFrame title={brand.name} detail="Brand Detail" onBack={onBack}>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            ブランド概要
          </p>
          <h2 className="mt-3 text-2xl font-semibold">{brand.domain}</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["接続SNS", "Instagram / YouTube / Threads / Pinterest"],
              ["今日の投稿候補", brand.nextAction],
              ["最近の成果", `SNS Health ${brand.snsHealth} / AIO ${brand.aioScore}`],
              ["売上導線", brand.commercePotential],
              ["AIO改善点", "FAQと比較表を追加"],
              ["AIからの提案", "今日のテーマをKnowledge Vault化"],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={label}>
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Actions
          </p>
          <div className="mt-4 grid gap-2">
            <PillButton onClick={() => onNavigate("broadcast")}>投稿案を見る</PillButton>
            <PillButton onClick={() => onNavigate("content-review")}>リライトする</PillButton>
            <PillButton onClick={() => onNavigate("product")}>商品機会を見る</PillButton>
            <PillButton onClick={() => onNavigate("sns-health")}>SNS Healthを見る</PillButton>
          </div>
        </GlassCard>
      </div>
    </ViewFrame>
  );
}
