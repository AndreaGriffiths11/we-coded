---
title: Add progressive web app (PWA) support
labels: enhancement, pwa, mobile, offline
---

## Description

Convert the application to a Progressive Web App with service worker for offline support, installability, and app-like experience.

## Background

Currently, the app requires an internet connection and isn't installable. PWA support would allow users to install the app on their devices, work offline with cached content, and provide an app-like experience with faster load times.

## Requirements

### Core PWA Features

1. **Web App Manifest**
   - App name, short name, description
   - Icons (192x192, 512x512, maskable)
   - Theme colors
   - Display mode (standalone)
   - Start URL and scope

2. **Service Worker**
   - Cache static assets
   - Cache API responses
   - Offline fallback page
   - Background sync (optional)
   - Push notifications (future)

3. **Installability**
   - Install prompt
   - Custom install button
   - Track installation
   - Update notifications

4. **Offline Support**
   - Cached stories available offline
   - Offline indicator
   - Sync when back online
   - Queue actions for later sync

## Implementation

### 1. Web App Manifest

Create `public/manifest.json`:
```json
{
  "name": "WeCoded Game - Diversity in Tech Stories",
  "short_name": "WeCoded",
  "description": "A gamified experience celebrating diversity in tech through storytelling",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192-maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-512x512-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["education", "social", "entertainment"],
  "screenshots": [
    {
      "src": "/screenshots/screenshot-1.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "Read Stories",
      "short_name": "Stories",
      "description": "Browse tech stories",
      "url": "/?utm_source=homescreen",
      "icons": [{ "src": "/icons/stories-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Play Mini Game",
      "short_name": "Game",
      "description": "Play the mini game",
      "url": "/?game=true",
      "icons": [{ "src": "/icons/game-96x96.png", "sizes": "96x96" }]
    }
  ]
}
```

Add to `app/layout.tsx`:
```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#3b82f6" />
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
```

### 2. Service Worker

Create `public/sw.js`:
```javascript
const CACHE_NAME = 'wecoded-v1';
const STATIC_CACHE = 'wecoded-static-v1';
const DYNAMIC_CACHE = 'wecoded-dynamic-v1';

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/wecoded.svg',
  // Add other static assets
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('wecoded-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // API requests - Network first, cache fallback
  if (request.url.includes('/api/') || request.url.includes('dev.to/api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }
  
  // Static assets - Cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
      );
    }).catch(() => {
      // Offline fallback
      if (request.destination === 'document') {
        return caches.match('/offline.html');
      }
    })
  );
});
```

### 3. Service Worker Registration

Create `utils/serviceWorker.ts`:
```typescript
export function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker installed, show update notification
                  showUpdateNotification();
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    });
  }
}

function showUpdateNotification() {
  if (confirm('A new version is available! Reload to update?')) {
    window.location.reload();
  }
}
```

Register in `app/layout.tsx`:
```tsx
'use client';

useEffect(() => {
  registerServiceWorker();
}, []);
```

### 4. Install Prompt

Create `components/InstallPrompt.tsx`:
```tsx
export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };
  
  if (!showPrompt) return null;
  
  return (
    <div className={styles.installBanner}>
      <div className={styles.content}>
        <span className={styles.icon}>📱</span>
        <div className={styles.text}>
          <strong>Install WeCoded</strong>
          <p>Get the app experience with offline access!</p>
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={handleInstall} className={styles.installButton}>
          Install
        </button>
        <button onClick={() => setShowPrompt(false)} className={styles.dismissButton}>
          Not now
        </button>
      </div>
    </div>
  );
};
```

### 5. Offline Page

Create `public/offline.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - WeCoded</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
      text-align: center;
      padding: 2rem;
    }
    .container {
      max-width: 500px;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .icon {
      font-size: 5rem;
      margin-bottom: 1rem;
    }
    button {
      margin-top: 2rem;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    button:hover {
      background: #2563eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📡</div>
    <h1>You're Offline</h1>
    <p>
      It looks like you've lost your internet connection. 
      Don't worry, you can still view cached stories!
    </p>
    <button onclick="window.location.reload()">Try Again</button>
  </div>
</body>
</html>
```

### 6. Online/Offline Indicator

Create `components/OnlineStatus.tsx`:
```tsx
export const OnlineStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (isOnline) return null;
  
  return (
    <div className={styles.offlineBanner}>
      <span>📡</span> You're offline. Viewing cached content.
    </div>
  );
};
```

## App Icons

Generate icons using tools like:
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon Generator](https://realfavicongenerator.net/)
- [Maskable.app](https://maskable.app/) for maskable icons

Required sizes:
- 192x192 (minimum)
- 512x512 (recommended)
- Maskable variants
- Apple touch icon (180x180)
- Favicon (16x16, 32x32)

## Acceptance Criteria

- [ ] Web app manifest created and linked
- [ ] Service worker implemented
- [ ] Static assets cached
- [ ] API responses cached
- [ ] Offline fallback page created
- [ ] Install prompt component added
- [ ] Online/offline indicator implemented
- [ ] App icons created (all sizes)
- [ ] App installable on mobile and desktop
- [ ] Works offline with cached content
- [ ] Update notification shows for new versions
- [ ] Lighthouse PWA score ≥ 90
- [ ] Tested on Chrome, Safari, Firefox
- [ ] Tested on iOS and Android

## Testing Checklist

- [ ] App shows install prompt
- [ ] App installs successfully
- [ ] Installed app opens in standalone mode
- [ ] Service worker registers correctly
- [ ] Static assets load from cache
- [ ] API responses cached and served offline
- [ ] Offline page shows when no network
- [ ] Online indicator updates correctly
- [ ] Update notification appears for new SW
- [ ] Icons display correctly when installed
- [ ] Theme color applied correctly

## Related Files

- `public/manifest.json` - Web app manifest (to create)
- `public/sw.js` - Service worker (to create)
- `public/offline.html` - Offline fallback (to create)
- `public/icons/` - App icons (to create)
- `utils/serviceWorker.ts` - SW registration (to create)
- `components/InstallPrompt.tsx` - Install UI (to create)
- `components/OnlineStatus.tsx` - Online status (to create)
- `app/layout.tsx` - Add manifest link and SW registration

## Tools & Resources

- [PWABuilder](https://www.pwabuilder.com/)
- [Workbox](https://developers.google.com/web/tools/workbox) (advanced SW library)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Lighthouse PWA Audit](https://web.dev/lighthouse-pwa/)

## Future Enhancements

- Background sync for bookmarks/achievements
- Push notifications for new stories
- Share target (share to app)
- Periodic background sync
- Advanced caching strategies
- Offline analytics queue
