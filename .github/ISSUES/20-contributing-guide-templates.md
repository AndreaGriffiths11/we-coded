---
title: Create contributing guide and issue templates
labels: documentation, community, good-first-issue
---

## Description

Add comprehensive CONTRIBUTING.md and GitHub issue/PR templates to lower the barrier for community contributions and maintain code quality.

## Background

Currently, the README mentions contributing but lacks detailed guidelines. As the project grows and attracts contributors, clear documentation and templates will help maintain consistency, quality, and make it easier for newcomers to contribute effectively.

## Requirements

### 1. CONTRIBUTING.md

Create a comprehensive contributing guide covering:

#### Getting Started
- Prerequisites (Node.js version, etc.)
- Fork and clone instructions
- Installation steps
- Running the development server
- Building the project

#### Development Workflow
- Branch naming conventions
- Commit message format
- Code style guidelines
- Testing requirements
- Linting and formatting

#### Making Changes
- Finding issues to work on
- Creating feature branches
- Writing tests
- Updating documentation
- Running tests locally

#### Submitting Changes
- Creating pull requests
- PR description requirements
- Review process
- Merge criteria
- What to do if PR is rejected

#### Code Standards
- TypeScript usage
- Component structure
- CSS modules patterns
- Accessibility requirements
- Performance considerations

### 2. Issue Templates

Create templates for common issue types:

#### Bug Report Template
- Bug description
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots
- Environment (browser, OS, version)
- Additional context

#### Feature Request Template
- Feature description
- Use case / motivation
- Proposed solution
- Alternatives considered
- Additional context

#### Documentation Issue Template
- What needs documenting
- Current state
- Desired state
- Related files

### 3. Pull Request Template

Create PR template with:
- Description of changes
- Related issue number
- Type of change (bug fix, feature, docs, etc.)
- Checklist (tests, docs, linting)
- Screenshots (for UI changes)
- Breaking changes notice

### 4. CODE_OF_CONDUCT.md

Add code of conduct covering:
- Our pledge
- Our standards
- Enforcement responsibilities
- Scope
- Enforcement
- Attribution

## Implementation

### CONTRIBUTING.md

Create `.github/CONTRIBUTING.md`:
```markdown
# Contributing to WeCoded Game

Thank you for your interest in contributing to WeCoded! This document provides guidelines and instructions for contributing.

## 🚀 Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/we-coded.git
   cd we-coded
   \`\`\`

3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

4. Create a branch:
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

5. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use functional components with hooks
- Use CSS modules for styling
- Add JSDoc comments for functions and components

### Component Guidelines

- Place components in `components/` directory
- One component per file
- Create corresponding `.module.css` file for styles
- Export as default or named export
- Add proper TypeScript types

Example:
\`\`\`tsx
'use client';

import React from 'react';
import styles from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

/**
 * MyComponent does something specific
 */
export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  );
};
\`\`\`

### Commit Messages

Follow conventional commits format:

- `feat: add new feature`
- `fix: fix bug in component`
- `docs: update README`
- `style: format code`
- `refactor: restructure component`
- `test: add tests`
- `chore: update dependencies`

### Testing

- Write tests for new features
- Ensure existing tests pass: `npm test`
- Add E2E tests for user flows
- Test accessibility with keyboard and screen reader

### Accessibility

All contributions must meet WCAG 2.1 AA standards:

- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast
- Screen reader compatibility
- Respect `prefers-reduced-motion`

### Linting

Run linting before committing:
\`\`\`bash
npm run lint
\`\`\`

## 🔄 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Run tests** and linting locally
4. **Create PR** with clear description
5. **Link related issue** using "Closes #123"
6. **Respond to review** feedback
7. **Squash commits** if requested

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Accessibility verified
- [ ] UI changes include screenshots

## 🎯 Finding Issues

Look for issues labeled:
- `good-first-issue` - Great for newcomers
- `help-wanted` - Community help needed
- `enhancement` - New features
- `bug` - Bug fixes

## 🤝 Community

- Be respectful and inclusive
- Help others learn
- Follow the Code of Conduct
- Ask questions in issues/discussions

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## ❓ Questions

If you have questions:
- Check existing issues
- Create a new issue with "question" label
- Join our discussions

Thank you for contributing to WeCoded! 🎉
```

