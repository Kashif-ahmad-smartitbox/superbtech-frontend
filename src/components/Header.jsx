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
} from "react-icons/fi";
import { HiOutlineArrowRight, HiOutlineExternalLink } from "react-icons/hi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import api from "../utils/api";
import logo from "../assests/super-logo.jpeg";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCategories();

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

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCatalog = () => {
    navigate("/catalog");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "shadow-lg bg-white border-b border-primary-100/50 backdrop-blur-sm"
          : "bg-white border-b border-gray-100"
      }`}
    >
      {/* Top Announcement Bar - Hidden on Mobile */}
      <div className="hidden sm:block bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%223%22%2F%3E%3Ccircle%20cx%3D%2213%22%20cy%3D%2213%22%20r%3D%223%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 text-sm">
            <div className="flex items-center gap-6 mb-2 sm:mb-0">
              <a
                href="mailto:info@superbtechnologies.in"
                className="hover:text-primary-200 transition-all duration-300 flex items-center gap-2 group"
              >
                <div className="p-1.5 bg-primary-800/30 rounded-lg group-hover:bg-primary-700/50 transition-colors">
                  <FiMail size={14} />
                </div>
                <span className="font-medium hidden sm:inline">
                  info@superbtechnologies.in
                </span>
              </a>
              <a
                href="tel:+919829132777"
                className="hover:text-secondary-300 transition-all duration-300 flex items-center gap-2 group"
              >
                <div className="p-1.5 bg-secondary-800/30 rounded-lg group-hover:bg-secondary-700/50 transition-colors">
                  <FiPhone size={14} />
                </div>
                <span className="font-medium">+91 98291 32777</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary-800/40 to-primary-700/40 px-3 py-1.5 rounded-full border border-primary-700/30 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 bg-secondary-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-xs font-semibold tracking-wide">
                  24/7 Expert Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="relative p-1.5">
                <img
                  src={logo}
                  alt="Superb Technologies Logo"
                  className="h-10 lg:h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-500 relative z-10"
                />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-sm lg:text-xl font-bold bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 bg-clip-text text-transparent tracking-tight">
                Superb Technologies
              </h1>
              <p className="text-[8px] text-gray-600 font-semibold tracking-[0.2em] uppercase mt-0.5">
                Laboratory Equipment
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {/* Home Link */}
            <Link
              to="/"
              className={`px-5 py-2.5 font-semibold text-sm tracking-wide transition-all duration-300 rounded-xl group relative overflow-hidden ${
                isActive("/")
                  ? "text-primary-700"
                  : "text-gray-800 hover:text-primary-800 hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-primary-100/50"
              }`}
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <FiHome
                  size={17}
                  className={
                    isActive("/")
                      ? "text-primary-600"
                      : "text-gray-500 group-hover:text-primary-600"
                  }
                />
                <span>Home</span>
              </div>
            </Link>

            {/* Products Dropdown */}
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-5 py-2.5 font-semibold text-sm tracking-wide text-gray-800 hover:text-primary-800 bg-gradient-to-r hover:from-primary-50/50 hover:to-primary-100/50 rounded-xl transition-all duration-300 flex items-center gap-2.5 group relative"
              >
                <div className="relative">
                  <FiPackage
                    size={17}
                    className="text-gray-500 group-hover:text-primary-600"
                  />
                  {dropdownOpen && (
                    <div className="absolute -inset-1 bg-primary-200/30 rounded-full blur-sm"></div>
                  )}
                </div>
                <span>Products</span>
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
                className={`absolute left-0 top-full mt-1.5 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden transition-all duration-300 origin-top ${
                  dropdownOpen
                    ? "scale-100 opacity-100 visible translate-y-0"
                    : "scale-95 opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-5 py-3.5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative flex items-center gap-2.5">
                    <TbBrandGoogleAnalytics
                      className="text-white/90"
                      size={20}
                    />
                    <p className="text-white font-bold text-sm tracking-wide">
                      PRODUCT CATEGORIES
                    </p>
                  </div>
                  <p className="text-primary-200 text-xs mt-1 relative">
                    Explore our laboratory equipment
                  </p>
                </div>
                <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                  {categories.map((cat, index) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center justify-between px-5 py-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 border-b border-gray-100/50 last:border-0 group/item transition-all duration-300 hover:pl-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover/item:from-primary-200 group-hover/item:to-primary-300 transition-all">
                          <span className="text-xs font-bold text-primary-700">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800 text-sm group-hover/item:text-primary-800">
                            {cat.name}
                          </span>
                        </div>
                      </div>
                      <HiOutlineArrowRight className="text-gray-400 text-sm group-hover/item:text-primary-600 group-hover/item:translate-x-1.5 transition-all duration-300" />
                    </Link>
                  ))}
                </div>
                <Link
                  to="/products"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 text-white px-5 py-3.5 text-sm font-semibold transition-all duration-300 group/cta shadow-lg"
                >
                  <span>Browse All Products</span>
                  <HiOutlineArrowRight
                    size={16}
                    className="group-hover/cta:translate-x-1.5 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Catalogue Button */}
            <button
              onClick={handleCatalog}
              className="px-5 py-2.5 font-semibold text-sm tracking-wide text-gray-800 hover:text-primary-800 bg-gradient-to-r hover:from-primary-50/50 hover:to-primary-100/50 rounded-xl transition-all duration-300 flex items-center gap-2.5 group"
            >
              <div className="relative">
                <FiFileText size={17} className="text-primary-600" />
                <div className="absolute -inset-1 bg-primary-200/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span>Catalogue</span>
              <HiOutlineExternalLink
                size={15}
                className="text-gray-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all"
              />
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Button - Hidden on Mobile */}
            <Link
              to="/admin/login"
              className="hidden md:flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-primary-900/30 group"
            >
              <FiUser size={16} />
              <span>Admin Portal</span>
            </Link>

            {/* Mobile Contact Buttons - Only visible on mobile */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href="tel:+919829132777"
                className="p-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                aria-label="Call"
              >
                <FiPhone size={18} />
              </a>
              <a
                href="mailto:info@superbtechnologies.in"
                className="p-2 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                aria-label="Email"
              >
                <FiMail size={18} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 hover:border-primary-300 transition-all duration-300 group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <div className="relative">
                  <FiX
                    size={22}
                    className="text-primary-700 group-hover:text-primary-800 transition-colors"
                  />
                </div>
              ) : (
                <div className="relative">
                  <FiMenu
                    size={22}
                    className="text-primary-700 group-hover:text-primary-800 transition-colors"
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Improved Design */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 pt-16">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute right-0 top-0 w-full max-w-sm h-full bg-white shadow-2xl overflow-y-auto animate-slideIn">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={logo}
                  alt="Superb Technologies"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <h2 className="text-lg font-bold text-primary-900">
                    Superb Technologies
                  </h2>
                  <p className="text-xs text-gray-600">Laboratory Equipment</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="p-4 space-y-1">
              {/* Home */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                  isActive("/")
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 font-semibold"
                    : "text-gray-800 hover:bg-primary-50"
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <FiHome size={20} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium">Home</span>
              </Link>

              {/* All Products */}
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-800 hover:bg-primary-50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <FiGrid size={20} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium">All Products</span>
              </Link>

              {/* Catalogue */}
              <button
                onClick={() => {
                  handleCatalog();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-800 hover:bg-primary-50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <FiBookOpen size={20} className="text-primary-600" />
                </div>
                <span className="text-sm font-medium">Product Catalogue</span>
                <HiOutlineExternalLink
                  className="ml-auto text-gray-400"
                  size={16}
                />
              </button>
            </div>

            {/* Categories Section */}
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 mb-3 px-2">
                <FiPackage className="text-primary-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Categories
                </h3>
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-800 transition-all"
                  >
                    <span className="text-sm font-medium">{cat.name}</span>
                    <HiOutlineArrowRight className="text-gray-400 text-sm" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact & Admin Section */}
            <div className="mt-6 p-4 border-t border-gray-200">
              {/* Admin Button */}
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full mb-4 px-4 py-3.5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white rounded-xl font-semibold text-center hover:shadow-xl transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2.5">
                  <FiUser size={18} />
                  <span>Admin Portal</span>
                </div>
              </Link>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 gap-3">
                <a
                  href="mailto:info@superbtechnologies.in"
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-50 to-white rounded-xl border border-primary-100 hover:border-primary-200 transition-all duration-300 group"
                >
                  <div className="p-2 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg">
                    <FiMail className="text-primary-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <p className="text-xs text-gray-600">
                      info@superbtechnologies.in
                    </p>
                  </div>
                </a>
                <a
                  href="tel:+919829132777"
                  className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-secondary-50 to-white rounded-xl border border-secondary-100 hover:border-secondary-200 transition-all duration-300 group"
                >
                  <div className="p-2 bg-gradient-to-r from-secondary-100 to-secondary-200 rounded-lg">
                    <FiPhone className="text-secondary-600" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Call Now
                    </p>
                    <p className="text-xs text-gray-600">+91 98291 32777</p>
                  </div>
                </a>
              </div>

              {/* Support Info */}
              <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-xs font-medium text-primary-800">
                    24/7 Technical Support Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            to bottom,
            var(--color-primary-600),
            var(--color-primary-700)
          );
          border-radius: 4px;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
