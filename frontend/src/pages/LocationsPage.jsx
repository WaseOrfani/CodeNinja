import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { locations } from '../data/mock';
import { MapPin, Phone, Clock, ShoppingCart, Utensils } from 'lucide-react';

const LocationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-32">
        {/* Hero */}
        <div className="bg-[#1B4B73] py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Standorte</h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Finden Sie ein Oria Grill Restaurant in Ihrer Nähe. Bestellen Sie online oder besuchen Sie uns persönlich.
            </p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-gray-200 h-96 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Interaktive Karte</p>
            <p className="text-sm">Wählen Sie einen Standort aus der Liste unten</p>
          </div>
        </div>

        {/* Locations Grid */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((location) => (
              <div key={location.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-[#1B4B73] mb-4">{location.name}</h3>
                
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-[#E8A54B] mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{location.address}</p>
                      <p>{location.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-[#E8A54B] mr-3 flex-shrink-0" />
                    <a href={`tel:${location.phone}`} className="hover:text-[#E8A54B] transition-colors">
                      {location.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-[#E8A54B] mr-3 flex-shrink-0" />
                    <span>{location.hours}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={location.orderLink}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1B4B73] text-white py-2 px-4 rounded hover:bg-[#163d5e] transition-colors text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Bestellen
                  </a>
                  <a
                    href={location.cateringLink}
                    className="flex-1 flex items-center justify-center gap-2 border border-[#1B4B73] text-[#1B4B73] py-2 px-4 rounded hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Utensils className="w-4 h-4" />
                    Catering
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LocationsPage;
