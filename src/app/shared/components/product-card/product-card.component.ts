import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { CurrencyArsPipe } from '../../../shared/pipes/currency-ars.pipe';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, NgOptimizedImage, CurrencyArsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="['/product', product().id]"
       class="block group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-900 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative">
      <button
        type="button"
        (click)="toggleWishlist($event)"
        [attr.aria-label]="isFavorite() ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        [attr.aria-pressed]="isFavorite()"
        class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center hover:bg-white hover:scale-110 transition-all cursor-pointer">
        <i [class]="isFavorite() ? 'pi pi-heart-fill text-brand-accent' : 'pi pi-heart text-gray-600'"></i>
      </button>
      <div class="aspect-square overflow-hidden bg-gray-100 relative">
        <img [ngSrc]="product().images[0]"
             [alt]="product().name"
             width="1200"
             height="1200"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             priority>
        <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
          <span class="text-white text-sm font-semibold tracking-wide">Ver detalle →</span>
        </div>
      </div>
      <div class="p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-2 group-hover:text-black transition-colors line-clamp-1">
          {{ product().name }}
        </h3>
        <p class="text-xl font-bold text-gray-900 mb-3">
          {{ product().price | currencyArs }}
        </p>

        <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
          <div class="flex items-center gap-1 text-xs text-gray-600 font-medium">
            @for (size of product().sizes; track size; let last = $last) {
              <span>{{ size }}</span>
              @if (!last) { <span class="text-gray-300">·</span> }
            }
          </div>
          <div class="flex items-center gap-1" [attr.aria-label]="'Colores disponibles: ' + product().colors.join(', ')">
            @for (color of product().colors; track color) {
              <span
                class="inline-block w-3.5 h-3.5 rounded-full border border-gray-300"
                [style.background-color]="getColorHex(color)"
                [title]="color">
              </span>
            }
          </div>
        </div>
      </div>
    </a>
  `
})
export class ProductCardComponent {
  private wishlistService = inject(WishlistService);

  product = input.required<Product>();

  isFavorite = computed(() => this.wishlistService.isInWishlist(this.product().id));

  toggleWishlist(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.wishlistService.toggle(this.product().id);
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
}
