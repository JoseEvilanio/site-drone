
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
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';



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

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    title: 'Resort Alagoas',
    category: 'Casamento',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-rbO1s5Xf7hNktrULdgrP2hfOvSjJhJwtkm6lX3W5bSoJpDjdkKHU9toz57XlwKah5QAaBY0EiLj69qhVKCUDi1xt71bvSeIlGO8J5T-g-HcL-pCu3Bv-rqjxhDVzoy9Nw7EiZ-jd1nSDGAV0JURi3_WVaDR88IG2591DgQL8CUKGwtZ4-lvzqZbZf-A6W1Ye295yJKdKe0GQHvRbQ62HaiLRK1lAHBy3U1uIqiYQZR85e1cvN2sJxWrfDhcLx_x0NXQ9Wt1s38',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }
];

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

    // Firebase Auth Observer
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    // Firestore Portfolio Listener with Error Handling
    const q = query(collection(db, 'portfolio'), orderBy('createdAt', 'desc'));
    const unsubscribeFirestore = onSnapshot(q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PortfolioItem[];

        setPortfolioItems(items.length > 0 ? items : DEFAULT_PORTFOLIO);
      },
      (error) => {
        console.error("Firestore Permission Error: Verifique suas regras de segurança.", error);
        // Fallback para itens padrão se houver erro de permissão
        setPortfolioItems(DEFAULT_PORTFOLIO);
      }
    );

    // Firestore Settings Listener
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'site_settings'), (doc) => {
      if (doc.exists()) {
        setSettings(prev => ({ ...prev, ...doc.data() }));
      }
    }, (error) => {
      console.error("Erro ao carregar configurações do site:", error);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribeAuth();
      unsubscribeFirestore();
      unsubscribeSettings();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
