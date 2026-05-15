import React from 'react';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-4"
          >
            Nota de Privacidade e Proteção de Dados
          </motion.h1>
          <div className="w-20 h-1 bg-brand-gold" />
        </header>
        
        <div className="space-y-12 text-gray-600 font-sans leading-relaxed text-sm">
          <section className="bg-gray-50 p-8 rounded-sm italic border-l-4 border-brand-red">
            <p>
              O site Socalcos não recolhe automaticamente qualquer tipo de informação pessoal dos utilizadores que não se encontrem registados, permitindo assim que os visitantes naveguem anonimamente.
            </p>
          </section>

          <section>
            <p>
              Leia, por favor, esta Política de Privacidade com atenção pois, se está a aceder ao nosso website, a disponibilização dos seus dados pessoais implica o conhecimento e aceitação das condições aqui constantes. Esta Política de Privacidade aplica-se exclusivamente à recolha e tratamento de dados pessoais efetuados pela Socalcos. Quaisquer hiperligações para websites externos à Socalcos não estão abrangidos pela presente declaração de privacidade.
            </p>
            <p className="mt-4">
              A presente Política de Privacidade regula a eventual recolha e tratamento, designadamente o consentimento, relativamente a dados pessoais recolhidos ou fornecidos pelos utilizadores em qualquer parte do site, assim como o exercício dos seus direitos relativamente a estes dados, nos termos do Regulamento Geral da Protecção de Dados (Regulamento 2016/679 do Parlamento Europeu e do Conselho, de 27 de Abril de 2016).
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">Dados pessoais</h2>
            <p>
              Qualquer informação, de qualquer natureza e independentemente do respetivo suporte, incluindo som e imagem, relativa a uma pessoa singular identificada ou identificável.
            </p>
            <p className="mt-2">
              É considerada identificável a pessoa que possa ser identificada direta ou indiretamente, designadamente por referência a um número de identificação ou a um ou mais elementos específicos da sua identidade física, fisiológica, psíquica, económica, cultural ou social.
            </p>
            <p className="mt-2">
              Por regra não recolhemos dados sensíveis. Sempre que no cumprimento de obrigação legal ou de forma voluntária e por iniciativa do utilizador forem disponibilizados dados sensíveis, assumimos o seu consentimento explícito, livre e inequívoco para tratarmos essa informação relativamente às finalidades para as quais foram fornecidas.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">Responsável pelo tratamento de dados</h2>
            <p>
              A entidade responsável pela recolha e tratamento dos dados pessoais é <strong>Manuel António Pinto</strong> (NIF <strong>107227983</strong>), sediado na Rua Mouzinho da Silveira nº1/11, 4050-419 Porto, que lhe presta o serviço e que, no contexto, decide quais os dados recolhidos, os meios de tratamento dos dados e para que finalidades são utilizados.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">Tipo de dados pessoais recolhidos</h2>
            <p>
              A Socalcos, no âmbito da sua actividade, procede à recolha e ao tratamento dos dados pessoais necessários ao processamento das encomendas e comunicação com os Clientes, processamento de pedidos de informação e de eventuais reclamações, análise estatística, bem como a respectiva utilização para efeitos de marketing directo, tratando nesse âmbito dados como: nome, moradas, país, número de telefone, número de contribuinte, endereço de correio electrónico, data de nascimento e interesses pessoais sobre bebidas alcoólicas.
            </p>
            <p className="mt-4">
              Os dados pessoais recolhidos são tratados informaticamente e no estrito cumprimento da legislação de protecção de dados pessoais, sendo armazenados em base de dados específicas, criadas para o efeito e que garantem a sua segurança e confidencialidade de acordo com as medidas de tecnologia da informação, técnicas e organizacionais aceites.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">Finalidade do tratamento dos dados pessoais</h2>
            <p>
              A finalidade do tratamento dos dados pessoais consiste na gestão e processamento de encomendas, comunicação com os Clientes, processamento de pedidos de informação e de eventuais reclamações. Periodicamente, a Socalcos poderá utilizar as informações de contacto disponibilizadas para fornecer informações que considera relevantes, sendo sempre permitido ao Titular dos Dados deixar de receber esse tipo de informação.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">Tempo de conservação</h2>
            <p>
              Sempre que não exista uma obrigação legal especifica, os dados serão armazenados e conservados apenas pelo período mínimo necessário para as finalidades que motivaram a sua recolha ou o seu posterior tratamento, findo o qual os mesmos serão eliminados.
            </p>
            <p className="mt-4">
              Lembramos expressamente que em qualquer momento poderá solicitar a eliminação de todos os seus dados pessoais das nossas bases de dados através do email: <strong>socalcosvinhosegourmet@gmail.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-charcoal mb-4">Acesso e Retificação</h2>
            <p>
              Qualquer pedido de acesso, atualização, retificação, oposição, limitação, remoção ou portabilidade dos dados pessoais susceptíveis de o identificar, pode ser requerido por contacto direto com a Socalcos através do e-mail acima mencionado.
            </p>
          </section>

          <section className="pt-12 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
              Seja responsável. Beba com moderação.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
