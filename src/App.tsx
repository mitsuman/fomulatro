import { useState, useEffect, useCallback } from 'react';
import { TileData, GameStatus, FORMULA_LENGTH, MAX_GUESSES } from './types';
import { evaluateGuess, getKeyStates } from './gameLogic';
import { pickDailyFormula, isValidFormula } from './data/formulas';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import './App.css';

const ANSWER = pickDailyFormula();

export default function App() {
  const [submittedGuesses, setSubmittedGuesses] = useState<TileData[][]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [message, setMessage] = useState('');

  const currentRow = submittedGuesses.length;
  const keyStates = getKeyStates(submittedGuesses);

  const showMessage = (msg: string, duration = 2000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  const submitGuess = useCallback(() => {
    if (currentInput.length !== FORMULA_LENGTH) {
      showMessage(`Formula must be ${FORMULA_LENGTH} characters`);
      return;
    }
    if (!isValidFormula(currentInput)) {
      showMessage('Not a valid math formula');
      return;
    }

    const evaluated = evaluateGuess(currentInput, ANSWER);
    const newGuesses = [...submittedGuesses, evaluated];
    setSubmittedGuesses(newGuesses);
    setCurrentInput('');

    if (currentInput === ANSWER) {
      setGameStatus('won');
      showMessage('Brilliant! 🎉', 3000);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus('lost');
      showMessage(`The answer was: ${ANSWER}`, 5000);
    }
  }, [currentInput, submittedGuesses]);

  const handleKey = useCallback((key: string) => {
    if (gameStatus !== 'playing') return;
    if (currentInput.length < FORMULA_LENGTH) {
      setCurrentInput(prev => prev + key);
    }
  }, [gameStatus, currentInput]);

  const handleBackspace = useCallback(() => {
    if (gameStatus !== 'playing') return;
    setCurrentInput(prev => prev.slice(0, -1));
  }, [gameStatus]);

  const handleEnter = useCallback(() => {
    if (gameStatus !== 'playing') return;
    submitGuess();
  }, [gameStatus, submitGuess]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (key === 'Enter') {
        handleEnter();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (/^[0-9+\-*/=]$/.test(key)) {
        handleKey(key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKey, handleBackspace, handleEnter]);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Fomulatro</h1>
        <p className="app__subtitle">Guess the math formula</p>
      </header>

      {message && (
        <div className="message">{message}</div>
      )}

      <Board
        submittedGuesses={submittedGuesses}
        currentInput={currentInput}
        currentRow={currentRow}
      />

      <Keyboard
        keyStates={keyStates}
        onKey={handleKey}
        onEnter={handleEnter}
        onBackspace={handleBackspace}
      />

      <div className="app__hint">
        <p>Enter a valid equation like <code>10+20=30</code> ({FORMULA_LENGTH} chars)</p>
      </div>
    </div>
  );
}
