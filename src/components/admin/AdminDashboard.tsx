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
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'overview'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [productsRes, ordersRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false })
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (ordersRes.data) setOrders(ordersRes.data);
    setLoading(false);
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-all ${activeTab === 'products' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Package size={18} /> Produtos
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-all ${activeTab === 'orders' ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <ShoppingBag size={18} /> Encomendas
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
            <h2 className="text-3xl font-serif text-brand-charcoal">
              {activeTab === 'overview' && 'Bem-vindo, Admin'}
              {activeTab === 'products' && 'Gestão de Produtos'}
              {activeTab === 'orders' && 'Gestão de Encomendas'}
            </h2>
            <p className="text-sm text-gray-400 mt-1">Dashboard Administrativo</p>
          </div>
          
          {activeTab === 'products' && (
            <button className="bg-brand-red text-white px-6 py-3 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all flex items-center gap-2 shadow-lg shadow-brand-red/10">
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
                {formatPrice(orders.reduce((acc, curr) => acc + curr.total, 0))}
              </p>
            </div>
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400">Encomendas</h4>
              </div>
              <p className="text-3xl font-serif text-brand-charcoal">{orders.length}</p>
            </div>
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                  <Package size={24} />
                </div>
                <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400">Produtos Ativos</h4>
              </div>
              <p className="text-3xl font-serif text-brand-charcoal">{products.length}</p>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Produto / SKU</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Estado</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400">Preço</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-brand-red transition-colors"><Edit2 size={16} /></button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}
