import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    if (footerRef.current) {
      const items = footerRef.current.querySelectorAll('.footer-item');
      gsap.set(items, { y: 40, opacity: 0 });
      gsap.to(items, { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'power3.out' });
    }
  }, []);

  return (
    <footer className="bg-black p-10 text-white font-sans border-t border-white mt-auto">
      <div ref={footerRef} className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="footer-item">
          <img src="/assets/logo-BJqIBdaq.png" alt="Elexo Logo" className="w-44 mb-3" />
          <p className="text-gray-400 leading-relaxed">
            <strong>Address:</strong> 10-481, Bhagat Singh Marg, near RTO ROAD, Sector 9, RIICO INDUSTRIAL AREA, U.I.T, Bhiwadi, Rajasthan 301019
          </p>
        </div>
        <div className="footer-item justify-self-center self-center">
          <h3 className="font-bold text-lg mb-4 justify-self-center">Contact Information</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Mail: <a href="mailto:SALES@ELEXOPLUS.IN" className="hover:text-white">SALES@ELEXOPLUS.IN</a></li>
            <li>Contact: <a href="tel:01493-451354" className="hover:text-white">+91 9257061015</a></li>
            <li>CIN No.: U47594RJ2025PTC101772</li>
            <li>Udyam Registration No.: UDYAM-RJ-37-0005128</li>
          </ul>
        </div>
        <div className="footer-item justify-self-center">
          <h3 className="font-bold text-lg mb-4">Important Links</h3>
          <ul className="space-y-2 text-gray-400 justify-self-center">
            <li><a href="/store" className="hover:text-white">Products</a></li>
            <li><a href="/policy" className="hover:text-white">Policies</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="https://b2b.elexoplus.in" className="hover:text-white">B2B Portal</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-4 border-t border-gray-700 text-center text-gray-500 text-sm">
        <p>© 2025 ElexoPlus India Pvt Ltd — All Rights Reserved</p>
      </div>
    </footer>
  );
}
