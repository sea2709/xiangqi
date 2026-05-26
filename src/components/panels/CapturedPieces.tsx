import type { Piece } from '../../engine/types';
import { getPieceChinese } from '../../data/pieceRules';

interface Props {
  redCaptured: Piece[];
  blackCaptured: Piece[];
}

function PieceChip({ piece }: { piece: Piece }) {
  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold border"
      style={{
        backgroundColor: piece.color === 'red' ? '#f8e8d0' : '#2a2a2a',
        color: piece.color === 'red' ? '#cc2200' : '#e8e8e8',
        borderColor: piece.color === 'red' ? '#cc2200' : '#555',
        fontFamily: 'serif',
      }}
    >
      {getPieceChinese(piece.type, piece.color)}
    </span>
  );
}

export function CapturedPieces({ redCaptured, blackCaptured }: Props) {
  return (
    <div className="space-y-2 text-sm">
      <div>
        <div className="text-xs text-gray-500 mb-1">Red captured</div>
        <div className="flex flex-wrap gap-1 min-h-[32px]">
          {redCaptured.map((p, i) => <PieceChip key={i} piece={p} />)}
        </div>
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1">Black captured</div>
        <div className="flex flex-wrap gap-1 min-h-[32px]">
          {blackCaptured.map((p, i) => <PieceChip key={i} piece={p} />)}
        </div>
      </div>
    </div>
  );
}
