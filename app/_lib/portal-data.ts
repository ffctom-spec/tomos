import type {
  ActivityTimelineItem,
  AiEngine,
  ApprovalItem,
  AutomationRule,
  BroadcastIdea,
  CommerceAnalyticsItem,
  ContentReview,
  DecisionLog,
  ExecutiveBriefItem,
  KnowledgeVaultItem,
  ProductOpportunity,
  SnsHealthItem,
  SystemHealthItem,
  UserBrand,
} from "@/app/_lib/portal-types";

export const navItems = [
  { label: "Command Center", active: true },
  { label: "AI Engines", badge: "11" },
  { label: "Executive Approval", badge: "6" },
  { label: "Broadcast Mission" },
  { label: "Intelligence" },
  { label: "Commerce" },
  { label: "Knowledge Vault" },
  { label: "API-ready" },
];

export const aiEngines: AiEngine[] = [
  { id: "research", name: "Research Engine", status: "Running", lastRun: "3分前", nextAction: "海外YouTube / Reddit / Pinterest / Google検索を継続監視", output: "Broadcast Mission候補を7件抽出" },
  { id: "aio", name: "AIO Intelligence Engine", status: "Monitoring", lastRun: "11分前", nextAction: "FAQ、用語定義、比較表の不足を検出", output: "AI引用候補を4件生成" },
  { id: "sns", name: "SNS Health Engine", status: "Learning", lastRun: "18分前", nextAction: "保存率とCTRをもとに次の投稿構成を改善", output: "Instagramリード文改善案を生成" },
  { id: "review", name: "Content Review AI", status: "Queued", lastRun: "41分前", nextAction: "リライト候補をExecutive Approvalへ送る", output: "記事と動画台本を3件レビュー待ち" },
  { id: "commerce", name: "Commerce Analytics Engine", status: "Running", lastRun: "22分前", nextAction: "商品クリック、購入、売上を照合", output: "売れた理由と売れなかった理由を更新" },
  { id: "product", name: "Product Opportunity Engine", status: "Monitoring", lastRun: "36分前", nextAction: "取り扱いアイテム候補の市場性を採点", output: "PDF教材と発根用品を高推奨に分類" },
  { id: "vault", name: "Knowledge Vault Engine", status: "Running", lastRun: "54分前", nextAction: "承認済みコンテンツをFAQ / Blog / YouTubeへ変換", output: "Knowledge Vaultへ9ブロック追加" },
  { id: "cast", name: "Knowledge Cast Engine", status: "Queued", lastRun: "1時間前", nextAction: "寝ながら聞けるAI読み聞かせ台本を整形", output: "ロストラータ回の台本を生成" },
  { id: "routing", name: "Brand Routing Engine", status: "Monitoring", lastRun: "1時間前", nextAction: "テーマごとに最適な発信ブランドを提案", output: "5件をVERDNA / YUGAWA Residenceへ振り分け" },
  { id: "learning", name: "Learning Loop Engine", status: "Learning", lastRun: "2時間前", nextAction: "公開後の成果を次回改善案へ変換", output: "次回改善案を8件生成" },
  { id: "approval", name: "Executive Approval Engine", status: "Waiting approval", lastRun: "2時間前", nextAction: "ユーザーが見るべき判断だけを集約", output: "6件のExecutive Approvalが必要" },
];

export const executiveBrief: ExecutiveBriefItem[] = [
  { label: "今日の最重要判断", value: "ロストラータ土壌改善を公開するか", detail: "AIO、SNS、商品導線が同時に高いBroadcast Mission。" },
  { label: "今日の配信候補", value: "0円でできる土壌改良", detail: "Instagram、Blog、FAQ、Knowledge Castへ展開可能。" },
  { label: "AIOで伸びそうなテーマ", value: "ドライガーデンの水やり頻度", detail: "検索意図が明確でAI回答に引用されやすい。" },
  { label: "SNS改善ポイント", value: "冒頭2秒で結論を出す", detail: "Shorts維持率とInstagram保存率に影響。" },
  { label: "売上につながる商品候補", value: "発根管理セット / 鉢 / 土", detail: "悩みが深く、比較表と商品導線が自然。" },
  { label: "今日はやらない方がいいこと", value: "根拠の薄い即効テクニック投稿", detail: "信頼性とAIO引用適性を下げるリスク。" },
];

