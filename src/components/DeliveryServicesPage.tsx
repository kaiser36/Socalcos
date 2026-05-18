import { motion } from 'motion/react';
import { Truck, MapPin, Package, Clock, ShieldCheck, Globe2 } from 'lucide-react';

export default function DeliveryServicesPage() {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-center"
      >
        <h1 className="text-5xl font-serif text-brand-charcoal mb-6">Serviços de Entrega</h1>
        <p className="text-gray-500 font-sans tracking-wide max-w-2xl mx-auto">
          Levamos a excelência dos nossos vinhos até si, onde quer que esteja. 
          Descubra as nossas opções de entrega personalizadas.
        </p>
      </motion.div>

      <div className="space-y-16">
        {/* Entregas em Hotel */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 border border-gray-100 rounded-sm shadow-sm"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand-red/5 rounded-full flex items-center justify-center text-brand-red">
              <MapPin size={24} />
            </div>
            <h2 className="text-3xl font-serif text-brand-charcoal">Entregas em Hotel</h2>
          </div>
          
          <div className="prose prose-sm max-w-none font-sans text-gray-600 leading-relaxed space-y-6">
            <p className="text-base">
              A Socalcos Vinhos & Gourmet oferece um serviço exclusivo de entrega de vinhos e produtos gourmet diretamente no seu hotel, no Grande Porto. Desfrute da melhor seleção da nossa garrafeira no conforto do seu quarto.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div className="space-y-3">
                <Clock className="text-brand-gold" size={20} />
                <h3 className="text-xs font-bold tracking-widest uppercase text-brand-charcoal">Rapidez</h3>
                <p className="text-sm">Entregas em tempo recorde, coordenadas com a receção do hotel para sua maior comodidade.</p>
              </div>
              <div className="space-y-3">
                <Package className="text-brand-gold" size={20} />
                <h3 className="text-xs font-bold tracking-widest uppercase text-brand-charcoal">Acondicionamento</h3>
                <p className="text-sm">Embalagem segura e discreta, ideal também para oferecer ou levar consigo na viagem.</p>
              </div>
              <div className="space-y-3">
                <ShieldCheck className="text-brand-gold" size={20} />
                <h3 className="text-xs font-bold tracking-widest uppercase text-brand-charcoal">Garantia</h3>
                <p className="text-sm">Os produtos chegam nas condições perfeitas de temperatura e armazenamento.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Entregas Nacionais e Internacionais */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 border border-gray-100 rounded-sm shadow-sm"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand-red/5 rounded-full flex items-center justify-center text-brand-red">
              <Globe2 size={24} />
            </div>
            <h2 className="text-3xl font-serif text-brand-charcoal">Entregas Nacionais e Internacionais</h2>
          </div>
          
          <div className="prose prose-sm max-w-none font-sans text-gray-600 leading-relaxed space-y-6">
            <p className="text-base">
              Através da nossa rede de parceiros logísticos premium, enviamos os seus vinhos favoritos de forma rápida e totalmente segura para qualquer parte do país ou do estrangeiro.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              <div className="flex gap-4">
                <Truck className="text-brand-red shrink-0" size={20} />
                <div>
                  <h3 className="text-sm font-bold text-brand-charcoal mb-2">Portugal Continental e Ilhas</h3>
                  <p className="text-sm">
                    Garantimos entregas rápidas (24h a 48h úteis) para Portugal Continental. Para a Madeira e os Açores, o serviço obedece a prazos específicos de trânsito aéreo/marítimo.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Globe2 className="text-brand-red shrink-0" size={20} />
                <div>
                  <h3 className="text-sm font-bold text-brand-charcoal mb-2">Envios Internacionais</h3>
                  <p className="text-sm">
                    Tratamos de toda a logística e processos alfandegários (onde aplicável) para envio de caixas para diversos destinos Europeus e Internacionais. Custos variáveis conforme peso e destino.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-sm border border-gray-100">
              <p className="text-xs font-medium text-brand-charcoal mb-2">Nota Importante:</p>
              <p className="text-xs text-gray-500">
                O custo de transporte é calculado quando a Socalcos entrar em contacto consigo para confirmar os dados da sua encomenda e agilizar o pagamento.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
