import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { Wine, Gift, Users, Clock, Sparkles, RefreshCw, Flame, Utensils, Compass } from 'lucide-react';

interface WineQuizProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

interface Question {
  id: number;
  key: string;
  icon: any;
  options: {
    value: string;
    labelKey: string;
    icon: any;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    key: 'occasion',
    icon: Sparkles,
    options: [
      { value: 'romantic', labelKey: 'quiz.q1.o1', icon: Flame },
      { value: 'friends', labelKey: 'quiz.q1.o2', icon: Users },
      { value: 'relax', labelKey: 'quiz.q1.o3', icon: Clock },
      { value: 'gift', labelKey: 'quiz.q1.o4', icon: Gift },
    ],
  },
  {
    id: 2,
    key: 'pairing',
    icon: Utensils,
    options: [
      { value: 'meat', labelKey: 'quiz.q2.o1', icon: Wine },
      { value: 'fish', labelKey: 'quiz.q2.o2', icon: Wine },
      { value: 'cheese', labelKey: 'quiz.q2.o3', icon: Wine },
      { value: 'sweet', labelKey: 'quiz.q2.o4', icon: Wine },
    ],
  },
  {
    id: 3,
    key: 'profile',
    icon: Compass,
    options: [
      { value: 'bold', labelKey: 'quiz.q3.o1', icon: Sparkles },
      { value: 'fresh', labelKey: 'quiz.q3.o2', icon: Sparkles },
      { value: 'sweet', labelKey: 'quiz.q3.o3', icon: Sparkles },
    ],
  },
];

// Organoleptic and Visual Profiles for Products
interface SensoryProfile {
  corpo: number;      // 0 to 5
  taninos: number;    // 0 to 5
  acidez: number;     // 0 to 5
  alcool: number;     // 0 to 5
  aroma: number;      // 0 to 5
  color: string;      // Wine color hex
  streamColor: string;// Stream pouring color hex
  tastingNotePt: string;
  tastingNoteEn: string;
}

const WINE_PROFILES: Record<string, SensoryProfile> = {
  '1': { // Graham's 20 Year Old Tawny
    corpo: 4.8, taninos: 1.5, acidez: 3.2, alcool: 5.0, aroma: 4.8,
    color: '#8A1C14', streamColor: '#C42B1C',
    tastingNotePt: 'Cor âmbar dourada rica. Aromas complexos de frutos secos combinados com casca de laranja e mel.',
    tastingNoteEn: 'Rich golden amber color. Complex nutty aromas combined with orange peel and honey.'
  },
  '2': { // Quinta do Vallado Reserva
    corpo: 4.6, taninos: 4.2, acidez: 3.5, alcool: 4.5, aroma: 4.0,
    color: '#4A0D17', streamColor: '#7209B7',
    tastingNotePt: 'Vinho tinto de grande complexidade com taninos maduros e final persistente de frutos silvestres e carvalho.',
    tastingNoteEn: 'Red wine of great complexity with ripe tannins and a persistent finish of wild berries and oak.'
  },
  '3': { // The Macallan 12 Years
    corpo: 3.8, taninos: 0.2, acidez: 1.8, alcool: 5.0, aroma: 4.5,
    color: '#D48C47', streamColor: '#EAA15F',
    tastingNotePt: 'Whisky single malt envelhecido em cascos temperados com xerez. Notas de caramelo e baunilha.',
    tastingNoteEn: 'Single malt whisky aged in sherry-seasoned casks. Notes of butterscotch and vanilla.'
  },
  '4': { // Gin Mare Mediterranean
    corpo: 1.2, taninos: 0.0, acidez: 4.0, alcool: 5.0, aroma: 3.8,
    color: '#E0F2FE', streamColor: '#BAE6FD',
    tastingNotePt: 'Gin premium límpido e herbáceo com botânicos mediterrânicos como alecrim, manjericão e azeitona.',
    tastingNoteEn: 'Clear and herbal premium gin with Mediterranean botanicals such as rosemary, basil, and olive.'
  },
  '5': { // Taylor's Vintage Port
    corpo: 5.0, taninos: 4.8, acidez: 3.8, alcool: 5.0, aroma: 5.0,
    color: '#310007', streamColor: '#580A14',
    tastingNotePt: 'Porto Vintage sublime, concentrado e monumental. Grande estrutura tânica com aroma de frutas pretas maduras.',
    tastingNoteEn: 'Sublime, concentrated, and monumental Vintage Port. Great tannic structure with black fruit aromas.'
  },
  '6': { // Herdade do Esporão Reserva
    corpo: 4.2, taninos: 3.8, acidez: 3.4, alcool: 4.2, aroma: 3.6,
    color: '#5C0612', streamColor: '#800F2F',
    tastingNotePt: 'Vinho tinto alentejano clássico, estruturado e equilibrado. Aromas de fruta preta madura e madeira.',
    tastingNoteEn: 'Classic Alentejo red wine, structured and balanced. Aromas of ripe black fruit and wood.'
  },
  '7': { // Queijo Serra da Estrela DOP
    corpo: 4.5, taninos: 0.0, acidez: 2.2, alcool: 0.0, aroma: 4.2,
    color: '#FFFBEB', streamColor: '#FDE68A',
    tastingNotePt: 'Queijo amanteigado e aveludado com sabor rico, par ideal para os grandes vinhos da nossa gama.',
    tastingNoteEn: 'Creamy and buttery cheese with a rich flavor, a perfect match for the fine wines of our range.'
  },
  '8': { // Compota de Figo com Vinho do Porto
    corpo: 3.0, taninos: 0.0, acidez: 2.8, alcool: 1.2, aroma: 4.5,
    color: '#631D36', streamColor: '#A21CAF',
    tastingNotePt: 'Doce artesanal rico com a doçura do figo premium e a complexidade do Vinho do Porto.',
    tastingNoteEn: 'Rich artisanal jam with premium fig sweetness and the complexity of Port Wine.'
  }
};

