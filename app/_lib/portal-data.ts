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
  InstagramAnalytics,
  IntegrationStatus,
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
] satisfies Array<{ label: string; active?: boolean; badge?: string }>;

export const aiEngines = [
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
] satisfies AiEngine[];

export const executiveBrief = [
  { label: "今日の最重要判断", value: "ロストラータ土壌改善を公開するか", detail: "AIO、SNS、商品導線が同時に高いBroadcast Mission。" },
  { label: "今日の配信候補", value: "0円でできる土壌改良", detail: "Instagram、Blog、FAQ、Knowledge Castへ展開可能。" },
  { label: "AIOで伸びそうなテーマ", value: "ドライガーデンの水やり頻度", detail: "検索意図が明確でAI回答に引用されやすい。" },
  { label: "SNS改善ポイント", value: "冒頭2秒で結論を出す", detail: "Shorts維持率とInstagram保存率に影響。" },
  { label: "売上につながる商品候補", value: "発根管理セット / 鉢 / 土", detail: "悩みが深く、比較表と商品導線が自然。" },
  { label: "今日はやらない方がいいこと", value: "根拠の薄い即効テクニック投稿", detail: "信頼性とAIO引用適性を下げるリスク。" },
] satisfies ExecutiveBriefItem[];

export const approvalItems = [
  { id: "cast-rostrata", type: "Knowledge Cast台本", title: "ロストラータを太く育てる方法", brand: "VERDNA", reason: "保存性とAIO引用適性が高く、商品導線にも接続可能。", status: "Pending" },
  { id: "ig-lead", type: "Instagramリード文", title: "0円でできる土壌改良", brand: "VERDNA", reason: "保存率改善のため冒頭に結論と保存理由を追加。", status: "Pending" },
  { id: "youtube-title", type: "YouTubeタイトル", title: "アガベの発根で失敗しない3つの条件", brand: "VERDNA", reason: "CTR改善とFAQ化の両方に向く。", status: "Pending" },
  { id: "product-offer", type: "商品提案", title: "発根管理スターターセット", brand: "VERDNA", reason: "商品クリックから購入までの距離が短い。", status: "Pending" },
  { id: "aio-faq", type: "AIO改善", title: "ドライガーデン水やり頻度FAQ", brand: "VERDNA", reason: "AI検索に拾われる質問形式へ変換済み。", status: "Pending" },
  { id: "brand-routing", type: "Brand Routing提案", title: "ウッドフェンスBefore/After", brand: "YUGAWA Residence", reason: "外構、住宅資産、DIY文脈に最適。", status: "Pending" },
] satisfies ApprovalItem[];

export const userBrands = [
  { id: "verdna", name: "VERDNA", domain: "植物 / ドライガーデン / Knowledge Cast", publicStatus: "Private", aioScore: 86, snsHealth: 74, knowledgeAssets: 128, commercePotential: "High", approvalsPending: 5, nextAction: "ロストラータ土壌改善をBroadcast Mission化" },
  { id: "residence", name: "YUGAWA Residence", domain: "住宅資産 / 外構 / 庭 / インテリア / DIY", publicStatus: "Draft", aioScore: 78, snsHealth: 69, knowledgeAssets: 84, commercePotential: "Medium", approvalsPending: 3, nextAction: "ウッドフェンスBefore/Afterを整理" },
  { id: "pajour", name: "PAJOUR", domain: "個人ブランド / デザイン / DJ / 料理 / ライフスタイル", publicStatus: "Private", aioScore: 72, snsHealth: 81, knowledgeAssets: 63, commercePotential: "Medium", approvalsPending: 2, nextAction: "DJとAIライフスタイルのシリーズ化" },
  { id: "titi-joji", name: "titi&joji", domain: "ペット / カリフォルニアライフスタイル / SNS", publicStatus: "Private", aioScore: 64, snsHealth: 88, knowledgeAssets: 41, commercePotential: "High", approvalsPending: 2, nextAction: "庭で遊ぶ犬たちの短尺動画を準備" },
] satisfies UserBrand[];

