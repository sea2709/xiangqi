import type { Color, Square } from '../engine/types';
import { BOARD_SIZE } from '../engine/board';
import { PIECE_SQUARE_TABLES } from './tables';

const MATERIAL: Record<string, number> = {
  general: 10000,
  chariot: 900,
  horse: 500,
  cannon: 500,
  advisor: 200,
  elephant: 200,
  soldier: 100,
};

export function evaluate(board: Square[], perspective: Color): number {
  let score = 0;
  for (let i = 0; i < BOARD_SIZE; i++) {
    const piece = board[i];
    if (!piece) continue;
    const mat = MATERIAL[piece.type] ?? 0;
    const table = PIECE_SQUARE_TABLES[piece.type];

    let pst: number;
    if (piece.color === 'red') {
      pst = table[i] ?? 0;
    } else {
      // Mirror vertically for black
      const mirroredIdx = (9 - Math.floor(i / 9)) * 9 + (i % 9);
      pst = table[mirroredIdx] ?? 0;
    }

    const pieceScore = mat + pst;
    score += piece.color === perspective ? pieceScore : -pieceScore;
  }
  return score;
}
