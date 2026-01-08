import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import {
  Package,
  FolderTree,
  MessageSquare,
  Users,
  Newspaper,
  Settings,
  Plus,
  Eye,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await api.get("/admin/activity");
      setRecentActivity(response.data);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-12 h-12 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Products",
      value: stats?.products?.total || 0,
      icon: Package,
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50",
      textColor: "text-primary-600",
      link: "/admin/products",
      subItems: [
        {
          label: "Active",
          value: stats?.products?.active || 0,
          color: "bg-green-500",
          textColor: "text-green-700",
        },
        {
          label: "Inactive",
          value: stats?.products?.inactive || 0,
          color: "bg-gray-400",
          textColor: "text-gray-700",
        },
      ],
    },
    {
      title: "Categories",
      value: stats?.categories?.total || 0,
      icon: FolderTree,
      color: "from-secondary-500 to-secondary-600",
      bgColor: "bg-secondary-50",
      textColor: "text-secondary-600",
      link: "/admin/categories",
      subItems: [
        {
          label: "Active",
          value: stats?.categories?.active || 0,
          color: "bg-green-500",
          textColor: "text-green-700",
        },
        {
          label: "Inactive",
          value: stats?.categories?.inactive || 0,
          color: "bg-gray-400",
          textColor: "text-gray-700",
        },
      ],
    },
    {
      title: "Enquiries",
      value: stats?.enquiries?.total || 0,
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/admin/enquiries",
      subItems: [
        {
          label: "New",
          value: stats?.enquiries?.pending || 0,
          color: "bg-blue-500",
          textColor: "text-blue-700",
        },
        {
          label: "Recent (7d)",
          value: stats?.enquiries?.recent || 0,
          color: "bg-amber-500",
          textColor: "text-amber-700",
        },
      ],
    },
  ];

  const quickActions = [
    {
      title: "Add New Product",
      description: "Create a new product entry",
      icon: Plus,
      color: "from-primary-500 to-primary-600",
      bgColor: "bg-primary-50",
      hoverColor: "hover:border-primary-200",
      link: "/admin/products",
    },
    {
      title: "Add New Category",
      description: "Create a new product category",
      icon: Plus,
      color: "from-secondary-500 to-secondary-600",
      bgColor: "bg-secondary-50",
      hoverColor: "hover:border-secondary-200",
      link: "/admin/categories",
    },
    {
      title: "View Enquiries",
      description: "Check customer enquiries",
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:border-purple-200",
      link: "/admin/enquiries",
    },
    {
      title: "Manage News",
      description: "Update news & articles",
      icon: Newspaper,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      hoverColor: "hover:border-emerald-200",
      link: "/admin/news",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            Dashboard Overview
          </h1>
          <p className="text-xs text-gray-600">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100">
          <Clock className="w-3 h-3 text-primary-500" />
          <span className="text-xs font-medium text-primary-700">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-lg bg-gradient-to-br ${card.color} shadow-sm`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-3">
                {card.subItems.map((subItem, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gray-100"
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${subItem.color}`}
                    />
                    <span className="text-xs font-medium text-gray-700">
                      {subItem.label}: {subItem.value}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to={card.link}
                className="flex items-center justify-between group/link"
              >
                <span className="text-xs font-medium text-primary-600 group-hover/link:text-primary-700 transition-colors">
                  View Details
                </span>
                <div className="p-1 rounded bg-primary-50 group-hover/link:bg-primary-100 transition-colors">
                  <ChevronRight className="w-3 h-3 text-primary-500 group-hover/link:text-primary-600 transition-colors" />
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick Actions - Compact */}
      <div className="bg-white rounded-xl border border-gray-200 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-500" />
            <h2 className="text-sm font-bold text-gray-900">Quick Actions</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="group bg-white rounded-lg p-2.5 shadow-sm hover:shadow transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${action.color} shadow-sm`}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-700 transition-colors truncate">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {action.description}
                    </p>
                  </div>
                  <div className="p-1 rounded bg-gray-50 group-hover:bg-primary-50 transition-colors">
                    <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-primary-500 transition-colors" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity - Compact */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" />
              <h2 className="text-sm font-bold text-gray-900">
                Recent Activity
              </h2>
            </div>
          </div>

          <div className="space-y-2">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-1.5 rounded ${
                    activity.type === "create"
                      ? "bg-green-50"
                      : activity.type === "update"
                      ? "bg-blue-50"
                      : "bg-gray-50"
                  }`}
                >
                  {activity.type === "create" ? (
                    <Plus className="w-3 h-3 text-green-600" />
                  ) : activity.type === "update" ? (
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-900 truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
