import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";

const Catalog = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);
  
  // Auto-expand parent category when subcategory is selected
  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const parentCategory = categories.find(cat => 
        cat.subcategories && cat.subcategories.some(sub => sub._id === selectedCategory)
      );
      if (parentCategory) {
        setExpandedCategories(prev => new Set([...prev, parentCategory._id]));
      }
    }
  }, [selectedCategory, categories]);

  useEffect(() => {
    let filtered = allProducts;

    // Filter by category (including subcategories)
    if (selectedCategory) {
      // Check if it's a main category - if so, include its subcategories
      const category = categories.find(cat => cat._id === selectedCategory);
      if (category && category.subcategories && category.subcategories.length > 0) {
        const categoryIds = [selectedCategory, ...category.subcategories.map(sub => sub._id)];
        filtered = filtered.filter(
          (product) =>
            categoryIds.includes(product.category?._id) ||
            categoryIds.includes(product.category)
        );
      } else {
        filtered = filtered.filter(
          (product) =>
            product.category?._id === selectedCategory ||
            product.category === selectedCategory
        );
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name?.localeCompare(b.name);
        case "name-desc":
          return b.name?.localeCompare(a.name);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
    setSelectedProduct("");
  }, [selectedCategory, allProducts, searchTerm, sortOption]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, allProductsRes] = await Promise.all([
        api.get("/products?featured=true"),
        api.get("/categories"),
        api.get("/products"),
      ]);
      setFeaturedProducts(productsRes.data.slice(0, 8));
      setCategories(categoriesRes.data);
      setAllProducts(allProductsRes.data);
      setFilteredProducts(allProductsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  const handleGetNow = () => {
    if (selectedProduct) {
      // Find the product to get its slug
      const product = allProducts.find((p) => p._id === selectedProduct);
      if (product) {
        navigate(`/products/${product.slug}-${product._id}`);
      } else {
        navigate(`/products/${selectedProduct}`);
      }
    } else if (selectedCategory) {
      const category = categories.find((cat) => cat._id === selectedCategory);
      if (category) {
        navigate(`/category/${category.slug}`);
      }
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-primary-50 min-h-screen font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Product <span className="text-primary-600">Catalogue</span>
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Explore our comprehensive range of engineering laboratory
                equipment designed for educational excellence and industrial
                research
              </p>
            </div>
            <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 px-4 py-3 rounded-lg shadow-sm border border-primary-200 text-sm font-semibold text-primary-800">
              <div className="text-xl font-bold text-primary-700">
                {filteredProducts.length}
              </div>
              <div className="text-xs text-gray-600">Products Available</div>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-6"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-primary-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <p className="text-xs text-gray-500">Refine your search</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wide mb-3">
                    Search
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2.5 bg-primary-50 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-sm text-gray-800 placeholder:text-gray-400"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wide mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCategory === ""
                          ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                          : "bg-primary-50 hover:bg-primary-100 text-gray-700 hover:text-primary-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">All Categories</span>
                        {selectedCategory === "" && (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </button>

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
                                <svg
                                  className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-90' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedCategory(category._id)}
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                                selectedCategory === category._id
                                  ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                                  : "bg-primary-50 hover:bg-primary-100 text-gray-700 hover:text-primary-800"
                              } ${hasSubcategories ? '' : 'ml-6'}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{category.name}</span>
                                {selectedCategory === category._id && !hasSubcategories && (
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
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
                                  onClick={() => {
                                  setSelectedCategory(subcat._id);
                                  // Ensure parent category is expanded
                                  setExpandedCategories(prev => new Set([...prev, category._id]));
                                }}
                                  className={`w-full text-left px-3 py-1.5 rounded-md transition-all text-xs ${
                                    selectedCategory === subcat._id
                                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                                      : "bg-primary-50/50 hover:bg-primary-100 text-gray-600 hover:text-primary-800"
                                  }`}
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

                {/* Sort Options */}
                <div>
                  <h3 className="text-sm font-semibold text-primary-800 uppercase tracking-wide mb-3">
                    Sort By
                  </h3>
                  <select
                    className="w-full px-4 py-2.5 bg-primary-50 border border-primary-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 cursor-pointer"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(selectedCategory || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setSearchTerm("");
                      setSortOption("name-asc");
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-primary-300"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg shadow-sm border border-primary-200 px-3 py-2 mb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-primary-900">
                    Showing {filteredProducts.length} Products
                  </h2>
                  {(selectedCategory || searchTerm) && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCategory && (() => {
                        const category = categories.find((c) => c._id === selectedCategory);
                        const subcategory = categories.flatMap(c => c.subcategories || []).find(sub => sub._id === selectedCategory);
                        const selected = category || subcategory;
                        return selected && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[10px] rounded-full">
                            {selected.name}
                            <button
                              onClick={() => setSelectedCategory("")}
                              className="ml-0.5 hover:text-secondary-200"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })()}
                      {searchTerm && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-[10px] rounded-full">
                          "{searchTerm}"
                          <button
                            onClick={() => setSearchTerm("")}
                            className="ml-0.5 hover:text-primary-200"
                          >
                            ×
                          </button>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex bg-primary-100 rounded-md p-0.5 border border-primary-200">
                    <button className="p-1 rounded bg-white shadow-sm text-primary-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        />
                      </svg>
                    </button>
                    <button className="p-1 rounded text-primary-400 hover:text-primary-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-xl shadow-sm border border-primary-100 p-4 animate-pulse"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg mb-4"></div>
                    <div className="h-4 bg-primary-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-primary-100 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-primary-200">
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
                  {searchTerm
                    ? `No products match "${searchTerm}". Try a different search term.`
                    : "Try adjusting your filters or browse all categories."}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSearchTerm("");
                  }}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Browse All Products
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
