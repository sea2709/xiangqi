import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { XiangqiBoard } from '../components/board/XiangqiBoard';
import { TutorialOverlay } from '../components/tutorial/TutorialOverlay';
import { LESSONS } from '../data/tutorials';
import { fenToBoard } from '../engine/fen';
import { getLegalMoves } from '../engine/legality';
import { makeMove } from '../engine/game';
import { useSettingsStore } from '../store/settingsStore';
import type { GameState, Move } from '../engine/types';

function makeStateFromFen(fen: string): GameState {
  const { board, turn } = fenToBoard(fen);
  return {
    board,
    turn,
    moveHistory: [],
    positionHistory: [fen],
    status: 'playing',
    redCaptured: [],
    blackCaptured: [],
  };
}

interface TutorialStep {
  fen: string;
  allowedMoves: [number, number][];
  highlightSquares?: number[];
  narrative: string;
}

interface TutorialBoardProps {
  boardState: GameState;
  setBoardState: (s: GameState) => void;
  step: TutorialStep;
  stepCompleted: boolean;
  onMoveToAllowed: () => void;
}

function TutorialBoard({ boardState, setBoardState, step, stepCompleted, onMoveToAllowed }: TutorialBoardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [validMovesState, setValidMovesState] = useState<Move[]>([]);

  const handleClick = (idx: number) => {
    if (stepCompleted) return;

    const targetMove = validMovesState.find(m => m.to === idx);
    if (targetMove) {
      const allowed = step.allowedMoves.some(([f, t]) => f === targetMove.from && t === targetMove.to);
      if (allowed) {
        const next = makeMove(boardState, targetMove);
        setBoardState(next);
        setSelectedIdx(null);
        setValidMovesState([]);
        onMoveToAllowed();
        return;
      }
    }

    const piece = boardState.board[idx];
    if (piece && piece.color === boardState.turn) {
      const fromAllowed = step.allowedMoves.some(([f]) => f === idx);
      if (fromAllowed) {
        const moves = getLegalMoves(boardState.board, idx, boardState.turn).filter(m =>
          step.allowedMoves.some(([f, t]) => f === idx && t === m.to),
        );
        setSelectedIdx(idx);
        setValidMovesState(moves);
        return;
      }
    }

    setSelectedIdx(null);
    setValidMovesState([]);
  };

  return (
    <XiangqiBoard
      state={boardState}
      selectedIdx={selectedIdx}
      validMoves={validMovesState}
      hintMove={null}
      flipped={false}
      interactive={!stepCompleted}
      onSquareClick={handleClick}
      allowedMoves={step.allowedMoves}
    />
  );
}

function LessonViewer({ lessonId }: { lessonId: string }) {
  const navigate = useNavigate();
  const lesson = LESSONS.find(l => l.id === lessonId);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [boardState, setBoardState] = useState<GameState>(() =>
    lesson ? makeStateFromFen(lesson.steps[0]!.fen) : makeStateFromFen('9/9/9/9/9/9/9/9/9/4K4 w - - 0 1'),
  );

  const setTutorialProgress = useSettingsStore(s => s.setTutorialProgress);
  const progress = useSettingsStore(s => s.tutorialProgress);

  if (!lesson) {
    return (
      <div className="text-center py-8">
        <p>Lesson not found.</p>
        <Link to="/tutorial" className="text-red-700 underline">Back to lessons</Link>
      </div>
    );
  }

  const step = lesson.steps[stepIndex]!;

  const handleMoveComplete = () => {
    setStepCompleted(true);
    const savedProgress = progress[lesson.id] ?? -1;
    if (stepIndex > savedProgress) {
      setTutorialProgress(lesson.id, stepIndex);
    }
  };

  const goToStep = (newIdx: number) => {
    if (newIdx < 0 || newIdx >= lesson.steps.length) return;
    setStepIndex(newIdx);
    setStepCompleted(false);
    setBoardState(makeStateFromFen(lesson.steps[newIdx]!.fen));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-red-900 text-white px-4 py-2 flex items-center gap-4">
        <button onClick={() => navigate('/tutorial')} className="text-white/70 hover:text-white text-sm">
          ← Lessons
        </button>
        <h1 className="font-bold">{lesson.title}</h1>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-4xl mx-auto w-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <TutorialBoard
              boardState={boardState}
              setBoardState={setBoardState}
              step={step}
              stepCompleted={stepCompleted}
              onMoveToAllowed={handleMoveComplete}
            />
          </div>
        </div>

        <div className="lg:w-64 space-y-4">
          <TutorialOverlay
            narrative={step.narrative}
            stepIndex={stepIndex}
            totalSteps={lesson.steps.length}
            lessonTitle={lesson.title}
            onPrev={() => goToStep(stepIndex - 1)}
            onNext={() => goToStep(stepIndex + 1)}
            completed={stepCompleted}
          />

          {stepCompleted && stepIndex === lesson.steps.length - 1 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-green-800">🎉 Lesson complete!</p>
              <button
                onClick={() => navigate('/tutorial')}
                className="w-full py-2 bg-green-700 text-white text-sm rounded hover:bg-green-800 transition-colors"
              >
                Back to lessons
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TutorialPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const progress = useSettingsStore(s => s.tutorialProgress);

  if (lessonId) {
    return <LessonViewer lessonId={lessonId} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-900 text-white px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="text-white/70 hover:text-white text-sm">← Home</button>
        <h1 className="text-lg font-bold">Learn Xiangqi</h1>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <p className="text-gray-600 text-sm">
          Complete these lessons to learn how each piece moves. Progress is saved automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LESSONS.map(lesson => {
            const done = (progress[lesson.id] ?? -1) >= lesson.steps.length - 1;
            return (
              <Link
                key={lesson.id}
                to={`/tutorial/${lesson.id}`}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-red-400
                  hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg
                  ${done ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {done ? '✓' : '○'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{lesson.title}</div>
                  <div className="text-xs text-gray-500">{lesson.steps.length} step{lesson.steps.length > 1 ? 's' : ''}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
