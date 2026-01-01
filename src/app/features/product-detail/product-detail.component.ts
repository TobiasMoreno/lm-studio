import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { CartItem } from '../../core/models/cart-item.model';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { getWhatsAppUrl } from '../../core/constants/whatsapp.constants';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    FormsModule,
    CurrencyArsPipe,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    MessageModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product(); as productData) {
      <div class="min-h-screen py-8 md:py-12">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <!-- Imágenes -->
            <div>
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img [ngSrc]="productData.images[0]" 
                     [alt]="productData.name"
                     width="1200"
                     height="1200"
                     class="w-full h-full object-cover"
                     priority>
              </div>
            </div>

            <!-- Información del producto -->
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {{ productData.name }}
              </h1>
              
              <p class="text-3xl font-bold text-gray-900 mb-6">
                {{ productData.price | currencyArs }}
              </p>

              <p class="text-gray-600 mb-8 leading-relaxed">
                {{ productData.description }}
              </p>

              <!-- Selección de talle y color -->
              <div class="space-y-6 mb-8">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Talle <span class="text-red-500">*</span>
                  </label>
                  <p-select 
                    [options]="productData.sizes" 
                    [(ngModel)]="selectedSize"
                    placeholder="Seleccionar talle"
                    styleClass="w-full">
                  </p-select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Color <span class="text-red-500">*</span>
                  </label>
                  <p-select 
                    [options]="productData.colors" 
                    [(ngModel)]="selectedColor"
                    placeholder="Seleccionar color"
                    styleClass="w-full">
                  </p-select>
                </div>

                @if (showValidationError()) {
                  <p-message severity="warn" text="Por favor selecciona talle y color" />
                }
              </div>

              <!-- Botones de acción -->
              <div class="flex flex-col sm:flex-row gap-4">
                <p-button 
                  label="Agregar al carrito"
                  [disabled]="!canAddToCart()"
                  (onClick)="addToCart()"
                  styleClass="flex-1">
                </p-button>
                <p-button 
                  label="Comprar ahora"
                  [disabled]="!canAddToCart()"
                  (onClick)="buyNow()"
                  severity="success"
                  styleClass="flex-1">
                </p-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-screen flex items-center justify-center">
        <div class="text-center">
          <p class="text-gray-600 text-lg mb-4">Producto no encontrado</p>
          <p-button label="Volver a productos" [routerLink]="['/products']" />
        </div>
      </div>
    }
  `
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  selectedSize: string | null = null;
  selectedColor: string | null = null;
  showValidationError = signal(false);

  canAddToCart = computed(() => {
    return this.selectedSize !== null && this.selectedColor !== null;
  });

  constructor() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      const foundProduct = this.productService.getProductById(productId);
      if (foundProduct) {
        this.product.set(foundProduct);
      }
    }
  }

  addToCart(): void {
    if (!this.canAddToCart()) {
      this.showValidationError.set(true);
      return;
    }

    const productData = this.product();
    if (!productData || !this.selectedSize || !this.selectedColor) return;

    const cartItem: CartItem = {
      productId: productData.id,
      productName: productData.name,
      price: productData.price,
      size: this.selectedSize as 'S' | 'M' | 'L' | 'XL',
      color: this.selectedColor,
      image: productData.images[0],
      quantity: 1
    };

    this.cartService.addItem(cartItem);
    this.showValidationError.set(false);
  }

  buyNow(): void {
    if (!this.canAddToCart()) {
      this.showValidationError.set(true);
      return;
    }

    const productData = this.product();
    if (!productData || !this.selectedSize || !this.selectedColor) return;

    const message = `Hola! Quiero comprar la remera:
- Modelo: ${productData.name}
- Talle: ${this.selectedSize}
- Color: ${this.selectedColor}`;

    window.open(getWhatsAppUrl(message), '_blank');
  }
}
