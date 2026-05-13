import { motion } from 'motion/react';

const categories = [
  { 
    name: 'Vinho do Porto', 
    image: 'https://images.unsplash.com/photo-1628160450500-ee7e69f886f4?q=80&w=2670&auto=format&fit=crop',
    link: '#'
  },
  { 
    name: 'Vinhos', 
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2670&auto=format&fit=crop',
    link: '#'
  },
  { 
    name: 'Whisky', 
    image: 'https://images.unsplash.com/photo-1527281405159-052382902640?q=80&w=2670&auto=format&fit=crop',
    link: '#'
  },
  { 
    name: 'Destilados', 
    image: 'https://images.unsplash.com/photo-1526401485004-46910eea1531?q=80&w=2670&auto=format&fit=crop',
    link: '#'
  }
];

export default function Categories() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.a 
            key={category.name}
            href={category.link}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative h-[400px] overflow-hidden rounded-sm"
          >
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500 z-10" />
            <img 
              src={category.image} 
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-12">
              <h3 className="text-white text-2xl font-serif mb-4 tracking-wide">{category.name}</h3>
              <span className="text-white text-[10px] font-bold tracking-[0.2em] uppercase border-b border-white/40 pb-1 group-hover:border-white transition-colors">
                Comprar Agora
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
