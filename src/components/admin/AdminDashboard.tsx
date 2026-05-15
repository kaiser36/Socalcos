import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  TrendingUp,
  LayoutDashboard,
  Layers,
  ShoppingCart,
  Database,
  UploadCloud,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product, GalleryImage } from '../../types';
import ProductModal from './ProductModal';
import CategoryManager from './CategoryManager';
import DataManager from './DataManager';
import { Star, MessageSquareQuote } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'gallery' | 'orders' | 'data' | 'settings' | 'testimonials'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Todas');
  const [categories, setCategories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const testimonialInputRef = useRef<HTMLInputElement>(null);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', content: '', rating: 5, avatar_url: '' });
  const { signOut } = useAuth();

  const [stats, setStats] = useState({ products: 0, orders: 0, totalSales: 0 });

  useEffect(() => {
    fetchData();
  }, [currentPage, adminSearchQuery, selectedCategoryFilter, showOnlyFavorites]);

  const fetchData = async () => {
    setLoading(true);
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    let query = supabase.from('products').select('*', { count: 'exact' });
    
    if (selectedCategoryFilter !== 'Todas') {
      query = query.eq('category_id', selectedCategoryFilter);
    }
    
    if (adminSearchQuery) {
      query = query.or(`name.ilike.%${adminSearchQuery}%,sku.ilike.%${adminSearchQuery}%,producer.ilike.%${adminSearchQuery}%`);
    }

    if (showOnlyFavorites) {
      query = query.eq('is_favorite', true);
    }

    const [productsRes, ordersRes, categoriesRes, galleryRes, settingsRes, testimonialsRes] = await Promise.all([
      query.order('created_at', { ascending: false }).range(start, end),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('gallery').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('*'),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (ordersRes.data) {
      setOrders(ordersRes.data);
      const total = ordersRes.data.reduce((acc, curr) => acc + (curr.total || 0), 0);
      setStats(prev => ({ ...prev, orders: ordersRes.data?.length || 0, totalSales: total }));
    }
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (galleryRes.data) setGallery(galleryRes.data);
    if (testimonialsRes.data) setTestimonials(testimonialsRes.data);
    if (productsRes.count !== null) setStats(prev => ({ ...prev, products: productsRes.count }));
    
    if (settingsRes.data) {
      const hero = settingsRes.data.find(s => s.key === 'hero_image')?.value;
      if (hero) setHeroImageUrl(hero);
    }

    setLoading(false);
  };

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`; // Directly in bucket root

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('gallery')
        .insert([{ url: publicUrl }]);

      if (dbError) throw dbError;

      fetchData();
    } catch (error: any) {
      alert('Erro no upload: ' + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteGalleryImage = async (id: string, url: string) => {
    if (!confirm('Tem a certeza que deseja eliminar esta imagem?')) return;

    try {
      const fileName = url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('gallery').remove([fileName]);
      }
      
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert('Erro ao eliminar: ' + error.message);
    }
  };

  const handleHeroUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('site_settings')
        .upsert({ key: 'hero_image', value: publicUrl }, { onConflict: 'key' });

      if (dbError) throw dbError;

      setHeroImageUrl(publicUrl);
      alert('Banner atualizado com sucesso!');
    } catch (error: any) {
      alert('Erro no upload do banner: ' + error.message);
    } finally {
      setLoading(false);
      if (heroInputRef.current) heroInputRef.current.value = '';
    }
  };

  const handleTestimonialUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `testimonial-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('testimonials')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('testimonials')
        .getPublicUrl(fileName);

      setNewTestimonial(prev => ({ ...prev, avatar_url: publicUrl }));
    } catch (error: any) {
      alert('Erro no upload da foto: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const saveTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      alert('Preencha o nome e o comentário!');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('testimonials').insert([newTestimonial]);
      if (error) throw error;
      setNewTestimonial({ name: '', content: '', rating: 5, avatar_url: '' });
      fetchData();
    } catch (error: any) {
      alert('Erro ao guardar testemunho: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string, avatar_url: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este testemunho?')) return;

    try {
      if (avatar_url) {
        const fileName = avatar_url.split('/').pop();
        if (fileName) await supabase.storage.from('testimonials').remove([fileName]);
      }
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (error: any) {
      alert('Erro ao eliminar: ' + error.message);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'hero_image', value: heroImageUrl }, { onConflict: 'key' });
    
    if (!error) {
      alert('Definições guardadas com sucesso!');
    } else {
      alert('Erro ao guardar: ' + error.message);
    }
    setLoading(false);
  };

  const toggleFavorite = async (product: Product) => {
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, is_favorite: !p.is_favorite } : p
    ));

    const { error } = await supabase
      .from('products')
      .update({ is_favorite: !product.is_favorite })
      .eq('id', product.id);
    
    if (error) {
      fetchData();
      alert('Erro ao atualizar favorito: ' + error.message);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Tem a certeza que deseja eliminar este produto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchData();
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (!error) fetchData();
  };

  const formatPrice = (val: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-charcoal text-white flex flex-col fixed inset-y-0">
        <div className="p-8">
          <h1 className="text-2xl font-serif tracking-tighter">Socalcos<span className="text-brand-red">.</span></h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Backoffice Admin</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', label: 'Resumo', icon: LayoutDashboard },
            { id: 'products', label: 'Produtos', icon: Package },
            { id: 'categories', label: 'Categorias', icon: Layers },
            { id: 'orders', label: 'Encomendas', icon: ShoppingCart },
            { id: 'gallery', label: 'Galeria', icon: ImageIcon },
            { id: 'testimonials', label: 'Testemunhos', icon: MessageSquareQuote },
            { id: 'data', label: 'Dados', icon: Database },
            { id: 'settings', label: 'Definições', icon: Settings },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase transition-all ${activeTab === item.id ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif text-brand-charcoal capitalize">
              {activeTab === 'overview' ? 'Painel de Controlo' : 
               activeTab === 'gallery' ? 'Galeria de Imagens' :
               activeTab}
            </h1>
          </div>
          
          {activeTab === 'products' && (
            <button 
              onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
              className="bg-brand-red text-white px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Novo Produto
            </button>
          )}

          {activeTab === 'gallery' && (
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleGalleryUpload}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-brand-red text-white px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {isUploading ? 'A Carregar...' : 'Carregar Foto'}
              </button>
            </div>
          )}
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400">Vendas Totais</h4>
              </div>
              <p className="text-3xl font-serif text-brand-charcoal">{formatPrice(stats.totalSales)}</p>
            </div>
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400">Encomendas</h4>
              </div>
              <p className="text-3xl font-serif text-brand-charcoal">{stats.orders}</p>
            </div>
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                  <Package size={24} />
                </div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400">Produtos Ativos</h4>
              </div>
              <p className="text-3xl font-serif text-brand-charcoal">{stats.products}</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-gray-100 rounded-sm shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Pesquisar..."
                  value={adminSearchQuery}
                  onChange={(e) => setAdminSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border-none bg-gray-50 focus:ring-1 focus:ring-brand-red/20 rounded-sm outline-none font-sans"
                />
              </div>
              <select 
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-gray-50 border-none px-4 py-2 text-xs font-bold tracking-widest uppercase outline-none rounded-sm cursor-pointer"
              >
                <option value="Todas">Todas as Categorias</option>
                {categories.filter(c => !c.parent_id).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button 
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm border transition-all text-[10px] font-bold tracking-widest uppercase ${showOnlyFavorites ? 'bg-brand-gold text-white border-brand-gold' : 'bg-white text-gray-400 border-gray-100'}`}
              >
                <Plus size={14} /> {showOnlyFavorites ? 'Ver Todos' : 'Ver Favoritos'}
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 w-10 text-center">Fav</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Produto</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Estado</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Preço</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-brand-red/[0.02] transition-colors group">
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => toggleFavorite(product)} className={`transition-all ${product.is_favorite ? 'text-brand-gold scale-125' : 'text-gray-200 hover:text-brand-gold'}`}>
                          <Plus size={18} className={product.is_favorite ? 'fill-current' : ''} />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={product.image} className="w-10 h-12 object-cover rounded-sm border border-gray-100" />
                          <div>
                            <p className="text-sm font-serif font-medium text-brand-charcoal">{product.name}</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${product.published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {product.published ? 'Publicado' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-brand-charcoal">{formatPrice(product.price)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }} className="p-2 text-gray-300 hover:text-brand-red transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => deleteProduct(product.id)} className="p-2 text-gray-300 hover:text-brand-red transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">A mostrar {products.length} de {stats.products}</div>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-[10px] font-bold uppercase bg-white border border-gray-100 rounded-sm disabled:opacity-30">Anterior</button>
                  <button onClick={() => setCurrentPage(p => p + 1)} disabled={products.length < itemsPerPage} className="px-4 py-2 text-[10px] font-bold uppercase bg-white border border-gray-100 rounded-sm disabled:opacity-30">Próxima</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {gallery.map((img) => (
              <div key={img.id} className="relative aspect-square bg-white border border-gray-100 rounded-sm shadow-sm group overflow-hidden">
                <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    onClick={() => deleteGalleryImage(img.id, img.url)}
                    className="p-3 bg-white text-brand-red rounded-full hover:scale-110 transition-transform shadow-xl"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {gallery.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white border border-dashed border-gray-200 rounded-sm">
                <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-sm text-gray-400 font-sans">Nenhuma imagem na galeria. Carregue a sua primeira foto!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'data' && <DataManager />}
        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
             <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Encomenda</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Cliente</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Total</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-6 py-4 font-mono text-brand-red">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4">{order.customer_name}</td>
                    <td className="px-6 py-4">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer"
                      >
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="shipped">Enviado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-12">
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm max-w-4xl">
              <h2 className="text-xl font-serif text-brand-charcoal mb-8">Novo Testemunho</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Nome do Cliente</label>
                    <input 
                      type="text"
                      value={newTestimonial.name}
                      onChange={(e) => setNewTestimonial(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-50 border-none py-3 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 rounded-sm font-sans text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Avaliação (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          onClick={() => setNewTestimonial(prev => ({ ...prev, rating: star }))}
                          className={`transition-all ${newTestimonial.rating >= star ? 'text-brand-gold scale-110' : 'text-gray-200 hover:text-brand-gold'}`}
                        >
                          <Star size={24} fill={newTestimonial.rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Foto / Avatar</label>
                    <div className="flex items-center gap-4">
                      {newTestimonial.avatar_url && (
                        <img src={newTestimonial.avatar_url} className="w-16 h-16 rounded-full object-cover border-2 border-brand-red/10" />
                      )}
                      <input 
                        type="file" 
                        ref={testimonialInputRef}
                        onChange={handleTestimonialUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button 
                        onClick={() => testimonialInputRef.current?.click()}
                        className="flex-1 bg-gray-100 text-gray-600 px-6 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                      >
                        <UploadCloud size={16} /> {isUploading ? 'A carregar...' : 'Escolher Foto'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-span-full space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Comentário</label>
                  <textarea 
                    value={newTestimonial.content}
                    onChange={(e) => setNewTestimonial(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 rounded-sm font-sans text-sm min-h-[120px]"
                    placeholder="Escreva aqui o que o cliente disse..."
                  />
                </div>

                <button 
                  onClick={saveTestimonial}
                  disabled={loading || isUploading}
                  className="col-span-full bg-brand-red text-white py-4 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? 'A guardar...' : 'Adicionar Testemunho'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-6 border border-gray-100 rounded-sm shadow-sm relative group">
                  <button 
                    onClick={() => deleteTestimonial(t.id, t.avatar_url)}
                    className="absolute top-4 right-4 p-2 text-gray-200 hover:text-brand-red transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={t.avatar_url || 'https://via.placeholder.com/100'} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-serif text-brand-charcoal">{t.name}</h4>
                      <div className="flex text-brand-gold">
                        {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-sans leading-relaxed italic">"{t.content}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white p-12 border border-gray-100 rounded-sm shadow-sm max-w-4xl">
            <h2 className="text-xl font-serif text-brand-charcoal mb-8">Definições do Site</h2>
            <div className="space-y-12">
              <div className="space-y-6">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Imagem do Banner Principal (Hero)</label>
                
                {heroImageUrl && (
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm border border-gray-100 mb-4 bg-gray-50">
                    <img src={heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest">Antevisão Atual</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <input 
                    type="file" 
                    ref={heroInputRef}
                    onChange={handleHeroUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button 
                    onClick={() => heroInputRef.current?.click()}
                    disabled={loading}
                    className="flex-1 bg-brand-charcoal text-white px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    {loading ? 'A Carregar...' : 'Alterar Imagem do Banner'}
                  </button>
                </div>
                
                <div className="pt-6 border-t border-gray-50">
                   <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">Ou introduza um URL direto:</p>
                   <div className="flex gap-4">
                    <input 
                      type="text"
                      placeholder="https://..."
                      value={heroImageUrl}
                      onChange={(e) => setHeroImageUrl(e.target.value)}
                      className="flex-1 bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 rounded-sm font-sans text-sm"
                    />
                    <button 
                      onClick={saveSettings}
                      disabled={loading}
                      className="bg-brand-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all disabled:opacity-50"
                    >
                      Guardar URL
                    </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchData}
        product={selectedProduct}
      />
    </div>
  );
}
