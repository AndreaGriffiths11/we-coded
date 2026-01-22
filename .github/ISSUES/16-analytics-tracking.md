---
title: Implement analytics tracking
labels: enhancement, analytics, monitoring
---

## Description

Add privacy-friendly analytics tracking to understand user behavior, measure engagement, and improve the user experience based on data.

## Background

Currently, there's no visibility into how users interact with the WeCoded game. Analytics would help answer questions like: Which stories are most popular? How long do users stay? What features are most used? This data is crucial for improving the product while respecting user privacy.

## Requirements

### Privacy-First Approach

1. **Privacy-Friendly Analytics**
   - Use privacy-focused service (Plausible, Simple Analytics, or self-hosted)
   - No cookies or personal data collection
   - GDPR & CCPA compliant by default
   - Anonymous IP addresses
   - No cross-site tracking

2. **User Consent**
   - Optional: Opt-out mechanism
   - Privacy policy link
   - Clear data usage explanation
   - Respect Do Not Track (DNT) header

### Metrics to Track

1. **Page Views**
   - Total page views
   - Unique visitors
   - Session duration
   - Bounce rate

2. **Story Engagement**
   - Story views (which stories are popular)
   - Navigation patterns (next vs previous usage)
   - Time spent per story
   - Stories read per session
   - Completion rate (% of stories viewed)

3. **Feature Usage**
   - Mini-game plays
   - Mini-game average score
   - Mini-game play duration
   - Bookmark usage (if implemented)
   - Share button clicks (if implemented)
   - Search usage (if implemented)
   - Filter usage (if implemented)

4. **User Journey**
   - Entry points
   - Exit points
   - Navigation flow
   - Feature discovery rate

5. **Technical Metrics**
   - Load times
   - Error rates
   - Browser/device breakdown
   - Geographic distribution (country level only)

6. **Accessibility Metrics**
   - Keyboard navigation usage
   - Screen reader detection
   - Reduced motion preference
   - High contrast mode usage

## Implementation

### Option 1: Plausible Analytics (Recommended)

Install Plausible:
```bash
npm install plausible-tracker
```

Create `utils/analytics.ts`:
```typescript
import Plausible from 'plausible-tracker';

const plausible = Plausible({
  domain: 'wecoded.yourdomain.com',
  apiHost: 'https://plausible.io', // Or self-hosted instance
  trackLocalhost: process.env.NODE_ENV === 'development',
});

export const analytics = {
  // Page views
  trackPageView: () => {
    if (!shouldTrack()) return;
    plausible.trackPageview();
  },
  
  // Custom events
  trackEvent: (eventName: string, props?: Record<string, string | number>) => {
    if (!shouldTrack()) return;
    plausible.trackEvent(eventName, { props });
  },
  
  // Story interactions
  trackStoryView: (storyId: number, storyTitle: string) => {
    plausible.trackEvent('Story View', {
      props: { storyId: String(storyId), storyTitle }
    });
  },
  
  trackStoryNavigation: (direction: 'next' | 'previous') => {
    plausible.trackEvent('Story Navigation', {
      props: { direction }
    });
  },
  
  // Mini-game
  trackMiniGameStart: () => {
    plausible.trackEvent('Mini Game Start');
  },
  
  trackMiniGameEnd: (score: number, duration: number) => {
    plausible.trackEvent('Mini Game End', {
      props: { score: String(score), duration: String(duration) }
    });
  },
  
  // Bookmarks
  trackBookmark: (action: 'add' | 'remove') => {
    plausible.trackEvent('Bookmark', {
      props: { action }
    });
  },
  
  // Sharing
  trackShare: (platform: string, storyId: number) => {
    plausible.trackEvent('Share', {
      props: { platform, storyId: String(storyId) }
    });
  },
  
  // Search
  trackSearch: (query: string, resultsCount: number) => {
    plausible.trackEvent('Search', {
      props: { query, resultsCount: String(resultsCount) }
    });
  },
  
  // Accessibility
  trackAccessibilityFeature: (feature: string, enabled: boolean) => {
    plausible.trackEvent('Accessibility Feature', {
      props: { feature, enabled: String(enabled) }
    });
  },
  
  // Errors
  trackError: (errorMessage: string, errorStack?: string) => {
    plausible.trackEvent('Error', {
      props: { errorMessage, errorStack: errorStack?.substring(0, 100) }
    });
  },
};

function shouldTrack(): boolean {
  // Respect Do Not Track
  if (navigator.doNotTrack === '1') {
    return false;
  }
  
  // Check if user has opted out
  const optOut = localStorage.getItem('analytics_opt_out');
  if (optOut === 'true') {
    return false;
  }
  
  return true;
}

export function enableAnalytics() {
  plausible.enableAutoPageviews();
  plausible.enableAutoOutboundTracking();
}
```

### Option 2: Google Analytics 4 (GA4)

If using GA4, install:
```bash
npm install react-ga4
```

Create `utils/analytics.ts`:
```typescript
import ReactGA from 'react-ga4';

export function initializeAnalytics() {
  if (!shouldTrack()) return;
  
  ReactGA.initialize('G-XXXXXXXXXX', {
    gaOptions: {
      anonymizeIp: true,
    },
  });
}

export const analytics = {
  trackPageView: (page: string) => {
    if (!shouldTrack()) return;
    ReactGA.send({ hitType: 'pageview', page });
  },
  
  trackEvent: (category: string, action: string, label?: string, value?: number) => {
    if (!shouldTrack()) return;
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  },
  
  // ... similar methods
};
```