export const approvalItems: ApprovalItem[] = [
  { id: "cast-rostrata", type: "Knowledge Cast台本", title: "ロストラータを太く育てる方法", brand: "VERDNA", reason: "保存性とAIO引用適性が高く、商品導線にも接続可能。", status: "Pending" },
  { id: "ig-lead", type: "Instagramリード文", title: "0円でできる土壌改良", brand: "VERDNA", reason: "保存率改善のため冒頭に結論と保存理由を追加。", status: "Pending" },
  { id: "youtube-title", type: "YouTubeタイトル", title: "アガベの発根で失敗しない3つの条件", brand: "VERDNA", reason: "CTR改善とFAQ化の両方に向く。", status: "Pending" },
  { id: "product-offer", type: "商品提案", title: "発根管理スターターセット", brand: "VERDNA", reason: "商品クリックから購入までの距離が短い。", status: "Pending" },
  { id: "aio-faq", type: "AIO改善", title: "ドライガーデン水やり頻度FAQ", brand: "VERDNA", reason: "AI検索に拾われる質問形式へ変換済み。", status: "Pending" },
  { id: "brand-routing", type: "Brand Routing提案", title: "ウッドフェンスBefore/After", brand: "YUGAWA Residence", reason: "外構、住宅資産、DIY文脈に最適。", status: "Pending" },
];

export const userBrands: UserBrand[] = [
  { id: "verdna", name: "VERDNA", domain: "植物 / ドライガーデン / Knowledge Cast", publicStatus: "Private", aioScore: 86, snsHealth: 74, knowledgeAssets: 128, commercePotential: "High", approvalsPending: 5, nextAction: "ロストラータ土壌改善をBroadcast Mission化" },
  { id: "residence", name: "YUGAWA Residence", domain: "住宅資産 / 外構 / 庭 / インテリア / DIY", publicStatus: "Draft", aioScore: 78, snsHealth: 69, knowledgeAssets: 84, commercePotential: "Medium", approvalsPending: 3, nextAction: "ウッドフェンスBefore/Afterを整理" },
  { id: "pajour", name: "PAJOUR", domain: "個人ブランド / デザイン / DJ / 料理 / ライフスタイル", publicStatus: "Private", aioScore: 72, snsHealth: 81, knowledgeAssets: 63, commercePotential: "Medium", approvalsPending: 2, nextAction: "DJとAIライフスタイルのシリーズ化" },
  { id: "titi-joji", name: "titi&joji", domain: "ペット / カリフォルニアライフスタイル / SNS", publicStatus: "Private", aioScore: 64, snsHealth: 88, knowledgeAssets: 41, commercePotential: "High", approvalsPending: 2, nextAction: "庭で遊ぶ犬たちの短尺動画を準備" },
];

export const broadcastIdeas: BroadcastIdea[] = [
  { id: "soil-free", title: "0円でできる土壌改良", priority: "High", aioScore: 94, snsPotential: 88, productFit: 82, suggestedBrand: "VERDNA", status: "Ready" },
  { id: "rostrata-fat", title: "ロストラータを太く育てる方法", priority: "High", aioScore: 92, snsPotential: 84, productFit: 91, suggestedBrand: "VERDNA", status: "Ready" },
  { id: "agave-root", title: "アガベの発根", priority: "High", aioScore: 89, snsPotential: 81, productFit: 93, suggestedBrand: "VERDNA", status: "Ready" },
  { id: "wood-fence", title: "ウッドフェンスのビフォーアフター", priority: "Medium", aioScore: 76, snsPotential: 92, productFit: 78, suggestedBrand: "YUGAWA Residence", status: "Ready" },
  { id: "pet-garden", title: "ペットと庭のライフスタイル", priority: "Medium", aioScore: 70, snsPotential: 94, productFit: 84, suggestedBrand: "titi&joji", status: "Ready" },
];

