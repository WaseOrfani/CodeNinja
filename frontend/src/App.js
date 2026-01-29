import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import LocationsPage from './pages/LocationsPage';
import StoryPage from './pages/StoryPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import GiftCardsPage from './pages/GiftCardsPage';
import OffersPage from './pages/OffersPage';
import PressPage from './pages/PressPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/locations" element={<LocationsPage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/ingredients" element={<StoryPage />} />
          <Route path="/vision" element={<StoryPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/giftcards" element={<GiftCardsPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/shop" element={<GiftCardsPage />} />
          <Route path="/catering" element={<ContactPage />} />
          <Route path="/order" element={<LocationsPage />} />
          <Route path="/careers" element={<ContactPage />} />
          <Route path="/franchise" element={<ContactPage />} />
          <Route path="/*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
