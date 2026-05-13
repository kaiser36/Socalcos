import { motion } from 'motion/react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star, Share2 } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const formattedPrice = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(product.price);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Breadcrumbs / Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-red transition-colors mb-12"
      >
        <ArrowLeft size={16} /> Volver à Loja
      </button>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Gallery Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 space-y-4"
        >
          <div className="aspect-[4/5] bg-white flex items-center justify-center p-12 overflow-hidden border border-gray-100">
            <motion.img 
              layoutId={`product-image-${product.id}`}
              src={product.image} 
              alt={product.name}
              className="h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-white border border-gray-100 flex items-center justify-center p-4 cursor-pointer hover:border-brand-red/30 transition-all">
                <img src={product.image} alt="thumbnail" className="h-full object-contain opacity-50" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 flex flex-col pt-4"
        >
          <div className="flex justify-between items-start mb-4">
             <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gold">{product.category}</span>
             <button className="text-gray-300 hover:text-brand-red transition-colors">
               <Share2 size={18} />
             </button>
          </div>

          <h1 className="text-5xl font-serif text-brand-charcoal mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < product.rating ? "fill-brand-gold text-brand-gold" : "text-gray-200"} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-400 font-sans tracking-wide">Ref: {product.id}00-PT</span>
          </div>

          <p className="text-3xl font-light text-brand-charcoal mb-8">{formattedPrice}</p>

          <div className="space-y-6 mb-12">
            <div className="grid grid-cols-2 gap-8 text-sm border-y border-gray-100 py-6">
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Região</span>
                <span className="font-sans text-brand-charcoal">{product.region}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Colheita</span>
                <span className="font-sans text-brand-charcoal">{product.vintage}</span>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed font-sans">
              {product.description || "Uma expressão sublime do terroir excepcional da região. Este exemplar destaca-se pela sua estrutura refinada, equilíbrio impecável e um final longo e persistente que cativa os sentidos mais exigentes."}
            </p>
          </div>

          {/* Add to Cart Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-gray-200 h-14">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-6 h-full hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-sans font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-6 h-full hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={() => onAddToCart(product, quantity)}
              className="flex-1 bg-brand-red text-white h-14 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-red/90 transition-all rounded-sm"
            >
              <ShoppingBag size={18} /> Adicionar ao Carrinho
            </button>
          </div>

          {/* Additional Info Tabs Placeholder */}
          <div className="mt-16 border-t border-gray-100 pt-8">
             <div className="flex gap-8 mb-6">
               <button className="text-xs font-bold tracking-widest uppercase border-b-2 border-brand-red pb-1">Descrição</button>
               <button className="text-xs font-bold tracking-widest uppercase text-gray-400 pb-1">Notas de Prova</button>
               <button className="text-xs font-bold tracking-widest uppercase text-gray-400 pb-1">Envio</button>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
