import express from 'express';
import { generateRecipe } from '../controllers/aiController';

const router = express.Router();

// GET /api/ai/generate?ingredients=chicken,tomato,rice
router.get('/generate', generateRecipe);

export default router;
