import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wine, History, Users, MessageSquare, MapPin, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TimelineEvent {
  year: string;
  title: Record<'pt' | 'en', string>;
  subtitle: Record<'pt' | 'en', string>;
  description: Record<'pt' | 'en', string>;
  image: string;
}

const timelineData: TimelineEvent[] = [
  {
    year: '1944',
    title: {
      pt: 'A Origem: Cabaz do Infante',
      en: 'The Origin: Cabaz do Infante'
    },
    subtitle: {
      pt: 'Fundação por José Rodrigues Pereira',
      en: 'Founded by José Rodrigues Pereira'
    },
    description: {
      pt: 'A nossa jornada começou no coração do Porto pelas mãos de José Rodrigues Pereira, que estabeleceu o Cabaz do Infante como uma referência de produtos tradicionais e de qualidade na cidade.',
      en: 'Our journey began in the heart of Porto by the hands of José Rodrigues Pereira, who established Cabaz do Infante as a reference for traditional and quality products in the city.'
    },
    image: '/images/cabaz-infante-antigo.png'
  },
  {
    year: '1968',
    title: {
      pt: 'A Dedicação de Manuel Pinto',
      en: 'The Dedication of Manuel Pinto'
    },
    subtitle: {
      pt: 'De Marçano a Gerente aos 17 Anos',
      en: 'From Apprentice to Manager at Age 17'
    },
    description: {
      pt: 'Manuel Pinto ingressou como marçano na casa histórica. Com paixão e dedicação incomparáveis à arte do vinho, assumiu a gerência muito jovem, mantendo viva a chama da tradição familiar até aos dias de hoje.',
      en: 'Manuel Pinto joined the historic house as an apprentice. With incomparable passion and dedication to the art of wine, he took over management at a young age, keeping the flame of family tradition alive to this day.'
    },
    image: '/images/manuel-pinto.png'
  },
  {
    year: '2014',
    title: {
      pt: 'O Nascimento da Socalcos',
      en: 'The Birth of Socalcos'
    },
    subtitle: {
      pt: 'Nova Direção e Modernidade por Bruno Pinto',
      en: 'New Direction and Modernity by Bruno Pinto'
    },
    description: {
      pt: 'Sob a visão de Bruno Pinto, filho de Manuel Pinto, nasce a Socalcos Vinhos & Gourmet num edifício histórico reabilitado junto ao antigo Mercado Ferreira Borges, unindo a sabedoria do passado a um conceito moderno, amplo e "clean".',
      en: 'Under the vision of Bruno Pinto, son of Manuel Pinto, Socalcos Vinhos & Gourmet is born in a rehabilitated historic building next to the old Ferreira Borges Market, uniting the wisdom of the past with a modern, spacious and clean concept.'
    },
    image: '/images/nossa-historia.jpg'
  },
  {
    year: 'Hoje',
    title: {
      pt: 'Curadoria de Duas Gerações',
      en: 'Curation of Two Generations'
    },
    subtitle: {
      pt: 'Os Melhores Vinhos e Iguarias Finas',
      en: 'The Best Wines and Fine Delicacies'
    },
    description: {
      pt: 'Hoje a Socalcos é um porto de abrigo para conhecedores. Oferecemos uma curadoria rigorosa que junta os mais raros Vinhos do Porto, vinhos de mesa superiores de pequenos produtores e iguarias gourmet exclusivas.',
      en: 'Today, Socalcos is a haven for connoisseurs. We offer a rigorous curation that combines the rarest Port wines, superior table wines from small producers, and exclusive gourmet delicacies.'
    },
    image: '/images/loja-socalcos.jpg'
  }
];

