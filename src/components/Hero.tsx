import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onNavigate: (page: 'home' | 'store' | 'about') => void;
  backgroundImage?: string;
}

export default function Hero({ onNavigate, backgroundImage = '/images/hero-banner.jpg' }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background with parallax effect simulation */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-5xl md:text-7xl font-medium tracking-tight mb-6 max-w-4xl"
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-lg md:text-xl font-light mb-10 max-w-2xl text-white/90 leading-relaxed font-sans"
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.button
          onClick={() => onNavigate('store')}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-red text-white px-10 py-4 text-sm font-semibold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all shadow-lg"
        >
          {t('hero.button')}
        </motion.button>
      </div>
    </section>
  );
}
