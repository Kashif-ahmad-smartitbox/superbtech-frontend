import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api, { getImageUrl } from "../utils/api";
import EnquiryModal from "../components/EnquiryModal";
import {
  FiChevronRight,
  FiDownload,
  FiMail,
  FiPhone,
  FiCheck,
  FiInfo,
  FiArrowLeft,
  FiPlay,
  FiPackage,
  FiTag,
  FiStar,
  FiShield,
  FiTruck,
  FiHome,
  FiX,
  FiChevronLeft,
  FiChevronUp,
  FiChevronDown,
  FiShare2,
  FiPrinter,
  FiBookOpen,
} from "react-icons/fi";

const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const ProductDetail = () => {
  const { slugId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    specifications: false,
    experimentation: false,
    services: false,
  });
  const [showMobileThumbnails, setShowMobileThumbnails] = useState(false);

  // Extract the product ID from the slug-id format (e.g., "product-name-123abc" -> "123abc")
  // The ID is the last segment after the final hyphen, assuming MongoDB ObjectId format (24 chars)
  const extractProductId = (slugIdParam) => {
    if (!slugIdParam) return null;
    // Check if it's just an ID (legacy URL support)
    if (/^[a-f0-9]{24}$/i.test(slugIdParam)) {
      return slugIdParam;
    }
    // Extract ID from slug-id format (last 24 characters after the last hyphen)
    const lastHyphenIndex = slugIdParam.lastIndexOf('-');
    if (lastHyphenIndex !== -1) {
      const potentialId = slugIdParam.substring(lastHyphenIndex + 1);
      if (/^[a-f0-9]{24}$/i.test(potentialId)) {
        return potentialId;
      }
    }
    // Fallback: return the entire param (might be the ID itself)
    return slugIdParam;
  };

  const productId = extractProductId(slugId);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      if (!productId) {
        setLoading(false);
        return;
      }
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary-50">
        <div className="text-center">
          <div className="relative mx-auto">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary-50">
        <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-primary-100 max-w-md mx-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiInfo className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-semibold rounded-lg border border-primary-200 hover:border-primary-300 transition-all duration-300"
            >
              <FiArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link
              to="/products"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300"
            >
              <FiPackage className="w-4 h-4" />
              All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-primary-50">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-primary-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 px-3">
                <h1 className="text-sm font-semibold text-gray-900 truncate">
                  {product.name}
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  {product.orderCode}
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="px-3 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                <FiMail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-4">
          {/* Breadcrumb Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 mb-6">
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
            <span className="text-primary-900 font-semibold truncate">
              {product.name}
            </span>
          </nav>

          {/* Main Product Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column: Images - Mobile */}
            <div className="lg:hidden">
              <div className="relative aspect-square bg-white rounded-2xl mb-4 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[activeImage])}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-3">
                        <FiPackage className="w-10 h-10 text-primary-400" />
                      </div>
                      <span className="text-primary-600 font-semibold">
                        Laboratory Equipment
                      </span>
                    </div>
                  </div>
                )}

                {/* Mobile Thumbnail Toggle */}
                {product.images && product.images.length > 1 && (
                  <button
                    onClick={() =>
                      setShowMobileThumbnails(!showMobileThumbnails)
                    }
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1"
                  >
                    <span>View {product.images.length} Images</span>
                    {showMobileThumbnails ? (
                      <FiChevronDown className="w-3 h-3" />
                    ) : (
                      <FiChevronUp className="w-3 h-3" />
                    )}
                  </button>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <FiStar className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                  {product.new && (
                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <span>NEW</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Thumbnails */}
              {showMobileThumbnails &&
                product.images &&
                product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveImage(index);
                          setShowMobileThumbnails(false);
                        }}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
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
            </div>

            {/* Left Column: Images - Desktop */}
            <div className="hidden lg:flex lg:w-2/5 flex-col">
              <div className="bg-white rounded-2xl border border-primary-100 p-6 sticky top-24">
                <div className="relative aspect-square bg-white rounded-2xl mb-6 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[activeImage])}
                      alt={product.name}
                      className="w-full h-full object-contain p-8 hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-8">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-4">
                          <FiPackage className="w-12 h-12 text-primary-400" />
                        </div>
                        <span className="text-primary-600 font-semibold">
                          Laboratory Equipment
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.featured && (
                      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <FiStar className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                    {product.new && (
                      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <span>NEW</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === index
                            ? "border-primary-500 shadow-md"
                            : "border-primary-100 hover:border-primary-300"
                        }`}
                      >
                        <img
                          src={getImageUrl(image)}
                          alt={`Thumb ${index}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Product Info Card */}
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
                    <div className="flex items-center gap-3 mb-2">
                      <FiTag className="text-primary-600" />
                      <div>
                        <div className="text-sm font-semibold text-primary-800">
                          Product Code
                        </div>
                        <div className="text-lg font-bold text-primary-900">
                          {product.orderCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div>
                        <div className="text-sm font-semibold text-green-800">
                          Stock Status
                        </div>
                        <div className="text-sm text-green-700">
                          In Stock • Ready to Ship
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="lg:w-3/5">
              <div className="bg-white rounded-2xl border border-primary-100 p-4 lg:p-8">
                {/* Product Header */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h1>
                      {product.category?.name && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 rounded-full text-sm font-medium">
                          <FiTag className="w-3 h-3" />
                          {product.category.name}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                        title="Print"
                      >
                        <FiPrinter className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)}
                        className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <FiMail className="w-4 h-4" />
                        Request Quote
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions - Mobile */}
                  <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                    >
                      <FiMail className="w-4 h-4" />
                      <span>Request</span>
                    </button>
                    {product.brochure?.path && (
                      <a
                        href={product.brochure.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span>Brochure</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Navigation Menu - Mobile */}
                <div className="lg:hidden mb-6">
                  <div className="flex overflow-x-auto gap-2 pb-2">
                    {[
                      "description",
                      "specifications",
                      "experimentation",
                      "services",
                      "video",
                    ].map((section) => {
                      if (
                        (section === "specifications" &&
                          !product.specifications) ||
                        (section === "experimentation" &&
                          !product.experimentation) ||
                        (section === "services" && !product.servicesRequired) ||
                        (section === "video" && !product.youtubeLink)
                      ) {
                        return null;
                      }
                      return (
                        <button
                          key={section}
                          onClick={() => scrollToSection(section)}
                          className="flex-shrink-0 px-3 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors"
                        >
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                  {/* Description */}
                  <section id="description">
                    <div className="lg:hidden mb-4">
                      <button
                        onClick={() => toggleSection("description")}
                        className="flex items-center justify-between w-full text-left text-lg font-bold text-primary-800"
                      >
                        <span>Description</span>
                        {expandedSections.description ? (
                          <FiChevronUp className="w-5 h-5" />
                        ) : (
                          <FiChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <div
                      className={`${
                        expandedSections.description ? "block" : "hidden"
                      } lg:block`}
                    >
                      <h2 className="hidden lg:block text-lg font-bold text-primary-800 mb-3">
                        Description
                      </h2>
                      <div className="prose prose-sm max-w-none text-gray-600 bg-primary-50 rounded-xl p-4 border border-primary-100">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: product.description,
                          }}
                          className="leading-relaxed"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Specifications */}
                  {product.specifications && (
                    <section id="specifications">
                      <div className="lg:hidden mb-4">
                        <button
                          onClick={() => toggleSection("specifications")}
                          className="flex items-center justify-between w-full text-left text-lg font-bold text-primary-800"
                        >
                          <span>Key Features</span>
                          {expandedSections.specifications ? (
                            <FiChevronUp className="w-5 h-5" />
                          ) : (
                            <FiChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div
                        className={`${
                          expandedSections.specifications ? "block" : "hidden"
                        } lg:block`}
                      >
                        <h2 className="hidden lg:block text-lg font-bold text-primary-800 mb-3">
                          Key Features
                        </h2>
                        <div
                          className="prose prose-sm max-w-none text-gray-600 bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 border border-primary-100"
                          dangerouslySetInnerHTML={{
                            __html: product.specifications,
                          }}
                        />
                      </div>
                    </section>
                  )}

                  {/* Experimentation */}
                  {product.experimentation && (
                    <section id="experimentation">
                      <div className="lg:hidden mb-4">
                        <button
                          onClick={() => toggleSection("experimentation")}
                          className="flex items-center justify-between w-full text-left text-lg font-bold text-primary-800"
                        >
                          <span>Experimentation</span>
                          {expandedSections.experimentation ? (
                            <FiChevronUp className="w-5 h-5" />
                          ) : (
                            <FiChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div
                        className={`${
                          expandedSections.experimentation ? "block" : "hidden"
                        } lg:block`}
                      >
                        <h2 className="hidden lg:block text-lg font-bold text-primary-800 mb-3">
                          Experimentation
                        </h2>
                        <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 border border-primary-100">
                          {product.experimentation
                            .split("\n")
                            .filter((line) => line.trim())
                            .map((line, index) => (
                              <div key={index} className="text-gray-600 mb-2">
                                {line.trim()}
                              </div>
                            ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Services Required */}
                  {product.servicesRequired && (
                    <section id="services">
                      <div className="lg:hidden mb-4">
                        <button
                          onClick={() => toggleSection("services")}
                          className="flex items-center justify-between w-full text-left text-lg font-bold text-primary-800"
                        >
                          <span>Services Required</span>
                          {expandedSections.services ? (
                            <FiChevronUp className="w-5 h-5" />
                          ) : (
                            <FiChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div
                        className={`${
                          expandedSections.services ? "block" : "hidden"
                        } lg:block`}
                      >
                        <h2 className="hidden lg:block text-lg font-bold text-primary-800 mb-3">
                          Services Required
                        </h2>
                        <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 border border-primary-100">
                          {product.servicesRequired
                            .split("\n")
                            .filter((line) => line.trim())
                            .map((line, index) => (
                              <div key={index} className="text-gray-600 mb-2">
                                {line.trim()}
                              </div>
                            ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* YouTube Video */}
                  {product.youtubeLink &&
                    getYouTubeVideoId(product.youtubeLink) && (
                      <section id="video">
                        <div className="lg:hidden mb-4">
                          <button
                            onClick={() => toggleSection("video")}
                            className="flex items-center justify-between w-full text-left text-lg font-bold text-primary-800"
                          >
                            <span className="flex items-center gap-2">
                              <FiPlay className="text-red-600" />
                              Product Video
                            </span>
                            {expandedSections.video ? (
                              <FiChevronUp className="w-5 h-5" />
                            ) : (
                              <FiChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <div
                          className={`${
                            expandedSections.video ? "block" : "hidden"
                          } lg:block`}
                        >
                          <h2 className="hidden lg:block text-lg font-bold text-primary-800 mb-3 flex items-center gap-2">
                            <FiPlay className="text-red-600" />
                            Product Video
                          </h2>
                          <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-4 border border-primary-100">
                            <div
                              className="relative w-full"
                              style={{ paddingBottom: "56.25%" }}
                            >
                              <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                  product.youtubeLink
                                )}`}
                                title="Product Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </div>
                      </section>
                    )}
                </div>

                {/* Benefits Cards */}
                <div className="mt-8 pt-6 border-t border-primary-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                        <FiShield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-primary-800 mb-1">
                          Quality Certified
                        </div>
                        <div className="text-xs text-gray-600">
                          Manufactured under ISO standards
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                        <FiTruck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-primary-800 mb-1">
                          Worldwide Shipping
                        </div>
                        <div className="text-xs text-gray-600">
                          Export to 5+ countries
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact CTA */}
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-bold text-primary-900 mb-2">
                        Interested in this product?
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get detailed specifications, pricing, and technical
                        support
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowModal(true)}
                        className="flex-1 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                      >
                        <FiMail className="w-5 h-5" />
                        Request Detailed Quote
                      </button>
                      {product.brochure?.path && (
                        <a
                          href={product.brochure.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                          <FiDownload className="w-5 h-5" />
                          Download Brochure
                        </a>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="mt-6 pt-4 border-t border-primary-200">
                      <div className="flex flex-col sm:flex-row gap-4 text-sm">
                        <a
                          href="mailto:info@superbtechnologies.in"
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors"
                        >
                          <FiMail className="w-4 h-4" />
                          info@superbtechnologies.in
                        </a>
                        <a
                          href="tel:+919829132777"
                          className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors"
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