### Bug Report Template

Create `.github/ISSUE_TEMPLATE/bug_report.md`:
```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
A clear and concise description of what the bug is.

## Steps To Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
What actually happened.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- Browser: [e.g. Chrome 120, Safari 17]
- OS: [e.g. Windows 11, macOS 14, iOS 17]
- Device: [e.g. Desktop, iPhone 15]
- Screen size: [e.g. 1920x1080, mobile]

## Additional Context
Add any other context about the problem here.

## Possible Solution
If you have ideas on how to fix this, please share.
```

### Feature Request Template

Create `.github/ISSUE_TEMPLATE/feature_request.md`:
```markdown
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Description
A clear and concise description of the feature you'd like to see.

## Problem/Motivation
What problem does this solve? Why is this feature needed?

## Proposed Solution
Describe how you envision this feature working.

## Alternatives Considered
Describe any alternative solutions or features you've considered.

## Additional Context
Add any other context, screenshots, or mockups about the feature here.

## Would you like to implement this?
- [ ] Yes, I'd like to implement this feature
- [ ] No, but I can help with testing/review
- [ ] No, just suggesting
```

### Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:
```markdown
## Description
<!-- Describe your changes in detail -->

## Related Issue
<!-- Link to the issue this PR addresses -->
Closes #

## Type of Change
<!-- Mark the relevant option with an "x" -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI update
- [ ] ♿ Accessibility improvement
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update

## Checklist
<!-- Mark completed items with an "x" -->
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have checked my code for accessibility issues
- [ ] I have tested on multiple browsers (if applicable)

## Screenshots
<!-- If applicable, add screenshots to demonstrate the changes -->

### Before
<!-- Screenshot or description of the before state -->

### After
<!-- Screenshot or description of the after state -->

## Testing
<!-- Describe the tests you ran to verify your changes -->
- [ ] Tested locally
- [ ] Tested on mobile
- [ ] Tested with keyboard navigation
- [ ] Tested with screen reader

## Additional Notes
<!-- Any additional information that reviewers should know -->
```

### Code of Conduct

Create `.github/CODE_OF_CONDUCT.md`:
```markdown
# Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.

## Our Standards

Examples of behavior that contributes to a positive environment:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior:

* The use of sexualized language or imagery
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information without explicit permission
* Other conduct which could reasonably be considered inappropriate

## Enforcement Responsibilities

Community leaders are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful.

## Scope

This Code of Conduct applies within all community spaces, and also applies when an individual is officially representing the community in public spaces.

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported to the community leaders responsible for enforcement. All complaints will be reviewed and investigated promptly and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant](https://www.contributor-covenant.org/), version 2.0.
```

## Acceptance Criteria

- [ ] CONTRIBUTING.md created with comprehensive guidelines
- [ ] Bug report issue template created
- [ ] Feature request issue template created
- [ ] Documentation issue template created
- [ ] Pull request template created
- [ ] CODE_OF_CONDUCT.md created
- [ ] Templates use GitHub issue template format
- [ ] Templates include all necessary fields
- [ ] README links to CONTRIBUTING.md
- [ ] Templates are easy to understand
- [ ] Examples provided where helpful

## Testing Checklist

- [ ] Create test issue using each template
- [ ] Verify all template fields render correctly
- [ ] Create test PR to verify template
- [ ] Links in CONTRIBUTING.md work
- [ ] Instructions are clear and followable
- [ ] Code examples are correct
- [ ] No broken links

## Related Files

- `.github/CONTRIBUTING.md` (to create)
- `.github/CODE_OF_CONDUCT.md` (to create)
- `.github/ISSUE_TEMPLATE/bug_report.md` (to create)
- `.github/ISSUE_TEMPLATE/feature_request.md` (to create)
- `.github/ISSUE_TEMPLATE/documentation.md` (to create)
- `.github/PULL_REQUEST_TEMPLATE.md` (to create)
- `README.md` - Add link to CONTRIBUTING.md

## Resources

- [GitHub Issue Templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- [Contributor Covenant](https://www.contributor-covenant.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Future Enhancements

- GitHub Discussions setup
- Contributor recognition system
- Automated PR checks
- Welcome bot for first-time contributors
- Contributor guide video
