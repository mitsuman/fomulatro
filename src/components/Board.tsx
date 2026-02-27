import { TileData, MAX_GUESSES } from '../types';
import { Row } from './Row';
import './Board.css';

interface BoardProps {
  submittedGuesses: TileData[][];
  currentInput: string;
  currentRow: number;
}

export function Board({ submittedGuesses, currentInput, currentRow }: BoardProps) {
  return (
    <div className="board">
      {Array.from({ length: MAX_GUESSES }, (_, i) => {
        if (i < submittedGuesses.length) {
          return <Row key={i} tiles={submittedGuesses[i]} />;
        }
        if (i === currentRow) {
          const tiles = currentInput.split('').map(char => ({
            char,
            state: 'filled' as const,
          }));
          return <Row key={i} tiles={tiles} isCurrentRow />;
        }
        return <Row key={i} tiles={[]} />;
      })}
    </div>
  );
}
