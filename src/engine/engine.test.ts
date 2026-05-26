import { describe, expect, it } from 'vitest';
import { fenToBoard, boardToFen, STARTING_FEN } from './fen';
import { pseudoLegalMoves, allPseudoLegalMoves } from './moves';
import { isInCheck, getLegalMoves, allLegalMoves } from './legality';
import { createGame, makeMove } from './game';
import { idx } from './board';
import type { Square } from './types';

function emptyBoard(): Square[] {
  return new Array<Square>(90).fill(null);
}

function place(board: Square[], row: number, col: number, piece: Square): void {
  board[idx(row, col)] = piece;
}

describe('FEN', () => {
  it('round-trips the starting position', () => {
    const { board, turn } = fenToBoard(STARTING_FEN);
    const fen = boardToFen(board, turn);
    expect(fen).toBe(STARTING_FEN);
  });

  it('places pieces correctly from starting FEN', () => {
    const { board } = fenToBoard(STARTING_FEN);
    // Row 0 = black back rank
    expect(board[idx(0, 0)]).toEqual({ type: 'chariot', color: 'black' });
    expect(board[idx(0, 4)]).toEqual({ type: 'general', color: 'black' });
    // Row 9 = red back rank
    expect(board[idx(9, 0)]).toEqual({ type: 'chariot', color: 'red' });
    expect(board[idx(9, 4)]).toEqual({ type: 'general', color: 'red' });
  });
});

