import { LucideIcon } from "lucide-react";

export interface Restaurant {
  id: number;
  name: string;
  description: string;
  rating: number;
  image: string;
  tags: string[];
}

export interface NatureSpot {
  id: number;
  name: string;
  type: 'trilha' | 'cachoeira' | 'praia';
  distance: string;
  difficulty?: string;
  image: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  cpf: string; // Added CPF
  createdAt: string;
}

export interface CouponUsage {
  id: string;
  companyId: string;
  userCpf: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export type OfferType = 'fixed_price' | 'percentage' | 'b1g1' | 'delivery' | 'gift';

export interface Company {
  id: string;
  name: string;
  address: string;
  productName: string; // Ex: Pizza Grande, Rodízio, Toda a Loja
  offerType: OfferType;
  
  // Para oferta de preço fixo
  originalPrice?: string;
  vipPrice?: string;
  
  // Para outros tipos
  discountLabel?: string; // Ex: "10% OFF", "Pague 1 Leve 2", "Entrega Grátis"
  
  instagram?: string;
  active: boolean;

  // New fields
  isHighlight?: boolean; // Controls the Purple Border / Release
  couponCode?: string;   // The Keyword
}

export interface NatureSpotConfig {
  name: string;
  distance: string; // displayed as access info
  difficulty: string; // e.g. "Panorâmica", "Aventura"
  image: string;
  description?: string;
}

export interface TestimonialConfig {
  name: string;
  role: string;
  text: string;
  image: string;
}

export interface SiteConfig {
  hero: {
    titlePrefix: string;
    titleSuffix: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
  };
  sectionTitles: {
    featured: string;
    discounts: string;
    vip: string;
    nature: string;
    howItWorks: string;
  };
  featured: {
    image: string;
    badgeText: string;      // Ex: "Destaque da Semana"
    promoLabel: string;     // Ex: "Pague 1 Leve 2"
    description: string;    // Texto descritivo
  };
  finalCta: {
    image: string;
  };
  // Fixed size arrays for layout consistency: 6 spots (2 per tab), 3 testimonials
  natureSpots: NatureSpotConfig[];
  testimonials: TestimonialConfig[];
  footer: {
    description: string;
    whatsapp: string;
    email: string;
    instagramUrl: string;
  };
  requireReceiptUpload: boolean; // Controls if receipt upload is mandatory
}