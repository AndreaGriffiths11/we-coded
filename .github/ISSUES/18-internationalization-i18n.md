---
title: Add internationalization (i18n) support
labels: enhancement, i18n, accessibility, global
---

## Description

Implement internationalization to support multiple languages, making the application accessible to the global tech community and aligning with WeCoded's diversity mission.

## Background

Currently, all text is hardcoded in English, limiting accessibility for non-English speakers in the global tech community. Since WeCoded celebrates diversity in tech, supporting multiple languages would significantly expand its reach and impact.

## Requirements

### Core i18n Features

1. **Language Support** (Initial)
   - English (en) - default
   - Spanish (es) - large Spanish-speaking tech community
   - Portuguese (pt) - Brazilian tech community
   - French (fr) - growing tech community

2. **Translation Coverage**
   - UI labels and buttons
   - Instructions and help text
   - Error messages
   - Achievements and notifications
   - Meta tags (title, description)

3. **Language Selection**
   - Language picker in header/settings
   - Persist user preference
   - Auto-detect browser language
   - Flag icons for visual identification

4. **RTL Support** (for future Arabic/Hebrew)
   - Layout adjustments for RTL languages
   - Flip icons and navigation
   - Mirror animations

### What to Translate

**DO translate:**
- UI text, buttons, labels
- Instructions and help
- Error messages
- Achievements
- Form labels
- Notifications

**DON'T translate:**
- Story content (fetched from DEV.to API)
- Author names
- Code examples
- URLs

## Technical Implementation

### Option 1: next-intl (Recommended for Next.js)

Install:
```bash
npm install next-intl
```

Create locale files:

`messages/en.json`:
```json
{
  "header": {
    "title": "WeCoded Game",
    "score": "Score: {score}"
  },
  "navigation": {
    "previous": "Previous",
    "next": "Next",
    "miniGame": "Mini Game",
    "howToPlay": "How to Play"
  },
  "storyCard": {
    "xp": "+{amount} XP",
    "level": "Level {current}/{total}",
    "readMore": "Read full article"
  },
  "howToPlay": {
    "title": "How to Play",
    "readStories": "Read Stories",
    "playGame": "Play Mini Game",
    "trackProgress": "Track Progress",
    "instruction1": "Browse through inspiring tech stories",
    "instruction2": "Use arrow keys to navigate"
  },
  "miniGame": {
    "title": "Mini Game",
    "start": "Start Game",
    "score": "Score: {score}",
    "gameOver": "Game Over!",
    "instructions": "Use arrow keys to move and dodge obstacles"
  },
  "loading": {
    "stories": "Loading stories...",
    "please_wait": "Please wait"
  },
  "errors": {
    "failed_to_load": "Failed to load stories",
    "try_again": "Try again",
    "network_error": "Network error. Please check your connection."
  }
}
```

`messages/es.json`:
```json
{
  "header": {
    "title": "Juego WeCoded",
    "score": "Puntuación: {score}"
  },
  "navigation": {
    "previous": "Anterior",
    "next": "Siguiente",
    "miniGame": "Mini Juego",
    "howToPlay": "Cómo Jugar"
  },
  "storyCard": {
    "xp": "+{amount} XP",
    "level": "Nivel {current}/{total}",
    "readMore": "Leer artículo completo"
  },
  "howToPlay": {
    "title": "Cómo Jugar",
    "readStories": "Leer Historias",
    "playGame": "Jugar Mini Juego",
    "trackProgress": "Seguir Progreso",
    "instruction1": "Navega por historias tecnológicas inspiradoras",
    "instruction2": "Usa las teclas de flecha para navegar"
  },
  "miniGame": {
    "title": "Mini Juego",
    "start": "Iniciar Juego",
    "score": "Puntuación: {score}",
    "gameOver": "¡Juego Terminado!",
    "instructions": "Usa las teclas de flecha para moverte y esquivar obstáculos"
  },
  "loading": {
    "stories": "Cargando historias...",
    "please_wait": "Por favor espera"
  },
  "errors": {
    "failed_to_load": "Error al cargar historias",
    "try_again": "Intentar de nuevo",
    "network_error": "Error de red. Por favor verifica tu conexión."
  }
}
```

### Configuration

Create `i18n.ts`:
```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'es', 'pt', 'fr'] as const;
export type Locale = typeof locales[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

Update `next.config.mjs`:
```javascript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  // ... existing config
});
```

### App Structure

Create locale-based routing:
```
app/
  [locale]/
    layout.tsx
    page.tsx
    ...
```

Update `app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Using Translations

