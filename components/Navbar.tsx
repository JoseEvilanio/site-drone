
import React from 'react';
import { SiteSettings } from '../types';

interface NavbarProps {
  scrolled: boolean;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onDashboardClick: () => void;
  onLogout: () => void;
  settings: SiteSettings;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled, isLoggedIn, onLoginClick, onDashboardClick, onLogout, settings }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'glass-header shadow-2xl py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollTo('home')}>
          <img
            alt="José Evilânio Logo"
            className="h-14 md:h-16 w-auto transition-transform hover:scale-105 rounded-lg"
            src={settings.logoUrl}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBy04Nc4eq3dD9tCMLsb5_xV3o3eH_NpJaod1Ipt_NiQukP2rlDFI2gn43SwkJU6usSbEnI9ckqJwf9mKVRNeje4x-L-Z7AcsXUaGTV9IsFzekEXRmhmLLGJRKKWZXSznL62gZqF8wYh1uS3xSH3EWOVf9KreVhNuoDSaCtSF5Fzjb7-IRrrj6vsy1_npLYoYTbI_ety1ohKmJrwGxr5gY9hjfQtDt9R_Ciw8xGAV4_qngTG9d95QuSb4N9CxKEi2NMzTmrUD7fC9c";
            }}
          />
        </div>

        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-widest uppercase">
          <button onClick={() => scrollTo('home')} className="text-primary hover:text-white transition-colors">Início</button>
          <button onClick={() => scrollTo('servicos')} className="text-slate-300 hover:text-primary transition-colors">Serviços</button>
          <button onClick={() => scrollTo('portfolio')} className="text-slate-300 hover:text-primary transition-colors">Portfólio</button>
          <button onClick={() => scrollTo('contato')} className="text-slate-300 hover:text-primary transition-colors">Contato</button>
        </nav>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onDashboardClick}
                className="text-white hover:text-primary transition-colors p-2"
                title="Painel Administrativo"
              >
                <span className="material-symbols-outlined">dashboard</span>
              </button>
              <button
                onClick={onLogout}
                className="text-red-500 hover:text-white transition-colors p-2"
                title="Sair"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="text-slate-300 hover:text-primary transition-colors p-2"
              title="Área Administrativa"
            >
              <span className="material-symbols-outlined">lock</span>
            </button>
          )}

          <a
            href={`https://wa.me/${settings.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-black px-5 py-2 md:px-8 md:py-2.5 rounded text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"
          >
            Orçamento
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
