
import React from 'react';
import Reveal from './Reveal';

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  whatsappNumber: string;
}

const Hero: React.FC<HeroProps> = ({ title, subtitle, backgroundImage, whatsappNumber }) => {
  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt="Cinematic Coastline"
          className="w-full h-full object-cover scale-110 animate-[pulse_10s_infinite_alternate]"
          src={backgroundImage}
        />
        <div className="hero-gradient absolute inset-0"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <Reveal delay={200}>
            <span className="inline-block text-primary font-semibold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm">
              Cinematografia Aérea Premium
            </span>
          </Reveal>

          <Reveal delay={400}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight">
              {title.toLowerCase().endsWith(' de cima') ? (
                <>
                  {title.slice(0, -8)}
                  <span className="block text-primary italic mt-2">de Cima</span>
                </>
              ) : (
                title
              )}
            </h1>
          </Reveal>

          <Reveal delay={600}>
            <p className="text-slate-300 text-base md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              {subtitle}
            </p>
          </Reveal>

          <Reveal delay={800}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                className="w-full md:w-auto flex items-center justify-center space-x-3 bg-primary text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 hover:bg-white shadow-[0_0_20px_rgba(212,175,55,0.4)]"
              >
                <span className="material-symbols-outlined">chat</span>
                <span>Fale no WhatsApp</span>
              </a>
              <a
                href="#portfolio"
                className="w-full md:w-auto px-10 py-5 rounded-full border border-white/30 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center"
              >
                Ver Portfólio
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <span className="material-symbols-outlined text-4xl">expand_more</span>
      </div>
    </section>
  );
};

export default Hero;
