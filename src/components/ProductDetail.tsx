import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Star, Share2, X, Check, Copy, Heart, Compass, Calendar, Shield, Landmark, Globe, Wine, Percent, Info, Scale, Loader2, Mail } from 'lucide-react';
import { Product } from '../types';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from './ProductCard';

const SENSORY_PROFILES = {
  tawny20: { corpo: 4.8, taninos: 1.5, acidez: 3.2, alcool: 5.0, aroma: 4.8 },
  reserva_tinto: { corpo: 4.6, taninos: 4.2, acidez: 3.5, alcool: 4.5, aroma: 4.0 },
  whisky: { corpo: 3.8, taninos: 0.2, acidez: 1.8, alcool: 5.0, aroma: 4.5 },
  gin: { corpo: 1.2, taninos: 0.0, acidez: 4.0, alcool: 5.0, aroma: 3.8 },
  vintage: { corpo: 5.0, taninos: 4.8, acidez: 3.8, alcool: 5.0, aroma: 5.0 },
  alentejo_red: { corpo: 4.2, taninos: 3.8, acidez: 3.4, alcool: 4.2, aroma: 3.6 },
  queijo: { corpo: 4.5, taninos: 0.0, acidez: 2.2, alcool: 0.0, aroma: 4.2 },
  compota: { corpo: 3.0, taninos: 0.0, acidez: 2.8, alcool: 1.2, aroma: 4.5 },
  white: { corpo: 2.8, taninos: 0.0, acidez: 4.2, alcool: 3.8, aroma: 4.0 },
  default: { corpo: 3.0, taninos: 3.0, acidez: 3.0, alcool: 3.0, aroma: 3.0 }
};

const getSensoryProfile = (product: Product) => {
  const nameLower = product.name.toLowerCase();
  
  if (nameLower.includes('20 anos') || nameLower.includes('20 year')) return SENSORY_PROFILES.tawny20;
  if (nameLower.includes('vintage') || nameLower.includes('lbv') || nameLower.includes('late bottled')) return SENSORY_PROFILES.vintage;
  if (nameLower.includes('10 anos') || nameLower.includes('10 year') || nameLower.includes('reserve') || nameLower.includes('reserva')) {
    return SENSORY_PROFILES.reserva_tinto;
  }
  if (nameLower.includes('white') || nameLower.includes('branco') || nameLower.includes('dry') || nameLower.includes('chip')) return SENSORY_PROFILES.white;
  if (nameLower.includes('whisky') || nameLower.includes('macallan')) return SENSORY_PROFILES.whisky;
  if (nameLower.includes('gin') && !nameLower.includes('ginja')) return SENSORY_PROFILES.gin;
  if (nameLower.includes('queijo')) return SENSORY_PROFILES.queijo;
  if (nameLower.includes('compota') || nameLower.includes('doce')) return SENSORY_PROFILES.compota;
  
  return SENSORY_PROFILES.default;
};

