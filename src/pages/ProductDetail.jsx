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
import ScrollAnimatedItem from "../components/ScrollAnimatedItem";

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
    window.scrollTo(0, 0);
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
              <ScrollAnimatedItem animationType="fade-up" className="bg-white/80 backdrop-blur-md rounded-2xl border border-primary-100 p-4 sticky top-24 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-shadow">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary-50 to-white rounded-2xl mb-4 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] border border-primary-100/50 group flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-secondary-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[activeImage])}
                      alt={product.name}
                      className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500 relative z-10"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center relative z-10">
                      <div className="text-center p-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                          <FiPackage className="w-10 h-10 text-primary-400" />
                        </div>
                        <span className="text-primary-600 font-semibold text-sm">
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
              </ScrollAnimatedItem>
            </div>

            {/* Right Column: Details */}
            <div className="lg:w-3/5">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-primary-100 p-5 lg:p-6 shadow-sm">
                {/* Product Header */}
                <div className="mb-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                        {product.name}
                      </h1>
                      {product.category?.name && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200/50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider">
                          <FiTag className="w-3 h-3" />
                          {product.category.name}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 hover:shadow-sm transition-all"
                        title="Print"
                      >
                        <FiPrinter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowModal(true)}
                        className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-primary-600"
                      >
                        <FiMail className="w-3.5 h-3.5" />
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
                      <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span>Brochure</span>
                      </button>
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
                  <ScrollAnimatedItem animationType="fade-up" delay={0.1}>
                    <section id="description" className="group">
                      <div className="lg:hidden mb-3">
                        <button
                          onClick={() => toggleSection("description")}
                          className="flex items-center justify-between w-full text-left text-base font-bold text-primary-800"
                        >
                          <span>Description</span>
                          {expandedSections.description ? (
                            <FiChevronUp className="w-4 h-4" />
                          ) : (
                            <FiChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div
                        className={`${
                          expandedSections.description ? "block" : "hidden"
                        } lg:block`}
                      >
                        <h2 className="hidden lg:block text-base font-bold text-primary-800 mb-2 border-l-4 border-primary-500 pl-2">
                          Description
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-700 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-colors group-hover:border-primary-100">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                            className="leading-relaxed"
                          />
                        </div>
                      </div>
                    </section>
                  </ScrollAnimatedItem>

                  {/* Specifications */}
                  {product.specifications && (
                    <ScrollAnimatedItem animationType="fade-up" delay={0.2}>
                      <section id="specifications" className="group">
                        <div className="lg:hidden mb-3">
                          <button
                            onClick={() => toggleSection("specifications")}
                            className="flex items-center justify-between w-full text-left text-base font-bold text-primary-800"
                          >
                            <span>Key Features</span>
                            {expandedSections.specifications ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div
                          className={`${
                            expandedSections.specifications ? "block" : "hidden"
                          } lg:block`}
                        >
                          <h2 className="hidden lg:block text-base font-bold text-primary-800 mb-2 border-l-4 border-secondary-500 pl-2">
                            Key Features
                          </h2>
                          <div
                            className="prose prose-sm max-w-none text-gray-700 bg-gradient-to-br from-primary-50/50 to-white rounded-xl p-4 border border-primary-100/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-colors group-hover:border-secondary-200"
                            dangerouslySetInnerHTML={{
                              __html: product.specifications,
                            }}
                          />
                        </div>
                      </section>
                    </ScrollAnimatedItem>
                  )}

                  {/* Experimentation */}
                  {product.experimentation && (
                    <ScrollAnimatedItem animationType="fade-up" delay={0.3}>
                      <section id="experimentation" className="group">
                        <div className="lg:hidden mb-3">
                          <button
                            onClick={() => toggleSection("experimentation")}
                            className="flex items-center justify-between w-full text-left text-base font-bold text-primary-800"
                          >
                            <span>Experimentation</span>
                            {expandedSections.experimentation ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div
                          className={`${
                            expandedSections.experimentation ? "block" : "hidden"
                          } lg:block`}
                        >
                          <h2 className="hidden lg:block text-base font-bold text-primary-800 mb-2 border-l-4 border-indigo-500 pl-2">
                            Experimentation
                          </h2>
                          <div className="bg-gradient-to-br from-indigo-50/30 to-white rounded-xl p-4 border border-indigo-100/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-colors group-hover:border-indigo-200">
                            {product.experimentation
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, index) => (
                                <div key={index} className="text-gray-700 mb-2 flex items-start gap-2">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></div>
                                  <span>{line.trim()}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </section>
                    </ScrollAnimatedItem>
                  )}

                  {/* Services Required */}
                  {product.servicesRequired && (
                    <ScrollAnimatedItem animationType="fade-up" delay={0.4}>
                      <section id="services" className="group">
                        <div className="lg:hidden mb-3">
                          <button
                            onClick={() => toggleSection("services")}
                            className="flex items-center justify-between w-full text-left text-base font-bold text-primary-800"
                          >
                            <span>Services Required</span>
                            {expandedSections.services ? (
                              <FiChevronUp className="w-4 h-4" />
                            ) : (
                              <FiChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <div
                          className={`${
                            expandedSections.services ? "block" : "hidden"
                          } lg:block`}
                        >
                          <h2 className="hidden lg:block text-base font-bold text-primary-800 mb-2 border-l-4 border-amber-500 pl-2">
                            Services Required
                          </h2>
                          <div className="bg-gradient-to-br from-amber-50/30 to-white rounded-xl p-4 border border-amber-100/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-colors group-hover:border-amber-200">
                            {product.servicesRequired
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, index) => (
                                <div key={index} className="text-gray-700 mb-2 flex items-start gap-2">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></div>
                                  <span>{line.trim()}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </section>
                    </ScrollAnimatedItem>
                  )}

                  {/* YouTube Video */}
                  {product.youtubeLink &&
                    getYouTubeVideoId(product.youtubeLink) && (
                      <ScrollAnimatedItem animationType="fade-up" delay={0.5}>
                        <section id="video" className="group">
                          <div className="lg:hidden mb-3">
                            <button
                              onClick={() => toggleSection("video")}
                              className="flex items-center justify-between w-full text-left text-base font-bold text-primary-800"
                            >
                              <span className="flex items-center gap-2">
                                <FiPlay className="text-red-600" />
                                Product Video
                              </span>
                              {expandedSections.video ? (
                                <FiChevronUp className="w-4 h-4" />
                              ) : (
                                <FiChevronDown className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <div
                            className={`${
                              expandedSections.video ? "block" : "hidden"
                            } lg:block`}
                          >
                            <h2 className="hidden lg:block text-base font-bold text-primary-800 mb-2 border-l-4 border-red-500 pl-2 flex items-center gap-2">
                              <FiPlay className="text-red-600" />
                              Product Video
                            </h2>
                            <div className="bg-gradient-to-br from-red-50/30 to-white rounded-xl p-4 border border-red-100/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] transition-colors group-hover:border-red-200">
                              <div
                                className="relative w-full rounded-lg overflow-hidden shadow-sm"
                                style={{ paddingBottom: "56.25%" }}
                              >
                                <iframe
                                  className="absolute top-0 left-0 w-full h-full"
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
                      </ScrollAnimatedItem>
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
                        <button
                          onClick={() => setShowModal(true)}
                          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-secondary-600 to-secondary-700 text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                          <FiDownload className="w-5 h-5" />
                          Download Brochure
                        </button>
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
                          +91 9896915524
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
