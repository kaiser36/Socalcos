import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface ResetPasswordPageProps {
  onComplete: () => void;
}

export default function ResetPasswordPage({ onComplete }: ResetPasswordPageProps) {
  const { setIsRecoveringPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError('A palavra-passe deve conter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As palavras-passe não coincidem.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: password });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar palavra-passe.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setIsRecoveringPassword(false);
    // Clear hash tokens from URL
    window.history.pushState(null, '', window.location.pathname + window.location.search);
    onComplete();
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-gray-50/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-sm border border-gray-100 shadow-xl shadow-gray-200/50"
      >
        {success ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center text-green-600">
              <CheckCircle2 size={56} strokeWidth={1.5} className="animate-bounce" />
            </div>
            <h2 className="text-3xl font-serif text-brand-charcoal">
              Palavra-passe Redefinida!
            </h2>
            <p className="text-sm text-gray-400 font-sans leading-relaxed">
              A sua palavra-passe foi atualizada com sucesso. Já pode iniciar sessão com as suas novas credenciais.
            </p>
            <button
              onClick={handleFinish}
              className="w-full bg-brand-red text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-red/90 transition-all rounded-sm shadow-lg shadow-brand-red/10 flex items-center justify-center gap-3"
            >
              Ir para o Início de Sessão
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif text-brand-charcoal mb-2">
                Nova Palavra-passe
              </h2>
              <p className="text-sm text-gray-400 font-sans">
                Introduza e confirme a sua nova palavra-passe de acesso.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-brand-red/5 border border-brand-red/20 text-brand-red text-xs font-medium rounded-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="password"
                    placeholder="Nova Palavra-passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-none py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    required
                    type="password"
                    placeholder="Confirmar Nova Palavra-passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 border-none py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-brand-red text-white py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-red/90 transition-all rounded-sm shadow-lg shadow-brand-red/10 flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Definir Palavra-passe
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
