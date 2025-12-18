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
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="container mx-auto px-4 py-4 flex-grow flex flex-col">
          {/* Breadcrumb - Compact */}
          <nav className="text-xs text-gray-500 mb-4 flex items-center space-x-2">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link to={`/category/${product.category.slug}`} className="hover:text-blue-600">{product.category.name}</Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
          </nav>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[500px]">
            {/* Left Column: Images - Fixed Width */}
            <div className="md:w-1/3 border-r border-gray-100 bg-white p-6 flex flex-col">
              <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg mb-4 p-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="max-w-full max-h-[300px] object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No Image</div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="w-16 h-16 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:border-blue-500">
                      <img
                        src={getImageUrl(image)}
                        alt={`Thumb ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Details - Scrollable */}
            <div className="md:w-2/3 flex flex-col h-full overflow-hidden">
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-1 rounded">
                      Code: {product.orderCode}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-1">{product.name}</h1>
                    <div className="flex items-center gap-2">
                       <span className="text-2xl font-bold text-emerald-600">₹{product.price || '0'}</span>
                       <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">per Unit</span>
                    </div>
                  </div>
                  {product.featured && (
                    <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span>⭐</span> Featured
                    </div>
                  )}
                </div>

                <div className="prose prose-sm prose-blue max-w-none text-gray-600 mb-6">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
                  <p>{product.description}</p>
                </div>

                {product.specifications && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Specifications</h3>
                    <div 
                      className="prose prose-sm prose-blue max-w-none text-gray-600 [&>table]:w-full [&>table]:border-collapse [&>table]:border [&>table]:border-gray-200 [&>table_th]:bg-gray-50 [&>table_th]:text-left [&>table_th]:p-2 [&>table_td]:p-2 [&>table_td]:border [&>table_td]:border-gray-200"
                      dangerouslySetInnerHTML={{ __html: product.specifications }} 
                    />
                  </div>
                )}
              </div>

              {/* Bottom Actions - Fixed */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4">
                 <div className="text-xs text-gray-500">
                    Need help? <a href="mailto:info@tesca.in" className="text-blue-600 hover:underline">Contact Support</a>
                 </div>
                 <div className="flex gap-3">
                    <button
                      className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setShowModal(true)}
                      disabled={!product.brochure?.path}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      {product.brochure?.path ? 'Download Brochure' : 'No Brochure'}
                    </button>
                 </div>
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

