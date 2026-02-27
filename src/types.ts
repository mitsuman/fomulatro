export type TileState = 'empty' | 'filled' | 'correct' | 'present' | 'absent';

export interface TileData {
  char: string;
  state: TileState;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export const FORMULA_LENGTH = 8;
export const MAX_GUESSES = 6;
