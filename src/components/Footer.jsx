import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-primary-950 to-black text-white border-t border-primary-800">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500"></div>

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Superb Technologies
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Leading manufacturer and supplier of precision educational and
              technical equipment, delivering reliable, advanced solutions
              globally.
            </p>
            <div className="pt-2">
              <span className="text-xs text-primary-300">Established 2015</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { path: "/", label: "Home" },
                { path: "/products", label: "Products" },
                { path: "/catalog", label: "Catalog" },
                { path: "/admin/login", label: "Admin Login" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-gray-300 hover:text-white transition-colors py-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-3">
              <a
                href="mailto:info@superbtechnologies.in"
                className="flex items-center gap-3 group hover:text-secondary-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-all">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white">
                  info@superbtechnologies.in
                </span>
              </a>

              <a
                href="tel:+919829132777"
                className="flex items-center gap-3 group hover:text-secondary-300 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-all">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white">
                  +91 98969 15524
                </span>
              </a>

              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">
                  Ambala - 134003 Haryana, India
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Superb Technologies. All rights reserved.
            </p>
            <p className="text-primary-300 text-xs mt-1">
              GST Registered • IndiaMART Verified • Trust Seal Certified
            </p>
          </div>

          {/* Replaced "Excellence in Laboratory Equipment" with the credit line */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              <span className="text-xs text-gray-500">
                Designed with ❤️ and crafted with care by
              </span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://smartitbox.in/"
                className="text-sm font-medium bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent"
              >
                Team SMART ITBOX
              </a>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-xs text-gray-400">
                Your Business Automation Partner
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-primary-900/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-secondary-900/20 rounded-full blur-3xl"></div>
      </div>
    </footer>
  );
};

export default Footer;
