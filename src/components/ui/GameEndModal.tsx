import type { Color, GameStatus } from '../../engine/types';

interface Props {
  status: GameStatus;
  turn: Color;
  onPlayAgain: () => void;
  onReview: () => void;
}

export function GameEndModal({ status, turn, onPlayAgain, onReview }: Props) {
  if (status !== 'checkmate' && status !== 'stalemate') return null;

  const title =
    status === 'stalemate'
      ? 'Draw — Stalemate'
      : turn === 'black'
        ? 'Red Wins!'
        : 'Black Wins!';

  const subtitle =
    status === 'stalemate'
      ? 'Neither side can move'
      : `${turn === 'black' ? 'Black' : 'Red'} is in checkmate`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center space-y-4">
        <div className="text-4xl">{status === 'checkmate' ? '🏆' : '🤝'}</div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500">{subtitle}</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onPlayAgain}
            className="flex-1 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={onReview}
            className="flex-1 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}
