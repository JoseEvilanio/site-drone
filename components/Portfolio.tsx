
import React, { useState, useRef, useEffect } from 'react';
import Reveal from './Reveal';
import { PortfolioItem } from '../types';

interface PortfolioProps {
  items: PortfolioItem[];
}

const Portfolio: React.FC<PortfolioProps> = ({ items }) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeBadge, setShowVolumeBadge] = useState(false);

  // Refs for the full-screen modal video
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  const openVideo = (url: string) => {
    setActiveVideo(url);
    setIsPlaying(true);
    setProgress(0);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setActiveVideo(null);
    document.body.style.overflow = 'auto';
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressContainerRef.current && videoRef.current) {
      const rect = progressContainerRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeVideo) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(prev => {
          const newVol = Math.min(1, prev + 0.1);
          if (videoRef.current) videoRef.current.volume = newVol;
          return newVol;
        });
        setShowVolumeBadge(true);
        setTimeout(() => setShowVolumeBadge(false), 1000);
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(prev => {
          const newVol = Math.max(0, prev - 0.1);
          if (videoRef.current) videoRef.current.volume = newVol;
          return newVol;
        });
        setShowVolumeBadge(true);
        setTimeout(() => setShowVolumeBadge(false), 1000);
      } else if (e.code === 'Escape') {
        closeVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo, isPlaying]);

  const photos = items.filter(item => !item.videoUrl);
  const videos = items.filter(item => item.videoUrl);

  const VideoThumbnail = ({ item }: { item: PortfolioItem }) => {
    const [isHovering, setIsHovering] = useState(false);
    const thumbnailVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (thumbnailVideoRef.current) {
        if (isHovering) {
          thumbnailVideoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        } else {
          thumbnailVideoRef.current.pause();
          thumbnailVideoRef.current.currentTime = 0;
        }
      }
    }, [isHovering]);

    return (
      <div
        className="relative overflow-hidden rounded-xl mb-6 bg-zinc-100 dark:bg-zinc-800 min-h-[250px] cursor-pointer group"
        onClick={() => item.videoUrl && openVideo(item.videoUrl)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Static Image / Poster */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}>
          <img
            alt={item.title}
            className="w-full h-full object-cover"
            src={item.image}
            loading="lazy"
            decoding="async"
          />
          {/* Overlay Icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
        </div>

        {/* Video Preview on Hover */}
        <video
          ref={thumbnailVideoRef}
          src={item.videoUrl}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
          loop
        />

        {/* Hover Info (Optional, keeping simple for "cinematic" feel or adding back details) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
          <span className="text-primary text-[10px] tracking-[0.3em] uppercase mb-1 font-bold block">{item.category}</span>
          <h4 className="text-white text-xl font-display">{item.title}</h4>
        </div>
      </div>
    );
  }

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-background-dark">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="font-display text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">Portfólio</h2>
              <div className="w-24 h-1 bg-primary mb-6"></div>

              {/* Tabs */}
              <div className="flex space-x-2 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-full w-fit">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'photos'
                      ? 'bg-primary text-black shadow-lg'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                  Fotos
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'videos'
                      ? 'bg-primary text-black shadow-lg'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                >
                  Vídeos
                </button>
              </div>

            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-md pb-2">Uma seleção de trabalhos recentes capturando a beleza de diferentes ângulos.</p>
          </div>
        </Reveal>

        {activeTab === 'photos' ? (
          <div className="masonry-grid w-full">
            {photos.map((item, idx) => (
              <Reveal key={item.id} delay={(idx % 3) * 150}>
                <div
                  className="masonry-item group relative overflow-hidden rounded-xl mb-6 bg-zinc-100 dark:bg-zinc-800 min-h-[250px]"
                >
                  <img
                    alt={item.title}
                    className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110"
                    src={item.image}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mb-4 scale-0 group-hover:scale-100 transition-transform duration-500">
                      <span className="material-symbols-outlined text-primary text-4xl">
                        image
                      </span>
                    </div>
                    <span className="text-primary text-[10px] tracking-[0.3em] uppercase mb-2 font-bold">{item.category}</span>
                    <h4 className="text-white text-xl font-display">{item.title}</h4>
                  </div>
                </div>
              </Reveal>
            ))}
            {photos.length === 0 && (
              <div className="text-center py-20 text-zinc-500">
                <p>Nenhuma foto encontrada.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {videos.map((item, idx) => (
              <Reveal key={item.id} delay={(idx % 3) * 150}>
                <VideoThumbnail item={item} />
              </Reveal>
            ))}
            {videos.length === 0 && (
              <div className="col-span-full text-center py-20 text-zinc-500">
                <p>Nenhum vídeo encontrado.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video Modal - Existing Implementation */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={closeVideo}></div>
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 group/player">
            <button onClick={closeVideo} className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-primary hover:text-black transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
            {showVolumeBadge && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/60 px-6 py-4 rounded-2xl border border-white/20 flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-2">volume_up</span>
                <span className="text-white font-bold text-sm">{Math.round(volume * 100)}%</span>
              </div>
            )}
            <video ref={videoRef} className="w-full h-full" src={activeVideo} autoPlay onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} onClick={togglePlay} />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 flex items-center gap-4 opacity-0 group-hover/player:opacity-100 transition-opacity">
              <button onClick={togglePlay} className="text-white hover:text-primary"><span className="material-symbols-outlined text-3xl">{isPlaying ? 'pause' : 'play_arrow'}</span></button>
              <div ref={progressContainerRef} onClick={handleProgressClick} className="flex-grow h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden"><div className="h-full bg-primary" style={{ width: `${progress}%` }}></div></div>
              <div className="text-white text-[10px]">{videoRef.current ? Math.floor(videoRef.current.currentTime / 60) : 0}:{String(Math.floor((videoRef.current?.currentTime || 0) % 60)).padStart(2, '0')}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
