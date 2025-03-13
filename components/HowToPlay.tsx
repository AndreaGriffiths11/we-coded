'use client';

import React from 'react';
import styles from './HowToPlay.module.css';

export const HowToPlay: React.FC = () => {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>How to Play</h2>
        
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📖 Read Stories</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>Browse through inspiring tech stories from diverse voices</li>
              <li className={styles.listItem}>Click on story titles or author info to read full articles</li>
              <li className={styles.listItem}>Use Previous/Next buttons to navigate between stories</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🎮 Mini-Game</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>Click "Open MiniGame" to start playing</li>
              <li className={styles.listItem}>Use Left/Right arrow keys to move</li>
              <li className={styles.listItem}>Avoid falling obstacles to score points</li>
              <li className={styles.listItem}>Challenge yourself to beat your high score!</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🏆 Track Progress</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>Each story read earns you XP points</li>
              <li className={styles.listItem}>Watch your level increase as you read more</li>
              <li className={styles.listItem}>Share your achievements on social media</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
