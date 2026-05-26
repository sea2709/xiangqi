interface Props {
  narrative: string;
  stepIndex: number;
  totalSteps: number;
  lessonTitle: string;
  onPrev: () => void;
  onNext: () => void;
  completed: boolean;
}

export function TutorialOverlay({
  narrative, stepIndex, totalSteps, lessonTitle, onPrev, onNext, completed,
}: Props) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-amber-900">{lessonTitle}</h3>
        <span className="text-xs text-amber-700">
          Step {stepIndex + 1} / {totalSteps}
        </span>
      </div>
      <p className="text-sm text-amber-800">{narrative}</p>
      {completed && (
        <p className="text-sm font-semibold text-green-700">
          ✓ Step complete! {stepIndex + 1 < totalSteps ? 'Continue to the next step.' : 'Lesson complete!'}
        </p>
      )}
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={stepIndex === 0}
          className="px-3 py-1 text-xs border border-amber-300 rounded hover:bg-amber-100
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={stepIndex >= totalSteps - 1}
          className="px-3 py-1 text-xs border border-amber-300 rounded hover:bg-amber-100
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
