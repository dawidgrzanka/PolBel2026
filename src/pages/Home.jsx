import React from 'react';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import Equipment from '@/components/home/Equipment';
import Contact from '@/components/home/Contact';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags - handled by document head in production */}
      <Header />
      
      <main id="main-content">
        <Hero />
        <Services />
        <Equipment />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}