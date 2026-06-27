import type {
  ApprovalItem,
  ApprovalStatus,
} from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

const labels: Record<ApprovalStatus, string> = {
  Pending: "承認待ち",
  Approved: "承認",
  "Revision requested": "修正依頼",
  "On hold": "保留",
  Rejected: "却下",
};

export function ApprovalCenterView({
  approvals,
  onBack,
  onSelect,
  onUpdate,
}: {
  approvals: ApprovalItem[];
  onBack: () => void;
  onSelect: (item: ApprovalItem) => void;
  onUpdate: (id: string, status: ApprovalStatus) => void;
}) {
  return (
    <ViewFrame
      title="Approval Center"
      detail="ユーザーは作業せず、承認・修正依頼・保留・却下だけを選びます。"
      onBack={onBack}
    >
      <div className="grid gap-3">
        {approvals.map((item) => (
          <GlassCard key={item.id} onClick={() => onSelect(item)}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                    {labels[item.status]}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                    {item.type}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">
                    {item.brand}
                  </span>
                </div>
                <h2 className="mt-3 text-xl font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {item.reason}
                </p>
              </div>
              <div
                className="grid min-w-64 grid-cols-2 gap-2"
                onClick={(event) => event.stopPropagation()}
              >
                <PillButton tone="light" onClick={() => onUpdate(item.id, "Approved")}>
                  承認
                </PillButton>
                <PillButton onClick={() => onUpdate(item.id, "Revision requested")}>
                  修正依頼
                </PillButton>
                <PillButton onClick={() => onUpdate(item.id, "On hold")}>
                  保留
                </PillButton>
                <PillButton tone="danger" onClick={() => onUpdate(item.id, "Rejected")}>
                  却下
                </PillButton>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </ViewFrame>
  );
}

export function ApprovalDetailView({
  item,
  onBack,
  onUpdate,
}: {
  item: ApprovalItem;
  onBack: () => void;
  onUpdate: (id: string, status: ApprovalStatus) => void;
}) {
  return (
    <ViewFrame title="Approval Item" detail={item.title} onBack={onBack}>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            提案内容
          </p>
          <h2 className="mt-3 text-2xl font-semibold">{item.title}</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-300">{item.reason}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["AIの根拠", "検索意図、SNS保存性、商品導線が揃っています。"],
              ["想定効果", "AIO流入、保存率、CV導線の改善。"],
              ["リスク", "専門性が強すぎると初心者が離脱する可能性。"],
              ["対象ブランド", item.brand],
              ["対象SNS", "Instagram / YouTube / Threads"],
              ["商品導線", "比較表から商品紹介へ接続"],
              ["AIO Score", "88"],
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
            Before / After
          </p>
          <p className="mt-4 rounded-2xl bg-black/40 p-4 text-sm leading-6 text-zinc-500">
            Before: 説明中心で、保存理由と商品導線が弱い。
          </p>
          <p className="mt-3 rounded-2xl bg-white p-4 text-sm leading-6 text-black">
            After: 結論、根拠、比較、FAQ、商品導線の順に再構成。
          </p>
          <div className="mt-5 grid gap-2">
            <PillButton tone="light" onClick={() => onUpdate(item.id, "Approved")}>
              承認して次へ
            </PillButton>
            <PillButton onClick={() => onUpdate(item.id, "Revision requested")}>
              修正依頼
            </PillButton>
            <PillButton onClick={() => onUpdate(item.id, "On hold")}>
              保留
            </PillButton>
            <PillButton tone="danger" onClick={() => onUpdate(item.id, "Rejected")}>
              却下
            </PillButton>
          </div>
        </GlassCard>
      </div>
    </ViewFrame>
  );
}
