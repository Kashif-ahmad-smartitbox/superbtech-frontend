import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiHome,
  FiPackage,
  FiGrid,
  FiStar,
  FiChevronRight,
  FiGlobe,
  FiHelpCircle,
  FiDownload,
  FiInfo,
} from "react-icons/fi";
import { HiOutlineArrowRight, HiOutlineExternalLink } from "react-icons/hi";
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FaWhatsapp } from "react-icons/fa";
import api from "../utils/api";
import logo from "../assests/super-logo.jpeg";
import { WindArrowDown } from "lucide-react";

// Constants
const WHATSAPP_NUMBER = "+919034815524";
const WHATSAPP_MESSAGE =
  "Hello, I'm interested in your laboratory equipment. Could you please provide more information?";
const PHONE_NUMBER = "+919896915524";
const EMAIL = "info@superbtechnologies.in";

// Custom hook for scroll detection
const useScrollDetection = (threshold = 20) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
};

// Custom hook for click outside detection
const useClickOutside = (refs, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside ALL provided refs
      const isOutsideAll = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target)
      );

      if (isOutsideAll) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs, handler]);
};

// Navigation items configuration
const NAV_ITEMS = [
  { path: "/", label: "Home", icon: FiHome },
  { path: "/products", label: "Products", icon: FiPackage, hasDropdown: true },
  { path: "/news", label: "News", icon: HiOutlineExternalLink },
  { path: "/certificates", label: "Certificates", icon: WindArrowDown },
];

// Contact button component
const ContactButton = ({
  icon: Icon,
  label,
  subLabel,
  href,
  iconClass,
  className = "",
  ...props
}) => (
  <a
    href={href}
    className={`group flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-300 border hover:scale-[1.02] ${className}`}
    {...props}
  >
    <div
      className={`p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform flex-shrink-0 ${iconClass}`}
    >
      <Icon size={12} className="text-white" />
    </div>
    <div className="text-left min-w-0">
      <p className="text-xs font-semibold text-white group-hover:text-opacity-90 truncate transition-colors">
        {label}
      </p>
      {subLabel && <p className="text-xs text-white/80 truncate">{subLabel}</p>}
    </div>
  </a>
);

