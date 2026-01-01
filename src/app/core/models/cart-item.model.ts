export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  size: 'S' | 'M' | 'L' | 'XL';
  color: string;
  image: string;
  quantity: number;
}
