import React, { useState, useEffect, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api, { getImageUrl } from "../../utils/api";
import {
  Edit2,
  Trash2,
  Plus,
  Upload,
  X,
  Image as ImageIcon,
  Search,
  Package,
  FolderTree,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  Award,
  Check,
  XCircle,
  MoreVertical,
  Download,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({
    key: "order",
    direction: "asc",
  });
  const [formData, setFormData] = useState({
    orderCode: "",
    name: "",
    description: "",
    specifications: "",
    category: "",
    featured: false,
    new: false,
    bestSeller: false,
    experimentation: "",
    servicesRequired: "",
    youtubeLink: "",
    isActive: true,
    order: 0,
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [brochureFile, setBrochureFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products/all"),
        api.get("/categories/all"),
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectProduct = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllProducts = () => {
    if (
      selectedProducts.size === filteredProducts.length &&
      filteredProducts.length > 0
    ) {
      setSelectedProducts(new Set());
    } else {
      const allIds = filteredProducts.map((p) => p._id);
      setSelectedProducts(new Set(allIds));
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedProducts.size} products?`
      )
    ) {
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedProducts).map((id) => api.delete(`/products/${id}`))
      );
      setSelectedProducts(new Set());
      fetchData();
    } catch (error) {
      alert("Error deleting products");
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
    setImages(Array.from(e.target.files));
  };

  const handleBrochureChange = (e) => {
    setBrochureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.description ||
      formData.description === "<p><br></p>" ||
      formData.description.trim() === ""
    ) {
      alert("Description is required");
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      submitData.append("existingImages", JSON.stringify(existingImages));
      images.forEach((image) => {
        submitData.append("images", image);
      });

      let productId;
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        productId = editingProduct._id;
      } else {
        const response = await api.post("/products", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        productId = response.data._id;
      }

      if (brochureFile && productId) {
        const brochureData = new FormData();
        brochureData.append("brochure", brochureFile);
        await api.post(`/products/${productId}/brochure`, brochureData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.response?.data?.message || "Error saving product");
    }
  };

  const handleBrochureSubmit = async (e) => {
    e.preventDefault();
    if (!brochureFile) {
      alert("Please select a PDF file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("brochure", brochureFile);

      await api.post(`/products/${selectedProduct._id}/brochure`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setShowBrochureModal(false);
      setBrochureFile(null);
      setSelectedProduct(null);
      fetchData();
      alert("Brochure uploaded successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Error uploading brochure");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      orderCode: product.orderCode,
      name: product.name,
      description: product.description,
      specifications: product.specifications || "",
      category: product.category._id || product.category,
      featured: product.featured || false,
      new: product.new || false,
      bestSeller: product.bestSeller || false,
      experimentation: product.experimentation || "",
      servicesRequired: product.servicesRequired || "",
      youtubeLink: product.youtubeLink || "",
      isActive: product.isActive,
      order: product.order || 0,
    });
    setExistingImages(product.images || []);
    setImages([]);
    setBrochureFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting product");
    }
  };

  const handleNew = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      orderCode: "",
      name: "",
      description: "",
      specifications: "",
      category: "",
      featured: false,
      new: false,
      bestSeller: false,
      experimentation: "",
      servicesRequired: "",
      youtubeLink: "",
      isActive: true,
      order: 0,
    });
    setImages([]);
    setExistingImages([]);
    setBrochureFile(null);
  };

  const removeImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const sortedProducts = useMemo(() => {
    const sortableItems = [...products];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "category") {
          aValue = a.category?.name || "";
          bValue = b.category?.name || "";
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
  }, [products, sortConfig]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category?.name &&
          product.category.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  }, [sortedProducts, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const stats = useMemo(
    () => ({
      total: products.length,
      active: products.filter((p) => p.isActive).length,
      featured: products.filter((p) => p.featured).length,
      new: products.filter((p) => p.new).length,
      bestSeller: products.filter((p) => p.bestSeller).length,
    }),
    [products]
  );

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
              Products
            </h1>
            <p className="text-xs text-gray-600">
              Total: {stats.total} • Active: {stats.active} • Featured:{" "}
              {stats.featured} • New: {stats.new}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedProducts.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-1 text-xs"
              >
                <Trash2 className="w-3 h-3" />
                Delete ({selectedProducts.size})
              </button>
            )}
            <button
              onClick={handleNew}
              className="px-3 py-1.5 bg-primary-500 text-white hover:bg-primary-600 rounded-lg font-medium transition-all flex items-center gap-1 text-xs"
            >
              <Plus className="w-3 h-3" />
              Add Product
            </button>
          </div>
        </div>

        {/* Search - Compact */}
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              placeholder="Search products by name, code, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 placeholder:text-gray-400 text-xs"
            />
          </div>
        </div>

        {/* Products Table - Ultra Compact */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-2">
              <Package className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {searchTerm ? "No products found" : "No products yet"}
            </h3>
            <p className="text-gray-600 text-xs mb-3">
              {searchTerm
                ? "Try adjusting your search"
                : "Create your first product"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNew}
                className="px-3 py-1.5 bg-primary-500 text-white hover:bg-primary-600 rounded font-medium transition-all flex items-center gap-1 text-xs mx-auto"
              >
                <Plus className="w-3 h-3" />
                Add First Product
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
                            selectedProducts.size === filteredProducts.length &&
                            filteredProducts.length > 0
                          }
                          onChange={selectAllProducts}
                          className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </th>
                    <th
                      className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("orderCode")}
                    >
                      <div className="flex items-center gap-0.5">
                        Code
                        {sortConfig.key === "orderCode" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowDown className="w-2.5 h-2.5" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-0.5">
                        Product
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUp className="w-2.5 h-2.5" />
                          ) : (
                            <ArrowDown className="w-2.5 h-2.5" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-0.5">
                        Category
                        {sortConfig.key === "category" &&
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
                    <th className="px-1 py-1.5 text-left font-medium text-gray-700 w-16">
                      Created
                    </th>
                    <th className="px-1 py-1.5 text-left font-medium text-gray-700 w-12">
                      Flags
                    </th>
                    <th className="px-1 py-1.5 text-left font-medium text-gray-700 w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedProducts.has(product._id) ? "bg-primary-50" : ""
                      }`}
                    >
                      <td className="px-2 py-1.5">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product._id)}
                            onChange={() => toggleSelectProduct(product._id)}
                            className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      </td>
                      <td className="px-1 py-1.5">
                        <span className="font-semibold text-primary-700 uppercase bg-primary-50 px-1 py-0.5 rounded text-[10px]">
                          {product.orderCode}
                        </span>
                      </td>
                      <td className="px-1 py-1.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={getImageUrl(product.images[0])}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {product.name}
                            </div>
                            {product.youtubeLink && (
                              <div className="text-[10px] text-blue-600 truncate">
                                Has video
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-1 py-1.5">
                        <div className="flex items-center gap-1">
                          <FolderTree className="w-3 h-3 text-primary-400 flex-shrink-0" />
                          <span className="truncate">
                            {product.category?.name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-1 py-1.5">
                        <span
                          className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${
                            product.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.isActive ? (
                            <Eye className="w-2.5 h-2.5" />
                          ) : (
                            <EyeOff className="w-2.5 h-2.5" />
                          )}
                        </span>
                      </td>
                      <td className="px-1 py-1.5 text-gray-500 whitespace-nowrap">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-1 py-1.5">
                        <div className="flex items-center gap-0.5">
                          {product.featured && (
                            <Star className="w-3 h-3 text-yellow-500" />
                          )}
                          {product.new && (
                            <Sparkles className="w-3 h-3 text-green-500" />
                          )}
                          {product.bestSeller && (
                            <Award className="w-3 h-3 text-orange-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-1 py-1.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowBrochureModal(true);
                            }}
                            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="Brochure"
                          >
                            <Upload className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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

      {/* Brochure Modal - Compact */}
      {showBrochureModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold">Upload Brochure</h3>
                <p className="text-blue-100 text-[10px] mt-0.5">
                  {selectedProduct.name}
                </p>
              </div>
              <button
                className="p-0.5 hover:bg-white/20 rounded transition-colors"
                onClick={() => setShowBrochureModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBrochureSubmit} className="p-3 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  PDF Brochure
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleBrochureChange}
                  required
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  className="flex-1 px-2 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded font-medium transition-colors text-xs"
                  onClick={() => setShowBrochureModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-2 py-1.5 bg-blue-500 text-white hover:bg-blue-600 rounded font-medium transition-all text-xs"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal - Compact */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white p-3 sticky top-0 flex justify-between items-center z-10">
              <div>
                <h3 className="text-sm font-bold">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>
                <p className="text-primary-100 text-[10px] mt-0.5">
                  {editingProduct ? "Update details" : "Create new product"}
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
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    name="orderCode"
                    value={formData.orderCode}
                    onChange={handleChange}
                    required
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="PROD-001"
                  />
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
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Product name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <React.Fragment key={cat._id}>
                      <option value={cat._id}>{cat.name}</option>
                      {cat.subcategories &&
                        cat.subcategories.map((subcat) => (
                          <option key={subcat._id} value={subcat._id}>
                            └ {subcat.name}
                          </option>
                        ))}
                    </React.Fragment>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="bg-white rounded border border-gray-300 min-h-[100px]">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                        ["clean"],
                      ],
                    }}
                    style={{ minHeight: "80px", fontSize: "12px" }}
                    placeholder="Product description..."
                  />
                </div>
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Specifications
                </label>
                <div className="bg-white rounded border border-gray-300 min-h-[80px]">
                  <ReactQuill
                    theme="snow"
                    value={formData.specifications}
                    onChange={(value) =>
                      setFormData({ ...formData, specifications: value })
                    }
                    modules={{
                      toolbar: [
                        ["bold", "italic"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["clean"],
                      ],
                    }}
                    style={{ minHeight: "60px", fontSize: "12px" }}
                    placeholder="Product specifications..."
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Experimentation
                  </label>
                  <textarea
                    name="experimentation"
                    value={formData.experimentation}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Experimentation details"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Services
                  </label>
                  <textarea
                    name="servicesRequired"
                    value={formData.servicesRequired}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Services required"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  YouTube Link
                </label>
                <input
                  type="url"
                  name="youtubeLink"
                  value={formData.youtubeLink}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Video link"
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Images
                </label>
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(img)}
                          alt={`Preview ${index}`}
                          className="w-full h-12 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>

              {/* Flags */}
              <div className="grid grid-cols-4 gap-2">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    Featured
                  </span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="new"
                    checked={formData.new}
                    onChange={handleChange}
                    className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs font-medium text-gray-700">New</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="bestSeller"
                    checked={formData.bestSeller}
                    onChange={handleChange}
                    className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    Best Seller
                  </span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-xs font-medium text-gray-700">
                    Active
                  </span>
                </label>
              </div>

              {/* Submit */}
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
                  {editingProduct ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProducts;
