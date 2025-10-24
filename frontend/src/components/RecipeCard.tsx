import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop';

  return (
    <Link to={`/recipe/${recipe._id}`} className="card block">
      <div className="aspect-video overflow-hidden">
        <img
          src={recipe.imageUrl || defaultImage}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">
          {recipe.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
            {recipe.cuisine}
          </span>
          {recipe.source === 'ai-generated' && (
            <span className="flex items-center gap-1">
              🤖 <span>AI</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
