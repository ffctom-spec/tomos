import type { ExecutiveBriefItem } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

export function ExecutiveBriefView({
  brief,
  onBack,
  onLog,
}: {
  brief: ExecutiveBriefItem[];
  onBack: () => void;
  onLog: (title: string, detail: string) => void;
}) {
  return (
    <ViewFrame
      title="Executive Brief"
      detail="今日のAI経営会議の結果。判断だけに圧縮しています。"
      onBack={onBack}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[
          "今日一番重要な判断",
          "今日やること",
          "今日やらないこと",
          "AIOで伸びそうなテーマ",
          "売上チャンス",
          "リスク",
        ].map((label, index) => {
          const item = brief[index % brief.length];
          return (
            <GlassCard key={label}>
              <p className="text-xs text-zinc-500">{label}</p>
              <h2 className="mt-3 text-xl font-semibold">{item.value}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {item.detail}
              </p>
            </GlassCard>
          );
        })}
      </div>
      <GlassCard className="mt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          AIの根拠
        </p>
        <p className="mt-3 text-sm leading-7 text-zinc-300">
          AIO検索意図、SNS保存率、商品導線、既存Knowledge Vaultとの接続を総合して、
          今日のExecutive判断だけを抽出しています。
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <PillButton
            tone="light"
            onClick={() => onLog("Executive Brief承認", "今日のAI経営会議を承認。")}
          >
            承認
          </PillButton>
          <PillButton onClick={() => onLog("Executive Brief保留", "後で見るに変更。")}>
            後で見る
          </PillButton>
          <PillButton onClick={() => onLog("Executive Brief詳細", "詳細確認を記録。")}>
            詳細を見る
          </PillButton>
        </div>
      </GlassCard>
    </ViewFrame>
  );
}
