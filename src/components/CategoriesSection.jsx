import React from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    title: "Chemical Engineering Lab",
    image: "/images/categories/chemical-engineering.jpg",
    link: "/categories/chemical-engineering",
    description: "Reaction, distillation & separation equipment",
  },
  {
    title: "Heat Transfer Systems",
    image: "/images/categories/heat-transfer.jpg",
    link: "/categories/heat-transfer",
    description: "Conduction, convection & radiation studies",
  },
  {
    title: "Mass Transfer Equipment",
    image: "/images/categories/mass-transfer.jpg",
    link: "/categories/mass-transfer",
    description: "Absorption, extraction & distillation units",
  },
  {
    title: "Fluid Mechanics Lab",
    image: "/images/categories/fluid-mechanics.jpg",
    link: "/categories/fluid-mechanics",
    description: "Flow measurement & hydraulic systems",
  },
  {
    title: "Fluid Machinery Test Rigs",
    image: "/images/categories/fluid-machinery.jpg",
    link: "/categories/fluid-machinery",
    description: "Pumps, turbines & performance testing",
  },
  {
    title: "Thermodynamics Lab",
    image: "/images/categories/thermodynamics.jpg",
    link: "/categories/thermodynamics",
    description: "Heat engines & refrigeration systems",
  },
  {
    title: "Process Control Systems",
    image: "/images/categories/process-control.jpg",
    link: "/categories/process-control",
    description: "PLC-based automation & instrumentation",
  },
  {
    title: "Environmental Engineering",
    image: "/images/categories/environmental.jpg",
    link: "/categories/environmental",
    description: "Water & air quality testing equipment",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Our <span className="text-primary-600">Product Categories</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of engineering laboratory equipment
            designed for educational institutions and industrial research
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-5 rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border border-primary-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-bl-full opacity-10"></div>

                {/* Image */}
                <div className="relative z-10 w-full h-full p-4 flex items-center justify-center">
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-white to-primary-50 p-1 shadow-inner">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-center">
                                <div class="text-primary-600 font-bold text-3xl">${
                                  index + 1
                                }</div>
                                <div class="text-primary-400 text-xs mt-1">CATEGORY</div>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/0 via-primary-900/0 to-primary-900/5 group-hover:to-primary-900/10 transition-all duration-500"></div>
              </div>

              {/* Content */}
              <div className="p-6 text-center relative">
                {/* Icon */}
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-primary-800 group-hover:text-primary-700 transition-colors mb-2 mt-2">
                  {category.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
