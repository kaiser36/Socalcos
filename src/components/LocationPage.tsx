import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Phone, Mail, Facebook, MessageCircle, Eye, Info } from 'lucide-react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';

interface Hotspot {
  x: string;
  y: string;
  label: Record<'pt' | 'en', string>;
  description: Record<'pt' | 'en', string>;
}

interface StoreZone {
  id: string;
  name: Record<'pt' | 'en', string>;
  subtitle: Record<'pt' | 'en', string>;
  description: Record<'pt' | 'en', string>;
  image: string;
  hotspots: Hotspot[];
}

const storeZones: StoreZone[] = [
  {
    id: 'cellar',
    name: {
      pt: 'Garrafeira de Seleção',
      en: 'Selected Wine Cellar'
    },
    subtitle: {
      pt: 'Vinhos de Mesa e Colheitas Exclusivas',
      en: 'Table Wines and Exclusive Harvests'
    },
    description: {
      pt: 'Nesta área reunimos uma curadoria meticulosa das melhores regiões vitivinícolas de Portugal, com destaque especial para os vinhos de mesa superiores do Douro.',
      en: 'In this area we gather a meticulous curation of the best wine regions in Portugal, with special emphasis on the superior table wines of the Douro.'
    },
    image: '/images/galeria-1.jpg',
    hotspots: [
      {
        x: '30%',
        y: '40%',
        label: { pt: 'Vinhos Tintos Superiores', en: 'Superior Red Wines' },
        description: { pt: 'Colheitas encorpadas com grande potencial de envelhecimento.', en: 'Full-bodied crops with high aging potential.' }
      },
      {
        x: '65%',
        y: '60%',
        label: { pt: 'Brancos do Douro & Minho', en: 'Douro & Minho Whites' },
        description: { pt: 'Vinhos frescos, aromáticos e minerais selecionados a dedo.', en: 'Fresh, aromatic, and mineral wines handpicked for you.' }
      }
    ]
  },
  {
    id: 'gourmet',
    name: {
      pt: 'Espaço Gourmet',
      en: 'Gourmet Corner'
    },
    subtitle: {
      pt: 'Queijos, Compotas e Charcutaria Tradicional',
      en: 'Cheeses, Jams, and Traditional Charcuterie'
    },
    description: {
      pt: 'Uma seleção de produtos gourmet portugueses que acompanham na perfeição as nossas garrafas de vinho, criando harmonizações inesquecíveis.',
      en: 'A selection of Portuguese gourmet products that perfectly match our wine bottles, creating unforgettable pairings.'
    },
    image: '/images/galeria-2.jpg',
    hotspots: [
      {
        x: '40%',
        y: '55%',
        label: { pt: 'Queijos de Ovelha e Cabra', en: 'Sheep & Goat Cheeses' },
        description: { pt: 'Queijos artesanais intensos, incluindo a famosa Serra da Estrela.', en: 'Artisanal intense cheeses, including the famous Serra da Estrela.' }
      },
      {
        x: '75%',
        y: '35%',
        label: { pt: 'Compotas de Fruta Regional', en: 'Regional Fruit Jams' },
        description: { pt: 'Doce tradicional preparado de forma caseira com frutas selecionadas.', en: 'Traditional jams prepared homemade with selected fruits.' }
      }
    ]
  },
  {
    id: 'tasting',
    name: {
      pt: 'Mesa de Degustação',
      en: 'Tasting Table'
    },
    subtitle: {
      pt: 'Partilha de Aromas e Harmonizações',
      en: 'Sharing Aromas and Pairings'
    },
    description: {
      pt: 'O espaço central onde os nossos clientes podem provar uma seleção de Portos raros e vinhos do Douro sob a orientação especializada da nossa equipa.',
      en: 'The central area where our clients can taste a selection of rare Ports and Douro wines under the expert guidance of our team.'
    },
    image: '/images/galeria-3.jpg',
    hotspots: [
      {
        x: '50%',
        y: '50%',
        label: { pt: 'Provas Dinâmicas', en: 'Dynamic Wine Tastings' },
        description: { pt: 'Eventos de degustação e partilha de histórias por trás de cada colheita.', en: 'Tasting events and sharing stories behind each harvest.' }
      },
      {
        x: '20%',
        y: '65%',
        label: { pt: 'Aconselhamento Sommelier', en: 'Sommelier Advice' },
        description: { pt: 'Conversa direta com Bruno Pinto para encontrar a garrafa perfeita.', en: 'Direct chat with Bruno Pinto to find the perfect bottle.' }
      }
    ]
  },
  {
    id: 'storefront',
    name: {
      pt: 'A Entrada & Atmosfera',
      en: 'The Entrance & Atmosphere'
    },
    subtitle: {
      pt: 'Onde o Tradicional Encontra o Moderno',
      en: 'Where Tradition Meets Modernity'
    },
    description: {
      pt: 'Situada junto ao antigo Mercado Ferreira Borges, a nossa fachada convida locais e turistas a entrarem num espaço amplo e acolhedor.',
      en: 'Situated next to the historic Ferreira Borges Market, our storefront invites locals and tourists to step into a spacious and welcoming room.'
    },
    image: '/images/loja-socalcos.jpg',
    hotspots: [
      {
        x: '45%',
        y: '45%',
        label: { pt: 'Edifício Reabilitado', en: 'Rehabilitated Building' },
        description: { pt: 'Arquitetura que preserva a herança histórica do Porto.', en: 'Architecture that preserves Porto\'s historical heritage.' }
      },
      {
        x: '70%',
        y: '70%',
        label: { pt: 'Consultoria Exclusiva', en: 'Exclusive Consultation' },
        description: { pt: 'Serviço atencioso e personalizado para todos os visitantes.', en: 'Attentive and personalized service for all visitors.' }
      }
    ]
  }
];

