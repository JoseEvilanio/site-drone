
import React, { useState, useRef, useEffect } from 'react';
import Reveal from './Reveal';
import { PortfolioItem } from '../types';

interface PortfolioProps {
  items: PortfolioItem[];
}

const Portfolio: React.FC<PortfolioProps> = ({ items }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeBadge, setShowVolumeBadge] = useState(false);
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

  return (
    <section id="portfolio" className="py-24 bg-white dark:bg-background-dark">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="font-display text-4xl md:text-5xl text-slate-900 dark:text-white mb-4">Portfólio</h2>
              <div className="w-24 h-1 bg-primary mb-0"></div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-md">Uma seleção de trabalhos recentes capturando a beleza de diferentes ângulos.</p>
          </div>
        </Reveal>

        <div className="masonry-grid w-full">
          {items.map((item, idx) => (
            <Reveal key={item.id} delay={(idx % 3) * 150}>
              <div
                className="masonry-item group relative overflow-hidden rounded-xl cursor-pointer mb-6 bg-zinc-100 dark:bg-zinc-800 min-h-[250px]"
                onClick={() => openVideo(item.videoUrl)}
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
                    <span className="material-symbols-outlined text-primary text-4xl">play_arrow</span>
                  </div>
                  <span className="text-primary text-[10px] tracking-[0.3em] uppercase mb-2 font-bold">{item.category}</span>
                  <h4 className="text-white text-xl font-display">{item.title}</h4>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Video Modal */}
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
