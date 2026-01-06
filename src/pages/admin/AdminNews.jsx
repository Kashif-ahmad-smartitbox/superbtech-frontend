import React, { useState, useEffect, useMemo } from 'react';
import api, { getImageUrl } from '../../utils/api';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSearch, FiImage, FiExternalLink } from 'react-icons/fi';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalUrl: '',
    isActive: true,
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await api.get('/news/all');
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('originalUrl', formData.originalUrl);
      submitData.append('isActive', formData.isActive);
      submitData.append('order', formData.order);
      
      if (imageFile) {
        submitData.append('images', imageFile);
      }

      if (editingNews) {
        await api.put(`/news/${editingNews._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/news', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      setEditingNews(null);
      resetForm();
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
      alert(error.response?.data?.message || 'Error saving news');
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      originalUrl: newsItem.originalUrl || '',
      isActive: newsItem.isActive,
      order: newsItem.order || 0
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news item?')) {
      return;
    }
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting news');
    }
  };

  const handleNew = () => {
    setEditingNews(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      originalUrl: '',
      isActive: true,
      order: 0
    });
    setImageFile(null);
  };

  const filteredNews = useMemo(() => {
    return news.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [news, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">News Management</h2>
            <p className="text-gray-600 text-sm">Manage your news and announcements</p>
          </div>
          <button 
            className="btn btn-primary flex items-center gap-2 px-6 py-3 self-start sm:self-auto"
            onClick={handleNew}
          >
            <FiPlus className="w-5 h-5" />
            Add News
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 size-4" />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading news...</p>
          </div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No news found' : 'No news found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first news item'}
          </p>
          {!searchTerm && (
            <button onClick={handleNew} className="btn btn-primary">
              <FiPlus className="w-4 h-4 mr-2" />
              Add News
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-h-[40rem]">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Image
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Original URL
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNews.map((item, index) => (
                  <tr 
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors duration-150 text-xs"
                  >
                    <td className="px-4 py-3 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {item.image ? (
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.title}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <FiImage className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-800">{item.title}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <div className="line-clamp-2">
                        {item.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.originalUrl ? (
                        <a 
                          href={item.originalUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FiExternalLink className="w-3 h-3" />
                          Link
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
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

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {editingNews ? 'Edit News' : 'Add New News'}
              </h3>
              <button 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setShowModal(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-hide">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="News title"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="input-field resize-none"
                  placeholder="News description"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">News Image</label>
                {editingNews && editingNews.image && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                    <img 
                      src={getImageUrl(editingNews.image)} 
                      alt="Current" 
                      className="w-32 h-24 rounded-lg object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input-field"
                />
                <small className="text-gray-500 text-sm mt-1 block">
                  Upload an image for this news item
                </small>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Original URL</label>
                <input
                  type="url"
                  name="originalUrl"
                  value={formData.originalUrl}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/original-news-article"
                />
                <small className="text-gray-500 text-sm mt-1 block">
                  Link to the original news source (optional)
                </small>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  className="btn btn-secondary flex-1" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  {editingNews ? 'Update News' : 'Create News'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
