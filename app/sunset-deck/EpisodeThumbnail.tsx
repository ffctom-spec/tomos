'use client';

type Props = { episodeId: number; compact?: boolean; onClick?: () => void };

const copy: Record<number, { kicker: string; line1: string; line2: string; hook: string; accent: string }> = {
  1: { kicker: 'THE GARDEN THAT SAVED HUMANITY', line1: '食料が', line2: '消えた日', hook: 'もし明日、スーパーから食べ物が消えたら。', accent: '#c6a45d' },
  2: { kicker: 'HOW TASTE IS LEARNED', line1: '好き嫌いは', line2: 'どこから？', hook: '嫌いな野菜は、本当に味が嫌いなのでしょうか。', accent: '#d6a66e' },
  3: { kicker: 'THE MEMORY OF SOIL', line1: 'なぜ土は', line2: '心を静める？', hook: '人は、土から離れすぎたのかもしれません。', accent: '#a99064' },
  4: { kicker: 'THE ARCHITECTURE OF A PLANT', line1: '一本の植物が', line2: '庭を変える', hook: 'たった一本の植物が、家の印象を変える。', accent: '#b9a06a' },
  5: { kicker: 'BEFORE THE WORD GARDEN', line1: '世界最初の', line2: '家庭菜園', hook: '世界最初の庭は、美しい庭ではありませんでした。', accent: '#c2a56a' },
};

export const shortPreviewCopy = copy;

function Artwork({ episodeId, accent }: { episodeId: number; accent: string }) {
  if (episodeId === 1) return <><rect x="690" y="130" width="430" height="310" rx="18" fill="#24231f"/><path d="M720 205h370M720 290h370M720 375h370" stroke={accent} strokeWidth="8" opacity=".65"/><rect x="770" y="160" width="78" height="30" rx="5" fill="#5b5548"/><rect x="960" y="248" width="94" height="32" rx="5" fill="#5b5548"/><path d="M790 500c85-94 190-98 300-25" stroke={accent} strokeWidth="8" fill="none" opacity=".55"/></>;
  if (episodeId === 2) return <><circle cx="930" cy="300" r="178" fill="#eee4d4"/><circle cx="930" cy="300" r="116" fill="#292822"/><path d="M855 260c45-54 108-52 152 0M850 330c58 42 120 42 166 0" stroke={accent} strokeWidth="14" fill="none" strokeLinecap="round"/><circle cx="877" cy="277" r="17" fill={accent}/><circle cx="984" cy="277" r="17" fill={accent}/></>;
  if (episodeId === 3) return <><path d="M735 470c90-124 190-174 300-130 60 24 106 70 135 130H735z" fill="#3a3429"/><path d="M855 430c-13-105 35-188 125-235" stroke={accent} strokeWidth="11" fill="none" strokeLinecap="round"/><path d="M930 260c-62-16-104-3-140 40 60 11 101-2 140-40zM978 215c38-51 82-66 136-50-30 48-72 65-136 50z" fill={accent}/></>;
  if (episodeId === 4) return <><path d="M930 470V205" stroke={accent} strokeWidth="18" strokeLinecap="round"/><path d="M930 245l-145-105M930 260l158-122M930 308l-190-30M930 322l195-32M930 365l-170 76M930 372l155 80" stroke={accent} strokeWidth="13" strokeLinecap="round"/><path d="M740 486h390" stroke="#514a3d" strokeWidth="24" strokeLinecap="round"/></>;
  return <><path d="M735 470h390" stroke="#514a3d" strokeWidth="18"/><path d="M805 470V275M925 470V235M1045 470V300" stroke={accent} strokeWidth="12"/><path d="M805 305c-55-35-90-28-120 7 48 25 85 22 120-7zM925 267c-60-38-100-28-134 10 54 27 95 23 134-10zM1045 330c47-35 87-37 120-4-43 28-82 29-120 4z" fill={accent}/></>;
}

export default function EpisodeThumbnail({ episodeId, compact = false, onClick }: Props) {
  const item = copy[episodeId] || copy[1];
  return <button type="button" className={`episodeThumbArt ${compact ? 'episodeThumbCompact' : ''}`} onClick={onClick} aria-label={`EP.${String(episodeId).padStart(2, '0')} ショート版を開く`}>
    <svg viewBox="0 0 1280 720" role="img" aria-label={`${item.line1}${item.line2}`}>
      <defs><linearGradient id={`bg-${episodeId}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#090909"/><stop offset=".58" stopColor="#242018"/><stop offset="1" stopColor="#050505"/></linearGradient><radialGradient id={`glow-${episodeId}`} cx="75%" cy="35%" r="55%"><stop offset="0" stopColor={item.accent} stopOpacity=".34"/><stop offset="1" stopColor="#000" stopOpacity="0"/></radialGradient></defs>
      <rect width="1280" height="720" fill={`url(#bg-${episodeId})`}/><rect width="1280" height="720" fill={`url(#glow-${episodeId})`}/><Artwork episodeId={episodeId} accent={item.accent}/>
      <text x="72" y="86" fill={item.accent} fontSize="24" fontWeight="700" letterSpacing="5">SUNSET DECK</text>
      <text x="72" y="350" fill="#f4efe3" fontSize="74" fontFamily="serif" fontWeight="700">{item.line1}</text><text x="72" y="438" fill="#f4efe3" fontSize="74" fontFamily="serif" fontWeight="700">{item.line2}</text>
      <text x="76" y="500" fill="#bdb5a7" fontSize="19" letterSpacing="2">{item.kicker}</text><text x="1140" y="650" fill={item.accent} fontSize="24" fontWeight="700">EP.{String(episodeId).padStart(2, '0')}</text>
      <circle cx="1170" cy="82" r="38" fill="rgba(0,0,0,.55)" stroke={item.accent}/><path d="M1158 61l34 21-34 21z" fill="#fff"/>
    </svg>
  </button>;
}
