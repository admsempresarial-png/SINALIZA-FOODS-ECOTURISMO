import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { useLead } from './LeadContext';

const Hero: React.FC = () => {
  const { handleAction, siteConfig } = useLead();
  const siteUrl = "#vip";

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={siteConfig.hero.backgroundImage} 
          alt="Background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>
      </div>

      {/* Decorative Elements (Blobs) */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-red-600 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-green-600 rounded-full blur-[80px] opacity-30 animate-pulse delay-700"></div>

      <div className="relative z-10 container mx-auto px-4 text-center max-w-4xl">
        <div className="inline-block mb-4 px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 backdrop-blur-sm">
          <span className="text-red-400 font-bold text-xs sm:text-sm tracking-widest uppercase">
            Turismo • Gastronomia • Lazer
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-tight mb-6 text-glow">
          {siteConfig.hero.titlePrefix} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">{siteConfig.hero.titleSuffix}</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 font-light mb-2 max-w-2xl mx-auto">
          {siteConfig.hero.subtitle}
        </p>
        
        <p className="text-base md:text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
          {siteConfig.hero.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => handleAction(siteUrl)}
            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-lg shadow-xl shadow-red-900/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            QUERO ACESSAR AGORA
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => handleAction(siteUrl)}
            className="w-full sm:w-auto px-8 py-4 bg-black/40 backdrop-blur-md border-2 border-white/20 hover:border-white text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 hover:bg-white/10"
          >
            <Globe className="w-5 h-5" />
            SEJA MEMBRO
          </button>
        </div>

        {/* Floating Icons/Badges decoration */}
        <div className="hidden md:block absolute top-1/2 -left-12 -rotate-12 bg-neutral-800/80 p-4 rounded-xl border border-neutral-700 backdrop-blur-md shadow-2xl">
            <div className="text-3xl">🍅</div>
        </div>
        <div className="hidden md:block absolute top-2/3 -right-12 rotate-12 bg-neutral-800/80 p-4 rounded-xl border border-neutral-700 backdrop-blur-md shadow-2xl">
            <div className="text-3xl">🌿</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;