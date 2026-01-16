
import React, { useState } from 'react';
import { PortfolioItem, SiteSettings } from '../types';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';

interface AdminDashboardProps {
  items: PortfolioItem[];
  settings: SiteSettings;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ items, settings, onClose }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'settings'>('portfolio');

  // Portfolio Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Casamento');
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Settings Form State
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [heroBackground, setHeroBackground] = useState(settings.heroBackground);
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [phoneDisplay, setPhoneDisplay] = useState(settings.phoneDisplay);
  const [email, setEmail] = useState(settings.email);
  const [location, setLocation] = useState(settings.location);
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl);
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl);

  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'portfolio'), {
        title,
        category,
        image,
        videoUrl,
        createdAt: serverTimestamp()
      });

      setTitle('');
      setImage('');
      setVideoUrl('');
      alert('Trabalho adicionado com sucesso!');
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert('Erro ao salvar no banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item permanentemente?')) {
      try {
        await deleteDoc(doc(db, 'portfolio', id));
      } catch (error) {
        console.error("Erro ao deletar:", error);
        alert('Erro ao excluir item.');
      }
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'site_settings'), {
        logoUrl,
        heroBackground,
        heroTitle,
        heroSubtitle,
        whatsappNumber,
        phoneDisplay,
        email,
        location,
        instagramUrl,
        facebookUrl,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      alert('Erro ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar / Form */}
      <div className="w-full md:w-[400px] bg-zinc-900 p-8 border-b md:border-b-0 md:border-r border-zinc-800 overflow-y-auto">
        <div className="flex flex-col space-y-2 mb-8">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${activeTab === 'portfolio' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <span className="material-symbols-outlined">burst_mode</span>
            <span className="text-xs uppercase font-bold tracking-widest">Portfólio</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${activeTab === 'settings' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-xs uppercase font-bold tracking-widest">Configurações</span>
          </button>
        </div>

        {activeTab === 'portfolio' ? (
          <form onSubmit={handleAdd} className="space-y-6">
            <h3 className="text-primary text-xs uppercase tracking-[0.2em] font-bold mb-4">Adicionar Novo Trabalho</h3>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">Título</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" placeholder="Ex: Casamento na Praia" required />
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors">
                <option>Casamento</option>
                <option>Social</option>
                <option>Ensaio</option>
                <option>Corporativo</option>
                <option>Evento</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">URL da Imagem</label>
              <input value={image} onChange={e => setImage(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" placeholder="https://..." required />
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">URL do Vídeo (Link Direto MP4)</label>
              <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" placeholder="https://..." required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 rounded-lg uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar no Portfólio'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <h3 className="text-primary text-xs uppercase tracking-[0.2em] font-bold mb-4">Aparência do Site</h3>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">URL da Logo</label>
              <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" placeholder="https://..." required />
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">Título do Hero</label>
              <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" required />
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">Subtítulo do Hero</label>
              <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} rows={3} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors resize-none" required />
            </div>
            <div>
              <input value={heroBackground} onChange={e => setHeroBackground(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" placeholder="https://..." required />
            </div>

            <h3 className="text-primary text-xs uppercase tracking-[0.2em] font-bold mt-8 mb-4">Contato & Redes Sociais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-[10px] uppercase mb-1">WhatsApp (Apenas Números - 55...)</label>
                <input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" placeholder="558299..." required />
              </div>
              <div>
                <label className="block text-zinc-400 text-[10px] uppercase mb-1">Telefone (Visual)</label>
                <input value={phoneDisplay} onChange={e => setPhoneDisplay(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" placeholder="(82) 99..." required />
              </div>
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">E-mail</label>
              <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" type="email" required />
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">Localização</label>
              <input value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" required />
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">Instagram URL</label>
              <input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" required />
            </div>
            <div>
              <label className="block text-zinc-400 text-[10px] uppercase mb-1">Facebook URL</label>
              <input value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black font-bold py-3 rounded-lg uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-50"
            >
              {loading ? 'Atualizando...' : 'Atualizar Site'}
            </button>
          </form>
        )}
      </div>

      {/* Main Content / List */}
      <div className="flex-grow flex flex-col p-8 bg-zinc-950 overflow-y-auto">
        <div className="hidden md:flex justify-between items-center mb-10">
          <h3 className="text-white text-xl font-display">
            {activeTab === 'portfolio' ? `Gerenciar Itens (${items.length})` : 'Configurações do Site'}
          </h3>
          <button onClick={onClose} className="px-6 py-2 border border-zinc-800 text-zinc-400 rounded-full hover:bg-white/5 transition-all text-xs uppercase tracking-widest">
            Fechar Painel
          </button>
        </div>

        {activeTab === 'portfolio' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden aspect-video">
                <img src={item.image} className="w-full h-full object-cover opacity-50 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-0 p-4 flex flex-col justify-between bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex justify-end">
                    <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                  <div>
                    <span className="text-primary text-[8px] uppercase font-bold tracking-widest">{item.category}</span>
                    <h4 className="text-white text-sm font-semibold truncate">{item.title}</h4>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                <span className="material-symbols-outlined text-zinc-700 text-6xl mb-4">folder_open</span>
                <p className="text-zinc-600 uppercase tracking-widest text-xs">Nenhum item encontrado no Firestore</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl">
            <h4 className="text-white text-lg mb-4">Pré-visualização da Logo</h4>
            <div className="bg-zinc-950 p-8 rounded-xl border border-zinc-800 flex items-center justify-center mb-8">
              <img src={logoUrl} alt="Logo Preview" className="h-20 w-auto" />
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-zinc-400">
                <span className="material-symbols-outlined text-primary mt-1">info</span>
                <p className="text-sm leading-relaxed">
                  As alterações feitas aqui serão aplicadas em tempo real em todas as seções do site, incluindo Navbar, Footer e Hero. Certifique-se de usar URLs de imagens válidas e acessíveis publicamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
