import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star, Share2, X, Check, Copy } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';
import ProductCard from './ProductCard';

interface ProductDetailProps {
  product: Product;
  categoryName?: string;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  allProducts?: Product[];
  onSelectProduct?: (id: string) => void;
}

export default function ProductDetail({ 
  product, 
  categoryName, 
  onBack, 
  onAddToCart, 
  allProducts, 
  onSelectProduct 
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'descricao' | 'especificacoes' | 'envio'>('descricao');
  const [showLightbox, setShowLightbox] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const formattedPrice = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(product.price);
  const displayCategory = categoryName || product.category || 'Gourmet';

  // Fix apostrophe typographical issue dynamically
  const displayName = product.name.replace(/´/g, "'");

  const specs = [
    { label: 'Região', value: product.region },
    { label: 'Colheita', value: product.vintage || product.harvest },
    { label: 'Produtor', value: product.producer },
    { label: 'Capacidade', value: product.capacity },
    { label: 'Teor Alcoólico', value: product.alcohol_content ? `${product.alcohol_content}% vol.` : null },
    { label: 'Alergénios', value: product.allergens },
    { label: 'Peso', value: product.weight ? `${product.weight} kg` : null },
  ].filter(spec => spec.value && spec.value !== '-');

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const isAlcohol = displayCategory.toLowerCase().includes('vinho') || 
                    displayCategory.toLowerCase().includes('porto') || 
                    displayCategory.toLowerCase().includes('wine') ||
                    (product.alcohol_content !== undefined && product.alcohol_content > 0);

  // Filter 4 related products from the same category, excluding the current product
  const relatedProducts = allProducts
    ? allProducts
        .filter(p => p.category_id === product.category_id && p.id !== product.id)
        .slice(0, 4)
    : [];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Breadcrumbs / Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-red transition-colors mb-12"
      >
        <ArrowLeft size={16} /> Voltar à Loja
      </button>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
        {/* Gallery Section with Premium Hover Zoom & Lightbox trigger */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2"
        >
          <div 
            onClick={() => setShowLightbox(true)}
            className="aspect-[4/5] bg-white flex items-center justify-center p-12 overflow-hidden border border-gray-100 shadow-sm rounded-sm cursor-zoom-in relative group"
          >
            <motion.img 
              layoutId={`product-image-${product.id}`}
              src={product.image} 
              alt={displayName}
              className="h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
            {/* Elegant overlay hint */}
            <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/5 flex items-center justify-center transition-colors">
              <span className="opacity-0 group-hover:opacity-100 bg-white/95 text-brand-charcoal text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 shadow-md transition-opacity duration-300 rounded-sm">
                Clique para ampliar
              </span>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-1/2 flex flex-col pt-4"
        >
          <div className="flex justify-between items-start mb-4">
             <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gold">{displayCategory}</span>
             <button 
               onClick={handleShare}
               className="text-gray-300 hover:text-brand-red transition-colors p-1 rounded-full hover:bg-gray-50"
               title="Partilhar Produto"
             >
               <Share2 size={18} />
             </button>
          </div>

          <h1 className="text-5xl font-serif text-brand-charcoal mb-4 leading-tight">{displayName}</h1>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < (product.rating || 5) ? "fill-brand-gold text-brand-gold" : "text-gray-200"} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-sans tracking-wide">Ref: {product.sku || `${product.id.substring(0, 5).toUpperCase()}-PT`}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? 'Em Stock' : 'Esgotado'}
              </span>
            </div>
          </div>

          <p className="text-3xl font-light text-brand-charcoal mb-8">{formattedPrice}</p>

          {/* Quick specs preview block */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm border-y border-gray-100 py-6 mb-8">
              {specs.slice(0, 3).map((spec, index) => (
                <div key={index}>
                  <span className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">{spec.label}</span>
                  <span className="font-sans text-brand-charcoal font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Add to Cart Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <div className={`flex items-center border border-gray-200 h-14 ${product.stock <= 0 ? 'opacity-50 pointer-events-none' : ''}`}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-6 h-full hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1 || product.stock <= 0}
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center font-sans font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-6 h-full hover:bg-gray-50 transition-colors"
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
            </div>
            
            <button 
              onClick={() => product.stock > 0 && onAddToCart(product, quantity)}
              disabled={product.stock <= 0}
              className={`flex-1 text-white h-14 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm ${product.stock > 0 ? 'bg-brand-red hover:bg-brand-red/90' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              <ShoppingBag size={18} /> {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
            </button>
          </div>

          {/* Interactive Information Tabs */}
          <div className="border-t border-gray-100 pt-8">
             <div className="flex gap-8 mb-8 border-b border-gray-100 pb-2">
                <button 
                  onClick={() => setActiveTab('descricao')}
                  className={`text-xs font-bold tracking-widest uppercase pb-2 transition-all border-b-2 ${activeTab === 'descricao' ? 'border-brand-red text-brand-charcoal' : 'border-transparent text-gray-400 hover:text-brand-charcoal'}`}
                >
                  Descrição
                </button>
                <button 
                  onClick={() => setActiveTab('especificacoes')}
                  className={`text-xs font-bold tracking-widest uppercase pb-2 transition-all border-b-2 ${activeTab === 'especificacoes' ? 'border-brand-red text-brand-charcoal' : 'border-transparent text-gray-400 hover:text-brand-charcoal'}`}
                >
                  Ficha Técnica
                </button>
                <button 
                  onClick={() => setActiveTab('envio')}
                  className={`text-xs font-bold tracking-widest uppercase pb-2 transition-all border-b-2 ${activeTab === 'envio' ? 'border-brand-red text-brand-charcoal' : 'border-transparent text-gray-400 hover:text-brand-charcoal'}`}
                >
                  Envio & Embalagem
                </button>
             </div>

             {/* Tab Content Display */}
             <div className="min-h-[150px]">
               {activeTab === 'descricao' && (
                 <div 
                   className="text-gray-600 leading-relaxed font-sans text-sm animate-in fade-in duration-300"
                   dangerouslySetInnerHTML={{ __html: product.description || "Uma expressão sublime do terroir excecional da região. Este exemplar destaca-se pela sua estrutura refinada, equilíbrio impecável e um final longo e persistente que cativa os sentidos mais exigentes." }}
                 />
               )}

               {activeTab === 'especificacoes' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 max-w-xl animate-in fade-in duration-300">
                   {specs.length > 0 ? (
                     specs.map((spec, index) => (
                       <div key={index} className="flex justify-between py-2.5 border-b border-gray-100 font-sans text-sm">
                         <span className="font-semibold text-gray-400 text-xs uppercase tracking-wider">{spec.label}</span>
                         <span className="font-medium text-brand-charcoal">{spec.value}</span>
                       </div>
                     ))
                   ) : (
                     <p className="text-xs text-gray-400 italic">Especificações não disponíveis para este produto.</p>
                   )}
                 </div>
               )}

               {activeTab === 'envio' && (
                 <div className="space-y-4 max-w-xl font-sans text-sm text-gray-600 leading-relaxed animate-in fade-in duration-300">
                   <p>
                     Garantimos que as suas garrafas e produtos gourmet chegam em perfeitas condições. Utilizamos <strong>embalagens certificadas de alta resistência térmica e anti-choque</strong> de forma a mitigar qualquer risco no transporte.
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                     <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-sm">
                       <h4 className="font-bold text-brand-charcoal text-[10px] uppercase tracking-wider mb-2 text-brand-gold">Portugal Continental</h4>
                       <ul className="space-y-1 text-xs text-gray-500">
                         <li>• Entrega rápida em 24h/48h úteis</li>
                         <li>• Envio via CTT Expresso Segurado</li>
                         <li>• Envio Grátis em compras superiores a 150€</li>
                       </ul>
                     </div>
                     <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-sm">
                       <h4 className="font-bold text-brand-charcoal text-[10px] uppercase tracking-wider mb-2 text-brand-gold">Europa & Ilhas</h4>
                       <ul className="space-y-1 text-xs text-gray-500">
                         <li>• Açores e Madeira: 3 a 5 dias úteis</li>
                         <li>• Europa Comunitária: 4 a 7 dias úteis</li>
                         <li>• Embalagens reforçadas para exportação</li>
                       </ul>
                     </div>
                   </div>
                 </div>
               )}
             </div>

             {isAlcohol && (
               <div className="mt-12 pt-6 border-t border-gray-100">
                 <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-brand-red/70">
                   Seja responsável. Beba com moderação. A venda de bebidas alcoólicas é proibida a menores de 18 anos.
                 </p>
               </div>
             )}
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-serif text-brand-charcoal text-center mb-2">Poderá Também Gostar</h2>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-gold text-center mb-12">Uma Seleção Exclusiva de Vinhos e Gourmet Relacionados</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(related => (
              <ProductCard 
                key={related.id}
                {...related}
                onSelect={onSelectProduct}
                onAddToCart={(p) => onAddToCart(p, 1)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-brand-charcoal/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setShowLightbox(false)}
          >
            <button 
              className="absolute top-6 right-6 text-white hover:text-brand-red transition-colors p-2 z-10"
              onClick={() => setShowLightbox(false)}
            >
              <X size={28} />
            </button>
            <motion.img 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              src={product.image} 
              alt={displayName}
              className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl rounded-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Link Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[100] bg-brand-charcoal text-white px-6 py-4 rounded-sm shadow-2xl flex items-center gap-3 border border-white/10 font-sans text-xs tracking-wider uppercase font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-ping"></span>
            Link do produto copiado!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
