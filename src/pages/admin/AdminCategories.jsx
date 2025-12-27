import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/api';
import { FiEdit, FiTrash2, FiPlus, FiX, FiSearch } from 'react-icons/fi';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
    order: 0,
    parent: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/all');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    // Flatten categories and subcategories for display
    const allCategories = [];
    categories.forEach(cat => {
      allCategories.push(cat);
      if (cat.subcategories && cat.subcategories.length > 0) {
        allCategories.push(...cat.subcategories);
      }
    });
    
    return allCategories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        isActive: true,
        order: 0,
        parent: ''
      });
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive,
      order: category.order || 0,
      parent: category.parent?._id || category.parent || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting category');
    }
  };

  const handleNew = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      isActive: true,
      order: 0,
      parent: ''
    });
    setShowModal(true);
  };

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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Categories Management</h2>
            <p className="text-gray-600 text-sm">Manage your product categories</p>
          </div>
          <button 
            className="btn btn-primary flex items-center gap-2 px-6 py-3 self-start sm:self-auto"
            onClick={handleNew}
          >
            <FiPlus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 size-4" />
          <input
            type="text"
            placeholder="Search categories..."
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
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No categories found' : 'No categories found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first category'}
          </p>
          {!searchTerm && (
            <button onClick={handleNew} className="btn btn-primary">
              <FiPlus className="w-4 h-4 mr-2" />
              Add Category
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
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Parent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Order
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
                {filteredCategories.map((category, index) => (
                  <tr 
                    key={category._id}
                    className="hover:bg-gray-50 transition-colors duration-150 text-xs"
                  >
                    <td className="px-4 py-3 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {category.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-gray-800 block">
                            {category.parent ? '└ ' : ''}{category.name}
                          </span>
                          {category.subcategories && category.subcategories.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {category.subcategories.length} subcategories
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {category.parent?.name || category.parent || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <div className="line-clamp-2">
                        {category.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {category.order || 0}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        category.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
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
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setShowModal(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="input-field resize-none"
                  placeholder="Category description"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Parent Category (Optional - Leave empty for main category)
                </label>
                <select
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">None (Main Category)</option>
                  {categories
                    .filter(cat => !cat.parent && (!editingCategory || cat._id !== editingCategory._id))
                    .map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  {/* Also show subcategories that could become parents (for nested subcategories) */}
                  {categories.flatMap(cat => 
                    (cat.subcategories || []).filter(sub => !sub.parent && (!editingCategory || sub._id !== editingCategory._id))
                      .map(sub => (
                        <option key={sub._id} value={sub._id}>
                          └ {sub.name}
                        </option>
                      ))
                  )}
                </select>
              </div>
              {/* <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div> */}
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
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
