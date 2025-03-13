'use client';

import React from 'react';
import styles from './GameStats.module.css';

interface GameStatsProps {
  stats: {
    storiesCount: number;
    authorsCount: number;
    countriesCount: number;
    yearsCount: number;
  };
}

export const GameStats: React.FC<GameStatsProps> = ({ stats }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>WeCoded Stats - Level 2</h2>
      <div className={styles.container}>
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <div className={styles.statValue}>{stats.storiesCount}</div>
            <div className={styles.statLabel}>Stories Shared</div>
          </div>
          
          <div className={styles.statBox}>
            <div className={styles.statValue}>{stats.authorsCount}</div>
            <div className={styles.statLabel}>Authors</div>
          </div>
          
          <div className={styles.statBox}>
            <div className={styles.statValue}>{stats.countriesCount}</div>
            <div className={styles.statLabel}>Countries</div>
          </div>
        </div>

        <div className={`${styles.statsRow} ${styles.centerStats}`}>
          <div className={styles.statBox}>
            <div className={styles.statValue}>{stats.yearsCount}</div>
            <div className={styles.statLabel}>Years Strong</div>
          </div>
        </div>
      </div>
    </div>
  );
};