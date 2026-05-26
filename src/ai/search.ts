import type { Color, Move, Square } from '../engine/types';
import { allLegalMoves } from '../engine/legality';
import { applyMove } from '../engine/legality';
import { isTerminal } from '../engine/status';
import { computeStatus } from '../engine/status';
import { evaluate } from './evaluate';

function opponent(color: Color): Color {
  return color === 'red' ? 'black' : 'red';
}

function orderMoves(moves: Move[]): Move[] {
  return moves.slice().sort((a, b) => {
    const aCapture = a.capture ? 1 : 0;
    const bCapture = b.capture ? 1 : 0;
    return bCapture - aCapture;
  });
}

function minimax(
  board: Square[],
  color: Color,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  rootColor: Color,
): number {
  const status = computeStatus({ board, turn: color, moveHistory: [], positionHistory: [], status: 'playing', redCaptured: [], blackCaptured: [] });

  if (isTerminal(status)) {
    return status === 'checkmate' ? (maximizing ? -100000 : 100000) : 0;
  }

  if (depth === 0) {
    return evaluate(board, rootColor);
  }

  const moves = orderMoves(allLegalMoves(board, color));

  if (maximizing) {
    let best = -Infinity;
    for (const move of moves) {
      const next = applyMove(board, move);
      const val = minimax(next, opponent(color), depth - 1, alpha, beta, false, rootColor);
      if (val > best) best = val;
      if (val > alpha) alpha = val;
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      const next = applyMove(board, move);
      const val = minimax(next, opponent(color), depth - 1, alpha, beta, true, rootColor);
      if (val < best) best = val;
      if (val < beta) beta = val;
      if (beta <= alpha) break;
    }
    return best;
  }
}

export function findBestMove(board: Square[], color: Color, depth: number, randomFactor = 0): Move | null {
  const moves = orderMoves(allLegalMoves(board, color));
  if (moves.length === 0) return null;

  if (randomFactor > 0 && Math.random() < randomFactor) {
    return moves[Math.floor(Math.random() * moves.length)] ?? null;
  }

  let bestMove: Move | null = null;
  let bestVal = -Infinity;

  for (const move of moves) {
    const next = applyMove(board, move);
    const val = minimax(next, opponent(color), depth - 1, -Infinity, Infinity, false, color);
    if (val > bestVal) {
      bestVal = val;
      bestMove = move;
    }
  }

  return bestMove;
}