const DEFAULT_PROFILE: SensoryProfile = {
  corpo: 3.0, taninos: 3.0, acidez: 3.0, alcool: 3.0, aroma: 3.0,
  color: '#8A1C14', streamColor: '#C42B1C',
  tastingNotePt: 'Produto equilibrado com excelentes notas sensoriais.',
  tastingNoteEn: 'Balanced product with excellent sensory notes.'
};

const localTranslations = {
  pt: {
    sommelierTitle: 'O Seu Sommelier Digital',
    sommelierIntro: 'Descubra a combinação perfeita. Responda a 3 breves questões e o nosso sommelier criará o seu perfil sensorial em tempo real.',
    startBtn: 'INICIAR CONSULTA',
    sensoryAnalysis: 'Análise Sensorial',
    body: 'Corpo',
    tannins: 'Taninos',
    acidity: 'Acidez',
    alcohol: 'Álcool',
    aroma: 'Aroma/Doçura',
    pouringText: 'A verter...',
    selectPrompt: 'Selecione uma recomendação para analisar o perfil organolético',
    btnLabel: 'Escolha do Sommelier',
    radarTitle: 'Perfil Organolético',
    matchingRating: 'Afinidade Sensorial',
  },
  en: {
    sommelierTitle: 'Your Digital Sommelier',
    sommelierIntro: 'Discover the perfect match. Answer 3 quick questions and our sommelier will create your sensory profile in real-time.',
    startBtn: 'START CONSULTATION',
    sensoryAnalysis: 'Sensory Analysis',
    body: 'Body',
    tannins: 'Tannins',
    acidity: 'Acidity',
    alcohol: 'Alcohol',
    aroma: 'Aroma/Sweetness',
    pouringText: 'Pouring...',
    selectPrompt: 'Select a recommendation to analyze organoleptic profile',
    btnLabel: 'Sommelier\'s Pick',
    radarTitle: 'Organoleptic Profile',
    matchingRating: 'Sensory Match',
  }
};

