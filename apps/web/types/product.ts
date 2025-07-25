export interface Product {
  id: number;
  product: string;
  category: string;
  price: number;
  lastUpdate: string;
}

export type ProductInput = Omit<Product, 'id' | 'lastUpdate'>;