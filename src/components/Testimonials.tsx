import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (testimonials.length === 0) return null;

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Logic to show 3 at a time on desktop, 1 on mobile
  const getVisibleIndices = () => {
    if (testimonials.length <= 3) return testimonials.map((_, i) => i);
    const indices = [];
    for (let i = 0; i < 3; i++) {
      indices.push((currentIndex + i) % testimonials.length);
    }
    return indices;
  };

  const visibleTestimonials = getVisibleIndices();

  return (
    <section className="py-24 bg-white px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-12 h-12 bg-brand-red/10 text-brand-red rounded-full mb-4"
          >
            <Quote size={24} fill="currentColor" />
          </motion.div>
          <h2 className="text-4xl font-serif text-brand-charcoal">O que dizem os nossos clientes</h2>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Navigation Buttons */}
          <button 
            onClick={prev}
            className="absolute left-0 z-10 p-4 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-all shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>

          <div className={`grid grid-cols-1 ${testimonials.length === 1 ? 'md:grid-cols-1 max-w-lg' : testimonials.length === 2 ? 'md:grid-cols-2 max-w-4xl' : 'md:grid-cols-3'} gap-12 w-full px-16`}>
            <AnimatePresence mode="wait">
              {visibleTestimonials.map((idx) => {
                const t = testimonials[idx];
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center text-center space-y-6"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img 
                          src={t.avatar_url || 'https://via.placeholder.com/100'} 
                          alt={t.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-serif text-lg text-brand-charcoal font-medium">{t.name}</h4>
                      <div className="flex justify-center text-brand-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            fill={i < t.rating ? 'currentColor' : 'none'} 
                            className={i < t.rating ? 'text-brand-gold' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-500 font-sans leading-relaxed text-sm max-w-xs">
                      {t.content}
                    </p>

                    <div className="pt-4">
                      <Quote className="text-gray-100 transform rotate-180" size={48} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button 
            onClick={next}
            className="absolute right-0 z-10 p-4 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-all shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
