'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './MiniGame.module.css';

interface Obstacle {
  id: number;
  left: number;
  top: number;
}

export const MiniGame: React.FC = () => {
  const [playerPosition, setPlayerPosition] = useState(50);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [gameInterval, setGameInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setPlayerPosition(prev => {
      const newPos = direction === 'left' ? prev - 5 : prev + 5;
      return Math.max(0, Math.min(100, newPos));
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') movePlayer('left');
    if (e.key === 'ArrowRight') movePlayer('right');
  }, [movePlayer]);

  const startGame = () => {
    setIsActive(true);
    setScore(0);
    setObstacles([]);
    const interval = setInterval(() => {
      setObstacles(prev => {
        const newObstacles = prev
          .map(obs => ({ ...obs, top: obs.top + 5 }))
          .filter(obs => obs.top < 400);

        if (Math.random() < 0.1) {
          newObstacles.push({
            id: Date.now(),
            left: Math.random() * 90,
            top: -20
          });
        }

        return newObstacles;
      });
      setScore(prev => prev + 1);
    }, 100);
    setGameInterval(interval);
  };

  useEffect(() => {
    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, handleKeyDown]);

  useEffect(() => {
    return () => {
      if (gameInterval) clearInterval(gameInterval);
    };
  }, [gameInterval]);

  useEffect(() => {
    const collision = obstacles.some(obs => {
      const playerRect = {
        left: playerPosition - 2,
        right: playerPosition + 2,
        top: 360,
        bottom: 380
      };

      const obsRect = {
        left: obs.left - 1.5,
        right: obs.left + 1.5,
        top: obs.top - 1.5,
        bottom: obs.top + 1.5
      };

      return !(playerRect.left > obsRect.right || 
               playerRect.right < obsRect.left || 
               playerRect.top > obsRect.bottom ||
               playerRect.bottom < obsRect.top);
    });

    if (collision && isActive) {
      setIsActive(false);
      if (gameInterval) clearInterval(gameInterval);
    }
  }, [obstacles, playerPosition, isActive, gameInterval]);

  return (
    <div className={styles.container}>
      <div 
        className={styles.player}
        style={{ left: `${playerPosition}%` }}
      />
      {obstacles.map(obstacle => (
        <div
          key={obstacle.id}
          className={styles.obstacle}
          style={{
            left: `${obstacle.left}%`,
            top: `${obstacle.top}px`
          }}
        />
      ))}
      <div className={styles.score}>Score: {score}</div>
      {!isActive && (
        <div className={styles.gameStart}>
          <button onClick={startGame} className={styles.startButton}>
            Start Game
          </button>
          <p className={styles.instructions}>
            Use arrow keys to move the green circle left and right to dodge the falling red squares!
          </p>
        </div>
      )}
    </div>
  );
};