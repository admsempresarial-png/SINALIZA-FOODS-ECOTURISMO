
import React from 'react';
import { MapPin, Instagram, Lock, Crown, Tag, Zap, History } from 'lucide-react';
import { useLead } from './LeadContext';
import { Company } from '../types';

const VipAccess: React.FC = () => {
  const { 
      handleAction, 
      isRegistered, 
      companies, 
      getTodayUsageCount,
      openCouponModal,
      siteConfig
  } = useLead();
  const siteUrl = "#vip";

  const handleVipClick = () => {
    if (!isRegistered) {
        handleAction(
            siteUrl, 
            "Torne-se VIP Agora!", 
            "Realize o cadastro e assinatura mensal de R$ 21,99 para liberar a visualização dos preços, endereços e trilhas da região."
        );
    }
  };

  const handleRestrictedAccess = (partner: Company) => {
      // Check if this company has an authorized discount (Highlight + Coupon)
      if (partner.isHighlight && partner.couponCode) {
          // Open the Coupon Validation Modal
          openCouponModal(partner);
      } else {
          // Standard locked message
          alert("A empresa não optou por fornecer dados do instagram e descontos no momento, mas sempre acompanhar o site, pois toda semana tem novos descontos disponíveis.");
      }
  };

  const handleInstagramClick = (partner: Company) => {
    if (!isRegistered) return handleVipClick();

    if (partner.instagram) {
        window.open(partner.instagram, '_blank');
    } else {
        handleRestrictedAccess(partner);
    }
  };

  return (
    <section id="vip" className="py-16 bg-[#0a0a0a] border-y border-neutral-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-10 justify-center text-center md:text-left">
            <div className="bg-neutral-800 p-3 rounded-full border border-neutral-700">
                <Crown className="text-gray-400 w-8 h-8" />
            </div>
            <div>
                <h2 className="text-3xl font-heading font-bold text-white leading-none">
                {siteConfig.sectionTitles.vip}
                </h2>
                <p className="text-gray-400 text-sm mt-1">Ofertas secretas e exclusivas para membros.</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {companies.map(partner => {
                const usageCount = getTodayUsageCount(partner.id);
                const hasInstagram = !!partner.instagram;
                
                return (
                    <div 
                        key={partner.id} 
                        className={`bg-[#121212] border rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 shadow-lg group relative ${
                            partner.isHighlight 
                            ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]' 
                            : 'border-neutral-800 hover:border-red-900/40'
                        }`}
                    >
                        {/* Glowing effect for highlights */}
                        {partner.isHighlight && (
                            <div className="absolute -top-3 -right-3 z-10 animate-bounce">
                                <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-purple-400 flex items-center gap-1">
                                    <Zap size={10} fill="currentColor" /> OFERTA ATIVA
                                </span>
                            </div>
                        )}

                        {/* Header: Name & Address */}
                        <div className="mb-4">
                            <h3 className="font-bold text-white text-lg truncate" title={partner.name}>{partner.name}</h3>
                            
                            {/* Address Logic: Blocked if not registered */}
                            {isRegistered ? (
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.name + " " + partner.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-1.5 text-xs text-gray-400 hover:text-green-400 mt-2 transition-colors group/map"
                                >
                                    <MapPin size={14} className="mt-0.5 shrink-0 text-gray-500 group-hover/map:text-green-400" />
                                    <span className="truncate">{partner.address}</span>
                                </a>
                            ) : (
                                <div 
                                    onClick={handleVipClick}
                                    className="flex items-center gap-2 mt-2 cursor-pointer group/address"
                                >
                                    <MapPin size={14} className="shrink-0 text-gray-700" />
                                    <div className="relative overflow-hidden rounded bg-neutral-900 px-2 py-0.5">
                                        <span className="text-xs text-gray-600 blur-[3px] select-none">
                                            Endereço Bloqueado 00
                                        </span>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Lock size={10} className="text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Usage Counter Badge (Purple) - Only shows if used today */}
                        {isRegistered && partner.isHighlight && usageCount > 0 && (
                            <div className="mb-3 animate-pulse bg-purple-900/20 border border-purple-500/30 rounded-lg p-2 flex items-center gap-2">
                                <History size={14} className="text-purple-400" />
                                <span className="text-xs font-bold text-purple-300">
                                    Cupom gerado <span className="text-white">{usageCount}x</span> hoje
                                </span>
                            </div>
                        )}

                        {/* Product Section - REMOVED if registered, shown locked if not */}
                        {!isRegistered && (
                            <div className="relative bg-neutral-900/50 rounded-lg p-3 mb-4 border border-neutral-800 overflow-hidden">
                                {/* Content */}
                                <div className="filter blur-[4px] opacity-40 select-none pointer-events-none">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-sm text-gray-200 font-medium">{partner.productName}</span>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        {partner.offerType === 'fixed_price' ? (
                                            <>
                                                <span className="text-xs text-gray-500 line-through">{partner.originalPrice}</span>
                                                <span className="text-yellow-500 font-bold">{partner.vipPrice}</span>
                                            </>
                                        ) : (
                                            <span className="text-yellow-500 font-bold text-sm">{partner.discountLabel}</span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Lock Overlay */}
                                <div 
                                    onClick={handleVipClick}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 hover:bg-black/50 transition-colors cursor-pointer"
                                >
                                    <div className="bg-neutral-800 text-gray-400 p-1.5 rounded-full mb-1 shadow-lg">
                                        <Lock size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ver Preço VIP</span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => handleInstagramClick(partner)}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all relative overflow-hidden group/btn w-full 
                                    ${hasInstagram && isRegistered 
                                        ? 'border border-red-500 text-red-500 hover:bg-red-600 hover:text-white' 
                                        : 'bg-neutral-800 text-gray-400 hover:bg-neutral-800/80'
                                    }`}
                                title={hasInstagram ? "Acessar Instagram" : "Indisponível no momento"}
                            >
                                <Instagram size={14} className="z-10" />
                                <span className="z-10">Instagram</span>
                                
                                {(!hasInstagram || !isRegistered) && (
                                    <div className="absolute right-1 top-1 text-gray-600">
                                        <Lock size={10} />
                                    </div>
                                )}
                            </button>
                            
                            {/* Discount Button - Changes appearance if Highlighted */}
                            <button 
                                onClick={() => isRegistered ? handleRestrictedAccess(partner) : handleVipClick()}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all relative group/btn w-full 
                                    ${partner.isHighlight && isRegistered
                                        ? 'bg-purple-700 text-white hover:bg-purple-600 shadow-lg shadow-purple-900/50' 
                                        : 'bg-neutral-800 text-gray-400 hover:bg-neutral-800/80'
                                    }`}
                                title={partner.isHighlight ? "Cupom Disponível!" : "Indisponível no momento"}
                            >
                                <Tag size={14} className="z-10" />
                                <span className="z-10">Desconto</span>
                                
                                {/* Lock Icon Logic */}
                                {(!isRegistered || !partner.isHighlight) && (
                                    <div className="absolute right-1 top-1 text-gray-600">
                                        <Lock size={10} />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
        
        <div className="text-center mt-8">
            <button onClick={() => handleAction(siteUrl)} className="text-xs text-gray-500 hover:text-white transition-colors underline">
                Seja Membro
            </button>
        </div>
      </div>
    </section>
  );
};

export default VipAccess;
