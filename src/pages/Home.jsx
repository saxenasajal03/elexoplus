import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import Elevate from '../components/Home/Elevate';
import ProductCarousel from '../components/Home/ProductCarousel';
import CatalogSection from '../components/Home/CatalogSection';
import NewsletterSubscription from '../components/Home/NewsletterSubscription';

export default function Home() {
  return (
    <div className="bg-black">
      <HeroSection />
      <div className="md:px-20">
        

<ProductCarousel title="New Arrivals" />
        <Elevate />
        

<ProductCarousel title="Trending Now" />
        

<ProductCarousel title="Best Sellers" />
        <CatalogSection />
        <NewsletterSubscription />
      </div>
    </div>
  );
}
