import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EnquiryModal from './EnquiryModal';
import { getImageUrl } from '../utils/api';

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDownloadBrochure = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <div className="group relative card hover:-translate-y-3 hover:shadow-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-500">
        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-xl transition-all duration-500 pointer-events-none"></div>
        
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-50 rounded-t-xl">
          {product.images && product.images.length > 0 ? (
            <img 
              src={getImageUrl(product.images[0])} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
          {product.featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl flex items-center gap-1">
              <span>⭐</span> Featured
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="relative p-6 flex flex-col flex-grow">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Order Code: {product.orderCode}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-5 line-clamp-3 flex-grow leading-relaxed">
            {product.description.length > 100
              ? `${product.description.substring(0, 100)}...`
              : product.description}
          </p>
          <div className="flex gap-3 mt-auto">
            <Link 
              to={`/products/${product._id}`} 
              className="btn btn-primary flex-1 text-center text-sm py-3 group/btn relative overflow-hidden"
            >
              <span className="relative z-10">View Detail</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            </Link>
            <button
              className="btn btn-secondary flex-1 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group/btn"
              onClick={handleDownloadBrochure}
              disabled={!product.brochure?.path}
            >
              <span className="relative z-10">Get now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <EnquiryModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;

