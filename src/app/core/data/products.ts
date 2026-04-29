import { Product } from '../models/product.model';

export const PRODUCTS: Product[] = [
  {
    id: '001',
    name: 'Positive Energy',
    price: 30000,
    images: ['images/products/positive-energy.jpeg'],
    sizes: ['L'],
    colors: ['Blanco'],
    description: 'Remera con diseño abstracto minimalista, perfecta para el día a día. 100% algodón, cómoda y versátil.'
  },
  {
    id: '002',
    name: 'Stitch Art',
    price: 30000,
    images: ['images/products/stitch.jpeg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Negro'],
    description: 'Diseño urbano inspirado en Stitch 626. Corte moderno y materiales de calidad.'
  },
  {
    id: '003',
    name: 'Remera Minimalista',
    price: 30000,
    images: ['images/products/the-rose-system.jpeg'],
    sizes: ['M', 'L'],
    colors: ['Blanco'],
    description: 'Diseño limpio y minimalista. Ideal para combinar con cualquier outfit.'
  }
];
