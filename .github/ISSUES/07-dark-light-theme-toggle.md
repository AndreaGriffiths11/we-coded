---
title: Add dark/light theme toggle
labels: enhancement, accessibility, ui/ux, a11y
---

## Description

Implement a theme toggle feature to switch between light and dark modes, enhancing user experience and accessibility.

## Background

The application currently has CSS variables defined in the codebase that suggest theme support, but there's no user-facing toggle to switch themes. Many users prefer dark mode for reduced eye strain, especially during extended reading sessions.

## Requirements

### Core Functionality

1. **Theme Toggle UI**
   - Add theme toggle button in the header (near score/title)
   - Use icon: 🌙 for dark mode, ☀️ for light mode
   - Smooth transition between themes (respect prefers-reduced-motion)

2. **Theme Persistence**
   - Save user preference in localStorage
   - Restore theme on page load
   - Prevent flash of wrong theme (FOUT)

3. **System Preference Detection**
   - Detect `prefers-color-scheme` media query
   - Use system preference as default (if no saved preference)
   - Allow user to override system preference

4. **Theme Implementation**
   - Light mode (default)
   - Dark mode with appropriate color palette

### Color Palette

Define CSS variables for both themes:

```css
/* Light Theme (default) */
:root {
  --background-primary: rgb(255, 255, 255);
  --background-secondary: rgb(245, 245, 247);
  --foreground: rgb(0, 0, 0);
  --foreground-secondary: rgb(60, 60, 67);
  --border-color: rgb(229, 229, 234);
  --card-background: rgb(255, 255, 255);
  --card-shadow: rgba(0, 0, 0, 0.1);
}

/* Dark Theme */
[data-theme="dark"] {
  --background-primary: rgb(0, 0, 0);
  --background-secondary: rgb(28, 28, 30);
  --foreground: rgb(255, 255, 255);
  --foreground-secondary: rgb(174, 174, 178);
  --border-color: rgb(58, 58, 60);
  --card-background: rgb(28, 28, 30);
  --card-shadow: rgba(0, 0, 0, 0.3);
}
```

## Technical Implementation

### 1. Theme Context/Hook

Create `hooks/useTheme.ts`:
```typescript
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Check localStorage
    const saved = localStorage.getItem('theme');
    if (saved) {
      setTheme(saved as 'light' | 'dark');
      return;
    }
    
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return { theme, toggleTheme };
}
```

### 2. Theme Toggle Component

Create `components/ThemeToggle.tsx`:
```tsx
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={styles.themeToggle}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
```

### 3. Prevent Flash of Unstyled Theme

Add inline script in `app/layout.tsx` (before other content):
```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        const theme = localStorage.getItem('theme') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      })();
    `
  }}
/>
```

## Acceptance Criteria

- [ ] Theme toggle button added to header
- [ ] Dark and light themes fully implemented
- [ ] Theme persists across page reloads
- [ ] System preference detected and used as default
- [ ] No flash of unstyled content (FOUT)
- [ ] Smooth transitions between themes
- [ ] Transitions respect `prefers-reduced-motion`
- [ ] All components render correctly in both themes
- [ ] Contrast ratios meet WCAG AA standards in both themes
- [ ] Documentation updated with theme feature

## Testing Checklist

- [ ] Toggle switches between light and dark mode
- [ ] Theme persists after page reload
- [ ] System preference properly detected
- [ ] User preference overrides system preference
- [ ] No FOUT on initial page load
- [ ] All components readable in both themes
- [ ] Icons/images appropriate for each theme
- [ ] Proper ARIA labels on toggle button

## Accessibility Considerations

- Toggle button has proper ARIA label
- Keyboard accessible (tab + enter/space)
- Visual focus indicator on toggle button
- Sufficient contrast in both themes (WCAG AA: 4.5:1 for text)
- Icons clearly indicate current/next theme state

## Related Files

- `app/globals.css` - Theme variables
- `app/styles/variables.css` - CSS variables
- `app/layout.tsx` - Add theme prevention script
- `components/GameHeader.tsx` - Add toggle button
- `hooks/useTheme.ts` - New theme hook (to create)
- `components/ThemeToggle.tsx` - New toggle component (to create)

## Resources

- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
