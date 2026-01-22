---
title: Implement achievement/badge system
labels: enhancement, feature, gamification
---

## Description

Create an achievement system that awards badges for milestones, increasing user engagement and gamification.

## Background

Currently, there's a basic score/level system, but no persistent achievements. A badge system would reward user engagement, encourage exploration of all content, and add meaningful gamification beyond simple scores.

## Requirements

### Achievement Types

1. **Reading Milestones**
   - 📚 "First Story" - Read your first story
   - 📖 "Story Enthusiast" - Read 5 stories
   - 🎓 "Knowledge Seeker" - Read 10 stories
   - 🏆 "Story Master" - Read 20 stories
   - 💯 "Completionist" - Read all available stories

2. **Diversity Achievements**
   - 🌍 "Global Perspective" - Read stories from 3 different authors
   - 🌟 "Diversity Champion" - Read stories from 5 different authors
   - 🎯 "Tag Explorer" - Read stories with 5 different tags

3. **Engagement Achievements**
   - 🎮 "Gamer" - Play the mini-game once
   - 🏅 "Mini-Game Master" - Score 100+ in mini-game
   - 🔖 "Collector" - Bookmark 5 stories (if bookmarks implemented)
   - 🔗 "Sharer" - Share a story on social media (if sharing implemented)

4. **Time-Based Achievements**
   - ⏰ "Early Bird" - Visit during morning hours (6-10am)
   - 🌙 "Night Owl" - Visit during night hours (10pm-2am)
   - 📅 "Regular" - Visit 3 days in a row
   - 🔥 "Streak" - Visit 7 days in a row

5. **Special Achievements**
   - 🎉 "Launch Member" - Visited during launch week
   - 💝 "WeCoded Advocate" - Complete all reading achievements

### Achievement Structure

```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'reading' | 'diversity' | 'engagement' | 'time' | 'special';
  requirement: {
    type: 'count' | 'unique' | 'score' | 'action' | 'time';
    target: number | string;
  };
  reward?: {
    xp?: number;
    title?: string;
  };
}

interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  progress?: number;
  isNew?: boolean;
}
```

## Technical Implementation

### Achievement Definitions

`data/achievements.ts`:
```typescript
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-story',
    title: 'First Story',
    description: 'Read your first story',
    icon: '📚',
    category: 'reading',
    requirement: { type: 'count', target: 1 },
    reward: { xp: 100, title: 'Story Reader' }
  },
  {
    id: 'story-enthusiast',
    title: 'Story Enthusiast',
    description: 'Read 5 different stories',
    icon: '📖',
    category: 'reading',
    requirement: { type: 'count', target: 5 },
    reward: { xp: 250 }
  },
  // ... more achievements
];
```

### Achievement Hook

`hooks/useAchievements.ts`:
```typescript
export function useAchievements() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<UserAchievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  
  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('wecoded_achievements');
    if (saved) {
      setUnlockedAchievements(JSON.parse(saved));
    }
  }, []);
  
  const checkAndUnlockAchievements = (stats: UserStats) => {
    const newlyUnlocked: Achievement[] = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      const isUnlocked = unlockedAchievements.some(
        ua => ua.achievementId === achievement.id
      );
      
      if (!isUnlocked && meetsRequirement(achievement, stats)) {
        const userAchievement: UserAchievement = {
          achievementId: achievement.id,
          unlockedAt: new Date().toISOString(),
          isNew: true
        };
        
        setUnlockedAchievements(prev => {
          const updated = [...prev, userAchievement];
          localStorage.setItem('wecoded_achievements', JSON.stringify(updated));
          return updated;
        });
        
        newlyUnlocked.push(achievement);
      }
    });
    
    if (newlyUnlocked.length > 0) {
      setNewAchievements(newlyUnlocked);
    }
  };
  
  const meetsRequirement = (achievement: Achievement, stats: UserStats): boolean => {
    switch (achievement.requirement.type) {
      case 'count':
        return stats.storiesRead >= achievement.requirement.target;
      case 'unique':
        return stats.uniqueAuthors >= achievement.requirement.target;
      // ... other types
      default:
        return false;
    }
  };
  
  return {
    unlockedAchievements,
    newAchievements,
    checkAndUnlockAchievements,
    dismissNewAchievements: () => setNewAchievements([]),
    progress: calculateProgress(unlockedAchievements)
  };
}
```

### Achievement Display

#### Achievement Notification

