import { useCallback } from 'react';
import { useSettingsStore } from '../store/settingsStore';

function beep(freq: number, duration: number, volume = 0.15) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.start();
    osc.stop(ctx.currentTime + duration);
    osc.onended = () => ctx.close();
  } catch {
    // AudioContext unavailable in test environments
  }
}

export function useSound() {
  const soundEnabled = useSettingsStore(s => s.soundEnabled);

  const playMove = useCallback(() => {
    if (soundEnabled) beep(440, 0.08);
  }, [soundEnabled]);

  const playCapture = useCallback(() => {
    if (soundEnabled) beep(220, 0.12);
  }, [soundEnabled]);

  const playCheck = useCallback(() => {
    if (soundEnabled) {
      beep(660, 0.08);
      setTimeout(() => beep(440, 0.08), 120);
    }
  }, [soundEnabled]);

  return { playMove, playCapture, playCheck };
}
