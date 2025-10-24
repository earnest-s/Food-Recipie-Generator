import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍳</span>
            <span className="text-xl font-bold text-gray-800">
              Recipe<span className="text-primary-600">AI</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Create Recipe
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
