import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DEPTH_MAP: Record<Difficulty, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
};

export const RANDOM_MAP: Record<Difficulty, number> = {
  easy: 0.2,
  medium: 0,
  hard: 0,
};

interface SettingsState {
  difficulty: Difficulty;
  boardFlipped: boolean;
  soundEnabled: boolean;
  tutorialProgress: Record<string, number>;
  setDifficulty: (d: Difficulty) => void;
  toggleBoardFlip: () => void;
  toggleSound: () => void;
  setTutorialProgress: (lessonId: string, step: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      difficulty: 'medium',
      boardFlipped: false,
      soundEnabled: true,
      tutorialProgress: {},
      setDifficulty: (difficulty) => set({ difficulty }),
      toggleBoardFlip: () => set((s) => ({ boardFlipped: !s.boardFlipped })),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setTutorialProgress: (lessonId, step) =>
        set((s) => ({
          tutorialProgress: { ...s.tutorialProgress, [lessonId]: step },
        })),
    }),
    { name: 'xiangqi-settings' },
  ),
);
