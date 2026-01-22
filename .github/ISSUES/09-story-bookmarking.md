---
title: Implement story bookmarking/favorites feature
labels: enhancement, feature, user-experience
---

## Description

Add the ability for users to bookmark/favorite stories they like, allowing them to save content for later reading and increase engagement.

## Background

Currently, users can read stories but have no way to save them for later reference. A bookmarking feature would allow users to curate their own collection of favorite stories, increasing user engagement and retention.

## Requirements

### Core Functionality

1. **Bookmark Button**
   - Add bookmark icon to StoryCard component
   - Visual states: bookmarked vs. not bookmarked
   - Toggle bookmark on click
   - Icon: ⭐ (filled) for bookmarked, ☆ (outline) for not bookmarked

2. **Data Persistence**
   - Store bookmarked story IDs in localStorage
   - Key: `wecoded_bookmarks`
   - Format: `{ bookmarks: number[], timestamp: number }`

3. **Bookmarks View**
   - Add "Bookmarks" or "Favorites" button in navigation
   - Filter to show only bookmarked stories
   - Show count of bookmarked stories
   - Handle empty state: "No bookmarks yet"

4. **Visual Indicators**
   - Badge showing bookmark count
   - Visual indicator on bookmarked stories in main view
   - Confirmation animation when bookmarking

## UI Design

### Bookmark Button on StoryCard

Add to header section alongside XP badge:
```tsx
<div className={styles.header}>
  <h3 className={styles.title}>{story.title}</h3>
  <div className={styles.badges}>
    <span className={styles.xp}>+100 XP</span>
    <button
      onClick={toggleBookmark}
      className={styles.bookmarkButton}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isBookmarked ? '⭐' : '☆'}
    </button>
  </div>
</div>
```

### Navigation Enhancement

```tsx
<button onClick={toggleBookmarksView} className={styles.navButton}>
  {showBookmarks ? 'Show All' : `Bookmarks (${bookmarkCount})`}
</button>
```

## Technical Implementation

### Create Hook: `hooks/useBookmarks.ts`

```typescript
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('wecoded_bookmarks');
    if (saved) {
      const data = JSON.parse(saved);
      setBookmarks(data.bookmarks || []);
    }
  }, []);
  
  const toggleBookmark = (storyId: number) => {
    setBookmarks(prev => {
      const updated = prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId];
      
      localStorage.setItem('wecoded_bookmarks', JSON.stringify({
        bookmarks: updated,
        timestamp: Date.now()
      }));
      
      return updated;
    });
  };
  
  const isBookmarked = (storyId: number) => bookmarks.includes(storyId);
  
  return { bookmarks, toggleBookmark, isBookmarked };
}
```

### Update Page Component

In `app/page.tsx`:
```typescript
const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
const [showBookmarks, setShowBookmarks] = useState(false);

const filteredStories = showBookmarks
  ? stories.filter(story => bookmarks.includes(story.id))
  : stories;
```

## Features

1. **Quick Actions**
   - Double-click to bookmark
   - Keyboard shortcut: 'B' key to bookmark current story

2. **Visual Feedback**
   - Smooth animation when bookmarking
   - Toast notification: "Story bookmarked!" / "Bookmark removed"
   - Pulse animation on bookmark button

3. **Export/Share**
   - Optional: Export bookmarked story links
   - Optional: Share bookmark collection

## Acceptance Criteria

- [ ] Bookmark button added to StoryCard
- [ ] Bookmarks persist in localStorage
- [ ] Toggle bookmarks view in navigation
- [ ] Visual indicator shows bookmarked status
- [ ] Bookmark count displayed in navigation
- [ ] Empty state shown when no bookmarks
- [ ] Animation/feedback when bookmarking
- [ ] Keyboard shortcut 'B' to bookmark
- [ ] Accessible (proper ARIA labels)
- [ ] Works across browser sessions
- [ ] Handle storage quota exceeded gracefully

## Edge Cases to Handle

- localStorage is full
- localStorage is disabled
- User has many bookmarks (100+)
- Story no longer exists but is bookmarked
- Clearing browser data

## Testing Checklist

- [ ] Can bookmark a story
- [ ] Can unbookmark a story
- [ ] Bookmarks persist after page reload
- [ ] Bookmarks view shows only bookmarked stories
- [ ] Bookmark count updates correctly
- [ ] Empty state displays when no bookmarks
- [ ] Works with localStorage disabled (graceful degradation)
- [ ] Keyboard shortcut works
- [ ] ARIA labels are correct

## Related Files

- `components/StoryCard.tsx` - Add bookmark button
- `components/StoryCard.module.css` - Bookmark button styles
- `app/page.tsx` - Bookmark filtering logic
- `components/Navigation.tsx` - Add bookmarks toggle
- `hooks/useBookmarks.ts` - New bookmark hook (to create)
- `types/index.ts` - Add bookmark-related types

## Future Enhancements

- Sync bookmarks across devices (requires backend)
- Bookmark collections/folders
- Share bookmark collections
- Export as reading list
