import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import RouteLoader from './components/common/RouteLoader';

import Home from './pages/Home';
import Store from './pages/Store';
import SingleProductPage from './pages/SingleProductPage';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import WarrantyRegistration from './pages/WarrantyRegistration';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Policy from './pages/Policy';

// --- New CMS-ready pages (Master Developer Requirements #10-25) ---
import CompanyLegacy from './pages/CompanyLegacy';
import Leadership from './pages/Leadership';
import Gallery from './pages/Gallery';
import MediaResources from './pages/MediaResources';
import BranchOffices from './pages/BranchOffices';
import Careers from './pages/Careers';
import Investors from './pages/Investors';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Events from './pages/Events';
import TrackOrder from './pages/TrackOrder';
import ProductAuthentication from './pages/ProductAuthentication';
import ComplaintRegistration from './pages/ComplaintRegistration';
import ServiceCenters from './pages/ServiceCenters';
import BulkEnquiry from './pages/BulkEnquiry';
import OEMEnquiry from './pages/OEMEnquiry';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router basename="/elexoplus">
          <ScrollToTop />
          <RouteLoader />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id/:slug" element={<SingleProductPage />} />
            <Route path="/product/:id" element={<SingleProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/warranty-registration" element={<WarrantyRegistration />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/b2b-login" element={<Navigate to="/contact" replace />} />
            <Route path="/vendor-portal" element={<Navigate to="/contact" replace />} />
            <Route path="/policy/:policyType" element={<Policy />} />
            <Route path="/policy" element={<Policy />} />

            {/* Company */}
            <Route path="/company-legacy" element={<CompanyLegacy />} />
            <Route path="/leadership" element={<Leadership />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/media" element={<MediaResources />} />
            <Route path="/branches" element={<BranchOffices />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/investors" element={<Investors />} />

            {/* Insights */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/events" element={<Events />} />

            {/* Support */}
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/product-authentication" element={<ProductAuthentication />} />
            <Route path="/complaint-registration" element={<ComplaintRegistration />} />
            <Route path="/service-centers" element={<ServiceCenters />} />

            {/* Enquiries */}
            <Route path="/bulk-enquiry" element={<BulkEnquiry />} />
            <Route path="/oem-enquiry" element={<OEMEnquiry />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
