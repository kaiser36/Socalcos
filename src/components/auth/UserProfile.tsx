import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Product } from '../../types';
import { 
  User, 
  Shield, 
  LogOut, 
  Save, 
  Loader2, 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  Gift, 
  Copy, 
  Check, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  RefreshCw,
  Trash2,
  Menu,
  Wine,
  Share2,
  Star
} from 'lucide-react';

interface UserProfileProps {
  onAddToCart?: (product: Product, quantity?: number) => void;
  onNavigate?: (page: string) => void;
}

export default function UserProfile({ onAddToCart, onNavigate }: UserProfileProps) {
  const { user, signOut } = useAuth();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'account' | 'rewards'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Form State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    morada: user?.user_metadata?.morada || '',
    cidade: user?.user_metadata?.cidade || '',
    codigoPostal: user?.user_metadata?.codigoPostal || '',
    pais: user?.user_metadata?.pais || ''
  });

  // DB Data States
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<{ code: string; label: string; desc: string; expiry: string; }[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Local Wishlist State
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  // Local cellar notes state (contains ratings and private notes)
  const [cellarNotes, setCellarNotes] = useState<Record<string, { rating: number; note: string }>>({});

  // Clipboard success state for coupons
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Fetch all orders & products
  useEffect(() => {
    if (user?.email) {
      fetchOrdersAndProducts();
      loadWishlist();
      loadCellarNotes();
    }
  }, [user]);

  const loadCellarNotes = () => {
    if (!user?.id) return;
    const stored = localStorage.getItem(`socalcos_cellar_notes_${user.id}`);
    if (stored) {
      try {
        setCellarNotes(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSaveCellarNote = (productId: string, rating: number, note: string) => {
    if (!user?.id) return;
    const updated = {
      ...cellarNotes,
      [productId]: { rating, note }
    };
    setCellarNotes(updated);
    localStorage.setItem(`socalcos_cellar_notes_${user.id}`, JSON.stringify(updated));
  };

  const fetchOrdersAndProducts = async () => {
    setOrdersLoading(true);
    try {
      // 1. Fetch products so we can do local lookup for name & image in orders and wishlist
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData) {
        setProducts(prodData);
      }

      // 2. Fetch orders matching user email
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('customer_email', user?.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (orderData) {
        setOrders(orderData);
      }

      // 3. Fetch active coupons
      const { data: settingsData } = await supabase.from('site_settings').select('*');
      if (settingsData) {
        const couponsVal = settingsData.find(s => s.key === 'coupons')?.value;
        if (couponsVal) {
          try {
            setCoupons(JSON.parse(couponsVal));
          } catch (e) {
            console.error('Error parsing coupons:', e);
          }
        }
      }
    } catch (err) {
      console.error('Erro ao carregar dados do perfil:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadWishlist = () => {
    if (!user?.id) return;
    const stored = localStorage.getItem(`socalcos_wishlist_${user.id}`);
    if (stored) {
      try {
        setWishlistIds(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    if (!user?.id) return;
    const updated = wishlistIds.filter(id => id !== productId);
    setWishlistIds(updated);
    localStorage.setItem(`socalcos_wishlist_${user.id}`, JSON.stringify(updated));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase.auth.updateUser({
      data: { 
        full_name: formData.fullName,
        phone: formData.phone,
        morada: formData.morada,
        cidade: formData.cidade,
        codigoPostal: formData.codigoPostal,
        pais: formData.pais
      }
    });

    if (!error) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  // Reorder functionality: adds all items of a past order back to the cart
  const handleReorder = (orderItems: any[]) => {
    if (!onAddToCart) return;
    let addedCount = 0;
    orderItems.forEach(item => {
      const matchedProd = products.find(p => p.id === item.product_id);
      if (matchedProd) {
        onAddToCart(matchedProd, item.quantity);
        addedCount++;
      }
    });
    if (addedCount > 0 && onNavigate) {
      alert(`${addedCount} artigos adicionados ao carrinho!`);
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter products that exist in user's wishlist
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-offwhite">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Portal Header */}
        <div className="mb-12 border-b border-gray-200/50 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-gold">Área Exclusiva</span>
            <h1 className="text-4xl font-serif text-brand-charcoal mt-2">A Minha Conta</h1>
            <p className="text-xs text-gray-400 mt-1 font-sans">{user?.email}</p>
          </div>
          
          <button
            onClick={signOut}
            className="self-start md:self-center flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-brand-red hover:text-white text-gray-500 hover:shadow-lg hover:shadow-brand-red/10 transition-all duration-300 rounded-sm text-[10px] font-bold uppercase tracking-wider"
          >
            <LogOut size={13} /> Terminar Sessão
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Navigation Menu (Desktop Sidebar) */}
          <aside className="w-full lg:w-72 shrink-0">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex flex-col bg-white border border-gray-100 p-6 rounded-sm shadow-sm space-y-1">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">Menu Cliente</p>
              
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'overview' ? 'bg-brand-red text-white shadow-md shadow-brand-red/15' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-charcoal'}`}
              >
                <LayoutDashboard size={15} /> Painel Geral
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'orders' ? 'bg-brand-red text-white shadow-md shadow-brand-red/15' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-charcoal'}`}
              >
                <ShoppingBag size={15} /> As Minhas Encomendas
                {orders.length > 0 && (
                  <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'orders' ? 'bg-white text-brand-red' : 'bg-brand-red/5 text-brand-red'}`}>
                    {orders.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'wishlist' ? 'bg-brand-red text-white shadow-md shadow-brand-red/15' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-charcoal'}`}
              >
                <Wine size={15} /> Garrafeira Virtual
                {wishlistIds.length > 0 && (
                  <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'wishlist' ? 'bg-white text-brand-red' : 'bg-brand-red/5 text-brand-red'}`}>
                    {wishlistIds.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'account' ? 'bg-brand-red text-white shadow-md shadow-brand-red/15' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-charcoal'}`}
              >
                <User size={15} /> Dados de Conta
              </button>
              
              <button
                onClick={() => setActiveTab('rewards')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === 'rewards' ? 'bg-brand-red text-white shadow-md shadow-brand-red/15' : 'text-gray-500 hover:bg-gray-50 hover:text-brand-charcoal'}`}
              >
                <Gift size={15} /> Cupões & Ofertas
                <span className="ml-auto text-[8px] bg-brand-gold text-white font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse">
                  Novo
                </span>
              </button>
            </div>

            {/* Mobile Navigation (Dropdown) */}
            <div className="lg:hidden mb-6">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full flex items-center justify-between bg-white border border-gray-100 px-4 py-3 rounded-sm shadow-sm"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-brand-charcoal">
                  <Menu size={16} className="text-brand-red" /> 
                  {activeTab === 'overview' && 'Painel Geral'}
                  {activeTab === 'orders' && 'As Minhas Encomendas'}
                  {activeTab === 'wishlist' && 'A Minha Garrafeira Virtual'}
                  {activeTab === 'account' && 'Dados de Conta'}
                  {activeTab === 'rewards' && 'Cupões & Ofertas'}
                </div>
                <ChevronDown size={14} className={`transform transition-transform text-gray-400 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-white border border-t-0 border-gray-100 rounded-b-sm shadow-sm"
                  >
                    <div className="flex flex-col">
                      {[
                        { id: 'overview', label: 'Painel Geral', icon: LayoutDashboard },
                        { id: 'orders', label: 'Encomendas', icon: ShoppingBag, count: orders.length },
                        { id: 'wishlist', label: 'A Minha Garrafeira Virtual', icon: Wine, count: wishlistIds.length },
                        { id: 'account', label: 'Dados de Conta', icon: User },
                        { id: 'rewards', label: 'Cupões & Ofertas', icon: Gift }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => { setActiveTab(tab.id as any); setIsMobileMenuOpen(false); }}
                          className={`flex items-center gap-3 px-4 py-3 text-[10px] font-bold tracking-widest uppercase transition-all ${activeTab === tab.id ? 'bg-brand-red/5 text-brand-red border-l-2 border-brand-red' : 'text-gray-500 border-l-2 border-transparent hover:bg-gray-50'}`}
                        >
                          <tab.icon size={14} /> 
                          {tab.label}
                          {tab.count !== undefined && tab.count > 0 && (
                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-brand-red/10 text-brand-red">
                              {tab.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </aside>

          {/* Right Main Content Panel */}
          <main className="flex-1 bg-white border border-gray-100 p-8 md:p-10 rounded-sm shadow-sm min-h-[450px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-2xl font-serif text-brand-charcoal">
                        Olá, {formData.fullName ? formData.fullName.split(' ')[0] : 'Cliente Socalcos'}!
                      </h2>
                      <p className="text-sm text-gray-500 mt-2 font-sans leading-relaxed">
                        Bem-vindo à sua área de garrafeira exclusiva. Aqui pode gerir as suas encomendas, atualizar os seus dados de entrega rápida e consultar os seus vinhos favoritos.
                      </p>
                    </div>

                    {/* Stats Summary Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-brand-offwhite p-6 border border-gray-100 rounded-sm">
                        <div className="flex items-center gap-3 text-brand-red mb-3">
                          <ShoppingBag size={20} />
                          <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">Encomendas</span>
                        </div>
                        <p className="text-3xl font-serif text-brand-charcoal">{orders.length}</p>
                        <button onClick={() => setActiveTab('orders')} className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-brand-gold uppercase tracking-wider hover:text-brand-red transition-all">
                          Ver Histórico <ChevronDown className="-rotate-90" size={12} />
                        </button>
                      </div>

                      <div className="bg-brand-offwhite p-6 border border-gray-100 rounded-sm">
                        <div className="flex items-center gap-3 text-brand-red mb-3">
                          <Wine size={20} />
                          <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">Garrafeira Virtual</span>
                        </div>
                        <p className="text-3xl font-serif text-brand-charcoal">{wishlistIds.length}</p>
                        <button onClick={() => setActiveTab('wishlist')} className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-brand-gold uppercase tracking-wider hover:text-brand-red transition-all">
                          Ver Garrafeira <ChevronDown className="-rotate-90" size={12} />
                        </button>
                      </div>

                      <div className="bg-brand-offwhite p-6 border border-gray-100 rounded-sm">
                        <div className="flex items-center gap-3 text-brand-red mb-3">
                          <Gift size={20} />
                          <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">Ofertas Ativas</span>
                        </div>
                        <p className="text-3xl font-serif text-brand-charcoal">{coupons.length}</p>
                        <button onClick={() => setActiveTab('rewards')} className="mt-4 flex items-center gap-1.5 text-[9px] font-black text-brand-gold uppercase tracking-wider hover:text-brand-red transition-all">
                          Ver Cupões <ChevronDown className="-rotate-90" size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Default Address Quickcard */}
                    <div className="border border-gray-100 p-6 rounded-sm bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 bg-brand-red/5 rounded-full flex items-center justify-center text-brand-red shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Dados de Envio Padrão</h4>
                          {formData.morada ? (
                            <p className="text-sm font-sans text-brand-charcoal leading-relaxed">
                              {formData.morada}<br />
                              {formData.codigoPostal} {formData.cidade}, {formData.pais}
                            </p>
                          ) : (
                            <p className="text-sm font-sans text-gray-400 italic">Sem morada definida no perfil.</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('account')}
                        className="self-start md:self-center px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-brand-charcoal hover:text-white bg-gray-50 hover:bg-brand-gold transition-all duration-300 rounded-sm border border-gray-100"
                      >
                        Editar Morada
                      </button>
                    </div>

                    {/* Wine quote card */}
                    <div className="pt-6 border-t border-gray-100 text-center max-w-lg mx-auto">
                      <p className="font-serif italic text-brand-charcoal text-base">
                        "O vinho é a única obra de arte que se pode beber."
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-gold mt-2">
                        — Luis Fernando Veríssimo
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. ORDER HISTORY TAB */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-serif text-brand-charcoal">As Minhas Encomendas</h2>
                      <p className="text-xs text-gray-400 mt-1 font-sans">
                        Consulte os detalhes das suas encomendas anteriores e acompanhe o estado de entrega.
                      </p>
                    </div>

                    {ordersLoading ? (
                      <div className="py-20 flex items-center justify-center">
                        <Loader2 className="animate-spin text-brand-red" size={32} />
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="py-16 text-center border border-dashed border-gray-200 rounded-sm bg-gray-50/30">
                        <ShoppingBag className="mx-auto text-gray-300 mb-4" size={40} />
                        <p className="text-sm text-gray-500 font-sans">Ainda não efetuou nenhuma encomenda.</p>
                        <button
                          onClick={() => onNavigate?.('store')}
                          className="mt-6 inline-flex items-center gap-2 bg-brand-red text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-red/90 transition-all rounded-sm shadow-md"
                        >
                          Explorar Loja <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => {
                          const isExpanded = expandedOrder === order.id;
                          const orderStatus = order.status || 'pending';
                          
                          // Style based on status
                          const statusConfig: Record<string, { label: string, style: string }> = {
                            pending: { label: 'Pendente', style: 'bg-amber-50 text-amber-700 border-amber-200' },
                            confirmed: { label: 'Confirmado', style: 'bg-blue-50 text-blue-700 border-blue-200' },
                            shipped: { label: 'Enviado', style: 'bg-green-50 text-green-700 border-green-200' },
                            cancelled: { label: 'Cancelado', style: 'bg-red-50 text-red-700 border-red-200' }
                          };

                          const currentStatus = statusConfig[orderStatus] || statusConfig.pending;

                          return (
                            <div key={order.id} className="border border-gray-100 rounded-sm overflow-hidden bg-white hover:shadow-sm transition-all duration-300">
                              
                              {/* Order Row Header */}
                              <div 
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                              >
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Encomenda</span>
                                    <p className="font-mono text-sm font-semibold text-brand-red mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data</span>
                                    <div className="flex items-center gap-1 text-sm text-brand-charcoal mt-0.5">
                                      <Calendar size={13} className="text-gray-400" />
                                      {formatDate(order.created_at)}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</span>
                                    <p className="text-sm font-medium text-brand-charcoal mt-0.5">{formatPrice(order.total)}</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-4">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${currentStatus.style}`}>
                                    {currentStatus.label}
                                  </span>
                                  {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                </div>
                              </div>

                              {/* Expanded Order details */}
                              {isExpanded && (
                                <div className="border-t border-gray-100 bg-gray-50/40 p-6 space-y-6">
                                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Artigos Comprados</h4>
                                  
                                  {/* List of items */}
                                  <div className="space-y-4">
                                    {order.order_items?.map((item: any, idx: number) => {
                                      // Look up product image and name
                                      const matchedProd = products.find(p => p.id === item.product_id);
                                      return (
                                        <div key={idx} className="flex items-center justify-between gap-4 bg-white p-4 border border-gray-100 rounded-sm">
                                          <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-gray-50 flex items-center justify-center p-2 border border-gray-100 rounded-sm shrink-0">
                                              <img 
                                                src={matchedProd?.image || 'https://via.placeholder.com/100'} 
                                                alt={matchedProd?.name || 'Garrafa'} 
                                                className="h-full object-contain"
                                                onError={(e) => { e.currentTarget.src = '/images/logo-v.png'; }}
                                              />
                                            </div>
                                            <div>
                                              <h5 className="font-serif text-sm text-brand-charcoal leading-snug">{matchedProd?.name || 'Produto indisponível'}</h5>
                                              <p className="text-[10px] text-gray-400 mt-1">Preço unitário: {formatPrice(item.price)}</p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-xs text-gray-400">Qtd: {item.quantity}</p>
                                            <p className="text-sm font-medium text-brand-charcoal mt-1">{formatPrice(item.price * item.quantity)}</p>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Address and actions */}
                                  <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="text-xs font-sans text-gray-500 leading-relaxed max-w-md">
                                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Entregue em:</span>
                                      <strong>{order.customer_name}</strong><br />
                                      {order.address}<br />
                                      {order.postal_code} {order.city}, {order.country}
                                    </div>

                                    {onAddToCart && (
                                      <button
                                        onClick={() => handleReorder(order.order_items || [])}
                                        className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-charcoal text-white hover:bg-brand-red text-[10px] font-bold uppercase tracking-wider transition-all duration-300 rounded-sm shadow-sm shrink-0"
                                      >
                                        <RefreshCw size={13} /> Recomprar Encomenda
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PERSONAL WISHLIST TAB (VIRTUAL WINE CELLAR) */}
                {activeTab === 'wishlist' && (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-serif text-brand-charcoal">A Minha Garrafeira Virtual</h2>
                        <p className="text-xs text-gray-400 mt-1 font-sans">
                          Avalie, adicione notas de degustação privadas e partilhe as suas garrafas guardadas.
                        </p>
                      </div>
                      
                      <button
                        onClick={() => onNavigate?.('store')}
                        className="px-6 py-2.5 border border-brand-red text-brand-red hover:bg-brand-red hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-sm shrink-0"
                      >
                        Adicionar Mais Vinhos
                      </button>
                    </div>

                    {ordersLoading ? (
                      <div className="py-20 flex items-center justify-center">
                        <Loader2 className="animate-spin text-brand-red" size={32} />
                      </div>
                    ) : wishlistProducts.length === 0 ? (
                      <div className="py-16 text-center border border-dashed border-gray-200 rounded-sm bg-gray-50/30">
                        <Wine className="mx-auto text-gray-300 mb-4" size={40} />
                        <p className="text-sm text-gray-500 font-sans">A sua garrafeira virtual está vazia.</p>
                        <button
                          onClick={() => onNavigate?.('store')}
                          className="mt-6 inline-flex items-center gap-2 bg-brand-red text-white px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-red/90 transition-all rounded-sm shadow-md"
                        >
                          Explorar Garrafeira <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      /* Visual Cellar Backdrop with Wooden Shelves */
                      <div className="bg-stone-50/50 border border-stone-200/80 rounded-sm p-8 md:p-12 relative overflow-hidden shadow-sm space-y-16">
                        
                        {/* Cellar Ambient Overlay */}
                        <div className="absolute inset-0 bg-radial-gradient from-amber-50/5 to-transparent pointer-events-none" />
                        
                        {/* Split products in groups of 3 to represent shelves */}
                        {Array.from({ length: Math.ceil(wishlistProducts.length / 3) }).map((_, shelfIdx) => {
                          const shelfProducts = wishlistProducts.slice(shelfIdx * 3, shelfIdx * 3 + 3);

                          return (
                            <div key={shelfIdx} className="relative z-10 flex flex-col justify-end">
                      {/* Grid of Bottles standing on shelf */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 items-end">
                                {shelfProducts.map((product) => {
                                  const noteData = cellarNotes[product.id] || { rating: 0, note: '' };
                                  
                                  // Dynamic states for editing rating/note locally before saving
                                  return (
                                    <div key={product.id} className="bg-white border border-stone-200/60 p-5 rounded-sm flex flex-col justify-between h-[390px] shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand-gold/50">
                                      
                                      {/* Visual Bottle on Stand */}
                                      <div className="h-32 flex items-center justify-center p-3 relative bg-stone-50/40 rounded-sm border border-stone-100">
                                        <img 
                                          src={product.image} 
                                          alt={product.name} 
                                          className="h-full object-contain filter drop-shadow-[0_6px_8px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-500" 
                                          onError={(e) => { e.currentTarget.src = '/images/logo-v.png'; }}
                                        />
                                      </div>

                                      {/* Product details */}
                                      <div className="mt-4 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                          <h4 className="font-serif text-xs text-brand-charcoal font-medium leading-snug line-clamp-1">{product.name}</h4>
                                          <p className="text-[9px] text-gray-400 mt-1 font-sans">
                                            {product.region} {product.vintage ? `• ${product.vintage}` : ''}
                                          </p>
                                          <p className="text-xs font-semibold text-brand-red mt-1.5">{formatPrice(product.price)}</p>
                                        </div>

                                        {/* Star selector */}
                                        <div>
                                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Avaliação</span>
                                          <div className="flex gap-1.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <button
                                                key={star}
                                                onClick={() => handleSaveCellarNote(product.id, star, noteData.note)}
                                                className="focus:outline-none cursor-pointer"
                                              >
                                                <Star
                                                  size={14}
                                                  className={`transition-colors duration-300 ${
                                                    star <= noteData.rating 
                                                      ? 'fill-brand-gold text-brand-gold' 
                                                      : 'text-gray-200 hover:text-brand-gold'
                                                  }`}
                                                />
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Note edit field */}
                                        <div className="space-y-1.5">
                                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block">Nota de Prova Privada</span>
                                          <input
                                            type="text"
                                            placeholder="Notas de degustação..."
                                            value={noteData.note}
                                            onChange={(e) => handleSaveCellarNote(product.id, noteData.rating, e.target.value)}
                                            className="w-full bg-stone-50 border border-stone-200 px-3 py-2 text-[10px] text-brand-charcoal focus:outline-none focus:bg-white focus:border-brand-gold rounded-sm font-sans placeholder-gray-400 focus:ring-1 focus:ring-brand-gold/20"
                                          />
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                                          {/* WhatsApp Share */}
                                          <a
                                            href={`https://wa.me/?text=${encodeURIComponent(
                                              `Olha para este vinho excelente da minha Garrafeira Virtual Socalcos: *${product.name}*. Minha nota de prova: "${noteData.note || 'Excelente seleção!'}" (${noteData.rating || 5} estrelas).`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-gray-400 hover:text-brand-gold rounded-sm transition-all"
                                            title="Partilhar no WhatsApp"
                                          >
                                            <Share2 size={12} />
                                          </a>

                                          {/* Remove button */}
                                          <button
                                            onClick={() => handleRemoveFromWishlist(product.id)}
                                            className="p-2 bg-stone-50 hover:bg-red-50 border border-stone-200 hover:border-red-200 text-gray-400 hover:text-brand-red rounded-sm transition-all cursor-pointer"
                                            title="Remover da garrafeira"
                                          >
                                            <Trash2 size={12} />
                                          </button>

                                          {onAddToCart && (
                                            <button
                                              onClick={() => onAddToCart(product)}
                                              className="flex-1 py-2 bg-brand-red text-white hover:bg-brand-red/90 text-[9px] font-bold uppercase tracking-wider transition-all rounded-sm shadow-md"
                                            >
                                              Comprar
                                            </button>
                                          )}
                                        </div>

                                      </div>

                                    </div>
                                  );
                                })}
                              </div>
                              {/* CSS Wooden Plank Shelf (Light wood gradient) */}
                              <div className="h-3 w-full bg-gradient-to-r from-[#a1887f] via-[#d7ccc8] to-[#a1887f] rounded-sm shadow-md border-b border-stone-300 mt-4 relative z-0">
                                {/* Brackets */}
                                <div className="absolute left-8 -bottom-1 w-1.5 h-1 bg-[#d7ccc8] rounded-sm shadow-sm" />
                                <div className="absolute right-8 -bottom-1 w-1.5 h-1 bg-[#d7ccc8] rounded-sm shadow-sm" />
                              </div>
                            </div>
                          );
                        })}

                      </div>
                    )}
                  </div>
                )}

                {/* 4. ACCOUNT DETAILS TAB */}
                {activeTab === 'account' && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-serif text-brand-charcoal font-medium">Dados de Conta</h2>
                      <p className="text-xs text-gray-400 mt-1 font-sans">
                        Mantenha as suas informações de contacto e morada de envio atualizadas para um checkout rápido.
                      </p>
                    </div>

                    {success && (
                      <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-bold uppercase tracking-widest rounded-sm">
                        Perfil atualizado com sucesso!
                      </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Nome Completo</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                              required
                              type="text"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-100 py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-brand-gold/30 focus:bg-white transition-all font-sans text-sm rounded-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Telefone</label>
                          <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input
                              required
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-100 py-3.5 pl-12 pr-4 outline-none focus:ring-1 focus:ring-brand-gold/30 focus:bg-white transition-all font-sans text-sm rounded-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-serif text-brand-charcoal font-medium">Dados de Envio Padrão</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Morada</label>
                            <input
                              required
                              type="text"
                              value={formData.morada}
                              onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-100 py-3.5 px-4 outline-none focus:ring-1 focus:ring-brand-gold/30 focus:bg-white transition-all font-sans text-sm rounded-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Cidade</label>
                            <input
                              required
                              type="text"
                              value={formData.cidade}
                              onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-100 py-3.5 px-4 outline-none focus:ring-1 focus:ring-brand-gold/30 focus:bg-white transition-all font-sans text-sm rounded-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Código Postal</label>
                            <input
                              required
                              type="text"
                              value={formData.codigoPostal}
                              onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-100 py-3.5 px-4 outline-none focus:ring-1 focus:ring-brand-gold/30 focus:bg-white transition-all font-sans text-sm rounded-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">País</label>
                            <input
                              required
                              type="text"
                              value={formData.pais}
                              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-100 py-3.5 px-4 outline-none focus:ring-1 focus:ring-brand-gold/30 focus:bg-white transition-all font-sans text-sm rounded-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                          disabled={loading}
                          type="submit"
                          className="px-10 py-4 bg-brand-red text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-red/90 hover:shadow-lg hover:shadow-brand-red/20 transition-all rounded-sm flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Guardar Alterações</>}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 5. COUPONS & OFFERS TAB */}
                {activeTab === 'rewards' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-serif text-brand-charcoal">Cupões & Ofertas</h2>
                      <p className="text-xs text-gray-400 mt-1 font-sans">
                        Use estes cupões de desconto exclusivos ao finalizar a sua encomenda.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {coupons.length === 0 ? (
                        <p className="text-sm font-sans text-gray-400 italic text-center py-12">Nenhum cupão disponível no momento.</p>
                      ) : (
                        coupons.map((coupon) => {
                          const isCopied = copiedCoupon === coupon.code;
                          return (
                            <div key={coupon.code} className="border border-brand-gold/20 p-6 rounded-sm bg-gradient-to-r from-brand-offwhite via-white to-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden group">
                              
                              {/* Decorative gold vertical bar */}
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold" />
                              
                              <div className="space-y-2">
                                <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.2em]">{coupon.label}</span>
                                <h4 className="font-mono text-xl font-bold text-brand-charcoal tracking-wide mt-1">{coupon.code}</h4>
                                <p className="text-xs text-gray-500 font-sans leading-relaxed">{coupon.desc}</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Validade: {coupon.expiry}</p>
                              </div>

                              <button
                                onClick={() => copyCouponCode(coupon.code)}
                                className={`self-start md:self-center px-6 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 border flex items-center gap-2 ${isCopied ? 'bg-green-600 text-white border-green-600' : 'bg-brand-charcoal text-white hover:bg-brand-red border-brand-charcoal hover:border-brand-red'}`}
                              >
                                {isCopied ? (
                                  <><Check size={14} /> Copiado!</>
                                ) : (
                                  <><Copy size={14} /> Copiar Código</>
                                )}
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
}
