import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { XiangqiBoard } from '../components/board/XiangqiBoard';
import { CapturedPieces } from '../components/panels/CapturedPieces';
import { MoveHistory } from '../components/panels/MoveHistory';
import { GameControls } from '../components/panels/GameControls';
import { DifficultySelector } from '../components/panels/DifficultySelector';
import { GameEndModal } from '../components/ui/GameEndModal';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { useAI } from '../hooks/useAI';
import { useSound } from '../hooks/useSound';
import { isTerminal } from '../engine/status';

export function GamePage() {
  const navigate = useNavigate();
  const {
    state, selectedIdx, validMoves, hintMove, hintsUsed,
    selectSquare, applyMove, resetGame, undoMoves, setHint,
  } = useGameStore();

  const boardFlipped = useSettingsStore(s => s.boardFlipped);
  const toggleBoardFlip = useSettingsStore(s => s.toggleBoardFlip);

  const { playMove, playCapture, playCheck } = useSound();

  const handleAIMove = useCallback((move: import('../engine/types').Move) => {
    applyMove(move);
    if (move.capture) playCapture();
    else playMove();
  }, [applyMove, playCapture, playMove]);

  const { thinking, requestMove, requestHint } = useAI(handleAIMove);

  // Trigger AI after player's move (AI plays as black)
  useEffect(() => {
    if (state.turn === 'black' && !isTerminal(state.status)) {
      requestMove(state.board, state.turn);
    }
  }, [state.turn, state.board, state.status, requestMove]);

  // Sound effects on status change
  useEffect(() => {
    if (state.status === 'check') playCheck();
  }, [state.status, playCheck]);

  const handleSquareClick = (idx: number) => {
    if (thinking || isTerminal(state.status) || state.turn !== 'red') return;
    const prev = useGameStore.getState().state;
    selectSquare(idx);
    const next = useGameStore.getState().state;
    if (next.moveHistory.length > prev.moveHistory.length) {
      const lastMove = next.moveHistory[next.moveHistory.length - 1];
      if (lastMove?.capture) playCapture();
      else playMove();
    }
  };

  const handleHint = () => {
    if (hintsUsed >= 3 || thinking) return;
    requestHint(state.board, state.turn, (move) => {
      setHint(move);
    });
  };

  const handleNewGame = () => {
    resetGame();
  };

  const handleUndo = () => {
    undoMoves(2);
  };

  const statusBanner = (() => {
    if (state.status === 'check') return { text: 'Check!', color: 'bg-orange-500' };
    if (state.status === 'checkmate') return { text: state.turn === 'black' ? 'Red wins!' : 'Black wins!', color: 'bg-red-700' };
    if (state.status === 'stalemate') return { text: 'Stalemate — Draw', color: 'bg-gray-600' };
    if (thinking) return { text: 'AI thinking…', color: 'bg-blue-600' };
    return null;
  })();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-red-900 text-white px-4 py-2 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-white/70 hover:text-white text-sm">← Home</button>
        <h1 className="text-lg font-bold" style={{ fontFamily: 'serif' }}>象棋 Xiangqi</h1>
        {statusBanner && (
          <span className={`ml-auto px-3 py-0.5 rounded text-sm font-semibold text-white ${statusBanner.color}`}>
            {statusBanner.text}
          </span>
        )}
      </header>

      {/* Main layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-6xl mx-auto w-full">
        {/* Left panel */}
        <div className="lg:w-48 space-y-4">
          <CapturedPieces redCaptured={state.redCaptured} blackCaptured={state.blackCaptured} />
          <div>
            <div className="text-xs text-gray-500 mb-1">Turn</div>
            <div className={`font-semibold text-sm ${state.turn === 'red' ? 'text-red-700' : 'text-gray-800'}`}>
              {state.turn === 'red' ? '🔴 Red (You)' : '⚫ Black (AI)'}
            </div>
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg">
            <XiangqiBoard
              state={state}
              selectedIdx={selectedIdx}
              validMoves={validMoves}
              hintMove={hintMove}
              flipped={boardFlipped}
              interactive={!thinking && !isTerminal(state.status) && state.turn === 'red'}
              onSquareClick={handleSquareClick}
            />
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:w-48 space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Difficulty</div>
            <DifficultySelector />
          </div>
          <GameControls
            onNewGame={handleNewGame}
            onUndo={handleUndo}
            onFlip={toggleBoardFlip}
            onHint={handleHint}
            hintsUsed={hintsUsed}
            thinking={thinking}
            flipped={boardFlipped}
          />
          <div>
            <div className="text-xs text-gray-500 mb-1">Move history</div>
            <MoveHistory moves={state.moveHistory} />
          </div>
        </div>
      </div>

      <GameEndModal
        status={state.status}
        turn={state.turn}
        onPlayAgain={handleNewGame}
        onReview={() => {/* stay on page */}}
      />

      <KeyboardShortcuts
        onNewGame={handleNewGame}
        onUndo={handleUndo}
        onHint={handleHint}
      />
    </div>
  );
}

function KeyboardShortcuts({
  onNewGame, onUndo, onHint,
}: {
  onNewGame: () => void;
  onUndo: () => void;
  onHint: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'n' || e.key === 'N') onNewGame();
      if (e.key === 'u' || e.key === 'U') onUndo();
      if (e.key === 'h' || e.key === 'H') onHint();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNewGame, onUndo, onHint]);
  return null;
}
