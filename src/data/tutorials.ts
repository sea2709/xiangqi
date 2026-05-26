export interface TutorialStep {
  fen: string;
  narrative: string;
  allowedMoves: [number, number][];
  highlightSquares?: number[];
}

export interface Lesson {
  id: string;
  title: string;
  pieceType: string;
  steps: TutorialStep[];
}

function idx(row: number, col: number) { return row * 9 + col; }

export const LESSONS: Lesson[] = [
  {
    id: 'chariot',
    title: 'The Chariot (車)',
    pieceType: 'chariot',
    steps: [
      {
        fen: '9/9/9/9/9/9/9/9/4R4/4K4 w - - 0 1',
        narrative: 'The Chariot slides any number of squares horizontally or vertically — it\'s the most powerful piece. Click the Chariot and move it right to the edge.',
        allowedMoves: [[idx(8, 4), idx(8, 8)]],
        highlightSquares: [idx(8, 8)],
      },
      {
        fen: '9/9/9/9/9/9/9/9/8R/4K4 w - - 0 1',
        narrative: 'Now move the Chariot straight up the column — it can go all the way!',
        allowedMoves: [[idx(8, 8), idx(0, 8)]],
        highlightSquares: [idx(0, 8)],
      },
    ],
  },
  {
    id: 'cannon',
    title: 'The Cannon (炮)',
    pieceType: 'cannon',
    steps: [
      {
        fen: '9/9/9/9/9/9/9/9/4C4/4K4 w - - 0 1',
        narrative: 'The Cannon moves like a Chariot when not capturing. Move it left.',
        allowedMoves: [[idx(8, 4), idx(8, 0)]],
        highlightSquares: [idx(8, 0)],
      },
      {
        fen: '4k4/9/9/9/9/9/9/4r4/4C4/4K4 w - - 0 1',
        narrative: 'To CAPTURE, a Cannon must jump over exactly one piece — the "screen". Move the Cannon up to capture the enemy Chariot by jumping over your own Chariot.',
        allowedMoves: [[idx(8, 4), idx(6, 4)]],
        highlightSquares: [idx(6, 4)],
      },
    ],
  },
  {
    id: 'horse',
    title: 'The Horse (馬)',
    pieceType: 'horse',
    steps: [
      {
        fen: '9/9/9/9/9/9/9/9/4H4/4K4 w - - 0 1',
        narrative: 'The Horse moves one step orthogonally, then one step diagonally outward (an L-shape). Move the Horse to one of the highlighted squares.',
        allowedMoves: [
          [idx(8, 4), idx(6, 3)],
          [idx(8, 4), idx(6, 5)],
          [idx(8, 4), idx(7, 2)],
          [idx(8, 4), idx(7, 6)],
        ],
        highlightSquares: [idx(6, 3), idx(6, 5), idx(7, 2), idx(7, 6)],
      },
      {
        fen: '9/9/9/9/9/9/9/4H4/9/4K4 w - - 0 1',
        narrative: 'If the first orthogonal step (the "leg") is blocked, the Horse cannot move in that direction. The Chariot is on the Horse\'s leg — move the Horse to a valid square.',
        allowedMoves: [
          [idx(7, 4), idx(5, 3)],
          [idx(7, 4), idx(5, 5)],
          [idx(7, 4), idx(6, 2)],
          [idx(7, 4), idx(6, 6)],
          [idx(7, 4), idx(8, 2)],
          [idx(7, 4), idx(8, 6)],
        ],
        highlightSquares: [idx(5, 3), idx(5, 5), idx(6, 2), idx(6, 6), idx(8, 2), idx(8, 6)],
      },
    ],
  },
  {
    id: 'elephant',
    title: 'The Elephant (象)',
    pieceType: 'elephant',
    steps: [
      {
        fen: '9/9/9/9/9/9/9/9/4B4/4K4 w - - 0 1',
        narrative: 'The Elephant moves exactly two steps diagonally. It can never cross the river (the middle of the board). Move it to one of the highlighted squares.',
        allowedMoves: [
          [idx(8, 4), idx(6, 2)],
          [idx(8, 4), idx(6, 6)],
        ],
        highlightSquares: [idx(6, 2), idx(6, 6)],
      },
    ],
  },
  {
    id: 'advisor',
    title: 'The Advisor (仕)',
    pieceType: 'advisor',
    steps: [
      {
        fen: '9/9/9/9/9/9/9/9/9/3AKA3 w - - 0 1',
        narrative: 'Advisors move one step diagonally and must stay within the palace (the 3×3 area with the diagonal lines). Move an Advisor toward the center.',
        allowedMoves: [
          [idx(9, 3), idx(8, 4)],
          [idx(9, 5), idx(8, 4)],
        ],
        highlightSquares: [idx(8, 4)],
      },
    ],
  },
  {
    id: 'general',
    title: 'The General (帅)',
    pieceType: 'general',
    steps: [
      {
        fen: '9/9/9/9/9/9/9/9/9/3AKA3 w - - 0 1',
        narrative: 'The General moves one step orthogonally and must remain inside the palace. Move the General forward one step.',
        allowedMoves: [[idx(9, 4), idx(8, 4)]],
        highlightSquares: [idx(8, 4)],
      },
    ],
  },
  {
    id: 'soldier',
    title: 'The Soldier (兵)',
    pieceType: 'soldier',
    steps: [
      {
        fen: '9/9/9/9/9/4P4/9/9/9/4K4 w - - 0 1',
        narrative: 'Before crossing the river, a Soldier can only move forward (toward the enemy). Move the Soldier forward one step.',
        allowedMoves: [[idx(5, 4), idx(4, 4)]],
        highlightSquares: [idx(4, 4)],
      },
      {
        fen: '9/9/9/9/9/9/9/4P4/9/4K4 w - - 0 1',
        narrative: 'Wait — this Soldier has already crossed the river (it\'s now in rows 0–4). It can now move forward OR sideways. Move it sideways.',
        allowedMoves: [
          [idx(7, 4), idx(6, 4)],
          [idx(7, 4), idx(7, 3)],
          [idx(7, 4), idx(7, 5)],
        ],
        highlightSquares: [idx(7, 3), idx(7, 5)],
      },
    ],
  },
  {
    id: 'check',
    title: 'Check & Escape',
    pieceType: 'chariot',
    steps: [
      {
        fen: '9/4k4/9/9/9/9/9/9/4R4/4K4 w - - 0 1',
        narrative: 'Your Chariot is giving the Black General check! The Black General must escape. Move the General to a safe square.',
        allowedMoves: [
          [idx(1, 4), idx(1, 3)],
          [idx(1, 4), idx(1, 5)],
          [idx(1, 4), idx(2, 4)],
        ],
        highlightSquares: [idx(1, 3), idx(1, 5), idx(2, 4)],
      },
    ],
  },
  {
    id: 'checkmate',
    title: 'Checkmate',
    pieceType: 'chariot',
    steps: [
      {
        fen: '4k4/9/9/8R/9/9/9/9/8R/4K4 w - - 0 1',
        narrative: 'Move the upper Chariot to the back rank to deliver checkmate! The Black General has no escape.',
        allowedMoves: [[idx(3, 8), idx(0, 8)]],
        highlightSquares: [idx(0, 8)],
      },
    ],
  },
];
