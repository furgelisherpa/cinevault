'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthPopup = () => {
  const { user, showAuthModal, setShowAuthModal } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  // Sync isVisible with showAuthModal from context
  useEffect(() => {
    if (showAuthModal) {
      setIsVisible(true);
    }
  }, [showAuthModal]);

  useEffect(() => {
    const handleScroll = () => {
      // Show centered modal for unauthenticated users after scroll
      if (window.scrollY > 400 && !user && !hasShown && !isVisible) {
        setIsVisible(true);
      }

      // RESET Loop: Allow modal to show again if user scrolls back to top
      if (window.scrollY < 100 && hasShown) {
        setHasShown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [user, hasShown, isVisible]);

  if (!isVisible || user) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    setShowAuthModal(false);
    setHasShown(true);
    // Redirect to top as a nudge to authenticate if it was a scroll trigger
    if (!showAuthModal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white p-10 md:p-14 rounded-[2.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.6)] text-center relative animate-in zoom-in-95 duration-400">
        
        <div className="mb-10 transform scale-125">
          <span className="text-7xl block animate-bounce">🎬</span>
        </div>
        
        <h3 className="text-3xl md:text-5xl font-semibold text-black tracking-tighter leading-[0.9] mb-8 uppercase">
          READY TO <br/> DIVE IN?
        </h3>
        
        <p className="text-zinc-500 font-semibold text-sm md:text-base mb-12 uppercase tracking-tight leading-tight">
          Unlimited movies and TV shows. <br/>
          Sign up now to start your journey.
        </p>

        <div className="space-y-4">
          <button 
            className="w-full bg-black text-white font-semibold py-5 rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 text-xs uppercase tracking-[0.2em] shadow-2xl"
            onClick={() => window.location.href = '/login?mode=signup'}
          >
            Create Your Account
          </button>
          
          <button 
            className="w-full bg-transparent text-black font-semibold py-2 hover:bg-zinc-100 rounded-xl transition-all text-[10px] uppercase tracking-widest underline decoration-2 decoration-zinc-200 underline-offset-4"
            onClick={() => window.location.href = '/login'}
          >
            Already a member? Sign In
          </button>
        </div>

        <button 
          onClick={handleDismiss}
          className="absolute top-8 right-8 p-2 text-zinc-300 hover:text-black transition-colors"
          title="Dismiss"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AuthPopup;
