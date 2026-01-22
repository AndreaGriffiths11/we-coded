---
title: Implement rate limiting and error retry logic
labels: enhancement, reliability, bug
---

## Description

Add exponential backoff retry logic and proper rate limit handling for DEV.to API calls to improve reliability and user experience.

## Background

Currently, if an API call to DEV.to fails, the app only tries once. This can lead to failures during temporary network issues or API rate limiting. Implementing retry logic with exponential backoff would significantly improve reliability.

## Requirements

### 1. Exponential Backoff Retry

Implement retry logic with exponential backoff:
- **Maximum retries**: 3 attempts
- **Backoff strategy**: 1s, 2s, 4s
- **Jitter**: Add random jitter to prevent thundering herd

Example implementation:
```typescript
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry on 4xx errors (except 429)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      if (isLastAttempt) throw error;
      
      // Exponential backoff with jitter
      const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### 2. Rate Limit Handling

Properly handle 429 (Too Many Requests) responses:
- Check for `Retry-After` header
- Show user-friendly message explaining rate limit
- Automatically retry after specified time
- Consider implementing request throttling

### 3. User-Friendly Error Messages

Provide specific error messages for different scenarios:
- **Network error**: "Unable to connect. Please check your internet connection."
- **Rate limited**: "Too many requests. Retrying in [X] seconds..."
- **Server error**: "DEV.to is temporarily unavailable. Using cached stories."
- **Timeout**: "Request timed out. Please try again."

### 4. Request Debouncing

If implementing a refresh button, add debouncing to prevent rapid requests:
```typescript
const debouncedFetch = debounce(fetchStories, 2000);
```

## Technical Implementation

### Files to Modify

**`hooks/useFetchStories.ts`**
- Add retry logic to fetch function
- Handle rate limiting
- Improve error messages
- Add request debouncing (if refresh functionality exists)

### New Utility (Optional)

Create `utils/fetchWithRetry.ts` for reusable retry logic

## Acceptance Criteria

- [ ] Retry logic implemented with exponential backoff
- [ ] Maximum 3 retry attempts
- [ ] Random jitter added to prevent thundering herd
- [ ] 429 rate limit responses handled with Retry-After header
- [ ] User-friendly error messages for different error types
- [ ] Cached data used as fallback when available
- [ ] Loading states properly reflect retry attempts
- [ ] Tests added for retry logic
- [ ] Documentation updated

## Testing

Test scenarios to verify:
1. Successful fetch after 1 retry
2. Successful fetch after 2 retries
3. Failure after 3 retries
4. Rate limit handling with Retry-After
5. Immediate failure on 4xx errors (except 429)
6. Fallback to cache on repeated failures

## Related Files

- `hooks/useFetchStories.ts` - Main hook to modify
- `types/index.ts` - Type definitions

## Resources

- [Exponential Backoff](https://en.wikipedia.org/wiki/Exponential_backoff)
- [DEV.to API Rate Limits](https://developers.forem.com/api/#section/Rate-limiting)
- [HTTP 429 Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429)
