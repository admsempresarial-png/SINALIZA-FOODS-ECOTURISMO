import React from 'react';
import { CheckCircle, Map, Utensils, X } from 'lucide-react';
import { useLead } from './LeadContext';

const PostRegistrationModal: React.FC = () => {
  const { showWelcomeModal, closeWelcomeModal } = useLead();

  if (!showWelcomeModal) return null;

  const handleNavigation = (sectionId: string) => {
    closeWelcomeModal();
    const element = document.getElementById(sectionId);
    if (element) {
      setTimeout(() => {
        const headerOffset = 90;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
      }, 100);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>

      {/* Content */}
      <div className="relative bg-[#1a1a1a] w-full max-w-lg rounded-2xl border border-green-500/30 shadow-2xl overflow-hidden flex flex-col transform transition-all animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-green-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
                <CheckCircle className="text-green-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Acesso Liberado!</h2>
            <p className="text-green-100 text-sm">Bem-vindo(a) ao Clube Sinaliza Foods</p>
        </div>

        {/* Body */}
        <div className="p-8 text-center space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                    "Algumas empresas optaram por não fornecer dados do Instagram e descontos no momento, mas acompanhe sempre o site, pois toda semana temos novos descontos disponíveis."
                </p>
            </div>

            <p className="text-white font-semibold text-lg">
                Enquanto isso, o que deseja fazer?
            </p>

            <div className="grid grid-cols-1 gap-4">
                <button 
                    onClick={() => handleNavigation('natureza')}
                    className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg"
                >
                    <Map size={20} />
                    Conhecer Área de Turismo
                </button>

                <button 
                    onClick={() => handleNavigation('vip')}
                    className="flex items-center justify-center gap-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 rounded-xl transition-all border border-neutral-600"
                >
                    <Utensils size={20} />
                    Continuar nos Restaurantes
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PostRegistrationModal;