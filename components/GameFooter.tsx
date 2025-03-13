'use client';

import React from 'react';
import styles from './GameFooter.module.css';

export const GameFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <h2 className={styles.title}>🎮 About this game 🎉</h2>
        <p className={styles.subtitle}>
          Big props for being here! This is my entry for the DEV.to WeCoded Challenge 2025. 
          It's Next.js-powered, GitHub Copilot assisted, and runs on pure cafecito vibes—because 
          tech's better when we've got each other's backs.
        </p>
        
        <div className={styles.badge}>
          <span className={styles.badgeLabel}>Challenge Submission</span>
          <p className={styles.badgeText}>
            Gamifying the experience of reading diverse tech stories. Let's make tech more inclusive, one story at a time! 🚀
          </p>
        </div>
        
        <div className={styles.socialLinks}>
          <a href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20game%20celebrating%20diversity%20in%20tech!%20Join%20the%20WeCoded%20challenge%20%23WeCoded%20%23DevCommunity" 
             className={styles.socialLink} 
             aria-label="Share on Twitter"
             target="_blank"
             rel="noopener noreferrer">
            🐦
          </a>
          <a href="https://github.com/alacolombiadev/wecoded-game" 
             className={styles.socialLink} 
             aria-label="View on GitHub"
             target="_blank"
             rel="noopener noreferrer">
            🐙
          </a>
          <a href="https://dev.to/andreagriffiths11" 
             className={styles.socialLink} 
             aria-label="Follow on DEV"
             target="_blank"
             rel="noopener noreferrer">
            👩🏽‍💻
          </a>
        </div>
        
        <p className={styles.credits}>
          Made with ❤️ and 🔥<br />
          <span className={styles.creditDetail}>Using my bestie GitHub Copilot, Next.js, TypeScript, and mucho amor</span>
        </p>
        
        <p className={styles.copyright}>
          © {new Date().getFullYear()} Andrea Griffiths | WeCoded Challenge Submission
        </p>
      </div>
    </footer>
  );
};