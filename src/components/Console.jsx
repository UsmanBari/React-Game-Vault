import React, { useState, useEffect } from 'react';
import '../styles/Console.css';
import Hangman from '../games/Hangman/Hangman';
import Wordle from '../games/Wordle/Wordle';
import Snake from '../games/Snake/Snake';
import Memory from '../games/Memory/Memory';
import ScoreManager from '../utils/ScoreManager';

const Console = () => {
    const [activeGame, setActiveGame] = useState(null);
    const [scores, setScores] = useState({ hangman: 0, wordle: 0, snake: 0, memory: 0 });

    useEffect(() => {
        setScores(ScoreManager.getHighScores());
    }, [activeGame]);

    const games = [
        { id: 'hangman', name: 'Hangman', description: 'Guess the word before it\'s too late.' },
        { id: 'wordle', name: 'Wordle', description: 'Crack the 5-letter code.' },
        { id: 'snake', name: 'Snake', description: 'Eat, grow, and survive.' },
        { id: 'memory', name: 'Memory', description: 'Test your brain power.' },
    ];

    const renderGame = () => {
        switch (activeGame) {
            case 'hangman': return <Hangman />;
            case 'wordle': return <Wordle />;
            case 'snake': return <Snake />;
            case 'memory': return <Memory />;
            default: return null;
        }
    };

    return (
        <div className="console-container">
            <header className="console-header glass-panel">
                <h1 className="glow-text">NEXUS CONSOLE</h1>
                <div className="status-bar">
                    <span>ONLINE</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                </div>
            </header>

            <main className="console-main">
                {activeGame ? (
                    <div className="game-wrapper glass-panel">
                        <button className="back-btn" onClick={() => setActiveGame(null)}>← Back to Menu</button>
                        {renderGame()}
                    </div>
                ) : (
                    <div className="game-grid">
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className="game-card glass-panel"
                                onClick={() => setActiveGame(game.id)}
                            >
                                <div className="card-header">
                                    <h2>{game.name}</h2>
                                    <span className="high-score">🏆 {scores[game.id] || 0}</span>
                                </div>
                                <p>{game.description}</p>
                                <div className="play-indicator">PLAY ▶</div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Console;
