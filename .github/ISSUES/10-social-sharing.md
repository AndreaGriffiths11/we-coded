---
title: Add social sharing functionality
labels: enhancement, feature, social
---

## Description

Implement social media sharing buttons for stories (Twitter, LinkedIn, Facebook) to help increase visibility of the WeCoded initiative.

## Background

Currently, users can read inspiring stories but cannot easily share them with their networks. Adding social sharing would amplify the reach of diverse tech stories and promote the WeCoded community.

## Requirements

### Supported Platforms

1. **Twitter/X**
   - Pre-populated tweet with story title
   - Include author mention if available
   - Add #WeCoded hashtag
   - Link to original DEV.to article

2. **LinkedIn**
   - Share with story title and description
   - Link to original article

3. **Facebook**
   - Share story URL
   - Auto-populate title and description

4. **Copy Link**
   - Copy story URL to clipboard
   - Show confirmation toast

### Share Button UI

Add share menu to StoryCard:
```tsx
<div className={styles.shareSection}>
  <button 
    onClick={toggleShareMenu}
    className={styles.shareButton}
    aria-label="Share this story"
  >
    🔗 Share
  </button>
  
  {showShareMenu && (
    <div className={styles.shareMenu}>
      <button onClick={() => shareOn('twitter')}>
        Share on Twitter
      </button>
      <button onClick={() => shareOn('linkedin')}>
        Share on LinkedIn
      </button>
      <button onClick={() => shareOn('facebook')}>
        Share on Facebook
      </button>
      <button onClick={copyLink}>
        Copy Link
      </button>
    </div>
  )}
</div>
```

## Technical Implementation

### Share Utility: `utils/share.ts`

```typescript
interface ShareOptions {
  title: string;
  url: string;
  author?: string;
  authorTwitter?: string;
}

export function shareOnTwitter(options: ShareOptions) {
  const text = `${options.title} by ${options.author || 'a developer'} #WeCoded`;
  const url = options.url;
  const via = 'ThePracticalDev'; // DEV.to's Twitter
  
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&via=${via}`;
  
  window.open(shareUrl, '_blank', 'width=550,height=420');
}

export function shareOnLinkedIn(options: ShareOptions) {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(options.url)}`;
  
  window.open(shareUrl, '_blank', 'width=550,height=500');
}

export function shareOnFacebook(options: ShareOptions) {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(options.url)}`;
  
  window.open(shareUrl, '_blank', 'width=550,height=500');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  }
}
```

### Web Share API (Mobile)

For mobile devices, use native share dialog:
```typescript
export async function nativeShare(options: ShareOptions) {
  if (!navigator.share) {
    return false;
  }
  
  try {
    await navigator.share({
      title: options.title,
      text: `${options.title} by ${options.author || 'a developer'} #WeCoded`,
      url: options.url,
    });
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled, not an error
      return false;
    }
    throw error;
  }
}
```

### Component: `components/ShareButton.tsx`

```tsx
interface ShareButtonProps {
  story: DevArticle;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ story }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleShare = async (platform: string) => {
    const options = {
      title: story.title,
      url: story.url,
      author: story.user.name,
      authorTwitter: story.user.twitter_username || undefined,
    };
    
    switch (platform) {
      case 'twitter':
        shareOnTwitter(options);
        break;
      case 'linkedin':
        shareOnLinkedIn(options);
        break;
      case 'facebook':
        shareOnFacebook(options);
        break;
      case 'native':
        await nativeShare(options);
        break;
    }
    
    setShowMenu(false);
  };
  
  const handleCopyLink = async () => {
    const success = await copyToClipboard(story.url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className={styles.shareContainer}>
      <button onClick={() => setShowMenu(!showMenu)}>
        🔗 Share
      </button>
      {/* Share menu UI */}
    </div>
  );
};
```

## Analytics Integration

Track share events (if analytics implemented):
```typescript
function trackShare(platform: string, storyId: number) {
  // Analytics event
  if (window.analytics) {
    window.analytics.track('Story Shared', {
      platform,
      storyId,
      storyTitle: story.title,
    });
  }
}
```

## Acceptance Criteria

- [ ] Share button added to StoryCard
- [ ] Share menu with 4 options (Twitter, LinkedIn, Facebook, Copy)
- [ ] Twitter share includes pre-populated text with #WeCoded
- [ ] LinkedIn share opens with story URL
- [ ] Facebook share opens with story URL
- [ ] Copy link to clipboard works
- [ ] Confirmation shown after copying link
- [ ] Native share dialog used on mobile (Web Share API)
- [ ] Share popups have appropriate size
- [ ] Menu closes after selection
- [ ] Click outside closes share menu
- [ ] Keyboard accessible (Escape to close)
- [ ] ARIA labels for accessibility
- [ ] Works across all major browsers

## UI Considerations

### Share Menu Position
- Position relative to share button
- Ensure menu doesn't overflow viewport
- Mobile: Consider bottom sheet or native share

### Visual Design
```css
.shareButton {
  background: var(--accent-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}

.shareMenu {
  position: absolute;
  background: var(--card-background);
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius);
  padding: 0.5rem 0;
  min-width: 200px;
}

.shareMenuItem {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.shareMenuItem:hover {
  background: var(--hover-background);
}
```

## Testing Checklist

- [ ] Share buttons open correct platforms
- [ ] Twitter share includes proper hashtags
- [ ] Share URLs are properly encoded
- [ ] Copy to clipboard works
- [ ] Confirmation toast appears after copy
- [ ] Native share works on mobile
- [ ] Fallback works when Web Share API unavailable
- [ ] Share menu closes on selection
- [ ] Share menu closes on outside click
- [ ] Share menu closes on Escape key
- [ ] Popup blockers don't prevent sharing

## Related Files

- `components/StoryCard.tsx` - Add share button
- `components/ShareButton.tsx` - New share component (to create)
- `components/ShareButton.module.css` - Share button styles (to create)
- `utils/share.ts` - Share utility functions (to create)
- `types/index.ts` - Add share-related types if needed

## Resources

- [Twitter Web Intent](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/overview)
- [LinkedIn Share](https://www.linkedin.com/help/linkedin/answer/a519849)
- [Facebook Share Dialog](https://developers.facebook.com/docs/sharing/reference/share-dialog)
- [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

## Future Enhancements

- Reddit share
- Email share
- Download as image (story card screenshot)
- WhatsApp share
- Share stats/analytics
