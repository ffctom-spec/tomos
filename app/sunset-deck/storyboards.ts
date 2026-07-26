export type StoryboardScene = {
  id: number;
  title: string;
  timecode: string;
  visual: string;
  narration: string;
  onScreen: string;
  audio: string;
  purpose: string;
  assets: string[];
  missing?: string[];
};

export type EpisodeStoryboard = {
  logline: string;
  audience: string;
  searchableTitle: string;
  curiosityTitle: string;
  description: string;
  keywords: string[];
  questions: string[];
  chapters: string[];
  scenes: StoryboardScene[];
};

const common = {
  audience: '庭・食・暮らし・歴史を、映像で深く知りたい25〜55歳',
};

export const storyboards: Record<number, EpisodeStoryboard> = {
  1: {
    ...common,
    logline: '飢餓と混乱の時代、人類が庭をつくることで未来をつないだ歴史を描く。',
    searchableTitle: '家庭菜園はなぜ人類を救ったのか｜戦争・飢饉と庭の歴史',
    curiosityTitle: 'スーパーから食べ物が消えた日、人は庭を掘り始めた',
    description: '戦争、飢饉、都市封鎖。食料が途絶えたとき、人々を支えたのは小さな庭でした。家庭菜園とビクトリーガーデンの歴史を、現代の庭づくりへつなげる映像ドキュメンタリーです。',
    keywords: ['家庭菜園', 'ビクトリーガーデン', '食料危機', '庭の歴史', '自給自足', 'ドキュメンタリー'],
    questions: ['家庭菜園はいつ始まった？', 'ビクトリーガーデンとは？', '食料危機に庭は役立つ？'],
    chapters: ['00:00 食べ物が消えた朝', '00:25 都市と飢餓', '01:20 庭が生存装置になった', '03:10 ビクトリーガーデン', '06:40 現代の庭へ'],
    scenes: [
      { id: 1, title: 'OPENING HOOK', timecode: '0:00–0:25', visual: '空になったスーパーの棚を、低い目線でゆっくり前進する。', narration: 'もし明日、スーパーから食べ物が消えたら。あなたは何日、生きられますか。', onScreen: 'あなたは何日、生きられますか。', audio: '低い環境音。5秒の無音から脈動を立ち上げる。', purpose: '危機感を一瞬でつくり、視聴継続の理由を提示する。', assets: ['空の棚・静止画', '店舗環境音'] },
      { id: 2, title: 'THE CITY WITHOUT FOOD', timecode: '0:25–1:20', visual: '古い都市写真、配給列、地図をテンポよく重ねる。', narration: '都市は、食べ物をつくらない。運ぶ仕組みが止まれば、豊かさは数日で消える。', onScreen: '都市は「運ばれる食料」で生きている。', audio: '遠いサイレン、列車音。', purpose: '問題の構造を短く理解させる。', assets: ['歴史写真', '都市地図'], missing: ['配給列の高解像度素材'] },
      { id: 3, title: 'SEED OF SURVIVAL', timecode: '1:20–3:10', visual: '手のひらの種、土を掘る手、芽吹きのマクロ。', narration: '人々は空き地を耕した。庭は装飾ではなく、生き延びるための装置になった。', onScreen: 'GARDEN = SURVIVAL INFRASTRUCTURE', audio: '土を掘る音、呼吸音、弦の低音。', purpose: '庭の意味を美観から生存へ反転させる。', assets: ['種・手元撮影', '土の接写'] },
      { id: 4, title: 'VICTORY GARDENS', timecode: '3:10–6:40', visual: 'ポスター、家庭の庭、収穫する家族を時代順に見せる。', narration: '戦時中、庭は国の政策になった。小さな区画の集合が、巨大な食料供給を支えた。', onScreen: '数百万の小さな庭が、ひとつの供給網になった。', audio: 'ニュース映画風のリズムから現代音へ。', purpose: '歴史的根拠とスケール感を与える。', assets: ['パブリックドメインポスター', '庭のアーカイブ映像'] },
      { id: 5, title: 'THE GARDEN TODAY', timecode: '6:40–9:20', visual: '現代の住宅地、YUGAWA邸の庭、収穫から食卓へ。', narration: '危機がない時代にも、庭は私たちを守る。食べ物だけではない。知識と、地域と、未来への自信を育てる。', onScreen: 'Every Garden Has a Story.', audio: '温かいピアノと自然音。', purpose: 'ブランドの現在地へ着地し、次話へ誘導する。', assets: ['YUGAWA邸実写', '食卓カット'], missing: ['完成庭の夕景'] },
    ],
  },
  2: {
    ...common,
    logline: '子どもの好き嫌いが、生まれつきではなく経験から形づくられる過程を追う。',
    searchableTitle: '子どもの好き嫌いはなぜ起こる？味覚が育つ仕組みと食育',
    curiosityTitle: 'その野菜嫌い、本当に味のせいですか？',
    description: '子どもが野菜を嫌う理由を、味覚・記憶・家庭環境・食体験から解き明かします。無理に食べさせるのではなく、好きになる入口を設計する食育ドキュメンタリーです。',
    keywords: ['食育', '好き嫌い', '子ども', '味覚', '野菜嫌い', '偏食'],
    questions: ['子どもはなぜ野菜を嫌う？', '味覚は何歳までに決まる？', '好き嫌いを減らす方法は？'],
    chapters: ['00:00 嫌いは味のせい？', '00:30 味覚は学習される', '02:10 記憶と食卓', '04:30 庭で変わる食体験', '07:10 無理に食べさせない'],
    scenes: [
      { id: 1, title: 'THE FIRST BITE', timecode: '0:00–0:30', visual: '子どもが野菜を前に止まる表情。料理の湯気をクローズアップ。', narration: '嫌いな野菜は、本当に味が嫌いなのでしょうか。', onScreen: '「嫌い」はどこから来る？', audio: '食器音を強調し、音楽は最小限。', purpose: '親が抱える日常的な疑問を提示する。', assets: ['食卓実写'], missing: ['子どもの表情カット'] },
      { id: 2, title: 'TASTE IS LEARNED', timecode: '0:30–2:10', visual: '舌の図解、味覚のレイヤー、食経験の反復。', narration: '味覚は完成品ではない。経験によって更新される、小さな学習システムです。', onScreen: 'TASTE = EXPERIENCE × MEMORY', audio: '軽い電子音と木琴。', purpose: '科学的な核を分かりやすく伝える。', assets: ['味覚図解'] },
      { id: 3, title: 'MEMORY AT THE TABLE', timecode: '2:10–4:30', visual: '叱られる食卓と、会話のある食卓を対比する。', narration: '同じ味でも、どんな空気の中で食べたかによって、記憶は変わります。', onScreen: '味だけでなく、空気も記憶される。', audio: '緊張音から生活音へ切り替える。', purpose: '家庭の雰囲気と味覚を接続する。', assets: ['食卓再現カット'] },
      { id: 4, title: 'GROW IT, TOUCH IT, TASTE IT', timecode: '4:30–7:10', visual: '庭で苗に触れ、収穫し、洗って食べる一連の動作。', narration: '育てた野菜は、知らない食べ物ではなくなる。触れた時間が、食べる勇気をつくる。', onScreen: '育てることは、味を知ること。', audio: '庭の自然音、明るい弦。', purpose: 'SUNSET DECKらしい食育解決策を示す。', assets: ['家庭菜園実写'], missing: ['収穫から調理の連続映像'] },
      { id: 5, title: 'INVITATION, NOT FORCE', timecode: '7:10–8:10', visual: '小さな一口を選ぶ手、笑顔、食卓の引き。', narration: '食育は、完食させることではない。もう一度出会える入口を、残しておくことです。', onScreen: '強制ではなく、再会の入口を。', audio: '余韻のあるピアノ。', purpose: '実践的で優しい結論へ着地する。', assets: ['食卓エンディング'] },
    ],
  },
  3: {
    ...common,
    logline: '土に触れたとき心が落ち着く理由を、感覚・記憶・微生物から探る。',
    searchableTitle: '土に触れると落ち着くのはなぜ？園芸と心の科学',
    curiosityTitle: '人は、土から離れすぎたのかもしれない',
    description: '土の匂い、手触り、微生物、幼少期の記憶。園芸が心に与える影響を科学と物語で読み解きます。',
    keywords: ['園芸療法', '土', 'メンタルヘルス', 'ガーデニング', '微生物'],
    questions: ['土に触れるとストレスは減る？', '園芸療法とは？'],
    chapters: ['00:00 土の匂い', '01:10 手が覚えている', '03:00 園芸と心', '05:20 日常に土を戻す'],
    scenes: [
      { id: 1, title: 'THE SMELL AFTER RAIN', timecode: '0:00–0:45', visual: '雨上がりの土、指先、蒸気。', narration: '雨のあと、土の匂いに安心したことはありませんか。', onScreen: 'なぜ、土は懐かしいのか。', audio: '雨音と呼吸。', purpose: '身体感覚から入る。', assets: ['雨上がりの庭'] },
      { id: 2, title: 'THE HAND REMEMBERS', timecode: '0:45–2:20', visual: '土を握る手と幼少期の庭を重ねる。', narration: '人の記憶は、言葉だけではなく手にも残る。', onScreen: '触覚の記憶', audio: '柔らかな低音。', purpose: '感覚と記憶をつなぐ。', assets: ['手元実写'] },
      { id: 3, title: 'GARDEN THERAPY', timecode: '2:20–5:20', visual: '園芸作業、心拍の図、病院庭園。', narration: '園芸は、成果よりも反復が心を整える。', onScreen: '小さな作業が、時間を整える。', audio: '一定テンポの環境音。', purpose: '科学的説明を加える。', assets: ['図解'], missing: ['療法庭園素材'] },
      { id: 4, title: 'RETURN TO SOIL', timecode: '5:20–7:40', visual: 'ベランダの鉢、庭、家族の手。', narration: '大きな庭はいらない。ひと鉢の土でも、日常は変わる。', onScreen: 'Start with one pot.', audio: '自然音とピアノ。', purpose: '行動につなげる。', assets: ['鉢植え実写'] },
    ],
  },
  4: {
    ...common,
    logline: '一本のロストラータが、庭と家の見え方を変える理由を造形から解く。',
    searchableTitle: 'ユッカ・ロストラータで庭が変わる理由｜ドライガーデンの構図',
    curiosityTitle: '庭の印象は、一本の植物で変えられる',
    description: 'ユッカ・ロストラータのシルエット、余白、配置、照明を通して、高級感のあるドライガーデンの作り方を解説します。',
    keywords: ['ロストラータ', 'ドライガーデン', '外構', '植栽デザイン', '庭づくり'],
    questions: ['ロストラータはどこに植える？', 'ドライガーデンを高見えさせる方法は？'],
    chapters: ['00:00 一本で変わる', '00:40 建築的な葉', '02:20 余白と配置', '04:30 光で完成する'],
    scenes: [
      { id: 1, title: 'ONE PLANT', timecode: '0:00–0:40', visual: '何もない庭からロストラータへマッチカット。', narration: 'たった一本の植物が、家の印象を変える。', onScreen: 'ONE PLANT CHANGES THE HOUSE.', audio: '低い衝撃音。', purpose: '変化を視覚で見せる。', assets: ['設置前後写真'] },
      { id: 2, title: 'ARCHITECTURE OF LEAVES', timecode: '0:40–2:20', visual: '葉の放射、幹、影を建築線として図解。', narration: 'ロストラータは植物でありながら、一本の建築です。', onScreen: 'LINE / VOLUME / SHADOW', audio: 'ミニマルな電子音。', purpose: '造形の特徴を理解させる。', assets: ['葉の接写'] },
      { id: 3, title: 'SPACE AROUND IT', timecode: '2:20–4:30', visual: '悪い配置と良い配置を比較する。', narration: '高く見せるのは植物の値段ではない。周囲に残した余白です。', onScreen: '余白が主役をつくる。', audio: '静かなクリック音。', purpose: '配置の原則を示す。', assets: ['配置図'] },
      { id: 4, title: 'LIGHT COMPLETES THE FORM', timecode: '4:30–6:50', visual: '夕景、下からの照明、葉影。', narration: '昼に植え、夜に完成する。光が葉の構造をもう一度描く。', onScreen: 'DESIGNED BY DAY. COMPLETED AT NIGHT.', audio: '暖かいシンセ。', purpose: '照明とブランド美学へ着地。', assets: ['夜景'], missing: ['完成後の照明動画'] },
    ],
  },
  5: {
    ...common,
    logline: '人類最初の家庭菜園が、美しさではなく必要から生まれた物語。',
    searchableTitle: '世界最初の家庭菜園はどこ？庭の起源と人類の暮らし',
    curiosityTitle: '最初の庭は、美しい庭ではなかった',
    description: '人類はいつ、なぜ家のそばで植物を育て始めたのか。庭の起源を食料、薬草、定住の歴史からたどります。',
    keywords: ['庭の起源', '家庭菜園の歴史', '古代文明', '農耕', '薬草園'],
    questions: ['世界最初の庭はどこ？', '家庭菜園はいつ始まった？'],
    chapters: ['00:00 最初の庭', '00:50 定住と種', '02:30 食料と薬草', '05:20 美しい庭になるまで'],
    scenes: [
      { id: 1, title: 'BEFORE BEAUTY', timecode: '0:00–0:50', visual: '乾いた大地と小さな囲い。', narration: '世界最初の庭は、美しい庭ではありませんでした。', onScreen: 'BEFORE THE WORD “GARDEN”', audio: '風と低音。', purpose: '常識を反転させる。', assets: ['古代集落イメージ'] },
      { id: 2, title: 'STAYING IN ONE PLACE', timecode: '0:50–2:30', visual: '移動生活から定住への地図アニメーション。', narration: '人が同じ場所に留まったとき、種もまた家の近くに留まった。', onScreen: '定住が、庭を生んだ。', audio: '足音から土音へ。', purpose: '庭誕生の条件を説明。', assets: ['地図アニメ'] },
      { id: 3, title: 'FOOD AND MEDICINE', timecode: '2:30–5:20', visual: '穀物、豆、薬草、保存容器。', narration: '最初に育てられたのは、飾る花ではなく食べ物と薬でした。', onScreen: 'FOOD / MEDICINE / MEMORY', audio: '生活音。', purpose: '庭の実用的起源を示す。', assets: ['植物図版'] },
      { id: 4, title: 'WHEN GARDENS BECAME BEAUTIFUL', timecode: '5:20–8:35', visual: '実用庭から宮殿庭園、現代住宅へ変化。', narration: '生きるための場所は、やがて権力と美の象徴になった。けれど庭の根には、今も暮らしがある。', onScreen: 'Every Garden Has a Story.', audio: '壮大な弦から静かな自然音へ。', purpose: '歴史と現代を接続する。', assets: ['庭園史素材'] },
    ],
  },
};
