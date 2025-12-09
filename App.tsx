import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedBusiness from './components/FeaturedBusiness';
import Discounts from './components/Discounts';
import VipAccess from './components/VipAccess';
import NatureSection from './components/NatureSection';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import RegistrationModal from './components/RegistrationModal';
import PostRegistrationModal from './components/PostRegistrationModal';
import CouponModal from './components/CouponModal';
import AdminPanel from './components/AdminPanel';
import { LeadProvider } from './components/LeadContext';

const App: React.FC = () => {
  return (
    <LeadProvider>
      <div className="bg-[#0f0f0f] min-h-screen text-white font-sans selection:bg-red-500 selection:text-white">
        <Header />
        <main>
          <Hero />
          <FeaturedBusiness />
          <Discounts />
          <VipAccess />
          <NatureSection />
          <HowItWorks />
          <Testimonials />
          <FinalCTA />
        </main>
        <Footer />
        <ChatWidget />
        <RegistrationModal />
        <PostRegistrationModal />
        <CouponModal />
        <AdminPanel />
      </div>
    </LeadProvider>
  );
};

export default App;