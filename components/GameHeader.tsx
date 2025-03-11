'use client';

import React from 'react';

interface GameHeaderProps {
  title?: string;
  score?: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  title = 'WeCoded Game',
  score = 0 
}) => {
  return (
    <header className="game-header">
      <div className="container">
        <div className="header-content">
          <h1 className="game-title">{title}</h1>
          <div className="game-score">Score: {score}</div>
        </div>
      </div>
    </header>
  );
};