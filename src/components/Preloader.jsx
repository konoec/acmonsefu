import React, { useEffect, useState } from 'react';
import { IMAGES } from "../constants/images";

export default function Preloader({ onFinish }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Force a minimum display time of 1.5s for branding impact
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 1500));

    // Preload ONLY critical images
    const imagePromises = [
      IMAGES.LOGO,
      ...IMAGES.HOME,
    ].map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Continue even if one fails
      });
    });

    const allImagesLoaded = Promise.all(imagePromises);

    // Wait for window load AND image preloading
    const loadPromise = new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });

    Promise.all([minTimePromise, loadPromise, allImagesLoaded]).then(() => {
      setIsFading(true);
      // Allow fade out animation to finish before unmounting
      setTimeout(onFinish, 500);
    });

    return () => window.removeEventListener('load', () => { });
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#FDFBF7] flex flex-col items-center justify-center transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
        <img
          src={IMAGES.LOGO}
          alt="Cargando..."
          className="w-32 md:w-48 object-contain relative z-10 animate-[bounce_2s_infinite]"
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-600 to-red-600 animate-[loading_1.5s_ease-in-out_infinite] w-full origin-left"></div>
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold animate-pulse">Cargando Festival</span>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
