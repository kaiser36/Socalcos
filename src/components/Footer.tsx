import { Instagram, Facebook } from 'lucide-react';

import Logo from './Logo';

export default function Footer({ onNavigate }: { onNavigate: (page: any) => void }) {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-brand-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
        <div className="col-span-1 md:col-span-1">
          <Logo className="mb-8" variant="vertical" />
          <p className="text-[10px] font-bold tracking-widest text-brand-charcoal uppercase leading-relaxed mb-8">
            © SOCALCOS VINHOS & GOURMET.<br/>ALL RIGHTS RESERVED.
          </p>
          <div className="flex flex-col gap-4">
            <a href="https://www.livroreclamacoes.pt/" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://www.livroreclamacoes.pt/assets/img/logo_reclamacoes.png" 
                alt="Livro de Reclamações" 
                className="h-10 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Explorar</h4>
          <ul className="space-y-4 text-sm font-sans text-brand-charcoal">
            <li><button onClick={() => onNavigate('about')} className="hover:text-brand-red transition-colors text-left">Quem Somos</button></li>
            <li><button onClick={() => onNavigate('location')} className="hover:text-brand-red transition-colors text-left">Localização</button></li>
            <li><button onClick={() => onNavigate('gallery')} className="hover:text-brand-red transition-colors text-left">Galeria</button></li>
            <li><button onClick={() => onNavigate('admin')} className="hover:text-brand-red transition-colors text-left opacity-30 hover:opacity-100">Backoffice</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Informação</h4>
          <ul className="space-y-4 text-sm font-sans text-brand-charcoal">
            <li><button onClick={() => onNavigate('terms')} className="hover:text-brand-red transition-colors text-left underline underline-offset-4 decoration-brand-gold">Termos e Condições</button></li>
            <li><button onClick={() => onNavigate('privacy')} className="hover:text-brand-red transition-colors text-left">Política de Privacidade</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Siga-Nos</h4>
          <ul className="space-y-4 text-sm font-sans text-brand-charcoal">
            <li>
              <a href="https://www.facebook.com/socalcosvinhosegourmet/" target="_blank" className="flex items-center gap-3 hover:text-brand-red transition-colors">
                <Facebook size={18} /> Facebook
              </a>
            </li>
            <li>
              <a href="https://wa.me/351919139639" target="_blank" className="flex items-center gap-3 hover:text-brand-red transition-colors">
                <Instagram size={18} className="opacity-0 w-0" /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
          <div className="space-y-4">
             <p className="text-[9px] uppercase tracking-widest text-gray-400 leading-relaxed max-w-xl">
               Em caso de litígio o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo: Centro de Informação de Consumo e Arbitragem do Porto. Mais informações em www.cicap.pt
             </p>
             <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-red">
               Seja responsável. Beba com moderação.
             </p>
          </div>
          <div className="md:text-right">
             <p className="text-[9px] text-gray-400 uppercase tracking-widest">
               Design & Desenvolvimento por Kaiser36
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
