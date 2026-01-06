import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiUsers,
  FiGlobe,
  FiTarget,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiHeart,
  FiStar,
  FiShield,
  FiTrendingUp,
  FiZap,
  FiBookOpen,
  FiLayers,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiAnchor,
} from "react-icons/fi";
import { FaIndustry, FaUniversity, FaCertificate } from "react-icons/fa";

const About = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const companyInfo = {
    established: "2014",
    ceo: "Abhishek Aggarwal",
    address:
      "No. 80, HSIIDC Industrial Area, HSIDC Industrial Estate, Ambala- 133001, Haryana, India",
    employees: "11 to 25 People",
    businessType: "Manufacturer",
    turnover: "5 - 25 Cr",
    gstNo: "06ACUFS7630L1ZD",
    gstDate: "01-07-2017",
    legalStatus: "Partnership",
    exportPercentage: "60-80%",
    premisesSize: "500 square meters",
  };

  const exportCountries = [
    "Nepal",
    "Bangladesh",
    "Iraq",
    "Sri Lanka",
    "United States Of America",
  ];

  const shipmentModes = [
    { mode: "By Road", icon: <FiTruck className="w-4 h-4 text-primary-900" /> },
    { mode: "By Air", icon: <FiZap className="w-4 h-4  text-primary-900" /> },
    {
      mode: "By Sea",
      icon: <FiAnchor className="w-4 h-4  text-primary-900" />,
    },
    {
      mode: "By Cargo",
      icon: <FiPackage className="w-4 h-4  text-primary-50" />,
    },
  ];

  const certifications = [
    {
      name: "IndiaMART Trust Seal Verified",
    },
    {
      name: "IndiaMART Verified Exporter",
    },
    {
      name: "ISO Certified Manufacturing",
    },
  ];

  const productCategories = [
    "Chemical Lab Equipment",
    "Heat Transfer Lab Equipment",
    "Mass Transfer Equipment",
    "Scientific Instruments",
    "Mechanical Instruments",
    "Civil Instruments",
  ];

  const stats = [
    {
      number: "10+",
      label: "Years of Excellence",
      icon: <FiAward />,
      description: "Established in 2014",
    },
    {
      number: "60-80%",
      label: "Export Percentage",
      icon: <FiGlobe />,
      description: "Global reach across 5+ countries",
    },
    {
      number: "500+",
      label: "Products Range",
      icon: <FiPackage />,
      description: "Scientific lab equipment",
    },
    {
      number: "5-25 Cr",
      label: "Annual Turnover",
      icon: <FiDollarSign />,
      description: "Strong financial performance",
    },
  ];

  const infrastructure = [
    {
      title: "Modern Manufacturing",
      description:
        "500 sq.m facility with advanced infrastructure and technologies",
      icon: <FaIndustry className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Skilled Team",
      description: "11-25 qualified professionals with rich expertise",
      icon: <FiUsers className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Quality Assurance",
      description: "Stringent quality tests on standard parameters",
      icon: <FiCheckCircle className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Global Distribution",
      description: "Multiple shipment modes for worldwide delivery",
      icon: <FiTruck className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary-50/20 to-white">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-800">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <FiAward className="text-white w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm font-semibold text-white">
                Excellence Since {companyInfo.established}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Superb Technologies
              <span className="block text-xl sm:text-2xl lg:text-3xl text-white/90 mt-4">
                Pioneering Scientific Laboratory Solutions
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed max-w-3xl mx-auto px-4">
              Manufacturer of premium Chemical Lab Equipment, Heat Transfer Lab
              Equipment, and Mass Transfer Equipment with a commitment to
              quality and innovation.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              <a
                href="tel:+919829132777"
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-transparent border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 text-sm sm:text-base"
              >
                <FiPhone className="w-4 h-4" />
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 lg:-mt-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl border border-primary-100 p-4 sm:p-6 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <div className="text-xl sm:text-2xl text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary-700 to-secondary-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-gray-900 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                    {stat.description}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500 text-center sm:hidden mt-2">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Overview */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
              About{" "}
              <span className="text-primary-600">Superb Technologies</span>
            </h2>

            <div className="space-y-4 sm:space-y-6 text-gray-600">
              <p className="text-base sm:text-lg leading-relaxed">
                Established in {companyInfo.established}, Superb Technologies
                has modern infrastructure facilities and technologies that help
                in the production of Scientific Lab Equipment as per market
                demand.
              </p>
              <p className="leading-relaxed">
                Our infrastructure is equipped with all the modern facilities
                that allow bringing perfection in the products manufactured at
                our end. We have a team of experts who make sure to offer the
                products as per industrial requirements.
              </p>
              <p className="leading-relaxed">
                They conduct stringent quality tests to check the entire range
                of products on specific standard parameters. Our organization
                practices ethical & transparent business approach while dealing
                with our clients.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-primary-700">
                    {cert.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center">
                <div className="text-center p-6 sm:p-8">
                  <FaUniversity className="w-16 h-16 sm:w-20 sm:h-20 text-white/80 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    Manufacturing Excellence
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Since {companyInfo.established}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership */}
      <div className="bg-gradient-to-b from-primary-50/30 via-white to-primary-50/20 py-12 sm:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-7xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                Meet <span className="text-primary-600">Our Leadership</span>
              </h2>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-primary-100 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-bold text-white">
                      {companyInfo.ceo.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {companyInfo.ceo}
                  </h3>
                  <div className="text-primary-600 text-lg sm:text-xl font-semibold mb-4">
                    Chief Executive Officer
                  </div>

                  <p className="text-gray-600 mb-4">
                    Our CEO, {companyInfo.ceo}, graduated as an Engineer and has
                    proved to be an ideal inspiration for our organization. He
                    has always motivated and guided all the people associated
                    with our organization to bring excellence in the tasks
                    assigned to them.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <div className="text-sm text-primary-700 font-medium">
                        GST Partner
                      </div>
                      <div className="font-semibold text-gray-700">
                        Abhishek Aggarwal, Ravinder Aggarwal
                      </div>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <div className="text-sm text-secondary-700 font-medium">
                        Legal Status
                      </div>
                      <div className="font-semibold text-gray-700">
                        {companyInfo.legalStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-primary-100">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                  Our Professional Team
                </h4>
                <p className="text-gray-600">
                  Our organization has a team of {companyInfo.employees} skilled
                  professionals who put in their best efforts to offer an
                  excellent range of Scientific, Mechanical & Civil Instruments
                  in the market. The professionals associated with us use their
                  rich expertise and experience to carry out production and
                  other related processes. These professionals are committed to
                  offer a range of products which satisfies the exact
                  requirements of the clients in the best possible manner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure & Capabilities */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Our{" "}
            <span className="text-primary-600">Manufacturing Excellence</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {infrastructure.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-lg border border-primary-100 p-4 sm:p-6 hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500"
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{item.icon}</div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                {item.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Product Categories */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-primary-100 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Our Product Range
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {productCategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-primary-50 rounded-lg"
                >
                  <FiCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">
                    {category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Markets */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-primary-100 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Global Reach
            </h3>
            <div className="mb-4">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                {companyInfo.exportPercentage} Export
              </div>
              <div className="text-sm text-gray-600">
                of our business is international
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {exportCountries.map((country, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary-50 text-secondary-700 rounded-full text-sm"
                >
                  <FiGlobe className="w-3 h-3" />
                  {country}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Company Details Tabs */}
      <div className="bg-gradient-to-b from-white to-primary-50/20 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                Our <span className="text-primary-600">Company Details</span>
              </h2>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                Comprehensive information about our business operations and
                capabilities.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-8 justify-center">
              {["profile", "shipping", "legal"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                      : "bg-primary-50 text-primary-700 hover:bg-primary-100 hover:shadow-md"
                  }`}
                >
                  {tab === "profile" && "Business Profile"}
                  {tab === "shipping" && "Shipping Details"}
                  {tab === "legal" && "Legal Information"}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl border border-primary-100 p-6 sm:p-8 lg:p-10">
              {activeTab === "profile" && (
                <div className="animate-fade-in">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Business Profile
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      {
                        label: "Nature of Business",
                        value: companyInfo.businessType,
                      },
                      { label: "Company CEO", value: companyInfo.ceo },
                      {
                        label: "Total Employees",
                        value: companyInfo.employees,
                      },
                      { label: "Annual Turnover", value: companyInfo.turnover },
                      {
                        label: "Premises Size",
                        value: companyInfo.premisesSize,
                      },
                      { label: "Location Type", value: "URBAN" },
                      { label: "Building Infrastructure", value: "Permanent" },
                      { label: "Space Around", value: "Front porch" },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-primary-50/30 rounded-lg"
                      >
                        <div className="text-sm text-primary-700 font-medium mb-1">
                          {item.label}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="animate-fade-in">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Shipping & Logistics
                  </h3>

                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Shipment Modes
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {shipmentModes.map((mode, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-primary-50 rounded-lg"
                        >
                          {mode.icon}
                          <span className="font-medium text-gray-900">
                            {mode.mode}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Banker Details
                    </h4>
                    <div className="p-4 bg-secondary-50 rounded-lg">
                      <div className="font-semibold text-gray-900">
                        KOTAK MAHINDRA BANK LIMITED
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Kotak Mahindra
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "legal" && (
                <div className="animate-fade-in">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Legal & Statutory Information
                  </h3>

                  <div className="space-y-6">
                    {[
                      { label: "GST Number", value: companyInfo.gstNo },
                      {
                        label: "GST Registration Date",
                        value: companyInfo.gstDate,
                      },
                      {
                        label: "Import Export Code (IEC)",
                        value: "3315900710",
                      },
                      { label: "TAN Number", value: "RTKS3*****" },
                      {
                        label: "Legal Status of Firm",
                        value: companyInfo.legalStatus,
                      },
                      {
                        label: "Registered Address",
                        value: companyInfo.address,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="p-4 bg-primary-50/30 rounded-lg"
                      >
                        <div className="text-sm text-primary-700 font-medium mb-1">
                          {item.label}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Location */}
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
                Visit Our Manufacturing Unit
              </h2>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
                Located in the industrial hub of Ambala, Haryana
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
              {/* Address Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <FiMapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Registered Office
                    </h3>
                    <p className="text-white/80 text-sm">
                      Manufacturing & Head Office
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FiMapPin className="w-5 h-5 text-white/80 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white">{companyInfo.address}</p>
                      <p className="text-white/60 text-sm mt-1">
                        HSIIDC Industrial Area, Ambala
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiPhone className="w-5 h-5 text-white/80" />
                    <a
                      href="tel:+919829132777"
                      className="text-white hover:text-white/90"
                    >
                      +91 98291 32777
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-white/80" />
                    <a
                      href="mailto:info@superbtechnologies.in"
                      className="text-white hover:text-white/90"
                    >
                      info@superbtechnologies.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Manufacturing Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                    <FaIndustry className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Manufacturing Unit
                    </h3>
                    <p className="text-white/80 text-sm">
                      State-of-the-art facility
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Factory Area</span>
                    <span className="text-white font-semibold">
                      {companyInfo.premisesSize}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Infrastructure</span>
                    <span className="text-white font-semibold">
                      Permanent Building
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Team Size</span>
                    <span className="text-white font-semibold">
                      {companyInfo.employees}
                    </span>
                  </div>

                  <div className="mt-6">
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center w-full px-6 py-3 bg-white text-primary-700 font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      View Our Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
