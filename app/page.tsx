'use client';

import { useState } from 'react';
import StoryCard from '../components/StoryCard';
import { MiniGame } from '../components/MiniGame';
import { GameFooter } from '../components/GameFooter';
import { HowToPlay } from '../components/HowToPlay';
import { GameHeader } from '../components/GameHeader';
import useFetchStories from '../hooks/useFetchStories';
import styles from './page.module.css';

export default function Page() {
  const { stories, isLoading, error } = useFetchStories();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showMiniGame, setShowMiniGame] = useState(false);

  const nextStory = () => {
    if (stories.length > 0) {
      setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
    }
  };

  const prevStory = () => {
    if (stories.length > 0) {
      setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
    }
  };

  const toggleMiniGame = () => {
    setShowMiniGame(prev => !prev);
  };

  return (
    <div className={styles.main}>
      <GameHeader 
        title="WeCoded Game"
        score={currentStoryIndex * 100}
        showMiniGame={showMiniGame}
        onToggleMiniGame={toggleMiniGame}
      />

      <main className={styles.content}>
        <HowToPlay />

        {showMiniGame && (
          <section className={styles.section}>
            <MiniGame />
          </section>
        )}

        <section id="featured-story" className={styles.featuredStory}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>Loading stories...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
            </div>
          ) : (
            <StoryCard
              story={stories[currentStoryIndex]}
              currentIndex={currentStoryIndex}
              totalStories={stories.length}
              onPrevious={prevStory}
              onNext={nextStory}
            />
          )}
        </section>
      </main>

      <GameFooter />
    </div>
  );
}
