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
      <div className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-50">
          {product.images && product.images.length > 0 ? (
            <img 
              src={getImageUrl(product.images[0])} 
              alt={product.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          )}
          {product.category?.name && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold shadow-sm uppercase tracking-wide">
              {product.category.name}
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-white p-1 rounded-full shadow-md z-10" title="Featured">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-gray-900 font-bold text-sm leading-tight mb-2 min-h-[2rem] line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
             <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
             <span className="text-xs text-gray-400 font-mono tracking-wide">{product.orderCode || 'N/A'}</span>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3 gap-2">
            <div>
              <div className="flex items-baseline gap-1">
                 <span className="text-lg font-bold text-emerald-600">₹{product.price || '0'}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
               <Link 
                to={`/products/${product._id}`} 
                className="px-3 py-1.5 bg-gray-50 hover:bg-white text-gray-600 hover:text-blue-600 text-xs font-semibold rounded-lg transition-all border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow whitespace-nowrap"
              >
                View
              </Link>
              <button
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-bold rounded-lg transition-all border border-blue-100 hover:border-blue-600 shadow-sm hover:shadow flex items-center gap-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDownloadBrochure}
                disabled={!product.brochure}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Get Now
              </button>
            </div>
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

