import React from 'react';
import { useNavigate } from 'react-router-dom';
import PulsingBackground from '../components/PulsingBackground';

// Custom SVG Icons
const InnovationIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-7.5 0m7.5 0a12.06 12.06 0 0 0-7.5 0m7.5 0c-.376 0-.744.007-1.112.021m-5.276 0c-.368-.014-.736-.021-1.112-.021m2.224 0a6.012 6.012 0 0 1-2.224 0m2.224 0c.002 0 .004 0 .005 0m-.005 0a6.012 6.012 0 0 0-2.224 0m2.224 0a6.012 6.012 0 0 0 2.224 0m0 0c-.002 0-.004 0-.005 0m.005 0c.368.014.736.021 1.112.021m-5.276 0c.368.014.736.021 1.112.021M12 6.75a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5ZM12 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
  </svg>
);

const IntegrityIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.954 11.954 0 0 1 12 2.714Z" />
  </svg>
);

const QualityIcon = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <>
      {/* Background Orbs Animation */}
      <PulsingBackground />

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen bg-transparent text-gray-200 p-4 md:p-8 pt-24 md:pt-32 font-sans">
        <div className="container mx-auto max-w-5xl space-y-20 md:space-y-24">

          {/* Hero Section */}
          <div className="text-center animate-fadeInSlideUp">
            <p className="fancy-underline text-lg md:text-xl text-gray-300 uppercase tracking-widest mb-6">
              ABOUT US
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-yellow mb-4 text-glow-yellow">
              Comfort Without Compromise
            </h1>
          </div>

          {/* Our Story Section */}
          <div className="backdrop-blur-md bg-opacity-70 p-8 md:p-12 rounded-2xl border border-gray-700/50 shadow-lg animate-fadeInSlideUp animate-delay-200">
            <h2 className="text-3xl font-bold text-white mb-6">Our Journey</h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                Our journey began in 1996 with the founding of Oswal Electric & Electronic, originally known as Nakoda Traders, by the late Shri Baleshwar Kumar Jain and Mr. Rohit Kumar Jain. From our humble beginnings as traders specializing in heating appliance spare parts, we swiftly garnered a reputation for reliability and excellence throughout Rajasthan.
              </p>

              {/* Highlighted ELEXO PLUS Callout Card */}
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-500/70 p-6 rounded-xl relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <p className="relative z-10 text-yellow-100 italic font-semibold text-xl md:text-2xl text-center mb-4">
                  A New Chapter Unfolds: ELEXO PLUS
                </p>
                <p className="relative z-10 text-yellow-50 text-base md:text-lg text-center">
                  In 2022, a new chapter unfolded as Mr. Somil Jain, inspired by our rich heritage and driven by innovation, unveiled <span className="text-yellow-400 font-bold">ELEXO PLUS</span>. This visionary brand symbolizes our unwavering commitment to surpassing customer expectations and pushing the boundaries of quality and service.
                </p>
              </div>

              <p>
                Our path has been one of perseverance and transformation, navigating challenges with a spirit of creativity and resilience. At Nakoda Traders, we continue to redefine industry standards, fueled by our passion for innovation and steadfast dedication to delivering exceptional products and experiences.
              </p>
            </div>
          </div>

          {/* Mission & Vision Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeInSlideUp animate-delay-400">
            {/* Our Mission Card */}
            <div className="backdrop-blur-md bg-opacity-70 p-8 rounded-2xl border border-yellow-400/30 shadow-lg">
              <h2 className="text-3xl font-bold text-yellow mb-4">OUR MISSION</h2>
              <ul className="space-y-4 text-gray-300 text-lg list-disc list-inside">
                <li>
                  We will strive to become leading manufacturers of Home Appliances products by Consistently raising the standards in product utility, innovation and durability.
                </li>
                <li>
                  Promote a culture of excellence, transparency and ethics within the company and in our dealing with our associates.
                </li>
                <li>
                  Contribute positively towards uplifting society.
                </li>
              </ul>
            </div>

            {/* Our Vision Card */}
            <div className="backdrop-blur-md bg-opacity-70 p-8 rounded-2xl border border-gray-700 shadow-lg">
              <h2 className="text-3xl font-bold text-yellow mb-4">OUR VISION</h2>
              <ul className="space-y-4 text-gray-300 text-lg list-disc list-inside">
                <li>
                  To provide consumer new innovation, technology, best product quality, service at affordable price.
                </li>
                <li>
                  To create a company that serves everything according their needs.
                </li>
              </ul>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="animate-fadeInSlideUp animate-delay-600">
            <h2 className="text-4xl font-bold text-center text-white mb-16">
              Our Core <span className="text-yellow-400">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Value 1: Innovation */}
              <div className="text-center p-6 flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-800 border-2 border-yellow-400/50 rounded-full mb-5 shadow-lg transform transition-transform duration-300 hover:scale-110">
                  <InnovationIcon className="w-10 h-10 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Innovation</h3>
                <p className="text-gray-400">Constantly pushing boundaries and challenging the status quo.</p>
              </div>

              {/* Value 2: Integrity */}
              <div className="text-center p-6 flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-800 border-2 border-yellow-400/50 rounded-full mb-5 shadow-lg transform transition-transform duration-300 hover:scale-110">
                  <IntegrityIcon className="w-10 h-10 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Integrity</h3>
                <p className="text-gray-400">Doing the right thing, always. Our business is built on trust.</p>
              </div>

              {/* Value 3: Quality */}
              <div className="text-center p-6 flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 bg-gray-800 border-2 border-yellow-400/50 rounded-full mb-5 shadow-lg transform transition-transform duration-300 hover:scale-110">
                  <QualityIcon className="w-10 h-10 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Quality</h3>
                <p className="text-gray-400">Unwavering commitment to exceptional products and service.</p>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="backdrop-blur-md bg-opacity-70 text-center p-10 md:p-16 rounded-2xl border border-yellow-400/30 shadow-lg animate-fadeInSlideUp animate-delay-800">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to build the future together?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              We're always looking for passionate partners and brilliant minds. Let's connect.
            </p>
            <button 
              type="button"
              onClick={() => navigate('/contact')}
              className="bg-yellow-400 text-gray-900 font-bold text-lg px-10 py-3 rounded-lg hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-yellow-400/50 transform hover:scale-105 cursor-pointer"
            >
              Get In Touch
            </button>
          </div>

        </div>
      </div>
    </>
  );
}