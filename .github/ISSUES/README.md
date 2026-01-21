# WeCoded Improvement Issues

This directory contains 20 improvement proposals for the WeCoded project, organized as individual markdown files.

## 📋 Issue Overview

### Testing & Quality Assurance (2 issues)
1. **01-unit-tests-useFetchStories.md** - Add unit tests for useFetchStories hook
2. **02-e2e-tests-playwright.md** - Add comprehensive E2E tests with Playwright

### Performance Optimization (3 issues)
3. **03-loading-skeleton-storycard.md** - Add loading skeleton for StoryCard component
4. **04-bundle-optimization-code-splitting.md** - Optimize bundle size and implement code splitting
5. **05-rate-limiting-retry-logic.md** - Implement rate limiting and error retry logic

### Accessibility (3 issues)
6. **06-keyboard-shortcuts-navigation.md** - Implement keyboard shortcuts for story navigation
7. **07-dark-light-theme-toggle.md** - Add dark/light theme toggle
8. **08-accessibility-audit.md** - Implement comprehensive accessibility audit fixes

### New Features (7 issues)
9. **09-story-bookmarking.md** - Implement story bookmarking/favorites feature
10. **10-social-sharing.md** - Add social sharing functionality
11. **11-search-filter-stories.md** - Add search and filter functionality for stories
12. **14-achievement-badge-system.md** - Implement achievement/badge system
13. **17-minigame-difficulty-variations.md** - Add mini-game difficulty levels and variations
14. **18-internationalization-i18n.md** - Add internationalization (i18n) support
15. **19-reading-progress-resume.md** - Add story reading progress indicator and resume feature

### UI/UX Enhancements (1 issue)
16. **13-animation-transitions.md** - Add animation transitions between stories

### Code Architecture (2 issues)
17. **12-error-boundary.md** - Implement proper error boundary component
18. **15-pwa-support.md** - Add progressive web app (PWA) support

### Documentation & Process (2 issues)
19. **16-analytics-tracking.md** - Implement analytics tracking
20. **20-contributing-guide-templates.md** - Create contributing guide and issue templates

## 🚀 Creating Issues on GitHub

### Option 1: Manual Creation

1. Navigate to the GitHub repository
2. Click on "Issues" → "New Issue"
3. Copy the content from each `.md` file
4. Paste into the issue body
5. Extract the `title` from the frontmatter
6. Add `labels` from the frontmatter
7. Create the issue

### Option 2: Using GitHub CLI (Recommended)

If you have GitHub CLI installed and authenticated, run:

```bash
cd .github/ISSUES
bash create-issues.sh
```

This script will automatically create all 20 issues on GitHub.

### Option 3: Using the gh CLI Manually

For each issue file:

```bash
gh issue create --title "Issue Title" --body-file filename.md --label "label1,label2"
```

Example:
```bash
gh issue create \
  --title "Add unit tests for useFetchStories hook" \
  --body-file 01-unit-tests-useFetchStories.md \
  --label "testing,enhancement,good-first-issue"
```

## 📝 Issue Format

Each issue file contains:

- **Frontmatter** (YAML): Title and labels
- **Description**: Overview of the improvement
- **Background**: Why this improvement is needed
- **Requirements**: Detailed specifications
- **Technical Implementation**: Code examples and approach
- **Acceptance Criteria**: Definition of done
- **Testing Checklist**: How to verify the implementation
- **Related Files**: Files that need to be modified
- **Resources**: Helpful links and documentation

## 🎯 Getting Started

### For Maintainers

1. Review each issue file
2. Prioritize issues based on project goals
3. Create issues on GitHub using one of the methods above
4. Assign appropriate labels, milestones, and assignees
5. Link related issues

### For Contributors

1. Browse the issue files to understand available work
2. Once issues are created on GitHub, pick one that matches your skills
3. Comment on the issue to express interest
4. Follow the CONTRIBUTING.md guide (once created via issue #20)

## 📊 Priority Suggestions

### High Priority (Do First)
- Testing infrastructure (issues #1, #2)
- Accessibility audit (#8)
- Error boundaries (#12)
- Contributing guide (#20)

### Medium Priority
- Performance optimizations (#3, #4, #5)
- Core features (#9, #10, #11)
- Theme toggle (#7)

### Low Priority (Nice to Have)
- Advanced features (#14, #17, #19)
- PWA support (#15)
- i18n (#18)
- Analytics (#16)
- Animations (#13)

## 🔄 Issue Dependencies

Some issues have dependencies:

- **#16 (Analytics)** should be after #20 (Contributing guide) to ensure privacy policy exists
- **#14 (Achievements)** works well with #19 (Reading progress)
- **#13 (Animations)** should respect #8 (Accessibility - reduced motion)
- **#9 (Bookmarks)** enhances #19 (Reading progress)

## 📚 Additional Resources

- [WeCoded Repository](https://github.com/AndreaGriffiths11/we-coded)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

These issues were created to provide a roadmap for improving the WeCoded project. If you'd like to work on any of these:

1. Wait for the issue to be created on GitHub
2. Comment on the issue expressing your interest
3. Get assigned to the issue
4. Create a PR referencing the issue number

## 📞 Questions?

If you have questions about any of these issues:
- Open a discussion on GitHub
- Comment on the specific issue once created
- Reach out to the maintainers

---

**Note**: These are proposals. Maintainers may modify, merge, or decline any of these issues based on project priorities and direction.
