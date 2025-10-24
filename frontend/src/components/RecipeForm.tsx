import React, { useState, useEffect } from 'react';
import { Recipe, Ingredient } from '../types';
import { createRecipe, updateRecipe } from '../api';

interface RecipeFormProps {
  initialRecipe?: Recipe | null;
  onSaved: (recipe: Recipe) => void;
  onCancel?: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialRecipe, onSaved, onCancel }) => {
  const [title, setTitle] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', quantity: '' }]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title);
      setCuisine(initialRecipe.cuisine);
      setIngredients(initialRecipe.ingredients.length > 0 ? initialRecipe.ingredients : [{ name: '', quantity: '' }]);
      setSteps(initialRecipe.steps.length > 0 ? initialRecipe.steps : ['']);
      setImageUrl(initialRecipe.imageUrl || '');
      setIsPublic(initialRecipe.isPublic);
    }
  }, [initialRecipe]);

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a recipe title');
      return;
    }

    if (!cuisine.trim()) {
      setError('Please enter a cuisine type');
      return;
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());
    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient with name and quantity');
      return;
    }

    const validSteps = steps.filter(step => step.trim());
    if (validSteps.length === 0) {
      setError('Please add at least one preparation step');
      return;
    }

    setLoading(true);

    try {
      const recipeData: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        cuisine: cuisine.trim(),
        ingredients: validIngredients,
        steps: validSteps,
        imageUrl: imageUrl.trim(),
        source: initialRecipe?.source || 'user',
        createdBy: 'guest',
        isPublic
      };

      let savedRecipe: Recipe;
      if (initialRecipe?._id) {
        savedRecipe = await updateRecipe(initialRecipe._id, recipeData);
      } else {
        savedRecipe = await createRecipe(recipeData);
      }

      onSaved(savedRecipe);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to save recipe. Please try again.');
      } else {
        setError('Failed to save recipe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialRecipe?._id ? 'Edit Recipe' : 'Create New Recipe'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="e.g., Chicken Parmesan"
            disabled={loading}
          />
        </div>

        {/* Cuisine */}
        <div>
          <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
            Cuisine Type *
          </label>
          <input
            type="text"
            id="cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="input-field"
            placeholder="e.g., Italian, Chinese, Mexican"
            disabled={loading}
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Image URL (optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input-field"
            placeholder="https://example.com/image.jpg"
            disabled={loading}
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients *
          </label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                placeholder="Ingredient name"
                className="input-field flex-1"
                disabled={loading}
              />
              <input
                type="text"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                placeholder="Quantity"
                className="input-field w-32"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="btn-secondary px-3"
                disabled={loading || ingredients.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="btn-secondary text-sm mt-2"
            disabled={loading}
          >
            + Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preparation Steps *
          </label>
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <span className="pt-2 text-gray-500 font-medium">{index + 1}.</span>
              <textarea
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder="Describe this step..."
                className="input-field flex-1"
                rows={2}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="btn-secondary px-3 h-10"
                disabled={loading || steps.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="btn-secondary text-sm mt-2"
            disabled={loading}
          >
            + Add Step
          </button>
        </div>

        {/* Public/Private */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            disabled={loading}
          />
          <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
            Make this recipe public
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1"
          >
            {loading ? 'Saving...' : initialRecipe?._id ? 'Update Recipe' : 'Save Recipe'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;
