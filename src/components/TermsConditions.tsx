import React from 'react';
import { motion } from 'motion/react';

export default function TermsConditions() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-4"
          >
            Termos e Condições
          </motion.h1>
          <div className="w-20 h-1 bg-brand-gold" />
        </header>
        
        <div className="space-y-12 text-gray-600 font-sans leading-relaxed">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">1. Âmbito e Objeto</h2>
            <p>
              Os presentes Termos e Condições regulam a venda de produtos através do site Socalcos, propriedade de <strong>Manuel António Pinto</strong> (NIF <strong>107227983</strong>), sediado na Rua Mouzinho da Silveira nº1/11, 4050-419 Porto.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">2. Restrições de Idade</h2>
            <p className="font-bold text-brand-red">
              A venda de bebidas alcoólicas a menores de 18 anos é estritamente proibida por lei.
            </p>
            <p className="mt-2">
              Ao efetuar uma encomenda no nosso site, o cliente declara ter idade legal para o consumo e compra de álcool. Reservamo-nos o direito de cancelar qualquer encomenda caso existam dúvidas sobre a idade do comprador ou de solicitar a apresentação de um documento de identificação no momento da entrega.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">3. Preços e Pagamento</h2>
            <p>
              Todos os preços apresentados incluem o IVA à taxa legal em vigor em Portugal. O pagamento pode ser efetuado através dos métodos disponíveis no momento do checkout. As encomendas só serão processadas após a confirmação do pagamento.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">4. Envios e Entregas</h2>
            <p>
              Efetuamos envios para Portugal Continental e ilhas. Os prazos de entrega podem variar conforme o destino e a disponibilidade de stock. Em caso de rotura de stock, o cliente será contactado para optar pela substituição do produto ou reembolso.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">5. Resolução de Litígios</h2>
            <p>
              Em caso de litígio, o consumidor pode recorrer ao Centro de Informação de Consumo e Arbitragem do Porto (CICAP), com sede na Rua Damião de Góis, 31, Loja 6, 4050-225 Porto. Mais informações em <strong>www.cicap.pt</strong>.
            </p>
          </section>

          <section className="pt-8 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
              Seja responsável. Beba com moderação.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
