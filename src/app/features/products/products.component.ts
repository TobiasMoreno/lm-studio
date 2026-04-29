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

          <!-- Botones de filtros -->
          <div class="flex gap-3">
            <!-- Dropdown de Talles y Colores -->
            <div class="relative sizes-colors-dropdown-container">
              <button 
                type="button"
                (click)="sizesColorsDropdownOpen = !sizesColorsDropdownOpen"
                [class]="hasSizesOrColors() 
                  ? 'cursor-pointer px-4 py-3 bg-gray-900 text-white border border-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium'
                  : 'cursor-pointer px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium'">
                <i class="pi pi-list"></i>
                <span>Talles y Colores</span>
                @if (hasSizesOrColors()) {
                  <span class="ml-1 bg-white text-gray-900 text-xs rounded-full px-2 py-0.5">
                    {{ getSizesColorsCount() }}
                  </span>
                }
              </button>
              
              <!-- Panel de talles y colores -->
              @if (sizesColorsDropdownOpen) {
                <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-6 space-y-6">
                  <div class="flex items-center justify-between mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">Talles y Colores</h3>
                    @if (hasSizesOrColors()) {
                      <button 
                        type="button"
                        (click)="clearSizesColors()"
                        class="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer">
                        Limpiar
                      </button>
                    }
                  </div>
                  
                  <!-- Filtro de talle -->
                  <div>
                    <label class="block text-sm font-medium text-gray-900 mb-3">Talles</label>
                    <div class="flex flex-wrap gap-2">
                      @for (size of availableSizes(); track size) {
                        <button
                          type="button"
                          (click)="toggleSize(size)"
                          [attr.aria-pressed]="selectedSizes().includes(size)"
                          [class]="selectedSizes().includes(size)
                            ? 'min-w-12 px-3 py-1.5 border-2 border-black bg-black text-white rounded-md text-sm font-semibold cursor-pointer'
                            : 'min-w-12 px-3 py-1.5 border-2 border-gray-300 bg-white text-gray-900 rounded-md text-sm font-semibold hover:border-gray-900 cursor-pointer'">
                          {{ size }}
                        </button>
                      }
                    </div>
                  </div>

                  <!-- Filtro de color -->
                  <div>
                    <label class="block text-sm font-medium text-gray-900 mb-3">Colores</label>
                    <div class="flex flex-wrap gap-2">
                      @for (color of availableColors(); track color) {
                        <button
                          type="button"
                          (click)="toggleColor(color)"
                          [attr.aria-pressed]="selectedColors().includes(color)"
                          [class]="selectedColors().includes(color)
                            ? 'flex items-center gap-2 px-3 py-1.5 border-2 border-black bg-white rounded-md text-sm font-medium text-gray-900 cursor-pointer'
                            : 'flex items-center gap-2 px-3 py-1.5 border-2 border-gray-300 bg-white rounded-md text-sm font-medium text-gray-900 hover:border-gray-900 cursor-pointer'">
                          <span class="inline-block w-4 h-4 rounded-full border border-gray-300"
                                [style.background-color]="getColorHex(color)"></span>
                          {{ color }}
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Botón de filtros de precio -->
            <div class="relative filter-dropdown-container">
              <button 
                type="button"
                (click)="filterDropdownOpen = !filterDropdownOpen"
                [class]="hasPriceFilter() 
                  ? 'cursor-pointer px-4 py-3 bg-gray-900 text-white border border-gray-900 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 font-medium'
                  : 'cursor-pointer px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium'">
                <i class="pi pi-filter"></i>
                <span>Precio</span>
                @if (hasPriceFilter()) {
                  <span class="ml-1 bg-white text-gray-900 text-xs rounded-full px-2 py-0.5">
                    1
                  </span>
                }
              </button>
              
              <!-- Panel de filtros de precio -->
              @if (filterDropdownOpen) {
                <div class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Precio</h3>
                    @if (hasPriceFilter()) {
                      <button 
                        type="button"
                        (click)="clearPriceFilter()"
                        class="text-sm text-gray-600 hover:text-gray-900 underline cursor-pointer">
                        Limpiar
                      </button>
                    }
                  </div>
                  
                  <!-- Filtro de precio -->
                  <div>
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
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Resumen de filtros activos -->
        @if (hasActiveFilters() || searchTerm()) {
          <div class="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <span class="text-gray-600">Mostrando {{ filteredProducts().length }} resultado{{ filteredProducts().length === 1 ? '' : 's' }}</span>
            <button
              type="button"
              (click)="clearAllFilters()"
              class="text-gray-900 hover:text-black underline underline-offset-2 cursor-pointer font-medium">
              Limpiar todo
            </button>
          </div>
        }

        <!-- Grid de productos -->
        @if (filteredProducts().length > 0) {
          <!-- Trigger para carga diferida -->
          <div #productsTrigger class="h-1"></div>
          @defer (on viewport(productsTrigger)) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (product of filteredProducts(); track product.id) {
                <app-product-card [product]="product" />
              }
            </div>
          } @placeholder {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (placeholder of [1, 2, 3, 4, 5, 6, 7, 8]; track placeholder) {
                <div class="bg-gray-200 animate-pulse rounded-lg aspect-3/4"></div>
              }
            </div>
          }
        } @else {
          <div class="text-center py-16">
            <i class="pi pi-search text-5xl text-gray-300 mb-4 block"></i>
            <p class="text-gray-700 text-lg font-medium mb-2">No se encontraron productos</p>
            <p class="text-gray-500 mb-6">Probá ajustando los filtros o limpiándolos para ver todos los productos.</p>
            @if (hasActiveFilters() || searchTerm()) {
              <p-button
                label="Limpiar filtros"
                icon="pi pi-filter-slash"
                (onClick)="clearAllFilters()"
                [outlined]="true">
              </p-button>
            }
          </div>
        }
      </div>
    </div>
  `
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
