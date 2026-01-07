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
  Tag,
  Eye,
  EyeOff,
  Star,
  Award,
  Sparkles,
  Link,
  FileText,
  Grid,
  List,
  Filter,
  ArrowUpDown,
  Check,
  XCircle,
  MoreVertical,
  Download,
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
  const [viewMode, setViewMode] = useState("list");
  const [selectedProducts, setSelectedProducts] = useState(new Set());
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

    // Validate description
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

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (product.category?.name &&
          product.category.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
              Products Management
            </h1>
            <p className="text-sm text-primary-600">
              Manage your product catalog and inventory
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedProducts.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedProducts.size})
              </button>
            )}
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-3 border border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-primary-600 mb-0.5">
                  Total Products
                </p>
                <p className="text-xl font-bold text-primary-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary-500/10">
                <Package className="w-4 h-4 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-3 border border-secondary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-secondary-600 mb-0.5">
                  Active
                </p>
                <p className="text-xl font-bold text-secondary-900">
                  {stats.active}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-secondary-500/10">
                <Eye className="w-4 h-4 text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600 mb-0.5">
                  Featured
                </p>
                <p className="text-xl font-bold text-yellow-900">
                  {stats.featured}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Star className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-600 mb-0.5">New</p>
                <p className="text-xl font-bold text-green-900">{stats.new}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-orange-600 mb-0.5">
                  Best Sellers
                </p>
                <p className="text-xl font-bold text-orange-900">
                  {stats.bestSeller}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Award className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search products by name, code, or category..."
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

        {/* Products List/Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {searchTerm ? "No products found" : "No products yet"}
            </h3>
            <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or clear the search to see all products."
                : "Get started by creating your first product."}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 rounded-lg font-medium transition-all shadow-sm hover:shadow flex items-center gap-1.5 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Your First Product
              </button>
            )}
          </div>
        ) : viewMode === "list" ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="relative overflow-auto max-h-[calc(100vh-450px)]">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left min-w-[40px]">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedProducts.size === filteredProducts.length &&
                            filteredProducts.length > 0
                          }
                          onChange={selectAllProducts}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[100px] whitespace-nowrap">
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                      Order Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[200px] whitespace-nowrap">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[100px] whitespace-nowrap">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[140px] whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedProducts.has(product._id) ? "bg-primary-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product._id)}
                            onChange={() => toggleSelectProduct(product._id)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        </label>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={getImageUrl(product.images[0])}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary-700 uppercase text-xs bg-primary-50 px-2 py-1 rounded">
                          {product.orderCode}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm mb-1 truncate">
                              {product.name}
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                              {product.featured && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Star className="w-3 h-3 mr-0.5" /> Featured
                                </span>
                              )}
                              {product.new && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  <Sparkles className="w-3 h-3 mr-0.5" /> New
                                </span>
                              )}
                              {product.bestSeller && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                  <Award className="w-3 h-3 mr-0.5" /> Best
                                  Seller
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FolderTree className="w-3.5 h-3.5 text-primary-400" />
                          <span className="text-sm text-gray-700">
                            {product.category?.name || "Uncategorized"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              product.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {product.isActive ? (
                              <>
                                <Check className="w-3 h-3 mr-1" /> Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" /> Inactive
                              </>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {formatDate(product.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowBrochureModal(true);
                            }}
                            className="p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                            title="Upload Brochure"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all ${
                  selectedProducts.has(product._id)
                    ? "ring-1 ring-primary-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-primary-700 text-xs bg-primary-50 px-2 py-0.5 rounded">
                        {product.orderCode}
                      </span>
                      <div className="flex items-center gap-1">
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
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-2 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <FolderTree className="w-3 h-3" />
                      <span className="truncate">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </div>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(product._id)}
                      onChange={() => toggleSelectProduct(product._id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </label>
                </div>

                <div className="mb-3 relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 aspect-video">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    {product.brochure?.path && (
                      <a
                        href={product.brochure.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-white/80 backdrop-blur-sm rounded hover:bg-white transition-colors"
                        title="Download Brochure"
                      >
                        <FileText className="w-3 h-3 text-indigo-600" />
                      </a>
                    )}
                    {product.youtubeLink && (
                      <a
                        href={product.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 bg-white/80 backdrop-blur-sm rounded hover:bg-white transition-colors"
                        title="Watch Video"
                      >
                        <Link className="w-3 h-3 text-red-600" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(product.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowBrochureModal(true);
                    }}
                    className="flex-1 p-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors text-xs font-medium"
                  >
                    Brochure
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Brochure Modal */}
        {showBrochureModal && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-xl flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Upload Brochure</h3>
                  <p className="text-indigo-100 text-xs mt-0.5">
                    {selectedProduct.name}
                  </p>
                </div>
                <button
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  onClick={() => setShowBrochureModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBrochureSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    PDF Brochure <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleBrochureChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a PDF brochure for{" "}
                    <span className="font-semibold">
                      {selectedProduct.name}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
                    onClick={() => setShowBrochureModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 rounded-lg font-medium transition-all shadow-sm hover:shadow text-sm"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl flex justify-between items-center z-50">
              <div>
                <h3 className="text-2xl font-bold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-primary-100 text-sm mt-1">
                  {editingProduct
                    ? "Update product details"
                    : "Create a new product entry"}
                </p>
              </div>
              <button
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setShowModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Order Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="orderCode"
                    value={formData.orderCode}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="PROD-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-white"
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
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Product name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="bg-white rounded-lg border border-gray-300">
                  <ReactQuill
                    theme="snow"
                    value={formData.description}
                    onChange={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ color: [] }, { background: [] }],
                        ["link"],
                        ["clean"],
                      ],
                    }}
                    style={{ minHeight: "150px" }}
                    placeholder="Enter product description..."
                  />
                </div>
                {!formData.description ||
                formData.description === "<p><br></p>" ? (
                  <p className="text-xs text-red-500 mt-1">
                    Description is required
                  </p>
                ) : null}
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Specifications
                </label>
                <div className="bg-white rounded-lg border border-gray-300">
                  <ReactQuill
                    theme="snow"
                    value={formData.specifications}
                    onChange={(value) =>
                      setFormData({ ...formData, specifications: value })
                    }
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ color: [] }, { background: [] }],
                        ["link"],
                        ["clean"],
                      ],
                    }}
                    style={{ minHeight: "150px" }}
                    placeholder="Enter product specifications..."
                  />
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Experimentation
                  </label>
                  <textarea
                    name="experimentation"
                    value={formData.experimentation}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Enter experimentation details..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Services Required
                  </label>
                  <textarea
                    name="servicesRequired"
                    value={formData.servicesRequired}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                    placeholder="Enter services required..."
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Product Images
                </label>
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(img)}
                          alt={`Preview ${index}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">
                    Upload product images (multiple allowed)
                  </span>
                </label>
              </div>

              {/* Brochure and YouTube */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Brochure PDF
                  </label>
                  {editingProduct && editingProduct.brochure?.path && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 truncate">
                          {editingProduct.brochure.originalName ||
                            "brochure.pdf"}
                        </span>
                      </div>
                      {editingProduct.brochure.path.startsWith("http") && (
                        <a
                          href={editingProduct.brochure.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Download
                        </a>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleBrochureChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    YouTube Video Link
                  </label>
                  <input
                    type="url"
                    name="youtubeLink"
                    value={formData.youtubeLink}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-semibold text-gray-700 text-sm">
                      Featured
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Show as featured
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    name="new"
                    checked={formData.new}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-semibold text-gray-700 text-sm">
                      New
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">Mark as new</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    name="bestSeller"
                    checked={formData.bestSeller}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="font-semibold text-gray-700 text-sm">
                      Best Seller
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Mark as best seller
                    </p>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
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

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                >
                  {editingProduct ? "Update Product" : "Create Product"}
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
