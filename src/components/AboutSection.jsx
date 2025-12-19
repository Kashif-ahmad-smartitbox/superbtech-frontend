import React from "react";

const AboutSection = () => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            About <span className="text-primary-600">Superb Technologies</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            A trusted Indian manufacturer delivering reliable scientific and
            engineering laboratory equipment for academic and industrial
            applications.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          {/* Left Content */}
          <div className="space-y-6 text-gray-700 leading-relaxed text-[15px] md:text-base">
            <p>
              <strong className="text-primary-700">Superb Technologies</strong>,
              established in <strong className="text-primary-700">2015</strong>,
              is a professionally managed manufacturing firm engaged in the
              design, development, and supply of{" "}
              <strong className="text-primary-700">
                Scientific Laboratory Equipment
              </strong>
              . Since inception, the company has steadily built a reputation for
              quality, consistency, and dependable after-sales support.
            </p>

            <p>
              Our manufacturing portfolio includes{" "}
              <strong className="text-primary-700">
                Chemical Engineering Lab Equipment, Heat Transfer and Mass
                Transfer Systems, Fluid Mechanics Lab Equipment, and Fluid
                Machinery Test Rigs
              </strong>
              . These systems are engineered to meet academic curriculum
              requirements and practical training standards followed by
              technical institutes and universities.
            </p>

            <p>
              Every product is developed with a focus on{" "}
              <strong className="text-primary-700">
                mechanical robustness, operational simplicity, measurement
                accuracy, and long service life
              </strong>
              . This approach has enabled us to serve engineering colleges,
              research institutions, polytechnics, and industrial training
              centers across India and abroad.
            </p>

            <p>
              Backed by an experienced engineering and quality team, we follow
              strict quality control practices at every stage—from raw material
              selection to final testing—ensuring consistent performance and
              long-term reliability in real-world lab environments.
            </p>
          </div>

          {/* Right Stats & Trust */}
          <div className="space-y-8">
            {/* Key Facts */}
            <div className="grid grid-cols-2 gap-5">
              <div className="border border-primary-200 rounded-lg p-6 text-center bg-white hover:bg-primary-50 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="text-2xl font-semibold text-primary-600">
                  11–25
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Skilled Professionals
                </div>
              </div>

              <div className="border border-primary-200 rounded-lg p-6 text-center bg-white hover:bg-primary-50 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="text-2xl font-semibold text-primary-600">
                  ₹5–25 Cr
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Annual Turnover
                </div>
              </div>

              <div className="border border-primary-200 rounded-lg p-6 text-center bg-white hover:bg-primary-50 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="text-2xl font-semibold text-primary-600">
                  2015
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Year of Establishment
                </div>
              </div>

              <div className="border border-primary-200 rounded-lg p-6 text-center bg-white hover:bg-primary-50 transition-colors duration-300 shadow-sm hover:shadow-md">
                <div className="text-2xl font-semibold text-primary-600">
                  IEC
                </div>
                <div className="mt-1 text-sm text-gray-600">Export Enabled</div>
              </div>
            </div>

            {/* Trust & Compliance */}
            <div className="border border-primary-200 rounded-lg p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
              <h4 className="font-semibold text-primary-800 mb-3">
                Trust, Compliance & Recognition
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                  IndiaMART Trust Seal Verified Supplier
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                  IndiaMART Verified Exporter
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                  GST Registered Partnership Firm
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                  Consistent Supplier to Educational Institutions
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Closing Statement */}
        <div className="mt-14 max-w-5xl text-gray-700 leading-relaxed text-[15px] md:text-base">
          <p>
            At <strong className="text-primary-700">Superb Technologies</strong>
            , we believe long-term success is built on product reliability,
            ethical business practices, and customer satisfaction. Our goal is
            to support education and research by delivering laboratory equipment
            that performs consistently over time, adds real instructional value,
            and meets the evolving needs of engineering and scientific
            institutions.
          </p>

          {/* Mission/Vision Box */}
          <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg border border-primary-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">
                  Our Mission
                </h4>
                <p className="text-sm text-gray-700">
                  To provide high-quality, reliable laboratory equipment that
                  enhances technical education and industrial research
                  capabilities.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary-800 mb-2">
                  Our Vision
                </h4>
                <p className="text-sm text-gray-700">
                  To become the most trusted manufacturer of scientific
                  equipment in India, recognized for excellence in quality and
                  innovation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full -translate-y-32 translate-x-32 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-100 rounded-full translate-y-32 -translate-x-32 opacity-20 blur-3xl"></div>
      </div>
    </section>
  );
};

export default AboutSection;
