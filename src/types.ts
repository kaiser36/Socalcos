export type Category = 'Vinho do Porto' | 'Vinhos' | 'Whisky' | 'Destilados' | 'Gourmet';

export interface Product {
  id: string;
  name: string;
  vintage: string;
  region: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
