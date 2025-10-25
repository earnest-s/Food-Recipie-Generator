import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeById } from '../api';
import { Recipe } from '../types';
import Icon3D from '../components/Icon3D';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
    }
  }, [id]);

  const fetchRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const data = await getRecipeById(recipeId);
      setRecipe(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to load recipe');
      } else {
        setError('Failed to load recipe');
      }
    } finally {
      setLoading(false);
    }
  };

  const defaultImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card p-8 text-center">
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error || 'Recipe not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <button
        onClick={() => navigate('/')}
        className="btn-secondary mb-6"
      >
        ← Back to Recipes
      </button>

      <div className="card overflow-hidden">
        {/* Image */}
        <div className="w-full h-96 overflow-hidden">
          <img
            src={recipe.imageUrl || defaultImage}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Title and Meta */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary-900 text-primary-300 px-4 py-1 rounded-full text-sm font-medium">
                {recipe.cuisine}
              </span>
              {recipe.source === 'ai-generated' && (
                <span className="bg-purple-900 text-purple-300 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Icon3D type="ai" className="w-5 h-5" />
                  AI Generated
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {recipe.title}
            </h1>
            {recipe.createdAt && (
              <p className="text-gray-300 text-sm">
                Created {new Date(recipe.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Icon3D type="recipe" className="w-7 h-7 text-primary-500" />
              Ingredients
            </h2>
            <div className="bg-gray-700/50 rounded-lg p-6">
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary-400 font-bold">•</span>
                    <span className="flex-1">
                      <span className="font-medium text-white">{ingredient.name}</span>
                      {' — '}
                      <span className="text-gray-300">{ingredient.quantity}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Steps */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Icon3D type="chef" className="w-7 h-7 text-primary-500" />
              Preparation Steps
            </h2>
            <div className="space-y-4">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
