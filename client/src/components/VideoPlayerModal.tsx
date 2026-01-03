"use client";

import { useEffect, useRef } from 'react';

interface VideoPlayerModalProps {
  videoKey: string;
  title: string;
  onClose: () => void;
}

export default function VideoPlayerModal({ videoKey, title, onClose }: VideoPlayerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all group"
          aria-label="Close video"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-white group-hover:scale-110 transition-transform"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Video Title */}
        <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>

        {/* YouTube Iframe */}
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
