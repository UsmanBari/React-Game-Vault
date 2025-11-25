import React, { useState, useEffect, useRef } from 'react';
import './Snake.css';
import ScoreManager from '../../utils/ScoreManager';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

const Snake = () => {
    const [snake, setSnake] = useState(INITIAL_SNAKE);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [direction, setDirection] = useState(INITIAL_DIRECTION);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const directionRef = useRef(INITIAL_DIRECTION);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 };
                    break;
                case 'ArrowDown':
                    if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 };
                    break;
                case 'ArrowLeft':
                    if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 };
                    break;
                case 'ArrowRight':
                    if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 };
                    break;
                case ' ':
                    setIsPaused(prev => !prev);
                    break;
                default: break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isGameOver || isPaused) return;

        const moveSnake = () => {
            setDirection(directionRef.current);
            const newHead = {
                x: snake[0].x + directionRef.current.x,
                y: snake[0].y + directionRef.current.y
            };

            // Check collisions
            if (
                newHead.x < 0 || newHead.x >= BOARD_SIZE ||
                newHead.y < 0 || newHead.y >= BOARD_SIZE ||
                snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
            ) {
                setIsGameOver(true);
                ScoreManager.saveScore('snake', score);
                return;
            }

            const newSnake = [newHead, ...snake];

            // Check food
            if (newHead.x === food.x && newHead.y === food.y) {
                setScore(prev => prev + 10);
                generateFood(newSnake);
            } else {
                newSnake.pop();
            }

            setSnake(newSnake);
        };

        const gameInterval = setInterval(moveSnake, SPEED);
        return () => clearInterval(gameInterval);
    }, [snake, isGameOver, isPaused, food, score]);

    const generateFood = (currentSnake) => {
        let newFood;
        while (true) {
            newFood = {
                x: Math.floor(Math.random() * BOARD_SIZE),
                y: Math.floor(Math.random() * BOARD_SIZE)
            };
            if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
                break;
            }
        }
        setFood(newFood);
    };

    const resetGame = () => {
        setSnake(INITIAL_SNAKE);
        setDirection(INITIAL_DIRECTION);
        directionRef.current = INITIAL_DIRECTION;
        setScore(0);
        setIsGameOver(false);
        setIsPaused(false);
        generateFood(INITIAL_SNAKE);
    };

    return (
        <div className="snake-container">
            <div className="score-board">Score: {score}</div>

            <div className="snake-board">
                {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
                    const x = index % BOARD_SIZE;
                    const y = Math.floor(index / BOARD_SIZE);
                    const isSnakeBody = snake.some(s => s.x === x && s.y === y);
                    const isSnakeHead = snake[0].x === x && snake[0].y === y;
                    const isFood = food.x === x && food.y === y;

                    let className = 'snake-cell';
                    if (isSnakeHead) className += ' snake-head';
                    else if (isSnakeBody) className += ' snake-body';
                    else if (isFood) className += ' food';

                    return <div key={index} className={className}></div>;
                })}
            </div>

            {isGameOver && (
                <div className="game-over-msg">
                    GAME OVER
                    <br />
                    <button className="reset-btn" onClick={resetGame}>TRY AGAIN</button>
                </div>
            )}

            {isPaused && !isGameOver && <div className="game-over-msg" style={{ color: 'yellow' }}>PAUSED</div>}

            <div className="controls-hint">Use Arrow Keys to Move • Space to Pause</div>
        </div>
    );
};

export default Snake;
