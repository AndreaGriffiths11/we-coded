---
title: Add search and filter functionality for stories
labels: enhancement, feature, user-experience
---

## Description

Implement search bar and filters to help users find specific stories by title, author, or tags, improving content discoverability.

## Background

Currently, users can only navigate sequentially through stories using Previous/Next buttons. As the story collection grows, users need better ways to find relevant content quickly. Search and filtering would significantly improve the user experience.

## Requirements

### Search Functionality

1. **Search Bar**
   - Place in header or above story card
   - Search by: story title, author name, or content
   - Real-time filtering as user types
   - Clear/reset button
   - Keyboard shortcut: '/' to focus search

2. **Search Behavior**
   - Debounce input (300ms delay)
   - Case-insensitive matching
   - Highlight matching terms in results
   - Show result count: "Showing 5 of 20 stories"

### Filter Functionality

1. **Filter by Tags**
   - Show available tags from stories
   - Multi-select tag filter
   - Pills/chips UI for selected tags
   - Clear all filters button

2. **Filter by Author**
   - Dropdown or autocomplete for authors
   - Show only unique authors
   - Display author count

3. **Sort Options**
   - Most recent (default)
   - Oldest first
   - Most popular (if read count available)
   - Alphabetical by title

## UI Design

### Search Bar Component

```tsx
<div className={styles.searchSection}>
  <div className={styles.searchBar}>
    <input
      type="search"
      placeholder="Search stories, authors..."
      value={searchQuery}
      onChange={handleSearch}
      className={styles.searchInput}
      aria-label="Search stories"
    />
    <button 
      onClick={clearSearch}
      className={styles.clearButton}
      aria-label="Clear search"
    >
      ✕
    </button>
  </div>
  
  <div className={styles.filters}>
    <FilterTags tags={availableTags} selected={selectedTags} onChange={setSelectedTags} />
    <FilterAuthor authors={uniqueAuthors} selected={selectedAuthor} onChange={setSelectedAuthor} />
    <SortDropdown value={sortBy} onChange={setSortBy} />
  </div>
  
  <div className={styles.resultCount}>
    Showing {filteredStories.length} of {totalStories} stories
  </div>
</div>
```

### Filter Tags Component

```tsx
<div className={styles.tagFilters}>
  {availableTags.map(tag => (
    <button
      key={tag}
      className={`${styles.tagChip} ${selectedTags.includes(tag) ? styles.active : ''}`}
      onClick={() => toggleTag(tag)}
    >
      #{tag}
    </button>
  ))}
</div>
```

## Technical Implementation

### Search Hook: `hooks/useSearch.ts`

```typescript
export function useSearch(stories: DevArticle[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'alpha'>('newest');
  
  // Debounced search
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const filteredStories = useMemo(() => {
    let filtered = [...stories];
    
    // Search filter
    if (debouncedQuery) {
      filtered = filtered.filter(story => 
        story.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        story.user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        story.description?.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    
    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(story =>
        selectedTags.some(tag => story.tag_list.includes(tag))
      );
    }
    
    // Author filter
    if (selectedAuthor) {
      filtered = filtered.filter(story => 
        story.user.name === selectedAuthor
      );
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.published_timestamp).getTime() - new Date(a.published_timestamp).getTime();
        case 'oldest':
          return new Date(a.published_timestamp).getTime() - new Date(b.published_timestamp).getTime();
        case 'alpha':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [stories, debouncedQuery, selectedTags, selectedAuthor, sortBy]);
  
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    stories.forEach(story => {
      story.tag_list.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [stories]);
  
  const uniqueAuthors = useMemo(() => {
    const authors = new Set(stories.map(story => story.user.name));
    return Array.from(authors).sort();
  }, [stories]);
  
  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    selectedAuthor,
    setSelectedAuthor,
    sortBy,
    setSortBy,
    filteredStories,
    availableTags,
    uniqueAuthors,
  };
}
```

### Debounce Hook: `hooks/useDebounce.ts`

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}
```

### Update Page Component

```typescript
const { 
  searchQuery, 
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  filteredStories,
  availableTags,
  // ... other returned values
} = useSearch(stories);

// Use filteredStories instead of stories for display
```

## Features

### Advanced Features

1. **Search Highlighting**
   - Highlight matching text in results
   - Use `mark` element for semantics

2. **Search History**
   - Store recent searches in localStorage
   - Quick access to previous searches

3. **URL Parameters**
   - Reflect filters in URL query params
   - Allow sharing filtered views
   - Example: `?search=react&tags=javascript,webdev`

4. **Empty States**
   - No results found message
   - Suggestions for alternative searches
   - "Clear filters" prompt

## Acceptance Criteria

- [ ] Search bar added to UI
- [ ] Real-time search with 300ms debounce
- [ ] Tag filter with multi-select
- [ ] Author filter dropdown
- [ ] Sort options implemented
- [ ] Result count displayed
- [ ] Clear filters button works
- [ ] Keyboard shortcut '/' focuses search
- [ ] Empty state shown when no results
- [ ] Search works across title, author, description
- [ ] Filters can be combined (AND logic)
- [ ] Performance: handles 100+ stories smoothly
- [ ] Accessible (proper ARIA labels and keyboard nav)
- [ ] Mobile-responsive design

## Performance Considerations

- Use `useMemo` for filtered results
- Debounce search input to reduce re-renders
- Virtual scrolling if story list grows large
- Consider IndexedDB for large datasets

## Accessibility

- Search input has clear label
- Announce result count with aria-live
- Keyboard navigation through filters
- Clear focus indicators
- Screen reader announces filter changes

## Testing Checklist

- [ ] Search filters stories correctly
- [ ] Debounce prevents excessive filtering
- [ ] Tag filter works with multiple tags
- [ ] Author filter works correctly
- [ ] Sort changes order as expected
- [ ] Combining filters works (search + tags + author)
- [ ] Clear filters resets everything
- [ ] Empty state displays when no matches
- [ ] Keyboard shortcut focuses search
- [ ] Works with 1 story
- [ ] Works with 100+ stories
- [ ] Mobile UI is usable

## Related Files

- `app/page.tsx` - Add search UI and logic
- `components/SearchBar.tsx` - New search component (to create)
- `components/FilterTags.tsx` - New filter component (to create)
- `components/SearchBar.module.css` - Search styles (to create)
- `hooks/useSearch.ts` - New search hook (to create)
- `hooks/useDebounce.ts` - New debounce hook (to create)
- `types/index.ts` - Add search-related types

## Future Enhancements

- Full-text search using search index
- Fuzzy search for typos
- Search suggestions/autocomplete
- Save search filters
- Filter by date range
- Filter by reading time
