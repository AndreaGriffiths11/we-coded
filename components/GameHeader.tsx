'use client';

import React from 'react';
import { Navigation } from './Navigation';
import styles from './GameHeader.module.css';

interface GameHeaderProps {
  title?: string;
  score?: number;
  showMiniGame: boolean;
  onToggleMiniGame: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  title = 'WeCoded Game',
  score = 0,
  showMiniGame,
  onToggleMiniGame
}) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.score}>Score: {score}</div>
        </div>
        <Navigation 
          showMiniGame={showMiniGame} 
          onToggleMiniGame={onToggleMiniGame}
        />
      </div>
    </header>
  );
};