import type { Color, Move, Square } from './types';
import { BOARD_SIZE, findGeneral, colOf, getPiece, rowOf } from './board';
import { allPseudoLegalMoves, pseudoLegalMoves } from './moves';

export function applyMove(board: Square[], move: Move): Square[] {
  const next = [...board];
  next[move.to] = next[move.from];
  next[move.from] = null;
  return next;
}

export function flyingGeneralExposed(board: Square[]): boolean {
  const redGen = findGeneral(board, 'red');
  const blackGen = findGeneral(board, 'black');
  if (redGen === -1 || blackGen === -1) return false;

  const rc = colOf(redGen);
  const bc = colOf(blackGen);
  if (rc !== bc) return false;

  const rr = rowOf(redGen);
  const br = rowOf(blackGen);
  const minR = Math.min(rr, br);
  const maxR = Math.max(rr, br);

  for (let r = minR + 1; r < maxR; r++) {
    if (getPiece(board, r * 9 + rc) !== null) return false;
  }
  return true;
}

export function isInCheck(board: Square[], color: Color): boolean {
  if (flyingGeneralExposed(board)) return true;
  const genIdx = findGeneral(board, color);
  if (genIdx === -1) return true;
  const opp = color === 'red' ? 'black' : 'red';
  const oppMoves = allPseudoLegalMoves(board, opp);
  return oppMoves.some(m => m.to === genIdx);
}

export function getLegalMoves(board: Square[], from: number, turn: Color): Move[] {
  const piece = getPiece(board, from);
  if (!piece || piece.color !== turn) return [];

  return pseudoLegalMoves(board, from).filter(move => {
    const next = applyMove(board, move);
    return !isInCheck(next, turn);
  });
}

export function allLegalMoves(board: Square[], color: Color): Move[] {
  const moves: Move[] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const p = board[i];
    if (p && p.color === color) {
      moves.push(...getLegalMoves(board, i, color));
    }
  }
  return moves;
}
