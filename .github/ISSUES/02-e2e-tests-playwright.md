---
title: Add comprehensive E2E tests with Playwright
labels: testing, enhancement, infrastructure
---

## Description

Implement end-to-end testing suite using Playwright to test critical user flows and prevent regressions.

## Background

Currently, no E2E tests exist despite having critical user flows like story navigation, mini-game interaction, and API error handling. E2E tests would ensure quality before deployment and catch integration issues early.

## Requirements

### Test Coverage

1. **Story Navigation Flow**
   - Load application and verify stories are displayed
   - Navigate forward through stories
   - Navigate backward through stories
   - Verify story counter updates correctly

2. **Mini-Game Interaction**
   - Toggle mini-game visibility
   - Start the game
   - Use arrow keys to move player
   - Verify collision detection
   - Check score updates

3. **API Error Handling**
   - Mock API failures
   - Verify error messages are displayed
   - Verify fallback to cached data works

4. **Caching Behavior**
   - Verify localStorage caching
   - Test cache expiration
   - Test ETag-based validation

5. **Accessibility Features**
   - Test keyboard navigation
   - Verify ARIA labels
   - Test focus management

6. **Responsive Design**
   - Test on mobile viewport
   - Test on tablet viewport
   - Test on desktop viewport

## Technical Details

- Install Playwright: `npm install -D @playwright/test`
- Create test configuration: `playwright.config.ts`
- Create test directory: `e2e/` or `tests/e2e/`
- Add script to package.json: `"test:e2e": "playwright test"`

## Acceptance Criteria

- [ ] Playwright installed and configured
- [ ] All 6 test categories implemented
- [ ] Tests pass on Chromium, Firefox, and WebKit
- [ ] GitHub Actions workflow includes E2E tests
- [ ] Test reports generated and accessible
- [ ] README updated with testing instructions

## CI/CD Integration

Add to `.github/workflows/nextjs.yml`:
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
  
- name: Run E2E tests
  run: npm run test:e2e
```

## Related Files

- `app/page.tsx` - Main page component
- `components/StoryCard.tsx` - Story display component
- `components/MiniGame.tsx` - Mini-game component
- `hooks/useFetchStories.ts` - Data fetching logic
