import React from "react";
import {
  FiStar,
  FiCheckCircle,
  FiTrendingUp,
  FiSettings,
} from "react-icons/fi";

import img1 from "../assests/01.webp";
import img2 from "../assests/02.jpg";
import img3 from "../assests/03.webp";

const products = [
  {
    image: img1,
    title: "Industrial Training & Testing Setup",
    desc: "Custom-built laboratory and industrial training systems designed for durability and accuracy.",
    features: ["ISO Certified", "Custom Configurable", "Training Manuals"],
    badge: "Best Seller",
  },
  {
    image: img2,
    title: "Three Phase Transmission Line Simulator",
    desc: "Advanced electrical engineering trainer with real-time simulation and measurement panels.",
    features: ["Real-time Data", "Safety Certified", "Digital Controls"],
    badge: "Featured",
  },
  {
    image: img3,
    title: "Electrical & Machine Trainer Kits",
    desc: "AC machine control panels and transformer trainer kits for engineering institutes.",
    features: ["Academic Use", "Easy Maintenance", "Comprehensive Guide"],
    badge: "New",
  },
];

const ProductShowcaseSection = () => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-primary-50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-primary-600">Laboratory & Training</span>{" "}
            Equipment
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Professionally engineered equipment designed for academic
            excellence, industrial precision, and long-term reliability in
            research environments.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl border border-primary-100 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Image Container with Badge */}
              <div className="relative h-64 bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Badge */}
                <div
                  className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
                    item.badge === "Best Seller"
                      ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                      : item.badge === "Featured"
                      ? "bg-gradient-to-r from-primary-500 to-primary-600"
                      : "bg-gradient-to-r from-secondary-500 to-primary-500"
                  }`}
                >
                  {item.badge}
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title with Icon */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiSettings className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-900 group-hover:text-primary-800 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-4">
                  {item.desc}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  {item.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <FiCheckCircle
                        className="text-secondary-500 flex-shrink-0"
                        size={16}
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Quality Indicators */}
                <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className="w-3 h-3 text-secondary-500 fill-secondary-500"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      Premium Quality
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary-700 font-semibold">
                    <FiTrendingUp className="text-secondary-500" />
                    <span>Industry Grade</span>
                  </div>
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-2xl transition-all duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
