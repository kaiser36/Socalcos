import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, Category } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: Product | null;
}

export default function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    description: '',
    price: 0,
    weight: 0,
    published: true,
    image: '',
    category_id: '',
    producer: '',
    region: '',
    country: 'Portugal',
    harvest: '',
    capacity: '75cl',
    alcohol_content: 0,
    allergens: '',
    stock: 0,
    tax_rate: 23,
    rating: 5
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
    } catch (err: any) {
      alert('Erro no upload: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        price: 0,
        weight: 0,
        published: true,
        image: '',
        category_id: '',
        producer: '',
        region: '',
        country: 'Portugal',
        harvest: '',
        capacity: '75cl',
        alcohol_content: 0,
        allergens: '',
        stock: 0,
        tax_rate: 23,
        rating: 5
      });
    }
  }, [product, isOpen]);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product?.id) {
        const { error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([formData]);
        if (error) throw error;
      }
      onSave();
      onClose();
    } catch (err: any) {
      alert('Erro ao guardar produto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative w-full h-full bg-white overflow-y-auto flex flex-col"
          >
            <header className="px-12 py-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-2">
                  <X size={24} className="text-gray-400" />
                </button>
                <div>
                  <h2 className="text-3xl font-serif text-brand-charcoal">
                    {product ? 'Editar Produto' : 'Novo Produto'}
                  </h2>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Configuração detalhada do catálogo</p>
                </div>
              </div>
            </header>

            <form onSubmit={handleSubmit} className="px-12 py-12 space-y-12 max-w-5xl mx-auto w-full flex-1">
              {/* Basic Info */}
              <section className="space-y-6">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-red">Informação Base</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Nome do Produto</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">SKU / Referência</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Categoria</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm appearance-none"
                    >
                      <option value="">Selecionar Categoria</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Pricing & Stock */}
              <section className="space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-red">Preço & Stock</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Preço (€)</label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Taxa IVA (%)</label>
                    <select
                      value={formData.tax_rate}
                      onChange={(e) => setFormData({ ...formData, tax_rate: parseInt(e.target.value) })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm appearance-none"
                    >
                      <option value={23}>23% (Normal)</option>
                      <option value={13}>13% (Intermédio)</option>
                      <option value={6}>6% (Reduzido)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Stock Inicial</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                </div>
              </section>

              {/* Technical Specs */}
              <section className="space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-red">Ficha Técnica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Produtor</label>
                    <input
                      type="text"
                      value={formData.producer}
                      onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Colheita</label>
                    <input
                      type="text"
                      value={formData.harvest}
                      onChange={(e) => setFormData({ ...formData, harvest: e.target.value })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Região</label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Capacidade (ex: 75cl)</label>
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Teor Alcoólico (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.alcohol_content}
                      onChange={(e) => setFormData({ ...formData, alcohol_content: parseFloat(e.target.value) })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                      className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                    />
                  </div>
                </div>
              </section>

              {/* Media & Visibility */}
              <section className="space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-red">Media & Visibilidade</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  <div className="md:col-span-1">
                    <div className="aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-100 rounded-sm overflow-hidden flex flex-col items-center justify-center relative group">
                      {formData.image ? (
                        <>
                          <img src={formData.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white text-brand-charcoal px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm"
                            >
                              Alterar Foto
                            </button>
                          </div>
                        </>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center gap-3 text-gray-400 hover:text-brand-red transition-colors"
                        >
                          <Upload size={32} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">Carregar Imagem ou Tirar Foto</span>
                        </button>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                          <Loader2 className="animate-spin text-brand-red" size={24} />
                        </div>
                      )}
                    </div>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">URL da Imagem (Opcional)</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                      />
                    </div>
                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-5 h-5 accent-brand-red rounded border-gray-300"
                      />
                      <label htmlFor="published" className="text-sm font-sans text-brand-charcoal font-medium">Publicar produto na loja (visível para clientes)</label>
                    </div>
                  </div>
                </div>
              </section>
            </form>

            <footer className="px-12 py-8 border-t border-gray-100 bg-gray-50 flex justify-center sticky bottom-0">
              <div className="max-w-5xl w-full flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white border border-gray-200 py-4 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-charcoal hover:border-gray-300 transition-all rounded-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-brand-red text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-brand-red/90 transition-all rounded-sm shadow-lg shadow-brand-red/10 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Guardar Produto</>}
                </button>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
