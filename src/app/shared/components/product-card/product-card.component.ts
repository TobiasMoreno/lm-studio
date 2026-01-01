import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { CurrencyArsPipe } from '../../../shared/pipes/currency-ars.pipe';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, NgOptimizedImage, CurrencyArsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a [routerLink]="['/product', product().id]" 
       class="block group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div class="aspect-square overflow-hidden bg-gray-100">
        <img [ngSrc]="product().images[0]" 
             [alt]="product().name"
             width="1200"
             height="1200"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             priority>
      </div>
      <div class="p-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
          {{ product().name }}
        </h3>
        <p class="text-xl font-bold text-gray-900">
          {{ product().price | currencyArs }}
        </p>
      </div>
    </a>
  `
})
export class ProductCardComponent {
  product = input.required<Product>();
}
