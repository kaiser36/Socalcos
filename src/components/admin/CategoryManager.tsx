import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Save, X, Layers, ListTree, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Category } from '../../types';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', parent_id: null as string | null });
  const [editValue, setEditValue] = useState('');
  const [editParentId, setEditParentId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    if (data) setCategories(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) return;

    const baseSlug = newCategory.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    // Add a small random suffix to ensure uniqueness
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const { error } = await supabase.from('categories').insert([
      { name: newCategory.name, slug, parent_id: newCategory.parent_id }
    ]);

    if (error) {
      alert('Erro ao adicionar categoria: ' + error.message);
    } else {
      setNewCategory({ name: '', parent_id: null });
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem a certeza? Isto pode afetar produtos nestas categorias.')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        alert('Erro ao apagar categoria: ' + error.message);
      } else {
        fetchCategories();
      }
    }
  };

  const handleUpdate = async (id: string) => {
    const baseSlug = editValue
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const { error } = await supabase
      .from('categories')
      .update({ name: editValue, slug, parent_id: editParentId })
      .eq('id', id);

    if (error) {
      alert('Erro ao atualizar categoria: ' + error.message);
    } else {
      setEditingId(null);
      setEditParentId(null);
      fetchCategories();
    }
  };

  const renderCategories = (parentId: string | null = null, depth = 0) => {
    return categories
      .filter(c => c.parent_id === parentId)
      .map(cat => (
        <div key={cat.id} className="group">
          {/* Category Row */}
          <div 
            className={`px-8 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors border-l-2 ${depth > 0 ? 'border-gray-100' : 'border-transparent'}`}
            style={{ paddingLeft: `${depth * 2 + 2}rem` }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${depth === 0 ? 'bg-brand-red/5 text-brand-red' : 'bg-gray-100 text-gray-400'}`}>
                {depth === 0 ? <Layers size={14} /> : <ListTree size={12} />}
              </div>
              
              {editingId === cat.id ? (
                <div className="flex flex-wrap gap-4 flex-1">
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-white border border-gray-200 outline-none px-3 py-2 text-sm text-brand-charcoal rounded-sm flex-1 min-w-[150px]"
                  />
                  <select
                    value={editParentId || ''}
                    onChange={(e) => setEditParentId(e.target.value || null)}
                    className="bg-white border border-gray-200 outline-none px-3 py-2 text-sm text-brand-charcoal rounded-sm min-w-[150px]"
                  >
                    <option value="">Principal (Sem Pai)</option>
                    {categories.filter(c => c.id !== cat.id).map(c => (
                      <option key={c.id} value={c.id}>Filha de: {c.name}</option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-sm">
                      <Save size={16} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-sm">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <span className={`${depth === 0 ? 'font-serif text-lg text-brand-charcoal' : 'text-sm text-gray-600'}`}>
                  {cat.name}
                </span>
              )}
            </div>

            {!editingId && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setEditingId(cat.id); setEditValue(cat.name); setEditParentId(cat.parent_id || null); }}
                  className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                >
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 text-gray-400 hover:text-brand-red transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
          {/* Recursive call for children */}
          {renderCategories(cat.id, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Add Category Form */}
      <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-brand-red mb-6 flex items-center gap-2">
          <Plus size={14} /> Nova Categoria / Sub-Categoria
        </h3>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Nome da categoria"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full bg-gray-50 border-none py-3 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
            />
          </div>
          <div className="min-w-[200px]">
            <select
              value={newCategory.parent_id || ''}
              onChange={(e) => setNewCategory({ ...newCategory, parent_id: e.target.value || null })}
              className="w-full bg-gray-50 border-none py-3 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm appearance-none"
            >
              <option value="">Principal (Sem Pai)</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>Filha de: {cat.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-brand-red text-white px-8 py-3 text-[10px] font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red/90 transition-all shadow-lg shadow-brand-red/10"
          >
            Adicionar
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-brand-red" size={32} />
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">A carregar estrutura...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {renderCategories()}
            {categories.length === 0 && (
              <div className="p-20 text-center text-gray-400 text-xs uppercase tracking-widest">
                Nenhuma categoria definida.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
