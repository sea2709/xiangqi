import { getPieceChinese } from '../../data/pieceRules';
import type { Piece } from '../../engine/types';

const CELL = 60;
const PAD = 40;
const RADIUS = 24;

interface Props {
  piece: Piece;
  row: number;
  col: number;
  selected: boolean;
  isHint: boolean;
  onClick: () => void;
}

export function BoardPiece({ piece, row, col, selected, isHint, onClick }: Props) {
  const cx = PAD + col * CELL;
  const cy = PAD + row * CELL;
  const isRed = piece.color === 'red';
  const fillColor = isRed ? '#f8e8d0' : '#2a2a2a';
  const textColor = isRed ? '#cc2200' : '#e8e8e8';
  const strokeColor = selected
    ? '#22c55e'
    : isHint
      ? '#f59e0b'
      : isRed
        ? '#cc2200'
        : '#555';
  const strokeWidth = selected || isHint ? 3 : 2;

  return (
    <g
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`${piece.color} ${piece.type} at row ${row} column ${col}`}
    >
      <circle
        cx={cx} cy={cy} r={RADIUS}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={cx} cy={cy} r={RADIUS - 4}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        opacity="0.5"
      />
      <text
        x={cx} y={cy}
        fontSize="18"
        fontWeight="bold"
        fontFamily="serif"
        fill={textColor}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {getPieceChinese(piece.type, piece.color)}
      </text>
    </g>
  );
}
