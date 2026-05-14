import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const { user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  React.useEffect(() => {
    if (user && loginSuccess) {
      const timer = setTimeout(() => {
        if (isAdmin) onNavigate('admin');
        else onNavigate('home');
      }, 1500);
      return () => clearTimeout(timer);
    } else if (user) {
      // Direct access redirect
      if (isAdmin) onNavigate('admin');
      else onNavigate('home');
    }
  }, [user, isAdmin, onNavigate, loginSuccess]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              role: 'user' // Default role
            }
          }
        });
        if (error) throw error;
        alert('Verifique o seu email para confirmar a conta!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setLoginSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex items-center justify-center bg-gray-50/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-10 rounded-sm border border-gray-100 shadow-xl shadow-gray-200/50"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-brand-charcoal mb-2">
            {isSignUp ? 'Criar Conta' : 'Aceder ao Backoffice'}
          </h2>
          <p className="text-sm text-gray-400 font-sans">
            {isSignUp ? 'Junte-se à Socalcos e explore o Douro' : 'Introduza os seus dados para continuar'}
          </p>
        </div>

        {loginSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 text-xs font-bold uppercase tracking-widest rounded-sm text-center">
            Login realizado com sucesso!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-brand-red/5 border border-brand-red/20 text-brand-red text-xs font-medium rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-none py-4 pl-12 pr-4 outline-none focus:ring-1 focus:ring-brand-red/20 transition-all font-sans text-sm rounded-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                required
                type="password"
                placeholder="Palavra-passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {isSignUp ? 'Registar' : 'Entrar'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-red transition-all"
          >
            {isSignUp ? 'Já tem conta? Inicie Sessão' : 'Não tem conta? Registe-se'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
