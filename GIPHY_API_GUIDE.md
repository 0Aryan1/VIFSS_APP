# 📚 Complete Giphy API Study Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [API Key Setup](#api-key-setup)
3. [Core Concepts](#core-concepts)
4. [API Methods Reference](#api-methods-reference)
5. [Response Structure](#response-structure)
6. [Practical Examples](#practical-examples)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Testing & Debugging](#testing--debugging)

---

## Getting Started

### Official Resources
- **Main Site**: https://giphy.com
- **Developers Portal**: https://developers.giphy.com/
- **API Docs**: https://developers.giphy.com/docs/api/
- **JavaScript SDK**: https://github.com/Giphy/giphy-js
- **Fetch API Package**: https://github.com/Giphy/giphy-js/tree/master/packages/fetch-api

### Prerequisites
- Basic JavaScript/React knowledge
- Understanding of async/await
- Familiarity with REST APIs

---

## API Key Setup

### 1. Get Your API Key
1. Visit https://developers.giphy.com/dashboard/
2. Sign up or log in
3. Create an app
4. Copy your API key

### 2. Store in Environment Variables
```bash
# .env file
VITE_GIPHY_KEY=your_api_key_here
```

### 3. Initialize in Your App
```javascript
import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_KEY);
```

---

## Core Concepts

### 1. GIF Object Structure
Every GIF returned has this structure:
```javascript
{
  id: "abc123xyz",              // Unique identifier
  type: "gif",                  // "gif" or "sticker"
  slug: "funny-cat-abc123xyz",  // URL-friendly string
  title: "Funny Cat GIF",       // Title/description
  url: "https://giphy.com/...", // Giphy page URL
  
  images: {
    original: { url, width, height, size },
    fixed_width: { url, width, height },
    fixed_height: { url, width, height },
    downsized: { url, width, height },
    // ... many more formats
  },
  
  user: {
    username: "catgifs",
    display_name: "Cat GIFs",
    avatar_url: "https://...",
    description: "I post cat GIFs"
  },
  
  rating: "g",              // "g", "pg", "pg-13", "r"
  source: "http://...",     // Original source URL
  import_datetime: "...",
  trending_datetime: "..."
}
```

### 2. Response Structure
All API calls return:
```javascript
{
  data: [...],           // Array of GIFs (or single GIF object)
  pagination: {
    total_count: 1000,
    count: 20,
    offset: 0
  },
  meta: {
    status: 200,
    msg: "OK",
    response_id: "..."
  }
}
```

### 3. Common Parameters
- **limit**: Number of results (default: 25, max: 50)
- **offset**: For pagination (skip first N results)
- **type**: "gifs", "stickers", or "text"
- **rating**: "g", "pg", "pg-13", "r"
- **lang**: Language code (e.g., "en")

---

## API Methods Reference

### 1. gf.trending(options)
**Purpose**: Get trending GIFs/stickers

**Parameters**:
```javascript
{
  limit: 25,        // Number of results (max 50)
  offset: 0,        // Pagination offset
  type: "gifs",     // "gifs", "stickers"
  rating: "g"       // Content rating
}
```

**Example**:
```javascript
const { data } = await gf.trending({
  limit: 20,
  type: "gifs",
  rating: "pg"
});
// data is an array of GIF objects
```

**Use Cases**:
- Homepage trending section
- Discover new content
- Default content when no search

---

### 2. gf.search(query, options)
**Purpose**: Search for GIFs by keyword

**Parameters**:
```javascript
query,            // Search string
{
  limit: 25,      // Number of results
  offset: 0,      // Pagination
  type: "gifs",   // "gifs", "stickers", "text"
  sort: "relevant", // "relevant" or "recent"
  lang: "en"      // Language
}
```

**Example**:
```javascript
const { data } = await gf.search("funny cats", {
  limit: 10,
  sort: "relevant",
  type: "gifs"
});
```

**Use Cases**:
- User search functionality
- Keyword-based discovery
- Autocomplete suggestions

---

### 3. gf.gif(id)
**Purpose**: Get a single GIF by its ID

**Parameters**:
```javascript
id  // GIF ID string
```

**Example**:
```javascript
const { data } = await gf.gif("abc123xyz");
// data is a single GIF object (not an array)
```

**Use Cases**:
- GIF detail page
- Fetching specific GIF info
- Loading from saved IDs

**Note**: Returns a single object, not an array!

---

### 4. gf.related(id, options)
**Purpose**: Get GIFs similar to a specific GIF

**Parameters**:
```javascript
id,               // Source GIF ID
{
  limit: 25,      // Number of results
  type: "gifs"    // Filter by type
}
```

**Example**:
```javascript
const { data } = await gf.related("abc123xyz", {
  limit: 10,
  type: "gifs"
});
```

**Use Cases**:
- "Related GIFs" section
- Recommendations
- "More like this"

---

### 5. gf.gifs(ids)
**Purpose**: Get multiple GIFs by their IDs

**Parameters**:
```javascript
[id1, id2, id3, ...]  // Array of GIF IDs
// OR
(category, subcategory)  // For category GIFs
```

**Example 1 - By IDs**:
```javascript
const ids = ["abc123", "xyz789", "def456"];
const { data } = await gf.gifs(ids);
// Returns array of GIF objects in same order
```

**Example 2 - By Category**:
```javascript
const { data } = await gf.gifs("reactions", "reactions");
```

**Use Cases**:
- Favorites page (multiple saved IDs)
- Batch loading
- Category pages

---

### 6. gf.categories()
**Purpose**: Get all available GIF categories

**Parameters**: None

**Example**:
```javascript
const { data } = await gf.categories();
// data is array of category objects
```

**Category Object Structure**:
```javascript
{
  name: "Reactions",
  name_encoded: "reactions",
  gif: { ... }  // Sample GIF from category
}
```

**Use Cases**:
- Navigation menu
- Browse by category
- Category picker

---

## Practical Examples

### Example 1: Build a Search Feature
```javascript
import { useState } from 'react';
import { GifState } from './context/GifContext';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { gf } = GifState();
  
  const handleSearch = async () => {
    const { data } = await gf.search(query, {
      limit: 20,
      sort: 'relevant'
    });
    setResults(data);
  };
  
  return (
    <>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {results.map(gif => (
          <img key={gif.id} src={gif.images.fixed_width.url} />
        ))}
      </div>
    </>
  );
}
```

### Example 2: Load Favorites
```javascript
const loadFavorites = async () => {
  // Get IDs from localStorage
  const favoriteIds = JSON.parse(localStorage.getItem('favorites')) || [];
  
  if (favoriteIds.length > 0) {
    const { data } = await gf.gifs(favoriteIds);
    setFavoriteGifs(data);
  }
};
```

### Example 3: Pagination
```javascript
const [offset, setOffset] = useState(0);
const [gifs, setGifs] = useState([]);

const loadMore = async () => {
  const { data } = await gf.trending({
    limit: 20,
    offset: offset
  });
  
  setGifs([...gifs, ...data]);
  setOffset(offset + 20);
};
```

---

## Best Practices

### 1. Rate Limiting
- Free tier: 42 requests per hour, 1000 per day
- Implement caching to reduce API calls
- Use pagination wisely

### 2. Performance Optimization
```javascript
// ❌ Bad: Multiple API calls
const gif1 = await gf.gif("id1");
const gif2 = await gf.gif("id2");
const gif3 = await gf.gif("id3");

// ✅ Good: Single batch call
const gifs = await gf.gifs(["id1", "id2", "id3"]);
```

### 3. Error Handling
```javascript
try {
  const { data } = await gf.search(query);
  setResults(data);
} catch (error) {
  console.error("API Error:", error);
  setError("Failed to load GIFs. Please try again.");
}
```

### 4. Use Appropriate Image Sizes
```javascript
// Choose based on use case:
gif.images.original.url        // Highest quality (large file)
gif.images.fixed_width.url     // Good for grids
gif.images.downsized.url       // Smaller file size
gif.images.preview_gif.url     // Very small preview
```

---

## Common Patterns

### Pattern 1: Search with Filters
```javascript
const [filter, setFilter] = useState('gifs');

const search = async (query) => {
  const { data } = await gf.search(query, {
    type: filter,  // User-controlled filter
    limit: 20
  });
  return data;
};
```

### Pattern 2: Infinite Scroll
```javascript
const [gifs, setGifs] = useState([]);
const [offset, setOffset] = useState(0);
const [hasMore, setHasMore] = useState(true);

const loadMore = async () => {
  const { data, pagination } = await gf.trending({
    limit: 20,
    offset
  });
  
  setGifs([...gifs, ...data]);
  setOffset(offset + 20);
  setHasMore(offset + 20 < pagination.total_count);
};
```

### Pattern 3: Context-Based API
```javascript
// Share gf instance via context (as in your project)
const GifContext = createContext();

export const GifProvider = ({ children }) => {
  const gf = useMemo(
    () => new GiphyFetch(import.meta.env.VITE_GIPHY_KEY),
    []
  );
  
  return (
    <GifContext.Provider value={{ gf }}>
      {children}
    </GifContext.Provider>
  );
};
```

---

## Testing & Debugging

### 1. Test in Browser Console
Open your app's console and try:
```javascript
// Access via window (if exposed) or use React DevTools
const result = await gf.search("test", { limit: 3 });
console.log(result);
```

### 2. Check Response Structure
```javascript
const { data, pagination, meta } = await gf.trending({ limit: 1 });
console.log("Data:", data);
console.log("Pagination:", pagination);
console.log("Meta:", meta);
```

### 3. Use the Test Page
Add this route to your App.jsx:
```javascript
{
  path: "/api-test",
  element: <ApiTest />,
}
```

### 4. Common Issues

**Issue**: "No results found"
- Check API key validity
- Verify network connection
- Check rate limits

**Issue**: Images not loading
- Check CORS settings
- Verify image URL format
- Use appropriate image size

**Issue**: Slow performance
- Reduce limit parameter
- Use smaller image formats
- Implement caching

---

## Quick Reference Cheat Sheet

| Method | Purpose | Returns |
|--------|---------|---------|
| `gf.trending()` | Get trending GIFs | Array |
| `gf.search(query)` | Search GIFs | Array |
| `gf.gif(id)` | Get single GIF | Object |
| `gf.related(id)` | Get similar GIFs | Array |
| `gf.gifs(ids)` | Get multiple GIFs | Array |
| `gf.categories()` | Get all categories | Array |

---

## Learning Path

### Phase 1: Basics (Week 1)
1. ✅ Set up API key
2. ✅ Make first API call (trending)
3. ✅ Display GIFs in UI
4. ✅ Understand response structure

### Phase 2: Features (Week 2)
1. ✅ Implement search
2. ✅ Add pagination
3. ✅ Create favorites system
4. ✅ Handle errors gracefully

### Phase 3: Advanced (Week 3)
1. ✅ Optimize performance
2. ✅ Add caching
3. ✅ Implement filters
4. ✅ Add advanced features

---

## Additional Resources

- **API Explorer**: Test endpoints interactively at https://developers.giphy.com/explorer
- **Code Examples**: https://github.com/Giphy/giphy-js/tree/master/packages/fetch-api/README.md
- **Community**: Giphy Developers Discord/Forums
- **Status Page**: Check API status at https://status.giphy.com/

---

## Next Steps

1. **Run the test page** you just created (`/api-test` route)
2. **Experiment** with different parameters
3. **Read the official docs** for advanced features
4. **Build small projects** to practice
5. **Check your project's usage** in the Giphy dashboard

Happy coding! 🎉
