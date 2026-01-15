import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiStar,
  FiCheckCircle,
  FiTrendingUp,
  FiSettings,
} from "react-icons/fi";
import api, { getImageUrl } from "../utils/api";

const ProductShowcaseSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      // Filter products that have new, bestSeller, or featured set to true
      const filteredProducts = response.data
        .filter(
          (product) => product.new || product.bestSeller || product.featured
        )
        .slice(0, 6); // Limit to 6 products
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (product) => {
    if (product.bestSeller) return "Best Seller";
    if (product.new) return "New";
    if (product.featured) return "Featured";
    return null;
  };

  if (loading) {
    return (
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="mt-4 text-primary-700 font-medium">
              Loading products...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="relative py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Our <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">Laboratory & Training</span>{" "}
            Equipment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Professionally engineered equipment designed for academic
            excellence, industrial precision, and long-term reliability in
            research environments.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const badge = getBadge(product);
            return (
              <Link
                key={product._id}
                to={`/products/${product.slug}-${product._id}`}
                className="group bg-white rounded-2xl border border-primary-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden block relative"
              >
                {/* Image Container with Badge */}
                <div className="relative h-64 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      className="h-full w-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                        <FiSettings className="text-primary-400" size={40} />
                      </div>
                    </div>
                  )}

                  {/* Badge */}
                  {badge && (
                    <div
                      className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
                        badge === "Best Seller"
                          ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                          : badge === "Featured"
                          ? "bg-gradient-to-r from-primary-500 to-primary-600"
                          : "bg-gradient-to-r from-secondary-500 to-primary-500"
                      }`}
                    >
                      {badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title with Icon */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiSettings className="text-primary-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-primary-900 group-hover:text-primary-800 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <div 
                    className="text-gray-600 leading-relaxed mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />

                  {/* Product Code */}
                  {product.orderCode && (
                    <div className="flex items-center gap-2 mb-4 text-xs">
                      <span className="text-primary-600 font-semibold bg-primary-50 px-2 py-1 rounded">
                        {product.orderCode}
                      </span>
                    </div>
                  )}

                  {/* Quality Indicators */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className="w-3 h-3 text-secondary-500 fill-secondary-500"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        Premium Quality
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary-700 font-semibold">
                      <FiTrendingUp className="text-secondary-500" />
                      <span>Industry Grade</span>
                    </div>
                  </div>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-2xl transition-all duration-500 pointer-events-none"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
