import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiFileText,
  FiHome,
  FiPackage,
  FiUser,
  FiGrid,
  FiBookOpen,
  FiMessageSquare,
  FiStar,
  FiChevronRight,
  FiGlobe,
  FiHelpCircle,
  FiDownload,
} from "react-icons/fi";
import { HiOutlineArrowRight, HiOutlineExternalLink } from "react-icons/hi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaWhatsapp } from "react-icons/fa"; // Added WhatsApp icon
import api from "../utils/api";
import logo from "../assests/super-logo.jpeg";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);

      // Auto-expand parent category if current route is a subcategory
      const currentPath = location.pathname;
      if (currentPath.startsWith("/category/")) {
        const slug = currentPath.replace("/category/", "");
        // Find if this slug belongs to a subcategory
        for (const cat of response.data) {
          if (cat.subcategories) {
            const subcat = cat.subcategories.find((sub) => sub.slug === slug);
            if (subcat) {
              setExpandedCategories(new Set([cat._id]));
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleNews = () => {
    navigate("/news");
    setMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // WhatsApp contact details
  const whatsappNumber = "+919034815524";
  const whatsappMessage =
    "Hello, I'm interested in your laboratory equipment. Could you please provide more information?";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
    /\D/g,
    ""
  )}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-xl bg-white/95 backdrop-blur-lg border-b border-primary-100"
          : "bg-white border-b border-gray-100"
      }`}
    >
      {/* Enhanced Top Announcement Bar - Hidden on Mobile */}
      <div className="hidden lg:block bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-secondary-500/10 to-primary-500/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between py-3">
            {/* Enhanced Contact Info */}
            <div className="flex items-center gap-1 mb-2 sm:mb-0">
              {/* Email - More Prominent */}
              <a
                href="mailto:info@superbtechnologies.in"
                className="group flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-xl backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/30"
              >
                <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                  <FiMail size={12} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white group-hover:text-secondary-200 transition-colors">
                    info@superbtechnologies.in
                  </p>
                </div>
              </a>

              {/* Phone - More Prominent */}
              <a
                href="tel:+919896915524"
                className="group flex items-center gap-3 px-4 py-2 bg-secondary-900/30 hover:bg-secondary-800/40 rounded-xl backdrop-blur-sm transition-all duration-300 border border-secondary-500/30 hover:border-secondary-400/40"
              >
                <div className="p-2 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                  <FiPhone size={12} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white group-hover:text-secondary-200 transition-colors">
                    +91 98969 15524
                  </p>
                </div>
              </a>

              {/* WhatsApp Contact - New */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-xl backdrop-blur-sm transition-all duration-300 border border-[#25D366]/30 hover:border-[#25D366]/40"
              >
                <div className="p-2 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                  <FaWhatsapp size={12} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white group-hover:text-[#25D366] transition-colors">
                    +91 90348 15524
                  </p>
                </div>
              </a>
            </div>

            {/* Support Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-gradient-to-r from-primary-800/40 to-secondary-800/40 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm shadow-lg">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute inset-0 bg-secondary-500 rounded-full animate-ping opacity-50"></div>
                </div>
                <div>
                  <span className="text-sm font-bold text-white">24/7</span>
                  <span className="text-xs text-primary-200 ml-2">
                    Expert Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Enhanced Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={logo}
                alt="Superb Technologies Logo"
                className="h-10 lg:h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xs lg:text-lg font-bold bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 bg-clip-text text-transparent tracking-tight">
                Superb Technologies
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="w-2 h-2 text-secondary-500 fill-secondary-500"
                    />
                  ))}
                </div>
                <p className="text-[9px] text-gray-600 font-semibold tracking-wider uppercase">
                  Laboratory Equipment Experts
                </p>
              </div>
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Home Link */}
            <Link
              to="/"
              className={`px-5 py-2.5 font-semibold text-sm tracking-wide transition-all duration-300 rounded-xl group relative overflow-hidden ${
                isActive("/")
                  ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 shadow-md border border-primary-200"
                  : "text-gray-800 hover:text-primary-800 hover:bg-gradient-to-r hover:from-primary-50/70 hover:to-primary-100/70 hover:shadow-sm hover:border hover:border-primary-100"
              }`}
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive("/")
                      ? "bg-gradient-to-r from-primary-500 to-primary-600"
                      : "bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-primary-600"
                  } transition-all`}
                >
                  <FiHome
                    size={16}
                    className={
                      isActive("/")
                        ? "text-white"
                        : "text-primary-600 group-hover:text-white transition-colors"
                    }
                  />
                </div>
                <span>Home</span>
              </div>
            </Link>

            {/* Enhanced Products Dropdown */}
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-5 py-2.5 font-semibold text-sm tracking-wide text-gray-800 hover:text-primary-800 bg-gradient-to-r hover:from-primary-50/70 hover:to-primary-100/70 rounded-xl transition-all duration-300 flex items-center gap-2.5 group relative border border-transparent hover:border-primary-100"
              >
                <div className="relative">
                  <div
                    className={`p-1.5 rounded-lg ${
                      dropdownOpen
                        ? "bg-gradient-to-r from-primary-500 to-primary-600"
                        : "bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-primary-600"
                    } transition-all`}
                  >
                    <FiPackage
                      size={16}
                      className={
                        dropdownOpen
                          ? "text-white"
                          : "text-primary-600 group-hover:text-white transition-colors"
                      }
                    />
                  </div>
                  {dropdownOpen && (
                    <div className="absolute -inset-1 bg-primary-200/40 rounded-full blur-md"></div>
                  )}
                </div>
                <span>Category</span>
                <FiChevronDown
                  className={`transition-transform duration-300 ${
                    dropdownOpen
                      ? "rotate-180 text-primary-600"
                      : "text-gray-400 group-hover:text-primary-600"
                  }`}
                  size={16}
                />
              </button>
              <div
                className={`absolute left-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden transition-all duration-300 origin-top ${
                  dropdownOpen
                    ? "scale-100 opacity-100 visible translate-y-0"
                    : "scale-95 opacity-0 invisible -translate-y-2"
                }`}
              >
                {/* Enhanced Dropdown Header */}
                <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-4 py-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-500/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative flex items-center gap-2">
                    <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-sm">
                      <TbBrandGoogleAnalytics
                        className="text-white"
                        size={18}
                      />
                    </div>
                    <div>
                      <p className="text-white font-bold text-xs tracking-wide">
                        PRODUCT CATEGORIES
                      </p>
                      <p className="text-primary-200 text-[10px] mt-0.5">
                        Premium Laboratory Solutions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Categories List */}
                <div className="max-h-[28rem] overflow-y-auto custom-scrollbar p-1">
                  {categories.map((cat, index) => {
                    const hasSubcategories =
                      cat.subcategories && cat.subcategories.length > 0;
                    const isExpanded = expandedCategories.has(cat._id);

                    return (
                      <div key={cat._id}>
                        <div className="flex items-center gap-1">
                          {hasSubcategories && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setExpandedCategories((prev) => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(cat._id)) {
                                    newSet.delete(cat._id);
                                  } else {
                                    newSet.add(cat._id);
                                  }
                                  return newSet;
                                });
                              }}
                              className="p-1 hover:bg-primary-100 rounded transition-colors flex-shrink-0"
                            >
                              <FiChevronRight
                                className={`text-gray-400 text-xs transition-transform duration-200 ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                                size={12}
                              />
                            </button>
                          )}
                          <Link
                            to={`/category/${cat.slug}`}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center justify-between p-2 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 rounded-lg border border-transparent hover:border-primary-100 group/item transition-all duration-300 hover:shadow-sm flex-1 ${
                              hasSubcategories ? "" : "ml-6"
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover/item:from-primary-200 group-hover/item:to-primary-300 transition-all shadow-sm flex-shrink-0">
                                <span className="text-xs font-bold text-primary-700">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-gray-800 text-xs group-hover/item:text-primary-800 block truncate">
                                  {cat.name}
                                </span>
                                {cat.description && (
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 truncate">
                                    {cat.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {!hasSubcategories && (
                              <HiOutlineArrowRight className="text-gray-400 text-xs group-hover/item:text-primary-600 group-hover/item:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
                            )}
                          </Link>
                        </div>
                        {/* Subcategories - Only show when expanded */}
                        {hasSubcategories && isExpanded && (
                          <div className="ml-4 pl-2 border-l-2 border-primary-100 mt-1 mb-1">
                            {cat.subcategories.map((subcat) => (
                              <Link
                                key={subcat._id}
                                to={`/category/${subcat.slug}`}
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center justify-between p-1.5 hover:bg-primary-50 rounded-md group/sub transition-all duration-200"
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></div>
                                  <span className="font-medium text-gray-700 text-xs group-hover/sub:text-primary-700 truncate">
                                    {subcat.name}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Enhanced Footer */}
                <Link
                  to="/products"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 text-white px-4 py-2.5 text-xs font-semibold transition-all duration-300 group/cta shadow-lg"
                >
                  <FiGrid size={14} />
                  <span>Browse All Products</span>
                  <HiOutlineArrowRight
                    size={14}
                    className="group-hover/cta:translate-x-1.5 transition-transform"
                  />
                </Link>
              </div>
            </div>

            <button
              onClick={handleNews}
              className="px-5 py-2.5 font-semibold text-sm tracking-wide text-gray-800 hover:text-primary-800 bg-gradient-to-r hover:from-primary-50/70 hover:to-primary-100/70 rounded-xl transition-all duration-300 flex items-center gap-2.5 group relative border border-transparent hover:border-primary-100"
            >
              <div className="relative">
                <div className="p-1.5 rounded-lg bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-primary-600 transition-all">
                  <FiFileText
                    size={16}
                    className="text-primary-600 group-hover:text-white transition-colors"
                  />
                </div>
                <div className="absolute -inset-1 bg-primary-200/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span>News</span>
              <HiOutlineExternalLink
                size={15}
                className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
              />
            </button>
          </nav>

          {/* Enhanced Right Side Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-primary-900/40 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">Contact Us</span>
            </Link>

            {/* Enhanced Mobile Contact Buttons */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href="tel:+919896915524"
                className="p-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="Call"
              >
                <FiPhone size={20} />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <a
                href="mailto:info@superbtechnologies.in"
                className="p-2.5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-md"
                aria-label="Email"
              >
                <FiMail size={20} />
              </a>
            </div>

            {/* Enhanced Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <div className="relative">
                  <FiX
                    size={22}
                    className="text-primary-700 group-hover:text-primary-800 transition-colors"
                  />
                  <div className="absolute inset-0 bg-primary-200/30 rounded-full blur-sm"></div>
                </div>
              ) : (
                <div className="relative">
                  <FiMenu
                    size={22}
                    className="text-primary-700 group-hover:text-primary-800 transition-colors"
                  />
                  <div className="absolute inset-0 bg-primary-200/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu with Scroll Lock */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Enhanced Backdrop with gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-secondary-900/20 backdrop-blur-md"
            onClick={closeMobileMenu}
          />

          {/* Enhanced Menu Content */}
          <div className="absolute right-0 top-0 w-full h-full bg-white shadow-2xl overflow-y-auto animate-slideIn">
            {/* Enhanced Header with gradient */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-700 to-primary-800 text-white p-4 pb-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl backdrop-blur-sm border border-white/20">
                    <img
                      src={logo}
                      alt="Superb Technologies"
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Superb Technologies
                    </h2>
                    <p className="text-xs text-primary-200 opacity-90">
                      Laboratory Equipment Specialists
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 bg-white/15 hover:bg-white/25 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all"
                  aria-label="Close menu"
                >
                  <FiX size={22} className="text-white" />
                </button>
              </div>

              {/* Quick Contact Bar */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href="tel:+919829132777"
                  className="flex flex-col items-center px-2 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all group"
                >
                  <div className="p-1.5 bg-gradient-to-br from-primary-400 to-primary-500 rounded-lg mb-1">
                    <FiPhone size={14} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white">Call</p>
                    <p className="text-[10px] text-primary-100 mt-0.5">
                      98291 32777
                    </p>
                  </div>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center px-2 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-xl backdrop-blur-sm border border-[#25D366]/30 hover:border-[#25D366]/40 transition-all group"
                >
                  <div className="p-1.5 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-lg mb-1">
                    <FaWhatsapp size={14} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white">WhatsApp</p>
                    <p className="text-[10px] text-[#25D366] mt-0.5">
                      90348 15524
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:info@superbtechnologies.in"
                  className="flex flex-col items-center px-2 py-2.5 bg-secondary-900/30 hover:bg-secondary-800/40 rounded-xl backdrop-blur-sm border border-secondary-500/30 hover:border-secondary-400/40 transition-all group"
                >
                  <div className="p-1.5 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg mb-1">
                    <FiMail size={14} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white">Email</p>
                    <p className="text-[10px] text-secondary-100 mt-0.5">
                      info@...
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Enhanced Navigation Items */}
            <div className="p-4 space-y-1">
              {/* Home */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                  isActive("/")
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 font-semibold border border-primary-200 shadow-sm"
                    : "text-gray-800 hover:bg-primary-50 hover:border hover:border-primary-100"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-sm">
                  <FiHome size={22} className="text-primary-600" />
                </div>
                <div>
                  <span className="text-sm font-medium">Home</span>
                  <p className="text-xs text-gray-500">
                    Welcome to our platform
                  </p>
                </div>
                {isActive("/") && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                )}
              </Link>

              {/* All Products */}
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-800 hover:bg-primary-50 hover:border hover:border-primary-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center shadow-sm group-hover:from-primary-200 group-hover:to-secondary-200 transition-all">
                  <FiGrid
                    size={22}
                    className="text-primary-600 group-hover:text-primary-700"
                  />
                </div>
                <div>
                  <span className="text-sm font-medium">All Products</span>
                  <p className="text-xs text-gray-500">
                    Complete equipment range
                  </p>
                </div>
                <FiChevronRight className="ml-auto text-gray-400 text-sm group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
              </Link>

              {/* Catalogue */}
              <button
                onClick={handleCatalog}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-800 hover:bg-primary-50 hover:border hover:border-primary-100 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-100 to-primary-100 flex items-center justify-center shadow-sm group-hover:from-secondary-200 group-hover:to-primary-200 transition-all">
                  <FiBookOpen
                    size={22}
                    className="text-secondary-600 group-hover:text-secondary-700"
                  />
                </div>
                <div className="flex-1 ">
                  <span className="text-sm font-medium">Product Catalogue</span>
                  <p className="text-xs text-gray-500">
                    Browse organized collection
                  </p>
                </div>
                <HiOutlineExternalLink className="text-gray-400 text-sm group-hover:text-primary-600 group-hover:scale-110 transition-all" />
              </button>
            </div>

            {/* Enhanced Categories Section */}
            <div className="px-4 py-2 mt-2">
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="p-2 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg shadow-sm">
                  <FiPackage className="text-primary-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Categories</h3>
                  <p className="text-xs text-gray-600">
                    Browse by equipment type
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    onClick={closeMobileMenu}
                    className="block p-3 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100 hover:border-primary-300 text-gray-700 hover:text-primary-800 hover:shadow-sm transition-all text-sm font-medium text-center group/cat"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover/cat:from-primary-200 group-hover/cat:to-primary-300 transition-all mb-1">
                        <FiPackage className="w-3 h-3 text-primary-600" />
                      </div>
                      <span className="text-xs line-clamp-2">{cat.name}</span>
                    </div>
                  </Link>
                ))}
                <Link
                  to="/products"
                  onClick={closeMobileMenu}
                  className="col-span-2 p-3 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all mt-2 flex items-center justify-center gap-2 group"
                >
                  <FiGrid size={16} />
                  <span>View All Categories</span>
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="mt-4 p-4 border-t border-gray-200">
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="block w-full mb-4 px-4 py-3.5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white rounded-xl font-bold text-center hover:shadow-xl transition-all duration-300 shadow-lg group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center justify-center gap-2.5 relative z-10">
                  <FiUser size={18} />
                  <span>Contact Us</span>
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} Superb Technologies
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Laboratory Equipment Manufacturing
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
