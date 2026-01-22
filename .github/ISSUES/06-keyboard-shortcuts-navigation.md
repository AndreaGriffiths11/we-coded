---
title: Implement keyboard shortcuts for story navigation
labels: enhancement, accessibility, a11y
---

## Description

Add keyboard shortcuts (arrow keys) for navigating between stories when the mini-game is not active, improving accessibility and user experience.

## Background

Currently, users can only navigate between stories using mouse clicks on the "Previous" and "Next" buttons. Adding keyboard navigation would significantly improve accessibility for keyboard-only users and provide a more efficient navigation experience for all users.

## Requirements

### Keyboard Shortcuts

- **Left Arrow** (←): Navigate to previous story
- **Right Arrow** (→): Navigate to next story
- **Escape**: Close mini-game (if open)

### Behavior

1. **When mini-game is NOT active**:
   - Arrow keys navigate between stories
   - Visual feedback on button when key is pressed

2. **When mini-game IS active**:
   - Arrow keys control the game (existing behavior)
   - Story navigation is disabled

3. **Focus management**:
   - Shortcuts work regardless of which element has focus
   - Don't interfere with form inputs (if any added in future)

### Accessibility Considerations

- Add visual indicator showing keyboard shortcuts are available
- Include keyboard shortcuts in "How to Play" section
- Add `aria-live` announcement when story changes via keyboard
- Ensure shortcuts don't conflict with browser/screen reader shortcuts

## Technical Implementation

```typescript
// In app/page.tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't handle shortcuts in input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    // Don't handle shortcuts when mini-game is active
    if (showMiniGame) {
      return;
    }
    
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevStory();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextStory();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [showMiniGame, prevStory, nextStory]);
```

### Visual Indicators

Add keyboard shortcut hints to the navigation buttons:
```tsx
<button onClick={onPrevious} className={styles.navButton}>
  ← Previous
  <span className={styles.keyboardHint}>Left arrow</span>
</button>
```

## Acceptance Criteria

- [ ] Left arrow key navigates to previous story
- [ ] Right arrow key navigates to next story
- [ ] Shortcuts disabled when mini-game is active
- [ ] Shortcuts work from anywhere on the page (except form inputs)
- [ ] Visual indicators added to show keyboard shortcuts
- [ ] "How to Play" section updated with keyboard shortcuts
- [ ] ARIA announcements added for screen reader users
- [ ] No conflicts with existing functionality
- [ ] Works across all major browsers

## UI Updates

### Navigation Buttons
Add subtle keyboard shortcut hints to buttons:
```css
.keyboardHint {
  font-size: 0.75rem;
  opacity: 0.6;
  margin-left: 0.5rem;
}
```

### How to Play Section
Update the "Read Stories" card to include:
```markdown
- Use Left/Right arrow keys for quick navigation
- Click Previous/Next buttons to navigate between stories
```

## Testing Checklist

- [ ] Arrow keys navigate stories when game is closed
- [ ] Arrow keys control game when game is open
- [ ] Escape key closes mini-game (if implemented)
- [ ] No interference with form inputs
- [ ] Screen reader announces story changes
- [ ] Visual feedback on keyboard navigation
- [ ] Works without mouse interaction

## Related Files

- `app/page.tsx` - Add keyboard event listeners
- `components/StoryCard.tsx` - Update button UI with hints
- `components/HowToPlay.tsx` - Add keyboard shortcut documentation
- `components/StoryCard.module.css` - Styles for keyboard hints

## Accessibility Resources

- [WCAG 2.1 Keyboard Accessible](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [MDN Keyboard Events](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)