export const broadcastIdeas = [
  {
    id: "soil-free",
    title: "0円でできる土壌改良",
    priority: "High",
    aioScore: 94,
    snsPotential: 88,
    productFit: 82,
    suggestedBrand: "VERDNA",
    status: "Ready",
    whyNow: ["検索トレンドが先週比+38%", "梅雨時期で需要が増加", "保存率が高いテーマ", "初心者向けコンテンツ不足"],
    hotWords: ["コンポスト", "腐葉土", "家庭菜園", "自然農法", "ロストラータ"],
    aiInsight: "初心者が保存しやすく、8〜10分のKnowledge CastとInstagramカルーセルの両方に展開しやすいテーマです。",
    suggestedLead: "お金をかけずに、家庭菜園の土を改善できる方法をご存知ですか？\n今回は0円で始められる土壌改良をご紹介します。",
    suggestedStructure: ["Hook", "Problem", "Solution", "Knowledge", "Product", "CTA"],
    whySelected: ["無料で始められるため心理的ハードルが低い", "FAQ化しやすくAIO引用に向く", "土・肥料・ガーデングッズ導線を自然に作れる"],
    trendSources: ["Google Trends", "YouTube", "Instagram", "Pinterest", "Reddit", "Search Console"],
    similarWinningContent: [
      { title: "初心者でもできる土づくり", channel: "YouTube", reason: "保存率が高い構成", estimatedSignal: "Mock: watch intent high" },
      { title: "ビフォーアフター", channel: "Instagram", reason: "カルーセルとの相性が高い", estimatedSignal: "Mock: saves +28%" },
      { title: "無料でできる家庭菜園", channel: "Blog", reason: "SEO流入が安定", estimatedSignal: "Mock: evergreen" },
    ],
    contentOpportunities: ["YouTube", "Knowledge Cast", "Instagram Carousel", "Threads", "Pinterest", "Blog", "PDF教材"],
    productOpportunities: ["培養土", "鉢", "肥料", "ガーデングッズ", "PDFガイド"],
    confidenceScore: 94,
    expectedImpact: { aio: 92, seo: 88, sns: 95, saves: 91, productPath: 84 },
  },
  {
    id: "rostrata-fat",
    title: "ロストラータを太く育てる方法",
    priority: "High",
    aioScore: 92,
    snsPotential: 84,
    productFit: 91,
    suggestedBrand: "VERDNA",
    status: "Ready",
    whyNow: ["春夏の成長期で検索需要が増加", "育成失敗の相談が増えている", "専門性でブランド信頼を作れる"],
    hotWords: ["ロストラータ", "幹を太く", "水やり", "用土", "ドライガーデン"],
    aiInsight: "専門性が高く、YouTube解説とBlog FAQで長期流入を狙いやすいテーマです。",
    suggestedLead: "ロストラータを太く育てたいなら、まず見るべきは肥料よりも根と用土です。\n太く育つ環境の考え方を整理します。",
    suggestedStructure: ["Hook", "Problem", "Solution", "Knowledge", "Product", "CTA"],
    whySelected: ["悩みが具体的で検索意図が強い", "用土・鉢・肥料の比較に展開できる", "VERDNAの専門性と相性が高い"],
    trendSources: ["Google Trends", "YouTube", "Instagram", "Pinterest", "Reddit", "Search Console"],
    similarWinningContent: [
      { title: "幹を太くする育成環境", channel: "YouTube", reason: "長尺解説との相性が高い", estimatedSignal: "Mock: retention 62%" },
      { title: "成長比較カルーセル", channel: "Instagram", reason: "Before/Afterが強い", estimatedSignal: "Mock: saves +22%" },
      { title: "ロストラータ用土の選び方", channel: "Blog", reason: "検索意図が明確", estimatedSignal: "Mock: SEO stable" },
    ],
    contentOpportunities: ["YouTube", "Knowledge Cast", "Instagram Carousel", "Blog", "FAQ"],
    productOpportunities: ["鉢", "用土", "肥料", "ガーデングッズ", "PDFガイド"],
    confidenceScore: 91,
    expectedImpact: { aio: 90, seo: 86, sns: 84, saves: 88, productPath: 92 },
  },
  {
    id: "agave-root",
    title: "アガベの発根",
    priority: "High",
    aioScore: 89,
    snsPotential: 81,
    productFit: 93,
    suggestedBrand: "VERDNA",
    status: "Ready",
    whyNow: ["発根管理の失敗談がSNSで増加", "用品比較への関心が高い", "商品導線が作りやすい"],
    hotWords: ["アガベ", "発根", "ベアルート", "管理温度", "用土"],
    aiInsight: "失敗回避ニーズが強く、商品比較とFAQに変換しやすいテーマです。",
    suggestedLead: "アガベの発根で失敗しやすい原因は、気合いではなく環境のズレです。\n温度・水分・用土の3点から整理します。",
    suggestedStructure: ["Hook", "Problem", "Solution", "Knowledge", "Product", "CTA"],
    whySelected: ["購入直後の不安に直結する", "発根用品への導線が自然", "FAQと比較表の資産化に向く"],
    trendSources: ["Google Trends", "YouTube", "Instagram", "Pinterest", "Reddit", "Search Console"],
    similarWinningContent: [
      { title: "発根管理の失敗例", channel: "YouTube", reason: "悩み起点で視聴されやすい", estimatedSignal: "Mock: CTR high" },
      { title: "発根ビフォーアフター", channel: "Instagram", reason: "視覚変化が強い", estimatedSignal: "Mock: saves +19%" },
      { title: "発根に必要な条件", channel: "Blog", reason: "FAQ流入が見込める", estimatedSignal: "Mock: AIO fit" },
    ],
    contentOpportunities: ["YouTube", "Instagram Carousel", "Threads", "Blog", "PDF教材"],
    productOpportunities: ["発根管理セット", "用土", "鉢", "温度計", "PDFガイド"],
    confidenceScore: 90,
    expectedImpact: { aio: 87, seo: 82, sns: 83, saves: 86, productPath: 94 },
  },
  {
    id: "wood-fence",
    title: "ウッドフェンスのビフォーアフター",
    priority: "Medium",
    aioScore: 76,
    snsPotential: 92,
    productFit: 78,
    suggestedBrand: "YUGAWA Residence",
    status: "Ready",
    whyNow: ["外構DIY需要が週末前に伸びる", "Before/After型がSNSで強い", "住宅資産文脈に接続できる"],
    hotWords: ["ウッドフェンス", "外構DIY", "庭づくり", "目隠し", "ビフォーアフター"],
    aiInsight: "InstagramとPinterestで反応が取りやすく、住宅資産ブランドの信頼形成に向くテーマです。",
    suggestedLead: "庭の印象は、フェンスひとつで大きく変わります。\n今回はウッドフェンスのBefore/Afterから、外構DIYの考え方を整理します。",
    suggestedStructure: ["Hook", "Problem", "Solution", "Knowledge", "Product", "CTA"],
    whySelected: ["視覚変化が強くSNS向き", "DIY用品への導線が作れる", "YUGAWA Residenceの資産価値文脈に合う"],
    trendSources: ["Google Trends", "YouTube", "Instagram", "Pinterest", "Reddit", "Search Console"],
    similarWinningContent: [
      { title: "庭DIYのBefore/After", channel: "Instagram", reason: "カルーセル完読率が高い", estimatedSignal: "Mock: completion high" },
      { title: "外構DIYの手順", channel: "YouTube", reason: "工程解説が見られる", estimatedSignal: "Mock: 8min fit" },
      { title: "目隠しフェンス費用", channel: "Blog", reason: "比較検索が安定", estimatedSignal: "Mock: SEO stable" },
    ],
    contentOpportunities: ["YouTube", "Instagram Carousel", "Pinterest", "Blog"],
    productOpportunities: ["木材", "塗料", "工具", "ガーデングッズ"],
    confidenceScore: 84,
    expectedImpact: { aio: 74, seo: 80, sns: 94, saves: 89, productPath: 78 },
  },
  {
    id: "pet-garden",
    title: "ペットと庭のライフスタイル",
    priority: "Medium",
    aioScore: 70,
    snsPotential: 94,
    productFit: 84,
    suggestedBrand: "titi&joji",
    status: "Ready",
    whyNow: ["屋外ライフスタイル投稿が伸びている", "ペット用品導線と相性が良い", "短尺動画で拡散しやすい"],
    hotWords: ["犬と庭", "ペット用品", "カリフォルニアライフ", "庭遊び", "安全対策"],
    aiInsight: "感情訴求が強く、ShortsとInstagram Reelsで拡散しやすいテーマです。",
    suggestedLead: "庭で過ごす時間は、ペットにとっても家族にとっても小さなイベントです。\n安全に楽しむための工夫をまとめます。",
    suggestedStructure: ["Hook", "Problem", "Solution", "Knowledge", "Product", "CTA"],
    whySelected: ["SNS映えが強い", "ペット用品導線を自然に入れられる", "titi&jojiの世界観に合う"],
    trendSources: ["Google Trends", "YouTube", "Instagram", "Pinterest", "Reddit", "Search Console"],
    similarWinningContent: [
      { title: "庭で遊ぶ犬の1日", channel: "Instagram", reason: "感情訴求が強い", estimatedSignal: "Mock: engagement high" },
      { title: "ペットと庭の安全対策", channel: "Blog", reason: "不安解消型で検索される", estimatedSignal: "Mock: SEO niche" },
      { title: "屋外ペット用品レビュー", channel: "YouTube", reason: "商品比較に向く", estimatedSignal: "Mock: product intent" },
    ],
    contentOpportunities: ["YouTube", "Instagram Carousel", "Threads", "Pinterest", "Blog"],
    productOpportunities: ["ペット用品", "ガーデングッズ", "ライフスタイル雑貨", "PDFガイド"],
    confidenceScore: 86,
    expectedImpact: { aio: 68, seo: 72, sns: 95, saves: 87, productPath: 86 },
  },
] satisfies BroadcastIdea[];

