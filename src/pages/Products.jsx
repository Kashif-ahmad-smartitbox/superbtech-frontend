import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (slug) {
      fetchCategoryBySlug();
    } else {
      fetchProducts();
    }
  }, [slug]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategoryBySlug = async () => {
    try {
      const categoriesRes = await api.get('/categories');
      const category = categoriesRes.data.find(cat => cat.slug === slug);
      if (category) {
        setSelectedCategory(category);
        const productsRes = await api.get(`/products?category=${category._id}`);
        setProducts(productsRes.data);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categoryId = null) => {
    try {
      setLoading(true);
      const url = categoryId ? `/products?category=${categoryId}` : '/products';
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    if (categoryId === selectedCategory?._id) {
      setSelectedCategory(null);
      fetchProducts();
    } else {
      const category = categories.find(cat => cat._id === categoryId);
      setSelectedCategory(category);
      fetchProducts(categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50/30 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {selectedCategory ? 'Category' : 'All Products'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {selectedCategory ? selectedCategory.name : 'All Products'}
            </span>
          </h1>
          {selectedCategory?.description && (
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">{selectedCategory.description}</p>
          )}
          {selectedCategory?.image && (
            <div className="mt-8 max-w-md mx-auto">
              <img 
                src={selectedCategory.image} 
                alt={selectedCategory.name}
                className="w-full h-48 object-cover rounded-2xl shadow-xl border-4 border-white"
              />
            </div>
          )}
        </div>

        {/* Categories Section */}
        {!selectedCategory && (
          <section className="mb-20 animate-fade-in animation-delay-300">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Product Categories
                </span>
              </h2>
              <p className="text-gray-600 text-lg">Browse products by category</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories.map(category => (
                <div
                  key={category._id}
                  className="group card cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  onClick={() => handleCategoryFilter(category._id)}
                >
                  <div className="h-40 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden rounded-t-xl relative">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        {category.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>
                    )}
                    <div className="mt-4 flex items-center justify-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-semibold">Explore</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-24 border border-gray-100">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Category
              </h3>
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                      !selectedCategory 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:translate-x-1'
                    }`}
                    onClick={() => handleCategoryFilter(null)}
                  >
                    All Products
                  </button>
                </li>
                {categories.map(category => (
                  <li key={category._id}>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                        selectedCategory?._id === category._id
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:translate-x-1'
                      }`}
                      onClick={() => handleCategoryFilter(category._id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                <p className="mt-6 text-gray-600 text-lg">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-medium">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

