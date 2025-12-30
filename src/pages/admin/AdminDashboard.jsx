import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Reduced bottom margin from mb-8 to mb-5 */}
      <div className="mb-5">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your admin control panel</p>
      </div>
      
      {stats && (
        // Reduced gap from gap-6 to gap-4 and margin bottom from mb-12 to mb-8
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Products Card: Reduced padding to p-4 */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            {/* Reduced internal margins */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold opacity-90">Products</h3>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">{stats.products.total}</div>
            <div className="flex gap-3 text-sm mb-3">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg">Active: {stats.products.active}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-lg">Inactive: {stats.products.inactive}</span>
            </div>
            <Link to="/admin/products" className="text-white/90 hover:text-white font-semibold flex items-center gap-2 group text-sm">
              Manage Products
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Categories Card: Reduced padding to p-4 */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold opacity-90">Categories</h3>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">{stats.categories.total}</div>
            <div className="flex gap-3 text-sm mb-3">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg">Active: {stats.categories.active}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-lg">Inactive: {stats.categories.inactive}</span>
            </div>
            <Link to="/admin/categories" className="text-white/90 hover:text-white font-semibold flex items-center gap-2 group text-sm">
              Manage Categories
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Enquiries Card: Reduced padding to p-4 */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold opacity-90">Enquiries</h3>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-4xl font-bold mb-2">{stats.enquiries.total}</div>
            <div className="text-sm mb-3">
              <span className="bg-white/20 px-2 py-0.5 rounded-lg inline-block">Recent (7 days): {stats.enquiries.recent}</span>
            </div>
            <Link to="/admin/enquiries" className="text-white/90 hover:text-white font-semibold flex items-center gap-2 group text-sm">
              View Enquiries
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      )}

      <div>
        {/* Reduced margin bottom */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        
        {/* Reduced gap from gap-6 to gap-4 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/products" 
            // Reduced padding from p-6 to p-4
            className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-blue-200"
          >
            {/* Reduced icon size and margins */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Add New Product</h4>
            <p className="text-gray-600 text-sm">Create a new product entry</p>
          </Link>
          
          <Link 
            to="/admin/categories" 
            className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">Add New Category</h4>
            <p className="text-gray-600 text-sm">Create a new product category</p>
          </Link>
          
          <Link 
            to="/admin/enquiries" 
            className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-transparent hover:border-purple-200"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">View Enquiries</h4>
            <p className="text-gray-600 text-sm">Check customer enquiries</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;