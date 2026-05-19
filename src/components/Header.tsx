import { Search, ShoppingCart, User, ShieldCheck, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

import Logo from './Logo';

interface HeaderProps {
  onNavigate: (page: any) => void;
  currentPage: string;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearch: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

export default function Header({ 
  onNavigate, 
  currentPage, 
  cartCount, 
  onOpenCart,
  searchQuery,
  onSearch,
  isSearchOpen,
  setIsSearchOpen
}: HeaderProps) {
  const { user, isAdmin } = useAuth();

  const handleUserClick = () => {
    if (user) {
      if (isAdmin) onNavigate('admin');
      else onNavigate('profile');
    } else {
      onNavigate('login');
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNav = (page: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(page);
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
          <button 
            onClick={() => onNavigate('location')}
            className={`transition-colors hover:text-brand-red ${currentPage === 'location' ? 'text-brand-red border-b-2 border-brand-red pb-1' : ''}`}
          >
            Localização
          </button>
        </nav>

        <div className="flex-1 flex justify-center">
          <button onClick={() => onNavigate('home')}>
            <Logo />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    autoFocus
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full bg-gray-50 border-none py-2 px-4 text-sm font-sans outline-none focus:ring-1 focus:ring-brand-red/20 rounded-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`transition-colors p-2 ${isSearchOpen ? 'text-brand-red' : 'hover:text-brand-red'}`}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          <button 
            onClick={onOpenCart}
            className="hover:text-brand-red transition-colors relative p-2"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            onClick={handleUserClick}
            className={`transition-colors relative p-2 ${currentPage === 'login' || currentPage === 'admin' || currentPage === 'profile' ? 'text-brand-red' : 'hover:text-brand-red text-brand-charcoal'}`}
          >
            {user ? (
              isAdmin ? <ShieldCheck size={20} /> : <User size={20} className="fill-brand-red/10" />
            ) : (
              <User size={20} />
            )}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden transition-colors p-2 text-brand-charcoal hover:text-brand-red"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-brand-charcoal/95 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-6 text-white/50 hover:text-white p-2 transition-colors"
            >
              <X size={32} />
            </button>

            <nav className="flex flex-col items-center gap-8 text-2xl font-serif text-white">
              <button onClick={() => handleMobileNav('home')} className="hover:text-brand-gold transition-colors">Início</button>
              <button onClick={() => handleMobileNav('store')} className="hover:text-brand-gold transition-colors">Loja</button>
              <button onClick={() => handleMobileNav('about')} className="hover:text-brand-gold transition-colors">Quem somos</button>
              <button onClick={() => handleMobileNav('location')} className="hover:text-brand-gold transition-colors">Localização</button>
              
              <div className="w-16 h-px bg-white/20 my-2"></div>
              
              <button 
                onClick={() => { setIsMobileMenuOpen(false); handleUserClick(); }} 
                className="hover:text-brand-gold transition-colors flex items-center gap-3 text-lg font-sans tracking-widest uppercase"
              >
                <User size={18} /> {user ? 'A Minha Conta' : 'Iniciar Sessão'}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
