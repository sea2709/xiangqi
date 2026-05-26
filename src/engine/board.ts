import type { Color, Square } from './types';

export const COLS = 9;
export const ROWS = 10;
export const BOARD_SIZE = COLS * ROWS;

export function idx(row: number, col: number): number {
  return row * COLS + col;
}

export function rowOf(i: number): number {
  return Math.floor(i / COLS);
}

export function colOf(i: number): number {
  return i % COLS;
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < ROWS && col >= 0 && col < COLS;
}

export function getPiece(board: Square[], i: number): Square {
  return board[i] ?? null;
}

export function inPalace(i: number, color: Color): boolean {
  const r = rowOf(i);
  const c = colOf(i);
  // Red home is rows 7-9 (bottom), Black home is rows 0-2 (top)
  if (color === 'red') return r >= 7 && r <= 9 && c >= 3 && c <= 5;
  return r >= 0 && r <= 2 && c >= 3 && c <= 5;
}

export function hasCrossedRiver(i: number, color: Color): boolean {
  const r = rowOf(i);
  // River between rows 4 and 5; red moves up (toward row 0), black moves down (toward row 9)
  if (color === 'red') return r <= 4;
  return r >= 5;
}

export function opponent(color: Color): Color {
  return color === 'red' ? 'black' : 'red';
}

export function findGeneral(board: Square[], color: Color): number {
  for (let i = 0; i < BOARD_SIZE; i++) {
    const p = board[i];
    if (p && p.type === 'general' && p.color === color) return i;
  }
  return -1;
}
