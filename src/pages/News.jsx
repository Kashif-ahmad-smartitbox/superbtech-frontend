import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api, { getImageUrl } from "../utils/api";
import {
  FiCalendar,
  FiExternalLink,
  FiArrowRight,
  FiArrowLeft,
  FiChevronRight,
  FiGrid,
  FiBookOpen,
} from "react-icons/fi";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get("/news");
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/30 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 text-primary-700 font-semibold rounded-lg border border-primary-200 hover:border-primary-300 transition-all duration-300 hover:shadow-md hover:-translate-x-1 group"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline text-sm">Back to Home</span>
          </Link>

          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-700 transition-colors">
              Home
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-primary-900 font-semibold">
              News & Updates
            </span>
          </nav>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-600 bg-clip-text text-transparent">
              News Center
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            Stay updated with the latest announcements, product launches, and
            industry insights from Superb Technologies
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-primary-100 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <FiBookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    News Filter
                  </h3>
                  <p className="text-xs text-gray-500">Browse by category</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg shadow-md flex items-center justify-between">
                  <span>All News</span>
                  <FiCalendar className="w-4 h-4" />
                </button>
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-primary-100">
                <h4 className="text-lg font-bold text-primary-800 mb-4">
                  News Stats
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total Articles
                    </span>
                    <span className="text-lg font-bold text-primary-700">
                      {news.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="text-lg font-bold text-primary-700">
                      {
                        news.filter((item) => {
                          const date = new Date(item.createdAt);
                          const now = new Date();
                          return (
                            date.getMonth() === now.getMonth() &&
                            date.getFullYear() === now.getFullYear()
                          );
                        }).length
                      }
                    </span>
                  </div>
                  <div className="pt-3 border-t border-primary-200">
                    <div className="flex items-center gap-2 text-sm text-primary-600">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Updated regularly
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
                <h4 className="font-bold text-primary-800 mb-2">
                  Need Equipment?
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Explore our product catalog for all your laboratory needs.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
                >
                  <FiGrid />
                  Browse Products
                </Link>
              </div>
            </div>
          </aside>

          {/* News Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-primary-100">
                <div className="inline-block animate-spin rounded-full h-14 w-14 border-4 border-primary-200 border-t-primary-600"></div>
                <p className="mt-6 text-gray-600">Loading news articles...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-primary-100">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No News Available
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Check back soon for the latest news and updates from Superb
                  Technologies.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <FiGrid />
                  Browse Our Products
                </Link>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {news.length > 0 && (
                  <div className="mb-5 group">
                    <div
                      className="bg-white rounded-2xl border border-primary-100 overflow-hidden hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
                      onClick={() =>
                        news[0].originalUrl &&
                        window.open(news[0].originalUrl, "_blank")
                      }
                    >
                      <div className="md:flex">
                        <div className="md:w-2/5">
                          <div className="relative h-64 md:h-full">
                            {news[0].image ? (
                              <img
                                src={getImageUrl(news[0].image)}
                                alt={news[0].title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                                <FiBookOpen className="w-16 h-16 text-white/70" />
                              </div>
                            )}
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                              <div className="flex items-center gap-1.5 text-primary-700 text-sm font-semibold">
                                <FiCalendar className="w-4 h-4" />
                                {formatDate(news[0].createdAt)}
                              </div>
                            </div>
                            <div className="absolute top-4 right-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                              Featured
                            </div>
                          </div>
                        </div>
                        <div className="md:w-3/5 p-6 md:p-8">
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">
                            {news[0].title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {news[0].description}
                          </p>
                          {news[0].originalUrl && (
                            <div className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:text-primary-800 transition-colors">
                              Read Full Article
                              <FiExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {news.slice(1).map((item) => (
                    <article
                      key={item._id}
                      className="group bg-white rounded-xl border border-primary-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer"
                      onClick={() =>
                        item.originalUrl &&
                        window.open(item.originalUrl, "_blank")
                      }
                    >
                      {/* Image */}
                      <div className="h-48 bg-gradient-to-br from-primary-50 to-secondary-50 relative overflow-hidden">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiBookOpen className="w-16 h-16 text-primary-400" />
                          </div>
                        )}
                        {/* Date Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md">
                          <div className="flex items-center gap-1 text-primary-700 text-xs font-semibold">
                            <FiCalendar className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-primary-100">
                          {item.originalUrl ? (
                            <div className="flex items-center gap-2 text-primary-600 font-medium text-sm group-hover:text-primary-800 transition-colors">
                              Read More
                              <FiExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">
                              From Superb Technologies
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load More / Pagination */}
                <div className="mt-12 text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <span>Showing {news.length} articles</span>
                    <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                    <span>Stay updated for more</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Looking for Laboratory Equipment?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Explore our wide range of high-quality laboratory and scientific
            equipment for educational and research purposes.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-700 font-bold rounded-lg hover:bg-primary-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            Browse All Products
            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default News;
