
import React from 'react';
import { 
  Wallet, 
  Compass, 
  CheckCircle2, 
  Zap, 
  UserPlus, 
  Map, 
  QrCode, 
  ArrowRight 
} from 'lucide-react';
import { useLead } from './LeadContext';

const HowItWorks: React.FC = () => {
  const { siteConfig, handleAction } = useLead();
  const siteUrl = "#vip";

  const steps = [
    {
      id: "01",
      icon: UserPlus,
      title: "Ative seu Acesso",
      desc: "Realize seu cadastro simplificado e assine o plano mensal. A liberação é imediata e automática."
    },
    {
      id: "02",
      icon: Map,
      title: "Escolha o Local",
      desc: "Navegue pelo guia VIP, veja as trilhas secretas ou escolha um restaurante com oferta ativa."
    },
    {
      id: "03",
      icon: QrCode,
      title: "Use e Economize",
      desc: "No estabelecimento, clique em 'Gerar Desconto', apresente o código e aproveite sua vantagem na hora."
    }
  ];

  const benefits = [
    {
      icon: Wallet,
      title: "Retorno Imediato",
      highlight: "Economia Real",
      desc: "O valor da assinatura é simbólico perto da economia que você faz. Com apenas UM jantar usando 'Pague 1 Leve 2', você já recupera o valor investido no mês inteiro.",
      color: "from-green-500 to-emerald-700",
      shadowColor: "group-hover:shadow-green-900/40",
      borderColor: "group-hover:border-green-500/30"
    },
    {
      icon: Compass,
      title: "Rotas Exclusivas",
      highlight: "Turismo Inteligente",
      desc: "Explore com total autonomia. Tenha em mãos um guia interativo com rotas detalhadas para cachoeiras e praias secretas que não aparecem nos roteiros tradicionais.",
      color: "from-blue-500 to-indigo-700",
      shadowColor: "group-hover:shadow-blue-900/40",
      borderColor: "group-hover:border-blue-500/30"
    },
    {
      icon: UserPlus,
      title: "Guia Presencial",
      highlight: "Vem até Você",
      desc: "Quer facilidade? Contrate um guia turístico presencial rápido e fácil. Basta clicar no botão e um profissional credenciado vai até sua localização em qualquer ponto da cidade.",
      color: "from-purple-500 to-pink-700",
      shadowColor: "group-hover:shadow-purple-900/40",
      borderColor: "group-hover:border-purple-500/30"
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-neutral-900/80 border border-neutral-700 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md">
            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">Simples, Rápido e Inteligente</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">
            {siteConfig.sectionTitles.howItWorks}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Entenda como transformamos sua experiência na cidade em 3 passos simples. 
            Menos burocracia, mais diversão.
          </p>
        </div>

        {/* STEP BY STEP FLOW */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-neutral-800 via-red-900/50 to-neutral-800 z-0"></div>

            {steps.map((step, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                    <div className="w-24 h-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6 shadow-xl group-hover:border-red-500/50 group-hover:scale-105 transition-all duration-300 relative">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-[#0a0a0a]">
                            {step.id}
                        </div>
                        <step.icon size={32} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                        {step.desc}
                    </p>
                    
                    {/* Arrow for mobile only */}
                    {index < steps.length - 1 && (
                        <div className="md:hidden mt-8 text-neutral-700">
                            <ArrowRight className="rotate-90" />
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* DETAILED BENEFITS CARDS - PROFESSIONAL REDESIGN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 max-w-7xl mx-auto">
          {benefits.map((item, index) => (
            <div key={index} className="group relative h-full">
              {/* Subtle Back Glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-b ${item.color} rounded-[2rem] opacity-0 group-hover:opacity-20 blur-xl transition duration-500`}></div>
              
              <div className={`relative h-full bg-[#121212] border border-neutral-800 ${item.borderColor} rounded-[1.5rem] p-8 flex flex-col transition-all duration-300 overflow-hidden`}>
                
                {/* Top Section */}
                <div className="flex justify-between items-start mb-8">
                    {/* Icon Container */}
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
                        <item.icon size={26} className="text-white relative z-10" />
                    </div>

                    {/* Badge Pill */}
                    <div className="px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                        <span className={`text-[10px] font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${item.color}`}>
                            {item.highlight}
                        </span>
                    </div>
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform duration-300">
                    {item.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed text-sm flex-1 font-medium">
                  {item.desc}
                </p>

                {/* Bottom Active Line */}
                <div className={`w-12 h-1 mt-8 rounded-full bg-gradient-to-r ${item.color} opacity-30 group-hover:opacity-100 group-hover:w-full transition-all duration-700 ease-out`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* PREMIUM CTA BLOCK */}
        <div className="relative max-w-5xl mx-auto">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-[2.5rem] blur opacity-20"></div>
            
            <div className="relative bg-[#121212] border border-neutral-800 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Assinatura <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Sinaliza VIP</span>
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Tenha o guia completo no seu bolso. Cancele quando quiser, sem fidelidade.
                        </p>
                        
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
                                <CheckCircle2 size={14} className="text-green-500" /> Acesso Imediato
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700">
                                <CheckCircle2 size={14} className="text-green-500" /> Compra Segura
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="text-center">
                            <span className="text-gray-500 text-sm line-through">De R$ 189,90</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm text-gray-300 font-bold">Por</span>
                                <span className="text-5xl font-black text-white tracking-tighter">R$ 21,99</span>
                                <span className="text-gray-400 text-sm">/mês</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleAction(siteUrl, "Garanta seu Acesso VIP", "Aproveite o preço promocional de R$ 21,99 mensais.")}
                            className="w-full md:w-auto whitespace-nowrap bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-red-900/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            QUERO SER VIP
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