export default function AboutPage() {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeEvent = timelineData[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % timelineData.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + timelineData.length) % timelineData.length);
  };

  return (
    <div className="pt-32 pb-24 bg-white text-brand-charcoal overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543412849-fd4726551ca0?q=80&w=2670&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-15" 
            alt="Vinha"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="w-12 h-0.5 bg-brand-red" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-brand-charcoal mb-6"
          >
            {language === 'pt' ? 'A Nossa História' : 'Our Story'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-base text-gray-500 font-sans leading-relaxed"
          >
            {language === 'pt' 
              ? 'Entre socalcos e gerações, a nossa família dedica-se à arte de selecionar o que de melhor o Douro e Portugal têm para oferecer.'
              : 'Between terraces and generations, our family dedicates itself to the art of selecting the best that Douro and Portugal have to offer.'}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* PREMIUM INTERACTIVE TIMELINE */}
        <section className="mb-32">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-red block mb-2">
              {language === 'pt' ? 'Linha do Tempo' : 'Historical Timeline'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif">
              {language === 'pt' ? 'A Jornada das Nossas Raízes' : 'The Journey of Our Roots'}
            </h2>
          </div>

          {/* Timeline navigation track */}
          <div className="relative max-w-4xl mx-auto mb-16 px-4">
            {/* Horizontal Line background */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
            
            {/* Animated Golden Active Progress Line */}
            <motion.div 
              className="absolute top-1/2 left-0 h-0.5 bg-brand-gold -translate-y-1/2 z-0 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: activeIndex / (timelineData.length - 1) }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{ right: '0%' }}
            />

            {/* Time Nodes */}
            <div className="relative z-10 flex justify-between items-center">
              {timelineData.map((event, idx) => {
                const isActive = idx === activeIndex;
                const isPassed = idx < activeIndex;

                return (
                  <button
                    key={event.year}
                    onClick={() => setActiveIndex(idx)}
                    className="flex flex-col items-center focus:outline-none group"
                  >
                    <motion.div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/20 scale-110' 
                          : isPassed 
                            ? 'border-brand-gold bg-brand-gold text-white'
                            : 'border-gray-200 bg-white text-gray-400 group-hover:border-brand-red group-hover:text-brand-red'
                      }`}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Calendar size={14} className={isActive ? 'animate-pulse' : ''} />
                    </motion.div>
                    <span className={`mt-3 text-xs font-bold tracking-wider transition-colors duration-300 ${
                      isActive ? 'text-brand-red font-extrabold scale-105' : 'text-gray-500 group-hover:text-brand-red'
                    }`}>
                      {event.year}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline content details with AnimatePresence for transitions */}
          <div className="bg-neutral-50/50 rounded-sm border border-gray-100 p-8 md:p-12 max-w-5xl mx-auto shadow-sm relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Content Side */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/5 rounded-full text-brand-red">
                    <History size={14} />
                    <span className="text-[10px] font-bold tracking-widest uppercase">{activeEvent.year}</span>
                  </div>
                  <h3 className="text-3xl font-serif leading-tight text-brand-charcoal">
                    {activeEvent.title[language]}
                  </h3>
                  <h4 className="text-xs font-bold tracking-widest uppercase text-brand-gold">
                    {activeEvent.subtitle[language]}
                  </h4>
                  <p className="text-gray-600 font-sans text-sm leading-relaxed">
                    {activeEvent.description[language]}
                  </p>
                  
                  {/* Slide controls */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handlePrev}
                      className="p-3 border border-gray-200 rounded-sm hover:border-brand-red hover:text-brand-red transition-all cursor-pointer"
                      aria-label="Anterior"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-3 border border-gray-200 rounded-sm hover:border-brand-red hover:text-brand-red transition-all cursor-pointer"
                      aria-label="Seguinte"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Visual Side */}
                <div className="relative">
                  <div className="aspect-[4/3] md:aspect-[16/10] lg:aspect-[4/3] rounded-sm overflow-hidden shadow-xl relative z-10">
                    <img 
                      src={activeEvent.image} 
                      alt={activeEvent.title[language]} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-brand-red/5 -z-10 rounded-sm" />
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-brand-gold/5 -z-10 rounded-sm" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Values/Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-24 border-y border-gray-100">
          <div className="flex flex-col items-center text-center">
            <Wine className="text-brand-red mb-6" size={32} />
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">
              {language === 'pt' ? 'Curadoria Especializada' : 'Specialist Curation'}
            </h4>
            <p className="text-sm text-gray-500 font-sans">
              {language === 'pt' 
                ? 'Selecionamos pessoalmente cada rótulo, garantindo a proveniência e a qualidade excecional.'
                : 'We personally select each label, ensuring authenticity and exceptional quality.'}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="text-brand-red mb-6" size={32} />
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">
              {language === 'pt' ? 'Tradição Familiar' : 'Family Tradition'}
            </h4>
            <p className="text-sm text-gray-500 font-sans">
              {language === 'pt'
                ? 'Duas gerações unidas pela paixão ao vinho e pelo compromisso com a excelência.'
                : 'Two generations united by wine passion and a commitment to excellence.'}
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin className="text-brand-red mb-6" size={32} />
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">
              {language === 'pt' ? 'No Coração do Porto' : 'In the Heart of Porto'}
            </h4>
            <p className="text-sm text-gray-500 font-sans">
              {language === 'pt'
                ? 'Localizados numa das zonas mais icónicas e vibrantes da cidade invicta.'
                : 'Located in one of the most iconic and vibrant areas of the city.'}
            </p>
          </div>
        </div>

        {/* Vision/Quote */}
        <section className="py-32 text-center max-w-3xl mx-auto">
          <MessageSquare className="text-gray-200 mx-auto mb-8" size={48} />
          <blockquote className="text-2xl md:text-3xl font-serif italic text-brand-charcoal leading-relaxed mb-12">
            {language === 'pt'
              ? '"Não vendemos apenas vinhos; partilhamos histórias, emoções e a alma profunda da terra portuguesa em cada copo."'
              : '"We do not just sell wines; we share stories, emotions, and the deep soul of the Portuguese land in every glass."'}
          </blockquote>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full mb-4 overflow-hidden">
               <img src="/images/bruno-pinto.jpg" alt="Bruno Pinto - Diretor Geral" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-charcoal">Bruno Pinto</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
              {language === 'pt' ? 'Diretor Geral' : 'General Director'}
            </span>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <section className="bg-brand-charcoal py-24 text-center">
        <h3 className="text-3xl font-serif text-white mb-8">
          {language === 'pt' ? 'Dúvidas ou Consultoria Personalizada?' : 'Questions or Personal Consultation?'}
        </h3>
        <p className="text-gray-400 mb-12 max-w-xl mx-auto font-sans">
          {language === 'pt'
            ? 'A nossa equipa está disponível para o ajudar a escolher a garrafa perfeita para qualquer ocasião.'
            : 'Our team is available to help you select the perfect bottle for any occasion.'}
        </p>
        <a 
          href="https://wa.me/351919139639?text=Olá! Gostaria de obter mais informações sobre os vinhos e produtos gourmet da Socalcos." 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-brand-red text-white px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red/90 transition-all"
        >
          {language === 'pt' ? 'Contacte-nos' : 'Contact Us'}
        </a>
      </section>
    </div>
  );
}
