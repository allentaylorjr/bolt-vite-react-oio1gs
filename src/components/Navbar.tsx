import React from 'react';
import { Link } from 'react-router-dom';
import { Church } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Church className="h-8 w-8" />
            <span className="font-bold text-xl">SermonHub</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/sermons" className="hover:text-blue-200 transition-colors">
              Sermons
            </Link>
            <Link to="/upload" className="hover:text-blue-200 transition-colors">
              Upload
            </Link>
            <Link to="/login" className="hover:text-blue-200 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;