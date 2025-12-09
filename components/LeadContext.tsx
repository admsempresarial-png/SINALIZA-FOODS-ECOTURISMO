
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, Company, CouponUsage, SiteConfig } from '../types';

interface LeadContextType {
  isRegistered: boolean;
  subscriptionExpired: boolean; // New state
  currentUserCpf: string;
  isModalOpen: boolean;
  showWelcomeModal: boolean;
  modalTitle: string;
  modalSubtitle: string;
  openModal: (redirectUrl?: string) => void;
  closeModal: () => void;
  closeWelcomeModal: () => void;
  registerLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  renewSubscription: () => void; // New function
  handleAction: (url: string, customTitle?: string, customSubtitle?: string) => void;
  leads: Lead[];
  isAdminOpen: boolean;
  setIsAdminOpen: (isOpen: boolean) => void;
  
  // Company Management
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  removeCompany: (id: string) => void;

  // Coupon Usage Tracking
  trackCouponUsage: (companyId: string) => void;
  getTodayUsageCount: (companyId: string) => number;
  getLastUsageTimestamp: (companyId: string) => number | null; 

  // Coupon Modal Management
  isCouponModalOpen: boolean;
  selectedCompanyForCoupon: Company | null;
  openCouponModal: (company: Company) => void;
  closeCouponModal: () => void;

  // Site Configuration (CMS)
  siteConfig: SiteConfig;
  updateSiteConfig: (newConfig: SiteConfig) => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

// Dados iniciais (Vazio para iniciar limpo)
const INITIAL_COMPANIES: Company[] = [];

// Configuração Padrão do Site
const DEFAULT_SITE_CONFIG: SiteConfig = {
  hero: {
    titlePrefix: "SINALIZA",
    titleSuffix: "FOODS",
    subtitle: "O guia mais completo da região.",
    description: "Descubra onde comer bem, curtir trilhas incríveis, cachoeiras escondidas e praias paradisíacas – tudo em um só guia, com descontos exclusivos.",
    backgroundImage: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=1920&q=80"
  },
  sectionTitles: {
    featured: "Hamburgueria Artesanal",
    discounts: "Benefícios e Descontos",
    vip: "Clube de Acesso VIP",
    nature: "Guia de Turismo & Lazer",
    howItWorks: "Muito mais que um Guia"
  },
  featured: {
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badgeText: "Destaque da Semana",
    promoLabel: "Pague 1 Leve 2",
    description: "Toda semana nossa equipe seleciona os melhores lugares. O destaque da vez é a Hamburgueria Artesanal, com blends de carnes nobres, queijos especiais e molhos da casa. O verdadeiro sabor do burger feito na brasa!"
  },
  finalCta: {
    image: "https://picsum.photos/id/431/1920/800"
  },
  natureSpots: [
    {
      name: "Parque Morro do Espia (Pedra Lisa)",
      distance: "Acesso: Fonte ou Mirante",
      difficulty: "Panorâmica",
      image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=800&q=80",
      description: "Coordenadas: -24.5860, -47.3600. Próximo ao centro histórico de Iguape (1km). Acesso pela Fonte do Senhor ou Mirante do Cristo."
    },
    {
      name: "Caverna do Ódio / Ruínas do Itaguá",
      distance: "Acesso: Ponte Laercio Ribeiro",
      difficulty: "Histórica",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
      description: "Coordenadas: -24.6100, -47.3300. Região de acesso à ponte. A trilha segue margeando o Mar Pequeno até as ruínas."
    },
    {
      name: "Cachoeiras e Rios",
      distance: "Acesso Exclusivo",
      difficulty: "Lazer",
      image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Lagos e Pesca",
      distance: "Área de Lazer",
      difficulty: "Família",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Guia de Praias",
      distance: "Litoral",
      difficulty: "Sol e Mar",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    {
      name: "Ilhas e Passeios de Barco",
      distance: "Mar Aberto",
      difficulty: "Aventura",
      image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80"
    }
  ],
  testimonials: [
    {
      name: "Mariana Silva",
      role: "Turista de SP",
      text: "O Sinaliza Foods salvou nossa viagem! Achamos uma cachoeira incrível que não estava no Google Maps.",
      image: "https://picsum.photos/id/64/100/100"
    },
    {
      name: "Carlos Eduardo",
      role: "Morador Local",
      text: "Uso sempre para pegar cupons nos restaurantes. A economia no final do mês vale muito a pena.",
      image: "https://picsum.photos/id/91/100/100"
    },
    {
      name: "Fernanda Costa",
      role: "Morador Ilha Comprida",
      text: "Paguei R$21,99 para usar o site e, já economizei pelo menos R$97,00 reais, só pegando cupons ao longo da semana com os restaurantes do site, em Iguape e Ilha comprida.",
      image: "https://picsum.photos/id/129/100/100"
    }
  ],
  footer: {
    description: "Seu passaporte digital para os melhores sabores e aventuras da região. Conectando você a experiências inesquecíveis.",
    whatsapp: "(15) 99661-0494",
    email: "adms.empresarial@gmail.com",
    instagramUrl: "https://www.instagram.com/sinaliza.foods?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
  },
  requireReceiptUpload: false // Default to false (disabled)
};

// --- INDEXED DB HELPER ---
const DB_NAME = 'SinalizaFoodsDB';
const DB_VERSION = 1;
const STORE_NAME = 'SiteConfigStore';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => reject("IndexedDB error: " + (event.target as any).error);

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const saveConfigToDB = async (config: SiteConfig) => {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(config, "currentConfig");

    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e);
  });
};

