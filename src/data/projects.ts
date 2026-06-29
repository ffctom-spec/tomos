export type ProjectStatus = "未着手" | "進行中" | "確認待ち" | "完了";
export type ProjectPriority = "High" | "Medium" | "Low";

export type ProjectTask = {
  id: string;
  title: string;
  owner: string;
  due: string;
  done: boolean;
};

export type ProjectFile = {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
};

export type ProjectActivity = {
  id: string;
  actor: string;
  action: string;
  time: string;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  category: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  owner: string;
  updatedAt: string;
  dueDate: string;
  revenue: string;
  summary: string;
  goal: string;
  nextAction: string;
  tasks: ProjectTask[];
  files: ProjectFile[];
  activity: ProjectActivity[];
};

export const projects: Project[] = [
  {
    id: "kc-recruit-dx",
    name: "KC採用 DXプロジェクト",
    client: "KC Group",
    category: "採用 / DX",
    status: "進行中",
    priority: "High",
    progress: 72,
    owner: "TOM",
    updatedAt: "2026-06-28",
    dueDate: "2026-07-12",
    revenue: "¥1,280,000",
    summary: "採用導線、応募管理、面談体験をひとつのDXポータルへ統合するプロジェクト。",
    goal: "応募から一次面談までのリードタイムを短縮し、採用品質を可視化する。",
    nextAction: "面談ステータス設計を確定し、管理画面の承認を取る。",
    tasks: [
      { id: "kc-1", title: "応募者ステータス定義", owner: "TOM", due: "06/30", done: true },
      { id: "kc-2", title: "面談ダッシュボードUI確認", owner: "TOM", due: "07/02", done: false },
      { id: "kc-3", title: "通知文面の承認", owner: "AI", due: "07/04", done: false },
    ],
    files: [
      { id: "kc-f1", name: "recruit-flow-v2.fig", type: "Design", updatedAt: "06/28" },
      { id: "kc-f2", name: "interview-status.xlsx", type: "Sheet", updatedAt: "06/27" },
    ],
    activity: [
      { id: "kc-a1", actor: "TOM", action: "応募者ステータスを更新", time: "Today 09:10" },
      { id: "kc-a2", actor: "AI", action: "面談導線の改善案を作成", time: "Yesterday 18:40" },
    ],
  },
  {
    id: "kd-mansion-pwa",
    name: "KDマンション管理 PWA",
    client: "KD Management",
    category: "PWA / 管理",
    status: "確認待ち",
    priority: "High",
    progress: 84,
    owner: "TOM",
    updatedAt: "2026-06-27",
    dueDate: "2026-07-05",
    revenue: "¥920,000",
    summary: "マンション管理の問い合わせ、掲示、作業履歴をPWAで集約する。",
    goal: "紙と電話中心の管理フローをスマホで完結できる状態にする。",
    nextAction: "管理会社側の確認コメントを反映する。",
    tasks: [
      { id: "kd-1", title: "掲示板UI最終確認", owner: "TOM", due: "06/30", done: true },
      { id: "kd-2", title: "作業履歴カードの文言調整", owner: "AI", due: "07/01", done: true },
      { id: "kd-3", title: "PWA動作確認", owner: "TOM", due: "07/03", done: false },
    ],
    files: [
      { id: "kd-f1", name: "pwa-checklist.md", type: "Doc", updatedAt: "06/28" },
      { id: "kd-f2", name: "resident-flow.pdf", type: "PDF", updatedAt: "06/26" },
    ],
    activity: [
      { id: "kd-a1", actor: "Client", action: "確認コメントを追加", time: "Today 11:20" },
      { id: "kd-a2", actor: "TOM", action: "PWA設定を更新", time: "Yesterday 15:00" },
    ],
  },
  {
    id: "kcrd-paint-lp",
    name: "KCRD 塗装LP改善",
    client: "KCRD",
    category: "LP / CV改善",
    status: "進行中",
    priority: "Medium",
    progress: 58,
    owner: "AI Team",
    updatedAt: "2026-06-26",
    dueDate: "2026-07-18",
    revenue: "¥480,000",
    summary: "塗装サービスLPのファーストビュー、施工事例、問い合わせ導線を改善する。",
    goal: "問い合わせ率を改善し、施工前後の信頼材料を増やす。",
    nextAction: "Before / After写真の見せ方を3案に絞る。",
    tasks: [
      { id: "kcrd-1", title: "競合LP比較", owner: "AI", due: "07/01", done: true },
      { id: "kcrd-2", title: "ファーストビューコピー作成", owner: "TOM", due: "07/03", done: false },
      { id: "kcrd-3", title: "CTA配置案", owner: "AI", due: "07/06", done: false },
    ],
    files: [{ id: "kcrd-f1", name: "lp-copy-options.md", type: "Doc", updatedAt: "06/27" }],
    activity: [{ id: "kcrd-a1", actor: "AI", action: "競合比較を完了", time: "Yesterday 17:25" }],
  },
  {
    id: "kashiwara-museum-sns",
    name: "柏原美術館 SNS運用",
    client: "柏原美術館",
    category: "SNS / Brand",
    status: "未着手",
    priority: "Medium",
    progress: 18,
    owner: "TOM",
    updatedAt: "2026-06-25",
    dueDate: "2026-08-01",
    revenue: "¥360,000",
    summary: "展示情報、来館導線、地域文化をSNSで継続的に発信する運用設計。",
    goal: "展示の魅力を保存・共有される投稿フォーマットへ変換する。",
    nextAction: "初回投稿シリーズのテーマを確定する。",
    tasks: [
      { id: "km-1", title: "展示テーマ整理", owner: "TOM", due: "07/05", done: false },
      { id: "km-2", title: "投稿フォーマット作成", owner: "AI", due: "07/08", done: false },
    ],
    files: [{ id: "km-f1", name: "sns-calendar-draft.md", type: "Doc", updatedAt: "06/25" }],
    activity: [{ id: "km-a1", actor: "TOM", action: "初回ヒアリングを記録", time: "06/25 14:00" }],
  },
  {
    id: "plan-a-headphone",
    name: "PLAN A Headphone Launch",
    client: "PLAN A",
    category: "Product Launch",
    status: "進行中",
    priority: "High",
    progress: 64,
    owner: "TOM",
    updatedAt: "2026-06-28",
    dueDate: "2026-07-22",
    revenue: "¥1,640,000",
    summary: "高級ヘッドホンのブランドストーリー、LP、SNS、発売前告知を統合する。",
    goal: "音質スペックではなく、所有体験とライフスタイル価値で認知を作る。",
    nextAction: "ティザー投稿とLPヒーローコピーを確定する。",
    tasks: [
      { id: "pa-1", title: "LPヒーローコピー", owner: "TOM", due: "07/02", done: false },
      { id: "pa-2", title: "ティザー投稿案", owner: "AI", due: "07/04", done: true },
      { id: "pa-3", title: "商品写真セレクト", owner: "TOM", due: "07/07", done: false },
    ],
    files: [
      { id: "pa-f1", name: "launch-story-v1.md", type: "Doc", updatedAt: "06/28" },
      { id: "pa-f2", name: "visual-direction.jpg", type: "Image", updatedAt: "06/27" },
    ],
    activity: [{ id: "pa-a1", actor: "AI", action: "ティザー投稿案を生成", time: "Today 08:30" }],
  },
  {
    id: "yugawa-residence-branding",
    name: "YUGAWA RESIDENCE Branding",
    client: "YUGAWA Residence",
    category: "Branding / Home",
    status: "確認待ち",
    priority: "Medium",
    progress: 76,
    owner: "TOM",
    updatedAt: "2026-06-28",
    dueDate: "2026-07-15",
    revenue: "¥740,000",
    summary: "住宅資産、外構、庭、インテリア、DIYの発信軸をブランドとして整理する。",
    goal: "住まいの改善ログを、知識資産とSNSコンテンツへ変換する。",
    nextAction: "外構Before / Afterの投稿構成を承認する。",
    tasks: [
      { id: "yr-1", title: "ブランドメッセージ整理", owner: "TOM", due: "07/01", done: true },
      { id: "yr-2", title: "外構投稿構成", owner: "AI", due: "07/03", done: false },
      { id: "yr-3", title: "DIY記事導線", owner: "AI", due: "07/06", done: false },
    ],
    files: [{ id: "yr-f1", name: "brand-axis.md", type: "Doc", updatedAt: "06/28" }],
    activity: [{ id: "yr-a1", actor: "TOM", action: "ブランド軸を更新", time: "Today 12:15" }],
  },
];

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}
