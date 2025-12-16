import React, { useState, useEffect, useMemo } from 'react';
import api, { getImageUrl } from '../../utils/api';
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiX, FiImage, FiSearch } from 'react-icons/fi';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    orderCode: '',
    name: '',
    description: '',
    specifications: '',
    category: '',
    featured: false,
    isActive: true,
    order: 0
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
        api.get('/products/all'),
        api.get('/categories/all')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
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
    setImages(Array.from(e.target.files));
  };

  const handleBrochureChange = (e) => {
    setBrochureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      submitData.append('existingImages', JSON.stringify(existingImages));
      images.forEach((image) => {
        submitData.append('images', image);
      });

      let productId;
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        productId = editingProduct._id;
      } else {
        const response = await api.post('/products', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        productId = response.data._id;
      }

      if (brochureFile && productId) {
        const brochureData = new FormData();
        brochureData.append('brochure', brochureFile);
        await api.post(`/products/${productId}/brochure`, brochureData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleBrochureSubmit = async (e) => {
    e.preventDefault();
    if (!brochureFile) {
      alert('Please select a PDF file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('brochure', brochureFile);

      await api.post(`/products/${selectedProduct._id}/brochure`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowBrochureModal(false);
      setBrochureFile(null);
      setSelectedProduct(null);
      fetchData();
      alert('Brochure uploaded successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error uploading brochure');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      orderCode: product.orderCode,
      name: product.name,
      description: product.description,
      specifications: product.specifications || '',
      category: product.category._id || product.category,
      featured: product.featured,
      isActive: product.isActive,
      order: product.order || 0
    });
    setExistingImages(product.images || []);
    setImages([]);
    setBrochureFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting product');
    }
  };

  const handleNew = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      orderCode: '',
      name: '',
      description: '',
      specifications: '',
      category: '',
      featured: false,
      isActive: true,
      order: 0
    });
    setImages([]);
    setExistingImages([]);
    setBrochureFile(null);
  };

  const removeImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.category?.name && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [products, searchTerm]);

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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Products Management</h2>
            <p className="text-gray-600 text-sm">Manage your product catalog</p>
          </div>
          <button 
            className="btn btn-primary flex items-center gap-2 px-6 py-3 self-start sm:self-auto"
            onClick={handleNew}
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 size-4" />
          <input
            type="text"
            placeholder="Search products by name, code, or category..."
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
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No products found' : 'No products found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first product'}
          </p>
          {!searchTerm && (
            <button onClick={handleNew} className="btn btn-primary">
              <FiPlus className="w-4 h-4 mr-2" />
              Add Product
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
                    Order Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Description
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
                {filteredProducts.map((product, index) => (
                  <tr 
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors duration-150 text-xs"
                  >
                    <td className="px-4 py-3 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={getImageUrl(product.images[0])} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <FiImage className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-blue-600 uppercase text-xs">
                        {product.orderCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {product.featured && (
                          <span className="text-yellow-500" title="Featured">⭐</span>
                        )}
                        <span className="font-semibold text-gray-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {product.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <div className="line-clamp-2">
                        {product.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {product.featured && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowBrochureModal(true);
                          }}
                          className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                          title="Upload Brochure"
                        >
                          <FiUpload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
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

      {/* Product Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setShowModal(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Order Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="orderCode"
                    value={formData.orderCode}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="PROD-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Product name"
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
                  rows="4"
                  required
                  className="input-field resize-none"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Specifications</label>
                <textarea
                  name="specifications"
                  value={formData.specifications}
                  onChange={handleChange}
                  rows="6"
                  className="input-field resize-none font-mono text-sm"
                  placeholder="Enter specifications (HTML supported)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product Images</label>
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={getImageUrl(img)} 
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button 
                          type="button" 
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX className="w-4 h-4" />
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
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Brochure PDF</label>
                {editingProduct && editingProduct.brochure?.path && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Current Brochure:</strong> {editingProduct.brochure.originalName || 'brochure.pdf'}
                    </p>
                    {editingProduct.brochure.path.startsWith('http') && (
                      <a 
                        href={editingProduct.brochure.path} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View/Download →
                      </a>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleBrochureChange}
                  className="input-field"
                />
                <small className="text-gray-500 text-sm mt-1 block">
                  Upload a PDF brochure for this product
                </small>
              </div>
              <div className="grid grid-cols-3 gap-4">
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
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">Featured</span>
                  </label>
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
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brochure Modal */}
      {showBrochureModal && selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowBrochureModal(false)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <h3 className="text-xl font-bold">Upload Brochure</h3>
              <button 
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                onClick={() => setShowBrochureModal(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleBrochureSubmit} className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>{selectedProduct.name}</strong>
                </p>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  PDF Brochure <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleBrochureChange}
                  required
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  className="btn btn-secondary flex-1" 
                  onClick={() => setShowBrochureModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
