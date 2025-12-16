import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getImageUrl } from '../utils/api';
import EnquiryModal from '../components/EnquiryModal';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <Link to="/products" className="text-blue-600 hover:underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-600 mb-8 flex items-center space-x-2 animate-fade-in">
            <Link to="/" className="hover:text-blue-600 transition-colors font-medium flex items-center gap-1 group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="hover:text-blue-600 transition-colors font-medium">Products</Link>
            {product.category && (
              <>
                <span className="text-gray-400">/</span>
                <Link to={`/category/${product.category.slug}`} className="hover:text-blue-600 transition-colors font-medium">
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in animation-delay-300">
            {/* Images */}
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white group relative">
                    <img
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {product.featured && (
                      <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <span>⭐</span>
                        <span>Featured</span>
                      </div>
                    )}
                  </div>
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                      {product.images.slice(1).map((image, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-blue-300 group">
                          <img
                            src={getImageUrl(image)}
                            alt={`${product.name} ${index + 2}`}
                            className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl h-96 flex items-center justify-center shadow-xl">
                  <div className="text-center">
                    <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 font-medium">No Image Available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 animate-fade-in animation-delay-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Order Code: {product.orderCode}</span>
                  </div>
                  {product.featured && (
                    <div className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full">
                      <span className="text-xs font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1">
                        <span>⭐</span>
                        <span>Featured</span>
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                  {product.name}
                </h1>
                {product.category && (
                  <div className="flex items-center gap-2 text-gray-600 mb-6 p-4 bg-gray-50 rounded-xl">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="font-medium">Category:</span>
                    <Link 
                      to={`/category/${product.category.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors flex items-center gap-1 group"
                    >
                      {product.category.name}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 animate-fade-in animation-delay-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Description</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>

              {product.specifications && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50 animate-fade-in animation-delay-700">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Specifications</h3>
                  </div>
                  <div
                    className="text-gray-700 leading-relaxed prose prose-blue max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900"
                    dangerouslySetInnerHTML={{ __html: product.specifications }}
                  />
                </div>
              )}

              <div className="pt-6 animate-fade-in animation-delay-1000">
                <button
                  className="group relative w-full btn btn-primary text-lg py-5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => setShowModal(true)}
                  disabled={!product.brochure?.path}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {product.brochure?.path ? 'Download Brochure' : 'Brochure Not Available'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
              </div>
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

export default ProductDetail;

