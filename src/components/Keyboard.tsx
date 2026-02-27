import { TileState } from '../types';
import './Keyboard.css';

const ROWS = [
  ['7', '8', '9', '+', '-'],
  ['4', '5', '6', '*', '/'],
  ['1', '2', '3', '0', '='],
];

interface KeyboardProps {
  keyStates: Record<string, TileState>;
  onKey: (key: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
}

export function Keyboard({ keyStates, onKey, onEnter, onBackspace }: KeyboardProps) {
  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={i} className="keyboard__row">
          {i === 2 && (
            <button className="key key--wide" onClick={onBackspace}>
              ⌫
            </button>
          )}
          {row.map(key => (
            <button
              key={key}
              className={`key key--${keyStates[key] ?? 'default'}`}
              onClick={() => onKey(key)}
            >
              {key}
            </button>
          ))}
          {i === 2 && (
            <button className="key key--wide key--enter" onClick={onEnter}>
              Enter
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
