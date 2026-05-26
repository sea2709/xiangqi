import type { Difficulty } from '../../store/settingsStore';
import { useSettingsStore } from '../../store/settingsStore';

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function DifficultySelector() {
  const difficulty = useSettingsStore(s => s.difficulty);
  const setDifficulty = useSettingsStore(s => s.setDifficulty);

  return (
    <div className="flex gap-1">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => setDifficulty(opt.value)}
          className={`flex-1 py-1 text-xs rounded border transition-colors ${
            difficulty === opt.value
              ? 'bg-red-700 text-white border-red-700'
              : 'bg-white text-gray-700 border-gray-300 hover:border-red-400'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
