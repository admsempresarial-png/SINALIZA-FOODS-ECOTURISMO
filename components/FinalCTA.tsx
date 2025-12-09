
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLead } from './LeadContext';

const FinalCTA: React.FC = () => {
  const { handleAction, siteConfig } = useLead();
  const siteUrl = "#vip";
  const whatsappLink = "https://wa.me/5515996610494?text=Ol%C3%A1!%20Gostaria%20de%20receber%20acesso%20ao%20Sinaliza%20Foods.";

  return (
    <section className="py-24 relative overflow-hidden bg-red-900">
       {/* Background Image overlay */}
       <div className="absolute inset-0">
         <img src={siteConfig.finalCta.image} className="w-full h-full object-cover opacity-20 mix-blend-multiply" alt="Texture" />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
       </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
          Pronto para economizar nas suas viagens? <br/> Conhecer os melhores restaurantes?
        </h2>
        <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto">
          Receba agora o acesso ao Sinaliza Foods e comece a aproveitar restaurantes selecionados e aventuras com benefícios exclusivos.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
                onClick={() => handleAction(siteUrl)}
                className="px-10 py-5 bg-white text-red-900 rounded-full font-black text-lg hover:bg-gray-100 transition-all shadow-xl transform hover:-translate-y-1 inline-block"
            >
                QUERO MEU ACESSO AGORA
            </button>
            <button 
                onClick={() => handleAction(whatsappLink)}
                className="px-10 py-5 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 transition-all shadow-xl flex items-center justify-center gap-2 inline-flex"
            >
                <MessageCircle size={24} />
                RECEBER PELO WHATSAPP
            </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