export default function LocationPage() {
  const { language } = useLanguage();
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const activeZone = storeZones[activeZoneIndex];

  const contactInfo = [
    { icon: MapPin, text: 'Rua Mouzinho da Silveira nº1/11, 4050-419 Porto', link: 'https://goo.gl/maps/cTepW641t1mZc8H89' },
    { icon: Phone, text: '91 913 9639', link: 'tel:+351919139639' },
    { icon: Phone, text: '22 321 8432', link: 'tel:+351223218432' },
    { icon: MessageCircle, text: '91 913 9639 (WhatsApp)', link: 'https://wa.me/351919139639' },
    { icon: Mail, text: 'socalcosvinhosegourmet@gmail.com', link: 'mailto:socalcosvinhosegourmet@gmail.com' },
    { icon: Facebook, text: 'facebook.com/socalcosvinhosegourmet', link: 'https://www.facebook.com/socalcosvinhosegourmet/' },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-white text-brand-charcoal overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-4"
          >
            {language === 'pt' ? 'Onde nos Encontrar' : 'Where to Find Us'}
          </motion.h1>
          <div className="w-16 h-0.5 bg-brand-red mx-auto" />
        </header>

        {/* Main Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Contact Info & Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center lg:items-start space-y-10"
          >
            <Logo variant="vertical" className="w-56 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700" />

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
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className={`flex items-center gap-5 p-2 rounded-sm border border-transparent ${isMail ? '' : 'hover:border-brand-gold/20 hover:bg-brand-charcoal/[0.02] cursor-pointer'} transition-all group`}
                  >
                    <div className={`w-12 h-12 bg-brand-charcoal text-white flex items-center justify-center rounded-sm shadow-md ${isMail ? '' : 'group-hover:bg-brand-red'} transition-all duration-500`}>
                      <item.icon size={18} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-0.5">
                        {item.icon === MapPin ? (language === 'pt' ? 'Morada' : 'Address') : 
                         item.icon === Phone && item.text.startsWith('91') ? (language === 'pt' ? 'Telemóvel' : 'Mobile') :
                         item.icon === Phone ? (language === 'pt' ? 'Telefone Fixo' : 'Landline') :
                         item.icon === MessageCircle ? 'WhatsApp' :
                         item.icon === Mail ? 'Email' : (language === 'pt' ? 'Redes Sociais' : 'Social Networks')}
                      </span>
                      <span className={`text-brand-charcoal font-serif text-base ${isMail ? '' : 'group-hover:text-brand-red'} transition-colors duration-500`}>
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
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="aspect-square w-full bg-gray-50 rounded-sm overflow-hidden shadow-xl border-4 border-neutral-100">
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

        {/* INTERACTIVE STORE TOUR (VISITE-NOS NO PORTO) */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-red block mb-2">
              {language === 'pt' ? 'Experiência Física' : 'Physical Experience'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif">
              {language === 'pt' ? 'Visite-nos no Porto' : 'Visit Us in Porto'}
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto mt-3">
              {language === 'pt'
                ? 'Explore as diferentes secções do nosso espaço. Clique nos pontos interativos brilhantes para descobrir a curadoria de cada zona.'
                : 'Explore the different sections of our room. Click on the shining interactive hotspots to discover the curation of each zone.'}
            </p>
          </div>

          {/* Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-3xl mx-auto">
            {storeZones.map((zone, idx) => {
              const isActive = idx === activeZoneIndex;
              return (
                <button
                  key={zone.id}
                  onClick={() => {
                    setActiveZoneIndex(idx);
                    setSelectedHotspot(null);
                  }}
                  className={`px-6 py-2.5 text-xs font-bold tracking-wider uppercase rounded-sm border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-brand-charcoal border-brand-charcoal text-white shadow-md' 
                      : 'bg-white border-gray-200 text-gray-500 hover:border-brand-red hover:text-brand-red'
                  }`}
                >
                  {zone.name[language]}
                </button>
              );
            })}
          </div>

          {/* Tour Viewport */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-sm p-6 md:p-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Interactive Image Container */}
            <div className="lg:col-span-7 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeZoneIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-[4/3] w-full rounded-sm overflow-hidden shadow-lg relative bg-gray-200"
                >
                  <img
                    src={activeZone.image}
                    alt={activeZone.name[language]}
                    className="w-full h-full object-cover"
                  />

                  {/* Hotspots Overlay */}
                  {activeZone.hotspots.map((hs, hsIdx) => {
                    const isHotspotActive = selectedHotspot?.label.pt === hs.label.pt;

                    return (
                      <button
                        key={hsIdx}
                        onClick={() => setSelectedHotspot(hs)}
                        style={{ left: hs.x, top: hs.y }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                      >
                        {/* Shimmer rings */}
                        <span className="absolute inline-flex h-8 w-8 rounded-full bg-brand-red/40 animate-ping -left-2.5 -top-2.5 opacity-75" />
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white transition-all shadow-md ${
                          isHotspotActive ? 'bg-brand-gold scale-125' : 'bg-brand-red group-hover:bg-brand-gold'
                        }`} />
                        
                        {/* Hover mini-tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-brand-charcoal text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
                          {hs.label[language]}
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-brand-gold">
                  {activeZone.subtitle[language]}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-brand-charcoal mt-1">
                  {activeZone.name[language]}
                </h3>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed font-sans">
                {activeZone.description[language]}
              </p>

              {/* Dynamic details when a hotspot is clicked */}
              <div className="bg-white border border-gray-100 p-4 rounded-sm shadow-sm min-h-[100px] flex flex-col justify-center transition-all">
                <AnimatePresence mode="wait">
                  {selectedHotspot ? (
                    <motion.div
                      key={selectedHotspot.label.pt}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2 text-brand-red">
                        <Info size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {selectedHotspot.label[language]}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-sans">
                        {selectedHotspot.description[language]}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-selection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-xs text-gray-400 italic flex flex-col items-center gap-2"
                    >
                      <Eye size={18} className="text-gray-300 animate-pulse" />
                      <span>
                        {language === 'pt'
                          ? 'Clique nos pontos vermelhos interativos sobre a foto para explorar'
                          : 'Click on the interactive red dots on the photo to explore'}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </section>

        {/* Street View Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <h3 className="text-2xl font-serif text-brand-charcoal mb-8 text-center italic">
            {language === 'pt' ? 'Veja a nossa entrada' : 'See our entrance'}
          </h3>
          <div className="aspect-[21/9] w-full bg-gray-50 rounded-sm overflow-hidden shadow-xl border-4 border-neutral-100">
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
