import ProductCard from './ProductCard';
import { motion } from 'motion/react';
import { Product } from '../types';

interface FavoritesProps {
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function Favorites({ onSelectProduct, onAddToCart, products }: FavoritesProps & { products: Product[] }) {
  // Ensure we catch both boolean and truthy values from DB
  const favorites = products.filter(p => {
    const fav = p.is_favorite as any;
    return (fav === true || fav === 1 || fav === 'true') && p.published;
  });
  // Show all favorites, or fallback to first 8 if none selected
  const featuredProducts = favorites.length > 0 ? favorites : products.filter(p => p.published).slice(0, 8);

  if (featuredProducts.length === 0) return null;
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
          {featuredProducts.map((product, index) => (
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
