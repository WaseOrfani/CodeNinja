import React from 'react';
import { Link } from 'react-router-dom';
import { menuCategories } from '../data/mock';

const MenuCategories = () => {
  return (
    <section className="bg-[#2C3E50] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {menuCategories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group flex flex-col items-center"
            >
              {/* Circular image container */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#E8A54B]/0 group-hover:bg-[#E8A54B]/20 transition-colors duration-300" />
              </div>
              {/* Category name */}
              <span className="text-[#E8A54B] text-sm md:text-base font-medium text-center group-hover:text-white transition-colors duration-300">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuCategories;
