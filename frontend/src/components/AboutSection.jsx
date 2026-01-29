import React from 'react';
import { Link } from 'react-router-dom';
import { aboutSections } from '../data/mock';

const AboutSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1B4B73] text-center mb-12">
          Erfahren Sie mehr über die Inspiration hinter unserer Küche und unseren Restaurants
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutSections.map((section) => (
            <div key={section.id} className="group">
              <Link to={section.link} className="block">
                <h3 className="text-xl font-bold text-[#1B4B73] mb-4 group-hover:text-[#E8A54B] transition-colors">
                  {section.title}
                </h3>
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#1B4B73]/0 group-hover:bg-[#1B4B73]/10 transition-colors duration-300" />
                </div>
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
