import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin } from 'lucide-react';
import { useLead } from './LeadContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { handleAction, siteConfig } = useLead();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trilhas & Praias', href: '#natureza' },
    { name: 'Descontos', href: '#descontos' },
    { name: 'Acesso VIP', href: '#vip' },
    { name: 'Como Funciona', href: '#como-funciona' },
  ];

  const siteUrl = "#vip";

  // Function to handle smooth scrolling with precise offset
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 90; // Height of header + bit of space
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    setMobileMenuOpen(false);
  };

  const handleExternalAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    handleAction(siteUrl);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md py-3 shadow-lg border-b border-red-900/30' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo - Click to Scroll Top */}
        <a 
          href="#home" 
          onClick={scrollToTop}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <div className="bg-red-600 p-1.5 rounded-lg rotate-3">
            <MapPin className="text-white w-6 h-6" />
          </div>
          <span className="font-heading font-extrabold text-xl md:text-2xl tracking-tight text-white">
            {siteConfig.hero.titlePrefix} <span className="text-red-500">{siteConfig.hero.titleSuffix}</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-semibold transition-colors uppercase tracking-wide flex items-center gap-1.5 text-gray-300 hover:text-red-400"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={handleExternalAccess}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-transform transform hover:scale-105 shadow-lg shadow-red-900/50"
          >
            SEJA MEMBRO
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-800 absolute w-full shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 text-base font-medium rounded-md flex items-center gap-2 text-gray-300 hover:text-white hover:bg-neutral-800"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={handleExternalAccess}
              className="block w-full text-center mt-4 bg-red-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-red-700"
            >
              SEJA MEMBRO
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;