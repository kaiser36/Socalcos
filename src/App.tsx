/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Favorites from './components/Favorites';
import About from './components/About';
import AboutPage from './components/AboutPage';
import Gallery from './components/Gallery';
import GalleryPage from './components/GalleryPage';
import LocationPage from './components/LocationPage';
import DeliveryServicesPage from './components/DeliveryServicesPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import Testimonials from './components/Testimonials';
import AgeGate from './components/AgeGate';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import Store from './components/Store';
import ProductDetail from './components/ProductDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Success from './components/Success';
import { supabase } from './lib/supabase';
import { CartItem, Product, Category, GalleryImage, Testimonial } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
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

// --- Hash Routing Helpers ---
const PAGE_TO_HASH: Record<string, string> = {
  home: '/',
  store: '/loja',
  about: '/sobre',
  gallery: '/galeria',
  location: '/localizacao',
  services: '/servicos',
  privacy: '/privacidade',
  terms: '/termos',
  checkout: '/checkout',
  success: '/sucesso',
  login: '/login',
  admin: '/admin',
  profile: '/perfil',
};

const HASH_TO_PAGE: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_TO_HASH).map(([k, v]) => [v, k])
);

function parseHash(hash: string): { page: string; productId?: string; categoryId?: string } {
  const path = hash.replace(/^#/, '') || '/';
  
  // Product detail: /produto/:id
  const productMatch = path.match(/^\/produto\/(.+)$/);
  if (productMatch) return { page: 'detail', productId: productMatch[1] };

  // Store with category: /loja/:categoryId
  const storeCatMatch = path.match(/^\/loja\/(.+)$/);
  if (storeCatMatch) return { page: 'store', categoryId: storeCatMatch[1] };

  // Static pages
  const page = HASH_TO_PAGE[path];
  return { page: page || 'home' };
}

function buildHash(page: string, extra?: string): string {
  if (page === 'detail' && extra) return `#/produto/${extra}`;
  if (page === 'store' && extra) return `#/loja/${extra}`;
  return `#${PAGE_TO_HASH[page] || '/'}`;
}

function AppContent() {
  const initialRoute = parseHash(window.location.hash);
  const [currentPage, setCurrentPage] = useState<string>(initialRoute.page);

  // Update the browser hash without triggering the hashchange listener
  const pushHash = useCallback((hash: string) => {
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  }, []);

  const handleNavigate = useCallback((page: any) => {
    if (page === 'home') {
      fetchSettings();
      fetchData();
    }
    setCurrentPage(page);
    pushHash(buildHash(page));
  }, [pushHash]);
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialRoute.productId || null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState({ heroImage: '/images/hero-banner.jpg' });
  const [initialStoreCategory, setInitialStoreCategory] = useState<string | undefined>(initialRoute.categoryId);

  useEffect(() => {
    fetchData();
    fetchSettings();

    // Listen for browser back/forward navigation
    const onHashChange = () => {
      const route = parseHash(window.location.hash);
      setCurrentPage(route.page);
      if (route.productId) {
        setSelectedProductId(route.productId);
      }
      if (route.categoryId) {
        setInitialStoreCategory(route.categoryId);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*');
    if (data) {
      const hero = data.find(s => s.key === 'hero_image')?.value;
      if (hero) setSiteSettings(prev => ({ ...prev, heroImage: hero }));
    }
  };

  const fetchData = async () => {
    setDataLoading(true);
    // Fetch all products (standard limit applies)
    const { data: prodData } = await supabase.from('products').select('*');
    // Fetch ALL favorites explicitly to bypass limits
    const { data: favData } = await supabase.from('products').select('*').eq('is_favorite', true);
    const { data: catData } = await supabase.from('categories').select('*');
    const { data: galleryData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    const { data: testData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    
    if (prodData) {
      // Merge favorites into the products list to ensure we have them all
      const mergedProducts = [...prodData];
      if (favData) {
        favData.forEach(fav => {
          if (!mergedProducts.find(p => p.id === fav.id)) {
            mergedProducts.push(fav);
          } else {
            // Update the favorite status in case the main fetch got an old version
            const idx = mergedProducts.findIndex(p => p.id === fav.id);
            mergedProducts[idx] = fav;
          }
        });
      }
      setProducts(mergedProducts);
    }
    if (catData) setCategories(catData);
    if (galleryData) setGalleryImages(galleryData);
    if (testData) setTestimonials(testData);
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

  // For direct URL access to a product, fetch it if not already in state
  const [directProduct, setDirectProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (currentPage === 'detail' && selectedProductId) {
      const found = products.find(p => p.id === selectedProductId);
      if (found) {
        setDirectProduct(null); // use the one from products array
      } else {
        // Product not in memory, fetch it directly
        supabase.from('products').select('*').eq('id', selectedProductId).single()
          .then(({ data }) => {
            if (data) setDirectProduct(data);
          });
      }
    }
  }, [currentPage, selectedProductId, products]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || directProduct;

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('detail');
    pushHash(buildHash('detail', id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setCurrentPage('checkout');
    pushHash(buildHash('checkout'));
  };

  const completeOrder = () => {
    setCartItems([]);
    setCurrentPage('success');
    pushHash(buildHash('success'));
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
            <Hero onNavigate={handleNavigate} backgroundImage={siteSettings.heroImage} />
            <Categories 
              categories={categories} 
              onSelectCategory={(id) => {
                setInitialStoreCategory(id);
                setCurrentPage('store');
                pushHash(buildHash('store', id));
              }} 
            />
            <Favorites onSelectProduct={handleProductSelect} onAddToCart={addToCart} products={products} />
            <About onNavigate={handleNavigate} />
            <Testimonials testimonials={testimonials} />
            <Gallery images={galleryImages} onNavigate={handleNavigate} />
          </>
        );
      case 'about':
        return <AboutPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'location':
        return <LocationPage />;
      case 'services':
        return <DeliveryServicesPage />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsConditions />;
      case 'store':
        return (
          <Store 
            onSelectProduct={handleProductSelect} 
            onAddToCart={addToCart} 
            externalSearch={searchQuery}
            onExternalSearchChange={setSearchQuery}
            initialCategory={initialStoreCategory}
          />
        );
      case 'detail':
        if (!selectedProduct) {
          return (
            <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="animate-spin text-brand-red" size={40} />
            </div>
          );
        }
        const categoryName = categories.find(c => c.id === selectedProduct.category_id)?.name;
        return (
          <ProductDetail 
            product={selectedProduct} 
            categoryName={categoryName}
            onBack={() => setCurrentPage('store')}
            onAddToCart={addToCart}
            allProducts={products}
            onSelectProduct={handleProductSelect}
          />
        );
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
        return <LoginPage onNavigate={handleNavigate} />;
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
        return <UserProfile onAddToCart={addToCart} onNavigate={handleNavigate} />;
      default:
        return null;
    }
  };

  if (currentPage === 'admin' && user && isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen">
      <AgeGate />
      <Header 
        onNavigate={handleNavigate} 
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
      <Footer onNavigate={handleNavigate} />
      <CookieBanner />
      
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
