export interface Category {
  id: string;
  name: string;
  parent_id?: string;
  slug: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar_url: string;
  created_at: string;
}

export interface SiteSettings {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  published: boolean;
  image: string;
   category_id?: string;
   subcategory_ids?: string[];
  category?: string; // For backward compatibility or joining
  producer?: string;
  property?: string;
  country?: string;
  region: string;
  harvest?: string;
  capacity?: string;
  alcohol_content?: number;
  allergens?: string;
  tax_rate: number; // IVA (%)
  stock: number;
  rating: number;
  vintage?: string; // Keeping for compatibility
  is_favorite?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
