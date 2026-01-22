---
title: Add animation transitions between stories
labels: enhancement, ui/ux, animation
---

## Description

Implement smooth slide or fade animations when navigating between stories to enhance the gamified feel and improve user experience.

## Background

Currently, story changes are instant which feels abrupt and doesn't provide good visual feedback. Smooth animations would make the navigation feel more polished, provide directional context (which direction the user is moving), and enhance the overall game-like experience.

## Requirements

### Animation Types

1. **Slide Animation**
   - Slide right when going to previous story
   - Slide left when going to next story
   - Duration: 300-400ms
   - Easing: cubic-bezier for smooth motion

2. **Fade Animation** (alternative/combined)
   - Fade out current story
   - Fade in next story
   - Duration: 200-300ms
   - Overlap for seamless transition

### Accessibility

- **Must respect `prefers-reduced-motion`**
  - Disable animations for users who prefer reduced motion
  - Use instant transitions or simple fade instead
  - Test with browser/OS motion settings

### Performance

- Use CSS transforms for 60fps animations
- GPU acceleration with `will-change` or `transform: translate3d`
- Avoid layout thrashing
- Prevent animations during slow network

## Technical Implementation

### Option 1: CSS Transitions

Add to `StoryCard.module.css`:
```css
.card {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.card.exitLeft {
  animation: slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
}

.card.exitRight {
  animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideOutRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: fadeIn 0.15s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .card.exitLeft,
  .card.exitRight {
    animation: fadeOut 0.15s ease-out;
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
}
```

### Option 2: Framer Motion (Recommended)

Install Framer Motion:
```bash
npm install framer-motion
```

Update `StoryCard.tsx`:
```tsx
import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const StoryCard = ({ story, direction, ...props }) => {
  return (
    <AnimatePresence initial={false} custom={direction} mode="wait">
      <motion.div
        key={story.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: 'spring', stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }}
        className={styles.card}
      >
        {/* Card content */}
      </motion.div>
    </AnimatePresence>
  );
};
```

Update `app/page.tsx`:
```tsx
const [direction, setDirection] = useState(0);

const nextStory = () => {
  setDirection(1);
  setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
};

const prevStory = () => {
  setDirection(-1);
  setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
};
```

### Option 3: React Transition Group

Alternative using React Transition Group:
```bash
npm install react-transition-group
npm install --save-dev @types/react-transition-group
```

## Animation Variants

### Slide Variants

1. **Horizontal Slide**
   - Left/Right based on navigation direction
   - Most intuitive for forward/back navigation

2. **Vertical Slide**
   - Up/Down animation
   - Alternative feel, like card flip

3. **Fade + Scale**
   - Current card fades and scales down
   - New card fades and scales up
   - Subtle and elegant

### Combined Effects

```tsx
const advancedVariants = {
  enter: {
    x: 100,
    opacity: 0,
    scale: 0.95
  },
  center: {
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: {
    x: -100,
    opacity: 0,
    scale: 0.95
  }
};
```

## Acceptance Criteria

- [ ] Animation library installed (Framer Motion recommended)
- [ ] Slide animation when navigating to next story
- [ ] Slide animation when navigating to previous story
- [ ] Direction-aware animations (left/right based on navigation)
- [ ] Smooth 60fps animations
- [ ] No layout shift during animation
- [ ] Animations disabled for `prefers-reduced-motion`
- [ ] Animation duration is appropriate (300-400ms)
- [ ] Works on mobile devices
- [ ] No performance issues with animations
- [ ] Loading states handled gracefully
- [ ] Works with keyboard navigation

## Performance Considerations

```css
/* Optimize for animation */
.card {
  will-change: transform, opacity;
}

/* Use GPU acceleration */
.card {
  transform: translate3d(0, 0, 0);
}

/* Remove will-change after animation */
.card.animated {
  will-change: auto;
}
```

## Testing Checklist

- [ ] Next button triggers left slide
- [ ] Previous button triggers right slide
- [ ] Animation duration feels right
- [ ] No janky frame drops
- [ ] Works on low-end devices
- [ ] Respects reduced motion
- [ ] Works with keyboard shortcuts
- [ ] Works on mobile (touch)
- [ ] Multiple rapid clicks handled gracefully
- [ ] Animation doesn't block interaction

## Edge Cases

1. **Rapid Navigation**
   - Prevent animation queue buildup
   - Cancel previous animation if new navigation starts
   
2. **First/Last Story**
   - Handle wrap-around smoothly
   - Consider if animation should differ at boundaries

3. **Loading States**
   - Don't animate while loading
   - Graceful transition from loading to story

4. **Error States**
   - No animation when error occurs
   - Or subtle animation to error UI

## Mobile Considerations

- Touch gestures (swipe) could trigger animations
- Reduce animation complexity on mobile
- Test on various devices and screen sizes

## Related Files

- `components/StoryCard.tsx` - Add animation wrapper
- `components/StoryCard.module.css` - Animation CSS (if using CSS)
- `app/page.tsx` - Track navigation direction
- `package.json` - Add animation library
- `app/globals.css` - Reduced motion media query

## Alternative Libraries

If not using Framer Motion:
- `react-spring` - Spring-based animations
- `react-transition-group` - Lower-level transition control
- CSS Animations - No dependencies, good performance

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [CSS Animation Performance](https://web.dev/animations-guide/)
- [React Animation Best Practices](https://www.joshwcomeau.com/react/animating-the-unanimatable/)

## Future Enhancements

- Swipe gestures for mobile
- Custom animation based on story type
- Particle effects for gamification
- Page transition animations
- Micro-interactions on buttons
