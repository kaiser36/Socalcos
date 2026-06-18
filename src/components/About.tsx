import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface AboutProps {
  onNavigate: (page: 'about') => void;
}

export default function About({ onNavigate }: AboutProps) {
  return (
    <section className="pt-16 pb-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2 aspect-[4/5] overflow-hidden rounded-sm"
        >
          <img
            src="/images/loja-socalcos.jpg"
            alt="Loja Socalcos Vinhos & Gourmet"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="lg:w-1/2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl font-serif mb-8 text-brand-red"
          >
            Raízes Profundas
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-6 text-gray-700 text-base leading-relaxed font-sans"
          >
            <p>
              A Socalcos Vinhos & Gourmet surgiu num edifício reabilitado, junto ao antigo Mercado Ferreira Borges, sendo a versão moderna da Garrafeira Cabaz do Infante. Esta é propriedade do senhor Manuel Pinto, já a Socalcos é de Bruno Pinto, o filho que dá seguimento ao conhecimento da família.
            </p>
            <p>
              Ampla e &quot;clean&quot;, a proposta da Socalcos é oferecer um espaço agradável para turistas e locais fazerem a sua escolha confortavelmente entre as diversas marcas de vinhos do Porto e vinhos de mesa, incluindo uma série de vinhos chamados &quot;superiores&quot;.
            </p>
            <p>
              Para juntar à cuidada seleção de vinhos, podemos encontrar um conjunto de produtos gourmet, como queijos e compotas, que complementam o paladar dos mais exigentes.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => onNavigate('about')}
            className="mt-12 flex items-center gap-3 text-xs font-bold tracking-widest uppercase border-b-2 border-brand-red pb-2 hover:gap-6 transition-all"
          >
            Descobrir a nossa história <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
