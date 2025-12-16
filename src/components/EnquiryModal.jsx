import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import api from '../utils/api';

const EnquiryModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/enquiries', {
        ...formData,
        productId: product._id
      });

      // Check if response has downloadUrl (Cloudinary) or is a blob (local file)
      if (response.data && response.data.downloadUrl) {
        // Cloudinary URL - open in new tab
        window.open(response.data.downloadUrl, '_blank');
        onClose();
        alert('Brochure opened successfully!');
      } else if (response.data instanceof Blob) {
        // Local file - download as blob
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${product.name}-brochure.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        onClose();
        alert('Brochure downloaded successfully!');
      } else {
        onClose();
        alert('Enquiry submitted successfully!');
      }
    } catch (err) {
      if (err.response?.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            setError(errorData.message || 'An error occurred');
          } catch {
            setError('Failed to download brochure. Please try again.');
          }
        };
        reader.readAsText(err.response.data);
      } else {
        setError('Failed to download brochure. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Download Brochure</h2>
          <button 
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            onClick={onClose}
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Please provide your details to download the brochure for <strong className="text-gray-900">{product.name}</strong>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91-1234567890"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Any additional information..."
                className="input-field resize-none"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                className="btn btn-secondary flex-1" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? 'Downloading...' : 'Download Brochure'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;

