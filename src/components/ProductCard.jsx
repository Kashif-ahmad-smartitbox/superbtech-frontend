import React, { useState } from "react";
import { Link } from "react-router-dom";
import EnquiryModal from "./EnquiryModal";
import { getImageUrl } from "../utils/api";

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleEnquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <div className="group relative bg-white rounded-xl border border-primary-100 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-white">
          {!imageError && product.images && product.images.length > 0 ? (
            <img
              src={getImageUrl(product.images[0])}
              alt={product.name}
              className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-4">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-primary-700 font-semibold text-center text-sm">
                {product.name}
              </span>
              <span className="text-primary-400 text-xs mt-1">
                Laboratory Equipment
              </span>
            </div>
          )}

          {/* Category Badge */}
          {product.category?.name && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg uppercase tracking-wide max-w-[70%] truncate">
              {product.category.name}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Product Name */}
          <h3 className="text-gray-900 font-bold text-sm leading-tight mb-2 min-h-[2.5rem] line-clamp-2 group-hover:text-primary-700 transition-colors">
            {product.name}
          </h3>

          {/* Product Code */}
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-3.5 h-3.5 text-primary-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-xs text-primary-600 font-semibold tracking-wide bg-primary-50 px-2 py-1 rounded truncate flex-1">
              {product.orderCode ||
                "ST-" + product._id?.slice(-6).toUpperCase()}
            </span>
          </div>

          {/* Description Preview */}
          {product.description && (
            <div className="mb-3 flex-grow">
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {product.description.replace(/<[^>]*>/g, '').substring(0, 100)}
                {product.description.replace(/<[^>]*>/g, '').length > 100 ? '...' : ''}
              </p>
            </div>
          )}

          {/* Availability Status */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
            <span className="text-xs text-gray-600 font-medium truncate">
              In Stock
            </span>
            <span className="text-xs text-gray-400 ml-auto truncate">
              Ready to Ship
            </span>
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-col sm:flex-row gap-2">
            {/* View Details Button */}
            <Link
              to={`/products/${product.slug}-${product._id}`}
              className="px-3 py-2 bg-gradient-to-r from-primary-50 to-white text-primary-700 hover:text-white hover:from-primary-600 hover:to-primary-700 text-xs font-semibold rounded-lg transition-all duration-300 border border-primary-200 hover:border-primary-600 shadow-sm hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-1.5 group flex-1 min-w-0"
            >
              <svg
                className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="truncate">View Details</span>
            </Link>

            {/* Enquire Now Button */}
            <button
              className="px-3 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white text-xs font-bold rounded-lg transition-all duration-300 border border-primary-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center gap-1.5 flex-1 min-w-0"
              onClick={handleEnquiry}
            >
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="truncate">Enquire Now</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <EnquiryModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ProductCard;
