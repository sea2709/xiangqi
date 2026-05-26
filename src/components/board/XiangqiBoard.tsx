import { BoardGrid } from './BoardGrid';
import { BoardPiece } from './BoardPiece';
import { MoveIndicator } from './MoveIndicator';
import type { GameState, Move } from '../../engine/types';

const CELL = 60;
const PAD = 40;
const VIEW_W = PAD + 8 * CELL + PAD;
const VIEW_H = PAD + 9 * CELL + PAD;

interface Props {
  state: GameState;
  selectedIdx: number | null;
  validMoves: Move[];
  hintMove: Move | null;
  flipped: boolean;
  interactive: boolean;
  onSquareClick: (idx: number) => void;
  allowedMoves?: [number, number][];
}

function transform(idx: number, flipped: boolean): { row: number; col: number } {
  const r = Math.floor(idx / 9);
  const c = idx % 9;
  if (flipped) return { row: 9 - r, col: 8 - c };
  return { row: r, col: c };
}

export function XiangqiBoard({
  state, selectedIdx, validMoves, hintMove, flipped, interactive, onSquareClick, allowedMoves,
}: Props) {
  const handleSquare = (rawIdx: number) => {
    if (!interactive) return;
    if (allowedMoves) {
      const piece = state.board[rawIdx];
      if (!piece) return;
      const hasAllowed = allowedMoves.some(([f]) => f === rawIdx);
      if (!hasAllowed) return;
    }
    onSquareClick(rawIdx);
  };

  const handleMoveIndicator = (move: Move) => {
    if (!interactive) return;
    if (allowedMoves) {
      const allowed = allowedMoves.some(([f, t]) => f === move.from && t === move.to);
      if (!allowed) return;
    }
    onSquareClick(move.to);
  };

  const hintFrom = hintMove?.from;
  const hintTo = hintMove?.to;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', aspectRatio: `${VIEW_W}/${VIEW_H}` }}
      role="grid"
      aria-label="Xiangqi board"
    >
      {/* Board background */}
      <rect x={0} y={0} width={VIEW_W} height={VIEW_H} fill="#f0c060" rx={4} />

      <BoardGrid />

      {/* Highlight hint move squares */}
      {hintFrom !== undefined && (() => {
        const { row, col } = transform(hintFrom, flipped);
        return (
          <rect
            x={PAD + col * CELL - 28} y={PAD + row * CELL - 28}
            width={56} height={56}
            fill="rgba(245,158,11,0.25)"
            rx={4}
          />
        );
      })()}
      {hintTo !== undefined && (() => {
        const { row, col } = transform(hintTo, flipped);
        return (
          <rect
            x={PAD + col * CELL - 28} y={PAD + row * CELL - 28}
            width={56} height={56}
            fill="rgba(245,158,11,0.25)"
            rx={4}
          />
        );
      })()}

      {/* Move indicators (render before pieces so pieces appear on top) */}
      {validMoves.map(move => {
        const { row, col } = transform(move.to, flipped);
        const displayMove = { ...move, to: row * 9 + col };
        return (
          <MoveIndicator
            key={move.to}
            move={displayMove}
            onClick={() => handleMoveIndicator(move)}
          />
        );
      })}

      {/* Pieces */}
      {state.board.map((piece, rawIdx) => {
        if (!piece) return null;
        const { row, col } = transform(rawIdx, flipped);
        const isSelected = selectedIdx === rawIdx;
        const isHint = rawIdx === hintFrom || rawIdx === hintTo;
        return (
          <BoardPiece
            key={rawIdx}
            piece={piece}
            row={row}
            col={col}
            selected={isSelected}
            isHint={isHint}
            onClick={() => handleSquare(rawIdx)}
          />
        );
      })}
    </svg>
  );
}
