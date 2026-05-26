export type Color = 'red' | 'black';

export type PieceType =
  | 'general'
  | 'advisor'
  | 'elephant'
  | 'horse'
  | 'chariot'
  | 'cannon'
  | 'soldier';

export interface Piece {
  type: PieceType;
  color: Color;
}

export type Square = Piece | null;

export interface Move {
  from: number;
  to: number;
  capture?: Piece;
}

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';

export interface GameState {
  board: Square[];
  turn: Color;
  moveHistory: Move[];
  positionHistory: string[];
  status: GameStatus;
  redCaptured: Piece[];
  blackCaptured: Piece[];
}