const CompactCategoryItem = ({
  category,
  index,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  isActive,
  isHovered,
}) => {
  const hasSubcategories = category.subcategories?.length > 0;
  const hasProducts = category.products?.length > 0;

  const handleClick = () => {
    if (onSelect) {
      onSelect(category);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => onMouseEnter && onMouseEnter(category._id)}
      onMouseLeave={onMouseLeave}
    >
      <Link
        to={`/category/${category.slug}`}
        onClick={handleClick}
        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 min-w-0 group/item ${
          isActive || isHovered
            ? "bg-primary-50 border border-primary-200"
            : "hover:bg-primary-50 hover:border hover:border-primary-100"
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-primary-700">
            {index + 1}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <span
            className={`font-semibold text-sm block truncate ${
              isActive || isHovered
                ? "text-primary-800"
                : "text-gray-800 group-hover/item:text-primary-800"
            }`}
          >
            {category.name}
          </span>
          {hasSubcategories || hasProducts ? (
            <div className="flex items-center gap-2 mt-1">
              {hasSubcategories && (
                <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">
                  {category.subcategories.length} sub
                </span>
              )}
              {hasProducts && (
                <span className="text-[10px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded">
                  {category.products.length} items
                </span>
              )}
            </div>
          ) : null}
        </div>
        {(hasSubcategories || hasProducts) && (
          <FiChevronRight className="text-gray-400 text-xs flex-shrink-0" />
        )}
      </Link>
    </div>
  );
};

const CompactSubMenu = ({ category, onClose }) => {
  if (!category) return null;

  const hasSubcategories = category.subcategories?.length > 0;
  const hasProducts = category.products?.length > 0;

  const handleLinkClick = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="absolute left-[12px] top-0 ml-1 w-80 bg-white rounded-xl border border-gray-200 overflow-hidden z-50">
      {/* Submenu Header */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-3 border-b border-primary-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
            <FiPackage className="text-primary-700" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-primary-900 text-sm truncate">
              {category.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {hasSubcategories && (
                <span className="text-[10px] px-2 py-0.5 bg-white text-primary-600 rounded-full">
                  {category.subcategories.length} Subcategories
                </span>
              )}
              {hasProducts && (
                <span className="text-[10px] px-2 py-0.5 bg-white text-primary-600 rounded-full">
                  {category.products.length} Products
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submenu Content */}
      <div className="max-h-[400px] overflow-y-auto">
        {/* View All Button */}
        <Link
          to={`/category/${category.slug}`}
          onClick={handleLinkClick}
          className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-primary-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary-100 flex items-center justify-center">
              <FiGrid className="text-primary-600" size={14} />
            </div>
            <span className="font-medium text-sm text-primary-800">
              View All in {category.name}
            </span>
          </div>
          <HiOutlineArrowRight className="text-primary-500 text-sm group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Subcategories Section */}
        {hasSubcategories && (
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <h4 className="font-semibold text-gray-800 text-sm">
                Subcategories
              </h4>
            </div>
            <div className="space-y-2">
              {category.subcategories.map((subcat) => (
                <Link
                  key={subcat._id}
                  to={`/category/${subcat.slug}`}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors group/subcat"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate group-hover/subcat:text-blue-700">
                      {subcat.name}
                    </p>
                    {subcat.description && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {subcat.description}
                      </p>
                    )}
                  </div>
                  <FiChevronRight className="text-gray-400 text-xs group-hover/subcat:text-blue-500" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        {hasProducts && (
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h4 className="font-semibold text-gray-800 text-sm">Products</h4>
            </div>
            <div className="space-y-2">
              {category.products.slice(0, 6).map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product.slug}`}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors group/product"
                >
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FiPackage className="text-gray-400" size={14} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate group-hover/product:text-green-700">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Code: {product.orderCode}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Link */}
      {category.products && category.products.length > 6 && (
        <Link
          to={`/category/${category.slug}`}
          onClick={handleLinkClick}
          className="block px-4 py-3 text-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 border-t border-gray-100 transition-colors"
        >
          View {category.products.length - 6} more products →
        </Link>
      )}
    </div>
  );
};

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredCategoryId, setHoveredCategoryId] = useState(null);
  const dropdownRef = useRef(null);
  const submenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const scrolled = useScrollDetection(20);

  // Close mobile menu on outside click
  useClickOutside([mobileMenuRef], () => setMobileMenuOpen(false));

  // Close products dropdown on outside click
  useClickOutside([dropdownRef, submenuRef], () => {
    setDropdownOpen(false);
    setHoveredCategoryId(null);
  });

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // Fetch categories with products
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories/with-products");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Memoized values
  const whatsappUrl = useMemo(
    () =>
      `https://wa.me/${WHATSAPP_NUMBER.replace(
        /\D/g,
        ""
      )}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
    []
  );

  const contactInfo = useMemo(
    () => [
      {
        icon: FiMail,
        label: EMAIL,
        href: `mailto:${EMAIL}`,
        className:
          "bg-white/10 hover:bg-white/15 border-white/20 hover:border-white/30",
        iconClass: "bg-gradient-to-br from-primary-500 to-secondary-500",
      },
      {
        icon: FiPhone,
        label: PHONE_NUMBER,
        href: `tel:${PHONE_NUMBER.replace(/\D/g, "")}`,
        className:
          "bg-secondary-900/30 hover:bg-secondary-800 border-secondary-500/30 hover:border-secondary-400",
        iconClass: "bg-gradient-to-br from-secondary-500 to-secondary-600",
      },
      {
        icon: FaWhatsapp,
        label: WHATSAPP_NUMBER,
        href: whatsappUrl,
        className:
          "bg-[#25D366]/20 hover:bg-[#25D366]/30 border-[#25D366]/30 hover:border-[#25D366]/40",
        iconClass: "bg-gradient-to-br from-[#25D366] to-[#128C7E]",
      },
    ],
    [whatsappUrl]
  );

  // Event handlers
  const handleNews = () => {
    navigate("/news");
    closeMobileMenu();
  };

  const handleCertificates = () => {
    navigate("/certificates");
    closeMobileMenu();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleCategoryHover = (categoryId) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredCategoryId(categoryId);
  };

  const handleCategoryLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategoryId(null);
    }, 150);
  };

  const handleSubmenuEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleSubmenuLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategoryId(null);
    }, 150);
  };

  const handleCategorySelect = (category) => {
    if (category.subcategories?.length > 0 || category.products?.length > 0) {
      setHoveredCategoryId(category._id);
    } else {
      navigate(`/category/${category.slug}`);
      setDropdownOpen(false);
      setHoveredCategoryId(null);
    }
  };

  const handleSubmenuClose = () => {
    setDropdownOpen(false);
    setHoveredCategoryId(null);
  };

  const isActive = (path) => location.pathname === path;

  const hoveredCategory = categories.find(
    (cat) => cat._id === hoveredCategoryId
  );

  return (
    <header
      className={`z-50 transition-all duration-300 ${
        mobileMenuOpen
          ? "relative"
          : "sticky top-0 shadow-xl bg-white/95 backdrop-blur-lg border-b border-primary-100"
      }`}
    >
      {/* Top Announcement Bar */}
      <div className="hidden lg:block bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-secondary-500/10 to-primary-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between py-3">
            <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
              {contactInfo.map((info, index) => (
                <ContactButton key={index} {...info} />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-gradient-to-r from-primary-800/40 to-secondary-800/40 px-4 py-2 rounded-xl border border-white/20 backdrop-blur-sm shadow-lg">
                <div className="relative">
                  <div className="w-3 h-3 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full animate-pulse shadow-lg" />
                  <div className="absolute inset-0 bg-secondary-500 rounded-full animate-ping opacity-50" />
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
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group rounded-lg p-1">
            <div className="relative">
              <img
                src={logo}
                alt="Superb Technologies Logo"
                className="h-10 lg:h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-500"
                loading="eager"
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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              if (item.path === "/") {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-5 py-2 font-semibold text-sm tracking-wide transition-all duration-300 rounded-xl group relative overflow-hidden focus:outline-none ${
                      active
                        ? "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-800 shadow-md border border-secondary-200"
                        : "text-gray-800 hover:text-secondary-800 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-secondary-100/70 hover:shadow-sm hover:border hover:border-secondary-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 relative z-10">
                      <div
                        className={`p-1.5 rounded-lg transition-all ${
                          active
                            ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                            : "bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-secondary-500 group-hover:to-secondary-600"
                        }`}
                      >
                        <FiHome
                          size={16}
                          className={
                            active
                              ? "text-white"
                              : "text-primary-600 group-hover:text-white transition-colors"
                          }
                        />
                      </div>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              }

              if (item.path === "/products") {
                const active = isActive(item.path);
                return (
                  <div
                    key={item.path}
                    className="relative"
                    ref={dropdownRef} // Main dropdown container ref
                  >
                    <button
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                        if (dropdownOpen) {
                          setHoveredCategoryId(null);
                        }
                      }}
                      className={`px-5 py-2 font-semibold text-sm tracking-wide transition-all duration-300 rounded-xl flex items-center gap-2.5 group relative border focus:outline-none ${
                        active || dropdownOpen
                          ? "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-800 shadow-md border-secondary-200"
                          : "text-gray-800 hover:text-secondary-800 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-secondary-100/70 hover:shadow-sm hover:border-secondary-100 border-transparent"
                      }`}
                      aria-expanded={dropdownOpen}
                      aria-haspopup="true"
                    >
                      <div className="relative">
                        <div
                          className={`p-1.5 rounded-lg transition-all ${
                            active || dropdownOpen
                              ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                              : "bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-secondary-500 group-hover:to-secondary-600"
                          }`}
                        >
                          <FiPackage
                            size={16}
                            className={
                              active || dropdownOpen
                                ? "text-white"
                                : "text-primary-600 group-hover:text-white transition-colors"
                            }
                          />
                        </div>
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

                    {/* Main Products Dropdown */}
                    {dropdownOpen && (
                      <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-40">
                        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/10 rounded-lg">
                              <TbBrandGoogleAnalytics
                                className="text-white"
                                size={18}
                              />
                            </div>
                            <div>
                              <p className="text-white font-bold text-xs">
                                PRODUCT CATEGORIES
                              </p>
                              <p className="text-primary-200 text-[10px]">
                                Premium Laboratory Solutions
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-2" style={{ width: "280px" }}>
                          <div className="space-y-1">
                            {categories.map((cat, index) => (
                              <div key={cat._id} className="relative">
                                <CompactCategoryItem
                                  category={cat}
                                  index={index}
                                  onSelect={handleCategorySelect}
                                  onMouseEnter={handleCategoryHover}
                                  onMouseLeave={handleCategoryLeave}
                                  isActive={
                                    location.pathname ===
                                    `/category/${cat.slug}`
                                  }
                                  isHovered={hoveredCategoryId === cat._id}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <Link
                          to="/products"
                          onClick={handleSubmenuClose}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 text-white px-4 py-3 text-xs font-semibold transition-all duration-300"
                        >
                          <FiGrid size={14} />
                          <span>Browse All Products</span>
                          <HiOutlineArrowRight size={14} />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              }

              if (item.path === "/news") {
                return (
                  <button
                    key={item.path}
                    onClick={handleNews}
                    className="px-5 py-2 font-semibold text-sm tracking-wide text-gray-800 hover:text-primary-800 bg-gradient-to-r hover:from-secondary-50/70 hover:to-secondary-100/70 rounded-xl transition-all duration-300 flex items-center gap-2.5 group relative border border-transparent hover:border-secondary-100 focus:outline-none"
                  >
                    <div className="relative">
                      <div className="p-1.5 rounded-lg bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-secondary-500 group-hover:to-secondary-600 transition-all">
                        <HiOutlineExternalLink
                          size={16}
                          className="text-primary-600 group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              }

              if (item.path === "/certificates") {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-5 py-2 font-semibold text-sm tracking-wide transition-all duration-300 rounded-xl group relative overflow-hidden focus:outline-none ${
                      active
                        ? "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-800 shadow-md border border-secondary-200"
                        : "text-gray-800 hover:text-secondary-800 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-secondary-100/70 hover:shadow-sm hover:border hover:border-secondary-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 relative z-10">
                      <div
                        className={`p-1.5 rounded-lg transition-all ${
                          active
                            ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                            : "bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-secondary-500 group-hover:to-secondary-600"
                        }`}
                      >
                        <WindArrowDown
                          size={16}
                          className={
                            active
                              ? "text-white"
                              : "text-primary-600 group-hover:text-white transition-colors"
                          }
                        />
                      </div>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              }

              return null;
            })}

            <Link
              to="/about"
              className={`px-5 py-2.5 font-semibold text-sm tracking-wide transition-all duration-300 rounded-xl group relative overflow-hidden ${
                isActive("/about")
                  ? "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-800 shadow-md border border-secondary-200"
                  : "text-gray-800 hover:text-secondary-800 hover:bg-gradient-to-r hover:from-secondary-50/70 hover:to-secondary-100/70 hover:shadow-sm hover:border hover:border-secondary-100"
              }`}
            >
              <div className="flex items-center gap-2.5 relative z-10">
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive("/about")
                      ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                      : "bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-secondary-500 group-hover:to-secondary-600"
                  } transition-all`}
                >
                  <FiInfo
                    size={16}
                    className={
                      isActive("/about")
                        ? "text-white"
                        : "text-primary-600 group-hover:text-white transition-colors"
                    }
                  />
                </div>
                <span>About Us</span>
              </div>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden md:flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-primary-900/40 group relative overflow-hidden focus:outline-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Contact Us</span>
            </Link>

            {/* Mobile Contact Buttons */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={`tel:${PHONE_NUMBER.replace(/\D/g, "")}`}
                className="p-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-md focus:outline-none"
                aria-label="Call"
              >
                <FiPhone size={20} />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="p-2.5 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-xl hover:shadow-lg hover:scale-110 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2"
                aria-label="Email"
              >
                <FiMail size={20} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <FiX
                  size={22}
                  className="text-primary-700 group-hover:text-primary-800 transition-colors"
                />
              ) : (
                <FiMenu
                  size={22}
                  className="text-primary-700 group-hover:text-primary-800 transition-colors"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Submenu Container - Fixed position at top level */}
      {dropdownOpen && hoveredCategory && (
        <div
          ref={submenuRef}
          className="fixed top-full mt-2 z-50"
          style={{
            left: "50%",
            transform: "translateX(calc(-50% + 140px))",
            marginTop: "64px",
          }}
          onMouseEnter={handleSubmenuEnter}
          onMouseLeave={handleSubmenuLeave}
        >
          <CompactSubMenu
            category={hoveredCategory}
            onClose={handleSubmenuClose}
          />
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" ref={mobileMenuRef}>
          {/* Backdrop with scroll lock */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary-900/70 via-primary-800/50 to-secondary-900/30 backdrop-blur-md"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Mobile Menu Container - Fixed position */}
          <div className="fixed inset-0 bg-white shadow-2xl overflow-y-auto">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-primary-700 via-primary-600 to-primary-800 text-white p-4 pb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white backdrop-blur-sm rounded-xl border border-white/20">
                    <img
                      src={logo}
                      alt="Superb Technologies"
                      className="h-8 w-auto object-contain"
                      loading="eager"
                    />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">
                      Superb Technologies
                    </h2>
                    <p className="text-xs text-primary-200 opacity-90 mt-0.5">
                      Laboratory Equipment Specialists
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
                  aria-label="Close menu"
                >
                  <FiX size={22} className="text-white" />
                </button>
              </div>
            </div>

            {/* Navigation Content */}
            <div className="p-4 space-y-2">
              {/* Home */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 font-semibold border border-primary-200 shadow-sm"
                    : "text-gray-800 hover:bg-primary-50 hover:border hover:border-primary-100"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                  <FiHome
                    size={22}
                    className={
                      isActive("/") ? "text-primary-600" : "text-primary-500"
                    }
                  />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">Home</span>
                  <p className="text-xs text-gray-500">
                    Welcome to our platform
                  </p>
                </div>
                {isActive("/") && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse flex-shrink-0" />
                )}
              </Link>

              {/* Products - Mobile */}
              <div className="space-y-1">
                <div
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive("/products") ||
                    location.pathname.startsWith("/category/") ||
                    location.pathname.startsWith("/products/")
                      ? "bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 shadow-sm"
                      : "hover:bg-primary-50 hover:border hover:border-primary-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center shadow-sm flex-shrink-0">
                    <FiPackage
                      size={22}
                      className={
                        isActive("/products") ||
                        location.pathname.startsWith("/category/") ||
                        location.pathname.startsWith("/products/")
                          ? "text-primary-600"
                          : "text-primary-500"
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">
                      Products
                    </span>
                    <p className="text-xs text-gray-500">
                      Browse all equipment
                    </p>
                  </div>
                  {(isActive("/products") ||
                    location.pathname.startsWith("/category/") ||
                    location.pathname.startsWith("/products/")) && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse flex-shrink-0" />
                  )}
                </div>

                {/* Product Categories in Mobile Menu */}
                <div className="ml-12 space-y-1 max-h-60 overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat._id}>
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                          location.pathname === `/category/${cat.slug}`
                            ? "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-800 font-semibold"
                            : "text-gray-700 hover:bg-primary-50"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-primary-400" />
                        <span className="text-sm flex-1">{cat.name}</span>
                        {cat.subcategories?.length > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {cat.subcategories.length}
                          </span>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Us - Mobile */}
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                  isActive("/about")
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 font-semibold border border-primary-200 shadow-sm"
                    : "text-gray-800 hover:bg-primary-50 hover:border hover:border-primary-100"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-sm">
                  <FiInfo size={22} className="text-primary-600" />
                </div>
                <div>
                  <span className="text-sm font-medium">About Us</span>
                  <p className="text-xs text-gray-500">
                    Learn more about our company
                  </p>
                </div>
                {isActive("/about") && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                )}
              </Link>

              {/* News */}
              <button
                onClick={handleNews}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-800 hover:bg-primary-50 hover:border hover:border-primary-100 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-100 to-primary-100 flex items-center justify-center shadow-sm group-hover:from-secondary-200 group-hover:to-primary-200 transition-all flex-shrink-0 group-hover:scale-105">
                  <HiOutlineExternalLink
                    size={22}
                    className="text-secondary-500 group-hover:text-primary-600"
                  />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium">News & Updates</span>
                  <p className="text-xs text-gray-500">Latest industry news</p>
                </div>
                <HiOutlineExternalLink className="text-gray-400 text-sm group-hover:text-primary-600 group-hover:scale-110 transition-all flex-shrink-0" />
              </button>

              {/* Certificates */}
              <Link
                to="/certificates"
                onClick={closeMobileMenu}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isActive("/certificates")
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 font-semibold border border-primary-200 shadow-sm"
                    : "text-gray-800 hover:bg-primary-50 hover:border hover:border-primary-100"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center shadow-sm group-hover:from-primary-200 group-hover:to-secondary-200 transition-all flex-shrink-0 group-hover:scale-105">
                  <WindArrowDown
                    size={22}
                    className={
                      isActive("/certificates")
                        ? "text-primary-600"
                        : "text-primary-500 group-hover:text-primary-600"
                    }
                  />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">Certificates</span>
                  <p className="text-xs text-gray-500">
                    Quality certifications & documents
                  </p>
                </div>
                <FiChevronRight
                  className={`ml-auto text-sm transition-all duration-200 flex-shrink-0 ${
                    isActive("/certificates")
                      ? "text-primary-600"
                      : "text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1"
                  }`}
                />
              </Link>
            </div>

            {/* Quick Categories */}
            <div className="px-4 py-3 mt-2">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="p-2.5 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg shadow-sm flex-shrink-0">
                  <TbBrandGoogleAnalytics
                    className="text-primary-600"
                    size={22}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Popular Categories
                  </h3>
                  <p className="text-xs text-gray-600">
                    Browse frequently viewed equipment
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 4).map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    onClick={closeMobileMenu}
                    className="block p-3 bg-gradient-to-br from-primary-50 to-white rounded-xl border border-primary-100 hover:border-primary-300 hover:shadow-sm transition-all duration-200 group/cat focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover/cat:from-primary-200 group-hover/cat:to-primary-300 transition-all">
                        <FiPackage className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-semibold text-gray-800 group-hover/cat:text-primary-700 line-clamp-2">
                          {cat.name}
                        </span>
                        {cat.subcategories?.length > 0 && (
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {cat.subcategories.length} sub
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}

                {/* View All Products Button */}
                <Link
                  to="/products"
                  onClick={closeMobileMenu}
                  className="col-span-2 p-4 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all duration-300 mt-1 flex items-center justify-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  <FiGrid size={18} />
                  <span>View All {categories.length} Categories</span>
                  <FiChevronRight className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Contact Section */}
            <div className="p-4 border-t border-gray-100 mt-4">
              <div className="space-y-3">
                {/* Support Badge */}
                <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-primary-50 to-secondary-50 px-4 py-3 rounded-xl border border-primary-100">
                  <div className="relative">
                    <div className="w-3 h-3 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full animate-pulse shadow-sm" />
                    <div className="absolute inset-0 bg-secondary-500 rounded-full animate-ping opacity-50" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-primary-800">
                      24/7
                    </span>
                    <span className="text-xs text-gray-600 ml-2">
                      Expert Technical Support
                    </span>
                  </div>
                </div>

                {/* Main Contact Button */}
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="block w-full px-4 py-3.5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 text-white rounded-xl font-bold text-center hover:shadow-xl transition-all duration-300 shadow-lg group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    <FiMail
                      size={18}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-sm">Contact Our Experts</span>
                    <HiOutlineArrowRight
                      size={16}
                      className="group-hover:translate-x-1.5 transition-transform duration-300"
                    />
                  </div>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className="w-3 h-3 text-secondary-500 fill-secondary-500"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 font-semibold">
                    Rated 4.9/5 by 1000+ Clients
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} Superb Technologies
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Laboratory Equipment Manufacturing & Supply
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
