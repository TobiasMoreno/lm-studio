import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { MOCK_PRODUCTS } from '../data/products.mock';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = MOCK_PRODUCTS;

  getAllProducts(): Product[] {
    return this.products;
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getProductsByFilters(
    selectedSizes: string[] = [], 
    selectedColors: string[] = [],
    searchTerm: string = '',
    minPrice: number | null = null,
    maxPrice: number | null = null
  ): Product[] {
    let filtered = this.products;

    // Búsqueda por nombre
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search)
      );
    }

    // Filtro por precio
    if (minPrice !== null) {
      filtered = filtered.filter(product => product.price >= minPrice);
    }
    if (maxPrice !== null) {
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    // Filtro por talle
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        selectedSizes.some(size => product.sizes.includes(size as 'S' | 'M' | 'L' | 'XL'))
      );
    }

    // Filtro por color
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        selectedColors.some(color => product.colors.includes(color))
      );
    }

    return filtered;
  }

  getAllSizes(): string[] {
    const sizes = new Set<string>();
    this.products.forEach(product => {
      product.sizes.forEach(size => sizes.add(size));
    });
    return Array.from(sizes).sort();
  }

  getAllColors(): string[] {
    const colors = new Set<string>();
    this.products.forEach(product => {
      product.colors.forEach(color => colors.add(color));
    });
    return Array.from(colors).sort();
  }
}
