// Ingredient interface
export interface Ingredient {
  name: string;
  quantity: string;
}

// Recipe interface
export interface Recipe {
  _id?: string;
  title: string;
  cuisine: string;
  ingredients: Ingredient[];
  steps: string[];
  imageUrl?: string;
  source: 'ai-generated' | 'user';
  createdBy: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface GeneratedRecipe {
  title: string;
  cuisine: string;
  ingredients: Ingredient[];
  steps: string[];
  imageUrl: string;
}

export interface ApiError {
  error: string;
}
