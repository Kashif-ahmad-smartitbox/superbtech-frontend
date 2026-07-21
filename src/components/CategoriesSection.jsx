import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { getImageUrl } from "../utils/api";
import ScrollAnimatedItem from "./ScrollAnimatedItem";
import { Settings, Zap, HardHat, Beaker, Compass, Layers } from "lucide-react";

const getCategoryIcon = (name) => {
  const n = (name || "").toLowerCase();
  if (n.includes('mechanic')) return Settings;
  if (n.includes('electric')) return Zap;
  if (n.includes('civil')) return HardHat;
  if (n.includes('survey')) return Compass;
  if (n.includes('lab') || n.includes('test') || n.includes('equip')) return Beaker;
  return Layers;
};

const CategoryCard = ({ category }) => {
  const [imageError, setImageError] = useState(false);
  const Icon = getCategoryIcon(category.name);

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group bg-white rounded-2xl border border-primary-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden hover:-translate-y-2 relative h-full flex flex-col"
    >
      {/* Hover background shine */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-primary-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />

      {/* Image Container */}
      <div className="relative h-28 bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden z-10">
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 blur-xl"></div>

        {/* Image */}
        <div className="relative z-10 w-full h-full p-3 flex items-center justify-center">
          {/* 3D Bevel Box around image */}
          <div className="relative w-20 h-20 rounded-2xl bg-white border border-white shadow-[0_8px_16px_rgba(0,0,0,0.06),inset_0_4px_8px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.12),inset_0_6px_12px_rgba(255,255,255,1),inset_0_-4px_8px_rgba(0,0,0,0.06)] transition-all duration-500 group-hover:scale-110 transform-gpu group-hover:rotate-x-12 group-hover:rotate-y-12 flex items-center justify-center overflow-hidden">
            {category.image && !imageError ? (
              <img
                src={getImageUrl(category.image)}
                alt={category.name}
                className="w-[85%] h-[85%] object-cover group-hover:scale-110 transition-transform duration-700"
                onError={() => setImageError(true)}
              />
            ) : (
              <Icon
                className="w-8 h-8 text-primary-400 group-hover:scale-110 transition-transform duration-500"
                strokeWidth={1.5}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 text-center relative z-10 bg-white/80 backdrop-blur-sm flex-grow flex flex-col">
        {/* Icon Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md ring-4 ring-white group-hover:-translate-y-1 transition-transform duration-300">
            <Icon className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[13px] font-bold text-primary-900 group-hover:text-primary-700 transition-colors mb-1.5 mt-2 line-clamp-2 leading-snug">
          {category.name}
        </h3>

        {/* Description */}
        {category.description && (
          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-auto">
            {category.description}
          </p>
        )}
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-2xl transition-all duration-500 pointer-events-none z-20"></div>
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
  const displayedCategories = showAll
    ? categories
    : categories.slice(0, initialCount);
  const hasMore = categories.length > initialCount;

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-primary-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="mt-4 text-primary-700 font-medium text-sm">
              Loading categories...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <ScrollAnimatedItem animationType="fade-up" className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Our <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Product Categories</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm">
            Explore our comprehensive range of engineering laboratory equipment
            designed for educational institutions and industrial research
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4 rounded-full" />
        </ScrollAnimatedItem>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 items-stretch">
          {displayedCategories.map((category, index) => (
            <ScrollAnimatedItem key={category._id} animationType="scale-up" delay={index * 0.05} className="h-full">
              <CategoryCard category={category} />
            </ScrollAnimatedItem>
          ))}
        </div>

        {/* View More Button */}
        {hasMore && !showAll && (
          <ScrollAnimatedItem animationType="fade-up" className="text-center mt-8">
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
          </ScrollAnimatedItem>
        )}

        {/* Show Less Button (when all are shown) */}
        {showAll && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setShowAll(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
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
