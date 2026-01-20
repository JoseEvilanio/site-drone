
import React, { useState } from 'react';
import { PortfolioItem, SiteSettings } from '../types';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  items: PortfolioItem[];
  settings: SiteSettings;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ items, settings, onClose }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'settings'>('portfolio');
  const [activePortfolioTab, setActivePortfolioTab] = useState<'photos' | 'videos'>('photos');

  // Portfolio Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Casamento');
  const [image, setImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

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

  const handleFileUpload = async (file: File, type: 'image' | 'video') => {
    if (!file) return;

    // 50MB internal limit check (Supabase Free Tier often limits around this or 50MB for standard uploads)
    // Adjust as per project plan.
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      alert(`O arquivo é muito grande (Máximo 50MB). Por favor, comprima o vídeo ou escolha um arquivo menor.`);
      return;
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
    const filePath = `${type}s/${fileName}`;

    // Start fake progress
    setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const current = prev[type] || 0;
        if (current >= 90) return prev; // Hold at 90%
        return { ...prev, [type]: current + 5 }; // Increment
      });
    }, 200);

    try {
      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      if (type === 'image') {
        setImage(publicUrl);
      } else {
        setVideoUrl(publicUrl);
      }

      // Success: 100%
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [type]: 100 }));

      // Auto-clear after a moment
      setTimeout(() => {
        setUploadProgress(prev => {
          const next = { ...prev };
          delete next[type];
          return next;
        });
      }, 2000);

    } catch (error: any) {
      console.error("Erro no upload:", error);
      clearInterval(progressInterval);
      setUploadProgress(prev => {
        const next = { ...prev };
        delete next[type]; // Clear progress on error
        return next;
      });

      if (error?.message?.includes('exceeded the maximum allowed size')) {
        alert('Erro: O arquivo excede o limite de tamanho permitido pelo servidor.');
      } else {
        alert(`Erro ao fazer upload do ${type}. Tente novamente.`);
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!image) {
      alert('Por favor, faça o upload de uma imagem.');
      return;
    }

    // Logic specific to active sub-tab
    if (activePortfolioTab === 'videos' && !videoUrl) {
      if (!videoUrl && !window.confirm("Você não fez upload de um vídeo. Deseja salvar apenas a imagem (capa)?")) {
        return;
      }
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('portfolio')
        .insert([
          {
            title,
            category,
            image,
            video_url: activePortfolioTab === 'videos' ? videoUrl : null, // Ensure videos are only saved if in video tab
          }
        ]);

      if (error) throw error;

      setTitle('');
      setImage('');
      setVideoUrl('');
      setCategory('Casamento');
      alert('Trabalho adicionado com sucesso!');
    } catch (error) {
      console.error("Erro ao adicionar:", error);
      alert('Erro ao salvar no banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl?: string, videoUrl?: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item permanentemente?')) {
      try {
        const { error } = await supabase
          .from('portfolio')
          .delete()
          .eq('id', id);

        if (error) throw error;

        // Cleanup Storage logic helper
        const cleanupStorage = async (url: string) => {
          if (!url.includes('supabase')) return;

          const path = url.split('/portfolio/')[1];
          if (path) {
            await supabase.storage.from('portfolio').remove([path]);
          }
        }

        if (imageUrl) await cleanupStorage(imageUrl);
        if (videoUrl) await cleanupStorage(videoUrl);

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
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 'site_settings',
          logo_url: logoUrl,
          hero_background: heroBackground,
          hero_title: heroTitle,
          hero_subtitle: heroSubtitle,
          whatsapp_number: whatsappNumber,
          phone_display: phoneDisplay,
          email,
          location,
          instagram_url: instagramUrl,
          facebook_url: facebookUrl,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar configurações:", error);
      alert('Erro ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (activePortfolioTab === 'photos') return !item.videoUrl;
    return !!item.videoUrl;
  });

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      {/* Sidebar / Form */}
      <div className="w-full md:w-[400px] bg-zinc-900 p-8 border-b md:border-b-0 md:border-r border-zinc-800 h-auto md:h-full md:overflow-y-auto shrink-0">
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="text-white text-xl font-display">Painel Admin</h2>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
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
          <div>
            {/* Sub-tabs for Portfolio */}
            <div className="flex space-x-2 mb-6 bg-zinc-950 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setActivePortfolioTab('photos')}
                className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${activePortfolioTab === 'photos' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Fotos
              </button>
              <button
                type="button"
                onClick={() => setActivePortfolioTab('videos')}
                className={`flex-1 py-2 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${activePortfolioTab === 'videos' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Vídeos
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-6">
              <h3 className="text-primary text-xs uppercase tracking-[0.2em] font-bold mb-4">
                {activePortfolioTab === 'photos' ? 'Adicionar Nova Foto' : 'Adicionar Novo Vídeo'}
              </h3>
              <div>
                <label className="block text-zinc-400 text-[10px] uppercase mb-1">Título</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-zinc-950 border-zinc-800 text-sm rounded-lg p-3 text-white outline-none focus:border-primary transition-colors" placeholder={activePortfolioTab === 'photos' ? "Ex: Casamento na Praia" : "Ex: Highlights do Evento"} required />
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
                <label className="block text-zinc-400 text-[10px] uppercase mb-1">{activePortfolioTab === 'photos' ? 'Imagem' : 'Capa do Vídeo (Thumbnail)'}</label>
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'image')}
                    className="w-full text-zinc-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-primary hover:file:bg-zinc-700"
                  />
                  {/* Progress Bar for Image */}
                  {uploadProgress['image'] !== undefined && (
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-xs uppercase font-bold tracking-wider text-zinc-500">
                        <span>{uploadProgress['image'] === 100 ? 'Concluído' : 'Enviando...'}</span>
                        <span>{Math.round(uploadProgress['image'])}%</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-300 ${uploadProgress['image'] === 100 ? 'bg-green-500' : 'bg-primary'}`}
                          style={{ width: `${uploadProgress['image']}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {activePortfolioTab === 'videos' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-zinc-400 text-[10px] uppercase mb-1">Vídeo (MP4)</label>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      accept="video/mp4"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 'video')}
                      className="w-full text-zinc-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-primary hover:file:bg-zinc-700"
                    />
                    {/* Progress Bar for Video */}
                    {uploadProgress['video'] !== undefined && (
                      <div className="w-full space-y-1">
                        <div className="flex justify-between text-xs uppercase font-bold tracking-wider text-zinc-500">
                          <span>{uploadProgress['video'] === 100 ? 'Concluído' : 'Enviando...'}</span>
                          <span>{Math.round(uploadProgress['video'])}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-300 ${uploadProgress['video'] === 100 ? 'bg-green-500' : 'bg-primary'}`}
                            style={{ width: `${uploadProgress['video']}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    {videoUrl && uploadProgress['video'] === undefined && <p className="text-green-500 text-xs mt-1 animate-pulse">✓ Vídeo carregado e pronto</p>}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || Object.keys(uploadProgress).length > 0}
                className="w-full bg-primary text-black font-bold py-3 rounded-lg uppercase text-xs tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : Object.keys(uploadProgress).length > 0 ? 'Aguarde o upload...' : 'Salvar no Portfólio'}
              </button>
            </form>
          </div>
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
      <div className="flex-grow flex flex-col p-8 bg-zinc-950 h-auto md:h-full md:overflow-y-auto shrink-0">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-white text-xl font-display">
            {activeTab === 'portfolio' ? `Gerenciar ${activePortfolioTab === 'photos' ? 'Fotos' : 'Vídeos'} (${filteredItems.length})` : 'Configurações do Site'}
          </h3>
          <button onClick={onClose} className="hidden md:block px-6 py-2 border border-zinc-800 text-zinc-400 rounded-full hover:bg-white/5 transition-all text-xs uppercase tracking-widest">
            Fechar Painel
          </button>
        </div>

        {activeTab === 'portfolio' ? (
          <div className="flex flex-col space-y-2">
            {filteredItems.map(item => (
              <div key={item.id} className="group bg-zinc-900 border border-zinc-800 rounded-lg p-3 flex items-center gap-4 hover:border-zinc-700 transition-all">
                {/* Thumbnail */}
                <div className="w-16 h-16 shrink-0 bg-zinc-800 rounded-md overflow-hidden relative cursor-pointer" onClick={() => window.open(item.image, '_blank')}>
                  <img src={item.image} className="w-full h-full object-cover" />
                  {item.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="material-symbols-outlined text-white text-sm">play_circle</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <span className="text-primary text-[10px] uppercase font-bold tracking-widest block mb-1">{item.category}</span>
                  <h4 className="text-white text-sm font-semibold truncate" title={item.title}>{item.title}</h4>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.videoUrl && (
                    <button
                      onClick={() => window.open(item.videoUrl, '_blank')}
                      className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800"
                      title="Ver Vídeo"
                    >
                      <span className="material-symbols-outlined text-lg">movie</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id, item.image, item.videoUrl)}
                    className="p-2 text-red-500/70 hover:text-red-500 rounded-full hover:bg-red-500/10"
                    title="Excluir"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                <span className="material-symbols-outlined text-zinc-700 text-6xl mb-4">folder_open</span>
                <p className="text-zinc-600 uppercase tracking-widest text-xs">Nenhum item encontrado nesta categoria</p>
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