function DetailRadarChart({ profile, language }: { profile: { corpo: number; taninos: number; acidez: number; alcool: number; aroma: number }; language: 'pt' | 'en' }) {
  const center = 120;
  const maxVal = 5;
  const radius = 55;

  const labels = {
    pt: { corpo: 'Corpo', taninos: 'Taninos', acidez: 'Acidez', alcool: 'Álcool', aroma: 'Aroma/Doçura' },
    en: { corpo: 'Body', taninos: 'Tannins', acidez: 'Acidity', alcool: 'Alcohol', aroma: 'Aroma/Sweetness' }
  };

  const axes = [
    { key: 'corpo', label: labels[language === 'en' ? 'en' : 'pt'].corpo },
    { key: 'taninos', label: labels[language === 'en' ? 'en' : 'pt'].taninos },
    { key: 'acidez', label: labels[language === 'en' ? 'en' : 'pt'].acidez },
    { key: 'alcool', label: labels[language === 'en' ? 'en' : 'pt'].alcool },
    { key: 'aroma', label: labels[language === 'en' ? 'en' : 'pt'].aroma },
  ];

  const points = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const val = profile[axis.key as keyof typeof profile] || 0;
    const r = (val / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  const gridRings = [1, 2, 3, 4, 5].map((ringVal) => {
    return axes.map((_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const r = (ringVal / maxVal) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  });

  return (
    <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 240 240">
        {gridRings.map((ringPoints, idx) => (
          <polygon
            key={idx}
            points={ringPoints}
            fill="none"
            stroke="rgba(0, 0, 0, 0.08)"
            strokeWidth="0.8"
          />
        ))}

        {axes.map((_, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(0, 0, 0, 0.08)"
              strokeWidth="0.8"
            />
          );
        })}

        <motion.polygon
          points={points}
          fill="rgba(114, 14, 30, 0.15)"
          stroke="#720E1E"
          strokeWidth="1.5"
          animate={{ points }}
          transition={{ type: "spring", stiffness: 45, damping: 12 }}
        />

        {axes.map((axis, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const val = profile[axis.key as keyof typeof profile] || 0;
          const r = (val / maxVal) * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#FFFFFF"
              stroke="#720E1E"
              strokeWidth="1.2"
              animate={{ cx: x, cy: y }}
              transition={{ type: "spring", stiffness: 45, damping: 12 }}
            />
          );
        })}

        {axes.map((axis, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const labelDist = radius + 15;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle) + 3;

          let textAnchor: "start" | "end" | "middle" = "middle";
          if (Math.cos(angle) > 0.15) textAnchor = "start";
          else if (Math.cos(angle) < -0.15) textAnchor = "end";

          return (
            <text
              key={i}
              x={x}
              y={y}
              fill="rgba(45, 45, 45, 0.75)"
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="bold"
              textAnchor={textAnchor}
              className="tracking-wider uppercase"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

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
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isRequestingRestock, setIsRequestingRestock] = useState(false);
  const [restockRequested, setRestockRequested] = useState(false);

  const { language, t } = useLanguage();
  const formattedPrice = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(product.price);
  const displayCategory = categoryName || product.category || 'Gourmet';

  // Fix apostrophe typographical issue dynamically
  const displayName = ((language === 'en' && product.name_en) ? product.name_en : product.name).replace(/´/g, "'");
  const displayDescription = (language === 'en' && product.description_en) ? product.description_en : product.description;

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
          setIsWishlisted(list.includes(product.id));
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
  }, [user, product.id]);

  const handleWishlistToggle = () => {
    if (!user?.id) {
      alert('Por favor, inicie sessão para adicionar vinhos aos seus favoritos!');
      return;
    }
    const stored = localStorage.getItem(`socalcos_wishlist_${user.id}`);
    let list: string[] = [];
    if (stored) {
      try { list = JSON.parse(stored); } catch {}
    }
    const updated = list.includes(product.id) 
      ? list.filter(item => item !== product.id)
      : [...list, product.id];
    
    localStorage.setItem(`socalcos_wishlist_${user.id}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist-update'));
  };

  const handleRequestRestock = async () => {
    if (!user?.email) {
      alert('Por favor, inicie sessão para solicitar este produto.');
      return;
    }
    
    setIsRequestingRestock(true);
    try {
      const response = await fetch('/api/request-restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: user.user_metadata?.full_name || 'Cliente Registado',
          customer_email: user.email,
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku
        })
      });

      if (!response.ok) throw new Error('Falha ao enviar pedido');
      
      setRestockRequested(true);
      setTimeout(() => setRestockRequested(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao enviar o pedido. Tente novamente mais tarde.');
    } finally {
      setIsRequestingRestock(false);
    }
  };

  const specs = [
    { label: language === 'en' ? 'Region' : 'Região', value: product.region, icon: Compass },
    { label: language === 'en' ? 'Harvest' : 'Colheita', value: product.vintage || product.harvest, icon: Calendar },
    { label: language === 'en' ? 'Producer' : 'Produtor', value: product.producer, icon: Shield },
    { label: language === 'en' ? 'Estate / Winery' : 'Propriedade / Quinta', value: product.property, icon: Landmark },
    { label: language === 'en' ? 'Country' : 'País', value: language === 'en' && product.country === 'Portugal' ? 'Portugal' : product.country, icon: Globe },
    { label: language === 'en' ? 'Capacity' : 'Capacidade', value: product.capacity, icon: Wine },
    { label: language === 'en' ? 'Alcohol Content' : 'Teor Alcoólico', value: product.alcohol_content ? `${product.alcohol_content}% vol.` : null, icon: Percent },
    { label: language === 'en' ? 'Allergens' : 'Alergénios', value: language === 'en' && product.allergens?.toLowerCase().includes('contém sulfitos') ? 'Contains Sulfites' : product.allergens, icon: Info },
    { label: language === 'en' ? 'Weight' : 'Peso', value: product.weight ? `${product.weight} kg` : null, icon: Scale },
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
        <ArrowLeft size={16} /> {language === 'en' ? 'Back to Store' : 'Voltar à Loja'}
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
                {product.stock > 0 ? (language === 'en' ? 'In Stock' : 'Em Stock') : (language === 'en' ? 'Out of Stock' : 'Esgotado')}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-3xl font-light text-brand-charcoal">
              {product.show_price === false 
                ? (language === 'en' ? 'Price on request' : 'Sob consulta')
                : formattedPrice
              }
            </p>
            {product.show_price !== false && (
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-1.5">
                {language === 'en' 
                  ? `Includes VAT at ${product.tax_rate || (product.category_id === 'f6d05bbb-be25-4b3d-b87b-8c8aad3db1c2' ? 13 : 23)}%` 
                  : `Inclui IVA a ${product.tax_rate || (product.category_id === 'f6d05bbb-be25-4b3d-b87b-8c8aad3db1c2' ? 13 : 23)}%`
                }
              </p>
            )}
          </div>

          {/* Quick specs preview block */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm border-y border-gray-100 py-6 mb-8">
              {specs.slice(0, 3).map((spec, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center gap-1.5 mb-1 text-gray-400">
                    {spec.icon && <spec.icon size={12} className="text-brand-gold" />}
                    <span className="block text-[10px] font-bold tracking-widest uppercase">{spec.label}</span>
                  </div>
                  <span className="font-sans text-brand-charcoal font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Add to Cart Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            {product.show_price === false ? (
              <>
                <a
                  href={`https://wa.me/351919139639?text=${encodeURIComponent(
                    language === 'en'
                      ? `Olá, gostava de pedir uma cotação para o produto: ${displayName}`
                      : `Olá, gostava de pedir uma cotação para o produto: ${displayName}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-brand-red text-white h-14 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm hover:bg-brand-red/90 text-center leading-[56px]"
                >
                  {language === 'en' ? 'Request Quote' : 'Pedir Orçamento'}
                </a>
                {/* Favorite heart button */}
                <button 
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 border border-gray-200 hover:border-brand-red hover:text-brand-red flex items-center justify-center transition-all duration-300 rounded-sm ${isWishlisted ? 'text-brand-red border-brand-red bg-brand-red/5' : 'text-gray-400 hover:bg-gray-50'}`}
                  title={isWishlisted ? "Remover de favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart size={20} className={isWishlisted ? "fill-brand-red" : ""} />
                </button>
              </>
            ) : (
              <>
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
                
                {product.stock > 0 ? (
                  <button 
                    onClick={() => onAddToCart(product, quantity)}
                    className="flex-1 bg-brand-red text-white h-14 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm hover:bg-brand-red/90"
                  >
                    <ShoppingBag size={18} /> {t('store.addToCart')}
                  </button>
                ) : (
                  user ? (
                    <button 
                      onClick={handleRequestRestock}
                      disabled={isRequestingRestock || restockRequested}
                      className="flex-1 bg-brand-charcoal text-white h-14 flex items-center justify-center gap-3 text-xs font-bold tracking-[0.2em] uppercase transition-all rounded-sm hover:bg-brand-charcoal/90 disabled:opacity-50"
                      title={language === 'en' ? 'Request stock restock' : 'Solicitar reposição de stock'}
                    >
                      {isRequestingRestock ? <Loader2 size={18} className="animate-spin" /> : (restockRequested ? <Check size={18} /> : <Mail size={18} />)}
                      {isRequestingRestock ? (language === 'en' ? 'Sending...' : 'A Enviar...') : (restockRequested ? (language === 'en' ? 'Request Sent' : 'Pedido Enviado') : (language === 'en' ? 'Request Product' : 'Solicitar Produto'))}
                    </button>
                  ) : (
                    <div className="flex-1 bg-gray-100 text-gray-400 h-14 flex flex-col items-center justify-center rounded-sm">
                      <span className="text-xs font-bold tracking-[0.2em] uppercase">{language === 'en' ? 'Out of Stock' : 'Esgotado'}</span>
                      <span className="text-[9px] font-sans text-gray-500">{language === 'en' ? 'Log in to request' : 'Inicie sessão para solicitar'}</span>
                    </div>
                  )
                )}

                {/* Favorite heart button */}
                <button 
                  onClick={handleWishlistToggle}
                  className={`w-14 h-14 border border-gray-200 hover:border-brand-red hover:text-brand-red flex items-center justify-center transition-all duration-300 rounded-sm ${isWishlisted ? 'text-brand-red border-brand-red bg-brand-red/5' : 'text-gray-400 hover:bg-gray-50'}`}
                  title={isWishlisted ? "Remover de favoritos" : "Adicionar aos favoritos"}
                >
                  <Heart size={20} className={isWishlisted ? "fill-brand-red" : ""} />
                </button>
              </>
            )}
          </div>

          {/* Interactive Information Tabs */}
          <div className="border-t border-gray-100 pt-8">
             <div className="flex gap-8 mb-8 border-b border-gray-100 pb-2">
                <button 
                  onClick={() => setActiveTab('descricao')}
                  className={`text-xs font-bold tracking-widest uppercase pb-2 transition-all border-b-2 ${activeTab === 'descricao' ? 'border-brand-red text-brand-charcoal' : 'border-transparent text-gray-400 hover:text-brand-charcoal'}`}
                >
                  {language === 'en' ? 'Description' : 'Descrição'}
                </button>
                <button 
                  onClick={() => setActiveTab('especificacoes')}
                  className={`text-xs font-bold tracking-widest uppercase pb-2 transition-all border-b-2 ${activeTab === 'especificacoes' ? 'border-brand-red text-brand-charcoal' : 'border-transparent text-gray-400 hover:text-brand-charcoal'}`}
                >
                  {language === 'en' ? 'Technical Sheet' : 'Ficha Técnica'}
                </button>
                <button 
                  onClick={() => setActiveTab('envio')}
                  className={`text-xs font-bold tracking-widest uppercase pb-2 transition-all border-b-2 ${activeTab === 'envio' ? 'border-brand-red text-brand-charcoal' : 'border-transparent text-gray-400 hover:text-brand-charcoal'}`}
                >
                  {language === 'en' ? 'Shipping & Packaging' : 'Envio & Embalagem'}
                </button>
             </div>

             {/* Tab Content Display */}
             <div className="min-h-[150px]">
               {activeTab === 'descricao' && (
                 <div 
                   className="text-gray-600 leading-relaxed font-sans text-sm animate-in fade-in duration-300"
                   dangerouslySetInnerHTML={{ __html: displayDescription || (language === 'en' ? "A sublime expression of the region's exceptional terroir. This vintage stands out for its refined structure, impeccable balance, and a long, persistent finish that captivates the most demanding senses." : "Uma expressão sublime do terroir excecional da região. Este exemplar destaca-se pela sua estrutura refinada, equilíbrio impecável e um final longo e persistente que cativa os sentidos mais exigentes.") }}
                 />
               )}

               {activeTab === 'especificacoes' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                    {/* Left column: specifications sheet */}
                    <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                      {specs.length > 0 ? (
                        specs.map((spec, index) => (
                          <div key={index} className="flex justify-between items-center py-2.5 border-b border-gray-100 font-sans text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              {spec.icon && <spec.icon size={14} className="text-brand-gold" />}
                              <span className="font-semibold text-xs uppercase tracking-wider">{spec.label}</span>
                            </div>
                            <span className="font-medium text-brand-charcoal">{spec.value}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 italic col-span-2">{language === 'en' ? 'Specifications not available for this product.' : 'Especificações não disponíveis para este produto.'}</p>
                      )}
                    </div>
                    
                    {/* Right column: organoleptic radar chart */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-100 rounded-sm">
                      <span className="text-[10px] font-black tracking-widest text-brand-red uppercase mb-4 block">
                        {language === 'en' ? 'Organoleptic Profile' : 'Perfil Organolético'}
                      </span>
                      <DetailRadarChart profile={getSensoryProfile(product)} language={language} />
                    </div>
                  </div>
                )}

               {activeTab === 'envio' && (
                 <div className="space-y-4 max-w-xl font-sans text-sm text-gray-600 leading-relaxed animate-in fade-in duration-300">
                   <p>
                     {language === 'en' ? 'We guarantee that your bottles and gourmet products arrive in perfect condition. We use certified high thermal and anti-shock packaging to mitigate transport risks.' : 'Garantimos que as suas garrafas e produtos gourmet chegam em perfeitas condições. Utilizamos embalagens certificadas de alta resistência térmica e anti-choque de forma a mitigar qualquer risco no transporte.'}
                   </p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                     <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-sm">
                       <h4 className="font-bold text-brand-charcoal text-[10px] uppercase tracking-wider mb-2 text-brand-gold">{language === 'en' ? 'Mainland Portugal' : 'Portugal Continental'}</h4>
                       <ul className="space-y-1 text-xs text-gray-500">
                         <li>• {language === 'en' ? 'Fast delivery in 24h/48h business hours' : 'Entrega rápida em 24h/48h úteis'}</li>
                         <li>• {language === 'en' ? 'In-store pickup available' : 'Levantamento em loja disponível'}</li>
                       </ul>
                     </div>
                     <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-sm">
                       <h4 className="font-bold text-brand-charcoal text-[10px] uppercase tracking-wider mb-2 text-brand-gold">{language === 'en' ? 'Europe & Islands' : 'Europa & Ilhas'}</h4>
                       <ul className="space-y-1 text-xs text-gray-500">
                         <li>• {language === 'en' ? 'Azores and Madeira: 3 to 5 business days' : 'Açores e Madeira: 3 a 5 dias úteis'}</li>
                         <li>• {language === 'en' ? 'Continental Europe: 4 to 7 business days' : 'Europa Comunitária: 4 a 7 dias úteis'}</li>
                         <li>• {language === 'en' ? 'Reinforced export packaging' : 'Embalagens reforçadas para exportação'}</li>
                       </ul>
                     </div>
                   </div>
                 </div>
               )}
             </div>

             {isAlcohol && (
               <div className="mt-12 pt-6 border-t border-gray-100">
                 <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-brand-red/70">
                   {language === 'en' ? 'Be responsible. Drink in moderation. Selling alcohol to minors under 18 is prohibited.' : 'Seja responsável. Beba com moderação. A venda de bebidas alcoólicas é proibida a menores de 18 anos.'}
                 </p>
               </div>
             )}
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-serif text-brand-charcoal text-center mb-2">{language === 'en' ? 'You May Also Like' : 'Poderá Também Gostar'}</h2>
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-brand-gold text-center mb-12">{language === 'en' ? 'An Exclusive Selection of Related Wines and Gourmet' : 'Uma Seleção Exclusiva de Vinhos e Gourmet Relacionados'}</p>
          
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
