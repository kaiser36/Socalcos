import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 md:left-auto md:w-[400px] z-[90] bg-brand-charcoal text-white p-8 shadow-2xl rounded-sm border border-white/10"
        >
          <div className="flex items-start gap-4">
            <div className="text-brand-gold">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-widest uppercase">Privacidade e Cookies</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Utilizamos cookies para melhorar a sua experiência e garantir o funcionamento seguro do site. 
                Ao continuar, aceita a nossa política de privacidade.
              </p>
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={handleAccept}
                  className="bg-white text-brand-charcoal px-6 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-brand-gold transition-all"
                >
                  Aceitar Todos
                </button>
                <button 
                  onClick={() => setShow(false)}
                  className="text-white/50 hover:text-white px-2 py-3 text-[10px] font-bold tracking-widest uppercase transition-all"
                >
                  Configurar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
