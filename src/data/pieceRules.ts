import type { PieceType } from '../engine/types';

export interface PieceInfo {
  chineseRed: string;
  chineseBlack: string;
  name: string;
  value: number;
  summary: string;
}

export const PIECE_INFO: Record<PieceType, PieceInfo> = {
  general: {
    chineseRed: '将',
    chineseBlack: '帅',
    name: 'General',
    value: 10000,
    summary: 'Moves one step orthogonally within the palace. The two Generals may never face each other on an open file.',
  },
  advisor: {
    chineseRed: '士',
    chineseBlack: '仕',
    name: 'Advisor',
    value: 200,
    summary: 'Moves one step diagonally and must remain within the palace.',
  },
  elephant: {
    chineseRed: '象',
    chineseBlack: '相',
    name: 'Elephant',
    value: 200,
    summary: 'Moves exactly two steps diagonally. Cannot cross the river. Blocked if the midpoint ("eye") is occupied.',
  },
  horse: {
    chineseRed: '马',
    chineseBlack: '馬',
    name: 'Horse',
    value: 500,
    summary: 'Moves one step orthogonally then one step diagonally outward. Blocked if the first step ("leg") square is occupied.',
  },
  chariot: {
    chineseRed: '车',
    chineseBlack: '車',
    name: 'Chariot',
    value: 900,
    summary: 'Slides any number of squares orthogonally. The most powerful piece.',
  },
  cannon: {
    chineseRed: '炮',
    chineseBlack: '砲',
    name: 'Cannon',
    value: 500,
    summary: 'Moves like a Chariot when not capturing. To capture, it must jump over exactly one piece (the "screen").',
  },
  soldier: {
    chineseRed: '卒',
    chineseBlack: '兵',
    name: 'Soldier',
    value: 100,
    summary: 'Moves one step forward. After crossing the river, may also move one step sideways. Never retreats.',
  },
};

export function getPieceChinese(type: PieceType, color: 'red' | 'black'): string {
  const info = PIECE_INFO[type];
  return color === 'red' ? info.chineseRed : info.chineseBlack;
}
