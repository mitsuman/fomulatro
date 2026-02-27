import { TileData, TileState, FORMULA_LENGTH } from './types';

export function evaluateGuess(guess: string, answer: string): TileData[] {
  const result: TileData[] = Array.from({ length: FORMULA_LENGTH }, (_, i) => ({
    char: guess[i] ?? '',
    state: 'absent' as TileState,
  }));

  const answerChars = answer.split('');
  const guessChars = guess.split('');
  const answerUsed = new Array(FORMULA_LENGTH).fill(false);
  const guessMatched = new Array(FORMULA_LENGTH).fill(false);

  // First pass: find exact matches
  for (let i = 0; i < FORMULA_LENGTH; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i].state = 'correct';
      answerUsed[i] = true;
      guessMatched[i] = true;
    }
  }

  // Second pass: find present (wrong position) matches
  for (let i = 0; i < FORMULA_LENGTH; i++) {
    if (guessMatched[i]) continue;
    for (let j = 0; j < FORMULA_LENGTH; j++) {
      if (answerUsed[j]) continue;
      if (guessChars[i] === answerChars[j]) {
        result[i].state = 'present';
        answerUsed[j] = true;
        break;
      }
    }
  }

  return result;
}

export function getKeyStates(
  guesses: TileData[][]
): Record<string, TileState> {
  const keyStates: Record<string, TileState> = {};

  const priority: Record<TileState, number> = {
    correct: 3,
    present: 2,
    absent: 1,
    filled: 0,
    empty: 0,
  };

  for (const guess of guesses) {
    for (const tile of guess) {
      if (!tile.char) continue;
      const existing = keyStates[tile.char];
      if (!existing || priority[tile.state] > priority[existing]) {
        keyStates[tile.char] = tile.state;
      }
    }
  }

  return keyStates;
}
