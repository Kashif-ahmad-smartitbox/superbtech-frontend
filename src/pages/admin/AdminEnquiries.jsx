import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/api";
import {
  Trash2,
  Mail,
  Phone,
  User,
  Download,
  Search,
  MessageSquare,
  Clock,
  Eye,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  FileText,
  X,
  Copy,
} from "lucide-react";

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiries, setSelectedEnquiries] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await api.get("/enquiries");
      setEnquiries(response.data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectEnquiry = (enquiryId) => {
    const newSelected = new Set(selectedEnquiries);
    if (newSelected.has(enquiryId)) {
      newSelected.delete(enquiryId);
    } else {
      newSelected.add(enquiryId);
    }
    setSelectedEnquiries(newSelected);
  };

  const selectAllEnquiries = () => {
    if (
      selectedEnquiries.size === filteredEnquiries.length &&
      filteredEnquiries.length > 0
    ) {
      setSelectedEnquiries(new Set());
    } else {
      const allIds = filteredEnquiries.map((enquiry) => enquiry._id);
      setSelectedEnquiries(new Set(allIds));
    }
  };

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) {
      return;
    }
    try {
      await api.delete(`/enquiries/${id}`);
      fetchEnquiries();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting enquiry");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedEnquiries.size} enquiries?`)) {
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedEnquiries).map((id) =>
          api.delete(`/enquiries/${id}`)
        )
      );
      setSelectedEnquiries(new Set());
      fetchEnquiries();
    } catch (error) {
      alert("Error deleting enquiries");
    }
  };

  const sortedEnquiries = useMemo(() => {
    const sortableItems = [...enquiries];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "productName") {
          aValue = a.productName || "";
          bValue = b.productName || "";
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
  }, [enquiries, sortConfig]);

  const filteredEnquiries = useMemo(() => {
    let filtered = sortedEnquiries.filter(
      (enquiry) =>
        (enquiry.name &&
          enquiry.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enquiry.productName &&
          enquiry.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (statusFilter === "downloaded") {
      filtered = filtered.filter((e) => e.downloadedBrochure);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((e) => !e.downloadedBrochure);
    }

    return filtered;
  }, [sortedEnquiries, searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return formatDate(dateString);
    }
  };

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const openMessageModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowMessageModal(true);
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    setSelectedEnquiry(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };



  const stats = {
    total: enquiries.length,
    recent: enquiries.filter((e) => {
      const date = new Date(e.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length,
    downloaded: enquiries.filter((e) => e.downloadedBrochure).length,
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
    <div className="space-y-3">
      {/* Header - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-900 mb-0.5">
            Enquiries
          </h1>
          <p className="text-xs text-gray-600">
            Total: {stats.total} • Recent: {stats.recent} • Downloaded:{" "}
            {stats.downloaded}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedEnquiries.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded font-medium transition-colors flex items-center gap-1 text-xs"
            >
              <Trash2 className="w-3 h-3" />
              Delete ({selectedEnquiries.size})
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter - Ultra Compact */}
      <div className="bg-white rounded-lg border border-gray-200 p-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 placeholder:text-gray-400 text-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
            >
              <option value="all">All</option>
              <option value="downloaded">Downloaded</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Table - Ultra Compact */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-4 text-center border border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {searchTerm ? "No enquiries found" : "No enquiries yet"}
          </h3>
          <p className="text-gray-600 text-xs">
            {searchTerm
              ? "Try adjusting your search"
              : "Customer enquiries will appear here"}
          </p>
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
                          selectedEnquiries.size === filteredEnquiries.length &&
                          filteredEnquiries.length > 0
                        }
                        onChange={selectAllEnquiries}
                        className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </th>
                  <th
                    className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-0.5">
                      Customer
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUp className="w-2.5 h-2.5" />
                        ) : (
                          <ArrowDown className="w-2.5 h-2.5" />
                        ))}
                    </div>
                  </th>
                  <th className="px-1 py-1.5 text-left font-medium text-gray-700">
                    Contact
                  </th>
                  <th
                    className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("productName")}
                  >
                    <div className="flex items-center gap-0.5">
                      Product
                      {sortConfig.key === "productName" &&
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
                  <th
                    className="px-1 py-1.5 text-left font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-0.5">
                      Received
                      {sortConfig.key === "createdAt" &&
                        (sortConfig.direction === "asc" ? (
                          <ArrowUp className="w-2.5 h-2.5" />
                        ) : (
                          <ArrowDown className="w-2.5 h-2.5" />
                        ))}
                    </div>
                  </th>
                  <th className="px-1 py-1.5 text-left font-medium text-gray-700 w-16">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry._id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedEnquiries.has(enquiry._id) ? "bg-primary-50" : ""
                    }`}
                  >
                    <td className="px-2 py-1.5">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEnquiries.has(enquiry._id)}
                          onChange={() => toggleSelectEnquiry(enquiry._id)}
                          className="w-3 h-3 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </td>
                    <td className="px-1 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {enquiry.name || "Anonymous"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-1.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-primary-500 flex-shrink-0" />
                          <span className="truncate">{enquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span>{enquiry.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-1.5">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {enquiry.productName || "No product"}
                        </div>
                        {enquiry.product?.orderCode && (
                          <div className="text-gray-500 truncate">
                            {enquiry.product.orderCode}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-1 py-1.5">
                      <div className="space-y-0.5">
                        <div
                          className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${
                            enquiry.downloadedBrochure
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {enquiry.downloadedBrochure ? (
                            <CheckCircle className="w-2.5 h-2.5" />
                          ) : (
                            <AlertCircle className="w-2.5 h-2.5" />
                          )}
                        </div>
                        {enquiry.product?.brochure?.path && (
                          <a
                            href={enquiry.product.brochure.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5"
                            title="Brochure"
                          >
                            <FileText className="w-2.5 h-2.5 text-blue-600" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-1 py-1.5">
                      <div className="space-y-0.5">
                        <div className="text-gray-900 font-medium">
                          {getTimeAgo(enquiry.createdAt)}
                        </div>
                        <div className="text-gray-500">
                          {formatTime(enquiry.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-1.5">
                      <div className="flex items-center gap-1">
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="p-1 rounded bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                          title="Email"
                        >
                          <Mail className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => openMessageModal(enquiry)}
                          className="p-1 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                          title="View Message"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(enquiry._id)}
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

      {/* Quick Actions Bar - Compact */}
      {selectedEnquiries.size > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 flex items-center gap-3">
          <span className="text-xs font-medium text-gray-700">
            {selectedEnquiries.size} selected
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const selectedEmails = filteredEnquiries
                  .filter((e) => selectedEnquiries.has(e._id))
                  .map((e) => e.email);
                window.location.href = `mailto:${selectedEmails.join(",")}`;
              }}
              className="px-2 py-1 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded font-medium transition-colors flex items-center gap-1 text-xs"
            >
              <Mail className="w-3 h-3" />
              Email All
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded font-medium transition-colors flex items-center gap-1 text-xs"
            >
              <Trash2 className="w-3 h-3" />
              Delete All
            </button>
          </div>
        </div>
      )}
      {/* Message Modal */}
      {showMessageModal && selectedEnquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={closeMessageModal}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto overflow-hidden animate-scale-in">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">
                      Message Details
                    </h3>
                  </div>
                  <button
                    onClick={closeMessageModal}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-4">
                {/* Customer Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {selectedEnquiry.name || "Anonymous"}
                      </h4>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-primary-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">
                            {selectedEnquiry.email}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(selectedEnquiry.email)
                            }
                            className="ml-auto p-1 rounded hover:bg-gray-200 transition-colors"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {selectedEnquiry.phone}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(selectedEnquiry.phone)
                            }
                            className="ml-auto p-1 rounded hover:bg-gray-200 transition-colors"
                            title="Copy phone"
                          >
                            <Copy className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                {selectedEnquiry.productName && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Product</h4>
                    </div>
                    <p className="text-sm font-semibold text-blue-800">
                      {selectedEnquiry.productName}
                    </p>
                    {selectedEnquiry.product?.orderCode && (
                      <p className="text-xs text-blue-600 mt-1">
                        Code: {selectedEnquiry.product.orderCode}
                      </p>
                    )}
                  </div>
                )}

                {/* Message Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Message</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDate(selectedEnquiry.createdAt)} at{" "}
                        {formatTime(selectedEnquiry.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {selectedEnquiry.message ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedEnquiry.message}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No message provided
                      </p>
                    )}
                  </div>
                  {selectedEnquiry.message && (
                    <button
                      onClick={() => copyToClipboard(selectedEnquiry.message)}
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 rounded font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Message
                    </button>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedEnquiry.downloadedBrochure ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-700">
                          Brochure Downloaded
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-medium text-amber-700">
                          Pending Download
                        </span>
                      </>
                    )}
                  </div>
                  {selectedEnquiry.product?.brochure?.path && (
                    <a
                      href={selectedEnquiry.product.brochure.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded font-medium transition-colors flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      View Brochure
                    </a>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2">
                <button
                  onClick={closeMessageModal}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition-colors text-sm"
                >
                  Close
                </button>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded font-medium transition-colors flex items-center gap-2 text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
