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
import { supabase } from './lib/supabase';
import { CartItem, Product, Category } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/auth/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import UserProfile from './components/auth/UserProfile';

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [currentPage, setCurrentPage] = useState<'home' | 'store' | 'detail' | 'checkout' | 'success' | 'about' | 'login' | 'admin' | 'profile'>('home');
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setDataLoading(true);
    const { data: prodData } = await supabase.from('products').select('*');
    const { data: catData } = await supabase.from('categories').select('*');
    
    if (prodData) setProducts(prodData);
    if (catData) setCategories(catData);
    setDataLoading(false);
  };

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 'store' && query.trim() !== '') {
      setCurrentPage('store');
    }
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
            <Categories categories={categories} />
            <Favorites onSelectProduct={handleProductSelect} onAddToCart={addToCart} products={products} />
            <About onNavigate={setCurrentPage} />
            <Gallery />
          </>
        );
      case 'about':
        return <AboutPage />;
      case 'store':
        return (
          <Store 
            onSelectProduct={handleProductSelect} 
            onAddToCart={addToCart} 
            externalSearch={searchQuery}
            onExternalSearchChange={setSearchQuery}
          />
        );
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
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'admin':
        if (authLoading) return <div className="min-h-screen flex items-center justify-center font-serif">A carregar...</div>;
        if (!user || !isAdmin) {
          setCurrentPage('login');
          return null;
        }
        return <AdminDashboard />;
      case 'profile':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return <UserProfile />;
      default:
        return null;
    }
  };

  if (currentPage === 'admin' && user && isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen">
      <Header 
        onNavigate={setCurrentPage} 
        currentPage={currentPage === 'detail' || currentPage === 'checkout' || currentPage === 'success' ? 'store' : currentPage} 
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />
      <main>
        {view()}
      </main>
      <Footer onNavigate={setCurrentPage} />
      
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
