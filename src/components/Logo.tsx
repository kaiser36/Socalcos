interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical';
  light?: boolean;
}

export default function Logo({ className = "", variant = "horizontal", light = false }: LogoProps) {
  const logoSrc = variant === 'horizontal' ? '/images/logo-h.png' : '/images/logo-v.png';
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={logoSrc} 
        alt="Socalcos Logo" 
        className={`${variant === 'horizontal' ? 'h-10 md:h-12 w-auto' : 'w-48 h-auto'} ${light ? 'brightness-0 invert' : ''} object-contain transition-all`}
      />
    </div>
  );
}

