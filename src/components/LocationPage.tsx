import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Facebook, MessageCircle } from 'lucide-react';
import Logo from './Logo';

export default function LocationPage() {
  const contactInfo = [
    { icon: MapPin, text: 'Rua Mouzinho da Silveira nº1/11, 4050-419 Porto', link: 'https://goo.gl/maps/...' },
    { icon: Phone, text: '91 913 9639', link: 'tel:+351919139639' },
    { icon: Phone, text: '22 321 8432', link: 'tel:+351223218432' },
    { icon: MessageCircle, text: '91 913 9639 (WhatsApp)', link: 'https://wa.me/351919139639' },
    { icon: Mail, text: 'socalcosvinhosegourmet@gmail.com', link: 'mailto:socalcosvinhosegourmet@gmail.com' },
    { icon: Facebook, text: 'facebook.com/socalcosvinhosegourmet', link: 'https://www.facebook.com/socalcosvinhosegourmet/' },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif text-brand-charcoal mb-4"
          >
            Localização da nossa loja
          </motion.h1>
          <div className="w-24 h-1 bg-brand-red mx-auto" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contact Info & Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center lg:items-start space-y-12"
          >
            <Logo variant="vertical" className="w-64 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" />

            <div className="space-y-4 w-full">
              {contactInfo.map((item, index) => {
                const isMail = item.icon === Mail;
                const Component = isMail ? motion.div : motion.a;
                const componentProps = isMail ? {} : {
                  href: item.link,
                  target: "_blank",
                  rel: "noopener noreferrer"
                };

                return (
                  <Component
                    key={index}
                    {...componentProps}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className={`flex items-center gap-6 p-2 rounded-sm border border-transparent ${isMail ? '' : 'hover:border-brand-gold/20 hover:bg-brand-charcoal/[0.02] cursor-pointer'} transition-all group`}
                  >
                    <div className={`w-14 h-14 bg-brand-charcoal text-white flex items-center justify-center rounded-sm shadow-xl ${isMail ? '' : 'group-hover:bg-brand-red'} transition-all duration-500`}>
                      <item.icon size={22} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">
                        {item.icon === MapPin ? 'Morada' : 
                         item.icon === Phone && item.text.startsWith('91') ? 'Telemóvel' :
                         item.icon === Phone ? 'Telefone Fixo' :
                         item.icon === MessageCircle ? 'WhatsApp' :
                         item.icon === Mail ? 'Email' : 'Redes Sociais'}
                      </span>
                      <span className={`text-brand-charcoal font-serif text-lg ${isMail ? '' : 'group-hover:text-brand-red'} transition-colors duration-500`}>
                        {item.text}
                      </span>
                    </div>
                  </Component>
                );
              })}
            </div>
          </motion.div>

          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="aspect-square w-full bg-gray-100 rounded-sm overflow-hidden shadow-2xl border-8 border-white">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2730.7935626728677!2d-8.617240924303694!3d41.14204847133209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2464e04afd9095%3A0x2f6c32c775c88a95!2sSocalcos%20Vinhos%20%26%20Gourmet%20Garrafeira!5e1!3m2!1spt-PT!2spt!4v1778862390156!5m2!1spt-PT!2spt" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </motion.div>
        </div>

        {/* Street View Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-2xl font-serif text-brand-charcoal mb-8 text-center italic">Veja a nossa entrada</h3>
          <div className="aspect-[21/9] w-full bg-gray-100 rounded-sm overflow-hidden shadow-2xl border-8 border-white">
             <iframe 
                src="https://www.google.com/maps/embed?pb=!4v1778862526159!6m8!1m7!1sRSOcQVkws3-a9qhd0g0fcw!2m2!1d41.14217695858039!2d-8.614378335808272!3f294.27247970330296!4f5.450796164317765!5f0.7820865974627469" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
