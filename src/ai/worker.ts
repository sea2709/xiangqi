import type { Color, Move, Square } from '../engine/types';
import { findBestMove } from './search';

interface WorkerRequest {
  board: Square[];
  turn: Color;
  depth: number;
  randomFactor?: number;
}

interface WorkerResponse {
  move: Move | null;
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { board, turn, depth, randomFactor = 0 } = e.data;
  const move = findBestMove(board, turn, depth, randomFactor);
  const response: WorkerResponse = { move };
  self.postMessage(response);
};
