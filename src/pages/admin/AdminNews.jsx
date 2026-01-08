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
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Globe,
} from "lucide-react";

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
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

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
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
    if (!window.confirm("Delete this news item?")) {
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
    if (!window.confirm(`Delete ${selectedNews.size} news items?`)) {
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

  const sortedNews = useMemo(() => {
    const sortableItems = [...news];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [news, sortConfig]);

  const filteredNews = useMemo(() => {
    return sortedNews.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedNews, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
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

  return (
    <>
      <div className="space-y-3">
        {/* Header - Compact */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">
              News
            </h1>
            <p className="text-xs text-gray-600">
              Total: {stats.total} • Active: {stats.active} • With Links:{" "}
              {stats.withLinks}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedNews.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded font-medium transition-colors flex items-center gap-1 text-xs"
              >
                <Trash2 className="w-3 h-3" />
                Delete ({selectedNews.size})
              </button>
            )}
            <button
              onClick={handleNew}
              className="px-3 py-1.5 bg-primary-500 text-white hover:bg-primary-600 rounded font-medium transition-all flex items-center gap-1 text-xs"
            >
              <Plus className="w-3 h-3" />
              Add News
            </button>
          </div>
        </div>

        {/* Search - Compact */}
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 placeholder:text-gray-400 text-xs"
            />
          </div>
        </div>

        {/* News Table - Ultra Compact */}
        {filteredNews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <Newspaper className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {searchTerm ? "No news found" : "No news yet"}
            </h3>
            <p className="text-gray-600 text-xs">
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first news article"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNew}
                className="px-3 py-1.5 bg-primary-500 text-white hover:bg-primary-600 rounded font-medium transition-all flex items-center gap-1 text-xs mt-2 mx-auto"
              >
                <Plus className="w-3 h-3" />
                Add First News
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="relative overflow-auto max-h-[calc(100vh-250px)]">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-2 py-1.5 text-left w-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedNews.size === filteredNews.length &&
                            filteredNews.length > 0
                          }
                          onChange={selectAllNews}
                          className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </th>
                    <th className="px-1 py-1.5 text-left font-medium text-gray-700">
                      Image
                    </th>
                    <th
                      className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("title")}
                    >
                      <div className="flex items-center gap-0.5">
                        Title
                        {sortConfig.key === "title" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowDown className="w-2.5 h-2.5" />
                          ))}
                      </div>
                    </th>
                    <th className="px-1 py-1.5 text-left font-medium text-gray-700">
                      Source
                    </th>
                    <th
                      className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("order")}
                    >
                      <div className="flex items-center gap-0.5">
                        Order
                        {sortConfig.key === "order" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowDown className="w-2.5 h-2.5" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-0.5">
                        Created
                        {sortConfig.key === "createdAt" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowDown className="w-2.5 h-2.5" />
                          ))}
                      </div>
                    </th>
                    <th className="px-1 py-1.5 text-left font-medium text-gray-700 w-16">
                      Status
                    </th>
                    <th className="px-1 py-1.5 text-left font-medium text-gray-700 w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredNews.map((item) => (
                    <tr
                      key={item._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedNews.has(item._id) ? "bg-primary-50" : ""
                      }`}
                    >
                      <td className="px-2 py-1.5">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedNews.has(item._id)}
                            onChange={() => toggleSelectNews(item._id)}
                            className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      </td>
                      <td className="px-1 py-1.5">
                        {item.image ? (
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="w-12 h-9 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-9 rounded bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <ImageIcon className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-1 py-1.5">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {item.title}
                          </div>
                          <div className="text-gray-600 truncate text-[10px]">
                            {item.description?.substring(0, 60) ||
                              "No description"}
                            ...
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-1.5">
                        {item.originalUrl ? (
                          <a
                            href={item.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center"
                            title="View Source"
                          >
                            <ExternalLink className="w-3 h-3 text-blue-600" />
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-1 py-1.5">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          {item.order || 0}
                        </span>
                      </td>
                      <td className="px-1 py-1.5">
                        <div className="space-y-0.5">
                          <div className="text-gray-900 font-medium">
                            {getTimeAgo(item.createdAt)}
                          </div>
                          <div className="text-gray-500">
                            {formatDate(item.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-1.5">
                        <span
                          className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.isActive ? (
                            <Eye className="w-2.5 h-2.5" />
                          ) : (
                            <EyeOff className="w-2.5 h-2.5" />
                          )}
                        </span>
                      </td>
                      <td className="px-1 py-1.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          {item.originalUrl && (
                            <a
                              href={item.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="View Source"
                            >
                              <Globe className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* News Modal - Compact */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white p-3 sticky top-0 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">
                  {editingNews ? "Edit News" : "Add News"}
                </h3>
                <p className="text-primary-100 text-[10px] mt-0.5">
                  {editingNews ? "Update article" : "Create new article"}
                </p>
              </div>
              <button
                className="p-0.5 hover:bg-white/20 rounded transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="News title"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                  placeholder="News description"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Image
                </label>
                {editingNews && editingNews.image && (
                  <div className="mb-2 p-1.5 bg-gray-50 rounded border border-gray-200">
                    <div className="flex items-center gap-2">
                      <img
                        src={getImageUrl(editingNews.image)}
                        alt="Current"
                        className="w-10 h-8 rounded object-cover"
                      />
                      <div className="text-xs text-gray-700">Current image</div>
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Original URL
                </label>
                <input
                  type="url"
                  name="originalUrl"
                  value={formData.originalUrl}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Source URL (optional)"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      Active
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded font-medium transition-colors text-xs"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-1.5 bg-primary-500 text-white hover:bg-primary-600 rounded font-medium transition-all text-xs"
                >
                  {editingNews ? "Update" : "Create"}
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
