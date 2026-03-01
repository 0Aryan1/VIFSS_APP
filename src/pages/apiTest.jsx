import React, { useState } from 'react';
import { GifState } from '../context/GifContext';

const ApiTest = () => {
  const { gf } = GifState();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('cats');
  const [gifId, setGifId] = useState('');

  const runTest = async (testName, apiCall) => {
    setLoading(true);
    try {
      const data = await apiCall();
      setResult({ testName, data, success: true });
      console.log(`✅ ${testName}:`, data);
    } catch (error) {
      setResult({ testName, error: error.message, success: false });
      console.error(`❌ ${testName} Error:`, error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 Giphy API Testing Lab</h1>
      
      <div className="space-y-4">
        {/* Trending Test */}
        <div className="border border-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">1️⃣ Test Trending</h2>
          <p className="text-gray-400 text-sm mb-3">
            Fetch trending GIFs with options
          </p>
          <button
            onClick={() => runTest('Trending', () => 
              gf.trending({ limit: 5, type: 'gifs', rating: 'g' })
            )}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Run Trending Test
          </button>
        </div>

        {/* Search Test */}
        <div className="border border-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">2️⃣ Test Search</h2>
          <p className="text-gray-400 text-sm mb-3">
            Search GIFs by query
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search query"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            />
            <button
              onClick={() => runTest('Search', () => 
                gf.search(searchQuery, { limit: 5, sort: 'relevant' })
              )}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Search
            </button>
          </div>
        </div>

        {/* Single GIF Test */}
        <div className="border border-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">3️⃣ Test Single GIF</h2>
          <p className="text-gray-400 text-sm mb-3">
            Fetch a single GIF by ID
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={gifId}
              onChange={(e) => setGifId(e.target.value)}
              placeholder="Enter GIF ID (or use trending first)"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
            />
            <button
              onClick={() => runTest('Single GIF', () => gf.gif(gifId))}
              disabled={!gifId}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get GIF
            </button>
          </div>
        </div>

        {/* Related GIFs Test */}
        <div className="border border-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">4️⃣ Test Related GIFs</h2>
          <p className="text-gray-400 text-sm mb-3">
            Get related GIFs for a specific GIF ID
          </p>
          <button
            onClick={() => runTest('Related GIFs', () => 
              gf.related(gifId, { limit: 5, type: 'gifs' })
            )}
            disabled={!gifId}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Get Related
          </button>
        </div>

        {/* Categories Test */}
        <div className="border border-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">5️⃣ Test Categories</h2>
          <p className="text-gray-400 text-sm mb-3">
            Fetch all available categories
          </p>
          <button
            onClick={() => runTest('Categories', () => gf.categories())}
            className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded"
          >
            Get Categories
          </button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-6 p-4 bg-blue-900 rounded-lg">
          <p className="text-center">⏳ Loading...</p>
        </div>
      )}

      {/* Results Display */}
      {result && !loading && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">
            {result.success ? '✅' : '❌'} {result.testName} Results
          </h2>
          
          {result.success ? (
            <div className="bg-gray-800 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm text-green-400">
                {JSON.stringify(result.data, null, 2)}
              </pre>
              
              {/* Quick Info */}
              {result.data?.data && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className="font-bold mb-2">Quick Info:</h3>
                  <ul className="space-y-1 text-sm">
                    <li>📊 Results Count: {result.data.data.length || 1}</li>
                    {result.data.data[0] && (
                      <>
                        <li>🆔 First ID: {result.data.data[0].id}</li>
                        <li>📝 First Title: {result.data.data[0].title}</li>
                        <li>🔗 First URL: {result.data.data[0].url}</li>
                      </>
                    )}
                    {result.data.pagination && (
                      <li>📄 Total Count: {result.data.pagination.total_count}</li>
                    )}
                  </ul>
                  
                  {/* Auto-fill GIF ID for next tests */}
                  {result.data.data[0]?.id && (
                    <button
                      onClick={() => setGifId(result.data.data[0].id)}
                      className="mt-3 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-sm"
                    >
                      Use this ID for other tests
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-900 rounded-lg p-4">
              <p className="text-red-200">Error: {result.error}</p>
            </div>
          )}
        </div>
      )}

      {/* API Reference */}
      <div className="mt-8 bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">📚 API Reference</h2>
        <div className="space-y-2 text-sm font-mono">
          <div><span className="text-blue-400">gf.trending</span>({`{ limit, type, rating, offset }`})</div>
          <div><span className="text-green-400">gf.search</span>(query, {`{ limit, type, sort, lang, offset }`})</div>
          <div><span className="text-purple-400">gf.gif</span>(id)</div>
          <div><span className="text-yellow-400">gf.related</span>(id, {`{ limit, type }`})</div>
          <div><span className="text-pink-400">gf.gifs</span>([id1, id2, ...])</div>
          <div><span className="text-red-400">gf.categories</span>()</div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
