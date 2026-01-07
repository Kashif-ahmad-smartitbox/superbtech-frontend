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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
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
      link: "/admin/products",
      subItems: [
        {
          label: "Active",
          value: stats?.products?.active || 0,
          color: "bg-green-500",
        },
        {
          label: "Inactive",
          value: stats?.products?.inactive || 0,
          color: "bg-gray-400",
        },
      ],
    },
    {
      title: "Categories",
      value: stats?.categories?.total || 0,
      icon: FolderTree,
      color: "from-secondary-500 to-secondary-600",
      link: "/admin/categories",
      subItems: [
        {
          label: "Active",
          value: stats?.categories?.active || 0,
          color: "bg-green-500",
        },
        {
          label: "Inactive",
          value: stats?.categories?.inactive || 0,
          color: "bg-gray-400",
        },
      ],
    },
    {
      title: "Enquiries",
      value: stats?.enquiries?.total || 0,
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      link: "/admin/enquiries",
      subItems: [
        {
          label: "New",
          value: stats?.enquiries?.pending || 0,
          color: "bg-blue-500",
        },
        {
          label: "Recent (7d)",
          value: stats?.enquiries?.recent || 0,
          color: "bg-amber-500",
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
      hoverColor: "hover:border-primary-200",
      link: "/admin/products",
    },
    {
      title: "Add New Category",
      description: "Create a new product category",
      icon: Plus,
      color: "from-secondary-500 to-secondary-600",
      hoverColor: "hover:border-secondary-200",
      link: "/admin/categories",
    },
    {
      title: "View Enquiries",
      description: "Check customer enquiries",
      icon: Eye,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:border-purple-200",
      link: "/admin/enquiries",
    },
    {
      title: "Manage News",
      description: "Update news & articles",
      icon: Newspaper,
      color: "from-emerald-500 to-emerald-600",
      hoverColor: "hover:border-emerald-200",
      link: "/admin/news",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-primary-600">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-primary-50 rounded-xl border border-primary-100">
          <Clock className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-primary-700">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${card.color} shadow-md`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {card.subItems.map((subItem, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100"
                  >
                    <div className={`w-2 h-2 rounded-full ${subItem.color}`} />
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
                <span className="text-sm font-medium text-primary-600 group-hover/link:text-primary-700 transition-colors">
                  View Details
                </span>
                <div className="p-1.5 rounded-lg bg-primary-50 group-hover/link:bg-primary-100 transition-colors">
                  <svg
                    className="w-4 h-4 text-primary-500 group-hover/link:text-primary-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary-900">
              Quick Actions
            </h2>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.link}
                  className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br ${action.color} shadow-md`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {action.description}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-primary-50 transition-colors">
                      <svg
                        className="w-4 h-4 text-gray-500 group-hover:text-primary-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
