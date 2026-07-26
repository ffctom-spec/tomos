'use client';

import { shortPreviewCopy } from './EpisodeThumbnail';

type Props = { episodeId: number; title: string; onClose: () => void };

const beats: Record<number, string[]> = {
  1: ['スーパーから食べ物が消えた。', '都市は、運ばれる食料で生きている。', '人々は庭を掘り、生存装置に変えた。', '小さな庭が、未来をつないだ。'],
  2: ['野菜嫌いは、味だけの問題ではない。', '味覚は経験と記憶で学習される。', '育てて、触れて、食べる。', '強制ではなく、再会の入口を。'],
  3: ['雨上がりの土は、なぜ懐かしい？', '手触りと匂いが記憶を呼び戻す。', '小さな園芸作業が時間を整える。', '日常に、土を戻す。'],
  4: ['一本の植物が、建築の見え方を変える。', '線、影、高さが庭の骨格になる。', 'ロストラータは景観を編集する。', '植物は、庭の建築である。'],
  5: ['最初の庭は、美しさのためではなかった。', '食べ物と薬を家のそばで育てた。', '定住が、庭を生んだ。', 'すべての庭には物語がある。'],
};

export default function ShortPreview({ episodeId, title, onClose }: Props) {
  const item = shortPreviewCopy[episodeId] || shortPreviewCopy[1];
  const lines = beats[episodeId] || beats[1];
  return <div className="shortPreviewBackdrop" role="dialog" aria-modal="true" aria-label={`${title} ショート版プレビュー`} onClick={onClose}>
    <div className="shortPreviewPanel" onClick={(event) => event.stopPropagation()}>
      <div className="shortPreviewHeader"><div><span>SHORTS PREVIEW</span><strong>{title}</strong></div><button type="button" onClick={onClose}>×</button></div>
      <div className="shortPhone">
        <div className="shortFrame" style={{ '--short-accent': item.accent } as React.CSSProperties}>
          <div className="shortBrand">SUNSET DECK</div><div className="shortEpisode">EP.{String(episodeId).padStart(2, '0')}</div>
          <div className="shortVisual"><span className={`shortGlyph shortGlyph${episodeId}`} /></div>
          <div className="shortCopy"><small>{item.kicker}</small><h3>{item.line1}<br/>{item.line2}</h3><p>{item.hook}</p></div>
          <div className="shortProgress"><i /><i /><i /><i /></div>
        </div>
      </div>
      <div className="shortTimeline"><h4>約45秒の短縮構成</h4>{lines.map((line, index) => <div key={line}><span>0:{String(index * 11).padStart(2, '0')}</span><p>{line}</p></div>)}</div>
    </div>
  </div>;
}
