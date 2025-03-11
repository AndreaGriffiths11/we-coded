'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Obstacle {
  id: number;
  left: number;
  top: number;
}

export const MiniGame: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const requestRef = useRef<number | undefined>(undefined);
  const obstacleId = useRef(0);

  const startGame = () => {
    if (!isActive) {
      setIsActive(true);
      setScore(0);
      setObstacles([]);
    }
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isActive) return;

      if (e.key === 'ArrowLeft') {
        setPlayerPosition(prev => Math.max(0, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setPlayerPosition(prev => Math.min(100, prev + 5));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive]);

  // Game loop
  useEffect(() => {
    if (!isActive) return;

    const updateGame = () => {
      // Randomly spawn new obstacles
      if (Math.random() < 0.05) {
        const newObstacle = {
          id: obstacleId.current++,
          left: Math.random() * 100,
          top: -20
        };
        setObstacles(prev => [...prev, newObstacle]);
      }

      // Update obstacle positions and handle collisions
      setObstacles(prev => {
        const newObstacles = prev
          .map(obstacle => ({
            ...obstacle,
            top: obstacle.top + 2
          }))
          .filter(obstacle => {
            // Check for collisions
            if (obstacle.top > 250 && obstacle.top < 280) {
              if (Math.abs(obstacle.left - playerPosition) < 10) {
                setIsActive(false);
                return false;
              }
            }
            // Remove obstacles that are off screen and increment score
            if (obstacle.top > 300) {
              setScore(s => s + 1);
              return false;
            }
            return true;
          });
        return newObstacles;
      });

      requestRef.current = requestAnimationFrame(updateGame);
    };

    requestRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, playerPosition]);

  return (
    <div 
      className="mini-game"
      tabIndex={0} 
      onFocus={() => {}}
      style={{ outline: 'none' }}
    >
      <div className="mini-game-player" style={{ left: `${playerPosition}%` }} />
      {obstacles.map(obstacle => (
        <div
          key={obstacle.id}
          className="mini-game-obstacle"
          style={{
            left: `${obstacle.left}%`,
            top: `${obstacle.top}px`
          }}
        />
      ))}
      <div className="game-score">Score: {score}</div>
      {!isActive && (
        <div className="game-start">
          <button onClick={startGame} className="game-button primary">
            Start Game
          </button>
          <p className="game-instructions">
            Use arrow keys to move the green circle left and right to dodge the falling red squares!
          </p>
        </div>
      )}
    </div>
  );
};