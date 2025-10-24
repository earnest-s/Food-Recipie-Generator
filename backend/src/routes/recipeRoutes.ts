import express from 'express';
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipeController';

const router = express.Router();

// GET /api/recipes - Get all public recipes
router.get('/', getAllRecipes);

// GET /api/recipes/:id - Get recipe by ID
router.get('/:id', getRecipeById);

// POST /api/recipes - Create new recipe
router.post('/', createRecipe);

// PUT /api/recipes/:id - Update recipe
router.put('/:id', updateRecipe);

// DELETE /api/recipes/:id - Delete recipe
router.delete('/:id', deleteRecipe);

export default router;
