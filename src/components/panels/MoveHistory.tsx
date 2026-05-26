import { useRef, useEffect } from 'react';
import type { Move } from '../../engine/types';

const COL_LETTERS = 'abcdefghi';

function formatMove(move: Move, index: number): string {
  const fromCol = COL_LETTERS[move.from % 9] ?? '?';
  const fromRow = Math.floor(move.from / 9);
  const toCol = COL_LETTERS[move.to % 9] ?? '?';
  const toRow = Math.floor(move.to / 9);
  const capture = move.capture ? 'x' : '-';
  return `${index + 1}. ${fromCol}${fromRow}${capture}${toCol}${toRow}`;
}

interface Props {
  moves: Move[];
}

export function MoveHistory({ moves }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moves.length]);

  return (
    <div className="h-48 overflow-y-auto bg-gray-50 rounded border border-gray-200 p-2 text-xs font-mono">
      {moves.length === 0 && (
        <div className="text-gray-400 italic">No moves yet</div>
      )}
      {moves.map((move, i) => (
        <div
          key={i}
          className={`py-0.5 ${i % 2 === 0 ? 'text-red-700' : 'text-gray-800'}`}
        >
          {formatMove(move, i)}
          {move.capture && <span className="text-orange-500 ml-1">✕</span>}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
