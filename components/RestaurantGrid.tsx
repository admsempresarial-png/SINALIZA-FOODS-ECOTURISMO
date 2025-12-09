import React from 'react';
import { MapPin, Utensils, Calendar, Lock, ExternalLink } from 'lucide-react';
import { Restaurant } from '../types';
import { useLead } from './LeadContext';

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Restaurante Avenida",
    description: "O melhor churrasco gaúcho da cidade.",
    rating: 4.8,
    image: "https://picsum.photos/id/225/600/400",
    tags: ["Churrascaria", "Carnes"]
  },
  {
    id: 2,
    name: "Sabor Caiçara",
    description: "Frutos do mar frescos à beira-mar.",
    rating: 4.7,
    image: "https://picsum.photos/id/493/600/400",
    tags: ["Frutos do Mar", "Praia"]
  },
  {
    id: 3,
    name: "Bistrô da Serra",
    description: "Cozinha contemporânea com vista.",
    rating: 4.9,
    image: "https://picsum.photos/id/1060/600/400",
    tags: ["Bistrô", "Romântico"]
  },
  {
    id: 4,
    name: "Pizzaria Napoli",
    description: "A autêntica pizza italiana.",
    rating: 4.6,
    image: "https://picsum.photos/id/835/600/400",
    tags: ["Pizza", "Jantar"]
  }
];

const RestaurantGrid: React.FC = () => {
  const { handleAction, isRegistered } = useLead();
  const siteUrl = "#vip";

  return (
    <section id="restaurantes" className="py-20 bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
              Explore <span className="text-red-500">Sabores</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              De quiosques à beira-mar a restaurantes sofisticados. Encontre o lugar perfeito para sua próxima refeição.
            </p>
          </div>
          <button 
            onClick={() => handleAction(siteUrl)}
            className="hidden md:flex items-center gap-2 text-red-400 font-bold hover:text-red-300 transition-colors border-b-2 border-red-400 pb-1"
          >
            Ver todos os restaurantes <ExternalLink size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((place) => (
            <div key={place.id} className="bg-[#1a1a1a] rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300 border border-neutral-800">
              <div className="relative h-48 overflow-hidden bg-gray-900">
                {/* Image - Blurs if NOT registered */}
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className={`w-full h-full object-cover transition-all duration-500 ${isRegistered ? 'opacity-100 blur-0' : 'opacity-40 blur-[8px] transform scale-110'}`}
                />
                
                {/* Lock Overlay - Only if NOT registered */}
                {!isRegistered && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 p-4 text-center z-10">
                        <div className="bg-red-600/90 p-2 rounded-full mb-2 shadow-lg">
                            <Lock className="text-white w-5 h-5" />
                        </div>
                        <span className="text-white text-[10px] font-bold uppercase tracking-wider text-shadow-sm bg-black/60 px-2 py-1 rounded">
                            Disponível no Site Oficial
                        </span>
                    </div>
                )}

                <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded flex items-center gap-1 text-yellow-400 text-xs font-bold backdrop-blur-sm z-20">
                  ★ {place.rating}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">{place.name}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{place.description}</p>
                
                <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
                   <div className="flex gap-3 text-gray-500">
                      <MapPin size={18} className="hover:text-red-500 transition-colors cursor-pointer" />
                      <Utensils size={18} className="hover:text-red-500 transition-colors cursor-pointer" />
                      <Calendar size={18} className="hover:text-red-500 transition-colors cursor-pointer" />
                   </div>
                   <button 
                     onClick={() => handleAction(siteUrl)}
                     className="text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded hover:bg-red-700 transition-colors"
                   >
                     Seja Membro
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <button 
            onClick={() => handleAction(siteUrl)}
            className="text-red-400 font-bold hover:text-red-300 border-b-2 border-red-400 pb-1 inline-flex items-center gap-2"
          >
            Ver todos os restaurantes <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RestaurantGrid;