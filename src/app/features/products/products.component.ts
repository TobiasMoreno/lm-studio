import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ProductCardComponent, MultiSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen py-8 md:py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Productos</h1>

        <!-- Filtros -->
        <div class="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Talles</label>
              <p-multiSelect 
                [options]="availableSizes()" 
                [(ngModel)]="selectedSizes"
                placeholder="Seleccionar talles"
                [showClear]="true"
                styleClass="w-full">
              </p-multiSelect>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Colores</label>
              <p-multiSelect 
                [options]="availableColors()" 
                [(ngModel)]="selectedColors"
                placeholder="Seleccionar colores"
                [showClear]="true"
                styleClass="w-full">
              </p-multiSelect>
            </div>
          </div>
        </div>

        <!-- Grid de productos -->
        @if (filteredProducts().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (product of filteredProducts(); track product.id) {
              <app-product-card [product]="product" />
            }
          </div>
        } @else {
          <div class="text-center py-12">
            <p class="text-gray-600 text-lg">No se encontraron productos con los filtros seleccionados.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ProductsComponent {
  private productService = inject(ProductService);

  selectedSizes: string[] = [];
  selectedColors: string[] = [];

  availableSizes = signal<string[]>(this.productService.getAllSizes());
  availableColors = signal<string[]>(this.productService.getAllColors());

  filteredProducts = computed(() => {
    return this.productService.getProductsByFilters(
      this.selectedSizes,
      this.selectedColors
    );
  });
}
