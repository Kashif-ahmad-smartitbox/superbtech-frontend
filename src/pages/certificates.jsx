import React, { useState, useEffect, useCallback } from "react";
import {
  FiX,
  FiZoomIn,
  FiZoomOut,
  FiAward,
  FiCheckCircle,
  FiDownload,
  FiExternalLink,
  FiCalendar,
  FiHash,
} from "react-icons/fi";

// Import certificate images
import cert1 from "../assests/cert/1.png";
import cert2 from "../assests/cert/2.png";
import cert3 from "../assests/cert/3.png";
import cert4 from "../assests/cert/4.png";
import cert5 from "../assests/cert/5.png";
import cert6 from "../assests/cert/6.png";
import cert7 from "../assests/cert/7.png";
import cert8 from "../assests/cert/8.png";
import cert9 from "../assests/cert/9.png";

const certificates = [
  {
    id: 1,
    image: cert1,
    title: "ISO 9001:2015",
    description: "Quality Management System Certification",
    issueDate: "14 October 2024",
    validUntil: "13 October 2027",
    category: "Quality",
    authority: "International Organization for Standardization",
  },
  {
    id: 2,
    image: cert2,
    title: "ISO 45001:2018",
    description: "Occupational Health & Safety Management System",
    issueDate: "08 October 2024",
    validUntil: "07 October 2027",
    category: "Safety",
    authority: "International Organization for Standardization",
  },
  {
    id: 3,
    image: cert3,
    title: "ISO 37001:2016",
    description: "Anti-Bribery Management System",
    issueDate: "08 October 2024",
    validUntil: "07 October 2027",
    category: "Compliance",
    authority: "International Organization for Standardization",
  },
  {
    id: 4,
    image: cert4,
    title: "CE Certification (Medical Directive 2004/22/EC)",
    description: "Conformity for Medical & Scientific Equipment",
    issueDate: "08 October 2024",
    validUntil: "07 October 2027",
    category: "Medical",
    authority: "European Commission",
  },
  {
    id: 5,
    image: cert5,
    title: "ISO 13485:2016",
    description: "Medical Device Quality Management System",
    issueDate: "08 October 2024",
    validUntil: "07 October 2027",
    category: "Medical",
    authority: "International Organization for Standardization",
  },
  {
    id: 6,
    image: cert6,
    title: "ISO 50001:2018",
    description: "Energy Management System",
    issueDate: "10 October 2024",
    validUntil: "10 October 2027",
    category: "Environmental",
    authority: "International Organization for Standardization",
  },
  {
    id: 7,
    image: cert7,
    title: "EN 61010-1:2010",
    description: "Safety Requirements for Electrical Equipment",
    issueDate: "08 October 2024",
    validUntil: "07 October 2027",
    category: "Safety",
    authority: "European Committee for Electrotechnical Standardization",
  },
  {
    id: 8,
    image: cert8,
    title: "Pressure Equipment Directive 2014/68/EU",
    description: "EU Compliance for Pressure Equipment",
    issueDate: "10 October 2024",
    validUntil: "09 October 2027",
    category: "Compliance",
    authority: "European Commission",
  },
  {
    id: 9,
    image: cert9,
    title: "ISO 14001:2015",
    description: "Environmental Management System",
    issueDate: "08 October 2024",
    validUntil: "07 October 2027",
    category: "Environmental",
    authority: "International Organization for Standardization",
  },
];

