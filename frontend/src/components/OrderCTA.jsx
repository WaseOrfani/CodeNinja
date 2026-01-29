import React from 'react';
import { Button } from './ui/button';

const OrderCTA = () => {
  return (
    <section className="bg-[#1B4B73] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Bereit zu essen?
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Sehen Sie sich unsere Speisekarte an und bestellen Sie online. Wir bereiten Ihr Essen für Sie vor.
        </p>
        <Button 
          className="bg-transparent border-2 border-[#E8A54B] text-[#E8A54B] hover:bg-[#E8A54B] hover:text-[#1B4B73] px-8 py-6 text-lg font-medium transition-all duration-300"
        >
          Jetzt online bestellen
        </Button>
      </div>
    </section>
  );
};

export default OrderCTA;
