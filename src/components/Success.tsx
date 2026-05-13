import { motion } from 'motion/react';
import { CheckCircle, ArrowRight, Package, Home } from 'lucide-react';

interface SuccessProps {
  onGoHome: () => void;
  onGoStore: () => void;
}

export default function Success({ onGoHome, onGoStore }: SuccessProps) {
  const orderNumber = Math.floor(Math.random() * 90000) + 10000;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-xl w-full text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-red/5 rounded-full mb-10">
          <CheckCircle className="text-brand-red w-12 h-12" />
        </div>

        <h1 className="text-5xl font-serif text-brand-charcoal mb-6">Encomenda Realizada!</h1>
        <p className="text-lg text-gray-600 mb-12 font-sans px-4">
          Obrigado pela sua preferência. A sua encomenda <span className="font-bold text-brand-charcoal">#{orderNumber}</span> foi processada com sucesso e receberá um e-mail de confirmação em breve.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          <div className="p-8 border border-gray-100 bg-white shadow-sm flex flex-col items-center">
             <Package size={24} className="text-brand-gold mb-4" />
             <h4 className="text-xs font-bold tracking-widest uppercase mb-1">Estado</h4>
             <span className="text-lg font-serif">Em processamento</span>
          </div>
          <div className="p-8 border border-gray-100 bg-white shadow-sm flex flex-col items-center">
             <ArrowRight size={24} className="text-brand-gold mb-4" />
             <h4 className="text-xs font-bold tracking-widest uppercase mb-1">Previsão</h4>
             <span className="text-lg font-serif">2-3 dias úteis</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onGoStore}
            className="w-full sm:w-auto bg-brand-red text-white px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/10 flex items-center justify-center gap-3"
          >
            Continuar a comprar
          </button>
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-charcoal transition-all"
          >
            <Home size={16} /> Voltar ao Início
          </button>
        </div>
      </motion.div>
    </div>
  );
}