function Certificates() {
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") {
      setSelected(null);
      setZoom(false);
      setRotate(0);
    }
    if (e.key === "+" || e.key === "=") {
      setZoom(true);
    }
    if (e.key === "-") {
      setZoom(false);
    }
  }, []);

  useEffect(() => {
    if (selected) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [selected, handleKeyDown]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter certificates by category
  const filteredCertificates = certificates.filter(
    (cert) => filter === "all" || cert.category === filter
  );

  const categories = [
    { id: "all", name: "All Certificates", count: certificates.length },
    {
      id: "Quality",
      name: "Quality Management",
      count: certificates.filter((c) => c.category === "Quality").length,
    },
    {
      id: "Safety",
      name: "Health & Safety",
      count: certificates.filter((c) => c.category === "Safety").length,
    },
    {
      id: "Medical",
      name: "Medical Standards",
      count: certificates.filter((c) => c.category === "Medical").length,
    },
    {
      id: "Environmental",
      name: "Environmental",
      count: certificates.filter((c) => c.category === "Environmental").length,
    },
    {
      id: "Compliance",
      name: "Compliance",
      count: certificates.filter((c) => c.category === "Compliance").length,
    },
  ];

  const handleDownload = () => {
    if (!selected) return;
    const link = document.createElement("a");
    link.href = selected.image;
    link.download = `${selected.title.replace(/\s+/g, "_")}_Certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRotate = () => {
    setRotate((prev) => (prev + 90) % 360);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/10 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full backdrop-blur-sm">
            <FiAward className="text-primary-600 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              International Accreditations
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
            Our Certifications
            <span className="block text-lg sm:text-2xl lg:text-3xl xl:text-4xl bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mt-2">
              Quality & Compliance
            </span>
          </h1>

          <p className="text-base sm:text-sm lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            These internationally recognized certifications demonstrate our
            commitment to manufacturing excellence, safety compliance, and
            environmental responsibility in laboratory equipment production.
          </p>

          {/* Quick Stats */}
          <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-3 sm:gap-4 max-w-2xl mx-auto">
            {[
              { label: "Total Certifications", value: "9" },
              { label: "Countries Valid", value: "150+" },
              { label: "Years Experience", value: "10+" },
              { label: "Annual Audits", value: "2" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex-1 min-w-[120px] bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-primary-100 hover:shadow-md transition-shadow"
              >
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-700 to-secondary-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                  filter === cat.id
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-700 shadow-sm border border-primary-100"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-xs px-1.5 py-0.5 bg-white/20 rounded-full">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative bg-white rounded-xl sm:rounded-2xl border border-primary-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              onClick={() => setSelected(cert)}
            >
              {/* Certificate Card */}
              <div className="relative h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-gray-50 to-primary-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                {/* Loading Skeleton */}
                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                )}

                {/* Certificate Image */}
                <img
                  src={cert.image}
                  alt={cert.title}
                  loading="lazy"
                  className={`max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-[1.02] ${
                    loading ? "opacity-0" : "opacity-100"
                  }`}
                  style={{
                    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
                  }}
                  onLoad={() => setLoading(false)}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FiZoomIn className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <FiExternalLink className="w-4 h-4 text-secondary-600" />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-primary-700 shadow-sm">
                    <FiHash className="w-3 h-3" />
                    {cert.category}
                  </span>
                </div>

                {/* Certificate Number */}
                <div className="absolute bottom-4 left-4 w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                  <span className="text-xs font-bold text-white">
                    {cert.id}
                  </span>
                </div>
              </div>

              {/* Certificate Info */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <FiAward className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {cert.description}
                    </p>
                  </div>
                </div>

                {/* Validity Info */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-primary-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FiCalendar className="w-3 h-3" />
                      <span>Issued</span>
                    </div>
                    <div className="text-sm font-semibold text-primary-700">
                      {cert.issueDate}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
                      <FiCalendar className="w-3 h-3" />
                      <span>Valid Until</span>
                    </div>
                    <div className="text-sm font-semibold text-secondary-600">
                      {cert.validUntil}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Active & Valid
                  </span>
                  <span className="text-xs text-gray-500">
                    Click to view details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information Panel */}
        <div className="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-br from-primary-50/50 via-white to-secondary-50/50 rounded-xl sm:rounded-2xl border border-primary-200 p-6 sm:p-8 lg:p-10 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Why Our Certifications Matter
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Each certification represents our commitment to international
                standards, ensuring that every laboratory instrument we
                manufacture meets rigorous quality, safety, and performance
                benchmarks for educational and industrial applications
                worldwide.
              </p>
              <ul className="space-y-3">
                {[
                  "Ensures product reliability and durability",
                  "Complies with international safety regulations",
                  "Facilitates global export and acceptance",
                  "Demonstrates environmental responsibility",
                  "Guarantees consistent manufacturing quality",
                  "Enhances customer trust and confidence",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 flex items-center justify-center p-8">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl">
                  <FiAward className="w-20 h-20 text-white" />
                </div>
              </div>
              <div className="mt-8 text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  100% Compliance
                </div>
                <p className="text-gray-600 mt-2">
                  Across all international standards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Certificate Viewer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              setSelected(null);
              setZoom(false);
              setRotate(0);
            }}
          />

          {/* Modal Container */}
          <div
            className="relative z-10 bg-white rounded-2xl sm:rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-6 bg-white border-b border-primary-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <FiAward className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    {selected.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selected.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRotate}
                  className="p-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                  title="Rotate 90°"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setZoom(!zoom)}
                  className="p-2 rounded-lg bg-secondary-50 text-secondary-700 hover:bg-secondary-100 transition-colors"
                  title={zoom ? "Zoom Out" : "Zoom In"}
                >
                  {zoom ? (
                    <FiZoomOut className="w-5 h-5" />
                  ) : (
                    <FiZoomIn className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                  title="Download Certificate"
                >
                  <FiDownload className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setSelected(null);
                    setZoom(false);
                    setRotate(0);
                  }}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-auto max-h-[calc(90vh-80px)]">
              {/* Certificate Image Container */}
              <div className="relative bg-gradient-to-br from-gray-50 to-primary-50 rounded-xl sm:rounded-2xl p-4 sm:p-8 flex items-center justify-center min-h-[400px] overflow-hidden">
                <div
                  className={`transition-all duration-300 ${
                    zoom ? "scale-125" : "scale-100"
                  } ${rotate ? `rotate-${rotate}` : ""}`}
                  style={{ transform: `rotate(${rotate}deg)` }}
                >
                  <img
                    src={selected.image}
                    alt={selected.title}
                    className="max-w-full max-h-[500px] object-contain shadow-xl rounded-lg"
                    style={{
                      filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))",
                    }}
                  />
                </div>

                {/* Zoom Indicator */}
                {zoom && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                    Zoomed 125%
                  </div>
                )}

                {/* Rotation Indicator */}
                {rotate > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 text-white text-xs rounded-full backdrop-blur-sm">
                    Rotated {rotate}°
                  </div>
                )}
              </div>

              {/* Certificate Details */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Certificate Title",
                    value: selected.title,
                    icon: FiAward,
                    bg: "bg-primary-50",
                    text: "text-primary-700",
                  },
                  {
                    label: "Issuing Authority",
                    value: selected.authority,
                    icon: FiExternalLink,
                    bg: "bg-secondary-50",
                    text: "text-secondary-700",
                  },
                  {
                    label: "Issue Date",
                    value: selected.issueDate,
                    icon: FiCalendar,
                    bg: "bg-green-50",
                    text: "text-green-700",
                  },
                  {
                    label: "Valid Until",
                    value: selected.validUntil,
                    icon: FiCheckCircle,
                    bg: "bg-blue-50",
                    text: "text-blue-700",
                  },
                ].map((detail, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${detail.bg} ${detail.text}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <detail.icon className="w-4 h-4" />
                      <div className="text-xs font-medium">{detail.label}</div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {detail.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="mt-8 text-center text-sm text-gray-500 flex flex-wrap justify-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">
                    ESC
                  </kbd>
                  <span>to close</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">+</kbd>
                  <span>to zoom in</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">-</kbd>
                  <span>to zoom out</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    Click
                  </span>
                  <span>buttons for actions</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificates;