export const contentReview: ContentReview = {
  id: "soil-lead",
  title: "0円でできる土壌改良",
  assetType: "記事リード文 / Instagram冒頭",
  before: "庭の土をよくする方法を紹介します。お金をかけずにできます。",
  after: "土壌改良は高価な資材から始める必要はありません。落ち葉、残渣、水はけの観察だけでも、ドライガーデンと野菜づくりの土は変えられます。",
  status: "Ready",
  metrics: [
    { label: "ブランド適合性", value: 92 },
    { label: "読みやすさ", value: 88 },
    { label: "保存されやすさ", value: 84 },
    { label: "AIO引用適性", value: 90 },
    { label: "SEO", value: 82 },
    { label: "SNS拡散性", value: 76 },
    { label: "CV導線", value: 71 },
    { label: "商品導線", value: 68 },
  ],
};

export const snsHealth: SnsHealthItem[] = [
  { channel: "Instagram", metric: "保存率", value: "6.8%", issue: "保存理由が冒頭で伝わりにくい。", nextPost: "土壌改良3ステップのカルーセル" },
  { channel: "YouTube", metric: "CTR", value: "4.1%", issue: "タイトルが説明的でベネフィットが弱い。", nextPost: "ロストラータを太くする土の作り方" },
  { channel: "Shorts", metric: "維持率", value: "61%", issue: "冒頭2秒で結論が出ていない。", nextPost: "失敗例から始める15秒構成" },
  { channel: "Threads", metric: "反応率", value: "3.4%", issue: "問いかけが少なく会話が伸びにくい。", nextPost: "植物の失敗談を質問形式で投稿" },
  { channel: "Pinterest", metric: "保存数", value: "128", issue: "比較表系の縦長画像が不足。", nextPost: "鉢・土・肥料の選び方ピン" },
];

export const commerceAnalytics: CommerceAnalyticsItem[] = [
  { post: "アガベ発根セット紹介", traffic: "1,240", productClicks: "186", purchases: "14", cvr: "7.5%", revenue: "¥84,000", soldReason: "悩みが明確で商品導線が自然だった。", missedReason: "比較表がなく初心者の不安が残った。", nextAction: "発根用品の比較表とFAQを追加。" },
  { post: "庭で使うペット用品", traffic: "840", productClicks: "96", purchases: "5", cvr: "5.2%", revenue: "¥31,500", soldReason: "犬の日常シーンが自然で共感されやすい。", missedReason: "サイズ感、耐久性、価格比較が不足。", nextAction: "titi&jojiでレビュー型投稿に再構成。" },
];

export const productOpportunities: ProductOpportunity[] = [
  { item: "植物", market: 88, brandFit: 94, profit: 72, aioFit: 90, snsLook: 92, recommendation: 91 },
  { item: "鉢", market: 82, brandFit: 89, profit: 78, aioFit: 84, snsLook: 88, recommendation: 86 },
  { item: "土", market: 76, brandFit: 91, profit: 64, aioFit: 92, snsLook: 58, recommendation: 80 },
  { item: "肥料", market: 73, brandFit: 82, profit: 70, aioFit: 86, snsLook: 54, recommendation: 76 },
  { item: "ガーデングッズ", market: 80, brandFit: 84, profit: 74, aioFit: 72, snsLook: 81, recommendation: 82 },
  { item: "ペット用品", market: 84, brandFit: 79, profit: 77, aioFit: 64, snsLook: 90, recommendation: 81 },
  { item: "ライフスタイル雑貨", market: 78, brandFit: 76, profit: 73, aioFit: 60, snsLook: 86, recommendation: 74 },
  { item: "PDF教材", market: 74, brandFit: 88, profit: 91, aioFit: 94, snsLook: 68, recommendation: 89 },
  { item: "Knowledge Castスポンサー枠", market: 62, brandFit: 81, profit: 87, aioFit: 78, snsLook: 55, recommendation: 75 },
];

