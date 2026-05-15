import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Loader2, MapPin, Users, Calendar, Box, Euro, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Category, Product } from '../types';
import ProductCard from './ProductCard';

interface StoreProps {
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product) => void;
  externalSearch?: string;
  onExternalSearchChange?: (query: string) => void;
}

export default function Store({ onSelectProduct, onAddToCart, externalSearch, onExternalSearchChange }: StoreProps) {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(externalSearch || '');

  useEffect(() => {
    if (externalSearch !== undefined && externalSearch !== searchQuery) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    onExternalSearchChange?.(val);
  };
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Todos');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [selectedProducer, setSelectedProducer] = useState<string>('Todos');
  const [selectedVintage, setSelectedVintage] = useState<string>('Todos');
  const [selectedCapacity, setSelectedCapacity] = useState<string>('Todas');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').eq('published', true),
      supabase.from('categories').select('*').order('name')
    ]);

    if (productsRes.data) {
      setDbProducts(productsRes.data);
      const highestPrice = Math.max(...productsRes.data.map(p => p.price), 1000);
      setMaxPrice(highestPrice);
    }
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const normalize = (str: string) => 
    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const filteredProducts = useMemo(() => {
    return dbProducts.filter(product => {
      const q = normalize(searchQuery);
      const matchesSearch = !q || 
                            normalize(product.name).includes(q) || 
                            normalize(product.region).includes(q) ||
                            normalize(product.producer).includes(q);
      
      const matchesCategory = selectedCategory === 'Todos' || product.category_id === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'Todos' || (product.subcategory_ids && product.subcategory_ids.includes(selectedSubcategory));
      const matchesRegion = selectedRegion === 'Todas' || product.region === selectedRegion;
      const matchesProducer = selectedProducer === 'Todos' || product.producer === selectedProducer;
      const matchesVintage = selectedVintage === 'Todos' || product.harvest === selectedVintage;
      const matchesCapacity = selectedCapacity === 'Todas' || product.capacity === selectedCapacity;
      const matchesPrice = product.price <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesRegion && 
             matchesProducer && matchesVintage && matchesCapacity && matchesPrice;
    });
  }, [dbProducts, searchQuery, selectedCategory, selectedSubcategory, selectedRegion, selectedProducer, selectedVintage, selectedCapacity, maxPrice]);

  const uniqueValues = useMemo(() => {
    return {
      regions: Array.from(new Set(dbProducts.map(p => p.region).filter(Boolean))).sort(),
      producers: Array.from(new Set(dbProducts.map(p => p.producer).filter(Boolean))).sort(),
      vintages: Array.from(new Set(dbProducts.map(p => p.harvest).filter(Boolean))).sort((a, b) => (b as string).localeCompare(a as string)),
      capacities: Array.from(new Set(dbProducts.map(p => p.capacity).filter(Boolean))).sort()
    };
  }, [dbProducts]);

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'Todos') return [];
    return categories.filter(c => c.parent_id === selectedCategory);
  }, [categories, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-red" size={40} />
      </div>
    );
  }

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
            placeholder="Pesquisar vinho, região, produtor..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-sm shadow-sm focus:outline-none focus:border-brand-red/30 focus:ring-1 focus:ring-brand-red/5 transition-all text-sm font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-red transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-72 space-y-8">
          <div className="bg-white/40 backdrop-blur-md p-6 rounded-sm border border-gray-100 shadow-sm space-y-10">
            {/* Categorias Principais */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-4 bg-brand-red rounded-full" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal">Explorar</h3>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setSelectedCategory('Todos'); setSelectedSubcategory('Todos'); }}
                  className={`text-left text-sm font-sans transition-all flex items-center justify-between group ${selectedCategory === 'Todos' ? 'text-brand-red font-bold' : 'text-gray-500 hover:text-brand-charcoal'}`}
                >
                  <span className="flex items-center gap-2"><Layers size={14} className="opacity-40" /> Todos</span>
                  <span className="text-[10px] opacity-40">({dbProducts.length})</span>
                </button>
                {categories.filter(c => !c.parent_id).map(cat => (
                  <div key={cat.id} className="space-y-3">
                    <button
                      onClick={() => { setSelectedCategory(cat.id); setSelectedSubcategory('Todos'); }}
                      className={`w-full text-left text-sm font-sans transition-all flex items-center justify-between group ${selectedCategory === cat.id ? 'text-brand-red font-bold' : 'text-gray-500 hover:text-brand-charcoal'}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-40">({dbProducts.filter(p => p.category_id === cat.id).length})</span>
                    </button>
                    
                    {/* Sub-categorias dinâmicas no mesmo bloco */}
                    {selectedCategory === cat.id && availableSubcategories.length > 0 && (
                      <div className="flex flex-col gap-2 pl-4 border-l border-gray-100 mt-2 animate-in slide-in-from-top-1 duration-300">
                        {availableSubcategories.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => setSelectedSubcategory(sub.id)}
                            className={`text-left text-xs font-sans transition-all ${selectedSubcategory === sub.id ? 'text-brand-red font-bold' : 'text-gray-400 hover:text-brand-charcoal'}`}
                          >
                            • {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Filtro por Região */}
            <div className="pt-8 border-t border-gray-50">
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={14} className="text-brand-red" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal">Região</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedRegion('Todas')}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all rounded-full border ${selectedRegion === 'Todas' ? 'bg-brand-red border-brand-red text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-brand-red/30'}`}
                >
                  Todas
                </button>
                {uniqueValues.regions.map(region => (
                  <button 
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all rounded-full border ${selectedRegion === region ? 'bg-brand-red border-brand-red text-white shadow-md' : 'bg-white border-gray-100 text-gray-400 hover:border-brand-red/30'}`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Produtor */}
            <div className="pt-8 border-t border-gray-50">
              <div className="flex items-center gap-2 mb-6">
                <Users size={14} className="text-brand-red" />
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal">Produtor</h3>
              </div>
              <select
                value={selectedProducer}
                onChange={(e) => setSelectedProducer(e.target.value)}
                className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-3 px-4 text-xs font-sans outline-none transition-all rounded-sm appearance-none cursor-pointer"
              >
                <option value="Todos">Todos os Produtores</option>
                {uniqueValues.producers.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Preço e Ano */}
            <div className="grid grid-cols-1 gap-8 pt-8 border-t border-gray-50">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Euro size={14} className="text-brand-red" />
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal">Preço Máx</h3>
                  </div>
                  <span className="text-xs font-bold text-brand-red">{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(maxPrice)}</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max={Math.max(...dbProducts.map(p => p.price), 1000)}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-red h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={14} className="text-brand-red" />
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal">Ano</h3>
                  </div>
                  <select
                    value={selectedVintage}
                    onChange={(e) => setSelectedVintage(e.target.value)}
                    className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-3 px-4 text-xs font-sans outline-none transition-all rounded-sm"
                  >
                    <option value="Todos">Todos</option>
                    {uniqueValues.vintages.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Box size={14} className="text-brand-red" />
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-charcoal">Volume</h3>
                  </div>
                  <select
                    value={selectedCapacity}
                    onChange={(e) => setSelectedCapacity(e.target.value)}
                    className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-3 px-4 text-xs font-sans outline-none transition-all rounded-sm"
                  >
                    <option value="Todas">Todas</option>
                    {uniqueValues.capacities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                setSelectedCategory('Todos');
                setSelectedSubcategory('Todos');
                setSelectedRegion('Todas');
                setSelectedProducer('Todos');
                setSelectedVintage('Todos');
                setSelectedCapacity('Todas');
                setMaxPrice(Math.max(...dbProducts.map(p => p.price), 1000));
                setSearchQuery('');
              }}
              className="w-full py-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 hover:text-brand-red border-t border-gray-50 transition-colors"
            >
              Limpar Todos os Filtros
            </button>
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
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setIsFilterOpen(false); }}
                    className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border rounded-full transition-all ${selectedCategory === cat.id ? 'bg-brand-red border-brand-red text-white' : 'border-gray-200 text-gray-500'}`}
                  >
                    {cat.name}
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
