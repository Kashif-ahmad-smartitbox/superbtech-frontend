import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = allProducts.filter(
        product => product.category?._id === selectedCategory || product.category === selectedCategory
      );
      setFilteredProducts(filtered);
      setSelectedProduct(''); // Reset product selection when category changes
    } else {
      setFilteredProducts(allProducts);
      setSelectedProduct('');
    }
  }, [selectedCategory, allProducts]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, allProductsRes] = await Promise.all([
        api.get('/products?featured=true'),
        api.get('/categories'),
        api.get('/products')
      ]);
      setFeaturedProducts(productsRes.data.slice(0, 8));
      setCategories(categoriesRes.data);
      setAllProducts(allProductsRes.data);
      setFilteredProducts(allProductsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    setSelectedProduct(productId);
  };

  const handleGetNow = () => {
    if (selectedProduct) {
      navigate(`/products/${selectedProduct}`);
    } else if (selectedCategory) {
      const category = categories.find(cat => cat._id === selectedCategory);
      if (category) {
        navigate(`/category/${category.slug}`);
      }
    } else {
      navigate('/products');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-32 lg:py-40 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center mb-8 px-6 py-3 bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-sm rounded-full text-sm font-medium text-blue-700 border border-blue-200/30 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
              <span className="mr-2">🌟</span>
              <span className="hidden sm:inline">Premium Quality Products</span>
              <span className="sm:hidden">Premium Quality</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in animation-delay-300">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Top Manufacturer & Supplier of
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent animate-gradient">
                Technical Equipment
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100/90 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in animation-delay-500">
              Providing reliable, advanced, and cost-effective solutions worldwide.
              <span className="block mt-2 text-blue-200">Precision-engineered for education and industry.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/products" 
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Products
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link 
                to="/products" 
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold text-lg border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
              >
                View Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
              <span className="text-sm font-semibold text-blue-600">Categories</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Product Categories
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Browse our wide range of premium product categories</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map(category => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="group relative card hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-xl transition-all duration-500"></div>
                <div className="relative h-40 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center overflow-hidden rounded-t-xl">
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
                </div>
                <div className="relative p-6 text-center">
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category & Product Selector Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Quick Product Finder</h3>
                  <p className="text-gray-600">Select a category and product to get started</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-3">
                    <label htmlFor="category-select" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Select Category
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <select
                        id="category-select"
                        className="input-field pl-12 bg-white appearance-none cursor-pointer"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="product-select" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Select Product
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <select
                        id="product-select"
                        className="input-field pl-12 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                        value={selectedProduct}
                        onChange={handleProductChange}
                        disabled={!selectedCategory}
                      >
                        <option value="">All Products</option>
                        {filteredProducts.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.orderCode} - {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                      onClick={handleGetNow}
                      disabled={!selectedCategory && !selectedProduct}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Get now
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtered Products Section */}
      {selectedCategory && filteredProducts.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {categories.find(cat => cat._id === selectedCategory)?.name || 'Products'}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
              {filteredProducts.slice(0, 12).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {filteredProducts.length > 12 && (
              <div className="text-center mt-12">
                <Link 
                  to={`/category/${categories.find(cat => cat._id === selectedCategory)?.slug}`}
                  className="btn btn-secondary inline-block"
                >
                  View All {categories.find(cat => cat._id === selectedCategory)?.name} Products
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Featured</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Featured Products
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Discover our most popular and premium products</p>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading amazing products...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {featuredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="text-center mt-16">
                <Link 
                  to="/products" 
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                >
                  View All Products
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

