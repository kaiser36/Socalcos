import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, Upload, Tag, Hash, Layers, ListTree, Euro, Package, Calendar, User, Home, MapPin, Globe, Droplet, Percent, Scale, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
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
    subcategory_ids: [],
    producer: '',
    property: '',
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
      setFormData({
        ...product,
        subcategory_ids: product.subcategory_ids || []
      });
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
        subcategory_ids: [],
        producer: '',
        property: '',
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

            <form onSubmit={handleSubmit} className="px-12 py-12 space-y-12 max-w-6xl mx-auto w-full flex-1">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column: Media & Visibility */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-red">Visual & Estado</h3>
                    
                    <div className="aspect-[3/4] bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm overflow-hidden flex flex-col items-center justify-center relative group transition-all hover:border-brand-red/30">
                      {formData.image ? (
                        <>
                          <img src={formData.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-brand-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                            <button 
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-white text-brand-charcoal px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-brand-red hover:text-white transition-all shadow-xl"
                            >
                              Alterar Foto
                            </button>
                          </div>
                        </>
                      ) : (
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center gap-4 text-gray-400 hover:text-brand-red transition-all"
                        >
                          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                            <Upload size={24} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-center px-8 leading-relaxed">Clique para carregar ou tirar foto</span>
                        </button>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-3">
                          <Loader2 className="animate-spin text-brand-red" size={32} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red">A processar...</span>
                        </div>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-sm transition-all hover:bg-gray-100 cursor-pointer group" onClick={() => setFormData({ ...formData, published: !formData.published })}>
                        <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal">Publicado</p>
                          <p className="text-[9px] text-gray-400">Visível para clientes na loja</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full transition-all relative ${formData.published ? 'bg-green-500' : 'bg-gray-300'}`}>
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${formData.published ? 'left-6' : 'left-1'}`} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Taxa IVA (%)</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[23, 13, 6].map(rate => (
                            <button
                              key={rate}
                              type="button"
                              onClick={() => setFormData({ ...formData, tax_rate: rate })}
                              className={`py-2 text-xs font-bold rounded-sm border transition-all ${formData.tax_rate === rate ? 'bg-brand-red border-brand-red text-white shadow-lg shadow-brand-red/20' : 'bg-white border-gray-100 text-gray-400 hover:border-brand-red/30'}`}
                            >
                              {rate}%
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Form Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Section: Identificação */}
                  <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-8">
                    <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-red border-b border-gray-50 pb-4">Identificação do Produto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Tag size={12} /> Nome Comercial
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-gray-50/50 border-b border-gray-100 py-4 px-0 outline-none focus:border-brand-red transition-all font-serif text-xl text-brand-charcoal placeholder:text-gray-200"
                          placeholder="Ex: Vinho do Porto Vintage 2011"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Hash size={12} /> SKU / Referência Interna
                        </label>
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-mono text-sm rounded-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Layers size={12} /> Categoria de Venda
                        </label>
                        <select
                          value={formData.category_id}
                          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm appearance-none"
                        >
                          <option value="">Selecionar...</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <ListTree size={12} /> Sub-Categorias (Múltiplas)
                        </label>
                        <div className="grid grid-cols-2 gap-3 bg-gray-50/50 p-4 rounded-sm border border-transparent focus-within:bg-white focus-within:border-gray-100 transition-all">
                          {categories
                            .filter(c => c.parent_id === formData.category_id)
                            .map(cat => {
                              const isSelected = formData.subcategory_ids?.includes(cat.id);
                              return (
                                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                  <div 
                                    onClick={() => {
                                      const current = formData.subcategory_ids || [];
                                      const next = isSelected 
                                        ? current.filter(id => id !== cat.id)
                                        : [...current, cat.id];
                                      setFormData({ ...formData, subcategory_ids: next });
                                    }}
                                    className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${isSelected ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-gray-200 group-hover:border-brand-red/30'}`}
                                  >
                                    {isSelected && <CheckCircle2 size={12} />}
                                  </div>
                                  <span className={`text-xs transition-colors ${isSelected ? 'text-brand-charcoal font-bold' : 'text-gray-400'}`}>{cat.name}</span>
                                </label>
                              );
                            })}
                          {categories.filter(c => c.parent_id === formData.category_id).length === 0 && (
                            <p className="text-[10px] text-gray-400 italic col-span-2">Selecione uma categoria principal para ver as sub-categorias.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Ficha Técnica */}
                  <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-8">
                    <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-red border-b border-gray-50 pb-4">Especificações Técnicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Euro size={12} /> Preço Base (€)
                        </label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-lg font-bold text-brand-charcoal rounded-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Package size={12} /> Stock Atual
                        </label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Calendar size={12} /> Colheita (Vintage)
                        </label>
                        <input
                          type="text"
                          value={formData.harvest}
                          onChange={(e) => setFormData({ ...formData, harvest: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <User size={12} /> Produtor
                        </label>
                        <input
                          type="text"
                          value={formData.producer}
                          onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Home size={12} /> Propriedade / Quinta
                        </label>
                        <input
                          type="text"
                          value={formData.property}
                          onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <MapPin size={12} /> Região
                        </label>
                        <input
                          type="text"
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Globe size={12} /> País
                        </label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Droplet size={12} /> Capacidade
                        </label>
                        <input
                          type="text"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Percent size={12} /> Teor Alcoólico (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.alcohol_content}
                          onChange={(e) => setFormData({ ...formData, alcohol_content: parseFloat(e.target.value) })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <Scale size={12} /> Peso para Portes (kg)
                        </label>
                        <input
                          type="number"
                          step="0.001"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section: Conteúdo */}
                  <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-red border-b border-gray-50 pb-4">Descrição & Conteúdo</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <FileText size={12} /> Descrição do Produto
                        </label>
                        <textarea
                          rows={6}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm resize-none"
                          placeholder="Descreva a história, notas de prova e detalhes únicos deste vinho..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 flex items-center gap-2">
                          <AlertCircle size={12} /> Alergénios
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Contém Sulfitos"
                          value={formData.allergens}
                          onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                          className="w-full bg-gray-50/50 border border-transparent focus:bg-white focus:border-gray-100 py-4 px-4 outline-none transition-all font-sans text-sm rounded-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
