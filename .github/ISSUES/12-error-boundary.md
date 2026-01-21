---
title: Implement proper error boundary component
labels: enhancement, bug, reliability
---

## Description

Create and implement React Error Boundary component to gracefully handle runtime errors and prevent the entire application from crashing.

## Background

Currently, if a component crashes due to a runtime error, the entire application breaks and shows a blank screen. Error boundaries allow us to catch errors in child components, display user-friendly error messages, and maintain partial app functionality.

## Requirements

### Error Boundary Features

1. **Error Catching**
   - Catch errors in child components
   - Catch errors during rendering
   - Catch errors in lifecycle methods
   - Catch errors in constructors

2. **Error UI**
   - Display user-friendly error message
   - Show "Try Again" button to reset
   - Optional: Show error details in development
   - Maintain app header/footer when possible

3. **Error Logging**
   - Log errors to console
   - Include component stack trace
   - Include error boundary name/location
   - Optional: Send to error tracking service

4. **Recovery Options**
   - Reset error boundary on button click
   - Auto-reset after time delay (optional)
   - Reload page button
   - Navigate to home

## Implementation

### Create Error Boundary Component

`components/ErrorBoundary.tsx`:
```tsx
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error(`Error in ${this.props.name || 'component'}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Optional: Send to error tracking service
    // trackError(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h2 className={styles.errorTitle}>
              Oops! Something went wrong
            </h2>
            <p className={styles.errorMessage}>
              We're sorry for the inconvenience. The application encountered an error.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.errorDetails}>
                <summary>Error details (development only)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.error.stack}</pre>
              </details>
            )}
            
            <div className={styles.errorActions}>
              <button 
                onClick={this.resetError}
                className={styles.primaryButton}
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                className={styles.secondaryButton}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Error Boundary Styles

`components/ErrorBoundary.module.css`:
```css
.errorContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.errorContent {
  max-width: 600px;
  text-align: center;
  padding: 2rem;
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

.errorTitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--error-color, #dc2626);
}

.errorMessage {
  margin-bottom: 2rem;
  color: var(--foreground-secondary);
}

.errorDetails {
  text-align: left;
  margin: 1rem 0;
  padding: 1rem;
  background: var(--background-secondary);
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.errorDetails pre {
  overflow-x: auto;
  margin-top: 0.5rem;
}

.errorActions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.primaryButton,
.secondaryButton {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.primaryButton {
  background: var(--accent-color, #3b82f6);
  color: white;
}

.primaryButton:hover {
  background: var(--accent-color-hover, #2563eb);
}

.secondaryButton {
  background: var(--background-secondary);
  color: var(--foreground);
}

.secondaryButton:hover {
  background: var(--hover-background);
}
```

## Usage

### Wrap Entire App

In `app/layout.tsx`:
```tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary name="App Root">
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

### Wrap Individual Sections

In `app/page.tsx`:
```tsx
<ErrorBoundary name="Story Section">
  <StoryCard {...props} />
</ErrorBoundary>

<ErrorBoundary name="Mini Game">
  <MiniGame />
</ErrorBoundary>
```

### With Custom Fallback

```tsx
<ErrorBoundary
  name="Story Card"
  fallback={
    <div className={styles.simpleError}>
      <p>Unable to load this story</p>
      <button onClick={nextStory}>Skip to Next</button>
    </div>
  }
>
  <StoryCard story={currentStory} />
</ErrorBoundary>
```

## Error Tracking Integration

Optional integration with error tracking services:

```typescript
// utils/errorTracking.ts
export function trackError(error: Error, errorInfo: ErrorInfo) {
  if (process.env.NODE_ENV === 'production') {
    // Sentry
    // Sentry.captureException(error, { contexts: { react: errorInfo } });
    
    // Or other service
    // LogRocket.captureException(error, { extra: errorInfo });
  }
}
```

## Acceptance Criteria

- [ ] ErrorBoundary component created
- [ ] Catches rendering errors in child components
- [ ] Displays user-friendly error UI
- [ ] "Try Again" button resets error state
- [ ] "Reload Page" button refreshes the app
- [ ] Error details shown in development mode
- [ ] Error details hidden in production
- [ ] Errors logged to console with stack trace
- [ ] Multiple error boundaries wrap different sections
- [ ] App header/footer remain visible when section errors
- [ ] Works with Next.js App Router
- [ ] Styles match app design system
- [ ] Accessible (proper semantic HTML, focus management)

## Testing

### Manual Testing

Test error boundary by temporarily throwing errors:

```tsx
// In any component
if (shouldError) {
  throw new Error('Test error boundary');
}
```

Test scenarios:
1. Error in StoryCard component
2. Error in MiniGame component
3. Error during data fetching
4. Error in nested component
5. Reset functionality works
6. Reload functionality works

### Automated Testing

```typescript
// ErrorBoundary.test.tsx
test('catches errors and displays fallback', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
});

test('resets error on button click', () => {
  // Test reset functionality
});
```

## Related Files

- `components/ErrorBoundary.tsx` - New component (to create)
- `components/ErrorBoundary.module.css` - Styles (to create)
- `app/layout.tsx` - Wrap root
- `app/page.tsx` - Wrap sections
- `utils/errorTracking.ts` - Optional error tracking (to create)

## Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Error Boundaries in Next.js](https://nextjs.org/docs/advanced-features/error-handling)
- [Error Boundary Best Practices](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react)

## Future Enhancements

- Integration with Sentry or similar service
- Automatic error recovery attempts
- Error reporting to backend
- User feedback form in error UI
- Different error UIs for different error types
