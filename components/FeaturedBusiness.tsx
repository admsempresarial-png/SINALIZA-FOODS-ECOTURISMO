import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useLead } from './LeadContext';

const FeaturedBusiness: React.FC = () => {
  const { handleAction, siteConfig } = useLead();
  const siteUrl = "#vip";

  return (
    <section className="py-20 bg-[#121212] relative overflow-hidden">
        {/* Background texture pattern could go here */}
        
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12 bg-neutral-900/50 rounded-3xl p-6 lg:p-12 border border-neutral-800 relative">
                
                {/* Badge */}
                <div className="absolute top-0 right-0 lg:right-12 -mt-6 bg-yellow-500 text-black font-black uppercase text-xs md:text-sm px-6 py-2 rounded-full shadow-lg tracking-wider transform rotate-2">
                    {siteConfig.featured.badgeText}
                </div>

                {/* Image Side */}
                <div className="w-full lg:w-1/2 relative group">
                    <div className="absolute inset-0 bg-red-600 rounded-2xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
                    <img 
                        src={siteConfig.featured.image} 
                        alt="Prato do Restaurante Destaque" 
                        className="relative w-full h-[400px] object-cover rounded-2xl shadow-2xl z-10"
                    />
                    <div className="absolute bottom-4 right-4 z-20 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="fill-current w-5 h-5" />
                            <span className="font-bold text-white text-lg">4.9</span>
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-1/2 space-y-6">
                    <div>
                        <h2 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-2">
                            Experiência Gastronômica
                        </h2>
                        <h3 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
                            {siteConfig.sectionTitles.featured}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 mb-6">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span>Centro Histórico, Rua das Pedras, 120</span>
                        </div>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-lg">
                        {siteConfig.featured.description}
                    </p>

                    {/* Promo Highlight */}
                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-4">
                        <div className="bg-red-600 text-white font-black text-2xl px-4 py-2 rounded-lg shadow-lg rotate-[-2deg]">
                            PROMO
                        </div>
                        <div>
                            <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Oferta Especial</p>
                            <p className="text-white font-bold text-xl">{siteConfig.featured.promoLabel}</p>
                        </div>
                    </div>

                    <ul className="space-y-2 mt-4">
                        {['Blends de Carnes Nobres', 'Maionese Caseira', 'Ambiente Descontraído'].map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4">
                        <button 
                            onClick={() => handleAction(siteUrl)}
                            className="inline-block bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-colors"
                        >
                            SEJA MEMBRO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default FeaturedBusiness;