import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';

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

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router basename="/elexoplus">
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
            <Route path="/track-order" element={<Navigate to="/orders" replace />} />
            <Route path="/policy/:policyType" element={<Policy />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
