'use client';

import React from 'react';

export const GameFooter: React.FC = () => {
  return (
    <footer className="game-footer">
      <div className="container">
        <h2 className="footer-title">🎮 About this game 🎉</h2>
        <p className="footer-subtitle">
        Big props for being here! This is my entry for the DEV.to WeCoded Challenge 2025. It’s Next.js-powered, GitHub Copilot assisted, and runs on pure cafecito vibes—because tech’s better when we’ve got each other’s backs. 




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
          <span className="credit-detail">Using my bestie GitHub Copilot, Next.js, TypeScript, and mucho amor</span>
        </p>
        
        <p className="copyright">
          © {new Date().getFullYear()} Andrea Griffiths | WeCoded Challenge Submission
        </p>
      </div>
    </footer>
  );
};