// WineGlass SVG Visualizer Component
function WineGlass({ color, streamColor, triggerPour }: { color: string, streamColor: string, triggerPour: boolean }) {
  const [fillHeight, setFillHeight] = useState(0);
  const [pourVisible, setPourVisible] = useState(false);

  useEffect(() => {
    if (triggerPour) {
      setPourVisible(true);
      setFillHeight(0);
      const timer1 = setTimeout(() => {
        setFillHeight(45);
      }, 150);
      const timer2 = setTimeout(() => {
        setPourVisible(false);
      }, 1200);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setFillHeight(45);
      setPourVisible(false);
    }
  }, [triggerPour, color]);

  return (
    <div className="relative w-36 h-56 mx-auto flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 160">
        <defs>
          <clipPath id="glass-bowl-clip">
            <path d="M 28 20 C 28 85, 72 85, 72 20 C 72 15, 28 15, 28 20 Z" />
          </clipPath>
        </defs>

        {/* Liquid under clip path */}
        <g clipPath="url(#glass-bowl-clip)">
          <motion.rect
            x="20"
            y={120}
            width="60"
            height="100"
            fill={color}
            animate={{
              y: 85 - fillHeight
            }}
            transition={{ type: "spring", stiffness: 45, damping: 12 }}
          />
          {/* Wavy surface */}
          <motion.path
            d="M 20 0 Q 35 -3, 50 0 T 80 0 L 80 15 L 20 15 Z"
            fill={color}
            animate={{
              y: 85 - fillHeight - 1,
              x: [0, -4, 0]
            }}
            transition={{
              y: { type: "spring", stiffness: 45, damping: 12 },
              x: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
            }}
          />
        </g>

        {/* Pouring stream */}
        {pourVisible && (
          <motion.line
            x1="50"
            y1="5"
            x2="50"
            y2={85 - fillHeight + 10}
            stroke={streamColor}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ strokeDasharray: "10, 150", strokeDashoffset: 100 }}
            animate={{ strokeDasharray: "150, 10", strokeDashoffset: 0 }}
            transition={{ duration: 0.8, ease: "easeIn" }}
          />
        )}

        {/* Glass outline */}
        <path
          d="M 28 15 L 28 20 C 28 85, 72 85, 72 20 L 72 15"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
        />
        {/* Stem */}
        <line
          x1="50"
          y1="82"
          x2="50"
          y2="135"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2.5"
        />
        {/* Base */}
        <path
          d="M 32 135 Q 50 132, 68 135 Q 50 140, 32 135"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

