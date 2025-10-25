import React, { useState, useEffect } from 'react';
import { getAllRecipes } from '../api';
import { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';
import Icon3D from '../components/Icon3D';

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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Discover Amazing Recipes
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
              className="w-full px-6 py-4 pl-14 text-lg bg-gray-800 border border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-lg text-white placeholder-gray-400"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Icon3D type="search" className="w-6 h-6" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                <Icon3D type="close" className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-white mt-2 text-center">
              Found {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
        </div>
      ) : error ? (
        <div className="card p-8 text-center">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={fetchRecipes}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      ) : recipes.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-white text-lg mb-4">
            No recipes yet. Be the first to create one!
          </p>
          <a href="/create" className="btn-primary inline-block">
            Create Recipe
          </a>
        </div>
      ) : filteredRecipes.length === 0 && searchQuery ? (
        <div className="card p-12 text-center">
          <p className="text-white text-lg mb-4">
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
          <h2 className="text-2xl font-bold text-white mb-6">
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
