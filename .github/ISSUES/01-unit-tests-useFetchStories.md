---
title: Add unit tests for useFetchStories hook
labels: testing, enhancement, good-first-issue
---

## Description

Create comprehensive unit tests for the `useFetchStories` custom hook to test caching logic, error handling, and API response handling.

## Background

Currently, the project README mentions Jest and React Testing Library but no test files exist in the repository. The `useFetchStories` hook has complex caching logic with ETag support and localStorage fallback that needs thorough testing to ensure reliability.

## Requirements

Tests should cover the following scenarios:

1. **Successful API fetch**
   - Fetches stories from DEV.to API successfully
   - Sorts stories by published date
   - Updates state correctly

2. **Cache hit scenario**
   - Returns cached data when cache is valid (within 5 minutes)
   - Doesn't make API call when cache is fresh

3. **Cache miss scenario**
   - Makes API call when cache is expired
   - Updates cache with new data

4. **304 Not Modified response**
   - Handles ETag-based cache validation
   - Uses cached data when server returns 304

5. **Error states**
   - Handles API errors gracefully
   - Sets appropriate error messages
   - Falls back to expired cache when available

6. **Expired cache fallback**
   - Uses stale cache data when API fails
   - Shows error message but displays cached content

## Technical Details

- File location: `hooks/useFetchStories.ts`
- Test framework: Jest
- Testing library: React Testing Library / React Hooks Testing Library
- Mock localStorage and fetch API

## Acceptance Criteria

- [ ] Test file created at `hooks/useFetchStories.test.ts`
- [ ] All 6 scenarios covered with tests
- [ ] Tests pass successfully
- [ ] Code coverage for the hook is above 90%
- [ ] Tests are well-documented with clear descriptions

## Related Files

- `hooks/useFetchStories.ts` - Hook to be tested
- `types/index.ts` - Type definitions used by the hook
