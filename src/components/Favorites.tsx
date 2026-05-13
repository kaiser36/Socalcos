import ProductCard from './ProductCard';
import { motion } from 'motion/react';
import { Product } from '../types';

interface FavoritesProps {
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

const products: Product[] = [
  {
    id: '1',
    name: "Reserva Tinto",
    vintage: "2018",
    region: "Douro DOC",
    price: 45.00,
    category: 'Vinhos',
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2670&auto=format&fit=crop",
    rating: 5
  },
  {
    id: '2',
    name: "Colheita Branco",
    vintage: "2022",
    region: "Douro DOC",
    price: 22.00,
    category: 'Vinhos',
    image: "https://images.unsplash.com/photo-1563212891-2364c67995e8?q=80&w=2670&auto=format&fit=crop",
    rating: 4
  },
  {
    id: '5',
    name: "Vintage Port",
    vintage: "2011",
    region: "Porto",
    price: 120.00,
    category: 'Vinho do Porto',
    image: "https://images.unsplash.com/photo-1628160450500-ee7e69f886f4?q=80&w=2670&auto=format&fit=crop",
    rating: 5
  },
  {
    id: '4',
    name: "Rosé Especial",
    vintage: "2023",
    region: "Douro DOC",
    price: 28.00,
    category: 'Vinhos',
    image: "https://images.unsplash.com/photo-1559113513-d5e09c1145ea?q=80&w=2670&auto=format&fit=crop",
    rating: 4
  }
];

export default function Favorites({ onSelectProduct, onAddToCart }: FavoritesProps) {
  return (
    <section className="py-24 bg-[#efefed]/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-serif mb-6 text-brand-red"
          >
            Os Nossos Favoritos
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed"
          >
            Uma seleção rigorosa das nossas colheitas mais excecionais, escolhidas para os paladares mais exigentes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard {...product} onSelect={onSelectProduct} onAddToCart={onAddToCart} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
