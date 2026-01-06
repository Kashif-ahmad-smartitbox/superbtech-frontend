import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assests/favicon.png";
import {
  Locate,
  LocateIcon,
  LocationEdit,
  Mail,
  MailPlus,
  Phone,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-primary-500 to-black text-white border-t border-primary-800">
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500"></div>

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img src={Logo} className="w-12" />
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
                { path: "/about", label: "About Us" },
                { path: "/certificates", label: "Certificates" },
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
            <div className="space-y-4 md:space-y-3">
              <a
                href="mailto:info@superbtechnologies.in"
                className="flex items-center gap-4 md:gap-3 group hover:text-secondary-300 transition-colors duration-300"
              >
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-all duration-300 group-hover:scale-105">
                  <Mail className="w-5 h-5 md:w-4 md:h-4 text-white group-hover:text-secondary-400" />
                </div>
                <span className="text-base md:text-sm text-gray-300 group-hover:text-white flex-1">
                  info@superbtechnologies.in
                </span>
              </a>

              <a
                href="tel:+919829132777"
                className="flex items-center gap-4 md:gap-3 group hover:text-secondary-300 transition-colors duration-300"
              >
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center group-hover:from-primary-500/30 group-hover:to-secondary-500/30 transition-all duration-300 group-hover:scale-105">
                  <Phone className="w-5 h-5 md:w-4 md:h-4 text-white group-hover:text-secondary-400" />
                </div>
                <span className="text-base md:text-sm text-gray-300 group-hover:text-white flex-1">
                  +91 98969 15524
                </span>
              </a>

              <div className="flex items-start gap-4 md:gap-3 group">
                <div className="w-10 h-10 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <LocationEdit className="w-5 h-5 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-base md:text-sm text-gray-300 flex-1 leading-relaxed">
                  258, Kurampur Mazri Manmohan Nagar Ambala City, Ambala -
                  134003 Haryana, India
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
      </div>
    </footer>
  );
};

export default Footer;
