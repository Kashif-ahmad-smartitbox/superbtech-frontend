import React, { useState, useEffect, useMemo } from "react";
import api from "../../utils/api";
import {
  Trash2,
  Mail,
  Phone,
  User,
  Package,
  Download,
  Search,
  MessageSquare,
  Calendar,
  Clock,
  Eye,
  MoreVertical,
  Filter,
  ArrowUpDown,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiries, setSelectedEnquiries] = useState(new Set());
  const [viewMode, setViewMode] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this enquiry? This action cannot be undone."
      )
    ) {
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
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedEnquiries.size} enquiries?`
      )
    ) {
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

  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries.filter(
      (enquiry) =>
        (enquiry.name &&
          enquiry.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enquiry.productName &&
          enquiry.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (enquiry.message &&
          enquiry.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Apply status filter
    if (statusFilter === "downloaded") {
      filtered = filtered.filter((e) => e.downloadedBrochure);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((e) => !e.downloadedBrochure);
    }

    return filtered;
  }, [enquiries, searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return formatDate(dateString);
    }
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
    pending: enquiries.filter((e) => !e.downloadedBrochure).length,
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary-900 mb-1">
            Enquiries Management
          </h1>
          <p className="text-sm text-primary-600">
            Manage and track customer enquiries
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedEnquiries.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedEnquiries.size})
            </button>
          )}
        </div>
      </div>

      {/* Stats - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-3 border border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-primary-600 mb-0.5">
                Total Enquiries
              </p>
              <p className="text-xl font-bold text-primary-900">
                {stats.total}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-primary-500/10">
              <MessageSquare className="w-4 h-4 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 mb-0.5">
                Recent (7d)
              </p>
              <p className="text-xl font-bold text-green-900">{stats.recent}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-500/10">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-3 border border-secondary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-secondary-600 mb-0.5">
                Downloaded
              </p>
              <p className="text-xl font-bold text-secondary-900">
                {stats.downloaded}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-secondary-500/10">
              <Download className="w-4 h-4 text-secondary-600" />
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
              placeholder="Search enquiries by name, email, phone, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 placeholder:text-gray-400 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600">
                Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="all">All Enquiries</option>
                <option value="downloaded">Downloaded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiries List */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {searchTerm ? "No enquiries found" : "No enquiries yet"}
          </h3>
          <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
            {searchTerm
              ? "Try adjusting your search terms or clear the search to see all enquiries."
              : "Customer enquiries will appear here when they contact you."}
          </p>
        </div>
      ) : (
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
                          selectedEnquiries.size === filteredEnquiries.length &&
                          filteredEnquiries.length > 0
                        }
                        onChange={selectAllEnquiries}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </label>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                    Contact Info
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[150px] whitespace-nowrap">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[100px] whitespace-nowrap">
                    Received
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider min-w-[120px] whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry._id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedEnquiries.has(enquiry._id) ? "bg-primary-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEnquiries.has(enquiry._id)}
                          onChange={() => toggleSelectEnquiry(enquiry._id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {enquiry.name || "Anonymous"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3.5 h-3.5 text-primary-500" />
                          <span className="text-gray-700">{enquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-gray-700">{enquiry.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <Package className="w-3.5 h-3.5 text-purple-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {enquiry.productName || "No product"}
                          </div>
                          {enquiry.product?.orderCode && (
                            <div className="text-xs text-gray-500">
                              Code: {enquiry.product.orderCode}
                            </div>
                          )}
                          {enquiry.product?.category?.name && (
                            <div className="text-xs text-gray-500">
                              Category: {enquiry.product.category.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <div className="text-gray-700 text-sm line-clamp-2">
                          {enquiry.message || "No message provided"}
                        </div>
                        {enquiry.message && enquiry.message.length > 100 && (
                          <button
                            onClick={() => {
                              // You could implement a modal to view full message
                              alert(enquiry.message);
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium mt-1"
                          >
                            View full message
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <div
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            enquiry.downloadedBrochure
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {enquiry.downloadedBrochure ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Downloaded
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </>
                          )}
                        </div>
                        {enquiry.downloadedBrochure &&
                          enquiry.downloadTimestamp && (
                            <div className="text-xs text-gray-500">
                              {formatDate(enquiry.downloadTimestamp)}
                            </div>
                          )}
                        {enquiry.product?.brochure?.path && (
                          <a
                            href={enquiry.product.brochure.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors"
                            title="Download Brochure"
                          >
                            <FileText className="w-3 h-3" />
                            Brochure
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(enquiry.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(enquiry.createdAt)}
                        </div>
                        <div className="text-xs text-primary-600 font-medium">
                          {getTimeAgo(enquiry.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <a
                          href={`mailto:${enquiry.email}`}
                          className="p-1.5 rounded-md bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                          title="Reply via Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="p-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        {enquiry.product?.brochure?.path && (
                          <a
                            href={enquiry.product.brochure.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            title="View Brochure"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(enquiry._id)}
                          className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Quick Actions Bar */}
      {selectedEnquiries.size > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedEnquiries.size} enquiry
            {selectedEnquiries.size !== 1 ? "ies" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Implement bulk email feature
                const selectedEmails = filteredEnquiries
                  .filter((e) => selectedEnquiries.has(e._id))
                  .map((e) => e.email);
                window.location.href = `mailto:${selectedEmails.join(",")}`;
              }}
              className="px-3 py-1.5 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-sm"
            >
              <Mail className="w-4 h-4" />
              Email All
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors flex items-center gap-1.5 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEnquiries;
