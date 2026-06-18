import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { Compass, Thermometer, Sun, Wind, Layers, ArrowUpRight } from 'lucide-react';

interface TerroirExplorerProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
}

interface CotaDetail {
  id: string;
  nameKey: 'cotaAlta' | 'cotaMedia' | 'cotaBaixa';
  altitudeRange: string;
  climatePt: string;
  climateEn: string;
  soilPt: string;
  soilEn: string;
  grapesPt: string;
  grapesEn: string;
  stylePt: string;
  styleEn: string;
  descriptionKey: 'cotaAltaDesc' | 'cotaMediaDesc' | 'cotaBaixaDesc';
}

const COTAS: CotaDetail[] = [
  {
    id: 'alta',
    nameKey: 'cotaAlta',
    altitudeRange: '> 350m - 700m',
    climatePt: 'Fresco, ventoso, com elevada amplitude térmica diária.',
    climateEn: 'Cool, breezy, with high daily temperature range.',
    soilPt: 'Xisto argiloso fragmentado com afloramentos graníticos.',
    soilEn: 'Fragmented clayey schist with granitic outcrops.',
    grapesPt: 'Rabigato, Gouveio, Viosinho, Alvarinho',
    grapesEn: 'Rabigato, Gouveio, Viosinho, Alvarinho',
    stylePt: 'Vinhos brancos frescos, acídulos, minerais e espumantes requintados.',
    styleEn: 'Fresh, acidic, mineral white wines and elegant sparkling wines.',
    descriptionKey: 'cotaAltaDesc'
  },
  {
    id: 'media',
    nameKey: 'cotaMedia',
    altitudeRange: '150m - 350m',
    climatePt: 'Moderado, excelente insolação, noites frescas.',
    climateEn: 'Moderate, excellent sunshine, cool nights.',
    soilPt: 'Xisto puro (folheado/placas), muito pedregoso e inclinado.',
    soilEn: 'Pure schist (foliated plates), very stony and steep.',
    grapesPt: 'Touriga Franca, Tinta Roriz, Touriga Nacional',
    grapesEn: 'Touriga Franca, Tinta Roriz, Touriga Nacional',
    stylePt: 'Vinhos tintos complexos, estruturados, encorpados e Porto Tawny Envelhecido.',
    styleEn: 'Complex, structured, full-bodied red wines and Aged Tawny Ports.',
    descriptionKey: 'cotaMediaDesc'
  },
  {
    id: 'baixa',
    nameKey: 'cotaBaixa',
    altitudeRange: '50m - 150m',
    climatePt: 'Muito quente, seco, com calor refletido pelo rio.',
    climateEn: 'Very hot, dry, with heat reflected by the river.',
    soilPt: 'Xisto decomposto, argilas finas e aluvião perto do leito.',
    soilEn: 'Decomposed schist, fine clay and alluvial deposits.',
    grapesPt: 'Touriga Nacional, Touriga Franca, Tinta Barroca',
    grapesEn: 'Touriga Nacional, Touriga Franca, Tinta Barroca',
    stylePt: 'Grandes vinhos do Porto Vintage, Late Bottled Vintage e tintos de grande concentração.',
    styleEn: 'Great Vintage Ports, Late Bottled Vintage Ports, and highly concentrated reds.',
    descriptionKey: 'cotaBaixaDesc'
  }
];

const localTranslations = {
  pt: {
    title: 'Viagem pelas Cotas do Terroir',
    subtitle: 'Explore as diferentes altitudes dos socalcos durienses e compreenda como a altitude e o xisto influenciam cada colheita.',
    cotaAlta: 'Altas Encostas (Cota Alta)',
    cotaMedia: 'Encostas Médias (Cota Média)',
    cotaBaixa: 'Junto ao Rio (Cota Baixa)',
    altitude: 'Altitude',
    climate: 'Microclima',
    soil: 'Geologia do Solo',
    grapes: 'Castas Recomendadas',
    wineStyle: 'Estilo de Vinho',
    matchingWines: 'Sugestões Deste Terroir',
    viewDetails: 'VER DETALHES',
    cotaAltaDesc: 'A altitudes elevadas, a brisa constante e a amplitude térmica preservam a acidez natural e os aromas florais delicados, ideais para brancos refrescantes.',
    cotaMediaDesc: 'É a cota de ouro para os tintos clássicos de guarda. O sol banha as encostas de xisto fragmentado, proporcionando maturação equilibrada e taninos aveludados.',
    cotaBaixaDesc: 'O calor retido no vale e refletido pela água do rio resulta em maturações intensas com elevada concentração de açúcares, a origem lendária dos vinhos do Porto Vintage.',
  },
  en: {
    title: 'Terroir Altitude Tour',
    subtitle: 'Explore the different altitudes of the Douro terraces and understand how altitude and schist influence each harvest.',
    cotaAlta: 'High Slopes (High Cota)',
    cotaMedia: 'Middle Slopes (Medium Cota)',
    cotaBaixa: 'Riverside (Low Cota)',
    altitude: 'Altitude',
    climate: 'Microclimate',
    soil: 'Soil Geology',
    grapes: 'Recommended Varieties',
    wineStyle: 'Wine Style',
    matchingWines: 'Recommendations From This Terroir',
    viewDetails: 'VIEW DETAILS',
    cotaAltaDesc: 'At high altitudes, constant breezes and thermal range preserve natural acidity and delicate floral aromas, perfect for refreshing white wines.',
    cotaMediaDesc: 'This is the golden altitude for classic aging red wines. The sun bathes the steep schist slopes, producing balanced ripening and velvet tannins.',
    cotaBaixaDesc: 'Heat trapped in the valley and reflected by the river yields intense ripeness and high sugar concentrations, the legendary origin of Vintage Port wines.',
  }
};

