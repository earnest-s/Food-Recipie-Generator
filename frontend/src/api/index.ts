import axios from 'axios';
import { Recipe, GeneratedRecipe } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// AI Controller
export const generateRecipe = async (ingredients: string): Promise<GeneratedRecipe> => {
  const response = await api.get('/ai/generate', {
    params: { ingredients }
  });
  return response.data;
};

// Recipe Controller
export const getAllRecipes = async (): Promise<Recipe[]> => {
  const response = await api.get('/recipes');
  return response.data;
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  const response = await api.get(`/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (recipe: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
  const response = await api.post('/recipes', recipe);
  return response.data;
};

export const updateRecipe = async (id: string, recipe: Partial<Recipe>): Promise<Recipe> => {
  const response = await api.put(`/recipes/${id}`, recipe);
  return response.data;
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await api.delete(`/recipes/${id}`);
};
