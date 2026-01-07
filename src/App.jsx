import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import News from "./pages/News";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminNews from "./pages/admin/AdminNews";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import { AuthProvider } from "./context/AuthContext";
import Certificates from "./pages/certificates";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="products" element={<Products />} />
            <Route path="news" element={<News />} />
            <Route path="contact" element={<Contact />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="products/:slugId" element={<ProductDetail />} />
            <Route path="category/:slug" element={<Products />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="news" element={<AdminNews />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
