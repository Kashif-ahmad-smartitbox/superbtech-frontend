import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import {
  FiFilter,
  FiGrid,
  FiPackage,
  FiChevronRight,
  FiX,
  FiMenu,
  FiChevronDown,
  FiSearch,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiChevronLeft,
} from "react-icons/fi";

const Products = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedProducts, setExpandedProducts] = useState(new Set());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (selectedCategory && categories.length > 0) {
      const parentCategory = categories.find(
        (cat) =>
          cat.subcategories &&
          cat.subcategories.some((sub) => sub._id === selectedCategory._id)
      );
      if (parentCategory) {
        setExpandedCategories((prev) => new Set([...prev, parentCategory._id]));
      }
    }
  }, [selectedCategory, categories]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/with-products");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const toggleProducts = (key) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const fetchCategoryBySlug = async () => {
    try {
      const categoriesRes = await api.get("/categories");
      let category = categoriesRes.data.find((cat) => cat.slug === slug);
      let parentCategory = null;

      if (!category) {
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

        if (parentCategory) {
          setExpandedCategories(new Set([parentCategory._id]));
        }

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
    setShowMobileFilters(false);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Filter products by search query
  const filteredProducts = searchQuery
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.orderCode?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white pt-4 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Mobile Category Menu Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-primary-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                <FiPackage className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-600">
                  Browse Categories
                </div>
                <div className="text-xs text-gray-500">
                  {selectedCategory ? selectedCategory.name : "All Products"}
                </div>
              </div>
            </div>
            <FiChevronDown
              className={`text-gray-400 transition-transform ${
                showCategoryMenu ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Hero Header - Desktop */}
        <div className="hidden lg:block text-center mb-4 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold my-4">
            <span className="bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {selectedCategory ? selectedCategory.name : "Our Product Range"}
            </span>
          </h1>
          {selectedCategory?.description && (
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              {selectedCategory.description}
            </p>
          )}
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
        </div>

        {/* Hero Header - Mobile */}
        <div className="lg:hidden text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary-700 to-secondary-600 bg-clip-text text-transparent">
              {selectedCategory ? selectedCategory.name : "Products"}
            </span>
          </h1>
          {selectedCategory?.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {selectedCategory.description}
            </p>
          )}
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-primary-200 rounded-xl hover:shadow-md transition-shadow"
          >
            <FiFilter className="text-primary-600" />
            <span className="font-medium text-gray-700">Filters</span>
          </button>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryFilter(null)}
              className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-xl font-medium text-gray-700 hover:shadow-md transition-shadow"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Section - Only when no category is selected on desktop */}
        {!selectedCategory && categories.length > 0 && (
          <section className="hidden lg:block mb-16 animate-fade-in animation-delay-300">
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

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-xl transition-all duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1">
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

              {/* Desktop Search */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
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

                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-primary-800 uppercase tracking-wide mb-3">
                    Categories
                  </h4>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const hasSubcategories =
                        category.subcategories &&
                        category.subcategories.length > 0;
                      const hasProducts =
                        category.products && category.products.length > 0;
                      const hasChildren = hasSubcategories || hasProducts;
                      const isExpanded = expandedCategories.has(category._id);
                      const isProductsExpanded = expandedProducts.has(
                        `products-${category._id}`
                      );

                      return (
                        <div key={category._id}>
                          <div className="flex items-center gap-1">
                            {hasChildren && (
                              <button
                                onClick={() => toggleCategory(category._id)}
                                className="p-1 hover:bg-primary-100 rounded transition-colors flex-shrink-0"
                              >
                                <FiChevronRight
                                  className={`text-gray-400 text-xs transition-transform duration-200 ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </button>
                            )}
                            <button
                              className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                                selectedCategory?._id === category._id
                                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                                  : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                              } ${hasChildren ? "" : "ml-6"}`}
                              onClick={() => handleCategoryFilter(category._id)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {category.name}
                                </span>
                                {selectedCategory?._id === category._id &&
                                  !hasChildren && (
                                    <FiChevronRight className="w-4 h-4" />
                                  )}
                              </div>
                            </button>
                          </div>
                          {hasChildren && isExpanded && (
                            <div className="ml-3 mt-1 space-y-1">
                              {/* Subcategories */}
                              {hasSubcategories &&
                                category.subcategories.map((subcat) => {
                                  const subcatHasProducts =
                                    subcat.products && subcat.products.length > 0;
                                  const subcatProductsExpanded =
                                    expandedProducts.has(`products-${subcat._id}`);

                                  return (
                                    <div key={subcat._id}>
                                      <div className="flex items-center gap-1">
                                        {subcatHasProducts && (
                                          <button
                                            onClick={() =>
                                              toggleProducts(`products-${subcat._id}`)
                                            }
                                            className="p-0.5 hover:bg-primary-100 rounded transition-colors flex-shrink-0"
                                          >
                                            <FiChevronRight
                                              className={`text-gray-400 transition-transform duration-200 ${
                                                subcatProductsExpanded ? "rotate-90" : ""
                                              }`}
                                              size={10}
                                            />
                                          </button>
                                        )}
                                        <button
                                          className={`w-full text-left px-3 py-1.5 rounded-md transition-all duration-300 text-xs ${
                                            selectedCategory?._id === subcat._id
                                              ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                                              : "bg-primary-50/50 text-primary-600 hover:bg-primary-100"
                                          } ${subcatHasProducts ? "" : "ml-4"}`}
                                          onClick={() => {
                                            setSelectedCategory(subcat);
                                            setExpandedCategories(
                                              (prev) =>
                                                new Set([...prev, category._id])
                                            );
                                            fetchProducts(subcat._id);
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-primary-400"></span>
                                            <span className="font-medium">
                                              {subcat.name}
                                            </span>
                                          </div>
                                        </button>
                                      </div>
                                      {/* Products under subcategory */}
                                      {subcatHasProducts && subcatProductsExpanded && (
                                        <div className="ml-4 mt-1 space-y-0.5">
                                          {subcat.products.map((product) => (
                                            <Link
                                              key={product._id}
                                              to={`/products/${product.slug}-${product._id}`}
                                              className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors group/product"
                                            >
                                              {product.images && product.images[0] ? (
                                                <img
                                                  src={product.images[0]}
                                                  alt={product.name}
                                                  className="w-5 h-5 rounded object-cover flex-shrink-0"
                                                />
                                              ) : (
                                                <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                  <FiPackage
                                                    size={8}
                                                    className="text-gray-400"
                                                  />
                                                </div>
                                              )}
                                              <span className="truncate flex-1 group-hover/product:text-primary-700">
                                                {product.name}
                                              </span>
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              {/* Products directly under category */}
                              {hasProducts && (
                                <div className="mt-1">
                                  <button
                                    onClick={() =>
                                      toggleProducts(`products-${category._id}`)
                                    }
                                    className="flex items-center gap-1 px-2 py-1 text-xs text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50 rounded-md w-full transition-colors"
                                  >
                                    <FiChevronRight
                                      className={`text-secondary-400 transition-transform duration-200 ${
                                        isProductsExpanded ? "rotate-90" : ""
                                      }`}
                                      size={10}
                                    />
                                    <FiPackage size={10} className="text-secondary-500" />
                                    <span className="font-medium">
                                      Products ({category.products.length})
                                    </span>
                                  </button>
                                  {isProductsExpanded && (
                                    <div className="ml-4 mt-1 space-y-0.5">
                                      {category.products.map((product) => (
                                        <Link
                                          key={product._id}
                                          to={`/products/${product.slug}-${product._id}`}
                                          className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors group/product"
                                        >
                                          {product.images && product.images[0] ? (
                                            <img
                                              src={product.images[0]}
                                              alt={product.name}
                                              className="w-5 h-5 rounded object-cover flex-shrink-0"
                                            />
                                          ) : (
                                            <div className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                              <FiPackage
                                                size={8}
                                                className="text-gray-400"
                                              />
                                            </div>
                                          )}
                                          <span className="truncate flex-1 group-hover/product:text-primary-700">
                                            {product.name}
                                          </span>
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {selectedCategory && (
                <button
                  onClick={() => handleCategoryFilter(null)}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-primary-300"
                >
                  Clear Filter
                </button>
              )}
            </div>

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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Featured</span>
                  <span className="text-lg font-bold text-primary-700">
                    {products.filter((p) => p.featured).length}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Category Menu */}
          {showCategoryMenu && (
            <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                  <h3 className="text-lg font-bold">Categories</h3>
                  <button
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    onClick={() => setShowCategoryMenu(false)}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <button
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                      !selectedCategory
                        ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                        : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                    }`}
                    onClick={() => {
                      handleCategoryFilter(null);
                      setShowCategoryMenu(false);
                    }}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category._id}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                        selectedCategory?._id === category._id
                          ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                          : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                      }`}
                      onClick={() => {
                        handleCategoryFilter(category._id);
                        setShowCategoryMenu(false);
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Filters Sidebar */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">Filters</h3>
                    <p className="text-primary-100 text-xs">
                      Refine your search
                    </p>
                  </div>
                  <button
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Categories
                    </h4>
                    <div className="space-y-2">
                      {categories.map((category) => {
                        const isExpanded = expandedCategories.has(category._id);
                        const hasSubcategories =
                          category.subcategories &&
                          category.subcategories.length > 0;

                        return (
                          <div key={category._id}>
                            <div className="flex items-center gap-2">
                              {hasSubcategories && (
                                <button
                                  onClick={() => toggleCategory(category._id)}
                                  className="p-1 hover:bg-primary-100 rounded transition-colors"
                                >
                                  <FiChevronRight
                                    className={`text-gray-400 transition-transform duration-200 ${
                                      isExpanded ? "rotate-90" : ""
                                    }`}
                                    size={14}
                                  />
                                </button>
                              )}
                              <button
                                className={`flex-1 text-left px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                                  selectedCategory?._id === category._id
                                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                                    : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                                } ${hasSubcategories ? "" : "ml-8"}`}
                                onClick={() =>
                                  handleCategoryFilter(category._id)
                                }
                              >
                                {category.name}
                              </button>
                            </div>
                            {hasSubcategories && isExpanded && (
                              <div className="ml-6 mt-1 space-y-1">
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
                                      setExpandedCategories(
                                        (prev) =>
                                          new Set([...prev, category._id])
                                      );
                                      fetchProducts(subcat._id);
                                      setShowMobileFilters(false);
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-1 h-1 rounded-full bg-primary-400"></span>
                                      <span className="font-medium">
                                        {subcat.name}
                                      </span>
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

                  {selectedCategory && (
                    <button
                      onClick={() => {
                        handleCategoryFilter(null);
                        setShowMobileFilters(false);
                      }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header - Desktop */}
            {selectedCategory && (
              <div className="hidden lg:block bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg shadow-sm border border-primary-200 px-6 py-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-primary-900 mb-1">
                      {selectedCategory.name}
                    </h2>
                    {selectedCategory.description && (
                      <p className="text-sm text-gray-600">
                        {selectedCategory.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-primary-200 shadow-sm">
                      <span className="text-sm text-gray-600">Showing</span>
                      <span className="text-sm font-bold text-primary-700">
                        {filteredProducts.length}
                      </span>
                      <span className="text-sm text-gray-600">products</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Header - Mobile */}
            {selectedCategory && (
              <div className="lg:hidden bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg shadow-sm border border-primary-200 px-4 py-3 mb-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-primary-900">
                      {selectedCategory.name}
                    </h2>
                    <span className="text-sm font-bold text-primary-700 bg-white px-2 py-1 rounded">
                      {filteredProducts.length}
                    </span>
                  </div>
                  {selectedCategory.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {selectedCategory.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Search Results Info */}
            {searchQuery && (
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiSearch className="text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Search Results for "{searchQuery}"
                      </p>
                      <p className="text-xs text-blue-600">
                        Found {filteredProducts.length} products
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-primary-100">
                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-600 mb-6"></div>
                <p className="text-gray-600 font-medium">Loading products...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Please wait a moment
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-primary-100">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiPackage className="w-10 h-10 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `No products found for "${searchQuery}"`
                    : selectedCategory
                    ? `No products available in "${selectedCategory.name}" category.`
                    : "No products available at the moment."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {selectedCategory && (
                    <button
                      onClick={() => handleCategoryFilter(null)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FiGrid />
                      Browse All Products
                    </button>
                  )}
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
                    >
                      <FiX />
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Featured Products First */}
                {filteredProducts.filter((p) => p.featured).length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <FiStar className="text-yellow-500" />
                      <h3 className="text-lg font-bold text-gray-900">
                        Featured Products
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                      {filteredProducts
                        .filter((p) => p.featured)
                        .map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                  </div>
                )}

                {/* All Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Results Count */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-primary-200 rounded-lg">
                    <span className="text-sm text-gray-600">
                      Showing {filteredProducts.length} of {products.length}{" "}
                      products
                    </span>
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
