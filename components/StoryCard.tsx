'use client';

import React from 'react';
import Image from 'next/image';
import type { DevArticle } from '../types';
import styles from './StoryCard.module.css';

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
      <div className={styles.card}>
        <div className={styles.content}>
          <p>Loading story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <a 
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.titleLink}
        >
          <h3 className={styles.title}>{story.title}</h3>
        </a>
        <span className={styles.xp}>+100 XP</span>
      </div>

      <div className={styles.content}>
        <p>{story.description}</p>
      </div>

      <a 
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.authorInfo}
      >
        <div className={styles.authorAvatar}>
          <Image 
            src={story.user.profile_image_90} 
            alt={`${story.user.name}'s profile picture`}
            width={48}
            height={48}
            style={{
              objectFit: 'cover',
              borderRadius: 'var(--border-radius-sm)'
            }}
          />
        </div>
        <div className={styles.authorDetails}>
          <span className={styles.authorName}>{story.user.name}</span>
          <span className={styles.authorUsername}>@{story.user.username}</span>
        </div>
      </a>

      <div className={styles.progress}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${((currentIndex + 1) / totalStories) * 100}%` }}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.navigation}>
          <button onClick={onPrevious} className={styles.navButton}>← Previous</button>
          <button onClick={onNext} className={styles.navButton}>Next →</button>
        </div>
        <span className={styles.power}>🏆 Level {currentIndex + 1}/{totalStories}</span>
      </div>
    </div>
  );
};

export default StoryCard;
