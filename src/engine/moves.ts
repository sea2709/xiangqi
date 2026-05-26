import type { Move, Square } from './types';
import {
  BOARD_SIZE,
  colOf,
  getPiece,
  hasCrossedRiver,
  inBounds,
  inPalace,
  idx,
  rowOf,
} from './board';

function canLandOn(board: Square[], i: number, attackerColor: 'red' | 'black'): boolean {
  const target = getPiece(board, i);
  return target === null || target.color !== attackerColor;
}

function generalMoves(board: Square[], from: number): Move[] {
  const piece = getPiece(board, from)!;
  const moves: Move[] = [];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const r = rowOf(from);
  const c = colOf(from);
  for (const [dr, dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (!inBounds(nr, nc)) continue;
    const to = idx(nr, nc);
    if (!inPalace(to, piece.color)) continue;
    if (!canLandOn(board, to, piece.color)) continue;
    const capture = getPiece(board, to) ?? undefined;
    moves.push({ from, to, capture });
  }
  return moves;
}

function advisorMoves(board: Square[], from: number): Move[] {
  const piece = getPiece(board, from)!;
  const moves: Move[] = [];
  const diags = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  const r = rowOf(from);
  const c = colOf(from);
  for (const [dr, dc] of diags) {
    const nr = r + dr;
    const nc = c + dc;
    if (!inBounds(nr, nc)) continue;
    const to = idx(nr, nc);
    if (!inPalace(to, piece.color)) continue;
    if (!canLandOn(board, to, piece.color)) continue;
    const capture = getPiece(board, to) ?? undefined;
    moves.push({ from, to, capture });
  }
  return moves;
}

function elephantMoves(board: Square[], from: number): Move[] {
  const piece = getPiece(board, from)!;
  const moves: Move[] = [];
  const steps: [number, number, number, number][] = [
    [-2, -2, -1, -1],
    [-2, 2, -1, 1],
    [2, -2, 1, -1],
    [2, 2, 1, 1],
  ];
  const r = rowOf(from);
  const c = colOf(from);
  for (const [dr, dc, er, ec] of steps) {
    const nr = r + dr;
    const nc = c + dc;
    if (!inBounds(nr, nc)) continue;
    const to = idx(nr, nc);
    if (hasCrossedRiver(to, piece.color)) continue;
    const eyeR = r + er;
    const eyeC = c + ec;
    if (!inBounds(eyeR, eyeC)) continue;
    if (getPiece(board, idx(eyeR, eyeC)) !== null) continue;
    if (!canLandOn(board, to, piece.color)) continue;
    const capture = getPiece(board, to) ?? undefined;
    moves.push({ from, to, capture });
  }
  return moves;
}

function horseMoves(board: Square[], from: number): Move[] {
  const piece = getPiece(board, from)!;
  const moves: Move[] = [];
  const steps: [number, number, number, number][] = [
    [-1, 0, -2, -1],
    [-1, 0, -2, 1],
    [1, 0, 2, -1],
    [1, 0, 2, 1],
    [0, -1, -1, -2],
    [0, -1, 1, -2],
    [0, 1, -1, 2],
    [0, 1, 1, 2],
  ];
  const r = rowOf(from);
  const c = colOf(from);
  for (const [lr, lc, dr, dc] of steps) {
    const legR = r + lr;
    const legC = c + lc;
    if (!inBounds(legR, legC)) continue;
    if (getPiece(board, idx(legR, legC)) !== null) continue;
    const nr = r + dr;
    const nc = c + dc;
    if (!inBounds(nr, nc)) continue;
    const to = idx(nr, nc);
    if (!canLandOn(board, to, piece.color)) continue;
    const capture = getPiece(board, to) ?? undefined;
    moves.push({ from, to, capture });
  }
  return moves;
}

function chariotMoves(board: Square[], from: number): Move[] {
  const piece = getPiece(board, from)!;
  const moves: Move[] = [];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const r = rowOf(from);
  const c = colOf(from);
  for (const [dr, dc] of dirs) {
    let nr = r + dr;
    let nc = c + dc;
    while (inBounds(nr, nc)) {
      const to = idx(nr, nc);
      const target = getPiece(board, to);
      if (target === null) {
        moves.push({ from, to });
      } else {
        if (target.color !== piece.color) {
          moves.push({ from, to, capture: target });
        }
        break;
      }
      nr += dr;
      nc += dc;
    }
  }
  return moves;
}

function cannonMoves(board: Square[], from: number): Move[] {
  const piece = getPiece(board, from)!;
  const moves: Move[] = [];
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const r = rowOf(from);
  const c = colOf(from);
  for (const [dr, dc] of dirs) {
    let nr = r + dr;
    let nc = c + dc;
    let screenFound = false;
    while (inBounds(nr, nc)) {
      const to = idx(nr, nc);
      const target = getPiece(board, to);
      if (!screenFound) {
        if (target === null) {
          moves.push({ from, to });
        } else {
          screenFound = true;
        }
      } else {
        if (target !== null) {
          if (target.color !== piece.color) {
            moves.push({ from, to, capture: target });
          }
          break;
        }
      }
      nr += dr;
      nc += dc;
    }
  }
  return moves;
}

function soldierMoves(board: Square[], from: number): Move[] {
  const piece = getPiece(board, from)!;
  const moves: Move[] = [];
  const r = rowOf(from);
  const c = colOf(from);
  const crossed = hasCrossedRiver(from, piece.color);
  // Red starts at bottom (row 9) and moves up; black starts at top (row 0) and moves down
  const forward = piece.color === 'red' ? -1 : 1;

  const candidates: [number, number][] = [[r + forward, c]];
  if (crossed) {
    candidates.push([r, c - 1], [r, c + 1]);
  }

  for (const [nr, nc] of candidates) {
    if (!inBounds(nr, nc)) continue;
    const to = idx(nr, nc);
    if (!canLandOn(board, to, piece.color)) continue;
    const capture = getPiece(board, to) ?? undefined;
    moves.push({ from, to, capture });
  }
  return moves;
}

export function pseudoLegalMoves(board: Square[], from: number): Move[] {
  const piece = getPiece(board, from);
  if (!piece) return [];
  if (from < 0 || from >= BOARD_SIZE) return [];

  switch (piece.type) {
    case 'general': return generalMoves(board, from);
    case 'advisor': return advisorMoves(board, from);
    case 'elephant': return elephantMoves(board, from);
    case 'horse': return horseMoves(board, from);
    case 'chariot': return chariotMoves(board, from);
    case 'cannon': return cannonMoves(board, from);
    case 'soldier': return soldierMoves(board, from);
  }
}

export function allPseudoLegalMoves(board: Square[], color: 'red' | 'black'): Move[] {
  const moves: Move[] = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    const p = board[i];
    if (p && p.color === color) {
      moves.push(...pseudoLegalMoves(board, i));
    }
  }
  return moves;
}
