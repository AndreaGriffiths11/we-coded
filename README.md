# WeCoded Game

A gamified interactive experience celebrating diversity in tech through storytelling and engagement with real tech journey stories from the DEV.to community.

![WeCoded Game Banner](public/wecoded.svg)

## 🎮 Features

- **Interactive Story Cards**: Browse through authentic tech journey stories from diverse backgrounds
- **Mini-Game**: Engage with an interactive element demonstrating diversity concepts
- **Progress Tracking**: Track your journey through different stories and contributions
- **Accessibility First**: Full support for various accessibility needs including high contrast mode and reduced motion
- **Real-time Updates**: Fresh content pulled from DEV.to's #wecoded tag

## 🛠️ Tech Stack

- Next.js 15 with App Router
- TypeScript
- CSS Modules with CSS Variables
- Geist Font Family
- Jest & React Testing Library

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wecoded-game.git
cd wecoded-game
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game in action!

## 📖 Project Structure

```
app/              # Next.js app directory
├── api/          # API routes
├── globals.css   # Global styles
components/       # React components
hooks/            # Custom React hooks
public/          # Static assets
types/           # TypeScript definitions
```

## 🎨 Design System

- Follows atomic design principles
- Uses CSS variables for theming
- Supports light/dark modes
- Implements WCAG 2.1 AA standards

## ♿ Accessibility Features

- High contrast mode
- Reduced motion preferences
- Large text options
- Screen reader optimized
- Keyboard navigation support

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Additional commands:
```bash
# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

We use:
- Jest for unit testing
- React Testing Library for component testing
- Integration tests for game mechanics

## 📝 Development Guidelines

- Use TypeScript for all new components
- Follow atomic design principles
- Add JSDoc comments for functions and components
- Ensure accessibility compliance
- Test new features thoroughly

## 🚀 Deployment

The game is automatically deployed to GitHub Pages on main branch updates. The deployment workflow is handled by GitHub Actions.

To build for production:
```bash
npm run build
```

## 🤝 Contributing

We have 20 pre-written improvement issues ready to be created! See [ISSUE_CREATION_GUIDE.md](./ISSUE_CREATION_GUIDE.md) for how to create them.

**Quick Start for Maintainers:**
1. Go to the [Actions tab](../../actions)
2. Run the "Create GitHub Issues from Templates" workflow
3. Type `create` to confirm

After issues are created:
1. Pick an issue that matches your skills
2. Comment to express interest
3. Fork the repository
4. Create your feature branch
5. Follow our development guidelines
6. Ensure tests pass
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ for the WeCoded Challenge 2025
