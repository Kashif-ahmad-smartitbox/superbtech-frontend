import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiMail, FiPhone } from 'react-icons/fi';
import api from '../utils/api';
import logo from '../assests/super-logo.jpeg';

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex justify-end gap-8 text-sm">
            <a href="mailto:info@tesca.in" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
              <FiMail className="group-hover:scale-110 transition-transform" />
              <span>info@tesca.in</span>
            </a>
            <a href="tel:+919829132777" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
              <FiPhone className="group-hover:scale-110 transition-transform" />
              <span>+91-9829132777</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SuperbTech
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Premium Solutions</p>
              </div>
            </Link>
            
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            
            <ul className={`lg:flex items-center space-x-1 ${mobileMenuOpen ? 'absolute top-24 left-0 right-0 bg-white shadow-2xl p-6 space-y-4 rounded-b-2xl border-t' : 'hidden'}`}>
              <li>
                <Link 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:text-blue-600 font-medium transition-all rounded-lg hover:bg-blue-50 relative group"
                >
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li className="relative group">
                <span className="px-4 py-2.5 text-gray-700 hover:text-blue-600 font-medium cursor-pointer transition-all rounded-lg hover:bg-blue-50 inline-block">
                  Products
                </span>
                <ul className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categories</p>
                  </div>
                  {categories.map(cat => (
                    <li key={cat._id}>
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all border-b border-gray-50 last:border-0 group/item"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-400 opacity-0 group-hover/item:opacity-100 transition-opacity"></span>
                          {cat.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-gray-200 bg-gray-50">
                    <Link 
                      to="/products" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all font-semibold"
                    >
                      View All Products →
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link 
                  to="/products" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 text-gray-700 hover:text-blue-600 font-medium transition-all rounded-lg hover:bg-blue-50 relative group"
                >
                  All Products
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/admin/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg font-semibold"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

