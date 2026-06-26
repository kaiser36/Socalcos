import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Mail, Info, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

export default function Checkout({ items, onBack, onComplete }: CheckoutProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    apelido: '',
    morada: '',
    cidade: '',
    codigoPostal: '',
    telefone: '',
    pais: '',
    paymentMethod: 'email'
  });

  React.useEffect(() => {
    if (user) {
      const names = (user.user_metadata?.full_name || '').split(' ');
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        nome: names[0] || '',
        apelido: names.slice(1).join(' ') || '',
        telefone: user.user_metadata?.phone || '',
        morada: user.user_metadata?.morada || '',
        cidade: user.user_metadata?.cidade || '',
        codigoPostal: user.user_metadata?.codigoPostal || '',
        pais: user.user_metadata?.pais || ''
      }));
    }
  }, [user]);

  const totalPriceWithVat = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const total = totalPriceWithVat + shipping;

  const totalVat = items.reduce((acc, item) => {
    const defaultTaxRate = item.category_id === 'f6d05bbb-be25-4b3d-b87b-8c8aad3db1c2' ? 13 : 23;
    const taxRate = item.tax_rate || defaultTaxRate;
    const itemVat = item.price - (item.price / (1 + taxRate / 100));
    return acc + itemVat * item.quantity;
  }, 0);

  const subtotal = totalPriceWithVat - totalVat;

  const formatPrice = (val: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(val);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      setLoading(true);
      try {
        // 1. Create order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_name: `${formData.nome} ${formData.apelido}`,
            customer_email: formData.email,
            customer_phone: formData.telefone,
            address: formData.morada,
            city: formData.cidade,
            postal_code: formData.codigoPostal,
            country: formData.pais,
            total: total,
            status: 'pending'
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Disparar o envio do e-mail de confirmação via Vercel Serverless Function (em background)
        fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order_id: order.id,
            customer_name: `${formData.nome} ${formData.apelido}`,
            customer_email: formData.email,
            total: total,
            items: items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            }))
          })
        }).catch(err => {
          console.error('Erro ao solicitar envio do e-mail:', err);
        });

        onComplete();
      } catch (err: any) {
        alert('Erro ao processar pedido: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-red transition-colors mb-12"
      >
        <ArrowLeft size={16} /> Voltar ao Carrinho
      </button>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Main Form */}
        <div className="flex-1">
          <div className="flex items-center gap-8 mb-12">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-brand-red' : 'text-gray-300'}`}>
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${step >= 1 ? 'border-brand-red bg-brand-red text-white' : 'border-gray-200'}`}>1</span>
              <span className="text-xs font-bold tracking-widest uppercase">Envio</span>
            </div>
            <div className="h-px bg-gray-100 flex-1" />
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-brand-red' : 'text-gray-300'}`}>
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${step >= 2 ? 'border-brand-red bg-brand-red text-white' : 'border-gray-200'}`}>2</span>
              <span className="text-xs font-bold tracking-widest uppercase">Confirmação</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {step === 1 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-serif mb-6">Informação de Contacto</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      name="nome"
                      placeholder="Nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="border-b border-gray-200 py-3 focus:border-brand-red outline-none transition-all font-sans"
                    />
                    <input
                      required
                      type="text"
                      name="apelido"
                      placeholder="Apelido"
                      value={formData.apelido}
                      onChange={handleInputChange}
                      className="border-b border-gray-200 py-3 focus:border-brand-red outline-none transition-all font-sans"
                    />
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-b border-gray-200 py-3 focus:border-brand-red outline-none transition-all font-sans"
                    />
                    <input
                      required
                      type="tel"
                      name="telefone"
                      placeholder="Telefone / Telemóvel"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="border-b border-gray-200 py-3 focus:border-brand-red outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-serif mb-6">Dados de Envio</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      type="text"
                      name="morada"
                      placeholder="Morada"
                      value={formData.morada}
                      onChange={handleInputChange}
                      className="sm:col-span-2 border-b border-gray-200 py-3 focus:border-brand-red outline-none transition-all font-sans"
                    />
                    <input
                      required
                      type="text"
                      name="cidade"
                      placeholder="Cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="border-b border-gray-200 py-3 focus:border-brand-red outline-none transition-all font-sans"
                    />
                    <input
                      required
                      type="text"
                      name="codigoPostal"
                      placeholder="Código Postal (ex: 4000-000)"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                      className="border-b border-gray-200 py-3 focus:border-brand-red outline-none transition-all font-sans"
                    />
                    <input
                      required
                      type="text"
                      name="pais"
                      placeholder="País"
                      value={formData.pais}
                      onChange={handleInputChange}
                      className="border-b border-gray-200 py-3 focus:border-brand-red outline-none transition-all font-sans"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-serif mb-6">Confirmação de Pedido</h3>
                
                <div className="p-8 border border-brand-red bg-brand-red/5 rounded-sm space-y-6">
                  <div className="flex items-center gap-4 text-brand-red">
                    <Mail size={24} />
                    <span className="text-lg font-serif font-medium">Pedido da encomenda por email</span>
                  </div>
                  
                  <div className="flex gap-4 p-4 bg-white/50 rounded-sm border border-brand-red/10">
                    <Info size={20} className="text-brand-red shrink-0 mt-1" />
                    <p className="text-sm font-sans leading-relaxed text-brand-charcoal">
                      É necessário verificar a disponibilidade do Stock ou prazos de entrega. 
                      Entraremos em contato para confirmar a sua encomenda, acertar o envio e o pagamento.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex justify-between items-center pt-8 border-t border-gray-100">
              {step === 2 && (
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-brand-charcoal transition-all"
                >
                  Voltar ao passo 1
                </button>
              )}
              <button 
                type="submit"
                disabled={loading}
                className="ml-auto bg-brand-red text-white px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-brand-red/90 transition-all rounded-sm shadow-lg shadow-brand-red/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (step === 1 ? 'Continuar para Confirmação' : 'Finalizar Pedido')}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Order Summary */}
        <aside className="w-full lg:w-[400px] bg-white border border-gray-100 p-8 rounded-sm sticky top-32 h-fit">
          <h3 className="text-xl font-serif mb-8 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-brand-red" />
            Resumo do Pedido
          </h3>
          
          <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-20 bg-gray-50 flex items-center justify-center p-2 border border-gray-100 rounded-sm">
                  <img src={item.image} alt={item.name} className="h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-serif text-brand-charcoal leading-tight mb-1">{item.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">Qtd: {item.quantity} <span className="mx-1">•</span> IVA {item.tax_rate || (item.category_id === 'f6d05bbb-be25-4b3d-b87b-8c8aad3db1c2' ? 13 : 23)}%</span>
                    <span className="text-xs font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100 mb-8">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Total IVA</span>
              <span>{formatPrice(totalVat)}</span>
            </div>

            <div className="flex flex-col gap-1 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-lg font-serif text-brand-charcoal">
                <span>Total</span>
                <span className="text-brand-red font-bold">{formatPrice(total)}</span>
              </div>
              <div className="text-right text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                (Inclui IVA à taxa em vigor)
              </div>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 rounded-sm">
            <div className="flex items-start gap-3 opacity-60">
              <ShieldCheck size={18} className="text-brand-gold mt-0.5" />
              <div className="text-[10px] uppercase tracking-widest font-bold">Pagamento Seguro</div>
            </div>
            <p className="text-[9px] text-gray-400 font-sans leading-relaxed">
              Os seus dados são processados de forma segura e encriptada. Ao finalizar a encomenda, concorda com os nossos termos de serviço.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
