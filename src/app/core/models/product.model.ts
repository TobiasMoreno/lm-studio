export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  sizes: ('S' | 'M' | 'L' | 'XL')[];
  colors: string[];
  description: string;
}