export const contentReview = {
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
} satisfies ContentReview;

export const snsHealth = [
  { channel: "Instagram", metric: "保存率", value: "6.8%", issue: "保存理由が冒頭で伝わりにくい。", nextPost: "土壌改良3ステップのカルーセル" },
  { channel: "YouTube", metric: "CTR", value: "4.1%", issue: "タイトルが説明的でベネフィットが弱い。", nextPost: "ロストラータを太くする土の作り方" },
  { channel: "Shorts", metric: "維持率", value: "61%", issue: "冒頭2秒で結論が出ていない。", nextPost: "失敗例から始める15秒構成" },
  { channel: "Threads", metric: "反応率", value: "3.4%", issue: "問いかけが少なく会話が伸びにくい。", nextPost: "植物の失敗談を質問形式で投稿" },
  { channel: "Pinterest", metric: "保存数", value: "128", issue: "比較表系の縦長画像が不足。", nextPost: "鉢・土・肥料の選び方ピン" },
] satisfies SnsHealthItem[];

export const commerceAnalytics = [
  { post: "アガベ発根セット紹介", traffic: "1,240", productClicks: "186", purchases: "14", cvr: "7.5%", revenue: "¥84,000", soldReason: "悩みが明確で商品導線が自然だった。", missedReason: "比較表がなく初心者の不安が残った。", nextAction: "発根用品の比較表とFAQを追加。" },
  { post: "庭で使うペット用品", traffic: "840", productClicks: "96", purchases: "5", cvr: "5.2%", revenue: "¥31,500", soldReason: "犬の日常シーンが自然で共感されやすい。", missedReason: "サイズ感、耐久性、価格比較が不足。", nextAction: "titi&jojiでレビュー型投稿に再構成。" },
] satisfies CommerceAnalyticsItem[];