`components/AchievementNotification.tsx`:
```tsx
export const AchievementNotification: React.FC<{ achievement: Achievement }> = ({ 
  achievement 
}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className={styles.notification}
    >
      <div className={styles.icon}>{achievement.icon}</div>
      <div className={styles.content}>
        <div className={styles.badge}>🎉 Achievement Unlocked!</div>
        <div className={styles.title}>{achievement.title}</div>
        <div className={styles.description}>{achievement.description}</div>
        {achievement.reward && (
          <div className={styles.reward}>+{achievement.reward.xp} XP</div>
        )}
      </div>
    </motion.div>
  );
};
```

#### Achievements Page/Modal

`components/AchievementsModal.tsx`:
```tsx
export const AchievementsModal: React.FC = () => {
  const { unlockedAchievements } = useAchievements();
  
  return (
    <div className={styles.modal}>
      <h2>Your Achievements</h2>
      
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
        <div className={styles.progressText}>
          {unlockedAchievements.length} / {ACHIEVEMENTS.length}
        </div>
      </div>
      
      <div className={styles.grid}>
        {ACHIEVEMENTS.map(achievement => {
          const unlocked = unlockedAchievements.find(
            ua => ua.achievementId === achievement.id
          );
          
          return (
            <div 
              key={achievement.id}
              className={`${styles.card} ${unlocked ? styles.unlocked : styles.locked}`}
            >
              <div className={styles.icon}>
                {unlocked ? achievement.icon : '🔒'}
              </div>
              <div className={styles.title}>{achievement.title}</div>
              <div className={styles.description}>
                {achievement.description}
              </div>
              {unlocked && (
                <div className={styles.unlockedDate}>
                  Unlocked: {new Date(unlocked.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

## UI Components

1. **Achievement Notification**
   - Toast/banner at top of screen
   - Shows for 5 seconds
   - Celebration animation
   - Sound effect (optional, respecting user preferences)

2. **Achievements Button**
   - In header or navigation
   - Shows badge count
   - Opens achievements modal

3. **Achievements Modal**
   - Grid of all achievements
   - Locked/unlocked states
   - Progress bar
   - Filter by category
   - Share achievements

4. **Profile Summary**
   - Recently unlocked badges
   - Total achievements
   - XP earned from achievements

## Animation Effects

```css
@keyframes celebrate {
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.1) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
}

.achievement-unlocked {
  animation: celebrate 0.5s ease-in-out;
}

/* Confetti effect */
@keyframes confetti {
  0% { transform: translateY(0) rotateZ(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotateZ(360deg); opacity: 0; }
}
```

## Acceptance Criteria

- [ ] Achievement system implemented with data structure
- [ ] 15+ achievements defined across 5 categories
- [ ] Progress tracked in localStorage
- [ ] Achievement notifications show when unlocked
- [ ] Achievements modal shows all achievements
- [ ] Locked/unlocked states clearly differentiated
- [ ] Progress bar shows completion percentage
- [ ] Celebration animation plays on unlock
- [ ] Respects `prefers-reduced-motion`
- [ ] XP rewards added to total score
- [ ] Share achievements on social media (optional)
- [ ] Works across browser sessions
- [ ] Mobile-responsive design

## Testing Checklist

- [ ] First story achievement unlocks
- [ ] Multiple story achievement unlocks at correct count
- [ ] Mini-game achievement unlocks
- [ ] Time-based achievements work
- [ ] Notifications display correctly
- [ ] Achievements persist after reload
- [ ] Modal shows correct locked/unlocked states
- [ ] Progress bar updates correctly
- [ ] No duplicate unlocks
- [ ] Handles edge cases gracefully

## Related Files

- `data/achievements.ts` - Achievement definitions (to create)
- `hooks/useAchievements.ts` - Achievement logic (to create)
- `components/AchievementNotification.tsx` - Notification UI (to create)
- `components/AchievementsModal.tsx` - Achievements view (to create)
- `app/page.tsx` - Integrate achievement checking
- `types/index.ts` - Add achievement types

## Resources

- [Gamification Best Practices](https://www.nngroup.com/articles/gamification/)
- [Achievement Design Patterns](https://www.gamedeveloper.com/design/designing-achievements)

## Future Enhancements

- Rare/epic achievement tiers
- Hidden achievements
- Achievement leaderboard
- Share on social media
- Achievement statistics
- Custom achievement icons
- Seasonal achievements
