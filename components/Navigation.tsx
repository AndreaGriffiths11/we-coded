'use client';

import React from 'react';
import styles from './Navigation.module.css';

interface NavigationProps {
  showMiniGame: boolean;
  onToggleMiniGame: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ showMiniGame, onToggleMiniGame }) => {
  return (
    <nav className={styles.nav}>
      <a href="#about" className={styles.link}>
        📖 How to Play
      </a>
      <a href="#featured-story" className={styles.link}>
        ✨ Featured Stories
      </a>
      <button 
        onClick={onToggleMiniGame}
        className={styles.link}
      >
        {showMiniGame ? '🎯 Close Mini-Game' : '🎮 Play Mini-Game'}
      </button>
    </nav>
  );
};