// Radar Chart Component (with larger viewBox to prevent label clipping)
function RadarChart({ profile, language }: { profile: SensoryProfile, language: 'pt' | 'en' }) {
  const center = 120;
  const maxVal = 5;
  const radius = 55;
  const labelT = (key: keyof typeof localTranslations.pt) => localTranslations[language][key];

  const axes = [
    { key: 'corpo', label: labelT('body') },
    { key: 'taninos', label: labelT('tannins') },
    { key: 'acidez', label: labelT('acidity') },
    { key: 'alcool', label: labelT('alcohol') },
    { key: 'aroma', label: labelT('aroma') },
  ];

  // Calculate coordinates for the value polygon
  const points = axes.map((axis, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const val = profile[axis.key as keyof SensoryProfile] as number || 0;
    const r = (val / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Grid Rings (1 to 5)
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
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Increased viewBox to 240x240 for 20px padding all around */}
      <svg className="w-full h-full overflow-visible" viewBox="0 0 240 240">
        {/* Draw concentric rings */}
        {gridRings.map((ringPoints, idx) => (
          <polygon
            key={idx}
            points={ringPoints}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="0.8"
          />
        ))}

        {/* Draw spider axes lines */}
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
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="0.8"
            />
          );
        })}

        {/* Filled sensory area */}
        <motion.polygon
          points={points}
          fill="rgba(196, 43, 28, 0.25)"
          stroke="#C42B1C"
          strokeWidth="1.5"
          animate={{ points }}
          transition={{ type: "spring", stiffness: 45, damping: 12 }}
        />

        {/* Anchor circles */}
        {axes.map((axis, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const val = profile[axis.key as keyof SensoryProfile] as number || 0;
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
              stroke="#C42B1C"
              strokeWidth="1.2"
              animate={{ cx: x, cy: y }}
              transition={{ type: "spring", stiffness: 45, damping: 12 }}
            />
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const labelDist = radius + 15;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle) + 3;

          let textAnchor = "middle";
          if (Math.cos(angle) > 0.15) textAnchor = "start";
          else if (Math.cos(angle) < -0.15) textAnchor = "end";

          return (
            <text
              key={i}
              x={x}
              y={y}
              fill="rgba(255, 255, 255, 0.65)"
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

export default function WineQuiz({ products, onSelectProduct, onAddToCart }: WineQuizProps) {
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1-3: questions, 4: results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);
  const [activeResultIdx, setActiveResultIdx] = useState(0);
  const [triggerPour, setTriggerPour] = useState(false);

  const localT = (key: keyof typeof localTranslations.pt) => {
    return localTranslations[language === 'en' ? 'en' : 'pt'][key];
  };

  const handleStart = () => {
    setAnswers({});
    setDirection(1);
    setCurrentStep(1);
  };

  const handleSelectOption = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setDirection(-1);
    setCurrentStep(0);
    setActiveResultIdx(0);
  };

  const getRecommendations = (): Product[] => {
    if (products.length === 0) return [];

    const scored = products
      .filter(p => p.published)
      .map(product => {
        let score = 0;
        const nameLower = product.name.toLowerCase();
        const descLower = (product.description || '').toLowerCase();
        const regionLower = (product.region || '').toLowerCase();
        const catLower = (product.category || '').toLowerCase();

        // 1. Occasion
        if (answers.occasion === 'gift') {
          if (product.price > 45) score += 3;
          if (nameLower.includes('vintage') || nameLower.includes('old') || nameLower.includes('macallan')) score += 3;
        } else if (answers.occasion === 'romantic') {
          if (product.price > 25 && product.price <= 55) score += 2;
          if (nameLower.includes('reserva') || nameLower.includes('tawny') || nameLower.includes('vintage')) score += 2;
        } else if (answers.occasion === 'friends') {
          if (product.price < 35) score += 2;
        }

        // 2. Pairing
        if (answers.pairing === 'meat') {
          if (nameLower.includes('tinto') || descLower.includes('tinto') || descLower.includes('red wine')) score += 4;
          if (regionLower.includes('douro') || regionLower.includes('alentejo')) score += 2;
          if (nameLower.includes('reserva')) score += 2;
        } else if (answers.pairing === 'fish') {
          if (nameLower.includes('branco') || descLower.includes('branco') || nameLower.includes('verde') || nameLower.includes('alvarinho')) score += 4;
          if (product.alcohol_content && product.alcohol_content < 13.5) score += 2;
        } else if (answers.pairing === 'cheese') {
          if (nameLower.includes('porto') || nameLower.includes('tawny') || nameLower.includes('vintage')) score += 4;
          if (catLower.includes('gourmet') || nameLower.includes('queijo') || descLower.includes('queijo')) score += 3;
        } else if (answers.pairing === 'sweet') {
          if (nameLower.includes('porto') || nameLower.includes('tawny') || nameLower.includes('vintage') || nameLower.includes('compota')) score += 4;
        }

        // 3. Flavor Profile
        if (answers.profile === 'bold') {
          if (product.alcohol_content && product.alcohol_content >= 13.5) score += 3;
          if (nameLower.includes('reserva') || descLower.includes('encorpado') || descLower.includes('estruturado')) score += 3;
        } else if (answers.profile === 'fresh') {
          if (product.alcohol_content && product.alcohol_content < 13) score += 3;
          if (nameLower.includes('branco') || nameLower.includes('verde') || descLower.includes('fresco') || descLower.includes('leve')) score += 3;
        } else if (answers.profile === 'sweet') {
          if (nameLower.includes('porto') || nameLower.includes('tawny') || nameLower.includes('compota') || nameLower.includes('doce')) score += 4;
        }

        return { product, score };
      });

    const sorted = scored.sort((a, b) => b.score - a.score);
    const seenNames = new Set<string>();
    const uniqueMatches: Product[] = [];

    for (const item of sorted) {
      const cleanName = item.product.name.trim().toLowerCase();
      if (!seenNames.has(cleanName)) {
        seenNames.add(cleanName);
        uniqueMatches.push(item.product);
      }
      if (uniqueMatches.length >= 3) break;
    }

    return uniqueMatches;
  };

  const recommendedWines = currentStep === 4 ? getRecommendations() : [];
  const selectedWine = recommendedWines[activeResultIdx];
  const sensoryProfile = selectedWine ? (WINE_PROFILES[selectedWine.id] || DEFAULT_PROFILE) : DEFAULT_PROFILE;

  // Trigger pouring animation on active selection change
  useEffect(() => {
    if (selectedWine) {
      setTriggerPour(true);
      const timer = setTimeout(() => setTriggerPour(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [activeResultIdx, selectedWine?.id]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0
    })
  };

  return (
    <section className="relative pt-24 pb-20 bg-[#0F0D0B] text-stone-100 border-t border-b border-stone-900 overflow-hidden font-sans">
      {/* Custom Styles for ProductCard overlays inside Sommelier section */}
      <style>{`
        .sommelier-products-container .text-brand-charcoal {
          color: #f5f5f4 !important; /* Stone-100 readable text */
        }
        .sommelier-products-container h3.text-brand-charcoal {
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          white-space: normal !important;
          display: block !important;
          -webkit-line-clamp: unset !important;
          line-clamp: unset !important;
          line-height: 1.3 !important;
          overflow: visible !important;
        }
        .sommelier-products-container p.text-brand-charcoal {
          font-weight: 700 !important;
          color: #B4975A !important; /* Brand Gold for readable price */
        }
        .sommelier-products-container .text-gray-500 {
          color: #a8a29e !important; /* Stone-400 for subtitles */
        }
        .sommelier-products-container div[class*="bg-white/50"],
        .sommelier-products-container div[class*="bg-white"] {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        .sommelier-products-container button {
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #f5f5f4 !important;
        }
        .sommelier-products-container button:hover {
          background-color: #720E1E !important; /* brand-red */
          border-color: #720E1E !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,28,20,0.08),transparent_75%)] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 0 && (
            <motion.div
              key="intro"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-center space-y-8 max-w-2xl mx-auto py-8"
            >
              <div className="w-20 h-20 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-brand-red/5">
                <Wine size={36} className="animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif tracking-wide text-white">
                  {localT('sommelierTitle')}
                </h2>
                <p className="text-stone-400 text-sm leading-relaxed max-w-md mx-auto">
                  {localT('sommelierIntro')}
                </p>
              </div>
              <button
                onClick={handleStart}
                className="bg-brand-red text-white px-12 py-4 text-xs font-bold tracking-[0.25em] uppercase rounded-sm hover:bg-brand-red/90 active:scale-95 transition-all shadow-xl shadow-brand-red/25"
              >
                {localT('startBtn')}
              </button>
            </motion.div>
          )}

          {(() => {
            const currentQuestion = currentStep >= 1 && currentStep <= 3 ? QUESTIONS[currentStep - 1] : null;
            const QuestionIcon = currentQuestion?.icon;
            return currentQuestion && (
              <motion.div
                key={`question-${currentStep}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="space-y-10 max-w-3xl mx-auto"
              >
                {/* Progress bar */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3 text-brand-red">
                    {QuestionIcon && <QuestionIcon size={18} />}
                    <span className="text-[10px] font-black tracking-widest uppercase text-brand-red">
                      {t('quiz.step')} {currentStep} {t('quiz.of')} 3
                    </span>
                  </div>
                  <div className="w-32 h-1 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-red transition-all duration-500"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Title */}
                <h3 className="text-2xl md:text-3xl font-serif text-white text-center tracking-wide">
                  {t(QUESTIONS[currentStep - 1].key === 'occasion' ? 'quiz.q1' : QUESTIONS[currentStep - 1].key === 'pairing' ? 'quiz.q2' : 'quiz.q3')}
                </h3>

                {/* Glassmorphic Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {QUESTIONS[currentStep - 1].options.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(QUESTIONS[currentStep - 1].key, opt.value)}
                        className="flex items-center gap-6 p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-brand-red/40 rounded-sm text-left transition-all duration-300 group shadow-md backdrop-blur-sm"
                      >
                        <div className="w-12 h-12 bg-white/[0.03] group-hover:bg-brand-red/10 text-stone-400 group-hover:text-brand-red rounded-full flex items-center justify-center transition-all duration-350 border border-white/5 group-hover:border-brand-red/20">
                          <Icon size={20} />
                        </div>
                        <span className="text-sm font-semibold text-stone-300 group-hover:text-white transition-colors">
                          {t(opt.labelKey)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}

          {currentStep === 4 && (
            <motion.div
              key="results"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-serif tracking-wide text-white">{t('quiz.results')}</h2>
                <p className="text-stone-400 text-sm max-w-md mx-auto leading-relaxed">
                  {t('quiz.resultsDesc')}
                </p>
              </div>

              {recommendedWines.length > 0 ? (
                <div className="flex flex-col gap-12 max-w-4xl mx-auto w-full">
                  
                  {/* Top Section: Interactive Sommelier Analysis (Wine glass & Radar chart side-by-side) */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-sm p-6 md:p-8 backdrop-blur-md flex flex-col items-center justify-center space-y-6 relative overflow-hidden shadow-2xl w-full">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-red/50 to-transparent" />
                    
                    <h4 className="text-xs font-bold tracking-[0.25em] uppercase text-brand-red mb-2">
                      {localT('sensoryAnalysis')}
                    </h4>
                    
                    {/* Visualizer Display - Glass and Radar Side-by-Side */}
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 w-full items-center justify-center py-2">
                      <div className="flex flex-col items-center justify-center">
                        <WineGlass
                          color={sensoryProfile.color}
                          streamColor={sensoryProfile.streamColor}
                          triggerPour={triggerPour}
                        />
                        <span className="text-[11px] text-stone-300 tracking-wider uppercase font-semibold mt-4 text-center max-w-[180px] truncate block">
                          {triggerPour ? localT('pouringText') : selectedWine.name}
                        </span>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center overflow-visible">
                        <RadarChart profile={sensoryProfile} language={language} />
                      </div>
                    </div>

                    {/* Tasting note description box */}
                    <div className="w-full bg-black/30 border border-white/5 rounded-sm p-4 text-center max-w-2xl mx-auto">
                      <span className="text-[9px] font-black tracking-widest text-brand-red uppercase block mb-1">
                        {localT('radarTitle')}
                      </span>
                      <p className="text-xs text-stone-300 italic leading-relaxed">
                        "{language === 'en' ? sensoryProfile.tastingNoteEn : sensoryProfile.tastingNotePt}"
                      </p>
                    </div>
                  </div>

                  {/* Bottom Section: Recommendations List (3 columns spanning full width of container) */}
                  <div className="sommelier-products-container w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {recommendedWines.map((wine, idx) => {
                        const isActive = idx === activeResultIdx;
                        return (
                          <div
                            key={wine.id}
                            onMouseEnter={() => setActiveResultIdx(idx)}
                            onClick={() => onSelectProduct(wine.id)}
                            className={`cursor-pointer transition-all duration-300 relative rounded-sm p-2 flex flex-col justify-between ${
                              isActive
                                ? 'bg-white/[0.04] border border-brand-red/50 shadow-lg shadow-brand-red/5 scale-[1.02]'
                                : 'bg-white/[0.01] border border-white/5 opacity-75 hover:opacity-100 hover:bg-white/[0.02]'
                            }`}
                          >
                            {/* Active sommelier ribbon */}
                            {isActive && (
                              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-red text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full z-20 shadow-md">
                                {localT('btnLabel')}
                              </span>
                            )}
                            
                            {/* Removed pointer-events-none and added onClick trigger to card content */}
                            <div className="p-1 bg-transparent text-stone-100">
                              <ProductCard
                                {...wine}
                                onSelect={onSelectProduct}
                                onAddToCart={onAddToCart}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                <p className="text-center text-stone-500 font-sans italic">Não encontrámos produtos específicos, por favor tente novamente.</p>
              )}

              {/* Actions */}
              <div className="flex justify-center pt-8 border-t border-stone-900">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-stone-400 hover:text-brand-red transition-all active:scale-95"
                >
                  <RefreshCw size={14} /> {t('quiz.restart')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
