import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { getImageUrl } from "../utils/api";

const CategoryCard = ({ category }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group bg-white rounded-lg border border-primary-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1 block"
    >
      {/* Image Container */}
      <div className="relative h-24 bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-bl-full opacity-10"></div>

        {/* Image */}
        <div className="relative z-10 w-full h-full p-2 flex items-center justify-center">
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-white to-primary-50 p-0.5 shadow-inner">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
              {category.image && !imageError ? (
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/0 via-primary-900/0 to-primary-900/5 group-hover:to-primary-900/10 transition-all duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-3 text-center relative">
        {/* Icon */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-md">
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xs font-semibold text-primary-800 group-hover:text-primary-700 transition-colors mb-1 mt-1 line-clamp-2 min-h-[2.5rem]">
          {category.name}
        </h3>

        {/* Description */}
        {category.description && (
          <p className="text-xs text-gray-500 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
};

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate initial display count (2 rows based on grid)
  // For responsive grid: 2 cols (mobile), 3 cols (sm), 4 cols (md), 5 cols (lg), 6 cols (xl)
  // Show 12 categories initially (2 rows on xl with 6 cols, or more rows on smaller screens)
  const initialCount = 12;
  const displayedCategories = showAll ? categories : categories.slice(0, initialCount);
  const hasMore = categories.length > initialCount;

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="mt-4 text-primary-700 font-medium text-sm">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Our <span className="text-primary-600">Product Categories</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm">
            Explore our comprehensive range of engineering laboratory equipment
            designed for educational institutions and industrial research
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayedCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>

        {/* View More Button */}
        {hasMore && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>View More Categories</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Show Less Button (when all are shown) */}
        {showAll && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setShowAll(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
              <span>Show Less</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
