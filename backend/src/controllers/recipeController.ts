import { Request, Response } from 'express';
import Recipe from '../models/Recipe';

// Get all public recipes
export const getAllRecipes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const recipes = await Recipe.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .select('title cuisine imageUrl createdAt source');

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
};

// Get a single recipe by ID
export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    // Only return public recipes or recipes created by the user
    if (!recipe.isPublic) {
      res.status(403).json({ error: 'This recipe is private' });
      return;
    }

    res.status(200).json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

// Create a new recipe
export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, cuisine, ingredients, steps, imageUrl, source, isPublic } = req.body;

    // Validation
    if (!title || !cuisine || !ingredients || !steps) {
      res.status(400).json({ 
        error: 'Missing required fields: title, cuisine, ingredients, steps' 
      });
      return;
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      res.status(400).json({ 
        error: 'Ingredients must be a non-empty array' 
      });
      return;
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      res.status(400).json({ 
        error: 'Steps must be a non-empty array' 
      });
      return;
    }

    // Validate each ingredient has name and quantity
    for (const ing of ingredients) {
      if (!ing.name || !ing.quantity) {
        res.status(400).json({ 
          error: 'Each ingredient must have name and quantity' 
        });
        return;
      }
    }

    const newRecipe = new Recipe({
      title,
      cuisine,
      ingredients,
      steps,
      imageUrl: imageUrl || '',
      source: source || 'user',
      createdBy: 'guest', // MVP: No auth
      isPublic: isPublic !== undefined ? isPublic : true
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

// Update a recipe
export const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, cuisine, ingredients, steps, imageUrl, isPublic } = req.body;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    // Update fields if provided
    if (title) recipe.title = title;
    if (cuisine) recipe.cuisine = cuisine;
    if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
      recipe.ingredients = ingredients;
    }
    if (steps && Array.isArray(steps) && steps.length > 0) {
      recipe.steps = steps;
    }
    if (imageUrl !== undefined) recipe.imageUrl = imageUrl;
    if (isPublic !== undefined) recipe.isPublic = isPublic;

    const updatedRecipe = await recipe.save();
    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

// Delete a recipe
export const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      res.status(404).json({ error: 'Recipe not found' });
      return;
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};
