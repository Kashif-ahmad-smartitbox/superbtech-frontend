import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white mt-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              About Us
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              Leading manufacturer and supplier of educational and technical equipment,
              providing reliable, advanced, and cost-effective solutions worldwide.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-all flex items-center gap-3 group">
                  <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-blue-400 transition-all flex items-center gap-3 group">
                  <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">Products</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-300 hover:text-blue-400 transition-all flex items-center gap-3 group">
                  <span className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="group-hover:translate-x-1 transition-transform">Admin Login</span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Contact Us
            </h3>
            <div className="space-y-4 text-gray-300">
              <a href="mailto:info@tesca.in" className="flex items-center gap-3 hover:text-blue-400 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>info@tesca.in</span>
              </a>
              <a href="tel:+919829132777" className="flex items-center gap-3 hover:text-blue-400 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span>+91-9829132777</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} SuperbTech. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="text-gray-400 text-sm">Made with ❤️ for excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

