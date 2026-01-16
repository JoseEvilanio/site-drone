
import React from 'react';
import Reveal from './Reveal';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Mariana & Roberto",
    event: "Casamento no Resort",
    quote: "O trabalho do José foi o diferencial do nosso casamento. Ver a cerimônia de cima, com o pôr do sol, trouxe uma emoção que as fotos tradicionais não conseguem passar. Profissionalismo impecável!",
    rating: 5
  },
  {
    id: 2,
    name: "Ricardo Mendes",
    event: "Lançamento Imobiliário",
    quote: "Contratamos a filmagem aérea para um projeto corporativo e o resultado superou todas as expectativas. A qualidade da imagem 4K e a precisão das manobras valorizaram muito nosso empreendimento.",
    rating: 5
  },
  {
    id: 3,
    name: "Cláudia Oliveira",
    event: "Festa de 15 Anos",
    quote: "A filmagem da entrada da minha filha foi de tirar o fôlego! O drone capturou toda a grandiosidade da festa. Super atencioso e entregou o material editado muito rápido.",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="depoimentos" className="py-24 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-primary font-semibold tracking-[0.2em] uppercase text-xs mb-4 block">Experiências</span>
            <h2 className="font-display text-4xl md:text-5xl text-slate-900 dark:text-white mb-6">O que nossos clientes dizem</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <Reveal key={t.id} delay={idx * 200}>
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 relative h-full flex flex-col">
                <div className="absolute -top-4 left-8 text-primary">
                  <span className="material-symbols-outlined text-5xl bg-white dark:bg-zinc-900 rounded-full">format_quote</span>
                </div>
                
                <div className="flex mb-4 mt-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-primary text-sm">star</span>
                  ))}
                </div>
                
                <p className="text-slate-600 dark:text-slate-300 italic mb-8 flex-grow leading-relaxed">
                  "{t.quote}"
                </p>
                
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">{t.name}</h4>
                  <p className="text-primary text-xs uppercase tracking-widest font-semibold mt-1">{t.event}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
