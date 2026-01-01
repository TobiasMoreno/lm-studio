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

  getProductsByFilters(selectedSizes: string[] = [], selectedColors: string[] = []): Product[] {
    if (selectedSizes.length === 0 && selectedColors.length === 0) {
      return this.products;
    }

    return this.products.filter(product => {
      const matchesSize = selectedSizes.length === 0 || 
        selectedSizes.some(size => product.sizes.includes(size as 'S' | 'M' | 'L' | 'XL'));
      
      const matchesColor = selectedColors.length === 0 || 
        selectedColors.some(color => product.colors.includes(color));
      
      return matchesSize && matchesColor;
    });
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
