import { useEffect, useRef, useState, useCallback } from 'react';
import type { Color, Move, Square } from '../engine/types';
import { DEPTH_MAP, RANDOM_MAP, useSettingsStore } from '../store/settingsStore';

interface AIRequest {
  board: Square[];
  turn: Color;
  depth: number;
  randomFactor?: number;
}

interface AIResponse {
  move: Move | null;
}

export function useAI(onMove: (move: Move) => void) {
  const workerRef = useRef<Worker | null>(null);
  const [thinking, setThinking] = useState(false);
  const difficulty = useSettingsStore(s => s.difficulty);

  useEffect(() => {
    const worker = new Worker(new URL('../ai/worker.ts', import.meta.url), {
      type: 'module',
    });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<AIResponse>) => {
      setThinking(false);
      if (e.data.move) onMove(e.data.move);
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, [onMove]);

  const requestMove = useCallback(
    (board: Square[], turn: Color) => {
      if (!workerRef.current) return;
      setThinking(true);
      const req: AIRequest = {
        board,
        turn,
        depth: DEPTH_MAP[difficulty],
        randomFactor: RANDOM_MAP[difficulty],
      };
      workerRef.current.postMessage(req);
    },
    [difficulty],
  );

  const requestHint = useCallback(
    (board: Square[], turn: Color, cb: (move: Move | null) => void) => {
      const worker = new Worker(new URL('../ai/worker.ts', import.meta.url), {
        type: 'module',
      });
      worker.onmessage = (e: MessageEvent<AIResponse>) => {
        cb(e.data.move);
        worker.terminate();
      };
      worker.postMessage({ board, turn, depth: 2 } satisfies AIRequest);
    },
    [],
  );

  return { thinking, requestMove, requestHint };
}
