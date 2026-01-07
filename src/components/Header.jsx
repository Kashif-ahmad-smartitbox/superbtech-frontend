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
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, handler]);
};

// Navigation items configuration
const NAV_ITEMS = [
  { path: "/", label: "Home", icon: FiHome },
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

// Category item component with products
const CategoryItem = ({
  category,
  index,
  isExpanded,
  onToggle,
  onSelect,
  level = 0,
  expandedProducts,
  onToggleProducts,
}) => {
  const hasSubcategories = category.subcategories?.length > 0;
  const hasProducts = category.products?.length > 0;
  const hasChildren = hasSubcategories || hasProducts;
  const location = useLocation();
  const isActive = location.pathname === `/category/${category.slug}`;
  const isProductsExpanded = expandedProducts?.has(`products-${category._id}`);

  return (
    <div>
      <div className="flex items-center gap-1">
        {hasChildren && (
          <button
            onClick={onToggle}
            className="p-1 hover:bg-primary-100 rounded transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${
              category.name
            }`}
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
          to={`/category/${category.slug}`}
          onClick={onSelect}
          className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-300 hover:shadow-sm flex-1 min-w-0 group/item ${
            hasChildren ? "" : "ml-6"
          } ${
            isActive
              ? "bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 shadow-sm"
              : "border-transparent hover:border-primary-100 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100"
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center group-hover/item:from-primary-200 group-hover/item:to-primary-300 transition-all shadow-sm flex-shrink-0">
              <span className="text-xs font-bold text-primary-700">
                {index + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={`font-semibold text-xs block truncate ${
                  isActive
                    ? "text-primary-800"
                    : "text-gray-800 group-hover/item:text-primary-800"
                }`}
              >
                {category.name}
              </span>
              {category.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 truncate">
                  {category.description}
                </p>
              )}
            </div>
          </div>
          {!hasChildren && (
            <HiOutlineArrowRight className="text-gray-400 text-xs group-hover/item:text-primary-600 group-hover/item:translate-x-1 transition-all duration-300 flex-shrink-0 ml-2" />
          )}
        </Link>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4 pl-2 border-l-2 border-primary-100 mt-1 mb-1">
          {/* Subcategories */}
          {hasSubcategories && category.subcategories.map((subcat) => (
            <CategoryItem
              key={subcat._id}
              category={subcat}
              index={0}
              level={level + 1}
              onSelect={onSelect}
              isExpanded={expandedProducts?.has(subcat._id)}
              onToggle={() => onToggleProducts && onToggleProducts(subcat._id)}
              expandedProducts={expandedProducts}
              onToggleProducts={onToggleProducts}
            />
          ))}
          {/* Products under category */}
          {hasProducts && (
            <div className="mt-1">
              <button
                onClick={() => onToggleProducts && onToggleProducts(`products-${category._id}`)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50 rounded-md w-full transition-colors"
              >
                <FiChevronRight
                  className={`text-secondary-400 transition-transform duration-200 ${
                    isProductsExpanded ? "rotate-90" : ""
                  }`}
                  size={10}
                />
                <FiPackage size={10} className="text-secondary-500" />
                <span className="font-medium">Products ({category.products.length})</span>
              </button>
              {isProductsExpanded && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {category.products.map((product) => (
                    <Link
                      key={product._id}
                      to={`/products/${product.slug}-${product._id}`}
                      onClick={onSelect}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 hover:text-primary-700 hover:bg-primary-50 rounded-md transition-colors group/product"
                    >
                      {product.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-6 h-6 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <FiPackage size={10} className="text-gray-400" />
                        </div>
                      )}
                      <span className="truncate flex-1 group-hover/product:text-primary-700">
                        {product.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {product.orderCode}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [expandedProducts, setExpandedProducts] = useState(new Set());

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const scrolled = useScrollDetection(20);

  // Click outside handlers
  useClickOutside(dropdownRef, () => setDropdownOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

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

      // Auto-expand parent category if current route is a subcategory
      const currentPath = location.pathname;
      if (currentPath.startsWith("/category/")) {
        const slug = currentPath.replace("/category/", "");
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
  }, [location.pathname]);

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

  const handleCatalog = () => {
    // Add catalog functionality here
    console.log("Open catalog");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleProducts = (productKey) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productKey)) {
        newSet.delete(productKey);
      } else {
        newSet.add(productKey);
      }
      return newSet;
    });
  };

  const isActive = (path) => location.pathname === path;

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

            {/* Enhanced Products Dropdown */}
            <div className="relative group" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-5 py-2 font-semibold text-sm tracking-wide text-gray-800 hover:text-primary-800 bg-gradient-to-r hover:from-secondary-50/70 hover:to-secondary-100/70 rounded-xl transition-all duration-300 flex items-center gap-2.5 group relative border border-transparent hover:border-secondary-100 focus:outline-none"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className="relative">
                  <div
                    className={`p-1.5 rounded-lg transition-all ${
                      dropdownOpen
                        ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                        : "bg-primary-100 group-hover:bg-gradient-to-r group-hover:from-secondary-500 group-hover:to-secondary-600"
                    }`}
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
                className={`absolute left-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/80 overflow-hidden transition-all duration-300 origin-top ${
                  dropdownOpen
                    ? "scale-100 opacity-100 visible translate-y-0"
                    : "scale-95 opacity-0 invisible -translate-y-2"
                }`}
                role="menu"
                aria-label="Product categories"
              >
                <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-4 py-3 relative overflow-hidden">
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

                <div className="max-h-[28rem] overflow-y-auto custom-scrollbar p-1">
                  {categories.map((cat, index) => (
                    <CategoryItem
                      key={cat._id}
                      category={cat}
                      index={index}
                      isExpanded={expandedCategories.has(cat._id)}
                      onToggle={() => toggleCategory(cat._id)}
                      onSelect={() => setDropdownOpen(false)}
                      expandedProducts={expandedProducts}
                      onToggleProducts={toggleProducts}
                    />
                  ))}
                </div>

                <Link
                  to="/products"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 text-white px-4 py-2.5 text-xs font-semibold transition-all duration-300 group/cta shadow-lg focus:outline-none"
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

              {/* All Products */}
              <Link
                to="/products"
                onClick={closeMobileMenu}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isActive("/products")
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 font-semibold border border-primary-200 shadow-sm"
                    : "text-gray-800 hover:bg-primary-50 hover:border hover:border-primary-100"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center shadow-sm group-hover:from-primary-200 group-hover:to-secondary-200 transition-all flex-shrink-0 group-hover:scale-105">
                  <FiGrid
                    size={22}
                    className={
                      isActive("/products")
                        ? "text-primary-600"
                        : "text-primary-500 group-hover:text-primary-600"
                    }
                  />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium">All Products</span>
                  <p className="text-xs text-gray-500">
                    Complete equipment range
                  </p>
                </div>
                <FiChevronRight
                  className={`ml-auto text-sm transition-all duration-200 flex-shrink-0 ${
                    isActive("/products")
                      ? "text-primary-600"
                      : "text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1"
                  }`}
                />
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
                    Quick Categories
                  </h3>
                  <p className="text-xs text-gray-600">
                    Browse popular equipment types
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
                            {cat.subcategories.length} subcategories
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}

                {/* View All Categories Button */}
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