const loadConfigFromDB = async (): Promise<SiteConfig | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get("currentConfig");

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e);
  });
};
// -------------------------

export const LeadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [subscriptionExpired, setSubscriptionExpired] = useState(false);
  const [currentUserCpf, setCurrentUserCpf] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [couponUsages, setCouponUsages] = useState<CouponUsage[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  
  // Custom messages for the registration modal
  const [modalTitle, setModalTitle] = useState('Libere seu Acesso');
  const [modalSubtitle, setModalSubtitle] = useState('Cadastre-se rapidinho para acessar os descontos exclusivos e o guia completo.');

  // Coupon Modal State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [selectedCompanyForCoupon, setSelectedCompanyForCoupon] = useState<Company | null>(null);

  useEffect(() => {
    // Check registration status and EXPIRATION
    const registered = localStorage.getItem('sinaliza_is_registered');
    const storedSubscriptionDate = localStorage.getItem('sinaliza_subscription_date');
    const storedCpf = localStorage.getItem('sinaliza_current_cpf');

    if (registered === 'true') {
        if (storedCpf) setCurrentUserCpf(storedCpf);

        // Check if subscription has expired (30 days)
        if (storedSubscriptionDate) {
            const subDate = new Date(storedSubscriptionDate);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - subDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

            if (diffDays > 30) {
                // EXPIRED
                setIsRegistered(false);
                setSubscriptionExpired(true);
                setModalTitle("Assinatura Expirada");
                setModalSubtitle("Seus 30 dias acabaram. Renove agora para continuar aproveitando.");
            } else {
                // ACTIVE
                setIsRegistered(true);
                setSubscriptionExpired(false);
            }
        } else {
            // Legacy user (no date saved) - treat as active but set date now? 
            // Or force renew? Let's treat as active and set date to now to start tracking.
            const now = new Date().toISOString();
            localStorage.setItem('sinaliza_subscription_date', now);
            setIsRegistered(true);
        }
    }

    // Load existing leads
    const storedLeads = localStorage.getItem('sinaliza_leads');
    if (storedLeads) {
      setLeads(JSON.parse(storedLeads));
    }

    // Load companies
    const storedCompanies = localStorage.getItem('sinaliza_companies');
    if (storedCompanies) {
      setCompanies(JSON.parse(storedCompanies));
    } else {
        setCompanies(INITIAL_COMPANIES);
    }

    // Load Coupon Usages
    const storedUsages = localStorage.getItem('sinaliza_coupon_usages');
    if (storedUsages) {
        setCouponUsages(JSON.parse(storedUsages));
    }

    // Load Site Config from IndexedDB (Fallback to default if empty)
    const initSiteConfig = async () => {
        try {
            const config = await loadConfigFromDB();
            if (config) {
                setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...config });
            } else {
                const legacyConfig = localStorage.getItem('sinaliza_site_config');
                if (legacyConfig) {
                    setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...JSON.parse(legacyConfig) });
                }
            }
        } catch (error) {
            console.error("Failed to load config from DB", error);
        }
    };
    initSiteConfig();
  }, []);

  const openModal = (redirectUrl?: string) => {
    if (redirectUrl) setPendingUrl(redirectUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        if (!subscriptionExpired) {
            setModalTitle('Libere seu Acesso');
            setModalSubtitle('Cadastre-se rapidinho para acessar os descontos exclusivos e o guia completo.');
        }
    }, 300);
  };

  const closeWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  const registerLead = (data: Omit<Lead, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    
    // Create new lead record
    const newLead: Lead = {
      id: Date.now().toString(),
      createdAt: now,
      ...data
    };

    const updatedLeads = [...leads, newLead];
    setLeads(updatedLeads);
    localStorage.setItem('sinaliza_leads', JSON.stringify(updatedLeads));
    
    // SAVE REGISTRATION & DATE
    localStorage.setItem('sinaliza_is_registered', 'true');
    localStorage.setItem('sinaliza_current_cpf', data.cpf);
    localStorage.setItem('sinaliza_subscription_date', now); // Start 30 day timer
    
    setIsRegistered(true);
    setSubscriptionExpired(false);
    setCurrentUserCpf(data.cpf);
    
    setIsModalOpen(false);
    setPendingUrl(null); 
    setShowWelcomeModal(true);
  };

  // Function to Renew Subscription without creating a new lead
  const renewSubscription = () => {
      const now = new Date().toISOString();
      
      // Update the date in local storage
      localStorage.setItem('sinaliza_subscription_date', now);
      localStorage.setItem('sinaliza_is_registered', 'true'); // Re-enable if it was false
      
      setIsRegistered(true);
      setSubscriptionExpired(false);
      
      setIsModalOpen(false);
      
      // We can show the welcome modal again or just a simple alert
      alert("Assinatura renovada com sucesso! Você tem mais 30 dias de acesso.");
  };

  const handleAction = (url: string, customTitle?: string, customSubtitle?: string) => {
    if (isRegistered && !subscriptionExpired) {
      if (url.startsWith('#')) {
          const element = document.querySelector(url);
          if (element) {
              const headerOffset = 90;
              const elementPosition = element.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
              window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
              });
          }
      } else {
          window.open(url, '_blank');
      }
    } else {
      // Logic for NOT registered OR Expired
      if (subscriptionExpired) {
          setModalTitle("Assinatura Expirada");
          setModalSubtitle("Para continuar acessando os benefícios, renove sua assinatura mensal.");
      } else {
          if (customTitle) setModalTitle(customTitle);
          if (customSubtitle) setModalSubtitle(customSubtitle);
      }
      openModal(url);
    }
  };

  const addCompany = (companyData: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      id: Date.now().toString(),
      ...companyData
    };
    const updated = [newCompany, ...companies];
    setCompanies(updated);
    localStorage.setItem('sinaliza_companies', JSON.stringify(updated));
  };

  const removeCompany = (id: string) => {
    const updated = companies.filter(c => c.id !== id);
    setCompanies(updated);
    localStorage.setItem('sinaliza_companies', JSON.stringify(updated));
  };

  const trackCouponUsage = (companyId: string) => {
      const today = new Date().toISOString().split('T')[0];
      const newUsage: CouponUsage = {
          id: Date.now().toString(),
          companyId,
          userCpf: currentUserCpf,
          date: today,
          timestamp: Date.now()
      };
      
      const updatedUsages = [...couponUsages, newUsage];
      setCouponUsages(updatedUsages);
      localStorage.setItem('sinaliza_coupon_usages', JSON.stringify(updatedUsages));
  };

  const getTodayUsageCount = (companyId: string) => {
      const today = new Date().toISOString().split('T')[0];
      return couponUsages.filter(
          usage => usage.companyId === companyId && usage.userCpf === currentUserCpf && usage.date === today
      ).length;
  };

  const getLastUsageTimestamp = (companyId: string) => {
      const usages = couponUsages.filter(
          usage => usage.companyId === companyId && usage.userCpf === currentUserCpf
      );
      if (usages.length === 0) return null;
      usages.sort((a, b) => b.timestamp - a.timestamp);
      return usages[0].timestamp;
  };

  const openCouponModal = (company: Company) => {
      setSelectedCompanyForCoupon(company);
      setIsCouponModalOpen(true);
  };

  const closeCouponModal = () => {
      setIsCouponModalOpen(false);
      setSelectedCompanyForCoupon(null);
  };

  const updateSiteConfig = async (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    try {
        await saveConfigToDB(newConfig);
    } catch (e) {
        console.error("Failed to save to IndexedDB", e);
        throw e;
    }
  };

  return (
    <LeadContext.Provider value={{ 
      isRegistered,
      subscriptionExpired,
      currentUserCpf,
      isModalOpen, 
      showWelcomeModal,
      modalTitle,
      modalSubtitle,
      openModal, 
      closeModal, 
      closeWelcomeModal,
      registerLead,
      renewSubscription,
      handleAction,
      leads,
      isAdminOpen,
      setIsAdminOpen,
      companies,
      addCompany,
      removeCompany,
      trackCouponUsage,
      getTodayUsageCount,
      getLastUsageTimestamp,
      isCouponModalOpen,
      selectedCompanyForCoupon,
      openCouponModal,
      closeCouponModal,
      siteConfig,
      updateSiteConfig
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLead = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLead must be used within a LeadProvider');
  }
  return context;
};
