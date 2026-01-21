---
title: Add story reading progress indicator and resume feature
labels: enhancement, feature, user-experience
---

## Description

Implement a system to track which stories users have read and allow resuming where they left off, improving user experience and encouraging continued engagement.

## Background

Currently, progress resets on page reload and users can't track what they've already read. As the story collection grows, users need a way to track their reading history and continue from where they stopped. This feature would significantly improve UX and encourage users to read more stories.

## Requirements

### Reading Progress Tracking

1. **Mark Stories as Read**
   - Automatically mark story as "read" when viewed
   - Threshold: viewed for at least 5 seconds
   - Store read story IDs in localStorage

2. **Visual Indicators**
   - Badge/checkmark on read stories
   - Progress ring showing completion %
   - "New" badge for unread stories
   - Distinct styling for read vs unread

3. **Resume Functionality**
   - On page load, jump to first unread story
   - "Continue Reading" button
   - Skip already-read stories option

4. **Reading Statistics**
   - Total stories read
   - Reading streak (consecutive days)
   - Time spent reading
   - Completion percentage

### Reading History

1. **History View**
   - List of all read stories
   - Grouped by date (Today, Yesterday, This Week, etc.)
   - Re-read stories from history
   - Clear history option

2. **Filters**
   - Show only unread stories
   - Show only read stories
   - Show all stories

## Technical Implementation

### Data Structure

```typescript
interface ReadingProgress {
  storyId: number;
  readAt: string;
  readCount: number; // How many times viewed
  timeSpent: number; // Seconds spent viewing
}

interface ReadingStats {
  totalRead: number;
  uniqueAuthors: Set<string>;
  lastReadDate: string;
  streakDays: number;
  totalTimeSpent: number;
}

interface StorageData {
  progress: Record<number, ReadingProgress>;
  currentStoryIndex: number;
  stats: ReadingStats;
  version: string;
}
```

### Reading Progress Hook

Create `hooks/useReadingProgress.ts`:
```typescript
const STORAGE_KEY = 'wecoded_reading_progress_v1';
const READ_THRESHOLD = 5000; // 5 seconds

export function useReadingProgress() {
  const [readStories, setReadStories] = useState<Set<number>>(new Set());
  const [currentViewStart, setCurrentViewStart] = useState<number | null>(null);
  const [stats, setStats] = useState<ReadingStats>({
    totalRead: 0,
    uniqueAuthors: new Set(),
    lastReadDate: '',
    streakDays: 0,
    totalTimeSpent: 0
  });
  
  // Load progress on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data: StorageData = JSON.parse(saved);
      setReadStories(new Set(Object.keys(data.progress).map(Number)));
      setStats(data.stats);
    }
  }, []);
  
  // Mark story as viewed (start timer)
  const startViewing = (storyId: number) => {
    setCurrentViewStart(Date.now());
  };
  
  // Mark story as read (if threshold met)
  const stopViewing = (storyId: number, story: DevArticle) => {
    if (!currentViewStart) return;
    
    const timeSpent = Date.now() - currentViewStart;
    
    if (timeSpent >= READ_THRESHOLD) {
      markAsRead(storyId, story, timeSpent);
    }
    
    setCurrentViewStart(null);
  };
  
  const markAsRead = (storyId: number, story: DevArticle, timeSpent: number) => {
    // Get existing data
    const saved = localStorage.getItem(STORAGE_KEY);
    const data: StorageData = saved ? JSON.parse(saved) : {
      progress: {},
      currentStoryIndex: 0,
      stats: { ...stats },
      version: '1'
    };
    
    // Update or create progress entry
    const existing = data.progress[storyId];
    data.progress[storyId] = {
      storyId,
      readAt: new Date().toISOString(),
      readCount: (existing?.readCount || 0) + 1,
      timeSpent: (existing?.timeSpent || 0) + timeSpent
    };
    
    // Update stats
    const newStats = { ...data.stats };
    if (!existing) {
      newStats.totalRead++;
      newStats.uniqueAuthors.add(story.user.name);
    }
    newStats.totalTimeSpent += timeSpent;
    newStats.lastReadDate = new Date().toISOString();
    newStats.streakDays = calculateStreak(data.progress);
    
    data.stats = newStats;
    
    // Save
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Update state
    setReadStories(new Set([...readStories, storyId]));
    setStats(newStats);
  };
  
  const calculateStreak = (progress: Record<number, ReadingProgress>): number => {
    const dates = Object.values(progress)
      .map(p => new Date(p.readAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort()
      .reverse();
    
    let streak = 0;
    const today = new Date().toDateString();
    
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      
      if (dates[i] === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const isRead = (storyId: number) => readStories.has(storyId);
  
  const getNextUnread = (stories: DevArticle[], currentIndex: number): number => {
    for (let i = 0; i < stories.length; i++) {
      const nextIndex = (currentIndex + i) % stories.length;
      if (!readStories.has(stories[nextIndex].id)) {
        return nextIndex;
      }
    }
    return currentIndex; // All read, stay at current
  };
  
  const clearProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setReadStories(new Set());
    setStats({
      totalRead: 0,
      uniqueAuthors: new Set(),
      lastReadDate: '',
      streakDays: 0,
      totalTimeSpent: 0
    });
  };
  
  return {
    readStories,
    stats,
    startViewing,
    stopViewing,
    isRead,
    getNextUnread,
    clearProgress
  };
}
```

### Integration in Page

