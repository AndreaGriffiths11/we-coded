'use client';

import React from 'react';

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
    <div className="stats-section">
      <h2 className="stats-title">WeCoded Stats - Level 2</h2>
      <div className="stats-container">
        <div className="stats-row">
          <div className="stat-box">
            <div className="stat-value" style={{ color: '#F5D76A' }}>{stats.storiesCount}</div>
            <div className="stat-label">Stories Shared</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value" style={{ color: '#F5D76A' }}>{stats.authorsCount}</div>
            <div className="stat-label">Authors</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value" style={{ color: '#F5D76A' }}>{stats.countriesCount}</div>
            <div className="stat-label">Countries</div>
          </div>
        </div>
        
        <div className="stats-row center-stat">
          <div className="stat-box">
            <div className="stat-value" style={{ color: '#F5D76A' }}>{stats.yearsCount}</div>
            <div className="stat-label">Years Strong</div>
          </div>
        </div>
      </div>
    </div>
  );
};