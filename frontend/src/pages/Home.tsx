import React, { useState, useEffect } from 'react';
import { getAllRecipes } from '../api';
import { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load recipes');
      } else {
        setError('Failed to load recipes');
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter((recipe) => {
    const query = searchQuery.toLowerCase();
    return (
      recipe.title?.toLowerCase().includes(query) ||
      recipe.cuisine?.toLowerCase().includes(query) ||
      recipe.ingredients?.some(ing => ing.name?.toLowerCase().includes(query)) ||
      false
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Discover Amazing Recipes
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create, share, and explore delicious recipes powered by AI.
          Turn your ingredients into culinary masterpieces!
        </p>
      </div>

      {/* Search Bar */}
      {!loading && !error && recipes.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes by title, cuisine, or ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-12 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={fetchRecipes}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            No recipes yet. Be the first to create one!
          </p>
          <a href="/create" className="btn-primary inline-block">
            Create Recipe
          </a>
        </div>
      ) : filteredRecipes.length === 0 && searchQuery ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            No recipes found matching "{searchQuery}". Try a different search term!
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="btn-secondary"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {searchQuery ? `Search Results (${filteredRecipes.length})` : `All Recipes (${recipes.length})`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
