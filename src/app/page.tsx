'use client';

import { useState } from 'react';
import StoryCard from '../components/StoryCard';
import { MiniGame } from '../components/MiniGame';
import { GameFooter } from '../components/GameFooter';
import useFetchStories from '../hooks/useFetchStories';

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

  return (
    <div className="game-world">
      <header className="game-header">
        <div className="background-effects">
          <div className="grid-pattern"></div>
        </div>
        <div className="container">
          <div className="header-content">
            <h1 className="game-title">Celebrate in Code</h1>
            <p className="game-subtitle">Welcome to WeCoded - Level Up Diversity in Tech</p>
            <div className="button-group">
              <a href="#about" className="game-button primary">Start Adventure</a>
              <a href="#featured-story" className="game-button secondary">Game Info</a>
              <button 
                onClick={() => setShowMiniGame(!showMiniGame)} 
                className="game-button tertiary"
              >
                {showMiniGame ? 'Close MiniGame' : 'Open MiniGame'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section id="featured-story" className="section">
        <div className="section-container primary">
          <h2 className="section-title">Featured Stories</h2>
          {isLoading ? (
            <div className="loading-container">
              <p>Loading stories...</p>
            </div>
          ) : error ? (
            <div className="error-container">
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
        </div>
      </section>

      {showMiniGame && <MiniGame />}
      <GameFooter />
    </div>
  );
}
