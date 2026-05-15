import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronRight, Settings, Check } from 'lucide-react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytical: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      essential: true,
      analytical: true,
      marketing: true,
      date: new Date().toISOString()
    }));
    setShow(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      ...preferences,
      date: new Date().toISOString()
    }));
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 md:left-auto md:w-[450px] z-[90] bg-brand-charcoal text-white shadow-2xl rounded-sm border border-white/10 overflow-hidden"
        >
          {!showConfig ? (
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="text-brand-gold">
                  <ShieldCheck size={28} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold tracking-widest uppercase">Privacidade e Cookies</h4>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Utilizamos cookies para melhorar a sua experiência, analisar o tráfego e garantir o funcionamento seguro do site. 
                  </p>
                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      onClick={handleAcceptAll}
                      className="w-full bg-white text-brand-charcoal px-6 py-4 text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-brand-gold transition-all flex items-center justify-center gap-2 group"
                    >
                      Aceitar Todos <Check size={14} className="group-hover:scale-125 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setShowConfig(true)}
                      className="w-full bg-white/5 text-white/70 px-6 py-4 text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      Configurar Preferências <Settings size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-6">
              <header className="flex items-center justify-between border-b border-white/10 pb-4">
                <h4 className="text-xs font-bold tracking-widest uppercase">Definições de Cookies</h4>
                <button onClick={() => setShowConfig(false)} className="text-[10px] uppercase text-gray-400 hover:text-white">Voltar</button>
              </header>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {/* Essential */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1">Essenciais</h5>
                    <p className="text-[9px] text-gray-500">Necessários para o site funcionar.</p>
                  </div>
                  <div className="w-10 h-5 bg-brand-gold/30 rounded-full relative opacity-50 cursor-not-allowed">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-brand-gold rounded-full" />
                  </div>
                </div>

                {/* Analytical */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1">Analíticos</h5>
                    <p className="text-[9px] text-gray-500">Ajudam-nos a melhorar o site.</p>
                  </div>
                  <button 
                    onClick={() => setPreferences(p => ({...p, analytical: !p.analytical}))}
                    className={`w-10 h-5 rounded-full relative transition-colors ${preferences.analytical ? 'bg-brand-gold' : 'bg-gray-700'}`}
                  >
                    <motion.div 
                      animate={{ x: preferences.analytical ? 22 : 4 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
                    />
                  </button>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-sm">
                  <div>
                    <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1">Marketing</h5>
                    <p className="text-[9px] text-gray-500">Ofertas personalizadas para si.</p>
                  </div>
                  <button 
                    onClick={() => setPreferences(p => ({...p, marketing: !p.marketing}))}
                    className={`w-10 h-5 rounded-full relative transition-colors ${preferences.marketing ? 'bg-brand-gold' : 'bg-gray-700'}`}
                  >
                    <motion.div 
                      animate={{ x: preferences.marketing ? 22 : 4 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm" 
                    />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSavePreferences}
                className="w-full bg-brand-red text-white py-4 text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all shadow-lg"
              >
                Guardar Escolhas
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
