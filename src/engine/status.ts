import type { Color, GameStatus } from './types';
import type { GameState } from './types';
import { allLegalMoves, isInCheck } from './legality';

export function computeStatus(state: GameState): GameStatus {
  const { board, turn, positionHistory } = state;

  const legal = allLegalMoves(board, turn);

  if (legal.length === 0) {
    return isInCheck(board, turn) ? 'checkmate' : 'stalemate';
  }

  const currentFen = positionHistory[positionHistory.length - 1] ?? '';
  const repetitions = positionHistory.filter(f => f === currentFen).length;
  if (repetitions >= 3) return 'stalemate';

  return isInCheck(board, turn) ? 'check' : 'playing';
}

export function isTerminal(status: GameStatus): boolean {
  return status === 'checkmate' || status === 'stalemate';
}

export function winner(status: GameStatus, turn: Color): Color | null {
  if (status === 'checkmate') return turn === 'red' ? 'black' : 'red';
  return null;
}
