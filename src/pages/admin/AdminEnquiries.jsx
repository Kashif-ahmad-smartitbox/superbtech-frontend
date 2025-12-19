import React, { useState, useEffect, useMemo } from 'react';
import api from '../../utils/api';
import { FiTrash2, FiMail, FiPhone, FiUser, FiPackage, FiDownload, FiSearch } from 'react-icons/fi';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await api.get('/enquiries');
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) {
      return;
    }
    try {
      await api.delete(`/enquiries/${id}`);
      fetchEnquiries();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting enquiry');
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(enquiry =>
      (enquiry.name && enquiry.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enquiry.productName && enquiry.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (enquiry.message && enquiry.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [enquiries, searchTerm]);

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

  const recentEnquiries = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return enquiries.filter(e => {
      const date = new Date(e.createdAt);
      return date > weekAgo;
    }).length;
  }, [enquiries]);

  return (
    <div className="p-2">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Enquiries Management</h2>
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-gray-600 text-sm">Total Enquiries: <span className="font-bold text-blue-600">{enquiries.length}</span></p>
              <div className="px-3 py-1 bg-blue-50 rounded-lg">
                <span className="text-xs font-semibold text-blue-600">
                  Recent (7 days): {recentEnquiries}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600 size-4" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or product..."
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
            <p className="mt-4 text-gray-600">Loading enquiries...</p>
          </div>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No enquiries found' : 'No enquiries found'}
          </h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Customer enquiries will appear here'}
          </p>
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
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Brochure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider border-b border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry, index) => (
                  <tr 
                    key={enquiry._id}
                    className="hover:bg-gray-50 transition-colors duration-150 text-xs"
                  >
                    <td className="px-4 py-3 text-gray-600 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(enquiry.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <FiUser className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-800">{enquiry.name || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiMail className="w-3 h-3 text-blue-600" />
                        <span>{enquiry.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-3 h-3 text-green-600" />
                        <span>{enquiry.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <FiPackage className="w-3 h-3 text-purple-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-800">{enquiry.productName}</p>
                          {enquiry.product?.orderCode && (
                            <p className="text-xs text-gray-500">Code: {enquiry.product.orderCode}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs">
                      <div className="line-clamp-2">
                        {enquiry.message || 'No message'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {enquiry.downloadedBrochure ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs font-semibold text-green-700">Downloaded</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-xs font-semibold text-gray-500">Not Downloaded</span>
                            </>
                          )}
                        </div>
                        {enquiry.downloadedBrochure && enquiry.downloadTimestamp && (
                          <span className="text-xs text-gray-500">
                            {formatDate(enquiry.downloadTimestamp)}
                          </span>
                        )}
                        {enquiry.product?.brochure?.path && (
                          <a
                            href={enquiry.product.brochure.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors"
                            title={enquiry.product.brochure.originalName || 'Download Brochure'}
                          >
                            <FiDownload className="w-3 h-3" />
                            Download Brochure
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(enquiry._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
