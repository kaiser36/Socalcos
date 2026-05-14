export interface Category {
  id: string;
  name: string;
  parent_id?: string;
  slug: string;
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
  subcategory_id?: string;
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
}

export interface CartItem extends Product {
  quantity: number;
}
