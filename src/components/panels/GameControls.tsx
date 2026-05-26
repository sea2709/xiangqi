interface Props {
  onNewGame: () => void;
  onUndo: () => void;
  onFlip: () => void;
  onHint: () => void;
  hintsUsed: number;
  thinking: boolean;
  flipped: boolean;
}

const MAX_HINTS = 3;

export function GameControls({
  onNewGame, onUndo, onFlip, onHint, hintsUsed, thinking, flipped,
}: Props) {
  const hintsLeft = MAX_HINTS - hintsUsed;

  return (
    <div className="space-y-2">
      <button
        onClick={onNewGame}
        className="w-full py-2 bg-red-700 hover:bg-red-800 text-white text-sm rounded transition-colors"
      >
        New Game (N)
      </button>
      <div className="flex gap-2">
        <button
          onClick={onUndo}
          className="flex-1 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          Undo (U)
        </button>
        <button
          onClick={onFlip}
          className={`flex-1 py-1.5 text-sm border rounded transition-colors ${
            flipped
              ? 'border-blue-400 bg-blue-50 text-blue-700'
              : 'border-gray-300 hover:bg-gray-100'
          }`}
        >
          Flip
        </button>
      </div>
      <button
        onClick={onHint}
        disabled={hintsLeft === 0 || thinking}
        className="w-full py-1.5 text-sm border border-amber-400 text-amber-700 rounded
          hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Hint (H) — {hintsLeft} left
      </button>
      {thinking && (
        <div className="text-center text-xs text-gray-500 animate-pulse">AI is thinking…</div>
      )}
    </div>
  );
}
