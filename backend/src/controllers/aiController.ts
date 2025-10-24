import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Type for Spoonacular API response
interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: Array<{ name: string; amount: number; unit: string }>;
  missedIngredients: Array<{ name: string; amount: number; unit: string }>;
  unusedIngredients: Array<{ name: string; amount: number; unit: string }>;
}

interface SpoonacularRecipeInfo {
  title: string;
  image: string;
  cuisines: string[];
  extendedIngredients: Array<{
    name: string;
    measures: {
      metric: { amount: number; unitShort: string };
    };
  }>;
  analyzedInstructions: Array<{
    steps: Array<{ number: number; step: string }>;
  }>;
}

// Type for our formatted recipe response
interface GeneratedRecipe {
  title: string;
  cuisine: string;
  ingredients: Array<{ name: string; quantity: string }>;
  steps: string[];
  imageUrl: string;
}

export const generateRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ingredients } = req.query;

    if (!ingredients || typeof ingredients !== 'string') {
      res.status(400).json({ 
        error: 'Please provide ingredients as a comma-separated string' 
      });
      return;
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) {
      res.status(500).json({ 
        error: 'API key not configured' 
      });
      return;
    }

    // Step 1: Find recipes by ingredients
    const searchResponse = await axios.get<SpoonacularRecipe[]>(
      'https://api.spoonacular.com/recipes/findByIngredients',
      {
        params: {
          apiKey,
          ingredients: ingredients,
          number: 1,
          ranking: 2,
          ignorePantry: true
        }
      }
    );

    if (!searchResponse.data || searchResponse.data.length === 0) {
      res.status(404).json({ 
        error: 'No recipes found with those ingredients' 
      });
      return;
    }

    const recipeId = searchResponse.data[0].id;

    // Step 2: Get detailed recipe information
    const detailResponse = await axios.get<SpoonacularRecipeInfo>(
      `https://api.spoonacular.com/recipes/${recipeId}/information`,
      {
        params: {
          apiKey
        }
      }
    );

    const recipeData = detailResponse.data;

    // Format the recipe data
    const formattedRecipe: GeneratedRecipe = {
      title: recipeData.title,
      cuisine: recipeData.cuisines.length > 0 ? recipeData.cuisines[0] : 'International',
      ingredients: recipeData.extendedIngredients.map(ing => ({
        name: ing.name,
        quantity: `${ing.measures.metric.amount} ${ing.measures.metric.unitShort}`
      })),
      steps: recipeData.analyzedInstructions.length > 0
        ? recipeData.analyzedInstructions[0].steps.map(step => step.step)
        : ['No instructions available'],
      imageUrl: recipeData.image || ''
    };

    res.status(200).json(formattedRecipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 402) {
        res.status(402).json({ 
          error: 'API quota exceeded. Please try again later.' 
        });
        return;
      }
      res.status(error.response?.status || 500).json({ 
        error: error.response?.data?.message || 'Failed to fetch recipe from AI service' 
      });
      return;
    }

    res.status(500).json({ 
      error: 'Internal server error while generating recipe' 
    });
  }
};
