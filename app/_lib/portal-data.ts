export type EngineStatus =
  | "Running"
  | "Monitoring"
  | "Queued"
  | "Waiting approval"
  | "Learning"
  | "Paused";

export type AiEngine = {
  name: string;
  status: EngineStatus;
  signal: string;
  lastRun: string;
  output: string;
};

export type TimelineItem = {
  time: string;
  title: string;
  detail: string;
  engine: string;
};

export type DecisionLog = {
  title: string;
  basis: string;
  expectedEffect: string;
  risk: string;
  nextAction: string;
};

export type AutomationRule = {
  title: string;
  cadence: string;
  target: string;
  status: "Active" | "Draft" | "Paused";
};

export type SystemHealth = {
  label: string;
  value: string;
  detail: string;
};

export type ExecutiveApproval = {
  type: string;
  title: string;
  brand: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
};

export const navItems = [
  { label: "Command Center", active: true },
  { label: "Always-On AI", badge: "8" },
  { label: "Executive Approval", badge: "5" },
  { label: "AI Decision Log" },
  { label: "Automation Rules" },
  { label: "System Health" },
  { label: "Knowledge Vault" },
];

export const systemHealth: SystemHealth[] = [
  { label: "Active engines", value: "07/08", detail: "1 engine waiting approval" },
  { label: "Pending approvals", value: "05", detail: "executive decisions only" },
  { label: "Assets created", value: "34", detail: "last 24 hours" },
  { label: "Opportunities found", value: "18", detail: "AIO / SNS / Commerce" },
  { label: "Revenue signals", value: "12", detail: "commerce routes detected" },
  { label: "AIO signals", value: "27", detail: "citation candidates found" },
];

export const aiEngines: AiEngine[] = [
  {
    name: "Research Engine",
    status: "Running",
    signal: "海外YouTube、Reddit、Pinterest、Google検索、ECトレンドを監視中。",
    lastRun: "3分前",
    output: "Broadcast Mission候補を7件抽出",
  },
  {
    name: "AIO Engine",
    status: "Monitoring",
    signal: "FAQ、用語定義、比較表、検索意図、AI引用適性を採点中。",
    lastRun: "11分前",
    output: "AIO改善候補を4件生成",
  },
  {
    name: "SNS Engine",
    status: "Learning",
    signal: "Instagram保存率、YouTube CTR、Shorts維持率、Threads反応率を学習中。",
    lastRun: "18分前",
    output: "次回リード文改善案を生成",
  },
  {
    name: "Commerce Engine",
    status: "Running",
    signal: "投稿、流入、商品クリック、購入、CVR、売上を照合中。",
    lastRun: "22分前",
    output: "商品導線の改善案を2件作成",
  },
  {
    name: "Content Review Engine",
    status: "Queued",
    signal: "記事、SNS投稿、動画台本のブランド適合性と保存性を評価待ち。",
    lastRun: "41分前",
    output: "リライト候補が3件キュー入り",
  },
  {
    name: "Knowledge Vault Engine",
    status: "Running",
    signal: "動画や投稿をFAQ、用語集、比較表、Blog、Podcastへ資産化中。",
    lastRun: "54分前",
    output: "Knowledge Cast台本を保存",
  },
  {
    name: "Learning Loop Engine",
    status: "Learning",
    signal: "公開後の保存率、CTR、AIO流入、商品クリック、AI引用を分析中。",
    lastRun: "1時間前",
    output: "次回改善案を5件生成",
  },
  {
    name: "Approval Engine",
    status: "Waiting approval",
    signal: "ユーザーが見るべきExecutive Approvalだけを集約中。",
    lastRun: "2時間前",
    output: "5件の承認判断が必要",
  },
];

