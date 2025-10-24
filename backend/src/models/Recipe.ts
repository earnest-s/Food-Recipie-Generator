import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for Ingredient
export interface IIngredient {
  name: string;
  quantity: string;
}

// TypeScript interface for Recipe
export interface IRecipe extends Document {
  title: string;
  cuisine: string;
  ingredients: IIngredient[];
  steps: string[];
  imageUrl?: string;
  source: 'ai-generated' | 'user';
  createdBy: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Ingredient Schema
const IngredientSchema = new Schema<IIngredient>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Recipe Schema
const RecipeSchema = new Schema<IRecipe>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  cuisine: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: {
    type: [IngredientSchema],
    required: true,
    validate: {
      validator: (arr: IIngredient[]) => arr.length > 0,
      message: 'Recipe must have at least one ingredient'
    }
  },
  steps: {
    type: [String],
    required: true,
    validate: {
      validator: (arr: string[]) => arr.length > 0,
      message: 'Recipe must have at least one step'
    }
  },
  imageUrl: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    enum: ['ai-generated', 'user'],
    required: true
  },
  createdBy: {
    type: String,
    required: true,
    default: 'guest'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
RecipeSchema.index({ isPublic: 1, createdAt: -1 });
RecipeSchema.index({ createdBy: 1 });

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);