### Integration in App

#### Page Tracking

In `app/layout.tsx`:
```tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { enableAnalytics, analytics } from '@/utils/analytics';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    enableAnalytics();
  }, []);
  
  useEffect(() => {
    analytics.trackPageView();
  }, [pathname, searchParams]);
  
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### Event Tracking Examples

In `components/StoryCard.tsx`:
```tsx
useEffect(() => {
  analytics.trackStoryView(story.id, story.title);
}, [story]);

const handleNext = () => {
  analytics.trackStoryNavigation('next');
  onNext();
};
```

In `components/MiniGame.tsx`:
```tsx
const startGame = () => {
  analytics.trackMiniGameStart();
  setIsActive(true);
  setStartTime(Date.now());
};

useEffect(() => {
  if (collision && isActive) {
    const duration = Date.now() - startTime;
    analytics.trackMiniGameEnd(score, duration);
    setIsActive(false);
  }
}, [collision, isActive]);
```

### Privacy Notice Component

Create `components/PrivacyNotice.tsx`:
```tsx
export const PrivacyNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    const noticeDismissed = localStorage.getItem('privacy_notice_dismissed');
    setDismissed(noticeDismissed === 'true');
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('privacy_notice_dismissed', 'true');
    setDismissed(true);
  };
  
  const handleOptOut = () => {
    localStorage.setItem('analytics_opt_out', 'true');
    localStorage.setItem('privacy_notice_dismissed', 'true');
    setDismissed(true);
  };
  
  if (dismissed) return null;
  
  return (
    <div className={styles.notice}>
      <p>
        We use privacy-friendly analytics to understand how people use WeCoded. 
        No personal data is collected. <a href="/privacy">Learn more</a>
      </p>
      <div className={styles.actions}>
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleOptOut}>Opt Out</button>
      </div>
    </div>
  );
};
```

## Analytics Dashboard

Access analytics through:
- Plausible: `plausible.io/wecoded.yourdomain.com`
- GA4: Google Analytics dashboard
- Self-hosted: Custom dashboard

## Acceptance Criteria

- [ ] Analytics library installed and configured
- [ ] Privacy-friendly service selected
- [ ] Page views tracked automatically
- [ ] Story views tracked
- [ ] Navigation events tracked
- [ ] Mini-game events tracked
- [ ] Feature usage tracked
- [ ] Error events tracked
- [ ] DNT header respected
- [ ] Opt-out mechanism implemented
- [ ] Privacy notice displayed (if required)
- [ ] Privacy policy updated
- [ ] No personal data collected
- [ ] No cookies used (for Plausible)
- [ ] Analytics tested in production

## Privacy Compliance

### GDPR Compliance
- No personal data collected
- No cookies (with Plausible)
- Anonymous IP addresses
- Opt-out available
- Data retention policy

### CCPA Compliance
- No selling of personal information
- Opt-out mechanism
- Privacy policy disclosure

## Testing Checklist

- [ ] Events fire correctly
- [ ] DNT is respected
- [ ] Opt-out works
- [ ] No analytics in development (unless enabled)
- [ ] Dashboard shows data
- [ ] Custom events appear in dashboard
- [ ] No console errors
- [ ] Works across browsers
- [ ] Mobile tracking works

## Documentation

Create `docs/ANALYTICS.md`:
```markdown
# Analytics Documentation

## Tracked Events

### Story Engagement
- `Story View` - When a story is displayed
- `Story Navigation` - Next/Previous navigation

### Feature Usage
- `Mini Game Start` - Game started
- `Mini Game End` - Game ended (with score)
- `Bookmark` - Story bookmarked/unbookmarked
- `Share` - Story shared (with platform)

### Search & Discovery
- `Search` - Search performed (with query)
- `Filter Applied` - Filters used

## Privacy

We use Plausible Analytics, a privacy-friendly service that:
- Doesn't use cookies
- Doesn't collect personal data
- Anonymizes IP addresses
- Is GDPR & CCPA compliant

Users can opt out at any time.
```

## Related Files

- `utils/analytics.ts` - Analytics utility (to create)
- `components/PrivacyNotice.tsx` - Privacy notice (to create)
- `app/layout.tsx` - Initialize analytics
- `components/StoryCard.tsx` - Track story events
- `components/MiniGame.tsx` - Track game events
- `docs/ANALYTICS.md` - Documentation (to create)
- Privacy policy page

## Recommended Service: Plausible

**Pros:**
- Privacy-first
- No cookies
- GDPR compliant
- Simple API
- Beautiful dashboard
- Open source (can self-host)

**Cons:**
- Paid service (after trial)
- Less detailed than GA4

## Alternative: Self-Hosted

For complete control, self-host:
- Plausible (open source)
- Matomo
- Umami
- GoatCounter

## Resources

- [Plausible Documentation](https://plausible.io/docs)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)
- [Privacy-Friendly Analytics](https://github.com/plausible/analytics)

## Future Enhancements

- A/B testing
- Funnel analysis
- Cohort analysis
- Custom dashboards
- Automated reports
- Goal tracking
