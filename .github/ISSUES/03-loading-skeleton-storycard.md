---
title: Add loading skeleton for StoryCard component
labels: enhancement, ui/ux, performance
---

## Description

Replace the simple "Loading stories..." text with an animated skeleton loader that matches the StoryCard layout to improve perceived performance.

## Background

Currently, when stories are loading, users see only plain text saying "Loading stories...". A skeleton loader provides visual feedback about the layout structure and creates a better perceived performance, making the app feel faster and more polished.

## Requirements

### Skeleton Structure

The skeleton should include placeholders for:
1. **Header section**
   - Title placeholder (2-3 lines)
   - XP badge placeholder

2. **Content section**
   - Description placeholder (4-5 lines)

3. **Author section**
   - Avatar placeholder (circular, 48x48px)
   - Author name placeholder (1 line)
   - Username placeholder (1 line)

4. **Footer section**
   - Progress bar placeholder
   - Navigation buttons placeholders
   - Level indicator placeholder

### Animation

- Use CSS shimmer/pulse animation effect
- Animation should be smooth and subtle
- **Must respect `prefers-reduced-motion`** - no animation for users who prefer reduced motion

## Technical Details

**Option 1: Pure CSS Implementation**
```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 0%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
```

**Option 2: Use a library**
- `react-loading-skeleton` or similar

## Acceptance Criteria

- [ ] Create `SkeletonCard` component or skeleton variant of `StoryCard`
- [ ] Skeleton matches the actual `StoryCard` layout
- [ ] Smooth shimmer/pulse animation implemented
- [ ] Animation respects `prefers-reduced-motion`
- [ ] Skeleton shown during initial load
- [ ] Skeleton shown when refetching stories
- [ ] Works well with dark/light themes (if theme toggle exists)
- [ ] No layout shift when skeleton is replaced with actual content

## Design Considerations

- Use existing CSS variables for colors
- Skeleton should be subtle, not distracting
- Border radius should match actual card
- Spacing should match actual card layout

## Related Files

- `components/StoryCard.tsx` - Main card component
- `app/page.tsx` - Page that shows loading state
- `components/StoryCard.module.css` - Card styles
