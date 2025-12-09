
import React from 'react';
import { Truck, Tag, Users, Percent, Gift, ArrowRight } from 'lucide-react';
import { useLead } from './LeadContext';

const Discounts: React.FC = () => {
  const { siteConfig, handleAction } = useLead();
  const siteUrl = "#vip";

  const benefits = [
    { 
        icon: Truck, 
        title: "Entrega GRÁTIS", 
        desc: "Acima de R$ 50,00",
    },
    { 
        icon: Tag, 
        title: "Pratos Selecionados", 
        desc: "Até 70% OFF",
    },
    { 
        icon: Users, 
        title: "Pague 1, Leve 2", 
        desc: "Terças e Quartas",
    },
    { 
        icon: Percent, 
        title: "10% OFF Total", 
        desc: "Primeiro pedido",
    },
    { 
        icon: Gift, 
        title: "Sobremesa Grátis", 
        desc: "Aniversariantes",
    },
  ];

  return (
    <section id="descontos" className="py-16 bg-gradient-to-b from-[#121212] to-black relative">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
          {siteConfig.sectionTitles.discounts}
        </h2>
        <p className="text-gray-400">Economize enquanto aproveita o melhor da região.</p>
      </div>

      {/* Horizontal Scroll Container - Significantly increased padding (py-20) to prevent ANY clipping of hover effects */}
      <div className="w-full overflow-x-auto py-20 hide-scrollbar">
        <div className="flex space-x-6 px-4 md:px-12 w-max mx-auto items-stretch">
          {benefits.map((item, index) => (
            <div 
              key={index}
              onClick={() => handleAction(siteUrl)}
              className="w-72 bg-[#1a1a1a] p-6 rounded-xl border border-neutral-800 cursor-pointer flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-500 group relative z-10"
            >
              <div className="bg-neutral-800 p-4 rounded-full mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-500 shadow-inner">
                <item.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300">{item.desc}</p>
              
              <div className="mt-4 text-xs text-purple-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <ArrowRight size={12} /> Ver Parceiros
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-2 px-4 relative z-0">
        <p className="text-xs text-gray-500 max-w-lg mx-auto italic">
          * Verifique sempre com o estabelecimento se o desconto ainda está válido antes de realizar o pedido ou reserva.
        </p>
      </div>

    </section>
  );
};

export default Discounts;
