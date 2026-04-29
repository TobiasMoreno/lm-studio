import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule,
    ProductCardComponent,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
  templateUrl:'products.component.html'
})
export class ProductsComponent {
  private productService = inject(ProductService);

  searchTerm = signal<string>('');
  selectedSizes = signal<string[]>([]);
  selectedColors = signal<string[]>([]);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  filterDropdownOpen = false;
  sizesColorsDropdownOpen = false;

  availableSizes = signal<string[]>(this.productService.getAllSizes());
  availableColors = signal<string[]>(this.productService.getAllColors());

  hasActiveFilters = computed(() => {
    return this.selectedSizes().length > 0 ||
           this.selectedColors().length > 0 ||
           this.minPrice() !== null ||
           this.maxPrice() !== null;
  });

  hasSizesOrColors = computed(() => {
    return this.selectedSizes().length > 0 || this.selectedColors().length > 0;
  });

  hasPriceFilter = computed(() => {
    return this.minPrice() !== null || this.maxPrice() !== null;
  });

  getSizesColorsCount(): number {
    let count = 0;
    if (this.selectedSizes().length > 0) count++;
    if (this.selectedColors().length > 0) count++;
    return count;
  }

  filteredProducts = computed(() => {
    return this.productService.getProductsByFilters(
      this.selectedSizes(),
      this.selectedColors(),
      this.searchTerm(),
      this.minPrice(),
      this.maxPrice()
    );
  });

  toggleSize(size: string): void {
    const current = this.selectedSizes();
    this.selectedSizes.set(
      current.includes(size) ? current.filter(s => s !== size) : [...current, size]
    );
  }

  toggleColor(color: string): void {
    const current = this.selectedColors();
    this.selectedColors.set(
      current.includes(color) ? current.filter(c => c !== color) : [...current, color]
    );
  }

  getColorHex(color: string): string {
    const map: Record<string, string> = {
      'negro': '#111111',
      'blanco': '#ffffff',
      'gris': '#9ca3af',
      'beige': '#e8d9b9',
      'azul marino': '#1e2a4a',
      'rojo': '#dc2626',
      'verde': '#16a34a',
      'azul': '#2563eb',
      'amarillo': '#eab308'
    };
    return map[color.toLowerCase()] ?? '#cccccc';
  }

  clearSizesColors(): void {
    this.selectedSizes.set([]);
    this.selectedColors.set([]);
  }

  clearPriceFilter(): void {
    this.minPrice.set(null);
    this.maxPrice.set(null);
  }

  clearFilters(): void {
    this.clearSizesColors();
    this.clearPriceFilter();
  }

  clearAllFilters(): void {
    this.searchTerm.set('');
    this.clearSizesColors();
    this.clearPriceFilter();
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-container')) {
      this.filterDropdownOpen = false;
    }
    if (!target.closest('.sizes-colors-dropdown-container')) {
      this.sizesColorsDropdownOpen = false;
    }
  }
}
