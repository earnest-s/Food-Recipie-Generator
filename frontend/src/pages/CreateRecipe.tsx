import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AiGenerator from '../components/AiGenerator';
import RecipeForm from '../components/RecipeForm';
import { GeneratedRecipe, Recipe } from '../types';

const CreateRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);

  const handleRecipeGenerated = (recipe: GeneratedRecipe) => {
    setGeneratedRecipe(recipe);
    // Scroll to form
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const handleRecipeSaved = (recipe: Recipe) => {
    navigate(`/recipe/${recipe._id}`);
  };

  const initialRecipe: Recipe | null = generatedRecipe
    ? {
        title: generatedRecipe.title,
        cuisine: generatedRecipe.cuisine,
        ingredients: generatedRecipe.ingredients,
        steps: generatedRecipe.steps,
        imageUrl: generatedRecipe.imageUrl,
        source: 'ai-generated',
        createdBy: 'guest',
        isPublic: true
      }
    : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-8">
        Create Your Recipe
      </h1>

      {/* AI Generator */}
      <AiGenerator onRecipeGenerated={handleRecipeGenerated} />

      {/* Recipe Form */}
      <RecipeForm
        initialRecipe={initialRecipe}
        onSaved={handleRecipeSaved}
      />
    </div>
  );
};

export default CreateRecipe;
