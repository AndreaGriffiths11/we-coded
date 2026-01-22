---
title: Add mini-game difficulty levels and variations
labels: enhancement, feature, gamification
---

## Description

Enhance the mini-game with difficulty settings (Easy, Medium, Hard) and multiple game variations to increase replay value and engagement.

## Background

Currently, the mini-game has fixed difficulty and a single gameplay mode (dodge obstacles). Adding difficulty levels and game variations would make it more engaging, appeal to different skill levels, and increase the time users spend on the platform.

## Requirements

### Difficulty Levels

1. **Easy Mode**
   - Slower obstacle speed (50% of current)
   - Lower spawn rate (5% chance vs 10%)
   - Larger player hitbox tolerance
   - Good for beginners

2. **Medium Mode** (Current)
   - Current speed and spawn rate
   - Default selection
   - Balanced gameplay

3. **Hard Mode**
   - Faster obstacle speed (150% of current)
   - Higher spawn rate (15% chance)
   - Stricter collision detection
   - For experienced players

4. **Expert Mode** (Unlock after achieving score milestones)
   - Very fast obstacles (200% speed)
   - Very high spawn rate (20% chance)
   - Multiple obstacle types
   - Unlocked after scoring 200+ on Hard

### Game Variations

1. **Classic Mode** (Current)
   - Dodge falling obstacles
   - Score increases over time
   - Single player type

2. **Collector Mode**
   - Catch falling good items (stars ⭐)
   - Avoid bad items (×)
   - Score based on items collected
   - Time limit: 60 seconds

3. **Time Attack Mode**
   - Survive as long as possible
   - Obstacles speed increases over time
   - Leaderboard for longest survival

4. **Challenge Mode**
   - Complete specific objectives
   - "Collect 10 stars without getting hit"
   - "Survive 30 seconds on Hard"
   - "Reach score of 500"

### Progression System

1. **High Scores**
   - Track best score per difficulty
   - Track best score per game mode
   - Persist in localStorage
   - Display in game UI

2. **Unlocks**
   - Unlock Hard mode after Easy score > 100
   - Unlock Expert mode after Hard score > 200
   - Unlock game variations after playing Classic 5 times

3. **Achievements Integration**
   - Unlock achievements for high scores
   - Unlock achievements for trying all modes
   - Unlock achievements for difficulty completion

## Technical Implementation

### Game Configuration

Create `types/gameTypes.ts`:
```typescript
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type GameMode = 'classic' | 'collector' | 'timeAttack' | 'challenge';

export interface GameConfig {
  difficulty: Difficulty;
  mode: GameMode;
  obstacleSpeed: number;
  spawnRate: number;
  collisionTolerance: number;
}

export interface GameScore {
  difficulty: Difficulty;
  mode: GameMode;
  score: number;
  timestamp: string;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, Partial<GameConfig>> = {
  easy: {
    obstacleSpeed: 2.5,
    spawnRate: 0.05,
    collisionTolerance: 3,
  },
  medium: {
    obstacleSpeed: 5,
    spawnRate: 0.1,
    collisionTolerance: 2,
  },
  hard: {
    obstacleSpeed: 7.5,
    spawnRate: 0.15,
    collisionTolerance: 1.5,
  },
  expert: {
    obstacleSpeed: 10,
    spawnRate: 0.2,
    collisionTolerance: 1,
  },
};
```

### Enhanced Mini-Game Component

Update `components/MiniGame.tsx`:
```tsx
export const MiniGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [highScores, setHighScores] = useState<Record<string, GameScore>>({});
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<Difficulty[]>(['easy', 'medium']);
  
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  useEffect(() => {
    // Load high scores and unlocks from localStorage
    const saved = localStorage.getItem('minigame_data');
    if (saved) {
      const data = JSON.parse(saved);
      setHighScores(data.highScores || {});
      setUnlockedDifficulties(data.unlockedDifficulties || ['easy', 'medium']);
    }
  }, []);
  
  const checkUnlocks = (score: number) => {
    const key = `${difficulty}-${gameMode}`;
    
    // Check if this unlocks new difficulties
    if (difficulty === 'easy' && score > 100 && !unlockedDifficulties.includes('hard')) {
      setUnlockedDifficulties(prev => [...prev, 'hard']);
      showNotification('Hard mode unlocked!');
    }
    
    if (difficulty === 'hard' && score > 200 && !unlockedDifficulties.includes('expert')) {
      setUnlockedDifficulties(prev => [...prev, 'expert']);
      showNotification('Expert mode unlocked!');
    }
    
    // Save high score
    const currentHigh = highScores[key]?.score || 0;
    if (score > currentHigh) {
      const newScore: GameScore = {
        difficulty,
        mode: gameMode,
        score,
        timestamp: new Date().toISOString(),
      };
      
      const updated = { ...highScores, [key]: newScore };
      setHighScores(updated);
      
      localStorage.setItem('minigame_data', JSON.stringify({
        highScores: updated,
        unlockedDifficulties,
      }));
      
      showNotification('New high score!');
    }
  };
  
  // ... rest of game logic with config-based parameters
};
```

