import { useState, useMemo } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products } from '../data/products';
import { Category, Product } from '../types';
import ProductCard from './ProductCard';

const CATEGORIES: Category[] = ['Vinho do Porto', 'Vinhos', 'Whisky', 'Destilados', 'Gourmet'];

interface StoreProps {
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function Store({ onSelectProduct, onAddToCart }: StoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.region.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-serif mb-4 text-brand-red">A Nossa Loja</h1>
          <p className="text-gray-500 font-sans tracking-wide">Explore a nossa seleção de vinhos e iguarias gourmet do Porto e do mundo.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar vinho, região..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-sm focus:outline-none focus:border-brand-red/30 transition-all text-sm font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-red"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 space-y-10">
          <div>
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">Categorias</h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setSelectedCategory('Todos')}
                className={`text-left text-sm font-sans transition-all hover:pl-2 ${selectedCategory === 'Todos' ? 'text-brand-red font-bold underline underline-offset-4' : 'text-gray-600 hover:text-brand-charcoal'}`}
              >
                Todos
              </button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-sm font-sans transition-all hover:pl-2 ${selectedCategory === cat ? 'text-brand-red font-bold underline underline-offset-4' : 'text-gray-600 hover:text-brand-charcoal'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100">
             <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">Informação</h3>
             <p className="text-xs text-gray-500 leading-relaxed italic">
               "Cada garrafa conta uma história das encostas acidentadas do Douro."
             </p>
          </div>
        </aside>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-brand-charcoal"
          >
            <Filter size={16} /> Filtros
            <ChevronDown size={14} className={`transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
          <span className="text-xs text-gray-400">{filteredProducts.length} Produtos</span>
        </div>

        {/* Mobile Filters Dropdown */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden mb-8 bg-white border-b border-gray-100"
            >
              <div className="py-6 flex flex-wrap gap-3">
                <button
                  onClick={() => { setSelectedCategory('Todos'); setIsFilterOpen(false); }}
                  className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border rounded-full transition-all ${selectedCategory === 'Todos' ? 'bg-brand-red border-brand-red text-white' : 'border-gray-200 text-gray-500'}`}
                >
                  Todos
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setIsFilterOpen(false); }}
                    className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border rounded-full transition-all ${selectedCategory === cat ? 'bg-brand-red border-brand-red text-white' : 'border-gray-200 text-gray-500'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Product Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (index % 3) * 0.1 }}
                  className="h-full"
                >
                  <ProductCard {...product} onSelect={onSelectProduct} onAddToCart={onAddToCart} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-xl font-serif text-gray-400">Não encontramos produtos para esta pesquisa.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
                className="mt-6 text-brand-red font-bold uppercase tracking-widest text-xs border-b border-brand-red pb-1"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
