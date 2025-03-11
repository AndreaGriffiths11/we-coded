'use client';

import React from 'react';

export const GameFooter: React.FC = () => {
  return (
    <footer className="game-footer">
      <div className="container">
        <h2 className="footer-title">🎮 Game Complete! 🎉</h2>
        <p className="footer-subtitle">
        Hey, you rock for playing!  I am Andrea, and I whipped up this game for the DEV.to WeCoded Challenge 2025. It’s built with Next.js, a ton of Next.js magic, and fueled by endless cafecito —because if we don’t support each other in tech, who will? Hope you had a blast!


        </p>
        
        <div className="challenge-badge">
          <span className="badge-text">Challenge Submission</span>
          <p className="badge-description">
            Gamifying the experience of reading diverse tech stories. Let&apos;s make tech more inclusive, one story at a time! 🚀
          </p>
        </div>
        
        <div className="social-links">
          <a href="https://twitter.com/intent/tweet?text=Check%20out%20this%20awesome%20game%20celebrating%20diversity%20in%20tech!%20Join%20the%20WeCoded%20challenge%20%23WeCoded%20%23DevCommunity" 
             className="social-link" 
             aria-label="Share on Twitter"
             target="_blank"
             rel="noopener noreferrer">
            🐦
          </a>
          <a href="https://github.com/alacolombiadev/wecoded-game" 
             className="social-link" 
             aria-label="View on GitHub"
             target="_blank"
             rel="noopener noreferrer">
            🐙
          </a>
          <a href="https://dev.to/andreagriffiths11" 
             className="social-link" 
             aria-label="Follow on DEV"
             target="_blank"
             rel="noopener noreferrer">
            👩🏽‍💻
          </a>
        </div>
        
        <p className="credits">
          Made with ❤️ and 🔥<br />
          <span className="credit-detail">Using Next.js, TypeScript, and mucho amor</span>
        </p>
        
        <p className="copyright">
          © {new Date().getFullYear()} Andrea Griffiths | WeCoded Challenge Submission
        </p>
      </div>
    </footer>
  );
};