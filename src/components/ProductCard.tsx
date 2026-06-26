import { useState, useEffect } from 'react';
import { Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';

interface ProductCardProps extends Product {
  onSelect?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard(props: ProductCardProps) {
  const { id, name, name_en, vintage, region, price, image, rating, category_id, tax_rate, onSelect, onAddToCart } = props;
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const displayName = (language === 'en' && name_en) ? name_en : name;
  const defaultTaxRate = category_id === 'f6d05bbb-be25-4b3d-b87b-8c8aad3db1c2' ? 13 : 23;
  const priceWithTax = price * (1 + (tax_rate || defaultTaxRate) / 100);
  const formattedPrice = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(priceWithTax);
  
  useEffect(() => {
    const checkWishlist = () => {
      if (!user?.id) {
        setIsWishlisted(false);
        return;
      }
      const stored = localStorage.getItem(`socalcos_wishlist_${user.id}`);
      if (stored) {
        try {
          const list = JSON.parse(stored);
          setIsWishlisted(list.includes(id));
        } catch {
          setIsWishlisted(false);
        }
      } else {
        setIsWishlisted(false);
      }
    };

    checkWishlist();
    window.addEventListener('wishlist-update', checkWishlist);
    return () => window.removeEventListener('wishlist-update', checkWishlist);
  }, [user, id]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.id) {
      alert('Por favor, inicie sessão para adicionar vinhos aos seus favoritos!');
      return;
    }
    const stored = localStorage.getItem(`socalcos_wishlist_${user.id}`);
    let list: string[] = [];
    if (stored) {
      try { list = JSON.parse(stored); } catch {}
    }
    const updated = list.includes(id) 
      ? list.filter(item => item !== id)
      : [...list, id];
    
    localStorage.setItem(`socalcos_wishlist_${user.id}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist-update'));
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      layout
      className="flex flex-col items-center text-center p-4 h-full cursor-pointer"
      onClick={() => onSelect?.(id)}
    >
      <div className="w-full aspect-[3/4] mb-6 overflow-hidden bg-white/50 flex items-center justify-center p-8 group relative">
        <motion.img 
          layoutId={`product-image-${id}`}
          src={image} 
          alt={displayName}
          onError={(e) => {
            e.currentTarget.src = '/images/logo-v.png';
            e.currentTarget.className = 'h-1/2 object-contain group-hover:scale-110 transition-transform duration-500 z-10 opacity-20';
          }}
          className="h-full object-contain group-hover:scale-110 transition-transform duration-500 z-10"
        />
        <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/5 transition-colors z-0" />
        
        {/* Elegant Heart Button */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 hover:bg-white text-gray-400 hover:text-brand-red rounded-full shadow-md hover:scale-110 transition-all duration-300"
          title={isWishlisted ? "Remover de favoritos" : "Adicionar aos favoritos"}
        >
          <Heart size={14} className={isWishlisted ? "fill-brand-red text-brand-red" : ""} />
        </button>
      </div>
      
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < rating ? "fill-brand-gold text-brand-gold" : "text-gray-300"} 
          />
        ))}
      </div>

      <h3 className="text-sm font-serif text-brand-charcoal mb-1 line-clamp-1">{displayName}</h3>
      <p className="text-[10px] text-gray-500 mb-4 font-sans tracking-tight">
        {region} • {vintage}
      </p>
      
      <p className="text-base font-medium text-brand-charcoal mb-6">{formattedPrice}</p>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onAddToCart?.(props);
        }}
        className="w-full py-3 px-4 border border-brand-charcoal/10 text-[10px] font-bold tracking-widest uppercase hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-300 rounded-sm"
      >
        {t('store.addToCart')}
      </button>
    </motion.div>
  );
}
