import { Product } from '../models/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '001',
    name: 'Remera Abstracta 01',
    price: 15000,
    images: ['images/products/product-001-1.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Blanco'],
    description: 'Remera con diseño abstracto minimalista, perfecta para el día a día. 100% algodón, cómoda y versátil.'
  },
  {
    id: '002',
    name: 'Remera Street Art',
    price: 16500,
    images: ['images/products/product-002-1.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Negro', 'Gris', 'Blanco'],
    description: 'Diseño urbano inspirado en el street art. Corte moderno y materiales de calidad.'
  },
  {
    id: '003',
    name: 'Remera Minimalista',
    price: 14000,
    images: ['images/products/product-003-1.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Blanco', 'Beige'],
    description: 'Diseño limpio y minimalista. Ideal para combinar con cualquier outfit.'
  },
  {
    id: '004',
    name: 'Remera Otaku Style',
    price: 18000,
    images: ['images/products/product-004-1.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Azul Marino'],
    description: 'Estilo inspirado en la cultura otaku. Diseño único y exclusivo.'
  },
  {
    id: '005',
    name: 'Remera Urban Wave',
    price: 16000,
    images: ['images/products/product-005-1.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Gris', 'Negro'],
    description: 'Ondas urbanas en un diseño contemporáneo. Para los amantes del streetwear.'
  }
];
