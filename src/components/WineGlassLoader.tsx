import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export default function WineGlassLoader() {
  let language = 'pt';
  try {
    const langCtx = useLanguage();
    language = langCtx.language;
  } catch {
    // fallback to 'pt'
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-offwhite">
      {/* CSS Animation Styles */}
      <style>{`
        @keyframes waveMove {
          0% {
            transform: translateX(0px);
          }
          100% {
            transform: translateX(-120px);
          }
        }
        @keyframes fillUp {
          0% {
            transform: translateY(70px);
          }
          100% {
            transform: translateY(5px);
          }
        }
        .liquid-wave {
          animation: waveMove 1.6s linear infinite;
        }
        .liquid-container {
          animation: fillUp 3.2s ease-in-out forwards;
        }
      `}</style>

      {/* Elegant SVG Wine Glass */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg width="100" height="130" viewBox="0 0 100 130" className="overflow-visible">
          <defs>
            {/* The inner mask for the wine glass bowl */}
            <clipPath id="glass-bowl-mask">
              <path d="M 28 20 C 28 65, 38 85, 50 85 C 62 85, 72 65, 72 20 Z" />
            </clipPath>
          </defs>

          {/* Liquid group masked inside the bowl */}
          <g clipPath="url(#glass-bowl-mask)">
            {/* y = 85 is empty, y = 20 is full. We translate y from 70px to 5px inside liquid-container */}
            <g className="liquid-container">
              {/* Double-width wave path for seamless scrolling loop */}
              <path
                d="M -120 0 Q -90 -8, -60 0 T 0 0 T 60 0 T 120 0 T 180 0 T 240 0 L 240 100 L -120 100 Z"
                fill="#720E1E"
                className="liquid-wave"
              />
            </g>
          </g>

          {/* Glass Outer Silhouette */}
          {/* Glass Bowl Outline */}
          <path
            d="M 28 20 C 28 65, 38 85, 50 85 C 62 85, 72 20"
            fill="none"
            stroke="#2d2d2d"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-90"
          />
          {/* Glass Stem */}
          <line
            x1="50"
            y1="85"
            x2="50"
            y2="118"
            stroke="#2d2d2d"
            strokeWidth="3.2"
            className="opacity-90"
          />
          {/* Glass Base */}
          <path
            d="M 32 118 C 38 118, 45 118, 50 118 C 55 118, 62 118, 68 118"
            fill="none"
            stroke="#2d2d2d"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="opacity-90"
          />
        </svg>

        {/* Small gold sparkle overlay for luxury touch */}
        <motion.div
          className="absolute top-4 right-6 w-1.5 h-1.5 bg-brand-gold rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
      </div>

      {/* Loading message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <p className="font-serif text-brand-charcoal tracking-wide text-sm">
          {language === 'pt' ? 'Socalcos Vinhos & Gourmet' : 'Socalcos Vinhos & Gourmet'}
        </p>
        <p className="text-[10px] text-brand-gold uppercase tracking-[0.25em] font-bold mt-1.5 animate-pulse">
          {language === 'pt' ? 'A selecionar colheitas...' : 'Selecting vintages...'}
        </p>
      </motion.div>
    </div>
  );
}
