import { Star } from 'lucide-react';
import { motion } from 'motion/react';

import { Product } from '../types';

interface ProductCardProps extends Product {
  onSelect?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard(props: ProductCardProps) {
  const { id, name, vintage, region, price, image, rating, onSelect, onAddToCart } = props;
  const formattedPrice = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price);
  
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
          alt={name}
          className="h-full object-contain group-hover:scale-110 transition-transform duration-500 z-10"
        />
        <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/5 transition-colors z-0" />
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

      <h3 className="text-sm font-serif text-brand-charcoal mb-1 line-clamp-1">{name}</h3>
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
        Adicionar ao carrinho
      </button>
    </motion.div>
  );
}
