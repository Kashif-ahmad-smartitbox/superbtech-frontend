import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/api";
import {
  Edit2,
  Trash2,
  Plus,
  X,
  Search,
  ChevronRight,
  FolderTree,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  MoreVertical,
  Grid,
  List,
  Filter,
  ArrowUpDown,
} from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
    order: 0,
    parent: "",
  });
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategories, setSelectedCategories] = useState(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/all");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleSelectCategory = (categoryId) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
  };

  const selectAllCategories = () => {
    if (
      selectedCategories.size === filteredCategories.length &&
      filteredCategories.length > 0
    ) {
      setSelectedCategories(new Set());
    } else {
      const allIds = filteredCategories.map((cat) => cat._id);
      setSelectedCategories(new Set(allIds));
    }
  };

  // Calculate total count including subcategories
  const totalCategoriesCount = useMemo(() => {
    const countCategories = (cats) => {
      let count = 0;
      cats.forEach((cat) => {
        count++; // Count current category
        if (cat.subcategories && cat.subcategories.length > 0) {
          count += countCategories(cat.subcategories); // Recursively count subcategories
        }
      });
      return count;
    };
    return countCategories(categories);
  }, [categories]);

  const flattenedCategories = useMemo(() => {
    const flatten = (cats, level = 0, parentId = null) => {
      let result = [];
      cats.forEach((cat) => {
        const categoryWithLevel = {
          ...cat,
          level,
          parentId,
          hasChildren: cat.subcategories && cat.subcategories.length > 0,
        };
        result.push(categoryWithLevel);

        if (expandedCategories.has(cat._id) && cat.subcategories) {
          result = [
            ...result,
            ...flatten(cat.subcategories, level + 1, cat._id),
          ];
        }
      });
      return result;
    };

    return flatten(categories);
  }, [categories, expandedCategories]);

  const filteredCategories = useMemo(() => {
    return flattenedCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description &&
          category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [flattenedCategories, searchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData);
      } else {
        await api.post("/categories", formData);
      }
      setShowModal(false);
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        image: "",
        isActive: true,
        order: 0,
        parent: "",
      });
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving category");
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive,
      order: category.order || 0,
      parent: category.parent?._id || category.parent || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting category");
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedCategories.size} categories?`
      )
    ) {
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedCategories).map((id) =>
          api.delete(`/categories/${id}`)
        )
      );
      setSelectedCategories(new Set());
      fetchCategories();
    } catch (error) {
      alert("Error deleting categories");
    }
  };

  const handleNew = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      image: "",
      isActive: true,
      order: 0,
      parent: "",
    });
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
              Categories Management
            </h1>
            <p className="text-sm text-primary-600">
              Manage your product categories and subcategories
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategories.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedCategories.size})
              </button>
            )}
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Stats - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-3 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-primary-600 mb-0.5">
                  Total Categories
                </p>
                <p className="text-xl font-bold text-primary-900">
                  {totalCategoriesCount}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary-500/10">
                <FolderTree className="w-4 h-4 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-3 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-secondary-600 mb-0.5">
                  Main Categories
                </p>
                <p className="text-xl font-bold text-secondary-900">
                  {categories.length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-secondary-500/10">
                <ChevronRight className="w-4 h-4 text-secondary-600" />
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
                  {flattenedCategories.filter((c) => c.isActive).length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Eye className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 border border-gray-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-0.5">
                  Inactive
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {flattenedCategories.filter((c) => !c.isActive).length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-gray-500/10">
                <EyeOff className="w-4 h-4 text-gray-600" />
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
                placeholder="Search categories..."
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

        {/* Categories List/Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <FolderTree className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {searchTerm ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or clear the search to see all categories."
                : "Get started by creating your first product category."}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 rounded-lg font-medium transition-all shadow-sm hover:shadow flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Your First Category
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
                            selectedCategories.size ===
                              filteredCategories.length &&
                            filteredCategories.length > 0
                          }
                          onChange={selectAllCategories}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[300px] whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[80px] whitespace-nowrap">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[100px] whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedCategories.has(category._id)
                          ? "bg-primary-50"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.has(category._id)}
                            onChange={() => toggleSelectCategory(category._id)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center min-w-[20px]">
                            {Array.from({ length: category.level }).map(
                              (_, i) => (
                                <div key={i} className="w-4 text-gray-300">
                                  <ChevronRight className="w-3 h-3" />
                                </div>
                              )
                            )}
                          </div>
                          <button
                            onClick={() => toggleCategory(category._id)}
                            className={`p-0.5 rounded hover:bg-gray-100 ${
                              category.hasChildren ? "" : "invisible"
                            }`}
                          >
                            {expandedCategories.has(category._id) ? (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                            )}
                          </button>
                          <div className="flex items-center gap-2 min-w-0">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {category.name.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 text-sm truncate">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-xs text-gray-500 truncate">
                                  {category.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium inline-block">
                          {category.order || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(category.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
                            className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
                            <MoreVertical className="w-3.5 h-3.5" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredCategories.map((category) => (
              <div
                key={category._id}
                className={`bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all ${
                  selectedCategories.has(category._id)
                    ? "ring-1 ring-primary-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                        {category.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            category.level === 0
                              ? "bg-primary-100 text-primary-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {category.level === 0 ? "Main" : "Sub"}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            category.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(category._id)}
                      onChange={() => toggleSelectCategory(category._id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                </div>

                {category.description && (
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="text-center p-1.5 bg-gray-50 rounded-md">
                    <div className="text-xs font-medium text-gray-600">
                      Order
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {category.order || 0}
                    </div>
                  </div>
                  <div className="text-center p-1.5 bg-gray-50 rounded-md">
                    <div className="text-xs font-medium text-gray-600">
                      Created
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {formatDate(category.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    ID: {category._id?.substring(0, 8)}...
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-primary-100 text-xs mt-0.5">
                  {editingCategory
                    ? "Update category details"
                    : "Create a new product category"}
                </p>
              </div>
              <button
                className="p-1 hover:bg-white/20 rounded transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                  placeholder="Enter category description"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                >
                  <option value="">None (Main Category)</option>
                  {categories
                    .filter(
                      (cat) =>
                        !cat.parent &&
                        (!editingCategory || cat._id !== editingCategory._id)
                    )
                    .map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
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
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCategories;
