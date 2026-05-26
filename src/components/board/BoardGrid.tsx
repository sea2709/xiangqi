const CELL = 60;
const PAD = 40;

export function BoardGrid() {
  const lines: React.ReactNode[] = [];

  // Horizontal lines
  for (let r = 0; r < 10; r++) {
    const y = PAD + r * CELL;
    lines.push(
      <line key={`h${r}`} x1={PAD} y1={y} x2={PAD + 8 * CELL} y2={y}
        stroke="#8B6914" strokeWidth="1" />,
    );
  }

  // Vertical lines (with river gap)
  for (let c = 0; c < 9; c++) {
    const x = PAD + c * CELL;
    if (c === 0 || c === 8) {
      lines.push(
        <line key={`v${c}`} x1={x} y1={PAD} x2={x} y2={PAD + 9 * CELL}
          stroke="#8B6914" strokeWidth="1" />,
      );
    } else {
      lines.push(
        <line key={`v${c}t`} x1={x} y1={PAD} x2={x} y2={PAD + 4 * CELL}
          stroke="#8B6914" strokeWidth="1" />,
      );
      lines.push(
        <line key={`v${c}b`} x1={x} y1={PAD + 5 * CELL} x2={x} y2={PAD + 9 * CELL}
          stroke="#8B6914" strokeWidth="1" />,
      );
    }
  }

  // Palace diagonals — black (top)
  lines.push(
    <line key="pd-bl" x1={PAD + 3 * CELL} y1={PAD} x2={PAD + 5 * CELL} y2={PAD + 2 * CELL}
      stroke="#8B6914" strokeWidth="1" />,
    <line key="pd-br" x1={PAD + 5 * CELL} y1={PAD} x2={PAD + 3 * CELL} y2={PAD + 2 * CELL}
      stroke="#8B6914" strokeWidth="1" />,
  );

  // Palace diagonals — red (bottom)
  lines.push(
    <line key="pd-rl" x1={PAD + 3 * CELL} y1={PAD + 7 * CELL} x2={PAD + 5 * CELL} y2={PAD + 9 * CELL}
      stroke="#8B6914" strokeWidth="1" />,
    <line key="pd-rr" x1={PAD + 5 * CELL} y1={PAD + 7 * CELL} x2={PAD + 3 * CELL} y2={PAD + 9 * CELL}
      stroke="#8B6914" strokeWidth="1" />,
  );

  // River labels
  lines.push(
    <text key="river-l" x={PAD + 1.5 * CELL} y={PAD + 4.6 * CELL}
      fontSize="18" fill="#8B6914" textAnchor="middle" dominantBaseline="middle"
      fontFamily="serif">楚河</text>,
    <text key="river-r" x={PAD + 6.5 * CELL} y={PAD + 4.6 * CELL}
      fontSize="18" fill="#8B6914" textAnchor="middle" dominantBaseline="middle"
      fontFamily="serif">漢界</text>,
  );

  // Soldier position marks (dots at intersections)
  const soldierMarks = [
    [3, 0], [3, 2], [3, 4], [3, 6], [3, 8],
    [6, 0], [6, 2], [6, 4], [6, 6], [6, 8],
  ];
  for (const [r, c] of soldierMarks) {
    const cx = PAD + c * CELL;
    const cy = PAD + r * CELL;
    const size = 6;
    const isLeft = c > 0;
    const isRight = c < 8;
    const isTop = r > 0;
    const isBottom = r < 9;

    if (isLeft && isTop) {
      lines.push(
        <line key={`sm-lt-${r}-${c}`} x1={cx - size} y1={cy} x2={cx - 2} y2={cy} stroke="#8B6914" strokeWidth="1" />,
        <line key={`sm-tl-${r}-${c}`} x1={cx} y1={cy - size} x2={cx} y2={cy - 2} stroke="#8B6914" strokeWidth="1" />,
      );
    }
    if (isRight && isTop) {
      lines.push(
        <line key={`sm-rt-${r}-${c}`} x1={cx + 2} y1={cy} x2={cx + size} y2={cy} stroke="#8B6914" strokeWidth="1" />,
        <line key={`sm-tr-${r}-${c}`} x1={cx} y1={cy - size} x2={cx} y2={cy - 2} stroke="#8B6914" strokeWidth="1" />,
      );
    }
    if (isLeft && isBottom) {
      lines.push(
        <line key={`sm-lb-${r}-${c}`} x1={cx - size} y1={cy} x2={cx - 2} y2={cy} stroke="#8B6914" strokeWidth="1" />,
        <line key={`sm-bl-${r}-${c}`} x1={cx} y1={cy + 2} x2={cx} y2={cy + size} stroke="#8B6914" strokeWidth="1" />,
      );
    }
    if (isRight && isBottom) {
      lines.push(
        <line key={`sm-rb-${r}-${c}`} x1={cx + 2} y1={cy} x2={cx + size} y2={cy} stroke="#8B6914" strokeWidth="1" />,
        <line key={`sm-br-${r}-${c}`} x1={cx} y1={cy + 2} x2={cx} y2={cy + size} stroke="#8B6914" strokeWidth="1" />,
      );
    }
  }

  return <g>{lines}</g>;
}
