import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import { FiFilter, FiGrid, FiPackage, FiChevronRight } from "react-icons/fi";

const Products = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    fetchCategories();
  }, [selectedCategory]);

  useEffect(() => {
    if (slug) {
      fetchCategoryBySlug();
    } else {
      fetchProducts();
    }
  }, [slug]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  
  // Auto-expand parent category when subcategory is selected
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const parentCategory = categories.find(cat => 
        cat.subcategories && cat.subcategories.some(sub => sub._id === selectedCategory._id)
      );
      if (parentCategory) {
        setExpandedCategories(prev => new Set([...prev, parentCategory._id]));
      }
    }
  }, [selectedCategory, categories]);

  const fetchCategoryBySlug = async () => {
    try {
      const categoriesRes = await api.get("/categories");
      // Search in main categories and subcategories
      let category = categoriesRes.data.find((cat) => cat.slug === slug);
      let parentCategory = null;
      
      if (!category) {
        // Search in subcategories
        for (const cat of categoriesRes.data) {
          if (cat.subcategories) {
            const subcat = cat.subcategories.find((sub) => sub.slug === slug);
            if (subcat) {
              category = subcat;
              parentCategory = cat;
              break;
            }
          }
        }
      }
      
      if (category) {
        setSelectedCategory(category);
        
        // Auto-expand parent category if it's a subcategory
        if (parentCategory) {
          setExpandedCategories(new Set([parentCategory._id]));
        }
        
        // Use subcategory parameter if it's a subcategory
        const isSubcategory = category.parent || parentCategory !== null;
        const url = isSubcategory 
          ? `/products?subcategory=${category._id}`
          : `/products?category=${category._id}`;
        const productsRes = await api.get(url);
        setProducts(productsRes.data);
      }
    } catch (error) {
      console.error("Error fetching category products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (categoryId = null) => {
    try {
      setLoading(true);
      const url = categoryId ? `/products?category=${categoryId}` : "/products";
      const response = await api.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    if (categoryId === selectedCategory?._id) {
      setSelectedCategory(null);
      fetchProducts();
    } else {
      const category = categories.find((cat) => cat._id === categoryId);
      setSelectedCategory(category);
      fetchProducts(categoryId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full">
            <FiPackage className="text-primary-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {selectedCategory
                ? selectedCategory.name
                : "Premium Laboratory Equipment"}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {selectedCategory ? selectedCategory.name : "Our Product Range"}
            </span>
          </h1>
          {selectedCategory?.description && (
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
              {selectedCategory.description}
            </p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
        </div>

        {/* Categories Section - Only when no category is selected */}
        {!selectedCategory && categories.length > 0 && (
          <section className="mb-16 animate-fade-in animation-delay-300">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                <span className="bg-gradient-to-r from-primary-700 to-primary-800 bg-clip-text text-transparent">
                  Product Categories
                </span>
              </h2>
              <p className="text-gray-600">
                Browse our specialized equipment by category
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="group relative bg-white rounded-xl border border-primary-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer"
                  onClick={() => handleCategoryFilter(category._id)}
                >
                  <div className="h-48 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center overflow-hidden relative">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <span className="text-3xl font-bold text-white">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary-600 font-medium bg-primary-50 px-3 py-1 rounded-full">
                        View Products
                      </span>
                      <FiChevronRight className="text-primary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-xl transition-all duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-primary-100 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <FiFilter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <p className="text-xs text-gray-500">Refine your search</p>
                </div>
              </div>

              <div className="space-y-1">
                {/* All Products Button */}
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                      : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                  }`}
                  onClick={() => handleCategoryFilter(null)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">All Products</span>
                    {!selectedCategory && <FiGrid className="w-4 h-4" />}
                  </div>
                </button>

                {/* Category Filters */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-primary-800 uppercase tracking-wide mb-3">
                    Categories
                  </h4>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const hasSubcategories = category.subcategories && category.subcategories.length > 0;
                      const isExpanded = expandedCategories.has(category._id);
                      
                      return (
                        <div key={category._id}>
                          <div className="flex items-center gap-1">
                            {hasSubcategories && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setExpandedCategories(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(category._id)) {
                                      newSet.delete(category._id);
                                    } else {
                                      newSet.add(category._id);
                                    }
                                    return newSet;
                                  });
                                }}
                                className="p-1 hover:bg-primary-100 rounded transition-colors flex-shrink-0"
                              >
                                <FiChevronRight
                                  className={`text-gray-400 text-xs transition-transform duration-200 ${
                                    isExpanded ? 'rotate-90' : ''
                                  }`}
                                  size={12}
                                />
                              </button>
                            )}
                            <button
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                                selectedCategory?._id === category._id
                                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                                  : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                              } ${hasSubcategories ? '' : 'ml-6'}`}
                              onClick={() => handleCategoryFilter(category._id)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{category.name}</span>
                                {selectedCategory?._id === category._id && !hasSubcategories && (
                                  <FiChevronRight className="w-4 h-4" />
                                )}
                              </div>
                            </button>
                          </div>
                          {/* Subcategories - Only show when expanded */}
                          {hasSubcategories && isExpanded && (
                            <div className="ml-3 mt-1 space-y-1">
                              {category.subcategories.map((subcat) => (
                                <button
                                  key={subcat._id}
                                  className={`w-full text-left px-3 py-1.5 rounded-md transition-all duration-300 text-xs ${
                                    selectedCategory?._id === subcat._id
                                      ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                                      : "bg-primary-50/50 text-primary-600 hover:bg-primary-100"
                                  }`}
                                onClick={() => {
                                  setSelectedCategory(subcat);
                                  // Ensure parent category is expanded
                                  setExpandedCategories(prev => new Set([...prev, category._id]));
                                  fetchProducts(subcat._id);
                                }}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-primary-400"></span>
                                    <span className="font-medium">{subcat.name}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-primary-300"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-200 p-6">
              <h4 className="text-lg font-bold text-primary-800 mb-4">
                Product Stats
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Products</span>
                  <span className="text-lg font-bold text-primary-700">
                    {products.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="text-lg font-bold text-primary-700">
                    {categories.length}
                  </span>
                </div>
                <div className="pt-3 border-t border-primary-200">
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    All items are in stock
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            {selectedCategory && (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg shadow-sm border border-primary-200 px-3 py-2 mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-primary-900">
                      {selectedCategory.name} Products
                    </h2>
                    {selectedCategory.description && (
                      <p className="text-xs text-gray-600 mt-0.5">
                        {selectedCategory.description}
                      </p>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-md border border-primary-200 shadow-sm">
                    <span className="text-xs text-gray-600">Showing</span>
                    <span className="text-sm font-bold text-primary-700">
                      {products.length}
                    </span>
                    <span className="text-xs text-gray-600">products</span>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-primary-100">
                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-600"></div>
                <p className="mt-6 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-primary-100">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {selectedCategory
                    ? `No products available in "${selectedCategory.name}" category.`
                    : "No products available at the moment."}
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <FiGrid />
                    Browse All Products
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Load More / Pagination */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <span>Showing {products.length} products</span>
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    <span>Scroll for more</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
