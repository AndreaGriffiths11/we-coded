'use client';

import React, { useState } from 'react';
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
  const [showAuthorDetails, setShowAuthorDetails] = useState(false);

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
        <h3 className="story-title">{story.title}</h3>
        <span className="story-xp">+100 XP</span>
      </div>

      <div className="story-content">
        <p>{story.description}</p>
      </div>

      <div className="author-info" onClick={() => setShowAuthorDetails(!showAuthorDetails)}>
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
        {/* Add visual indicator for clicking */}
        <span className="click-hint">👆 Click to see socials</span>
      </div>

      {showAuthorDetails && (
        <div className="author-social">
          {story.user.twitter_username && (
            <a
              href={`https://twitter.com/${story.user.twitter_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link twitter"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
              </svg>
              <span>@{story.user.twitter_username}</span>
            </a>
          )}
          {story.user.github_username && (
            <a
              href={`https://github.com/${story.user.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link github"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>@{story.user.github_username}</span>
            </a>
          )}
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link dev"
          >
            <svg viewBox="0 0 448 512" width="16" height="16" fill="currentColor">
              <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z"/>
            </svg>
            <span>Read on DEV.to</span>
          </a>
        </div>
      )}

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