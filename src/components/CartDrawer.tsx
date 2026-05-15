import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartDrawerProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formattedSubtotal = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(subtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-brand-charcoal">
                <ShoppingBag size={20} />
                <h2 className="text-xl font-serif">O seu Carrinho</h2>
                <span className="bg-brand-red/10 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-brand-charcoal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-gray-50 flex items-center justify-center p-2 rounded-sm border border-gray-100">
                      <img src={item.image} alt={item.name} className="h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-sm font-serif text-brand-charcoal leading-tight pr-4">{item.name}</h3>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-300 hover:text-brand-red transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mb-4 font-sans tracking-tight">
                        {item.region || '-'} • {item.vintage || '-'} • IVA {item.tax_rate || 23}%
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-sm">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-gray-50 disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-sans font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-gray-50"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-brand-charcoal">
                          {new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-20">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-brand-charcoal mb-2">O carrinho está vazio</h3>
                    <p className="text-sm text-gray-400 font-sans">Ainda não adicionou produtos ao seu carrinho.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="text-brand-red font-bold uppercase tracking-widest text-xs border-b-2 border-brand-red pb-1"
                  >
                    Começar a comprar
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-brand-charcoal font-medium">{formattedSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Envio</span>
                    <span className="text-brand-gold font-medium uppercase text-[10px] tracking-widest">Calculado no checkout</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-serif text-brand-charcoal">Total</span>
                      <span className="text-xl font-serif text-brand-red">{formattedSubtotal}</span>
                    </div>
                    <div className="text-right text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                      (Inclui IVA à taxa em vigor)
                    </div>
                  </div>
                </div>

                <button 
                  onClick={onCheckout}
                  className="w-full bg-brand-red text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-red/90 transition-all rounded-sm shadow-lg shadow-brand-red/20"
                >
                  Finalizar Encomenda
                </button>
                
                <p className="text-[10px] text-center text-gray-400 font-sans">
                  Taxas e custos de envio calculados no passo seguinte.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
