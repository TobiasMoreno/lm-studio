import { Component, ChangeDetectionStrategy, signal, computed, inject, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule, 
    ProductCardComponent, 
    MultiSelectModule, 
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen py-8 md:py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Productos</h1>

        <!-- Búsqueda y Filtro -->
        <div class="mb-8 flex flex-col sm:flex-row gap-3">
          <!-- Búsqueda por nombre -->
          <div class="flex-1 relative">
            <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="Buscar por nombre..."
              [ngModel]="searchTerm()"
              (ngModelChange)="searchTerm.set($event)"
              class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900 placeholder-gray-400" />
          </div>

          <!-- Botón de filtros -->
          <div class="relative filter-dropdown-container">
            <button 
              type="button"
              (click)="filterDropdownOpen = !filterDropdownOpen"
              class="cursor-pointer"
              [class]="hasActiveFilters() 
                ? 'px-4 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium'
                : 'px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium'">
              <i class="pi pi-filter"></i>
              <span>Filtros</span>
              @if (hasActiveFilters()) {
                <span class="ml-1 bg-white text-gray-900 text-xs rounded-full px-2 py-0.5">
                  {{ getActiveFiltersCount() }}
                </span>
              }
            </button>
            
            <!-- Panel de filtros dropdown -->
            @if (filterDropdownOpen) {
              <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-lg font-semibold text-gray-900">Filtros</h3>
              @if (hasActiveFilters()) {
                <button 
                  type="button"
                  (click)="clearFilters()"
                  class="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer">
                  Limpiar
                </button>
              }
            </div>
            
            <!-- Filtro de precio -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-3">Precio</label>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-600 mb-2 block">Mínimo</label>
                  <input 
                    type="number"
                    [ngModel]="minPrice()"
                    (ngModelChange)="minPrice.set($event ? +$event : null)"
                    [min]="0"
                    placeholder="Min"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900">
                </div>
                <div>
                  <label class="text-xs text-gray-600 mb-2 block">Máximo</label>
                  <input 
                    type="number"
                    [ngModel]="maxPrice()"
                    (ngModelChange)="maxPrice.set($event ? +$event : null)"
                    [min]="0"
                    placeholder="Max"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent bg-white text-gray-900">
                </div>
              </div>
            </div>

            <!-- Filtro de talle -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-3">Talles</label>
              <p-multiSelect 
                [options]="availableSizes()" 
                [(ngModel)]="selectedSizesValue"
                (ngModelChange)="onSizesChange($event)"
                placeholder="Seleccionar talles"
                [showClear]="true"
                styleClass="w-full">
              </p-multiSelect>
            </div>

            <!-- Filtro de color -->
            <div>
              <label class="block text-sm font-medium text-gray-900 mb-3">Colores</label>
              <p-multiSelect 
                [options]="availableColors()" 
                [(ngModel)]="selectedColorsValue"
                (ngModelChange)="onColorsChange($event)"
                placeholder="Seleccionar colores"
                [showClear]="true"
                styleClass="w-full">
              </p-multiSelect>
            </div>
              </div>
            }
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
  private cdr = inject(ChangeDetectorRef);

  searchTerm = signal<string>('');
  selectedSizes = signal<string[]>([]);
  selectedColors = signal<string[]>([]);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  filterDropdownOpen = false;

  // Valores para ngModel (necesarios para PrimeNG MultiSelect)
  selectedSizesValue: string[] = [];
  selectedColorsValue: string[] = [];

  availableSizes = signal<string[]>(this.productService.getAllSizes());
  availableColors = signal<string[]>(this.productService.getAllColors());

  constructor() {
    // Sincronizar valores iniciales
    this.selectedSizesValue = this.selectedSizes();
    this.selectedColorsValue = this.selectedColors();
  }

  hasActiveFilters = computed(() => {
    return this.selectedSizes().length > 0 || 
           this.selectedColors().length > 0 || 
           this.minPrice() !== null || 
           this.maxPrice() !== null;
  });

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.selectedSizes().length > 0) count++;
    if (this.selectedColors().length > 0) count++;
    if (this.minPrice() !== null) count++;
    if (this.maxPrice() !== null) count++;
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

  onSizesChange(value: string[]): void {
    this.selectedSizesValue = value || [];
    this.selectedSizes.set(this.selectedSizesValue);
    this.cdr.markForCheck();
  }

  onColorsChange(value: string[]): void {
    this.selectedColorsValue = value || [];
    this.selectedColors.set(this.selectedColorsValue);
    this.cdr.markForCheck();
  }

  clearFilters(): void {
    this.selectedSizesValue = [];
    this.selectedColorsValue = [];
    this.selectedSizes.set([]);
    this.selectedColors.set([]);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.cdr.markForCheck();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown-container')) {
      this.filterDropdownOpen = false;
    }
  }
}
