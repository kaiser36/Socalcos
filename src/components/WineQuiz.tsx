import { useState } from 'react';
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

export default function WineQuiz({ products, onSelectProduct, onAddToCart }: WineQuizProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1-3: questions, 4: results
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1); // 1: next, -1: prev

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
  };

  // Algoritmo de Pontuação e Recomendação
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

        // 1. Ocasão
        if (answers.occasion === 'gift') {
          if (product.price > 45) score += 3;
          if (nameLower.includes('vintage') || nameLower.includes('old') || nameLower.includes('macallan')) score += 3;
        } else if (answers.occasion === 'romantic') {
          if (product.price > 25 && product.price <= 55) score += 2;
          if (nameLower.includes('reserva') || nameLower.includes('tawny') || nameLower.includes('vintage')) score += 2;
        } else if (answers.occasion === 'friends') {
          if (product.price < 35) score += 2;
        }

        // 2. Harmonização
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

        // 3. Perfil de Sabor
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

    // Ordenar por pontuação e devolver as 3 melhores
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.product);
  };

  const recommendedWines = currentStep === 4 ? getRecommendations() : [];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <section className="pt-24 pb-16 bg-brand-offwhite border-t border-b border-gray-100 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait" custom={direction}>
          {currentStep === 0 && (
            <motion.div
              key="intro"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="text-center space-y-8"
            >
              <div className="w-20 h-20 bg-brand-red/5 text-brand-red rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Wine size={36} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-serif text-brand-charcoal">{t('quiz.title')}</h2>
                <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed font-sans">
                  {t('quiz.subtitle')}
                </p>
              </div>
              <button
                onClick={handleStart}
                className="bg-brand-red text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/10"
              >
                {t('hero.button')}
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
                className="space-y-8"
              >
                {/* Progresso */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3 text-brand-red">
                    {QuestionIcon && <QuestionIcon size={18} />}
                    <span className="text-[10px] font-black tracking-widest uppercase font-sans">
                      {t('quiz.step')} {currentStep} {t('quiz.of')} 3
                    </span>
                  </div>
                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-red transition-all duration-500"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Título da Pergunta */}
              <h3 className="text-2xl font-serif text-brand-charcoal text-center">
                {t(QUESTIONS[currentStep - 1].key === 'occasion' ? 'quiz.q1' : QUESTIONS[currentStep - 1].key === 'pairing' ? 'quiz.q2' : 'quiz.q3')}
              </h3>

              {/* Grelha de Opções */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {QUESTIONS[currentStep - 1].options.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectOption(QUESTIONS[currentStep - 1].key, opt.value)}
                      className="flex items-center gap-6 p-6 bg-white hover:bg-brand-red/5 border border-gray-100 hover:border-brand-red/30 rounded-sm text-left transition-all duration-300 group shadow-sm"
                    >
                      <div className="w-12 h-12 bg-gray-50 group-hover:bg-brand-red/10 text-gray-400 group-hover:text-brand-red rounded-full flex items-center justify-center transition-colors">
                        <Icon size={20} />
                      </div>
                      <span className="text-sm font-sans font-semibold text-brand-charcoal group-hover:text-brand-red transition-colors">
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
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-serif text-brand-charcoal">{t('quiz.results')}</h2>
                <p className="text-gray-500 text-sm font-sans max-w-md mx-auto leading-relaxed">
                  {t('quiz.resultsDesc')}
                </p>
              </div>

              {/* Exibição dos resultados */}
              {recommendedWines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {recommendedWines.map((wine) => (
                    <div key={wine.id} className="bg-white border border-gray-100 rounded-sm shadow-sm p-4 flex flex-col justify-between">
                      <ProductCard
                        {...wine}
                        onSelect={onSelectProduct}
                        onAddToCart={onAddToCart}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400 font-sans italic">Não encontrámos produtos específicos, por favor tente novamente.</p>
              )}

              {/* Ações */}
              <div className="flex justify-center pt-4 border-t border-gray-100">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-gray-400 hover:text-brand-red transition-colors"
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
