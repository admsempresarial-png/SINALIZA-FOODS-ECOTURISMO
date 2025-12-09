
import React from 'react';
import { Star, Quote, CheckCircle2, ThumbsUp } from 'lucide-react';
import { useLead } from './LeadContext';

const Testimonials: React.FC = () => {
  const { siteConfig } = useLead();

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/20 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-1.5 mb-6">
             <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
             <span className="text-xs font-bold text-yellow-500 uppercase tracking-wide">Avaliações 5 Estrelas</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            Aprovado pela <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Comunidade</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Veja o que os membros VIP estão falando sobre a economia e as experiências descobertas com o Sinaliza Foods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {siteConfig.testimonials.map((review, i) => (
            <div key={i} className="bg-[#121212] p-8 rounded-2xl border border-neutral-800 shadow-xl hover:shadow-2xl hover:border-neutral-700 transition-all duration-300 group flex flex-col h-full relative">
              
              {/* Background Quote Icon */}
              <Quote className="absolute top-6 right-6 text-neutral-800 w-12 h-12 opacity-50 group-hover:text-neutral-700 transition-colors transform rotate-12" />

              {/* User Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <img 
                        src={review.image} 
                        alt={review.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-neutral-700 group-hover:border-green-500 transition-colors" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-black p-0.5 rounded-full border-2 border-[#121212]">
                        <CheckCircle2 size={12} strokeWidth={3} />
                    </div>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg leading-tight">{review.name}</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-0.5">{review.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} className="text-yellow-500 fill-yellow-500" />
                  ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 leading-relaxed text-sm flex-1 relative z-10">
                "{review.text}"
              </p>

              {/* Footer Meta */}
              <div className="border-t border-neutral-800 mt-6 pt-4 flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-green-500" /> Membro Verificado
                  </span>
                  <span className="flex items-center gap-1 hover:text-gray-300 cursor-pointer transition-colors">
                      <ThumbsUp size={14} /> Útil
                  </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