describe('Chariot moves', () => {
  it('slides until blocked', () => {
    const board = emptyBoard();
    place(board, 5, 4, { type: 'chariot', color: 'red' });
    place(board, 5, 7, { type: 'soldier', color: 'black' });
    const moves = pseudoLegalMoves(board, idx(5, 4));
    const toTargets = moves.map(m => m.to);
    expect(toTargets).toContain(idx(5, 7));
    expect(toTargets).not.toContain(idx(5, 8));
  });

  it('cannot move through own piece', () => {
    const board = emptyBoard();
    place(board, 5, 4, { type: 'chariot', color: 'red' });
    place(board, 5, 6, { type: 'soldier', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(5, 4));
    const toTargets = moves.map(m => m.to);
    expect(toTargets).toContain(idx(5, 5));
    expect(toTargets).not.toContain(idx(5, 6));
    expect(toTargets).not.toContain(idx(5, 7));
  });
});

describe('Cannon moves', () => {
  it('slides freely to empty squares', () => {
    const board = emptyBoard();
    place(board, 5, 4, { type: 'cannon', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(5, 4));
    expect(moves.some(m => m.to === idx(5, 8))).toBe(true);
    expect(moves.some(m => m.to === idx(0, 4))).toBe(true);
  });

  it('captures by jumping exactly one screen', () => {
    const board = emptyBoard();
    place(board, 5, 0, { type: 'cannon', color: 'red' });
    place(board, 5, 4, { type: 'soldier', color: 'red' });
    place(board, 5, 8, { type: 'chariot', color: 'black' });
    const moves = pseudoLegalMoves(board, idx(5, 0));
    expect(moves.some(m => m.to === idx(5, 8) && m.capture != null)).toBe(true);
    expect(moves.every(m => m.to !== idx(5, 4))).toBe(true);
  });

  it('cannot capture without a screen', () => {
    const board = emptyBoard();
    place(board, 5, 0, { type: 'cannon', color: 'red' });
    place(board, 5, 8, { type: 'chariot', color: 'black' });
    const moves = pseudoLegalMoves(board, idx(5, 0));
    expect(moves.every(m => m.to !== idx(5, 8))).toBe(true);
  });

  it('cannot capture with two screens', () => {
    const board = emptyBoard();
    place(board, 5, 0, { type: 'cannon', color: 'red' });
    place(board, 5, 3, { type: 'soldier', color: 'red' });
    place(board, 5, 5, { type: 'soldier', color: 'red' });
    place(board, 5, 8, { type: 'chariot', color: 'black' });
    const moves = pseudoLegalMoves(board, idx(5, 0));
    expect(moves.every(m => m.to !== idx(5, 8))).toBe(true);
  });
});

describe('Horse moves', () => {
  it('moves in L-shape', () => {
    const board = emptyBoard();
    place(board, 5, 4, { type: 'horse', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(5, 4));
    expect(moves.length).toBe(8);
  });

  it('blocked by piece on the leg', () => {
    const board = emptyBoard();
    place(board, 5, 4, { type: 'horse', color: 'red' });
    place(board, 4, 4, { type: 'soldier', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(5, 4));
    expect(moves.some(m => m.to === idx(3, 3))).toBe(false);
    expect(moves.some(m => m.to === idx(3, 5))).toBe(false);
  });
});

describe('Elephant moves', () => {
  it('cannot cross river (red)', () => {
    const board = emptyBoard();
    // Row 5 is red territory (rows 5-9); elephant at row 5 cannot cross to rows 0-4
    place(board, 7, 2, { type: 'elephant', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(7, 2));
    const rows = moves.map(m => Math.floor(m.to / 9));
    expect(rows.every(r => r >= 5)).toBe(true);
  });

  it('blocked by piece on the eye', () => {
    const board = emptyBoard();
    place(board, 7, 2, { type: 'elephant', color: 'red' });
    place(board, 6, 3, { type: 'soldier', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(7, 2));
    expect(moves.some(m => m.to === idx(5, 4))).toBe(false);
  });
});

describe('Soldier moves', () => {
  it('red soldier can only move forward (up) before crossing river', () => {
    const board = emptyBoard();
    // Red soldier at row 6 (red territory, not yet crossed river at rows 0-4)
    place(board, 6, 4, { type: 'soldier', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(6, 4));
    expect(moves).toHaveLength(1);
    expect(moves[0]!.to).toBe(idx(5, 4));
  });

  it('red soldier can move sideways after crossing river', () => {
    const board = emptyBoard();
    // Row 3 is in rows 0-4, so red soldier at row 3 has crossed the river
    place(board, 3, 4, { type: 'soldier', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(3, 4));
    expect(moves.length).toBe(3);
    expect(moves.some(m => m.to === idx(2, 4))).toBe(true);
    expect(moves.some(m => m.to === idx(3, 3))).toBe(true);
    expect(moves.some(m => m.to === idx(3, 5))).toBe(true);
  });

  it('black soldier moves down (forward) before crossing river', () => {
    const board = emptyBoard();
    // Row 3 is black territory (rows 0-4), not crossed river (rows 5-9) yet
    place(board, 3, 4, { type: 'soldier', color: 'black' });
    const moves = pseudoLegalMoves(board, idx(3, 4));
    expect(moves).toHaveLength(1);
    expect(moves[0]!.to).toBe(idx(4, 4));
  });
});

describe('General / Palace', () => {
  it('black general stays in palace (rows 0-2, cols 3-5)', () => {
    const board = emptyBoard();
    place(board, 0, 3, { type: 'general', color: 'black' });
    const moves = pseudoLegalMoves(board, idx(0, 3));
    const targets = moves.map(m => m.to);
    for (const t of targets) {
      const r = Math.floor(t / 9);
      const c = t % 9;
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(2);
      expect(c).toBeGreaterThanOrEqual(3);
      expect(c).toBeLessThanOrEqual(5);
    }
  });

  it('black advisor stays in palace diagonally', () => {
    const board = emptyBoard();
    // Center of black palace (row 1, col 4) → 4 diagonal moves all in palace
    place(board, 1, 4, { type: 'advisor', color: 'black' });
    const moves = pseudoLegalMoves(board, idx(1, 4));
    expect(moves.length).toBe(4);
  });

  it('red advisor stays in palace diagonally', () => {
    const board = emptyBoard();
    // Center of red palace (row 8, col 4) → 4 diagonal moves all in palace
    place(board, 8, 4, { type: 'advisor', color: 'red' });
    const moves = pseudoLegalMoves(board, idx(8, 4));
    expect(moves.length).toBe(4);
  });
});

describe('Flying General', () => {
  it('detects exposed generals on same column', () => {
    const board = emptyBoard();
    place(board, 0, 4, { type: 'general', color: 'black' });
    place(board, 9, 4, { type: 'general', color: 'red' });
    expect(isInCheck(board, 'red')).toBe(true);
    expect(isInCheck(board, 'black')).toBe(true);
  });

  it('intervening piece blocks flying general', () => {
    const board = emptyBoard();
    place(board, 0, 4, { type: 'general', color: 'black' });
    // Black cannon in between — not a red piece so doesn't attack black general
    place(board, 5, 4, { type: 'cannon', color: 'black' });
    place(board, 9, 4, { type: 'general', color: 'red' });
    expect(isInCheck(board, 'red')).toBe(false);
    expect(isInCheck(board, 'black')).toBe(false);
  });

  it('legal moves cannot move chariot off the blocking column', () => {
    const board = emptyBoard();
    place(board, 0, 4, { type: 'general', color: 'black' });
    // Red chariot on column 4 blocks flying general but also attacks black general
    place(board, 5, 4, { type: 'chariot', color: 'red' });
    place(board, 9, 4, { type: 'general', color: 'red' });
    const legalMoves = getLegalMoves(board, idx(5, 4), 'red');
    // All legal moves must stay on column 4 (moving off exposes flying general)
    expect(legalMoves.every(m => m.to % 9 === 4)).toBe(true);
  });
});

describe('Check and Checkmate', () => {
  it('detects check from chariot', () => {
    const board = emptyBoard();
    place(board, 0, 4, { type: 'general', color: 'black' });
    place(board, 0, 8, { type: 'chariot', color: 'red' });
    place(board, 9, 3, { type: 'general', color: 'red' });
    expect(isInCheck(board, 'black')).toBe(true);
  });

  it('detects checkmate', () => {
    const board = emptyBoard();
    // Black general in corner, two red chariots cover all escape squares
    place(board, 0, 4, { type: 'general', color: 'black' });
    place(board, 0, 8, { type: 'chariot', color: 'red' }); // covers row 0
    place(board, 1, 8, { type: 'chariot', color: 'red' }); // covers row 1
    place(board, 9, 4, { type: 'general', color: 'red' }); // flying general also applies
    const legalMoves = allLegalMoves(board, 'black');
    expect(legalMoves.length).toBe(0);
    expect(isInCheck(board, 'black')).toBe(true);
  });

  it('game starts with status playing', () => {
    const game = createGame();
    expect(game.status).toBe('playing');
  });

  it('makeMove switches turn', () => {
    const game = createGame();
    const lm = allLegalMoves(game.board, 'red');
    const next = makeMove(game, lm[0]!);
    expect(next.turn).toBe('black');
  });
});

describe('Stalemate', () => {
  it('detects stalemate when no legal moves and not in check', () => {
    const board = emptyBoard();
    place(board, 0, 4, { type: 'general', color: 'black' });
    // Red general off column 4 so no flying general
    place(board, 9, 3, { type: 'general', color: 'red' });
    // Chariots cover all escape squares but not the current square
    place(board, 1, 3, { type: 'chariot', color: 'red' }); // covers col 3 → (0,3) and row 1 → (1,4)
    place(board, 1, 5, { type: 'chariot', color: 'red' }); // covers col 5 → (0,5)
    const legalMoves = allLegalMoves(board, 'black');
    expect(legalMoves.length).toBe(0);
    expect(isInCheck(board, 'black')).toBe(false);
  });
});

describe('allPseudoLegalMoves', () => {
  it('generates moves for starting position red', () => {
    const { board } = fenToBoard(STARTING_FEN);
    const moves = allPseudoLegalMoves(board, 'red');
    expect(moves.length).toBeGreaterThan(0);
  });
});
