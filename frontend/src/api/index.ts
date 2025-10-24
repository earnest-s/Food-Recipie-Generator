import axios from 'axios';
import { Recipe, GeneratedRecipe } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// AI Controller
export const generateRecipe = async (ingredients: string): Promise<GeneratedRecipe> => {
  const response = await axios.get(`${API_BASE_URL}/ai/generate`, {
    params: { ingredients }
  });
  return response.data;
};

// Recipe Controller
export const getAllRecipes = async (): Promise<Recipe[]> => {
  const response = await axios.get(`${API_BASE_URL}/recipes`);
  return response.data;
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  const response = await axios.get(`${API_BASE_URL}/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (recipe: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> => {
  const response = await axios.post(`${API_BASE_URL}/recipes`, recipe);
  return response.data;
};

export const updateRecipe = async (id: string, recipe: Partial<Recipe>): Promise<Recipe> => {
  const response = await axios.put(`${API_BASE_URL}/recipes/${id}`, recipe);
  return response.data;
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/recipes/${id}`);
};
