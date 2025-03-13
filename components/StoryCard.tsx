'use client';

import React from 'react';
import Image from 'next/image';
import type { DevArticle } from '../types';

interface StoryCardProps {
  story: DevArticle;
  currentIndex: number;
  totalStories: number;
  onPrevious: () => void;
  onNext: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, currentIndex, totalStories, onPrevious, onNext }) => {
  if (!story) {
    return (
      <div className="story-card">
        <div className="story-loading">
          <p>Loading story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="story-card">
      <div className="story-header">
        <a 
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="story-title-link"
        >
          <h3 className="story-title">{story.title}</h3>
        </a>
        <span className="story-xp">+100 XP</span>
      </div>

      <div className="story-content">
        <p>{story.description}</p>
      </div>

      <a 
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="author-info"
      >
        <div className="author-avatar">
          <Image 
            src={story.user.profile_image_90} 
            alt={`${story.user.name}'s profile picture`}
            width={48}
            height={48}
            style={{
              objectFit: 'cover',
              borderRadius: '0.375rem'
            }}
          />
        </div>
        <div className="author-details">
          <span className="author-name">{story.user.name}</span>
          <span className="author-username">@{story.user.username}</span>
        </div>
      </a>

      <div className="story-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${((currentIndex + 1) / totalStories) * 100}%` }}
        />
      </div>

      <div className="story-footer">
        <div className="story-navigation">
          <button onClick={onPrevious} className="nav-button">← Previous</button>
          <button onClick={onNext} className="nav-button">Next →</button>
        </div>
        <span className="story-power">🏆 Level {currentIndex + 1}/{totalStories}</span>
      </div>
    </div>
  );
};

export default StoryCard;
