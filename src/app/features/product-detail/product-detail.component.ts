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
                    [ngModel]="selectedSize()"
                    (ngModelChange)="selectedSize.set($event)"
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
                    [ngModel]="selectedColor()"
                    (ngModelChange)="selectedColor.set($event)"
                    placeholder="Seleccionar color"
                    styleClass="w-full">
                  </p-select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad (máximo 5 unidades)
                  </label>
                  <p-inputNumber 
                    [ngModel]="quantity()"
                    (ngModelChange)="quantity.set($event)"
                    [min]="1"
                    [max]="availableQuantity() > 0 ? availableQuantity() : 1"
                    [showButtons]="true"
                    [disabled]="availableQuantity() === 0"
                    styleClass="w-full">
                  </p-inputNumber>
                  @if (currentCartQuantity() > 0) {
                    @if (availableQuantity() === 0) {
                      <p class="text-xs text-red-600 mt-1 font-medium">
                        Ya tenés 5 unidades en el carrito (máximo permitido).
                      </p>
                    } @else {
                      <p class="text-xs text-orange-600 mt-1">
                        Ya tenés {{ currentCartQuantity() }} unidad{{ currentCartQuantity() > 1 ? 'es' : '' }} en el carrito.
                        Podés agregar {{ availableQuantity() }} más.
                      </p>
                    }
                  } @else {
                    <p class="text-xs text-gray-500 mt-1">
                      Para más de 5 unidades, consultá disponibilidad por WhatsApp
                    </p>
                  }
                </div>

                @if (showValidationError()) {
                  <p-message severity="warn" text="Por favor selecciona talle y color" />
                }
                
                @if (showQuantityExceededError() && currentCartQuantity() > 0) {
                  <p-message 
                    severity="warn" 
                    [text]="'No se pueden agregar más de ' + availableQuantity() + ' unidades. Ya tenés ' + currentCartQuantity() + ' en el carrito.'" />
                } @else if (showQuantityExceededError()) {
                  <p-message 
                    severity="info" 
                    [text]="'Para más de 5 unidades, consultá disponibilidad por WhatsApp. Se abrirá WhatsApp para consultar.'" />
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
  selectedSize = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  quantity = signal<number>(1);
  showValidationError = signal(false);
  showQuantityExceededError = signal(false);
  
  readonly MAX_QUANTITY = this.cartService.getMaxQuantity();

  canAddToCart = computed(() => {
    return this.selectedSize() !== null && 
           this.selectedColor() !== null && 
           this.availableQuantity() > 0;
  });

  currentCartQuantity = computed(() => {
    const productData = this.product();
    const size = this.selectedSize();
    const color = this.selectedColor();
    
    if (!productData || !size || !color) return 0;
    
    return this.cartService.getItemQuantity(productData.id, size, color);
  });

  availableQuantity = computed(() => {
    return Math.max(0, this.MAX_QUANTITY - this.currentCartQuantity());
  });

  canAddSelectedQuantity = computed(() => {
    return this.quantity() <= this.availableQuantity();
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
      this.showQuantityExceededError.set(false);
      return;
    }

    const productData = this.product();
    const size = this.selectedSize();
    const color = this.selectedColor();
    const qty = this.quantity();
    
    if (!productData || !size || !color) return;

    // Verificar si se puede agregar la cantidad seleccionada
    if (!this.canAddSelectedQuantity()) {
      this.showQuantityExceededError.set(true);
      this.showValidationError.set(false);
      return;
    }

    // Si la cantidad disponible es menor a la seleccionada, ajustar
    const quantityToAdd = Math.min(qty, this.availableQuantity());

    const cartItem: CartItem = {
      productId: productData.id,
      productName: productData.name,
      price: productData.price,
      size: size as 'S' | 'M' | 'L' | 'XL',
      color: color,
      image: productData.images[0],
      quantity: quantityToAdd
    };

    this.cartService.addItem(cartItem);
    this.showValidationError.set(false);
    this.showQuantityExceededError.set(false);
  }

  buyNow(): void {
    if (!this.canAddToCart()) {
      this.showValidationError.set(true);
      this.showQuantityExceededError.set(false);
      return;
    }

    const productData = this.product();
    const size = this.selectedSize();
    const color = this.selectedColor();
    const qty = this.quantity();
    
    if (!productData || !size || !color) return;

    // Verificar si se puede agregar la cantidad seleccionada
    if (!this.canAddSelectedQuantity()) {
      this.showQuantityExceededError.set(true);
      this.showValidationError.set(false);
      return;
    }

    // Ajustar cantidad a la disponible
    const quantityToAdd = Math.min(qty, this.availableQuantity());

    // Agregar al carrito y redirigir al carrito para seleccionar tipo de entrega
    const cartItem: CartItem = {
      productId: productData.id,
      productName: productData.name,
      price: productData.price,
      size: size as 'S' | 'M' | 'L' | 'XL',
      color: color,
      image: productData.images[0],
      quantity: quantityToAdd
    };

    this.cartService.addItem(cartItem);
    this.showValidationError.set(false);
    this.showQuantityExceededError.set(false);
    
    // Redirigir al carrito
    this.router.navigate(['/cart']);
  }

  private consultAvailability(): void {
    const productData = this.product();
    const size = this.selectedSize();
    const color = this.selectedColor();
    const qty = this.quantity();
    
    if (!productData || !size || !color) return;

    const message = `Hola! Quisiera consultar disponibilidad para:
- Modelo: ${productData.name}
- Talle: ${size}
- Color: ${color}
- Cantidad: ${qty} unidades

¿Tienen disponibilidad de esta cantidad?`;

    window.open(getWhatsAppUrl(message), '_blank');
  }
}
