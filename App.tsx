
import React, { useState, useEffect } from 'react';
import { PortfolioItem, SiteSettings } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import Quote from './components/Quote';
import { supabase } from './lib/supabase';

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: "/logo-new.png",
  heroBackground: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtr9jNzsI7ZlPMLywSViXJpV2I1EAnBBrsjtEQbFJO2AY6RBvhOsmXmHOCSmG0cT23njuUKvKAEqZF-VTkIQCAPrPLjDBxb2462NJul4E1zklI7BwCAQhLdKkwbGflBu2Zm7BIN3NAOZ6jlXFZXZBs3m3bxaq2hlF4COR44kJIlSPmwUAzTHskcvRy5x8dwpfAhAmGhLoyFtLtcDmEXAkHk6J7RX-_ovyq5DQNHSU-X1ACgRt_CoJyAbdzvdezQE_JZVGZBXmFVCs",
  heroTitle: "Capturando seus Melhores Momentos de Cima",
  heroSubtitle: "Transformando suas celebrações em memórias cinematográficas inesquecíveis com a mais alta tecnologia em drones.",
  whatsappNumber: "5582993716239",
  phoneDisplay: "(82) 99371-6239",
  email: "jose_evilanio@hotmail.com",
  location: "Maceió - Alagoas, Brasil",
  instagramUrl: "https://www.instagram.com/jose_evilanio/",
  facebookUrl: "https://www.facebook.com/joseevilanio"
};

const DEFAULT_PORTFOLIO: PortfolioItem[] = [];

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Supabase Auth Observer
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setLoading(false);
    });

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    // Supabase Realtime Portfolio Listener
    const fetchPortfolio = async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching portfolio:', error);
      } else {
        // Map snake_case from DB to camelCase for App
        const mappedData = data?.map((item: any) => ({
          ...item,
          videoUrl: item.video_url ?? item.videourl ?? ""
        })) || [];
        setPortfolioItems(mappedData);
      }
    };

    fetchPortfolio();

    const portfolioSubscription = supabase
      .channel('portfolio_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio',
        },
        () => {
          fetchPortfolio();
        }
      )
      .subscribe();


    // Supabase Settings Listener
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'site_settings')
        .maybeSingle();

      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      } else if (!data && !error) {
        // Init settings if empty
        console.log("Settings not found, initializing...");
        const { error: insertError } = await supabase
          .from('settings')
          .upsert([{
            id: 'site_settings',
            logo_url: DEFAULT_SETTINGS.logoUrl,
            hero_background: DEFAULT_SETTINGS.heroBackground,
            hero_title: DEFAULT_SETTINGS.heroTitle,
            hero_subtitle: DEFAULT_SETTINGS.heroSubtitle,
            whatsapp_number: DEFAULT_SETTINGS.whatsappNumber,
            phone_display: DEFAULT_SETTINGS.phoneDisplay,
            email: DEFAULT_SETTINGS.email,
            location: DEFAULT_SETTINGS.location,
            instagram_url: DEFAULT_SETTINGS.instagramUrl,
            facebook_url: DEFAULT_SETTINGS.facebookUrl
          }], { onConflict: 'id' });

        if (insertError) console.error("Error creating default settings:", insertError);
        else setSettings(DEFAULT_SETTINGS);
      }

      if (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();

    const settingsSubscription = supabase
      .channel('settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        () => fetchSettings()
      )
      .subscribe();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      authListener.unsubscribe();
      supabase.removeChannel(portfolioSubscription);
      supabase.removeChannel(settingsSubscription);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setShowDashboard(false);
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        scrolled={scrolled}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLogin(true)}
        onDashboardClick={() => setShowDashboard(true)}
        onLogout={handleLogout}
        settings={settings}
      />
      <main className="flex-grow">
        <Hero
          title={settings.heroTitle}
          subtitle={settings.heroSubtitle}
          backgroundImage={settings.heroBackground}
          whatsappNumber={settings.whatsappNumber}
        />
        <Services />
        <Portfolio items={portfolioItems} />
        <Testimonials />
        <Quote whatsappNumber={settings.whatsappNumber} />
      </main>
      <Footer settings={settings} />
      <WhatsAppButton phoneNumber={settings.whatsappNumber} />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showDashboard && isLoggedIn && (
        <AdminDashboard
          items={portfolioItems}
          settings={settings}
          onClose={() => setShowDashboard(false)}
        />
      )}
    </div>
  );
};

export default App;
