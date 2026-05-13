import { Search, ShoppingCart, User } from 'lucide-react';
import { motion } from 'motion/react';

import Logo from './Logo';

interface HeaderProps {
  onNavigate: (page: 'home' | 'store') => void;
  currentPage: 'home' | 'store';
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ onNavigate, currentPage, cartCount, onOpenCart }: HeaderProps) {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wider uppercase">
          <button 
            onClick={() => onNavigate('store')}
            className={`transition-colors hover:text-brand-red ${currentPage === 'store' ? 'text-brand-red border-b-2 border-brand-red pb-1' : ''}`}
          >
            Loja
          </button>
          <button 
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-brand-red ${currentPage === 'home' ? 'text-brand-red border-b-2 border-brand-red pb-1' : ''}`}
          >
            Quem somos
          </button>
        </nav>

        <div className="flex-1 flex justify-center">
          <button onClick={() => onNavigate('home')}>
            <Logo />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button className="hover:text-brand-red transition-colors">
            <Search size={20} />
          </button>
          <button 
            onClick={onOpenCart}
            className="hover:text-brand-red transition-colors relative"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </button>
          <button className="hover:text-brand-red transition-colors">
            <User size={20} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
