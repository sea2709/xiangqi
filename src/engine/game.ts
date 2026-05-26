import type { GameState, Move } from './types';
import { STARTING_FEN, boardToFen, fenToBoard } from './fen';
import { applyMove } from './legality';
import { computeStatus } from './status';

export function createGame(): GameState {
  const { board, turn } = fenToBoard(STARTING_FEN);
  const fen = boardToFen(board, turn);
  const state: GameState = {
    board,
    turn,
    moveHistory: [],
    positionHistory: [fen],
    status: 'playing',
    redCaptured: [],
    blackCaptured: [],
  };
  return state;
}

export function makeMove(state: GameState, move: Move): GameState {
  const nextBoard = applyMove(state.board, move);
  const nextTurn = state.turn === 'red' ? 'black' : 'red';
  const nextFen = boardToFen(nextBoard, nextTurn);

  const nextState: GameState = {
    board: nextBoard,
    turn: nextTurn,
    moveHistory: [...state.moveHistory, move],
    positionHistory: [...state.positionHistory, nextFen],
    status: 'playing',
    redCaptured: move.capture?.color === 'black'
      ? [...state.redCaptured, move.capture]
      : state.redCaptured,
    blackCaptured: move.capture?.color === 'red'
      ? [...state.blackCaptured, move.capture]
      : state.blackCaptured,
  };

  nextState.status = computeStatus(nextState);
  return nextState;
}

export function undoMove(state: GameState): GameState {
  if (state.moveHistory.length === 0) return state;

  const initialFen = state.positionHistory[0] ?? STARTING_FEN;
  const { board: initialBoard, turn: initialTurn } = fenToBoard(initialFen);

  let current: GameState = {
    board: initialBoard,
    turn: initialTurn,
    moveHistory: [],
    positionHistory: [initialFen],
    status: 'playing',
    redCaptured: [],
    blackCaptured: [],
  };

  const movesToReplay = state.moveHistory.slice(0, -1);
  for (const m of movesToReplay) {
    current = makeMove(current, m);
  }
  return current;
}
