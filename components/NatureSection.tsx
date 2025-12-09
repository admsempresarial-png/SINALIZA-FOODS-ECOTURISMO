import React, { useState } from 'react';
import { Mountain, Waves, Droplets, Ruler, Map, Lock } from 'lucide-react';
import { useLead } from './LeadContext';

const NatureSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trilha' | 'cachoeira' | 'praia'>('trilha');
  const { handleAction, isRegistered, siteConfig } = useLead();
  const siteUrl = "#vip";

  // Logic to split the single array of spots into tabs
  // 0,1 -> Trilha
  // 2,3 -> Cachoeira
  // 4,5 -> Praia
  const currentSpots = 
    activeTab === 'trilha' ? siteConfig.natureSpots.slice(0, 2) :
    activeTab === 'cachoeira' ? siteConfig.natureSpots.slice(2, 4) :
    siteConfig.natureSpots.slice(4, 6);

  const handleNatureClick = () => {
      handleAction(
          siteUrl,
          "Acesso VIP ao Guia Turístico",
          "Você se tornará VIP assim que fizer o cadastro e liberará o guia completo com mapas, fotos e roteiros exclusivos."
      );
  };

  return (
    <section id="natureza" className="py-20 bg-black relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-900 to-transparent"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            {siteConfig.sectionTitles.nature}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore as belezas naturais da região. O Sinaliza Foods leva você para os melhores pontos turísticos, rios, lagos e praias.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12 flex-wrap gap-4">
          <button 
            onClick={() => setActiveTab('trilha')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'trilha' ? 'bg-green-600 text-white' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}`}
          >
            <Mountain size={20} /> Trilhas
          </button>
          <button 
            onClick={() => setActiveTab('cachoeira')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'cachoeira' ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}`}
          >
            <Droplets size={20} /> Cachoeiras, Rios e Lagos
          </button>
          <button 
            onClick={() => setActiveTab('praia')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'praia' ? 'bg-orange-500 text-white' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}`}
          >
            <Waves size={20} /> Praias
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {currentSpots.map((spot, index) => (
            <div key={index} className="relative group overflow-hidden rounded-2xl h-80 md:h-96 cursor-pointer bg-neutral-900 border border-neutral-800 shadow-2xl">
              
              {/* Image Layer - Condition for Blur */}
              <div className="absolute inset-0">
                  <img 
                    src={spot.image} 
                    alt={spot.name} 
                    className={`w-full h-full object-cover transition-all duration-500 ${isRegistered ? 'opacity-100 blur-0 scale-100' : 'opacity-50 blur-[8px] scale-110'}`}
                  />
                  <div className={`absolute inset-0 transition-opacity duration-500 ${isRegistered ? 'bg-transparent' : 'bg-black/60'}`}></div>
                  {/* Gradient for text readability when unlocked */}
                  {isRegistered && <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>}
              </div>

              {/* Blocked Content Overlay - Only show if NOT registered */}
               {!isRegistered && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center pb-20">
                      <div className="bg-white/10 p-4 rounded-full backdrop-blur-md mb-4 border border-white/20 shadow-xl">
                          <Lock className="text-white w-8 h-8" />
                      </div>
                      <p className="text-white font-bold text-xl mb-2 drop-shadow-lg">Conteúdo Exclusivo</p>
                      <p className="text-gray-200 text-xs max-w-xs bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                          Cadastre-se para acessar o guia completo de {activeTab === 'trilha' ? 'trilhas' : activeTab === 'praia' ? 'praias' : 'rios e cachoeiras'}.
                      </p>
                 </div>
               )}

              {/* Info Layer (Bottom) */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/95 to-transparent p-8 z-20">
                <h3 className={`font-bold text-white mb-2 leading-tight ${isRegistered ? 'text-xl line-clamp-2' : 'text-2xl'}`}>
                    {isRegistered ? spot.name : "Local Exclusivo VIP"}
                </h3>
                
                {isRegistered && spot.description && (
                   <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                       {spot.description}
                   </p>
                )}

                <div className="flex items-center gap-4 text-gray-300 text-sm mb-4">
                  <span className={`flex items-center gap-1 ${isRegistered ? '' : 'opacity-60'}`}>
                      <Ruler size={16} className={isRegistered ? "text-green-500" : "text-gray-500"} /> 
                      {isRegistered ? spot.distance : "Acesso Bloqueado"}
                  </span>
                  {spot.difficulty && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-white/10 border border-white/20 rounded text-white text-xs font-semibold backdrop-blur-sm">
                      {spot.difficulty}
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleNatureClick}
                  className={`w-full py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg transform hover:-translate-y-0.5 ${isRegistered ? 'bg-white text-black hover:bg-gray-200' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  <Map size={18} /> {isRegistered ? 'Acessar Rota no Google Maps' : 'Liberar Acesso Agora'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NatureSection;