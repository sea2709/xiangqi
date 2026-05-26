import type { Color, PieceType, Square } from './types';
import { BOARD_SIZE, COLS } from './board';

export const STARTING_FEN =
  'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1';

const CHAR_TO_TYPE: Record<string, PieceType> = {
  k: 'general',
  a: 'advisor',
  b: 'elephant',
  n: 'horse',
  r: 'chariot',
  c: 'cannon',
  p: 'soldier',
};

const TYPE_TO_CHAR: Record<PieceType, string> = {
  general: 'k',
  advisor: 'a',
  elephant: 'b',
  horse: 'n',
  chariot: 'r',
  cannon: 'c',
  soldier: 'p',
};

export function fenToBoard(fen: string): { board: Square[]; turn: Color } {
  const parts = fen.split(' ');
  const rows = (parts[0] ?? '').split('/');
  const turnChar = parts[1] ?? 'w';
  const turn: Color = turnChar === 'b' ? 'black' : 'red';

  const board: Square[] = new Array<Square>(BOARD_SIZE).fill(null);
  let i = 0;

  for (const row of rows) {
    for (const ch of row) {
      if (ch >= '1' && ch <= '9') {
        i += parseInt(ch, 10);
      } else {
        const lower = ch.toLowerCase();
        const type = CHAR_TO_TYPE[lower];
        if (type !== undefined) {
          const color: Color = ch === lower ? 'black' : 'red';
          board[i] = { type, color };
        }
        i++;
      }
    }
  }

  return { board, turn };
}

export function boardToFen(board: Square[], turn: Color): string {
  const rows: string[] = [];
  for (let r = 0; r < 10; r++) {
    let row = '';
    let empty = 0;
    for (let c = 0; c < COLS; c++) {
      const piece = board[r * COLS + c];
      if (!piece) {
        empty++;
      } else {
        if (empty > 0) {
          row += empty.toString();
          empty = 0;
        }
        const ch = TYPE_TO_CHAR[piece.type];
        row += piece.color === 'red' ? ch.toUpperCase() : ch;
      }
    }
    if (empty > 0) row += empty.toString();
    rows.push(row);
  }
  const turnChar = turn === 'red' ? 'w' : 'b';
  return `${rows.join('/')} ${turnChar} - - 0 1`;
}
