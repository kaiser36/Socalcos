import { motion } from 'motion/react';
import { GalleryImage } from '../types';

interface GalleryProps {
  images: GalleryImage[];
  onNavigate: (page: 'gallery') => void;
}

export default function Gallery({ images, onNavigate }: GalleryProps) {
  // Show first 4 images or empty array
  const displayImages = images.slice(0, 4);

  return (
    <section className="py-24 bg-[#efefed]/30 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-serif mb-4 text-brand-red"
          >
            A Nossa Loja no Porto
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-sm font-sans"
          >
            Venha descobrir a nossa seleção exclusiva num espaço onde a história e o requinte se encontram.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {displayImages.map((img, index) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="aspect-square overflow-hidden rounded-sm"
            >
              <img 
                src={img.url} 
                alt={`Loja Socalcos ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </motion.div>
          ))}
          {displayImages.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-400 font-sans italic">
               A carregar imagens da loja...
             </div>
          )}
        </div>

        <div className="text-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('gallery')}
            className="bg-brand-charcoal text-white px-10 py-4 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-brand-red transition-all"
          >
            Ver galeria completa
          </motion.button>
        </div>
      </div>
    </section>
  );
}
