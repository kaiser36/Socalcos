import React, { useState, useEffect } from 'react';
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
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  LayoutDashboard,
  Layers,
  ShoppingCart,
  Database,
  Download,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';
import ProductModal from './ProductModal';
import CategoryManager from './CategoryManager';
import DataManager from './DataManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'overview' | 'data' | 'settings'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Todas');
  const [categories, setCategories] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const { signOut } = useAuth();

  const [stats, setStats] = useState({ products: 0, orders: 0, totalSales: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    // Fetch counts and products with server-side filtering
    let query = supabase.from('products').select('*', { count: 'exact' });
    
    if (selectedCategoryFilter !== 'Todas') {
      query = query.eq('category_id', selectedCategoryFilter);
    }
    
    if (adminSearchQuery) {
      query = query.or(`name.ilike.%${adminSearchQuery}%,sku.ilike.%${adminSearchQuery}%,producer.ilike.%${adminSearchQuery}%`);
    }

    const [productsRes, ordersRes, categoriesRes] = await Promise.all([
      query.order('created_at', { ascending: false }).range(start, end),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (ordersRes.data) {
      setOrders(ordersRes.data);
      const total = ordersRes.data.reduce((acc, curr) => acc + (curr.total || 0), 0);
      setStats(prev => ({ ...prev, orders: ordersRes.data?.length || 0, totalSales: total }));
    }
    if (categoriesRes.data) setCategories(categoriesRes.data);
    if (productsRes.count !== null) setStats(prev => ({ ...prev, products: productsRes.count }));
    
    // Fetch settings
    const { data: settingsData } = await supabase.from('site_settings').select('*');
    if (settingsData) {
      const hero = settingsData.find(s => s.key === 'hero_image')?.value;
      if (hero) setHeroImageUrl(hero);
    }

    setLoading(false);
  };

  const saveSettings = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'hero_image', value: heroImageUrl }, { onConflict: 'key' });
    
    if (!error) {
      alert('Definições guardadas com sucesso!');
      window.location.reload();
    } else {
      alert('Erro ao guardar: ' + error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [adminSearchQuery, selectedCategoryFilter]);

  useEffect(() => {
    fetchData();
  }, [currentPage, adminSearchQuery, selectedCategoryFilter]);

  const filteredProducts = products; // Already filtered server-side

  const toggleFavorite = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update({ is_favorite: !product.is_favorite })
      .eq('id', product.id);
    if (!error) fetchData();
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

        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-all ${activeTab === 'overview' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={18} /> Resumo
          </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${activeTab === 'products' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-brand-charcoal hover:bg-gray-50'}`}
            >
              <Package size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Produtos</span>
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${activeTab === 'categories' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-brand-charcoal hover:bg-gray-50'}`}
            >
              <Layers size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Categorias</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${activeTab === 'orders' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-brand-charcoal hover:bg-gray-50'}`}
            >
              <ShoppingCart size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Encomendas</span>
            </button>
            <button 
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${activeTab === 'data' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-brand-charcoal hover:bg-gray-50'}`}
            >
              <Database size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Importar/Exportar</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all ${activeTab === 'settings' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-brand-charcoal hover:bg-gray-50'}`}
            >
              <Settings size={20} />
              <span className="text-xs font-bold tracking-widest uppercase">Definições</span>
            </button>
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button 
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-serif text-brand-charcoal">
              {activeTab === 'overview' ? 'Painel de Controlo' : 
               activeTab === 'products' ? 'Gestão de Produtos' : 
               activeTab === 'categories' ? 'Estrutura de Categorias' :
               activeTab === 'data' ? 'Importar & Exportar Dados' :
               'Gestão de Encomendas'}
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
              {activeTab === 'overview' ? 'Resumo da atividade da loja' : 
               activeTab === 'products' ? 'Administrar catálogo e stock' : 
               activeTab === 'categories' ? 'Organizar hierarquia de produtos' :
               activeTab === 'data' ? 'Gestão em massa via ficheiros CSV' :
               'Monitorizar vendas e envios'}
            </p>
          </div>
          
          {activeTab === 'products' && (
            <button 
              onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
              className="bg-brand-red text-white px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all flex items-center gap-2 shadow-lg shadow-brand-red/10"
            >
              <Plus size={16} /> Novo Produto
            </button>
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
              <p className="text-3xl font-serif text-brand-charcoal">
                {formatPrice(stats.totalSales)}
              </p>
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
            {/* Admin Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 border border-gray-100 rounded-sm shadow-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text"
                  placeholder="Pesquisar por nome, SKU ou produtor..."
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
              <div className="flex items-center gap-2 px-4 border-l border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {filteredProducts.length} Produtos
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 w-10 text-center">Fav</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Produto / SKU</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Estado</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Preço</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-brand-red/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 text-center" onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}>
                      <button className={`transition-all ${product.is_favorite ? 'text-brand-gold scale-125' : 'text-gray-200 hover:text-brand-gold'}`}>
                        <Plus size={18} className={product.is_favorite ? 'fill-current' : ''} />
                      </button>
                    </td>
                    <td className="px-6 py-4" onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}>
                      <div className="flex items-center gap-4">
                        <img src={product.image} className="w-10 h-12 object-cover rounded-sm border border-gray-100" />
                        <div>
                          <p className="text-sm font-serif font-medium text-brand-charcoal">{product.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">{product.sku || 'Sem SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${product.published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {product.published ? 'Publicado' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-charcoal">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedProduct(product); setIsModalOpen(true); }}
                          className="p-2 text-gray-300 hover:text-brand-red transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-gray-300 hover:text-brand-red transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                A mostrar {products.length} de {stats.products} produtos
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white border border-gray-100 rounded-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Anterior
                </button>
                <div className="px-4 py-2 text-[10px] font-bold text-brand-red bg-white border border-brand-red/10 rounded-sm">
                  Página {currentPage}
                </div>
                <button
                  disabled={currentPage * itemsPerPage >= stats.products}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white border border-gray-100 rounded-sm hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'categories' && <CategoryManager />}

        {activeTab === 'data' && <DataManager />}

        {activeTab === 'settings' && (
          <div className="bg-white p-12 border border-gray-100 rounded-sm shadow-sm max-w-4xl">
            <h2 className="text-xl font-serif text-brand-charcoal mb-8">Definições do Site</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">URL da Imagem do Banner (Hero)</label>
                <input 
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                />
                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Dica: Podes usar um link de uma imagem online ou do teu próprio servidor.</p>
              </div>
              <button 
                onClick={saveSettings}
                disabled={loading}
                className="bg-brand-red text-white px-8 py-4 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Encomenda</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Cliente</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Total</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Estado</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-brand-red">#{order.id.slice(0, 8)}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-brand-charcoal">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-400 font-sans">{order.customer_email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-brand-charcoal">{formatPrice(order.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        order.status === 'pending' ? 'bg-brand-gold/10 text-brand-gold' :
                        order.status === 'confirmed' ? 'bg-blue-50 text-blue-500' :
                        order.status === 'shipped' ? 'bg-green-50 text-green-500' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
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
