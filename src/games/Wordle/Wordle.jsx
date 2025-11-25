import React, { useState, useEffect } from 'react';
import './Wordle.css';
import ScoreManager from '../../utils/ScoreManager';

const WORDS = ['REACT', 'BUILD', 'CODE', 'GAMES', 'NEXUS', 'VITE', 'STACK', 'LIGHT', 'POWER', 'CYBER'];
const FIVE_LETTER_WORDS = WORDS.filter(w => w.length === 5);

const Wordle = () => {
    const [solution, setSolution] = useState('');
    const [guesses, setGuesses] = useState(Array(6).fill(null));
    const [currentGuess, setCurrentGuess] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const randomWord = FIVE_LETTER_WORDS[Math.floor(Math.random() * FIVE_LETTER_WORDS.length)];
        setSolution(randomWord);
        setGuesses(Array(6).fill(null));
        setCurrentGuess('');
        setIsGameOver(false);
        setMessage('');
    };

    const handleKey = (key) => {
        if (isGameOver) return;

        if (key === 'ENTER') {
            if (currentGuess.length !== 5) {
                setMessage('Not enough letters');
                return;
            }

            const newGuesses = [...guesses];
            const firstEmptyIndex = newGuesses.findIndex(val => val === null);
            newGuesses[firstEmptyIndex] = currentGuess;
            setGuesses(newGuesses);
            setCurrentGuess('');

            if (currentGuess === solution) {
                setIsGameOver(true);
                setMessage('IMPRESSIVE!');
                ScoreManager.saveScore('wordle', 100);
            } else if (firstEmptyIndex === 5) {
                setIsGameOver(true);
                setMessage(`GAME OVER: ${solution}`);
            }
        } else if (key === 'BACKSPACE') {
            setCurrentGuess(prev => prev.slice(0, -1));
            setMessage('');
        } else {
            if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
                setCurrentGuess(prev => prev + key);
            }
        }
    };

    // Keyboard listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key.toUpperCase();
            if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
                handleKey(key);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentGuess, isGameOver, guesses]);

    const getLetterStatus = (letter, index) => {
        if (!solution.includes(letter)) return 'absent';
        if (solution[index] === letter) return 'correct';
        return 'present';
    };

    const getKeyStatus = (key) => {
        let status = '';
        guesses.forEach(guess => {
            if (!guess) return;
            for (let i = 0; i < 5; i++) {
                if (guess[i] === key) {
                    if (solution[i] === key) return 'correct';
                    if (solution.includes(key)) status = status !== 'correct' ? 'present' : status;
                    else status = status || 'absent';
                }
            }
        });
        return status;
    };

    return (
        <div className="wordle-container">
            <div className="wordle-grid">
                {guesses.map((guess, i) => {
                    const isCurrent = i === guesses.findIndex(val => val === null);
                    return (
                        <div key={i} className="wordle-row">
                            {Array(5).fill(0).map((_, j) => {
                                const letter = isCurrent ? currentGuess[j] : (guess ? guess[j] : '');
                                let status = '';
                                if (guess) status = getLetterStatus(letter, j);

                                return (
                                    <div key={j} className={`wordle-cell ${letter ? 'filled' : ''} ${status}`}>
                                        {letter}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {message && <div className="game-over-msg" style={{ fontSize: '1.5rem' }}>{message}</div>}
            {isGameOver && <button className="reset-btn" onClick={startNewGame}>PLAY AGAIN</button>}

            <div className="wordle-keyboard">
                {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
                    <div key={i} className="keyboard-row">
                        {i === 2 && <button className="key-btn wide" onClick={() => handleKey('ENTER')}>ENTER</button>}
                        {row.split('').map(char => (
                            <button
                                key={char}
                                className={`key-btn ${getKeyStatus(char)}`}
                                onClick={() => handleKey(char)}
                            >
                                {char}
                            </button>
                        ))}
                        {i === 2 && <button className="key-btn wide" onClick={() => handleKey('BACKSPACE')}>⌫</button>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wordle;