export const productOpportunities = [
  { item: "植物", market: 88, brandFit: 94, profit: 72, aioFit: 90, snsLook: 92, recommendation: 91 },
  { item: "鉢", market: 82, brandFit: 89, profit: 78, aioFit: 84, snsLook: 88, recommendation: 86 },
  { item: "土", market: 76, brandFit: 91, profit: 64, aioFit: 92, snsLook: 58, recommendation: 80 },
  { item: "肥料", market: 73, brandFit: 82, profit: 70, aioFit: 86, snsLook: 54, recommendation: 76 },
  { item: "ガーデングッズ", market: 80, brandFit: 84, profit: 74, aioFit: 72, snsLook: 81, recommendation: 82 },
  { item: "ペット用品", market: 84, brandFit: 79, profit: 77, aioFit: 64, snsLook: 90, recommendation: 81 },
  { item: "ライフスタイル雑貨", market: 78, brandFit: 76, profit: 73, aioFit: 60, snsLook: 86, recommendation: 74 },
  { item: "PDF教材", market: 74, brandFit: 88, profit: 91, aioFit: 94, snsLook: 68, recommendation: 89 },
  { item: "Knowledge Castスポンサー枠", market: 62, brandFit: 81, profit: 87, aioFit: 78, snsLook: 55, recommendation: 75 },
] satisfies ProductOpportunity[];

export const knowledgeVaultItems = [
  { title: "FAQ", description: "AIが引用しやすい質問と短答を蓄積。" },
  { title: "用語集", description: "専門語を一貫した定義でOperating。" },
  { title: "比較表", description: "植物、土、鉢、肥料、商品を比較可能にする。" },
  { title: "商品導線", description: "知識から自然な購入導線を設計。" },
  { title: "SNS展開", description: "Instagram、Threads、Pinterestへ変換。" },
  { title: "Podcast化", description: "寝ながら聞ける知識番組へ展開。" },
  { title: "YouTube化", description: "台本、タイトル、構成へ変換。" },
  { title: "Blog化", description: "AIOに強い記事へ整理。" },
  { title: "AI引用ブロック", description: "短い要約、根拠、比較をセット化。" },
] satisfies KnowledgeVaultItem[];

