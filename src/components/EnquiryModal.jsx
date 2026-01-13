import React, { useState } from "react";
import {
  FiX,
  FiDownload,
  FiMail,
  FiUser,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";
import api from "../utils/api";

const EnquiryModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    organization: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/enquiries", {
        ...formData,
        productId: product._id,
        productName: product.name,
        productCode: product.orderCode,
      });

      // Check if response has downloadUrl (Cloudinary) or is a blob (local file)
      if (response.data && response.data.downloadUrl) {
        // Cloudinary URL - fetch as blob and download properly
        try {
          const pdfResponse = await fetch(response.data.downloadUrl);
          if (!pdfResponse.ok) {
            throw new Error("Failed to fetch PDF");
          }
          const pdfBlob = await pdfResponse.blob();
          const blobUrl = window.URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${product.name.replace(/\s+/g, "-")}-brochure.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        } catch (fetchError) {
          console.error("PDF fetch error:", fetchError);
          // Fallback: open in new tab if fetch fails
          window.open(response.data.downloadUrl, "_blank");
        }
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else if (response.data instanceof Blob) {
        // Local file - download as blob
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${product.name.replace(/\s+/g, "-")}-brochure.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data) {
        try {
          const errorData = JSON.parse(err.response.data);
          setError(errorData.message || "An error occurred");
        } catch {
          setError("Failed to process your request. Please try again.");
        }
      } else {
        setError(
          "Failed to submit enquiry. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-fade-in animation-delay-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FiDownload className="text-secondary-400" />
              Product Enquiry
            </h2>
            <p className="text-primary-200 text-sm mt-1">{product.name}</p>
          </div>
          <button
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-4">
                Your enquiry has been submitted successfully. Our team will
                contact you shortly.
              </p>
              {product.brochure && (
                <p className="text-primary-600 font-medium">
                  The brochure is downloading automatically...
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 mb-6 border border-primary-200">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Provide your details to receive the product brochure and a
                      quote from our experts.
                    </p>
                    {product.brochure && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-secondary-500"></div>
                        <span className="text-sm text-primary-700 font-medium">
                          Brochure available for download
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-800 mb-2 flex items-center gap-2">
                    <FiUser className="text-primary-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-800 mb-2 flex items-center gap-2">
                    <FiMail className="text-primary-600" />
                    Email Address
                    <span className="text-secondary-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@organization.com"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-800 mb-2 flex items-center gap-2">
                    <FiPhone className="text-primary-600" />
                    Phone Number
                    <span className="text-secondary-600">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-800 mb-2">
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Your organization name"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary-800 mb-2 flex items-center gap-2">
                    <FiMessageSquare className="text-primary-600" />
                    Additional Information
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Please specify your requirements, quantity needed, or any other details..."
                    className="input-field resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-500 to-gray-400 px-4 py-3 rounded-xl text-white"
                    onClick={onClose}
                  >
                    <FiX />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-bl from-primary-500 to-primary-400  rounded-xl text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiDownload />
                        Submit Enquiry
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our{" "}
                  <a
                    href="/privacy"
                    className="text-primary-600 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  . We respect your privacy and will not share your information
                  with third parties.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnquiryModal;
