import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { getStoredLandingImages, LandingShowcaseImage } from '../services/mediaStore';

export const ElevatedShowcaseBox: React.FC = () => {
  const [images, setImages] = useState<LandingShowcaseImage[]>(getStoredLandingImages());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Sync with updates from Admin Page
  useEffect(() => {
    const handleSync = () => {
      const updated = getStoredLandingImages();
      setImages(updated);
      if (currentIndex >= updated.length) {
        setCurrentIndex(0);
      }
    };
    window.addEventListener('shivansh-media-updated', handleSync);
    return () => window.removeEventListener('shivansh-media-updated', handleSync);
  }, [currentIndex]);

  // Automatic Rotation (3.5s per image with smooth transition)
  useEffect(() => {
    if (images.length <= 1 || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return null;
  }

  const currentSlide = images[currentIndex] || images[0];

  return (
    <div
      className="relative w-full group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 3D Offset Background Architectural Accent Frame */}
      <div className="absolute -bottom-3 -right-3 -top-1 -left-1 rounded-3xl bg-gradient-to-br from-[#82C8E5]/35 via-slate-200/60 to-slate-300/50 border border-[#82C8E5]/50 -z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />

      {/* Crisp White Outer Frame + Physically Elevated Floating Container */}
      <div className="p-2 bg-white rounded-3xl border border-slate-200/90 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.4)] transition-all">
        <div className="relative w-full h-[45vh] lg:h-[50vh] rounded-2xl bg-slate-900 border-t-4 border-[#82C8E5] border-x border-b border-slate-800 overflow-hidden select-none">
          
          {/* Animated Image Layers (Smooth Crossfade + Subtle Ken-Burns Scale Zoom) */}
          {images.map((img, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={img.id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
                {/* High-end architectural gradient overlay to guarantee bold heading legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-900/10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
            );
          })}

          {/* Top Floating Controls Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#82C8E5] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#82C8E5]">
                LIVE SHOWCASE
              </span>
            </div>

            {/* Slide Indicator & Pause / Play */}
            <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded-lg text-white">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 hover:text-[#82C8E5] transition-colors"
                title={isPaused ? 'Resume Auto-Play' : 'Pause'}
                aria-label={isPaused ? 'Resume Auto-Play' : 'Pause'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <span className="text-[11px] font-mono font-bold text-slate-300">
                {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Bottom Corner: Bold Machine Heading Badge ONLY (No paragraph text) */}
          <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-auto">
            <div className="max-w-xl">
              <div className="inline-block px-3.5 py-1 rounded-md bg-[#82C8E5] text-slate-950 text-[10px] font-mono font-extrabold uppercase tracking-widest mb-2 shadow-xs">
                ENGINEERED HARDWARE
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight uppercase font-sans drop-shadow-md">
                {currentSlide.title}
              </h2>
            </div>

            {/* Manual Controls */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-[#82C8E5] text-white hover:text-slate-950 border border-slate-700/80 hover:border-[#82C8E5] transition-all shadow-md active:scale-95"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-[#82C8E5] text-white hover:text-slate-950 border border-slate-700/80 hover:border-[#82C8E5] transition-all shadow-md active:scale-95"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dynamic Progress Bar at Very Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 z-30">
            <div
              key={currentIndex}
              className={`h-full bg-[#82C8E5] transition-all ${
                isPaused ? 'w-full' : 'animate-[progress_3.5s_linear]'
              }`}
            />
          </div>

        </div>
      </div>
    </div>
  );
};
