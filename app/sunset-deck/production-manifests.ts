export type ProductionStep = {
  id: string;
  label: string;
  status: 'ready' | 'blocked' | 'pending';
  detail: string;
};

export type ProductionAsset = {
  sceneId: number;
  kind: 'archive' | 'generated' | 'original' | 'audio';
  label: string;
  prompt?: string;
  status: 'ready' | 'needed';
};

export type ProductionManifest = {
  targetDuration: string;
  format: string;
  narrationVoice: string;
  musicDirection: string;
  renderSpec: string;
  steps: ProductionStep[];
  assets: ProductionAsset[];
};

export const productionManifests: Record<number, ProductionManifest> = {
  1: {
    targetDuration: '8:30–9:30',
    format: '16:9 / 4K master / 24fps',
    narrationVoice: '落ち着いた低めの日本語音声。断定は静かに、問いかけは近く。',
    musicDirection: '低いドローン、土の質感、抑制した弦。終盤のみ温度を上げる。',
    renderSpec: 'H.264 MP4 / AAC / YouTube限定公開用',
    steps: [
      { id: 'script', label: '公開用脚本', status: 'ready', detail: '冒頭25秒の約束、5章構成、次話導線まで定義済み' },
      { id: 'assets', label: '映像素材', status: 'blocked', detail: '配給列の高解像度素材とYUGAWA邸夕景が不足' },
      { id: 'voice', label: 'AIナレーション', status: 'pending', detail: '脚本確定後にシーン単位で生成し、間と呼吸を調整' },
      { id: 'music', label: 'BGM・効果音', status: 'pending', detail: '権利処理可能な楽曲と環境音をタイムラインへ配置' },
      { id: 'captions', label: '字幕', status: 'pending', detail: '日本語フル字幕と要点テロップを分離して生成' },
      { id: 'edit', label: '編集・MP4', status: 'pending', detail: '4KマスターとYouTubeアップロード版を出力' },
      { id: 'youtube', label: '限定公開', status: 'pending', detail: '既存OAuth経由でアップロードしStudio OSで再生確認' },
    ],
    assets: [
      { sceneId: 1, kind: 'generated', label: '空になったスーパー棚のシネマティック導入', status: 'needed', prompt: 'Empty modern supermarket shelves before opening hours, slow forward dolly, cold dawn light, restrained cinematic documentary, realistic, 16:9, no logos, no text' },
      { sceneId: 1, kind: 'audio', label: '低い店内環境音と5秒の無音', status: 'needed' },
      { sceneId: 2, kind: 'archive', label: '都市・配給列・輸送網の歴史素材', status: 'needed' },
      { sceneId: 2, kind: 'generated', label: '食料物流が止まる都市地図アニメーション', status: 'needed', prompt: 'Minimal dark map animation of food supply routes into a city gradually shutting down, ivory and muted gold lines on black, premium documentary graphics, 16:9' },
      { sceneId: 3, kind: 'original', label: '種、土を掘る手、芽吹きのマクロ', status: 'needed' },
      { sceneId: 4, kind: 'archive', label: 'Victory Gardenポスターと家庭菜園映像', status: 'needed' },
      { sceneId: 5, kind: 'original', label: 'YUGAWA邸の夕景、収穫、食卓', status: 'needed' },
      { sceneId: 5, kind: 'audio', label: '庭の自然音と温かいピアノ', status: 'needed' },
    ],
  },
};
