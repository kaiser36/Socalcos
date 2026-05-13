import { Instagram, Facebook } from 'lucide-react';

import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-brand-charcoal/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-24">
        <div className="col-span-1 md:col-span-1">
          <Logo className="mb-8 scale-75 origin-left" />
          <p className="text-[10px] font-bold tracking-widest text-brand-charcoal uppercase leading-relaxed">
            © SOCALCOS VINHOS & GOURMET.<br/>ALL RIGHTS RESERVED.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Explorar</h4>
          <ul className="space-y-4 text-sm font-sans text-brand-charcoal">
            <li><a href="#" className="hover:text-brand-red transition-colors">Quem Somos</a></li>
            <li><a href="#" className="hover:text-brand-red transition-colors">Galeria</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Informação</h4>
          <ul className="space-y-4 text-sm font-sans text-brand-charcoal">
            <li><a href="#" className="hover:text-brand-red transition-colors underline underline-offset-4 decoration-brand-gold">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-brand-red transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Siga-Nos</h4>
          <ul className="space-y-4 text-sm font-sans text-brand-charcoal">
            <li>
              <a href="#" className="flex items-center gap-3 hover:text-brand-red transition-colors">
                <Instagram size={18} /> Instagram
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 hover:text-brand-red transition-colors">
                <Facebook size={18} /> Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
