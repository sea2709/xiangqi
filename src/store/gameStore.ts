import { create } from 'zustand';
import type { GameState, Move } from '../engine/types';
import { getLegalMoves } from '../engine/legality';
import { createGame, makeMove, undoMove } from '../engine/game';

interface GameStore {
  state: GameState;
  selectedIdx: number | null;
  validMoves: Move[];
  hintMove: Move | null;
  hintsUsed: number;
  selectSquare: (idx: number) => void;
  applyMove: (move: Move) => void;
  resetGame: () => void;
  undoMoves: (count?: number) => void;
  setHint: (move: Move | null) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: createGame(),
  selectedIdx: null,
  validMoves: [],
  hintMove: null,
  hintsUsed: 0,

  selectSquare: (idx) => {
    const { state, selectedIdx, validMoves } = get();

    const targetMove = validMoves.find(m => m.to === idx);
    if (targetMove) {
      const next = makeMove(state, targetMove);
      set({ state: next, selectedIdx: null, validMoves: [], hintMove: null });
      return;
    }

    const piece = state.board[idx];
    if (piece && piece.color === state.turn) {
      const moves = getLegalMoves(state.board, idx, state.turn);
      set({ selectedIdx: idx, validMoves: moves, hintMove: null });
      return;
    }

    if (selectedIdx !== null) {
      set({ selectedIdx: null, validMoves: [] });
    }
  },

  applyMove: (move) => {
    const next = makeMove(get().state, move);
    set({ state: next, selectedIdx: null, validMoves: [], hintMove: null });
  },

  resetGame: () =>
    set({
      state: createGame(),
      selectedIdx: null,
      validMoves: [],
      hintMove: null,
      hintsUsed: 0,
    }),

  undoMoves: (count = 2) => {
    let s = get().state;
    for (let i = 0; i < count; i++) {
      if (s.moveHistory.length === 0) break;
      s = undoMove(s);
    }
    set({ state: s, selectedIdx: null, validMoves: [], hintMove: null });
  },

  setHint: (move) =>
    set((s) => ({ hintMove: move, hintsUsed: move ? s.hintsUsed + 1 : s.hintsUsed })),
}));
