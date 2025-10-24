import React, { useState } from 'react';
import { generateRecipe } from '../api';
import { GeneratedRecipe } from '../types';

interface AiGeneratorProps {
  onRecipeGenerated: (recipe: GeneratedRecipe) => void;
}

const AiGenerator: React.FC<AiGeneratorProps> = ({ onRecipeGenerated }) => {
  const [ingredients, setIngredients] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ingredients.trim()) {
      setError('Please enter at least one ingredient');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const recipe = await generateRecipe(ingredients);
      onRecipeGenerated(recipe);
      setIngredients('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to generate recipe. Please try again.');
      } else {
        setError('Failed to generate recipe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🤖 AI Recipe Generator
      </h2>
      <p className="text-gray-600 mb-4">
        Enter ingredients you have (comma-separated), and let AI create a recipe for you!
      </p>
      
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients
          </label>
          <input
            type="text"
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, tomato, rice, garlic"
            className="input-field"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Separate multiple ingredients with commas
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Recipe...
            </span>
          ) : (
            '✨ Generate Recipe'
          )}
        </button>
      </form>
    </div>
  );
};

export default AiGenerator;
