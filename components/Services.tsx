
import React from 'react';
import Reveal from './Reveal';

const SERVICE_DATA = [
  {
    id: 'weddings',
    title: 'Casamentos',
    icon: 'favorite',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-rbO1s5Xf7hNktrULdgrP2hfOvSjJhJwtkm6lX3W5bSoJpDjdkKHU9toz57XlwKah5QAaBY0EiLj69qhVKCUDi1xt71bvSeIlGO8J5T-g-HcL-pCu3Bv-rqjxhDVzoy9Nw7EiZ-jd1nSDGAV0JURi3_WVaDR88IG2591DgQL8CUKGwtZ4-lvzqZbZf-A6W1Ye295yJKdKe0GQHvRbQ62HaiLRK1lAHBy3U1uIqiYQZR85e1cvN2sJxWrfDhcLx_x0NXQ9Wt1s38',
    desc: 'Perspectiva aérea única para o seu grande dia, capturando a emoção de cima.',
    items: ['Cenário externo', 'Saída dos noivos', 'Edição 4K']
  },
  {
    id: 'birthdays',
    title: 'Aniversários',
    icon: 'celebration',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUtXOblWcScBHHhxy9Cy85NHjOuYGgEJFiysNO5oVEd56vDtimccFAZLKrLfS7nsHsrFB8AxgGOcwdNpVKo_vSnn6CnPJi5RU38iS4BOM8z8lATHFhZR7eG5KVtzb1P5vvkXjE6YpL2RKTo9WiK_XHAPGrbb1tGiUWf7TH4dO3CIVebmksgVGnTWG_VnmDLXXRHgfB-LedqApa7IAkCkTgb2yUnc6C-ZT9HZcSsCxFysXWXemqOK1FfSdleFhY4ZHdicDDMx_kVOI',
    desc: 'Cobertura dinâmica para 15 anos e festas infantis com alta energia.',
    items: ['Cobertura dinâmica', 'Social Media', 'Slow Motion']
  },
  {
    id: 'corporate',
    title: 'Eventos Sociais',
    icon: 'apartment',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY_Uhcv8ji2ujEuB3FZxw4IcKMf1zCnpGa0mDW_45MQ8Ngp_JT0k6EiodW07sEQ_T0dH11aeNKTe-sAdIeBXbhwiI5teQ_bSeQPJ26AlqU2rb1YcRnTJtzIW5yP-q1T9c7GZumAXTvLGT1EMfoFu5h6Fkpy_mMoVhAZ_IAvBFU37NQ_JMDj2vNsWJqvlwejwqBGzRX5TZ2QuKyGA7_EpujyoTFi3ZMgvKRILOc7e7GHBGVrHgd5AZ14llk6BbRCsPqz2Ufu9-NGVM',
    desc: 'Filmagens para o setor corporativo e lançamentos imobiliários.',
    items: ['Panorâmicas', 'Transmissão Live', 'Entrega Express']
  }
];

const Services: React.FC = () => {
  return (
    <section id="servicos" className="py-16 bg-background-light dark:bg-background-dark overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-3xl md:text-4xl text-slate-900 dark:text-white mb-3">Serviços Exclusivos</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm md:text-base">
              Eternize seus momentos com elegância e profissionalismo através de ângulos cinematográficos.
            </p>
          </div>
        </Reveal>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 px-6 md:px-[10vw] pb-8">
        {SERVICE_DATA.map((service, idx) => (
          <Reveal key={service.id} delay={idx * 150} width="fit-content">
            <div className="flex-none w-[280px] md:w-[380px] h-[380px] md:h-[450px] relative snap-start group rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                alt={service.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src={service.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                <span className="material-symbols-outlined text-primary text-3xl mb-3">{service.icon}</span>
                <h3 className="font-display text-2xl md:text-3xl text-white mb-2">{service.title}</h3>
                <p className="text-slate-200 text-xs md:text-sm mb-4 font-light leading-relaxed line-clamp-2">
                  {service.desc}
                </p>
                <ul className="space-y-2 text-white/80 text-[10px] md:text-xs border-t border-white/20 pt-4">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="material-symbols-outlined text-primary mr-2 text-sm">check</span> 
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      
      <div className="flex justify-center mt-4 gap-2">
        {SERVICE_DATA.map((_, idx) => (
          <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === 0 ? 'bg-primary w-4' : 'bg-slate-600'} transition-all`}></div>
        ))}
      </div>
    </section>
  );
};

export default Services;
