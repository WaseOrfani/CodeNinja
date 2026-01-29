import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { storyContent } from '../data/mock';

const StoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{storyContent.title}</h1>
          </div>
        </div>

        {/* Main image */}
        <div className="max-w-4xl mx-auto px-4 -mt-8">
          <img
            src={storyContent.image}
            alt="Oria Grill Restaurant"
            className="w-full h-96 object-cover rounded-lg shadow-xl"
          />
        </div>

        {/* Story content */}
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="prose prose-lg max-w-none">
            {storyContent.paragraphs.map((paragraph, index) => (
              <p key={index} className={`text-gray-700 leading-relaxed mb-6 ${index === 0 ? 'text-xl font-medium text-[#1B4B73]' : ''}`}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 p-6 bg-[#1B4B73] rounded-lg text-center">
            <p className="text-white text-lg mb-4">
              Wenn Sie unser Essen noch nicht probiert haben, bestellen Sie online oder besuchen Sie uns in einem unserer Restaurants.
            </p>
            <a
              href="/locations"
              className="inline-block px-8 py-3 border-2 border-[#E8A54B] text-[#E8A54B] font-medium rounded hover:bg-[#E8A54B] hover:text-white transition-colors"
            >
              Standorte finden
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StoryPage;
