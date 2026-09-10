import React, { useState } from 'react';
import PulsingBackground from '../components/PulsingBackground';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', contact: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);

    try {
      const response = await fetch("https://project.interndesire.com/api/contact_form.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (data.success) {
        setStatus("Thank you for contacting us! A confirmation email has been sent.");
        setForm({ name: '', contact: '', email: '', message: '' });
      } else {
        setStatus(`Submission failed: ${data.message || 'Please try again later.'}`);
      }
    } catch {
      setStatus("An unexpected error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScrollToForm = () => {
    const formElement = document.getElementById('contact-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Background Orbs Animation */}
      <PulsingBackground />

      {/* Main Content Wrapper */}
      <div className="relative z-10 min-h-screen bg-transparent text-gray-200 p-4 md:p-8 pt-24 md:pt-32 font-sans pb-20">
        <div className="container mx-auto max-w-6xl">
          
          {/* Top Hero Banner */}
          <div className="w-full max-w-5xl text-center mx-auto mb-16 md:my-16 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-gray-700/50 shadow-lg">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              We're Here to Help
            </h1>
            <p className="text-base md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your satisfaction is our priority at Elexoplus. Whether you're looking for product information, need technical assistance, or have feedback to share, we value your input. Please don't hesitate to connect with us – we're just a message or call away!
            </p>
            <button
              type="button"
              onClick={handleScrollToForm}
              className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Section Header */}
          <div className="border-b-2 border-white/40 mb-8 w-max">
            <h2 className="text-3xl font-bold text-white mb-2 pr-7 md:pr-10">
              Find Us
            </h2>
          </div>

          {/* Grid Layout: Map & Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            
            {/* Column 1: Map */}
            <div className="w-full h-full order-2 md:order-1">
              <div className="relative w-full h-[450px] md:h-[550px] rounded-2xl shadow-xl overflow-hidden border border-yellow-400/30">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56193.0863335528!2d76.8152197486328!3d28.204364100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d30a501abb637%3A0x133d03d86dcfc79!2sBhiwadi%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1671234567890!5m2!1sen!2sin"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map of Bhiwadi, Rajasthan"
                ></iframe>
              </div>
            </div>

            {/* Column 2: Form */}
            <div id="contact-form-section" className="p-0 order-1 md:order-2">
              <h2 className="text-3xl font-light text-gray-100 mb-8 text-center md:text-left">
                We're Just a Message Away
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    id="contact"
                    required
                    placeholder="Contact"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  />
                </div>

                <div>
                  <textarea
                    id="message"
                    rows="5"
                    required
                    placeholder="Message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-yellow-400 text-gray-900 font-bold text-lg px-8 py-3.5 rounded-lg hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-yellow-400/50 cursor-pointer ${
                      loading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>

              {status && (
                <p className="mt-4 text-center md:text-left text-yellow-300 font-semibold text-sm">
                  {status}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}