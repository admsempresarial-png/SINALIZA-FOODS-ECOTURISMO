import React from 'react';
import { Instagram, Facebook, MessageCircle, MapPin, Mail, Phone, Settings } from 'lucide-react';
import { useLead } from './LeadContext';

const Footer: React.FC = () => {
  const { handleAction, setIsAdminOpen, siteConfig } = useLead();
  const siteUrl = "#vip";

  return (
    <footer className="bg-black border-t border-neutral-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-red-600 p-1.5 rounded-lg rotate-3">
                <MapPin className="text-white w-6 h-6" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                {siteConfig.hero.titlePrefix} <span className="text-red-500">{siteConfig.hero.titleSuffix}</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              {siteConfig.footer.description}
            </p>
            <div className="flex gap-4">
              <a 
                href={siteConfig.footer.instagramUrl}
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <div 
                className="w-10 h-10 bg-neutral-800/50 rounded-full flex items-center justify-center text-gray-600 cursor-not-allowed"
                title="Indisponível no momento"
              >
                <Facebook size={20} />
              </div>
              <div 
                className="w-10 h-10 bg-neutral-800/50 rounded-full flex items-center justify-center text-gray-600 cursor-not-allowed"
                title="Indisponível no momento"
              >
                <MessageCircle size={20} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Explorar</h4>
            <ul className="space-y-4 text-gray-400">
              <li><a href="#natureza" className="hover:text-red-500 transition-colors">Trilhas e Praias</a></li>
              <li><a href="#descontos" className="hover:text-red-500 transition-colors">Descontos</a></li>
              <li>
                <button 
                    onClick={() => handleAction(siteUrl)} 
                    className="hover:text-red-500 transition-colors text-left"
                >
                    Seja Membro
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Empresa & Contato</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a 
                  href="https://sites.google.com/view/sinaliza-foods/contrate-nos" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 text-white font-bold hover:text-red-500 transition-colors mb-2"
                >
                  🚀 Seja um Parceiro
                </a>
                <p className="text-sm text-gray-400 leading-relaxed mt-2">
                  Seja você microempreendedor ou empresa de grande porte, faça parte da rede Sinaliza Foods, e alcance milhares de clientes em um único lugar! Marketing Digital, gestão de Tráfego e Site gratuito, entre em contato!
                </p>
              </li>
              
              <li className="pt-4 border-t border-neutral-800">
                <p className="text-xs text-gray-500 uppercase mb-2 font-semibold">Fale Conosco</p>
                <a href={`https://wa.me/55${siteConfig.footer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors mb-2">
                  <Phone size={16} className="text-red-500" />
                  {siteConfig.footer.whatsapp}
                </a>
                <a href={`mailto:${siteConfig.footer.email}`} className="flex items-center gap-2 hover:text-white transition-colors break-all">
                  <Mail size={16} className="text-red-500" />
                  {siteConfig.footer.email}
                </a>
              </li>

              <li className="pt-2">
                <a href="#" className="hover:text-red-500 transition-colors text-sm">Termos de Uso</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 {siteConfig.hero.titlePrefix} {siteConfig.hero.titleSuffix}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <p className="text-gray-600 text-sm">Feito com ❤️ para aventureiros.</p>
            <button 
                onClick={() => setIsAdminOpen(true)}
                className="text-gray-700 hover:text-gray-500 transition-colors flex items-center gap-1 text-xs"
                title="Área Administrativa"
            >
                <Settings size={12} /> Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;