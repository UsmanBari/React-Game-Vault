import React, { useState, useEffect } from 'react';
import './Memory.css';
import ScoreManager from '../../utils/ScoreManager';

const ICONS = ['🚀', '👾', '💎', '⚡', '🔥', '🤖', '🌌', '🎮'];

const Memory = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [moves, setMoves] = useState(0);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const shuffled = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon }));

        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setDisabled(false);
    };

    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
            return;
        }

        if (flipped.length === 1) {
            setDisabled(true);
            setFlipped([...flipped, id]);
            setMoves(prev => prev + 1);

            const firstCard = cards.find(c => c.id === flipped[0]);
            const secondCard = cards.find(c => c.id === id);

            if (firstCard.icon === secondCard.icon) {
                setSolved(prev => [...prev, firstCard.id, secondCard.id]);
                setFlipped([]);
                setDisabled(false);
            } else {
                setTimeout(() => {
                    setFlipped([]);
                    setDisabled(false);
                }, 1000);
            }
        }
    };

    const isGameOver = solved.length === cards.length && cards.length > 0;

    useEffect(() => {
        if (isGameOver) {
            const score = Math.max(0, 1000 - (moves * 10));
            ScoreManager.saveScore('memory', score);
        }
    }, [isGameOver, moves]);

    return (
        <div className="memory-container">
            <div className="memory-stats">
                <span>Moves: {moves}</span>
                <span>Pairs: {solved.length / 2} / {ICONS.length}</span>
            </div>

            <div className="memory-grid">
                {cards.map(card => (
                    <div
                        key={card.id}
                        className={`memory-card ${flipped.includes(card.id) || solved.includes(card.id) ? 'flipped' : ''}`}
                        onClick={() => handleClick(card.id)}
                    >
                        <div className="card-face card-back"></div>
                        <div className="card-face card-front">{card.icon}</div>
                    </div>
                ))}
            </div>

            {isGameOver && (
                <div className="game-over-msg win-msg">
                    MEMORY UPGRADED!
                    <br />
                    <button className="reset-btn" onClick={startNewGame}>REPLAY</button>
                </div>
            )}
        </div>
    );
};

export default Memory;
