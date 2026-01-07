import React, { useState, useEffect, useMemo } from "react";
import api, { getImageUrl } from "../../utils/api";
import {
  Edit2,
  Trash2,
  Plus,
  X,
  Search,
  Image as ImageIcon,
  ExternalLink,
  Newspaper,
  Calendar,
  Eye,
  EyeOff,
  Filter,
  ArrowUpDown,
  Grid,
  List,
  MoreVertical,
  Globe,
  TrendingUp,
  Clock,
  Link as LinkIcon,
} from "lucide-react";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedNews, setSelectedNews] = useState(new Set());
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalUrl: "",
    isActive: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get("/news/all");
      setNews(response.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectNews = (newsId) => {
    const newSelected = new Set(selectedNews);
    if (newSelected.has(newsId)) {
      newSelected.delete(newsId);
    } else {
      newSelected.add(newsId);
    }
    setSelectedNews(newSelected);
  };

  const selectAllNews = () => {
    if (selectedNews.size === filteredNews.length && filteredNews.length > 0) {
      setSelectedNews(new Set());
    } else {
      const allIds = filteredNews.map((item) => item._id);
      setSelectedNews(new Set(allIds));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("originalUrl", formData.originalUrl);
      submitData.append("isActive", formData.isActive);
      submitData.append("order", formData.order);

      if (imageFile) {
        submitData.append("images", imageFile);
      }

      if (editingNews) {
        await api.put(`/news/${editingNews._id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/news", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowModal(false);
      setEditingNews(null);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error("Error saving news:", error);
      alert(error.response?.data?.message || "Error saving news");
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      originalUrl: newsItem.originalUrl || "",
      isActive: newsItem.isActive,
      order: newsItem.order || 0,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this news item? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting news");
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedNews.size} news items?`
      )
    ) {
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedNews).map((id) => api.delete(`/news/${id}`))
      );
      setSelectedNews(new Set());
      fetchNews();
    } catch (error) {
      alert("Error deleting news items");
    }
  };

  const handleNew = () => {
    setEditingNews(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      originalUrl: "",
      isActive: true,
      order: 0,
    });
    setImageFile(null);
  };

  const filteredNews = useMemo(() => {
    return news.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [news, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const stats = {
    total: news.length,
    active: news.filter((n) => n.isActive).length,
    withLinks: news.filter((n) => n.originalUrl).length,
    recent: news.filter((n) => {
      const date = new Date(n.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length,
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

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary-900 mb-1">
              News Management
            </h1>
            <p className="text-sm text-primary-600">
              Manage your news articles and announcements
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedNews.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedNews.size})
              </button>
            )}
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add News
            </button>
          </div>
        </div>

        {/* Stats - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-3 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-primary-600 mb-0.5">
                  Total News
                </p>
                <p className="text-xl font-bold text-primary-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary-500/10">
                <Newspaper className="w-4 h-4 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 mb-0.5">
                  Active
                </p>
                <p className="text-xl font-bold text-green-900">
                  {stats.active}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 mb-0.5">
                  With Links
                </p>
                <p className="text-xl font-bold text-blue-900">
                  {stats.withLinks}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <LinkIcon className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-3 border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-amber-600 mb-0.5">
                  Recent (7d)
                </p>
                <p className="text-xl font-bold text-amber-900">
                  {stats.recent}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls - Compact */}
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search news by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 placeholder:text-gray-400 text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-primary-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* News List/Grid */}
        {filteredNews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Newspaper className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {searchTerm ? "No news found" : "No news yet"}
            </h3>
            <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or clear the search to see all news."
                : "Get started by creating your first news article."}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 rounded-lg font-medium transition-all shadow-sm hover:shadow flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Your First News
              </button>
            )}
          </div>
        ) : viewMode === "list" ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Single table container with fixed header and scrollable body */}
            <div className="relative overflow-auto max-h-[calc(100vh-450px)]">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left min-w-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedNews.size === filteredNews.length &&
                            filteredNews.length > 0
                          }
                          onChange={selectAllNews}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[100px] whitespace-nowrap">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">
                      Title & Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[100px] whitespace-nowrap">
                      Source Link
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[80px] whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[100px] whitespace-nowrap">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredNews.map((item) => (
                    <tr
                      key={item._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedNews.has(item._id) ? "bg-primary-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedNews.has(item._id)}
                            onChange={() => toggleSelectNews(item._id)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="w-16 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900 text-sm mb-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-2">
                            {item.description || "No description"}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              Order: {item.order || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {item.originalUrl ? (
                          <a
                            href={item.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Source
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No source link
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <div className="text-xs text-gray-900 font-medium">
                            {formatDate(item.createdAt)}
                          </div>
                          <div className="text-xs text-primary-600">
                            {getTimeAgo(item.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {item.originalUrl && (
                            <a
                              href={item.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="View Source"
                            >
                              <Globe className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredNews.map((item) => (
              <div
                key={item._id}
                className={`bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all ${
                  selectedNews.has(item._id) ? "ring-1 ring-primary-500" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedNews.has(item._id)}
                        onChange={() => toggleSelectNews(item._id)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                    <div className="flex flex-col">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">
                        Order: {item.order || 0}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(item.createdAt)}
                  </span>
                </div>

                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-40 rounded-lg object-cover mb-3"
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3">
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}

                <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    {item.originalUrl ? (
                      <a
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Source
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">No source</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* News Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">
                  {editingNews ? "Edit News" : "Add New News"}
                </h3>
                <p className="text-primary-100 text-xs mt-0.5">
                  {editingNews
                    ? "Update news article"
                    : "Create a new news article"}
                </p>
              </div>
              <button
                className="p-1 hover:bg-white/20 rounded transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-4 space-y-4 overflow-y-auto flex-1"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Enter news title"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                  placeholder="Enter news description"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  News Image
                </label>
                {editingNews && editingNews.image && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(editingNews.image)}
                        alt="Current"
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">Current Image</p>
                        <p className="text-xs text-gray-500">
                          Will be replaced if you upload a new image
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Original URL
                </label>
                <input
                  type="url"
                  name="originalUrl"
                  value={formData.originalUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="https://example.com/original-article"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to the original news source (optional)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div>
                      <span className="font-semibold text-gray-700 text-sm">
                        Active
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Show on website
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 rounded-lg font-medium transition-all shadow-sm hover:shadow text-sm"
                >
                  {editingNews ? "Update News" : "Create News"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNews;
