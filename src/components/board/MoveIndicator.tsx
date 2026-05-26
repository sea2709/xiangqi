import type { Move } from '../../engine/types';

const CELL = 60;
const PAD = 40;

interface Props {
  move: Move;
  onClick: () => void;
}

export function MoveIndicator({ move, onClick }: Props) {
  const row = Math.floor(move.to / 9);
  const col = move.to % 9;
  const cx = PAD + col * CELL;
  const cy = PAD + row * CELL;

  if (move.capture) {
    return (
      <circle
        cx={cx} cy={cy} r={26}
        fill="none"
        stroke="rgba(220,38,38,0.75)"
        strokeWidth="3"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
        aria-label={`Capture at row ${row} column ${col}`}
        role="button"
      />
    );
  }

  return (
    <circle
      cx={cx} cy={cy} r={10}
      fill="rgba(34,197,94,0.7)"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      aria-label={`Move to row ${row} column ${col}`}
      role="button"
    />
  );
}
