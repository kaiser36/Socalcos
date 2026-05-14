import { Search, ShoppingCart, User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

import Logo from './Logo';

interface HeaderProps {
  onNavigate: (page: any) => void;
  currentPage: string;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({ onNavigate, currentPage, cartCount, onOpenCart }: HeaderProps) {
  const { user, isAdmin } = useAuth();

  const handleUserClick = () => {
    if (user) {
      if (isAdmin) onNavigate('admin');
      else onNavigate('profile');
    } else {
      onNavigate('login');
    }
  };

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
            onClick={() => onNavigate('about')}
            className={`transition-colors hover:text-brand-red ${currentPage === 'about' ? 'text-brand-red border-b-2 border-brand-red pb-1' : ''}`}
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
          <button 
            onClick={handleUserClick}
            className={`transition-colors relative ${currentPage === 'login' || currentPage === 'admin' || currentPage === 'profile' ? 'text-brand-red' : 'hover:text-brand-red text-brand-charcoal'}`}
          >
            {user ? (
              isAdmin ? <ShieldCheck size={20} /> : <User size={20} className="fill-brand-red/10" />
            ) : (
              <User size={20} />
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
