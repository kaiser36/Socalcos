import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    'nav.store': 'Loja',
    'nav.about': 'Quem somos',
    'nav.location': 'Localização',
    'nav.profile': 'A Minha Conta',
    'nav.login': 'Iniciar Sessão',
    'nav.searchPlaceholder': 'Pesquisar...',
    'hero.title': 'Socalcos Vinhos & Gourmet',
    'hero.subtitle': 'Descubra a herança líquida do Porto. Uma coleção onde a tradição encontra a excelência contemporânea.',
    'hero.button': 'Ver Loja',
    'age.welcome': 'Bem-vindo à Socalcos',
    'age.desc': 'Para entrar no nosso site e explorar a nossa seleção de vinhos e gourmet, deve confirmar que tem idade legal para consumo de bebidas alcoólicas no seu país de residência.',
    'age.yes': 'Sim, tenho mais de 18 anos',
    'age.no': 'Não, sair',
    'age.responsible': 'Seja responsável. Beba com moderação.',
    'cart.title': 'Carrinho de Compras',
    'cart.empty': 'O seu carrinho está vazio',
    'cart.total': 'Total',
    'cart.checkout': 'Finalizar Compra',
    'store.addToCart': 'Adicionar ao carrinho',
    'quiz.title': 'Encontre o Seu Vinho Ideal',
    'quiz.subtitle': 'Responda a 3 perguntas rápidas e os nossos especialistas recomendam a garrafa perfeita para si.',
    'quiz.step': 'Passo',
    'quiz.of': 'de',
    'quiz.next': 'Seguinte',
    'quiz.restart': 'Refazer Quiz',
    'quiz.results': 'As Nossas Sugestões',
    'quiz.resultsDesc': 'Com base nas suas preferências, selecionámos estas colheitas excecionais:',
    'quiz.q1': 'Qual é a ocasião?',
    'quiz.q1.o1': 'Jantar romântico / Encontro',
    'quiz.q1.o2': 'Reunião de amigos / Churrasco',
    'quiz.q1.o3': 'Momento de relaxamento pessoal',
    'quiz.q1.o4': 'Oferecer um presente especial',
    'quiz.q2': 'O que vai acompanhar?',
    'quiz.q2.o1': 'Carnes vermelhas / Assados',
    'quiz.q2.o2': 'Peixe grelhado / Marisco',
    'quiz.q2.o3': 'Tábua de queijos / Enchidos',
    'quiz.q2.o4': 'Sobremesas / Apenas brindar',
    'quiz.q3': 'Qual o seu perfil de sabor preferido?',
    'quiz.q3.o1': 'Encorpado e intenso',
    'quiz.q3.o2': 'Fresco e frutado',
    'quiz.q3.o3': 'Doce e complexo',
  },
  en: {
    'nav.store': 'Store',
    'nav.about': 'About Us',
    'nav.location': 'Location',
    'nav.profile': 'My Account',
    'nav.login': 'Login',
    'nav.searchPlaceholder': 'Search...',
    'hero.title': 'Socalcos Wines & Gourmet',
    'hero.subtitle': 'Discover the liquid heritage of Porto. A collection where tradition meets contemporary excellence.',
    'hero.button': 'View Store',
    'age.welcome': 'Welcome to Socalcos',
    'age.desc': 'To enter our website and explore our selection of wine and gourmet products, please confirm that you are of legal drinking age in your country of residence.',
    'age.yes': 'Yes, I am over 18',
    'age.no': 'No, exit',
    'age.responsible': 'Be responsible. Drink in moderation.',
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'store.addToCart': 'Add to cart',
    'quiz.title': 'Find Your Ideal Wine',
    'quiz.subtitle': 'Answer 3 quick questions and our experts will recommend the perfect bottle for you.',
    'quiz.step': 'Step',
    'quiz.of': 'of',
    'quiz.next': 'Next',
    'quiz.restart': 'Restart Quiz',
    'quiz.results': 'Our Recommendations',
    'quiz.resultsDesc': 'Based on your preferences, we selected these exceptional harvests:',
    'quiz.q1': 'What is the occasion?',
    'quiz.q1.o1': 'Romantic dinner / Date',
    'quiz.q1.o2': 'Friends gathering / BBQ',
    'quiz.q1.o3': 'Personal relaxation moment',
    'quiz.q1.o4': 'Giving a special gift',
    'quiz.q2': 'What will it pair with?',
    'quiz.q2.o1': 'Red meats / Roasts',
    'quiz.q2.o2': 'Grilled fish / Seafood',
    'quiz.q2.o3': 'Cheese & charcuterie board',
    'quiz.q2.o4': 'Desserts / Just to toast',
    'quiz.q3': 'What is your preferred flavor profile?',
    'quiz.q3.o1': 'Full-bodied and intense',
    'quiz.q3.o2': 'Fresh and fruity',
    'quiz.q3.o3': 'Sweet and complex',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('socalcos-lang');
      return (saved as Language) || 'pt';
    }
    return 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('socalcos-lang', lang);
    }
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['pt']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
