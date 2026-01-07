import React, { useState } from "react";
import {
  Outlet,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  MessageSquare,
  Newspaper,
  LogOut,
  Home,
  Menu,
  X,
  ChevronRight,
  Settings,
  Users,
} from "lucide-react";
import logo from "../../assests/favicon.png";

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600 font-semibold text-sm">
            Loading
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItems = [
    {
      to: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    {
      to: "/admin/categories",
      icon: FolderTree,
      label: "Categories",
    },
    {
      to: "/admin/products",
      icon: Package,
      label: "Products",
    },
    {
      to: "/admin/enquiries",
      icon: MessageSquare,
      label: "Enquiries",
      badge: "12",
    },
    {
      to: "/admin/news",
      icon: Newspaper,
      label: "News",
    },
  ];

  return (
    <div className="h-screen flex bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <aside
        className={`
          hidden lg:flex flex-col
          bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800
          text-primary-100
          border-r border-primary-700/50
          transition-all duration-300 ease-in-out
          shadow-xl
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        {/* Logo & Brand */}
        <div className="h-24 border-b border-primary-700/50">
          <div className="h-full flex items-center px-4">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Superb Technologies"
                className={`transition-all duration-300 ${
                  isCollapsed ? "w-12" : "w-14"
                }`}
              />
              {!isCollapsed && (
                <div className="flex flex-col transition-all duration-300 overflow-hidden animate-fadeIn">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent whitespace-nowrap">
                    SuperbTech
                  </span>
                  <span className="text-xs text-primary-300 whitespace-nowrap">
                    Admin Panel
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                title={isCollapsed ? item.label : ""}
                className={`
                  relative flex items-center h-12 rounded-xl
                  transition-all duration-200 group
                  ${isCollapsed ? "justify-center px-0" : "px-4 gap-3"}
                  ${
                    isActive
                      ? "bg-gradient-to-r from-primary-600/90 to-primary-500/90 shadow-lg shadow-primary-500/20 text-white"
                      : "hover:bg-primary-700/50 hover:shadow-md hover:shadow-primary-900/10"
                  }
                `}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute -left-2 top-2 bottom-2 w-1 bg-gradient-to-b from-secondary-400 to-secondary-300 rounded-r-full shadow shadow-secondary-400" />
                )}

                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-primary-300 group-hover:text-white"
                    } ${
                      isCollapsed && isActive
                        ? "scale-110"
                        : "group-hover:scale-110"
                    }`}
                  />
                  {isCollapsed && isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary-400 rounded-full shadow shadow-secondary-400" />
                  )}
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm font-medium tracking-wide">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow shadow-red-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {isCollapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow shadow-red-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Controls */}
        <div className="p-4 space-y-3 border-t border-primary-700/50">
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-full h-11 flex items-center justify-center gap-2
              rounded-xl bg-primary-800/30 hover:bg-primary-700/50
              transition-all duration-200 group
              ${isCollapsed ? "px-0" : "px-3"}
            `}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-lg bg-primary-700/50">
              <svg
                className={`w-4 h-4 transition-all duration-300 ${
                  isCollapsed
                    ? "rotate-180 text-secondary-300"
                    : "text-primary-300"
                } group-hover:text-secondary-300 group-hover:scale-110`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </div>
            {!isCollapsed && (
              <span className="text-sm text-primary-300 group-hover:text-white transition-colors">
                {isCollapsed ? "Expand" : "Collapse"}
              </span>
            )}
          </button>

          {!isCollapsed && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-primary-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || "Admin"}
                </p>
                <p className="text-xs text-primary-300 truncate">
                  {user.email || "admin@superbtech.com"}
                </p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full h-11 flex items-center rounded-xl
              transition-all duration-200 group
              bg-gradient-to-r from-red-600/20 to-red-700/10
              hover:from-red-600/30 hover:to-red-700/20
              hover:shadow-md hover:shadow-red-900/10
              ${isCollapsed ? "justify-center px-0" : "px-4 gap-3"}
            `}
          >
            <div className="relative">
              <LogOut
                className={`w-5 h-5 transition-transform duration-200 ${
                  isCollapsed ? "" : "group-hover:scale-110"
                } text-red-400 group-hover:text-red-300`}
              />
              {isCollapsed && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>
            {!isCollapsed && (
              <span className="text-sm font-medium text-red-400 group-hover:text-red-300">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* ================= MOBILE SIDEBAR ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-primary-950 to-primary-900 shadow-2xl animate-slideIn">
            <div className="h-24 flex items-center justify-between px-6 border-b border-primary-700/50">
              <div className="flex items-center gap-3">
                <img src={logo} alt="SuperbTech" className="w-12" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold bg-gradient-to-r from-primary-200 via-white to-secondary-200 bg-clip-text text-transparent">
                    SuperbTech
                  </span>
                  <span className="text-xs text-primary-300">Admin Panel</span>
                </div>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.to);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center h-12 px-4 rounded-xl gap-3
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg"
                          : "text-primary-300 hover:bg-primary-700/50 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="text-xs px-2 py-1 rounded-full bg-red-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-700/50">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-800/50 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.name || "Admin"}
                  </p>
                  <p className="text-xs text-primary-300">
                    {user.email || "admin@superbtech.com"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200/50 flex items-center px-4 md:px-6 justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <Menu className="w-5 h-5 text-primary-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow shadow-primary-500/30">
                {(() => {
                  const matchedItem = navItems.find((i) =>
                    location.pathname.startsWith(i.to)
                  );
                  if (matchedItem && matchedItem.icon) {
                    const IconComponent = matchedItem.icon;
                    return <IconComponent className="w-4 h-4 text-white" />;
                  }
                  return null;
                })()}
              </div>
              <h1 className="text-lg md:text-xl font-semibold text-primary-900">
                {navItems.find((i) => location.pathname.startsWith(i.to))
                  ?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <Link
            to="/"
            target="_blank"
            className="group flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200/50 hover:border-primary-300 hover:shadow-md transition-all duration-200"
          >
            <Home className="w-4 h-4 text-primary-600 group-hover:text-primary-700" />
            <span className="text-primary-700 group-hover:text-primary-800 font-medium">
              View Site
            </span>
          </Link>
        </header>

        {/* Breadcrumb */}
        <div className="px-4 md:px-6 py-3 text-sm bg-gradient-to-r from-primary-50/50 to-secondary-50/50 border-b border-gray-200/50 flex items-center gap-2">
          <Link
            to="/admin/dashboard"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-4 h-4 text-primary-400" />
          <span className="font-semibold text-primary-900">
            {navItems.find((i) => location.pathname.startsWith(i.to))?.label ||
              "Dashboard"}
          </span>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-primary-50/30 via-transparent to-secondary-50/30">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        <div className="mt-auto p-4 border-t border-gray-200 flex self-end">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Designed with ❤️ and crafted with care by Team{" "}
            <a
              className="font-bold text-yellow-500"
              href="https://smartitbox.in"
            >
              SMART ITBOX
            </a>{" "}
            Your Business Automation Partner
          </p>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