export const knowledgeVaultItems: KnowledgeVaultItem[] = [
  { title: "FAQ", description: "AIが引用しやすい質問と短答を蓄積。" },
  { title: "用語集", description: "専門語を一貫した定義でOperating。" },
  { title: "比較表", description: "植物、土、鉢、肥料、商品を比較可能にする。" },
  { title: "商品導線", description: "知識から自然な購入導線を設計。" },
  { title: "SNS展開", description: "Instagram、Threads、Pinterestへ変換。" },
  { title: "Podcast化", description: "寝ながら聞ける知識番組へ展開。" },
  { title: "YouTube化", description: "台本、タイトル、構成へ変換。" },
  { title: "Blog化", description: "AIOに強い記事へ整理。" },
  { title: "AI引用ブロック", description: "短い要約、根拠、比較をセット化。" },
];

export const activityTimeline: ActivityTimelineItem[] = [
  { id: "t-0600", time: "06:00", title: "Daily Brief生成", detail: "今日の最重要判断とやらない方がいいことを整理。", engine: "Research Engine" },
  { id: "t-0720", time: "07:20", title: "AIO候補抽出", detail: "土壌改良、発根、水やり頻度のAI引用候補を抽出。", engine: "AIO Intelligence Engine" },
  { id: "t-0910", time: "09:10", title: "Instagram改善案生成", detail: "保存率改善のリード文とカルーセル構成を生成。", engine: "SNS Health Engine" },
  { id: "t-1230", time: "12:30", title: "商品候補スコアリング", detail: "鉢、土、肥料、発根用品の市場性と利益可能性を採点。", engine: "Product Opportunity Engine" },
  { id: "t-1800", time: "18:00", title: "Knowledge Cast台本生成", detail: "寝ながら聞けるAI読み聞かせ台本を生成。", engine: "Knowledge Cast Engine" },
  { id: "t-2200", time: "22:00", title: "Learning Loop更新", detail: "保存率、CTR、AIO流入、商品クリックから次回改善案を生成。", engine: "Learning Loop Engine" },
];

export const decisionLogs: DecisionLog[] = [
  { id: "d-routing", title: "ロストラータ土壌改善をVERDNAに提案", basis: "検索意図、商品導線、既存Knowledge Vaultとの接続が強い。", expectedEffect: "AIO流入、保存率、発根用品クリックの増加。", risk: "専門性が強すぎると初心者が離脱する。", nextAction: "FAQ、比較表、短尺動画、商品紹介へ分解して承認へ回す。" },
  { id: "d-rewrite", title: "Instagram投稿は結論先出しへ変更", basis: "過去投稿で冒頭2秒の離脱が高く、保存率が伸びにくい。", expectedEffect: "保存率とThreads再利用率の改善。", risk: "説明不足に見える可能性がある。", nextAction: "1枚目に結論、2枚目に理由、3枚目に比較表を配置。" },
];

export const systemHealth: SystemHealthItem[] = [
  { label: "Active engines", value: "10/11", detail: "1 engine waiting approval" },
  { label: "Pending approvals", value: String(approvalItems.length), detail: "executive decisions only" },
  { label: "Approved today", value: "0", detail: "updates in local MVP" },
  { label: "On hold", value: "0", detail: "updates in local MVP" },
  { label: "Rejected", value: "0", detail: "updates in local MVP" },
  { label: "Assets created", value: "34", detail: "mock data / API-ready" },
];

export const automationRules: AutomationRule[] = [
  { title: "毎朝 Daily Brief 作成", cadence: "Daily / 06:00", target: "ニュース、SNS、EC、AIO候補を要約", status: "Active" },
  { title: "毎日 Content Opportunity 抽出", cadence: "Daily / 07:00", target: "Broadcast Mission候補を生成", status: "Active" },
  { title: "毎週 SNS Health Intelligence", cadence: "Weekly / Monday", target: "保存率、CTR、維持率、反応率を改善案に変換", status: "Draft" },
  { title: "毎週 Commerce Analytics 更新", cadence: "Weekly / Friday", target: "流入、クリック、購入、売上、改善案を更新", status: "Draft" },
];