Update `app/page.tsx`:
```tsx
const { 
  readStories, 
  stats, 
  startViewing, 
  stopViewing, 
  isRead, 
  getNextUnread 
} = useReadingProgress();

useEffect(() => {
  if (stories.length > 0) {
    startViewing(stories[currentStoryIndex].id);
    
    return () => {
      stopViewing(stories[currentStoryIndex].id, stories[currentStoryIndex]);
    };
  }
}, [currentStoryIndex, stories]);

// Resume on load
useEffect(() => {
  if (stories.length > 0) {
    const nextUnread = getNextUnread(stories, 0);
    setCurrentStoryIndex(nextUnread);
  }
}, [stories]);
```

### Visual Indicators

Update `StoryCard.tsx`:
```tsx
<div className={`${styles.card} ${isRead(story.id) ? styles.read : styles.unread}`}>
  <div className={styles.header}>
    <h3 className={styles.title}>
      {story.title}
      {isRead(story.id) && <span className={styles.readBadge}>✓ Read</span>}
      {!isRead(story.id) && <span className={styles.newBadge}>New</span>}
    </h3>
  </div>
  {/* ... rest of card */}
</div>
```

### Reading Stats Component

Create `components/ReadingStats.tsx`:
```tsx
export const ReadingStats: React.FC<{ stats: ReadingStats }> = ({ stats }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };
  
  return (
    <div className={styles.statsContainer}>
      <div className={styles.statCard}>
        <div className={styles.statValue}>{stats.totalRead}</div>
        <div className={styles.statLabel}>Stories Read</div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statValue}>{stats.uniqueAuthors.size}</div>
        <div className={styles.statLabel}>Authors Discovered</div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statValue}>{stats.streakDays}</div>
        <div className={styles.statLabel}>Day Streak 🔥</div>
      </div>
      
      <div className={styles.statCard}>
        <div className={styles.statValue}>{formatTime(stats.totalTimeSpent / 1000)}</div>
        <div className={styles.statLabel}>Time Reading</div>
      </div>
    </div>
  );
};
```

### Continue Reading Button

```tsx
<div className={styles.resumeSection}>
  {hasUnreadStories && (
    <button 
      onClick={() => {
        const nextUnread = getNextUnread(stories, currentStoryIndex);
        setCurrentStoryIndex(nextUnread);
      }}
      className={styles.continueButton}
    >
      📖 Continue Reading ({unreadCount} stories left)
    </button>
  )}
</div>
```

### Filter Controls

```tsx
const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');

const filteredStories = useMemo(() => {
  if (filter === 'all') return stories;
  if (filter === 'read') return stories.filter(s => isRead(s.id));
  if (filter === 'unread') return stories.filter(s => !isRead(s.id));
  return stories;
}, [stories, filter, readStories]);

<div className={styles.filters}>
  <button 
    onClick={() => setFilter('all')}
    className={filter === 'all' ? styles.active : ''}
  >
    All ({stories.length})
  </button>
  <button 
    onClick={() => setFilter('unread')}
    className={filter === 'unread' ? styles.active : ''}
  >
    Unread ({stories.filter(s => !isRead(s.id)).length})
  </button>
  <button 
    onClick={() => setFilter('read')}
    className={filter === 'read' ? styles.active : ''}
  >
    Read ({readStories.size})
  </button>
</div>
```

## Progress Indicator UI

```css
.progressRing {
  position: relative;
  width: 60px;
  height: 60px;
}

.progressRing svg {
  transform: rotate(-90deg);
}

.progressRing .background {
  fill: none;
  stroke: var(--border-color);
  stroke-width: 4;
}

.progressRing .progress {
  fill: none;
  stroke: var(--accent-color);
  stroke-width: 4;
  stroke-dasharray: 188.5; /* 2 * PI * 30 */
  stroke-dashoffset: calc(188.5 * (1 - var(--progress)));
  transition: stroke-dashoffset 0.3s;
}

.progressText {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
}
```

## Acceptance Criteria

- [ ] Stories marked as read after 5 seconds
- [ ] Read status persists in localStorage
- [ ] Visual badge shows read status
- [ ] "Continue Reading" button jumps to first unread
- [ ] Reading stats component displays metrics
- [ ] Streak calculation works correctly
- [ ] Filter by read/unread works
- [ ] Progress ring shows completion %
- [ ] Clear history functionality
- [ ] Works across browser sessions
- [ ] Mobile-responsive design
- [ ] Performance: handles 100+ stories

## Testing Checklist

- [ ] Story marked read after 5 seconds
- [ ] Quick navigation doesn't mark as read
- [ ] Progress persists after reload
- [ ] Continue button finds next unread
- [ ] Stats update correctly
- [ ] Streak calculates correctly
- [ ] Filters work correctly
- [ ] Read badge displays on read stories
- [ ] New badge displays on unread stories
- [ ] Clear history works
- [ ] No performance issues with many stories

## Related Files

- `hooks/useReadingProgress.ts` - Progress tracking hook (to create)
- `components/ReadingStats.tsx` - Stats display (to create)
- `components/StoryCard.tsx` - Add read indicators
- `app/page.tsx` - Integrate progress tracking
- `types/index.ts` - Add progress types

## Future Enhancements

- Sync progress across devices (requires backend)
- Export reading history
- Reading goals (e.g., 10 stories this week)
- Estimated time to complete all stories
- Reading heatmap (calendar view)
- Recommended stories based on history
- Share reading stats