export const activityTimeline: TimelineItem[] = [
  { time: "06:00", title: "Daily Brief生成", detail: "今日見るべきニュース、伸びそうなテーマ、避けるべき発信を整理。", engine: "Research Engine" },
  { time: "07:20", title: "AIO候補抽出", detail: "ロストラータ、土壌改良、アガベ発根の引用候補を抽出。", engine: "AIO Engine" },
  { time: "09:10", title: "Instagram改善案生成", detail: "保存率を上げるリード文とカルーセル構成を作成。", engine: "SNS Engine" },
  { time: "12:30", title: "商品候補スコアリング", detail: "鉢、土、肥料、発根管理用品の市場性と商品導線を採点。", engine: "Commerce Engine" },
  { time: "15:40", title: "Broadcast Mission設計", detail: "今日配信すべきテーマをブランド別に振り分け。", engine: "Approval Engine" },
  { time: "18:00", title: "Knowledge Cast台本生成", detail: "寝ながら聞けるAI読み聞かせ型の知識番組として台本化。", engine: "Knowledge Vault Engine" },
];

export const executiveApprovals: ExecutiveApproval[] = [
  { type: "公開承認", title: "ロストラータを太く育てる土の考え方", brand: "VERDNA", reason: "AIO引用適性と商品導線が高いBroadcast Mission。", priority: "High" },
  { type: "リライト承認", title: "0円でできる土壌改良のリード文", brand: "VERDNA", reason: "保存率とAI引用適性を上げるリライト。", priority: "High" },
  { type: "商品提案承認", title: "発根管理セットの比較表", brand: "VERDNA", reason: "商品クリックと購入数の改善が見込める。", priority: "Medium" },
  { type: "配信テーマ承認", title: "庭で遊ぶ犬たちと夏前の安全対策", brand: "titi&joji", reason: "SNS拡散性が高く、ペット用品導線を作れる。", priority: "Medium" },
  { type: "AIO改善承認", title: "ドライガーデン水やり頻度FAQ", brand: "VERDNA", reason: "検索意図が明確でAI回答に拾われやすい。", priority: "High" },
];

export const decisionLogs: DecisionLog[] = [
  {
    title: "ロストラータ土壌改善をVERDNAにルーティング",
    basis: "検索意図、商品導線、既存Knowledge Vaultとの接続が強い。",
    expectedEffect: "AIO流入、保存率、発根用品クリックの増加。",
    risk: "専門性が強すぎると初心者が離脱する。",
    nextAction: "FAQ、比較表、短尺動画、商品紹介へ分解して承認へ回す。",
  },
  {
    title: "Instagram投稿は結論先出しへ変更",
    basis: "過去投稿で冒頭2秒の離脱が高く、保存率が伸びにくい。",
    expectedEffect: "保存率とThreads再利用率の改善。",
    risk: "説明不足に見える可能性がある。",
    nextAction: "1枚目に結論、2枚目に理由、3枚目に比較表を配置。",
  },
  {
    title: "発根用品は比較表から商品導線へ接続",
    basis: "購入前の不安がサイズ、用途、失敗リスクに集中している。",
    expectedEffect: "商品クリックとCVRの改善。",
    risk: "宣伝感が強いと信頼性が落ちる。",
    nextAction: "売り込みではなく選び方FAQとして作成。",
  },
];

export const automationRules: AutomationRule[] = [
  { title: "毎朝 Daily Brief 作成", cadence: "Daily / 06:00", target: "ニュース、SNS、EC、AIO候補を要約", status: "Active" },
  { title: "毎日 Content Opportunity 抽出", cadence: "Daily / 07:00", target: "Broadcast Mission候補を生成", status: "Active" },
  { title: "毎週 SNS Health 分析", cadence: "Weekly / Monday", target: "保存率、CTR、維持率、反応率を改善案に変換", status: "Draft" },
  { title: "毎週 Commerce Analytics 更新", cadence: "Weekly / Friday", target: "流入、クリック、購入、売上、改善案を更新", status: "Draft" },
  { title: "毎月 Brand Asset Review", cadence: "Monthly / 1st", target: "知識資産、ブランド適合、公開状態を棚卸し", status: "Paused" },
];
