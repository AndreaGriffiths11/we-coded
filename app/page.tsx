'use client';

import React, { useState, useEffect } from 'react';
import StoryCard from '../components/StoryCard';
import { MiniGame } from '../components/MiniGame';
import { GameFooter } from '../components/GameFooter';
import type { DevArticle } from '../types';

export default function Page() {
  const [stories, setStories] = useState<DevArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showMiniGame, setShowMiniGame] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories');
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const nextStory = () => {
    setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
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
                Secret Level
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="game-main">
        <section id="about" className="section">
          <div className="section-container secondary">
            <h2 className="section-title">LEVEL 1: About the Adventure</h2>
            <div className="about-content">
              <p className="intro-text">
                Welcome to CodeDiversity, an interactive celebration of diverse voices in technology! 
                Explore inspiring stories from developers worldwide who are making tech more inclusive 
                and accessible for everyone.
              </p>
              
              <div className="game-features">
                <h3>How to Play:</h3>
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-icon">🎮</span>
                    <span className="feature-text">Follow the adventure path through all levels</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📖</span>
                    <span className="feature-text">Discover diverse tech journeys in Level 2</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">⭐</span>
                    <span className="feature-text">Earn XP points for each story you explore</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🌟</span>
                    <span className="feature-text">Test your skills in the Secret Level challenge</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🤝</span>
                    <span className="feature-text">Connect with featured developers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="featured-story" className="section">
          <div className="section-container primary">
            <h2 className="section-title">Featured Stories</h2>
            {isLoading ? (
              <div className="loading-container">
                <p>Loading stories...</p>
              </div>
            ) : stories.length > 0 ? (
              <StoryCard
                story={stories[currentStoryIndex]}
                currentIndex={currentStoryIndex}
                totalStories={stories.length}
                onPrevious={prevStory}
                onNext={nextStory}
              />
            ) : (
              <div className="error-container">
                <p>No stories found. Please try again later.</p>
              </div>
            )}
          </div>
        </section>

        {showMiniGame && (
          <section className="section">
            <div className="section-container warning">
              <h2 className="section-title">Bug Dodge Challenge</h2>
              <MiniGame />
            </div>
          </section>
        )}
      </main>

      <GameFooter />
    </div>
  );
}
