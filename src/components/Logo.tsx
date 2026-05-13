export default function Logo({ className = "", light = false }) {
  const colorClass = light ? "fill-white" : "fill-[#8b8b8b]";
  const textColorClass = light ? "text-white" : "text-[#8b8b8b]";
  
  return (
    <div className={`flex flex-col md:flex-row items-center gap-3 ${className}`}>
      {/* Refined SVG Icon matching the provided image */}
      <div className="relative w-14 h-12 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className={`w-full h-full ${colorClass}`} preserveAspectRatio="xMidYMid meet">
          {/* Wine Bottle Silhouette - Scaled to match image proportions */}
          <path d="M42,10 L58,10 L58,45 C66,48 72,55 72,66 L72,92 L28,92 L28,66 C28,55 34,48 42,45 Z" />
          
          {/* Detailed Terrace Lines (Waves) - Strategic placement to overlap bottle bottom */}
          <g className="opacity-90">
             <path d="M15,75 Q40,65 65,75 T115,75" fill="none" stroke="currentColor" strokeWidth="2.5" className={textColorClass} />
             <path d="M10,83 Q45,73 80,83 T120,83" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.8" className={textColorClass} />
             <path d="M20,91 Q50,81 80,91 T110,91" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" className={textColorClass} />
             <path d="M25,99 Q55,89 85,99 T115,99" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" className={textColorClass} />
          </g>
        </svg>
      </div>
      
      <div className="flex flex-col items-center md:items-start leading-none -mt-1 md:mt-0">
        <span className={`text-4xl md:text-3xl font-serif font-light tracking-[0.15em] ${textColorClass}`}>
          SOCALCOS
        </span>
        <span className={`text-[10px] md:text-[11px] font-serif tracking-[0.35em] font-medium uppercase mt-2 ${textColorClass} opacity-90`}>
          VINHOS & GOURMET
        </span>
      </div>
    </div>
  );
}
