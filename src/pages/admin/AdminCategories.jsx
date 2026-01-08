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
  Eye,
  EyeOff,
  MoreVertical,
  Grid,
  List,
  ArrowUp,
  ArrowDown,
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
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: "order",
    direction: "asc",
  });

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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Calculate total count including subcategories
  const totalCategoriesCount = useMemo(() => {
    const countCategories = (cats) => {
      let count = 0;
      cats.forEach((cat) => {
        count++;
        if (cat.subcategories && cat.subcategories.length > 0) {
          count += countCategories(cat.subcategories);
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

  const sortedCategories = useMemo(() => {
    const sortableItems = [...flattenedCategories];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === "parent") {
          aValue = a.parent?.name || "";
          bValue = b.parent?.name || "";
        }

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
  }, [flattenedCategories, sortConfig]);

  const filteredCategories = useMemo(() => {
    return sortedCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description &&
          category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [sortedCategories, searchTerm]);

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
    });
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
        {/* Header - More Compact */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">
              Categories
            </h1>
            <p className="text-xs text-gray-600">
              Total: {totalCategoriesCount} • Main: {categories.length} •
              Active: {flattenedCategories.filter((c) => c.isActive).length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategories.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-1 text-xs"
              >
                <Trash2 className="w-3 h-3" />
                Delete ({selectedCategories.size})
              </button>
            )}
            <button
              onClick={handleNew}
              className="px-3 py-1.5 bg-primary-500 text-white hover:bg-primary-600 rounded-lg font-medium transition-all flex items-center gap-1 text-xs"
            >
              <Plus className="w-3 h-3" />
              Add Category
            </button>
          </div>
        </div>

        {/* Search and Filter - Ultra Compact */}
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 placeholder:text-gray-400 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Categories Table - Ultra Compact */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <FolderTree className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {searchTerm ? "No categories found" : "No categories yet"}
            </h3>
            <p className="text-gray-600 text-xs mb-3 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first product category"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNew}
                className="px-3 py-1.5 bg-primary-500 text-white hover:bg-primary-600 rounded font-medium transition-all flex items-center gap-1 text-xs mx-auto"
              >
                <Plus className="w-3 h-3" />
                Add First Category
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table with smaller padding and font sizes */}
            <div className="relative overflow-auto max-h-[calc(100vh-250px)]">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10 bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-3 py-2 text-left w-8">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedCategories.size ===
                              filteredCategories.length &&
                            filteredCategories.length > 0
                          }
                          onChange={selectAllCategories}
                          className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </th>
                    <th
                      className="px-2 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Category
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("order")}
                    >
                      <div className="flex items-center gap-1">
                        Order
                        {sortConfig.key === "order" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("isActive")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {sortConfig.key === "isActive" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-2 py-2 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-1">
                        Created
                        {sortConfig.key === "createdAt" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : (
                            <ArrowDown className="w-3 h-3" />
                          ))}
                      </div>
                    </th>
                    <th className="px-2 py-2 text-left font-medium text-gray-700 w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedCategories.has(category._id)
                          ? "bg-primary-50"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.has(category._id)}
                            onChange={() => toggleSelectCategory(category._id)}
                            className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {Array.from({ length: category.level }).map(
                              (_, i) => (
                                <div key={i} className="w-3 text-gray-300">
                                  <ChevronRight className="w-2.5 h-2.5" />
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
                              <ChevronDown className="w-3 h-3 text-gray-500" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-gray-500" />
                            )}
                          </button>
                          <div className="flex items-center gap-1.5 min-w-0">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-6 h-6 rounded object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0">
                                {category.name.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-gray-500 truncate">
                                  {category.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded font-medium inline-block min-w-[24px] text-center">
                          {category.order || 0}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                            category.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {category.isActive ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-gray-500 whitespace-nowrap">
                        {formatDate(category.createdAt)}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(category)}
                            className="p-1 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(category._id)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white p-3 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-primary-100 text-[10px] mt-0.5">
                  {editingCategory
                    ? "Update category details"
                    : "Create a new product category"}
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
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Category name"
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
                  rows="2"
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                  placeholder="Optional description"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Parent
                  </label>
                  <select
                    name="parent"
                    value={formData.parent}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                  >
                    <option value="">Main Category</option>
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
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-medium text-gray-700 text-xs">
                    Active
                  </span>
                </label>
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
                  {editingCategory ? "Update" : "Create"}
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
