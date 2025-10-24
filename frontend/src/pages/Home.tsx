import React, { useState, useEffect } from 'react';
import { getAllRecipes } from '../api';
import { Recipe } from '../types';
import RecipeCard from '../components/RecipeCard';

const Home: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            All Recipes ({recipes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
