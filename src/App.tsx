/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Favorites from './components/Favorites';
import About from './components/About';
import AboutPage from './components/AboutPage';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import Store from './components/Store';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Success from './components/Success';
import { products } from './data/products';
import { CartItem, Product } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'store' | 'detail' | 'checkout' | 'success' | 'about'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('detail');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
  };

  const completeOrder = () => {
    setCartItems([]);
    setCurrentPage('success');
  };

  // Scroll to top when switching pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedProductId]);

  const view = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <Categories />
            <Favorites onSelectProduct={handleProductSelect} onAddToCart={addToCart} />
            <About onNavigate={setCurrentPage} />
            <Gallery />
          </>
        );
      case 'about':
        return <AboutPage />;
      case 'store':
        return <Store onSelectProduct={handleProductSelect} onAddToCart={addToCart} />;
      case 'detail':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setCurrentPage('store')}
            onAddToCart={addToCart}
          />
        ) : null;
      case 'checkout':
        return (
          <Checkout 
            items={cartItems} 
            onBack={() => setCurrentPage('store')} 
            onComplete={completeOrder}
          />
        );
      case 'success':
        return (
          <Success 
            onGoHome={() => setCurrentPage('home')}
            onGoStore={() => setCurrentPage('store')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header 
        onNavigate={setCurrentPage} 
        currentPage={currentPage === 'detail' || currentPage === 'checkout' || currentPage === 'success' ? 'store' : currentPage} 
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <main>
        {view()}
      </main>
      <Footer />
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
