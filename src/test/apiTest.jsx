import { GiphyFetch } from "@giphy/js-fetch-api";

// Initialize with your API key
const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_KEY);

// Test different API methods
export const testGiphyAPI = async () => {
  console.log("🔍 Testing Giphy API Methods...\n");

  try {
    // 1. Test Trending
    console.log("1️⃣ TRENDING:");
    const trending = await gf.trending({ limit: 3, type: "gifs" });
    console.log(`Found ${trending.data.length} trending GIFs`);
    console.log("First GIF:", trending.data[0]);
    console.log("\n");

    // 2. Test Search
    console.log("2️⃣ SEARCH:");
    const searchResults = await gf.search("cats", { 
      limit: 3,
      sort: "relevant" 
    });
    console.log(`Found ${searchResults.data.length} results for "cats"`);
    console.log("First result:", searchResults.data[0]);
    console.log("\n");

    // 3. Test Single GIF
    console.log("3️⃣ SINGLE GIF:");
    const gifId = trending.data[0].id; // Use ID from trending
    const singleGif = await gf.gif(gifId);
    console.log("GIF Details:", {
      id: singleGif.data.id,
      title: singleGif.data.title,
      url: singleGif.data.url,
      images: Object.keys(singleGif.data.images),
    });
    console.log("\n");

    // 4. Test Related GIFs
    console.log("4️⃣ RELATED GIFS:");
    const related = await gf.related(gifId, { limit: 3 });
    console.log(`Found ${related.data.length} related GIFs`);
    console.log("\n");

    // 5. Test Categories
    console.log("5️⃣ CATEGORIES:");
    const categories = await gf.categories();
    console.log(`Found ${categories.data.length} categories`);
    console.log("First 5 categories:", 
      categories.data.slice(0, 5).map(cat => cat.name)
    );
    console.log("\n");

    // 6. Test Multiple GIFs by IDs
    console.log("6️⃣ MULTIPLE GIFS BY IDS:");
    const ids = [trending.data[0].id, trending.data[1].id];
    const multipleGifs = await gf.gifs(ids);
    console.log(`Fetched ${multipleGifs.data.length} GIFs by IDs`);
    console.log("\n");

    console.log("✅ All tests completed!");

  } catch (error) {
    console.error("❌ Error testing API:", error);
  }
};

// Export individual test functions for specific testing
export const testTrending = async (options = {}) => {
  const result = await gf.trending({ limit: 10, ...options });
  console.log("Trending Results:", result);
  return result;
};

export const testSearch = async (query, options = {}) => {
  const result = await gf.search(query, { limit: 10, ...options });
  console.log(`Search Results for "${query}":`, result);
  return result;
};

export const testGif = async (id) => {
  const result = await gf.gif(id);
  console.log("GIF Details:", result);
  return result;
};

export const testRelated = async (id, options = {}) => {
  const result = await gf.related(id, { limit: 10, ...options });
  console.log("Related GIFs:", result);
  return result;
};

export const exploreGifObject = (gif) => {
  console.log("\n📦 GIF Object Structure:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  console.log("\n🆔 Basic Info:");
  console.log("  - id:", gif.id);
  console.log("  - type:", gif.type);
  console.log("  - slug:", gif.slug);
  console.log("  - title:", gif.title);
  console.log("  - url:", gif.url);
  
  console.log("\n🖼️  Images (available formats):");
  Object.keys(gif.images).forEach(format => {
    console.log(`  - ${format}:`, gif.images[format]);
  });
  
  console.log("\n👤 User Info:");
  if (gif.user) {
    console.log("  - display_name:", gif.user.display_name);
    console.log("  - username:", gif.user.username);
    console.log("  - avatar_url:", gif.user.avatar_url);
  } else {
    console.log("  - No user info available");
  }
  
  console.log("\n📊 Additional Data:");
  console.log("  - rating:", gif.rating);
  console.log("  - import_datetime:", gif.import_datetime);
  console.log("  - trending_datetime:", gif.trending_datetime);
  console.log("  - source:", gif.source);
  
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
};

// Quick reference guide
export const apiReference = {
  trending: "gf.trending({ limit, type, rating, offset })",
  search: "gf.search(query, { limit, type, sort, lang, offset })",
  gif: "gf.gif(id)",
  related: "gf.related(id, { limit, type })",
  gifs: "gf.gifs([id1, id2, ...]) or gf.gifs(category, subcategory)",
  categories: "gf.categories()",
};

console.log("📚 API Test Functions Available:");
console.log("  - testGiphyAPI()       - Run all tests");
console.log("  - testTrending()       - Test trending endpoint");
console.log("  - testSearch(query)    - Test search endpoint");
console.log("  - testGif(id)          - Test single GIF endpoint");
console.log("  - testRelated(id)      - Test related GIFs");
console.log("  - exploreGifObject(gif) - Explore GIF data structure");
console.log("  - apiReference         - Quick API reference");
