'use client';

import React from 'react';

export const HowToPlay: React.FC = () => {
  return (
    <section id="about" className="section">
      <div className="section-container info">
        <h2 className="section-title">How to Play</h2>
        
        <div className="instructions-grid">
          <div className="instruction-card">
            <h3 className="instruction-title">📖 Read Stories</h3>
            <ul className="instruction-list">
              <li>Browse through inspiring tech stories from diverse voices</li>
              <li>Click on story titles or author info to read full articles</li>
              <li>Use Previous/Next buttons to navigate between stories</li>
            </ul>
          </div>

          <div className="instruction-card">
            <h3 className="instruction-title">🎮 Mini-Game</h3>
            <ul className="instruction-list">
              <li>Click "Open MiniGame" to start playing</li>
              <li>Use Left/Right arrow keys to move</li>
              <li>Avoid falling obstacles to score points</li>
              <li>Challenge yourself to beat your high score!</li>
            </ul>
          </div>

          <div className="instruction-card">
            <h3 className="instruction-title">🏆 Track Progress</h3>
            <ul className="instruction-list">
              <li>Each story read earns you XP points</li>
              <li>Watch your level increase as you read more</li>
              <li>Share your achievements on social media</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}