import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Mail, Shield, LogOut, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
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

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-gray-50/30">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-sm border border-gray-100 shadow-xl shadow-gray-200/50"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="w-20 h-20 bg-brand-red/5 text-brand-red rounded-full flex items-center justify-center">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-brand-charcoal">O Meu Perfil</h2>
              <p className="text-sm text-gray-400 font-sans">{user?.email}</p>
            </div>
          </div>

          {success && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-600 text-xs font-bold uppercase tracking-widest rounded-sm">
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
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-gray-50 border-none py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Telefone</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border-none py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-serif text-brand-charcoal">Dados de Envio Padrão</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Morada</label>
                  <input
                    type="text"
                    value={formData.morada}
                    onChange={(e) => setFormData({ ...formData, morada: e.target.value })}
                    className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Cidade</label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Código Postal</label>
                  <input
                    type="text"
                    value={formData.codigoPostal}
                    onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                    className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400">País</label>
                  <input
                    type="text"
                    value={formData.pais}
                    onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                    className="w-full bg-gray-50 border-none py-4 px-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4">
              <button
                disabled={loading}
                type="submit"
                className="flex-1 bg-brand-red text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-red/90 transition-all rounded-sm shadow-lg shadow-brand-red/10 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={16} /> Guardar Alterações</>}
              </button>
              <button
                type="button"
                onClick={signOut}
                className="md:w-48 bg-gray-100 text-gray-500 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-200 transition-all rounded-sm flex items-center justify-center gap-3"
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