export const activityTimeline = [
  { id: "t-0600", time: "06:00", title: "Daily Brief生成", detail: "今日の最重要判断とやらない方がいいことを整理。", engine: "Research Engine" },
  { id: "t-0720", time: "07:20", title: "AIO候補抽出", detail: "土壌改良、発根、水やり頻度のAI引用候補を抽出。", engine: "AIO Intelligence Engine" },
  { id: "t-0910", time: "09:10", title: "Instagram改善案生成", detail: "保存率改善のリード文とカルーセル構成を生成。", engine: "SNS Health Engine" },
  { id: "t-1230", time: "12:30", title: "商品候補スコアリング", detail: "鉢、土、肥料、発根用品の市場性と利益可能性を採点。", engine: "Product Opportunity Engine" },
  { id: "t-1800", time: "18:00", title: "Knowledge Cast台本生成", detail: "寝ながら聞けるAI読み聞かせ台本を生成。", engine: "Knowledge Cast Engine" },
  { id: "t-2200", time: "22:00", title: "Learning Loop更新", detail: "保存率、CTR、AIO流入、商品クリックから次回改善案を生成。", engine: "Learning Loop Engine" },
] satisfies ActivityTimelineItem[];

export const decisionLogs = [
  { id: "d-routing", title: "ロストラータ土壌改善をVERDNAに提案", basis: "検索意図、商品導線、既存Knowledge Vaultとの接続が強い。", expectedEffect: "AIO流入、保存率、発根用品クリックの増加。", risk: "専門性が強すぎると初心者が離脱する。", nextAction: "FAQ、比較表、短尺動画、商品紹介へ分解して承認へ回す。" },
  { id: "d-rewrite", title: "Instagram投稿は結論先出しへ変更", basis: "過去投稿で冒頭2秒の離脱が高く、保存率が伸びにくい。", expectedEffect: "保存率とThreads再利用率の改善。", risk: "説明不足に見える可能性がある。", nextAction: "1枚目に結論、2枚目に理由、3枚目に比較表を配置。" },
] satisfies DecisionLog[];

export const systemHealth = [
  { label: "Active engines", value: "10/11", detail: "1 engine waiting approval" },
  { label: "Pending approvals", value: String(approvalItems.length), detail: "executive decisions only" },
  { label: "Approved today", value: "0", detail: "updates in local MVP" },
  { label: "On hold", value: "0", detail: "updates in local MVP" },
  { label: "Rejected", value: "0", detail: "updates in local MVP" },
  { label: "Assets created", value: "34", detail: "mock data / API-ready" },
] satisfies SystemHealthItem[];

export const automationRules = [
  { title: "毎朝 Daily Brief 作成", cadence: "Daily / 06:00", target: "ニュース、SNS、EC、AIO候補を要約", status: "Active" },
  { title: "毎日 Content Opportunity 抽出", cadence: "Daily / 07:00", target: "Broadcast Mission候補を生成", status: "Active" },
  { title: "毎週 SNS Health Intelligence", cadence: "Weekly / Monday", target: "保存率、CTR、維持率、反応率を改善案に変換", status: "Draft" },
  { title: "毎週 Commerce Analytics 更新", cadence: "Weekly / Friday", target: "流入、クリック、購入、売上、改善案を更新", status: "Draft" },
] satisfies AutomationRule[];

export const instagramAnalytics = {
  connectionStatus: "mock",
  account: "@tomos_private_workspace",
  accountRequirement: "Business / Creator Account required",
  lastSync: "Mock sync / API-ready",
  followers: 18420,
  reach: 42600,
  impressions: 78100,
  saves: 1268,
  engagementRate: "6.8%",
  snsHealthScore: 82,
  topPosts: [
    { id: "ig-01", title: "0円でできる土壌改良", saves: 412, reach: 12400, engagementRate: "8.1%" },
    { id: "ig-02", title: "ロストラータを太く育てる方法", saves: 336, reach: 9800, engagementRate: "7.4%" },
    { id: "ig-03", title: "庭で遊ぶ犬たち", saves: 288, reach: 15200, engagementRate: "6.9%" },
  ],
} satisfies InstagramAnalytics;

export const integrationStatuses = [
  { id: "instagram", name: "Instagram", status: "API-ready", detail: "Meta Instagram Graph APIへ置き換え予定" },
  { id: "openai", name: "OpenAI", status: "API-ready", detail: "Executive Brief / Content Review / AIO提案" },
  { id: "youtube", name: "YouTube", status: "Planned", detail: "動画CTR、維持率、タイトル改善" },
  { id: "analytics", name: "Google Analytics", status: "Planned", detail: "流入、CV、コンテンツ別成果" },
  { id: "search-console", name: "Search Console", status: "Planned", detail: "検索意図、表示回数、AIO候補" },
  { id: "commerce", name: "Shopify / BASE / Mercari", status: "Planned", detail: "商品クリック、購入、売上連携" },
] satisfies IntegrationStatus[];
