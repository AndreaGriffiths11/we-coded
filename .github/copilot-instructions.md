This is a Next.js 15 project that celebrates diversity in tech through an interactive gamelike experience. The project follows specific patterns and conventions that should be maintained in all contributions.

Tech Stack & Conventions
We use Next.js 15 with App Router and TypeScript. All new components should be written in TypeScript.

We use CSS modules for styling components. Global styles are in app/globals.css with CSS variables for theming.

React components should be functional components with hooks, not class components.

Use 'use client' directive only for components that need client-side interactivity.

We follow the principles of atomic design for our components: atoms, molecules, organisms, templates, and pages.

We use the Geist font family (imported from Google Fonts) for consistent typography.

Project Structure
API routes are in the app/api directory. The stories API endpoint fetches content from DEV.to with the #wecoded tag.

Components are in the components/ directory with a flat structure (no nested directories).

Types and interfaces are defined in types/index.ts and should be properly exported/imported.

Static assets are stored in the public/ directory.

Data Flow & State Management
We use React's built-in state management (useState, useContext) - no Redux or other state management libraries.

Story data follows the DevArticle interface defined in types/index.ts.

API calls should be made in page components or dedicated hooks, not directly in visual components.

Build & Deployment
The project is set up to deploy to GitHub Pages using the workflow in .github/workflows/nextjs.yml.

We use the static export option (next build && next export) for deployment.

Images are configured to be unoptimized in the next.config.mjs file for static export compatibility.

Accessibility & Performance
All components should be accessible and follow WCAG 2.1 AA standards.

We support high contrast mode, reduced motion preferences, and large text options through the AccessibilitySettings interface.

Image components should always include proper alt text and dimensions.

Game Mechanics
The main game interface uses StoryCard components to display content from DEV.to.

The MiniGame component is an optional interactive element that demonstrates diversity concepts.

The game tracks user progress through stories and displays stats about participation.

Testing
When writing tests, use Jest for unit tests and React Testing Library for component tests.

Documentation
Add JSDoc comments for functions, components, and complex logic.

Keep the README.md updated with any new features or dependencies.

When on agent mode I want you to explain you proposed changes before implementing anything, once I say implement it then change the files