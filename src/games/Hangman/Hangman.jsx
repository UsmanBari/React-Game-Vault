import React, { useState, useEffect } from 'react';
import './Hangman.css';
import ScoreManager from '../../utils/ScoreManager';

const WORDS = ['REACT', 'CONSOLE', 'GAMING', 'FUTURE', 'CYBER', 'NEON', 'VITE', 'CODE', 'PIXEL', 'NEXUS'];

const Hangman = () => {
    const [targetWord, setTargetWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState(new Set());
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const maxWrong = 6;

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        setTargetWord(randomWord);
        setGuessedLetters(new Set());
        setWrongGuesses(0);
    };

    const handleGuess = (letter) => {
        if (guessedLetters.has(letter) || wrongGuesses >= maxWrong) return;

        const newGuessed = new Set(guessedLetters);
        newGuessed.add(letter);
        setGuessedLetters(newGuessed);

        if (!targetWord.includes(letter)) {
            setWrongGuesses(prev => prev + 1);
        }
    };

    const isWinner = targetWord.split('').every(char => guessedLetters.has(char));
    const isLoser = wrongGuesses >= maxWrong;

    useEffect(() => {
        if (isWinner) {
            ScoreManager.saveScore('hangman', 100);
        }
    }, [isWinner]);

    const renderDrawing = () => {
        return (
            <svg className="hangman-drawing" viewBox="0 0 200 250">
                {/* Base */}
                <line x1="20" y1="230" x2="180" y2="230" />
                <line x1="100" y1="230" x2="100" y2="20" />
                <line x1="100" y1="20" x2="150" y2="20" />
                <line x1="150" y1="20" x2="150" y2="50" />

                {/* Head */}
                {wrongGuesses >= 1 && <circle cx="150" cy="70" r="20" />}
                {/* Body */}
                {wrongGuesses >= 2 && <line x1="150" y1="90" x2="150" y2="150" />}
                {/* Arms */}
                {wrongGuesses >= 3 && <line x1="150" y1="110" x2="120" y2="140" />}
                {wrongGuesses >= 4 && <line x1="150" y1="110" x2="180" y2="140" />}
                {/* Legs */}
                {wrongGuesses >= 5 && <line x1="150" y1="150" x2="120" y2="190" />}
                {wrongGuesses >= 6 && <line x1="150" y1="150" x2="180" y2="190" />}
            </svg>
        );
    };

    return (
        <div className="hangman-container">
            {renderDrawing()}

            <div className="word-display">
                {targetWord.split('').map((char, index) => (
                    <span key={index} className="letter-slot">
                        {guessedLetters.has(char) || isLoser ? char : ''}
                    </span>
                ))}
            </div>

            {(isWinner || isLoser) && (
                <div className={isWinner ? "win-msg" : "game-over-msg"}>
                    {isWinner ? "SYSTEM HACKED! YOU WIN" : "SYSTEM FAILURE! GAME OVER"}
                    <br />
                    <button className="reset-btn" onClick={startNewGame}>REBOOT SYSTEM</button>
                </div>
            )}

            <div className="keyboard">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
                    const isGuessed = guessedLetters.has(letter);
                    const isCorrect = targetWord.includes(letter);
                    let btnClass = "key-btn";
                    if (isGuessed) btnClass += isCorrect ? " correct" : " wrong";

                    return (
                        <button
                            key={letter}
                            className={btnClass}
                            onClick={() => handleGuess(letter)}
                            disabled={isGuessed || isWinner || isLoser}
                        >
                            {letter}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Hangman;
