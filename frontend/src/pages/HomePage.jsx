import React from 'react';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import OrderCTA from '../components/OrderCTA';
import MenuCategories from '../components/MenuCategories';
import BlogSection from '../components/BlogSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSlider />
        <OrderCTA />
        <MenuCategories />
        <BlogSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
