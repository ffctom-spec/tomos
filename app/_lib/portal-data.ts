export type NavItem = {
  label: string;
  badge?: string;
  active?: boolean;
};

export type ToolCard = {
  title: string;
  description: string;
  tag: string;
  metric: string;
  accent: "cyan" | "violet" | "emerald";
};

export type WorkflowItem = {
  title: string;
  detail: string;
  status: "Ready" | "Running" | "Queued";
};

export const navItems: NavItem[] = [
  { label: "Dashboard", active: true },
  { label: "Agents", badge: "6" },
  { label: "Prompts" },
  { label: "Knowledge" },
  { label: "Automations", badge: "New" },
  { label: "Settings" },
];

export const toolCards: ToolCard[] = [
  {
    title: "Research Copilot",
    description: "Web, files, and notesを横断して要点をまとめる調査エージェント。",
    tag: "Research",
    metric: "12 sources",
    accent: "cyan",
  },
  {
    title: "Strategy Writer",
    description: "企画書、仕様書、提案文をPLAN Bの文脈に合わせて生成。",
    tag: "Writing",
    metric: "4 drafts",
    accent: "violet",
  },
  {
    title: "Task Orchestrator",
    description: "複数AIにタスクを分解し、進行状況と成果物を一画面で管理。",
    tag: "Ops",
    metric: "8 runs",
    accent: "emerald",
  },
];

export const workflows: WorkflowItem[] = [
  {
    title: "Market brief",
    detail: "競合調査と比較表を生成",
    status: "Running",
  },
  {
    title: "Landing copy",
    detail: "新機能公開用のコピーを作成",
    status: "Queued",
  },
  {
    title: "Meeting digest",
    detail: "議事録からTODOを抽出",
    status: "Ready",
  },
];

export const statCards = [
  { label: "Active agents", value: "06", delta: "+2 this week" },
  { label: "Saved prompts", value: "128", delta: "24 curated" },
  { label: "Monthly runs", value: "1.8k", delta: "92% complete" },
];
