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
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    FormsModule,
    CurrencyArsPipe,
    ButtonModule,
    InputNumberModule,
    MessageModule,
    ProductCardComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (product(); as productData) {
      <div class="min-h-screen py-8 md:py-12">
        <div class="container mx-auto px-4">
          <!-- Breadcrumbs -->
          <nav aria-label="Breadcrumb" class="max-w-6xl mx-auto mb-6">
            <ol class="flex items-center gap-2 text-sm text-gray-500">
              <li><a routerLink="/" class="hover:text-gray-900 transition-colors">Inicio</a></li>
              <li aria-hidden="true" class="text-gray-300">/</li>
              <li><a routerLink="/products" class="hover:text-gray-900 transition-colors">Productos</a></li>
              <li aria-hidden="true" class="text-gray-300">/</li>
              <li class="text-gray-900 font-medium truncate" aria-current="page">{{ productData.name }}</li>
            </ol>
          </nav>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <!-- Imágenes -->
            <div class="flex gap-3">
              @if (productData.images.length > 1) {
                <div class="flex flex-col gap-2 w-16 md:w-20 shrink-0" role="tablist" aria-label="Imágenes del producto">
                  @for (img of productData.images; track img; let i = $index) {
                    <button
                      type="button"
                      role="tab"
                      [attr.aria-selected]="activeImage() === i"
                      (click)="activeImage.set(i)"
                      [class]="activeImage() === i
                        ? 'aspect-square bg-gray-100 rounded-md overflow-hidden border-2 border-black cursor-pointer'
                        : 'aspect-square bg-gray-100 rounded-md overflow-hidden border-2 border-transparent hover:border-gray-400 cursor-pointer'">
                      <img [ngSrc]="img"
                           [alt]="productData.name + ' vista ' + (i + 1)"
                           width="200"
                           height="200"
                           class="w-full h-full object-cover">
                    </button>
                  }
                </div>
              }
              <div class="flex-1">
                <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img [ngSrc]="productData.images[activeImage()] || productData.images[0]"
                       [alt]="productData.name"
                       width="1200"
                       height="1200"
                       class="w-full h-full object-cover"
                       priority>
                </div>
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
                  <div class="flex items-baseline justify-between mb-3">
                    <label class="text-sm font-medium text-gray-900">
                      Talle <span class="text-red-500">*</span>
                    </label>
                    @if (selectedSize()) {
                      <span class="text-sm text-gray-600">Seleccionado: <span class="font-semibold text-gray-900">{{ selectedSize() }}</span></span>
                    }
                  </div>
                  <div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Talle">
                    @for (size of productData.sizes; track size) {
                      <button
                        type="button"
                        role="radio"
                        [attr.aria-checked]="selectedSize() === size"
                        (click)="selectedSize.set(size)"
                        [class]="selectedSize() === size
                          ? 'min-w-12 px-4 py-2 border-2 border-black bg-black text-white rounded-md font-semibold transition-all cursor-pointer'
                          : 'min-w-12 px-4 py-2 border-2 border-gray-300 bg-white text-gray-900 rounded-md font-semibold hover:border-gray-900 transition-all cursor-pointer'">
                        {{ size }}
                      </button>
                    }
                  </div>
                </div>

                <div>
                  <div class="flex items-baseline justify-between mb-3">
                    <label class="text-sm font-medium text-gray-900">
                      Color <span class="text-red-500">*</span>
                    </label>
                    @if (selectedColor()) {
                      <span class="text-sm text-gray-600">Seleccionado: <span class="font-semibold text-gray-900">{{ selectedColor() }}</span></span>
                    }
                  </div>
                  <div class="flex flex-wrap gap-3" role="radiogroup" aria-label="Color">
                    @for (color of productData.colors; track color) {
                      <button
                        type="button"
                        role="radio"
                        [attr.aria-checked]="selectedColor() === color"
                        [attr.aria-label]="color"
                        [title]="color"
                        (click)="selectedColor.set(color)"
                        [class]="selectedColor() === color
                          ? 'flex items-center gap-2 px-3 py-2 border-2 border-black bg-white rounded-md transition-all cursor-pointer'
                          : 'flex items-center gap-2 px-3 py-2 border-2 border-gray-300 bg-white rounded-md hover:border-gray-900 transition-all cursor-pointer'">
                        <span
                          class="inline-block w-5 h-5 rounded-full border border-gray-300"
                          [style.background-color]="getColorHex(color)">
                        </span>
                        <span class="text-sm font-medium text-gray-900">{{ color }}</span>
                      </button>
                    }
                  </div>
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
                      <p-message
                        severity="error"
                        styleClass="mt-2"
                        text="Ya tenés 5 unidades en el carrito (máximo permitido)." />
                    } @else {
                      <p-message
                        severity="warn"
                        styleClass="mt-2"
                        [text]="'Ya tenés ' + currentCartQuantity() + ' en el carrito. Podés agregar ' + availableQuantity() + ' más.'" />
                    }
                  } @else {
                    <p class="text-xs text-gray-500 mt-2">
                      <i class="pi pi-info-circle"></i>
                      Para más de 5 unidades, consultá disponibilidad por WhatsApp.
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
              <div class="flex flex-col sm:flex-row gap-3">
                <p-button
                  label="Agregar al carrito"
                  icon="pi pi-shopping-cart"
                  [disabled]="!canAddToCart()"
                  (onClick)="addToCart()"
                  [outlined]="true"
                  styleClass="flex-1">
                </p-button>
                <p-button
                  label="Agregar e ir al carrito"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  [disabled]="!canAddToCart()"
                  (onClick)="buyNow()"
                  styleClass="flex-1">
                </p-button>
              </div>
              <p class="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <i class="pi pi-whatsapp text-green-600"></i>
                El pedido se confirma por WhatsApp después de revisar el carrito.
              </p>
            </div>
          </div>

          <!-- Productos relacionados -->
          @if (relatedProducts().length > 0) {
            <section class="max-w-6xl mx-auto mt-20">
              <div class="flex items-end justify-between mb-6">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900">También te puede gustar</h2>
                <a routerLink="/products" class="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2">
                  Ver todo
                </a>
              </div>
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                @for (related of relatedProducts(); track related.id) {
                  <app-product-card [product]="related" />
                }
              </div>
            </section>
          }
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
  private messageService = inject(MessageService);

  product = signal<Product | null>(null);
  selectedSize = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  quantity = signal<number>(1);
  showValidationError = signal(false);
  showQuantityExceededError = signal(false);
  activeImage = signal(0);
  
  readonly MAX_QUANTITY = this.cartService.getMaxQuantity();

  canAddToCart = computed(() => {
    return this.selectedSize() !== null &&
           this.selectedColor() !== null &&
           this.availableQuantity() > 0;
  });

  relatedProducts = computed(() => {
    const current = this.product();
    if (!current) return [];
    return this.productService.getRelatedProducts(current.id, 4);
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

    this.messageService.add({
      severity: 'success',
      summary: 'Agregado al carrito',
      detail: `${productData.name} · Talle ${size} · ${color}`,
      life: 3000
    });
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
