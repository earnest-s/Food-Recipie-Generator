import React from 'react';
import { Link } from 'react-router-dom';
import Icon3D from './Icon3D';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <Icon3D type="chef" className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-100">
              Food<span className="text-primary-500">Legion</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-primary-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-300 hover:text-primary-400 transition-colors font-medium"
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
