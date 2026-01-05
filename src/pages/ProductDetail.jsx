import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Added useNavigate
import api, { getImageUrl } from "../utils/api";
import EnquiryModal from "../components/EnquiryModal";
import {
  FiChevronRight,
  FiDownload,
  FiMail,
  FiPhone,
  FiCheck,
  FiInfo,
  FiArrowLeft, // Added back arrow icon
  FiPlay,
} from "react-icons/fi";

// Helper function to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Added for navigation
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          <p className="mt-4 text-primary-700 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-primary-100">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiInfo className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product not found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <FiArrowLeft className="rotate-180" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50 flex flex-col">
        <div className="container mx-auto px-4 pt-4">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 text-primary-700 font-semibold rounded-lg border border-primary-200 hover:border-primary-300 transition-all duration-300 hover:shadow-md hover:-translate-x-1 group"
            >
              <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back</span>
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-primary-700 transition-colors">
                Home
              </Link>
              <FiChevronRight className="w-4 h-4 text-gray-400" />
              <Link
                to="/products"
                className="hover:text-primary-700 transition-colors"
              >
                Products
              </Link>
              {product.category && (
                <>
                  <FiChevronRight className="w-4 h-4 text-gray-400" />
                  <Link
                    to={`/category/${product.category.slug}`}
                    className="hover:text-primary-700 transition-colors"
                  >
                    {product.category.name}
                  </Link>
                </>
              )}
              <FiChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-primary-900 font-semibold truncate max-w-xs">
                {product.name}
              </span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4 flex-grow">
          <div className="bg-white overflow-hidden">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Left Column: Images */}
              <div className="lg:w-2/5 border-r border-primary-100 p-6">
                {/* Main Image */}
                <div className="relative aspect-square bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl mb-6 p-8 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[activeImage])}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-16 h-16 text-primary-400"
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
                      <span className="text-primary-700 font-semibold">
                        Laboratory Equipment
                      </span>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          activeImage === index
                            ? "border-primary-500 shadow-md"
                            : "border-primary-100 hover:border-primary-300"
                        }`}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`Thumb ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Code */}
                <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-primary-600"
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
                    <span className="text-sm font-semibold text-primary-800">
                      Product Code
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary-900">
                    {product.orderCode}
                  </div>
                </div>
              </div>

              {/* Right Column: Details */}
              <div className="lg:w-3/5 p-6 lg:p-8">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                          {product.name}
                        </h1>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600 font-medium">
                            In Stock
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            Ready to Ship
                          </span>
                        </div>
                      </div>
                      {product.category?.name && (
                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          {product.category.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-primary-800 mb-3 flex items-center gap-2">
                      <FiInfo className="text-primary-600" />
                      Description
                    </h2>
                    <div className="prose prose-sm prose-primary max-w-none text-gray-600 bg-primary-50 rounded-lg p-4 border border-primary-100">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                        className="leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Key Features */}
                  {product.specifications && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-primary-800 mb-3">
                        Key Features
                      </h2>
                      <div
                        className="prose prose-sm prose-primary max-w-none text-gray-600 bg-gradient-to-br from-primary-50 to-white rounded-lg p-4 border border-primary-100"
                        dangerouslySetInnerHTML={{
                          __html: product.specifications,
                        }}
                      />
                    </div>
                  )}

                  {/* Experimentation */}
                  {product.experimentation && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-primary-800 mb-3">
                        Experimentation
                      </h2>
                      <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-4 border border-primary-100">
                        {product.experimentation.split('\n').filter(line => line.trim()).map((line, index) => (
                          <div key={index} className="text-gray-600 mb-2">
                            {line.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Services Required */}
                  {product.servicesRequired && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-primary-800 mb-3">
                        Services Required
                      </h2>
                      <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-4 border border-primary-100">
                        {product.servicesRequired.split('\n').filter(line => line.trim()).map((line, index) => (
                          <div key={index} className="text-gray-600 mb-2">
                            {line.trim()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Video */}
                  {product.youtubeLink && getYouTubeVideoId(product.youtubeLink) && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-primary-800 mb-3 flex items-center gap-2">
                        <FiPlay className="text-red-600" />
                        Product Video
                      </h2>
                      <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg p-4 border border-primary-100">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(product.youtubeLink)}`}
                            title="Product Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="mt-auto pt-6 border-t border-primary-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                          <FiCheck className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-primary-800">
                            Quality Certified
                          </div>
                          <div className="text-xs text-gray-600">
                            Manufactured under ISO standards
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                          <FiDownload className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-primary-800">
                            Documentation
                          </div>
                          <div className="text-xs text-gray-600">
                            Complete technical specifications
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-4">
                      <button
                        className="w-full px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm"
                        onClick={() => setShowModal(true)}
                      >
                        <FiMail />
                        {product.brochure?.path ? "Request Quote & Download Brochure" : "Request Quote"}
                      </button>
                      {product.brochure?.path && (
                        <p className="text-xs text-gray-600 text-center flex items-center justify-center gap-1">
                          <FiInfo className="w-3 h-3" />
                          Submit an enquiry to download the product brochure
                        </p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 pt-4 border-t border-primary-100">
                      <p className="text-sm text-gray-600 mb-2">
                        Need assistance?
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href="mailto:info@superbtechnologies.in"
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors text-sm"
                        >
                          <FiMail className="w-4 h-4" />
                          info@superbtechnologies.in
                        </a>
                        <a
                          href="tel:+919829132777"
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors text-sm"
                        >
                          <FiPhone className="w-4 h-4" />
                          +91 98291 32777
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <EnquiryModal product={product} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ProductDetail;
