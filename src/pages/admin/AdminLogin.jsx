import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiEye, FiEyeOff, FiLock, FiMail, FiArrowRight } from "react-icons/fi";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
      await login(formData.email, formData.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Hero Content */}
        <div className="hidden lg:block text-center lg:text-left animate-fade-in text-white">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <FiLock className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 bg-clip-text text-transparent">
              Admin Portal
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-primary-100 to-secondary-100 bg-clip-text text-transparent">
              Streamline Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 bg-clip-text text-transparent animate-gradient">
              Admin Workflow
            </span>
          </h1>
          <p className="text-lg text-primary-100/90 mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
            Access your admin dashboard to manage products, categories, and
            customer enquiries with ease.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {[
              { text: "Product Management", color: "primary" },
              { text: "Category Control", color: "primary" },
              { text: "Enquiry Tracking", color: "secondary" },
            ].map((feature, index) => (
              <div
                key={feature.text}
                className="flex items-center space-x-2 text-primary-200"
              >
                <div
                  className={`w-2 h-2 ${
                    feature.color === "secondary"
                      ? "bg-secondary-400"
                      : "bg-primary-400"
                  } rounded-full animate-pulse`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                ></div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-12 p-6 bg-gradient-to-r from-primary-800/30 to-primary-900/20 rounded-xl border border-primary-700/30 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">
              Secure Access
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-primary-200">
                <svg
                  className="w-4 h-4 text-secondary-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Encrypted connection (SSL/TLS)
              </li>
              <li className="flex items-center text-sm text-primary-200">
                <svg
                  className="w-4 h-4 text-secondary-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Multi-factor authentication ready
              </li>
              <li className="flex items-center text-sm text-primary-200">
                <svg
                  className="w-4 h-4 text-secondary-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Activity logging and monitoring
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center lg:justify-end animate-fade-in animation-delay-300">
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-primary-100/30 backdrop-blur-sm w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl pointer-events-none"></div>
            <div className="text-center mb-8 relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <FiLock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Admin Sign In
              </h2>
              <p className="text-gray-500 mt-2">Access your admin workspace</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-gray-400 focus:shadow-lg focus:shadow-primary-100"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border-2 border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 placeholder-gray-400 focus:shadow-lg focus:shadow-primary-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/admin/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-primary-500/30 flex items-center justify-center gap-2 hover:scale-105 transform group"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
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
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
            <div className="mt-6 text-center relative">
              <Link
                to="/"
                className="text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors duration-200 inline-flex items-center gap-2 group"
              >
                <svg
                  className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </Link>
            </div>

            {/* Security Note */}
            <div className="mt-8 pt-6 border-t border-primary-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg
                  className="w-4 h-4 text-secondary-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Your credentials are securely encrypted and protected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