export default function TerroirExplorer({ products, onSelectProduct }: TerroirExplorerProps) {
  const { language } = useLanguage();
  const [selectedCotaId, setSelectedCotaId] = useState<string>('media');

  const localT = (key: keyof typeof localTranslations.pt) => {
    return localTranslations[language === 'en' ? 'en' : 'pt'][key];
  };

  const activeCota = COTAS.find(c => c.id === selectedCotaId) || COTAS[1];

  // Dynamic products filter with name-based deduplication
  const getMatchingProducts = (): Product[] => {
    if (!products || products.length === 0) return [];
    
    const seenNames = new Set<string>();
    const uniqueMatches: Product[] = [];
    
    const scored = products
      .filter(p => p.published)
      .map(product => {
        let score = 0;
        const nameLower = product.name.toLowerCase();
        const descLower = (product.description || '').toLowerCase();
        
        if (selectedCotaId === 'alta') {
          // Altitude Alta: White wines, dry white ports, light aromatic spirits or gourmet foods (excluding ginja)
          if (
            (nameLower.includes('white') || 
            nameLower.includes('branco') || 
            nameLower.includes('dry') || 
            nameLower.includes('chip') || 
            nameLower.includes('gin') || 
            nameLower.includes('queijo') || 
            nameLower.includes('compota') || 
            nameLower.includes('doce')) &&
            !nameLower.includes('ginja')
          ) {
            score += 5;
          }
        } else if (selectedCotaId === 'media') {
          // Altitude Media: Reservas, Standard Red/Tawny Ports, 10/20 Years
          if (
            nameLower.includes('10 anos') || 
            nameLower.includes('20 anos') || 
            nameLower.includes('reserve') || 
            nameLower.includes('reserva') || 
            nameLower.includes('tawny') ||
            descLower.includes('tinto') ||
            descLower.includes('red wine')
          ) {
            if (!nameLower.includes('30 anos') && !nameLower.includes('40 anos') && !nameLower.includes('very old')) {
              score += 5;
            } else {
              score += 1;
            }
          }
        } else if (selectedCotaId === 'baixa') {
          // Altitude Baixa: Vintage, Late Bottled Vintage, 30/40 Years, Single Harvest
          if (
            nameLower.includes('vintage') || 
            nameLower.includes('lbv') || 
            nameLower.includes('late bottled') || 
            nameLower.includes('30 anos') || 
            nameLower.includes('40 anos') || 
            nameLower.includes('very old') || 
            nameLower.includes('harvest') || 
            nameLower.includes('scion') ||
            nameLower.includes('1987') ||
            nameLower.includes('1855') ||
            nameLower.includes('1863') ||
            nameLower.includes('1965') ||
            nameLower.includes('1966') ||
            nameLower.includes('1968')
          ) {
            score += 5;
          }
        }
        
        return { product, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    // Deduplicate by name
    for (const item of scored) {
      const cleanName = item.product.name.trim().toLowerCase();
      if (!seenNames.has(cleanName)) {
        seenNames.add(cleanName);
        uniqueMatches.push(item.product);
      }
      if (uniqueMatches.length >= 3) break;
    }
    
    return uniqueMatches;
  };

  const matchingProducts = getMatchingProducts();

  return (
    <section className="relative py-24 bg-[#090807] text-stone-100 border-t border-b border-stone-900 overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(180,151,90,0.05),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-wide">
            {localT('title')}
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            {localT('subtitle')}
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Interactive SVG Hillside */}
          <div className="lg:col-span-6 bg-white/[0.01] border border-white/5 rounded-sm p-4 md:p-8 backdrop-blur-md flex items-center justify-center relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
            
            <svg className="w-full h-auto max-w-[420px]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Sun (Always visible, animates scale/rays) */}
              <g className="origin-[350px_50px]">
                <circle cx="350" cy="50" r="24" fill="#B4975A" className="opacity-80" />
                <motion.circle
                  cx="350"
                  cy="50"
                  r="32"
                  stroke="#B4975A"
                  strokeWidth="1.5"
                  strokeDasharray="4 8"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
              </g>

              {/* Wind lines at Cota Alta */}
              <AnimatePresence>
                {selectedCotaId === 'alta' && (
                  <g className="opacity-40">
                    <motion.path
                      d="M 20 40 Q 60 30, 100 40 T 180 40"
                      stroke="#BAE6FD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "10, 100", strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.path
                      d="M 10 65 Q 50 55, 90 65 T 160 65"
                      stroke="#BAE6FD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "10, 100", strokeDashoffset: 80 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    />
                  </g>
                )}
              </AnimatePresence>

              {/* Cota Alta Group (Mountain Top) */}
              <g 
                onClick={() => setSelectedCotaId('alta')}
                onMouseEnter={() => setSelectedCotaId('alta')}
                className="cursor-pointer group"
              >
                {/* Terrain Shape */}
                <path
                  d="M 0 160 L 50 140 L 90 140 L 140 100 L 190 100 L 260 50 L 320 50 L 320 160 L 0 160 Z"
                  fill={selectedCotaId === 'alta' ? 'rgba(180, 151, 90, 0.15)' : 'rgba(255, 255, 255, 0.02)'}
                  stroke={selectedCotaId === 'alta' ? '#B4975A' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={selectedCotaId === 'alta' ? '2.5' : '1.5'}
                  className="transition-all duration-350"
                />
                
                {/* Vines representation */}
                <circle cx="80" cy="120" r="2" fill={selectedCotaId === 'alta' ? '#B4975A' : '#78716c'} />
                <circle cx="160" cy="85" r="2" fill={selectedCotaId === 'alta' ? '#B4975A' : '#78716c'} />
                <circle cx="280" cy="40" r="2" fill={selectedCotaId === 'alta' ? '#B4975A' : '#78716c'} />

                {/* Text Indicator */}
                <text
                  x="200"
                  y="75"
                  fill={selectedCotaId === 'alta' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  className="tracking-wider uppercase transition-colors"
                >
                  Cota Alta
                </text>
              </g>

              {/* Cota Média Group (Slopes) */}
              <g 
                onClick={() => setSelectedCotaId('media')}
                onMouseEnter={() => setSelectedCotaId('media')}
                className="cursor-pointer group"
              >
                {/* Terrain Shape */}
                <path
                  d="M 0 160 L 320 160 L 320 260 L 240 260 L 180 280 L 120 280 L 60 300 L 0 300 Z"
                  fill={selectedCotaId === 'media' ? 'rgba(180, 151, 90, 0.15)' : 'rgba(255, 255, 255, 0.02)'}
                  stroke={selectedCotaId === 'media' ? '#B4975A' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={selectedCotaId === 'media' ? '2.5' : '1.5'}
                  className="transition-all duration-350"
                />

                {/* Schist layers (dashed lines) */}
                <path d="M 40 200 L 120 200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 160 220 L 280 220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3" />

                {/* Vines representation */}
                <circle cx="60" cy="180" r="2" fill={selectedCotaId === 'media' ? '#B4975A' : '#78716c'} />
                <circle cx="180" cy="210" r="2" fill={selectedCotaId === 'media' ? '#B4975A' : '#78716c'} />
                <circle cx="260" cy="190" r="2" fill={selectedCotaId === 'media' ? '#B4975A' : '#78716c'} />

                <text
                  x="180"
                  y="245"
                  fill={selectedCotaId === 'media' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  className="tracking-wider uppercase transition-colors"
                >
                  Cota Média
                </text>
              </g>

              {/* Cota Baixa Group (Riverside) */}
              <g 
                onClick={() => setSelectedCotaId('baixa')}
                onMouseEnter={() => setSelectedCotaId('baixa')}
                className="cursor-pointer group"
              >
                {/* Terrain Shape */}
                <path
                  d="M 0 300 L 60 300 L 120 280 L 180 280 L 240 260 L 320 260 L 320 340 L 0 340 Z"
                  fill={selectedCotaId === 'baixa' ? 'rgba(180, 151, 90, 0.15)' : 'rgba(255, 255, 255, 0.02)'}
                  stroke={selectedCotaId === 'baixa' ? '#B4975A' : 'rgba(255, 255, 255, 0.15)'}
                  strokeWidth={selectedCotaId === 'baixa' ? '2.5' : '1.5'}
                  className="transition-all duration-350"
                />

                {/* Vines representation */}
                <circle cx="30" cy="315" r="2" fill={selectedCotaId === 'baixa' ? '#B4975A' : '#78716c'} />
                <circle cx="140" cy="290" r="2" fill={selectedCotaId === 'baixa' ? '#B4975A' : '#78716c'} />
                <circle cx="220" cy="275" r="2" fill={selectedCotaId === 'baixa' ? '#B4975A' : '#78716c'} />

                <text
                  x="120"
                  y="325"
                  fill={selectedCotaId === 'baixa' ? '#ffffff' : 'rgba(255, 255, 255, 0.4)'}
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  className="tracking-wider uppercase transition-colors"
                >
                  Cota Baixa
                </text>
              </g>

              {/* Douro River at the bottom */}
              <g>
                {/* Wavy River fill */}
                <path
                  d="M 0 340 C 80 335, 120 345, 200 340 C 280 335, 320 345, 400 340 L 400 400 L 0 400 Z"
                  fill="rgba(180, 151, 90, 0.08)"
                />
                
                {/* Flowing Water line animation */}
                <motion.path
                  d="M -100 345 Q 50 335, 200 345 T 500 345"
                  stroke="#B4975A"
                  strokeWidth="2"
                  strokeOpacity="0.4"
                  fill="none"
                  animate={{ x: [0, 100, 0] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                />
                
                <text
                  x="150"
                  y="380"
                  fill="rgba(180, 151, 90, 0.4)"
                  fontSize="11"
                  fontStyle="italic"
                  fontFamily="serif"
                  className="tracking-widest uppercase text-center"
                >
                  Rio Douro
                </text>
              </g>
            </svg>
          </div>

          {/* Right: Cota Details and Matching Bottles */}
          <div className="lg:col-span-6 space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCota.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Badge Header */}
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-brand-gold" />
                  <span className="text-[10px] font-black tracking-[0.25em] uppercase text-brand-gold">
                    {localT(activeCota.nameKey)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-stone-300 text-sm leading-relaxed font-sans italic">
                  "{localT(activeCota.descriptionKey)}"
                </p>

                {/* Terroir Spec Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-stone-900 py-6">
                  
                  <div className="flex gap-3">
                    <Compass size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] font-black tracking-widest text-stone-500 uppercase">
                        {localT('altitude')}
                      </span>
                      <span className="text-xs text-stone-200 font-semibold">{activeCota.altitudeRange}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Thermometer size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] font-black tracking-widest text-stone-500 uppercase">
                        {localT('climate')}
                      </span>
                      <span className="text-xs text-stone-200 font-semibold">
                        {language === 'en' ? activeCota.climateEn : activeCota.climatePt}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Layers size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] font-black tracking-widest text-stone-500 uppercase">
                        {localT('soil')}
                      </span>
                      <span className="text-xs text-stone-200 font-semibold">
                        {language === 'en' ? activeCota.soilEn : activeCota.soilPt}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Sun size={18} className="text-brand-gold shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[9px] font-black tracking-widest text-stone-500 uppercase">
                        {localT('grapes')}
                      </span>
                      <span className="text-xs text-stone-200 font-semibold">
                        {language === 'en' ? activeCota.grapesEn : activeCota.grapesPt}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Wine Style Detail */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                  <span className="block text-[9px] font-black tracking-widest text-brand-gold uppercase mb-1">
                    {localT('wineStyle')}
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {language === 'en' ? activeCota.styleEn : activeCota.stylePt}
                  </p>
                </div>

                {/* Matching Bottles Sub-panel */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-400">
                    {localT('matchingWines')}
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {matchingProducts.length > 0 ? (
                      matchingProducts.map(product => {
                        const displayName = (language === 'en' && product.name_en) ? product.name_en : product.name;
                        const formattedPrice = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(product.price);
                        
                        return (
                          <div 
                            key={product.id}
                            onClick={() => onSelectProduct(product.id)}
                            className="group cursor-pointer flex gap-3 p-3 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-brand-gold/40 rounded-sm transition-all duration-300 items-center justify-between"
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={displayName} 
                                className="h-10 w-8 object-contain group-hover:scale-105 transition-transform" 
                              />
                              <div className="min-w-0">
                                <span className="block text-[11px] font-semibold text-stone-200 truncate group-hover:text-white transition-colors">
                                  {displayName}
                                </span>
                                <span className="block text-[10px] font-bold text-brand-gold">
                                  {formattedPrice}
                                </span>
                              </div>
                            </div>
                            <ArrowUpRight size={14} className="text-stone-500 group-hover:text-brand-gold transition-colors shrink-0" />
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-stone-500 italic col-span-3">Nenhum vinho encontrado para esta cota.</p>
                    )}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