### Game Mode Selection UI

```tsx
<div className={styles.modeSelection}>
  <h3>Select Difficulty</h3>
  <div className={styles.difficultyButtons}>
    {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map(diff => (
      <button
        key={diff}
        onClick={() => setDifficulty(diff)}
        disabled={!unlockedDifficulties.includes(diff)}
        className={`${styles.diffButton} ${difficulty === diff ? styles.active : ''}`}
      >
        {diff.charAt(0).toUpperCase() + diff.slice(1)}
        {!unlockedDifficulties.includes(diff) && ' 🔒'}
      </button>
    ))}
  </div>
  
  <h3>Select Game Mode</h3>
  <div className={styles.modeButtons}>
    {(['classic', 'collector', 'timeAttack'] as GameMode[]).map(mode => (
      <button
        key={mode}
        onClick={() => setGameMode(mode)}
        className={`${styles.modeButton} ${gameMode === mode ? styles.active : ''}`}
      >
        {getModeDisplayName(mode)}
      </button>
    ))}
  </div>
  
  <div className={styles.highScore}>
    Best Score: {highScores[`${difficulty}-${gameMode}`]?.score || 0}
  </div>
</div>
```

### Collector Mode Implementation

```tsx
interface CollectibleItem {
  id: number;
  left: number;
  top: number;
  type: 'good' | 'bad';
}

// In game loop
if (gameMode === 'collector') {
  // Spawn good and bad items
  if (Math.random() < config.spawnRate) {
    const newItem: CollectibleItem = {
      id: Date.now(),
      left: Math.random() * 90,
      top: -20,
      type: Math.random() > 0.3 ? 'good' : 'bad'
    };
    setCollectibles(prev => [...prev, newItem]);
  }
  
  // Check collisions
  collectibles.forEach(item => {
    if (checkCollision(playerPosition, item)) {
      if (item.type === 'good') {
        setScore(prev => prev + 10);
        playSound('collect');
      } else {
        setScore(prev => Math.max(0, prev - 5));
        playSound('hit');
      }
      // Remove collected item
      setCollectibles(prev => prev.filter(c => c.id !== item.id));
    }
  });
}
```

### Leaderboard Component

Create `components/GameLeaderboard.tsx`:
```tsx
export const GameLeaderboard: React.FC = () => {
  const [scores, setScores] = useState<GameScore[]>([]);
  
  useEffect(() => {
    const data = localStorage.getItem('minigame_data');
    if (data) {
      const { highScores } = JSON.parse(data);
      const scoreArray = Object.values(highScores) as GameScore[];
      scoreArray.sort((a, b) => b.score - a.score);
      setScores(scoreArray.slice(0, 10));
    }
  }, []);
  
  return (
    <div className={styles.leaderboard}>
      <h3>Your Top Scores</h3>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Mode</th>
            <th>Difficulty</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={`${score.difficulty}-${score.mode}`}>
              <td>{index + 1}</td>
              <td>{score.mode}</td>
              <td>{score.difficulty}</td>
              <td>{score.score}</td>
              <td>{new Date(score.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## UI/UX Enhancements

1. **Visual Indicators**
   - Different colors for each difficulty
   - Icons for each game mode
   - Animated unlock notifications

2. **Sound Effects** (optional, with mute option)
   - Collection sound
   - Hit sound
   - Level up sound
   - Unlock sound

3. **Particles/Effects**
   - Particle burst on item collection
   - Speed lines in hard/expert mode
   - Celebration effect on high score

## Acceptance Criteria

- [ ] Four difficulty levels implemented
- [ ] Three game modes implemented
- [ ] Difficulty-based configurations working
- [ ] High scores tracked per difficulty/mode
- [ ] Hard mode unlocks after easy score > 100
- [ ] Expert mode unlocks after hard score > 200
- [ ] Collector mode with good/bad items
- [ ] Time attack mode implemented
- [ ] Leaderboard shows top 10 scores
- [ ] Visual feedback for unlocks
- [ ] Persists in localStorage
- [ ] Responsive on mobile
- [ ] Accessible (keyboard controls)

## Testing Checklist

- [ ] Easy mode is easier than medium
- [ ] Hard mode is harder than medium
- [ ] Expert mode is very challenging
- [ ] Unlocks work correctly
- [ ] High scores save correctly
- [ ] Collector mode items spawn correctly
- [ ] Collision detection works for all modes
- [ ] Leaderboard displays correctly
- [ ] Mobile touch controls work
- [ ] Locked modes can't be selected

## Related Files

- `components/MiniGame.tsx` - Update with new features
- `components/GameLeaderboard.tsx` - New leaderboard component (to create)
- `types/gameTypes.ts` - Game type definitions (to create)
- `components/MiniGame.module.css` - Updated styles
- `utils/gameUtils.ts` - Game utility functions (to create)

## Future Enhancements

- Multiplayer mode
- Daily challenges
- Power-ups
- Global leaderboard (requires backend)
- Custom skins/themes
- Tutorial mode
- Mobile swipe controls
- Achievements for game-specific milestones
