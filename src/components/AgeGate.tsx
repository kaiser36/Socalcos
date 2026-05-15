import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function AgeGate() {
  const [isOver18, setIsOver18] = useState<boolean | null>(null);

  useEffect(() => {
    const consent = localStorage.getItem('age-consent');
    if (consent === 'true') {
      setIsOver18(true);
    } else {
      setIsOver18(false);
    }
  }, []);

  const handleConfirm = () => {
    localStorage.setItem('age-consent', 'true');
    setIsOver18(true);
  };

  if (isOver18) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-brand-charcoal flex items-center justify-center px-6"
      >
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1506377247377-2a5b3b0ca7ec?auto=format&fit=crop&q=80" 
            className="w-full h-full object-cover"
            alt="Wine Background"
          />
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative bg-white p-12 md:p-20 max-w-2xl w-full text-center shadow-2xl rounded-sm"
        >
          <Logo variant="vertical" className="mx-auto mb-12 w-48" />
          
          <h2 className="text-3xl md:text-4xl font-serif text-brand-charcoal mb-6">
            Bem-vindo à Socalcos
          </h2>
          
          <p className="text-gray-500 font-sans mb-12 leading-relaxed">
            Para entrar no nosso site e explorar a nossa seleção de vinhos e gourmet, 
            deve confirmar que tem idade legal para consumo de bebidas alcoólicas 
            no seu país de residência.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={handleConfirm}
              className="bg-brand-red text-white px-12 py-5 text-sm font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all shadow-lg"
            >
              Sim, tenho mais de 18 anos
            </button>
            <button 
              onClick={() => window.location.href = 'https://www.google.com'}
              className="bg-gray-100 text-gray-500 px-12 py-5 text-sm font-bold tracking-widest uppercase rounded-sm hover:bg-gray-200 transition-all"
            >
              Não, sair
            </button>
          </div>

          <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Seja responsável. Beba com moderação.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
