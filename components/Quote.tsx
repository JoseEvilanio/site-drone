
import React, { useState } from 'react';
import Reveal from './Reveal';

interface QuoteProps {
    whatsappNumber: string;
}

const Quote: React.FC<QuoteProps> = ({ whatsappNumber }) => {
    const [formData, setFormData] = useState({
        eventType: '',
        date: '',
        location: '',
        time: '',
        objective: ''
    });

    const [expandedPackage, setExpandedPackage] = useState<number | null>(null);

    const PACKAGES = [
        {
            id: 1,
            title: "Pacote Inicial",
            subtitle: "Entrada Profissional",
            icon: "flight_takeoff",
            description: "Ideal para pequenas comemorações que precisam de um toque aéreo cinematográfico.",
            accent: "Essencial & Qualidade",
            details: [
                "Até 30 minutos de voo",
                "Fotos aéreas em alta resolução",
                "Vídeo bruto (sem edição)",
                "Entrega via Google Drive"
            ]
        },
        {
            id: 2,
            title: "Pacote Profissional",
            subtitle: "Cobertura Completa",
            icon: "auto_awesome",
            description: "A escolha certa para quem busca impacto visual e uma narrativa completa do seu evento.",
            accent: "Entrega Premium & Edição",
            recommended: true,
            details: [
                "Até 60 minutos de voo",
                "Fotos aéreas ilimitadas",
                "Vídeo editado (Highlights 1-3 min)",
                "Trilha sonora licenciada",
                "Entrega em 48 horas"
            ]
        },
        {
            id: 3,
            title: "Pacote Completo",
            subtitle: "Experiência VIP",
            icon: "diamond",
            description: "Produção de alto nível com múltiplos voos e entrega de conteúdo pronto para todas as mídias.",
            accent: "Máximo Impacto & Exclusividade",
            details: [
                "Voos ilimitados (conforme necessidade)",
                "Cobertura completa do evento",
                "Vídeo longo + Reels/Shorts",
                "Color grading cinematográfico",
                "Prioridade na edição"
            ]
        }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const message = `Olá José! Gostaria de solicitar um orçamento para filmagem aérea.
    
📌 *Detalhes do Evento:*
• *Tipo:* ${formData.eventType || 'Não informado'}
• *Data:* ${formData.date || 'Não informada'}
• *Local:* ${formData.location || 'Não informado'}
• *Horário:* ${formData.time || 'Não informado'}
• *Objetivo:* ${formData.objective || 'Não informado'}

Aguardo seu contato para conversarmos mais sobre o projeto!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    const scrollToForm = (packageTitle?: string) => {
        const form = document.getElementById('contato-form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth' });
            if (packageTitle) {
                setFormData(prev => ({ ...prev, objective: `Interesse no ${packageTitle}. ` + prev.objective }));
            }
        }
    };

    return (
        <section id="orcamento" className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-6">
                <Reveal>
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">
                            Sua História Sob um <span className="text-primary italic">Novo Ângulo</span>
                        </h2>
                        <div className="w-20 h-1.5 bg-primary mx-auto mb-6"></div>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            Cada evento é único. Por isso, entregamos orçamentos personalizados que valorizam a exclusividade da sua celebração.
                        </p>
                    </div>
                </Reveal>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Informational Side */}
                    <div className="space-y-8">
                        <Reveal delay={200}>
                            <div>
                                <h3 className="text-2xl font-display text-slate-900 dark:text-white mb-4 flex items-center">
                                    <span className="material-symbols-outlined text-primary mr-3 text-3xl">verified_user</span>
                                    Excelência e Segurança
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                    "Não vendemos apenas 'tempo de voo', entregamos recordações cinematográficas que duram para sempre."
                                </p>
                                <p className="mt-4 text-slate-600 dark:text-slate-400">
                                    Operamos com total segurança em Maceió e região, utilizando tecnologia de ponta para garantir imagens nítidas, estáveis e com edição profissional inclusa em cada entrega.
                                </p>
                            </div>
                        </Reveal>

                        <Reveal delay={400}>
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Nossos Diferenciais</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "Captação Aérea Segura",
                                        "Vídeos para Redes Sociais",
                                        "Edição Profissional",
                                        "Atendimento Personalizado",
                                        "Entrega em Alta Resolução",
                                        "Perspectiva Exclusiva"
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex items-center text-slate-600 dark:text-slate-300">
                                            <span className="material-symbols-outlined text-primary mr-2 text-xl">check_circle</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Reveal>

                        <Reveal delay={600}>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Eventos que Atendemos</h4>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Festas de Aniversário",
                                        "Casamentos e Noivados",
                                        "Eventos Sociais ao Ar Livre",
                                        "Eventos Promocionais",
                                        "Confraternizações",
                                        "Ensaios Externos"
                                    ].map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Pricing/Packages Side */}
                    <div className="space-y-6">
                        <Reveal delay={300}>
                            <div className="grid gap-6">
                                {PACKAGES.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        className={`p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 transition-all duration-500 overflow-hidden cursor-pointer group relative ${pkg.recommended ? 'border-primary shadow-lg scale-[1.02]' : 'border-slate-100 dark:border-slate-700 hover:border-primary/50'
                                            }`}
                                        onClick={() => setExpandedPackage(expandedPackage === pkg.id ? null : pkg.id)}
                                    >
                                        {pkg.recommended && (
                                            <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-4 py-1 uppercase rounded-bl-lg">
                                                Mais Recomendado
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{pkg.title}</h4>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">{pkg.subtitle}</p>
                                            </div>
                                            <span className={`material-symbols-outlined transition-colors duration-300 ${pkg.recommended ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
                                                {pkg.icon}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                                            {pkg.description}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="text-primary font-bold text-[10px] uppercase tracking-wider">{pkg.accent}</div>
                                            <div className="flex items-center text-primary text-[10px] font-bold uppercase tracking-widest transition-transform duration-300">
                                                {expandedPackage === pkg.id ? 'Ver menos' : 'Ver detalhes'}
                                                <span className={`material-symbols-outlined text-sm ml-1 transition-transform duration-300 ${expandedPackage === pkg.id ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={`grid transition-all duration-500 ease-in-out ${expandedPackage === pkg.id ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">O que está incluso:</p>
                                                    {pkg.details.map((detail, idx) => (
                                                        <div key={idx} className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                                            <span className="material-symbols-outlined text-primary text-sm mr-2">check_circle</span>
                                                            {detail}
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            scrollToForm(pkg.title);
                                                        }}
                                                        className="w-full mt-4 py-3 bg-primary/10 hover:bg-primary text-primary hover:text-black font-bold rounded-xl transition-all uppercase tracking-widest text-[10px] border border-primary/20"
                                                    >
                                                        Escolher este Pacote
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>

                        <Reveal delay={700}>
                            <div id="contato-form" className="mt-8 p-8 bg-slate-900 text-white rounded-3xl relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                                <div className="relative z-10">
                                    <h4 className="text-2xl font-display mb-4">Pronto para decolar?</h4>
                                    <p className="text-slate-300 mb-6 text-sm">
                                        Preencha as informações do seu evento abaixo para receber um orçamento detalhado.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 ml-1">Tipo de Evento</label>
                                                <select
                                                    name="eventType"
                                                    value={formData.eventType}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    required
                                                >
                                                    <option value="" className="bg-slate-900">Selecione...</option>
                                                    <option value="Casamento" className="bg-slate-900">Casamento</option>
                                                    <option value="Aniversário" className="bg-slate-900">Aniversário</option>
                                                    <option value="Evento Social" className="bg-slate-900">Evento Social</option>
                                                    <option value="Evento Corporativo" className="bg-slate-900">Evento Corporativo</option>
                                                    <option value="Ensaio Externo" className="bg-slate-900">Ensaio Externo</option>
                                                    <option value="Outro" className="bg-slate-900">Outro</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 ml-1">Data Prevista</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 ml-1">Local do Evento</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    placeholder="Cidade / Bairro"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 ml-1">Horário</label>
                                                <input
                                                    type="text"
                                                    name="time"
                                                    placeholder="Ex: 15h às 21h"
                                                    value={formData.time}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 ml-1">Objetivo do Vídeo</label>
                                            <textarea
                                                name="objective"
                                                placeholder="Conte um pouco sobre o que você imagina para as imagens..."
                                                value={formData.objective}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-primary text-black font-bold text-center rounded-xl hover:bg-white transition-colors uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                        >
                                            Solicitar Orçamento Agora
                                        </button>
                                    </form>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Quote;
