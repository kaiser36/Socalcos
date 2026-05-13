import { motion } from 'motion/react';
import { Wine, History, Users, MessageSquare, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1543412849-fd4726551ca0?q=80&w=2670&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30" 
            alt="Vinha"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-px bg-brand-red" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-serif text-brand-charcoal mb-8"
          >
            A Nossa História
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg text-gray-500 font-sans leading-relaxed"
          >
            Entre socalcos e tradições, a nossa família dedica-se à arte de selecionar o que de melhor o Douro e o Porto têm para oferecer.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Core Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="space-y-8"
          >
            <div className="flex items-center gap-4 text-brand-red mb-2">
              <History size={20} />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Desde 1944</span>
            </div>
            <h2 className="text-4xl font-serif leading-tight">Do Cabaz do Infante à Socalcos Vinhos & Gourmet</h2>
            <div className="space-y-6 text-gray-600 font-sans leading-relaxed">
              <p>
                A nossa jornada começou em 1944 com o <strong>Cabaz do Infante</strong>, pelas mãos de José Rodrigues Pereira. Em 1968, Manuel Pinto ingressou como marçano nesta casa histórica, assumindo a gerência aos 17 anos e mantendo a chama viva até aos dias de hoje.
              </p>
              <p>
                Em 2014, nasceu o espaço <strong>Socalcos Vinhos & Gourmet</strong> sobre a direção de Bruno Pinto. Um conceito inovador que preserva a tradição familiar, mas abraça a modernidade num espaço amplo e "clean" junto ao antigo Mercado Ferreira Borges.
              </p>
              <p>
                A nossa proposta é simples: oferecer uma experiência sensorial única, onde turistas e locais podem descobrir tesouros em forma de garrafa, desde Vinhos do Porto raros até produções limitadas de pequenas quintas do Douro.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-sm shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2670&auto=format&fit=crop" 
                alt="Vinhos Raros" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-brand-red/5 -z-10 rounded-sm" />
            <div className="absolute -top-8 -left-8 w-48 h-48 bg-brand-gold/5 -z-10 rounded-sm" />
          </motion.div>
        </div>

        {/* Values/Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-24 border-y border-gray-100">
          <div className="flex flex-col items-center text-center">
            <Wine className="text-brand-red mb-6" size={32} />
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Curadoria Especializada</h4>
            <p className="text-sm text-gray-500 font-sans">Selecionamos pessoalmente cada rótulo, garantindo a proveniência e a qualidade excecional.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="text-brand-red mb-6" size={32} />
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">Tradição Familiar</h4>
            <p className="text-sm text-gray-500 font-sans">Duas gerações unidas pela paixão ao vinho e pelo compromisso com a excelência.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <MapPin className="text-brand-red mb-6" size={32} />
            <h4 className="text-xs font-bold tracking-widest uppercase mb-4">No Coração do Porto</h4>
            <p className="text-sm text-gray-500 font-sans">Localizados numa das zonas mais icónicas e vibrantes da cidade invicta.</p>
          </div>
        </div>

        {/* Vision/Quote */}
        <section className="py-32 text-center max-w-3xl mx-auto">
          <MessageSquare className="text-gray-200 mx-auto mb-8" size={48} />
          <blockquote className="text-2xl md:text-3xl font-serif italic text-brand-charcoal leading-relaxed mb-12">
            "Não vendemos apenas vinhos; partilhamos histórias, emoções e a alma profunda da terra portuguesa em cada copo."
          </blockquote>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full mb-4 overflow-hidden">
               <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Founder" />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-charcoal">Bruno Pinto</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Diretor Geral</span>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <section className="bg-brand-charcoal py-24 text-center">
        <h3 className="text-3xl font-serif text-white mb-8">Dúvidas ou Consultoria Personalizada?</h3>
        <p className="text-gray-400 mb-12 max-w-xl mx-auto font-sans">A nossa equipa está disponível para o ajudar a escolher a garrafa perfeita para qualquer ocasião.</p>
        <button className="bg-brand-red text-white px-12 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-sm hover:bg-brand-red/90 transition-all">
          Contacte-nos
        </button>
      </section>
    </div>
  );
}
