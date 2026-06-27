import type { IntegrationStatus } from "@/app/_lib/portal-types";
import { GlassCard, PillButton, ViewFrame } from "@/app/_components/view-frame";

const requiredEnv: Record<string, string> = {
  instagram: "META_APP_ID / META_APP_SECRET / META_ACCESS_TOKEN / INSTAGRAM_BUSINESS_ACCOUNT_ID",
  openai: "OPENAI_API_KEY / OPENAI_MODEL",
  youtube: "YOUTUBE_API_KEY",
  analytics: "GOOGLE_API_KEY",
  "search-console": "GOOGLE_API_KEY",
  commerce: "SHOPIFY_ACCESS_TOKEN / DATABASE_URL",
};

export function IntegrationsPanel({
  integrations,
  onBack,
  onAction,
}: {
  integrations: IntegrationStatus[];
  onBack: () => void;
  onAction: (title: string) => void;
}) {
  return (
    <ViewFrame title="Integrations" detail="API接続予定画面" onBack={onBack}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => (
          <GlassCard key={integration.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{integration.name}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {integration.detail}
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">
                {integration.status}
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              {[
                ["Connection Status", integration.status],
                ["API-ready", integration.status === "Planned" ? "準備中" : "Ready"],
                ["Required env", requiredEnv[integration.id] ?? "TBD"],
                ["Last sync", "Mock / not connected"],
                ["Next setup step", "Vercel Environment Variablesに設定"],
              ].map(([label, value]) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4" key={label}>
                  <p className="text-xs text-zinc-500">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              <PillButton onClick={() => onAction(`${integration.name} Connect`)}>
                Connect
              </PillButton>
              <PillButton onClick={() => onAction(`${integration.name} Test`)}>
                Test connection
              </PillButton>
              <PillButton tone="light" onClick={() => onAction(`${integration.name} docs`)}>
                View docs
              </PillButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </ViewFrame>
  );
}