In components:
```tsx
'use client';

import { useTranslations } from 'next-intl';

export const GameHeader: React.FC = ({ score }) => {
  const t = useTranslations('header');
  
  return (
    <header>
      <h1>{t('title')}</h1>
      <div>{t('score', { score })}</div>
    </header>
  );
};
```

### Language Switcher Component

Create `components/LanguageSwitcher.tsx`:
```tsx
'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Español', flag: '🇪🇸' },
  pt: { name: 'Português', flag: '🇧🇷' },
  fr: { name: 'Français', flag: '🇫🇷' },
};

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const changeLanguage = (newLocale: string) => {
    // Remove current locale from path
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    // Add new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    // Save preference
    localStorage.setItem('preferred_locale', newLocale);
  };
  
  return (
    <div className={styles.languageSwitcher}>
      <button className={styles.currentLanguage}>
        {languages[locale].flag} {languages[locale].name}
      </button>
      <div className={styles.languageMenu}>
        {Object.entries(languages).map(([code, lang]) => (
          <button
            key={code}
            onClick={() => changeLanguage(code)}
            className={code === locale ? styles.active : ''}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};
```

### Auto-detect Browser Language

In `middleware.ts`:
```typescript
import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localeDetection: true,
});

export const config = {
  matcher: ['/', '/(en|es|pt|fr)/:path*']
};
```

## RTL Support

For future RTL languages (Arabic, Hebrew):

```css
[dir="rtl"] {
  direction: rtl;
}

[dir="rtl"] .navigation {
  flex-direction: row-reverse;
}

[dir="rtl"] .icon {
  transform: scaleX(-1);
}
```

In layout:
```tsx
<html lang={locale} dir={locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr'}>
```

## Date/Time Formatting

Use Intl API for dates:
```tsx
const formatDate = (date: string) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};
```

## Number Formatting

```tsx
const formatNumber = (num: number) => {
  return new Intl.NumberFormat(locale).format(num);
};
```

## Acceptance Criteria

- [ ] next-intl installed and configured
- [ ] 4 languages supported (en, es, pt, fr)
- [ ] All UI text extracted to translation files
- [ ] Language switcher component added
- [ ] Language preference persists
- [ ] Auto-detect browser language
- [ ] Translations complete for all languages
- [ ] Date/number formatting respects locale
- [ ] URLs include locale prefix
- [ ] Meta tags translated
- [ ] Works on all pages
- [ ] Mobile-responsive language switcher
- [ ] Fallback to English for missing translations

## Translation Process

1. **Extract all strings** to en.json
2. **Use translation service** (DeepL, Google Translate as starting point)
3. **Native speaker review** for accuracy and cultural appropriateness
4. **Test with each language**
5. **Handle pluralization** properly
6. **Context-aware translations** where needed

### Translation Tools

- [DeepL](https://www.deepl.com/) - High-quality translations
- [Google Translate](https://translate.google.com/)
- [Crowdin](https://crowdin.com/) - Translation management platform
- [POEditor](https://poeditor.com/) - Collaborative translation

## Testing Checklist

- [ ] All text displays correctly in each language
- [ ] Language switcher works
- [ ] Language preference persists
- [ ] URLs include correct locale
- [ ] Dates formatted correctly
- [ ] Numbers formatted correctly
- [ ] No hardcoded strings remain
- [ ] Fallback to English works
- [ ] Long text doesn't break layout
- [ ] Special characters display correctly
- [ ] Works on mobile

## Pluralization

Handle plural forms correctly:
```json
{
  "stories": {
    "count": "{count, plural, =0 {No stories} =1 {1 story} other {# stories}}"
  }
}
```

Usage:
```tsx
t('stories.count', { count: storyCount })
```

## Related Files

- `messages/en.json` - English translations (to create)
- `messages/es.json` - Spanish translations (to create)
- `messages/pt.json` - Portuguese translations (to create)
- `messages/fr.json` - French translations (to create)
- `i18n.ts` - i18n configuration (to create)
- `middleware.ts` - Locale detection (to create)
- `components/LanguageSwitcher.tsx` - Language selector (to create)
- `app/[locale]/layout.tsx` - Update layout structure
- All component files - Replace hardcoded strings with `t()` calls

## Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [CLDR Plural Rules](https://cldr.unicode.org/index/cldr-spec/plural-rules)
- [Internationalization Best Practices](https://phrase.com/blog/posts/i18n-best-practices/)
- [RTL Layout Guide](https://rtlstyling.com/)

## Future Languages

Consider adding:
- German (de)
- Japanese (ja)
- Chinese (zh)
- Arabic (ar) - requires RTL support
- Russian (ru)
- Hindi (hi)

## Future Enhancements

- Crowdsourced translations
- Translation management platform
- Automatic story translation (optional)
- Regional variants (pt-BR vs pt-PT)
- Locale-specific content
