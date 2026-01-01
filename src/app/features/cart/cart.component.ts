import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { getWhatsAppUrl } from '../../core/constants/whatsapp.constants';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    RouterLink,
    NgOptimizedImage,
    FormsModule,
    CurrencyArsPipe,
    ButtonModule,
    InputNumberModule,
    RadioButtonModule,
    InputTextModule,
    MessageModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen py-8 md:py-12">
      <div class="container mx-auto px-4">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

        @if (cartService.isEmpty()) {
          <div class="text-center py-12">
            <i class="pi pi-shopping-cart text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-600 text-lg mb-6">Tu carrito está vacío</p>
            <p-button label="Ver Productos" [routerLink]="['/products']" />
          </div>
        } @else {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Lista de productos -->
            <div class="lg:col-span-2 space-y-4">
              @for (item of cartService.getCartItems()(); track item.productId + item.size + item.color) {
                <div class="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                  <img [ngSrc]="item.image" 
                       [alt]="item.productName"
                       width="150"
                       height="150"
                       class="w-full sm:w-24 h-24 object-cover rounded">
                  
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 mb-1">{{ item.productName }}</h3>
                    <p class="text-sm text-gray-600 mb-2">
                      Talle: {{ item.size }} | Color: {{ item.color }}
                    </p>
                    <p class="text-lg font-bold text-gray-900">
                      {{ (item.price * item.quantity) | currencyArs }}
                    </p>
                  </div>

                  <div class="flex flex-col items-end gap-2">
                    <p-inputNumber 
                      [ngModel]="item.quantity"
                      [min]="1"
                      [showButtons]="true"
                      (ngModelChange)="updateQuantity(item, $event)"
                      styleClass="w-24">
                    </p-inputNumber>
                    <button 
                      (click)="removeItem(item)"
                      class="text-red-500 hover:text-red-700 text-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Resumen -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
                
                <div class="space-y-3 mb-6">
                  <div class="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{{ cartService.totalPrice() | currencyArs }}</span>
                  </div>
                  <div class="flex justify-between text-gray-600">
                    <span>Envio</span>
                    <span>Consultar</span>
                  </div>
                  <div class="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{{ cartService.totalPrice() | currencyArs }}</span>
                  </div>
                </div>

                <!-- Tipo de entrega -->
                <div class="mb-6">
                  <h3 class="text-sm font-semibold text-gray-900 mb-3">Tipo de entrega</h3>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <p-radioButton 
                        inputId="retiro"
                        value="retiro"
                        [(ngModel)]="deliveryType"
                        (ngModelChange)="onDeliveryTypeChange($event)"
                        styleClass="mr-2">
                      </p-radioButton>
                      <label for="retiro" class="ml-2 text-gray-700 cursor-pointer">Retiro en local</label>
                    </div>
                    <div class="flex items-center">
                      <p-radioButton 
                        inputId="envio"
                        value="envio"
                        [(ngModel)]="deliveryType"
                        (ngModelChange)="onDeliveryTypeChange($event)"
                        styleClass="mr-2">
                      </p-radioButton>
                      <label for="envio" class="ml-2 text-gray-700 cursor-pointer">Envío a domicilio</label>
                    </div>
                  </div>
                </div>

                <!-- Campo de dirección (solo si es envío) -->
                @if (deliveryType === 'envio') {
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de envío <span class="text-red-500">*</span>
                    </label>
                    <div class="space-y-2">
                      <input 
                        type="text"
                        pInputText
                        [ngModel]="deliveryAddress()"
                        (ngModelChange)="deliveryAddress.set($event)"
                        placeholder="Ingresá tu dirección completa"
                        class="w-full"
                        [class.border-red-500]="showAddressError() && !deliveryAddress()">
                      <button
                        type="button"
                        (click)="openGoogleMaps()"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i class="pi pi-map-marker"></i>
                        <span>Seleccionar ubicación en Google Maps</span>
                      </button>
                      @if (showAddressError() && !deliveryAddress) {
                        <p-message severity="error" text="Por favor ingresá una dirección de envío" />
                      }
                    </div>
                  </div>
                }

                <p-button 
                  label="Finalizar compra"
                  (onClick)="checkout()"
                  severity="success"
                  styleClass="w-full mb-4">
                </p-button>

                <p-button 
                  label="Seguir comprando"
                  [routerLink]="['/products']"
                  [text]="true"
                  styleClass="w-full">
                </p-button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class CartComponent {
  cartService = inject(CartService);

  deliveryType: 'retiro' | 'envio' | null = null;
  deliveryAddress = signal<string>('');
  showAddressError = signal(false);

  updateQuantity(item: any, quantity: number): void {
    this.cartService.updateQuantity(item.productId, item.size, item.color, quantity);
  }

  removeItem(item: any): void {
    this.cartService.removeItem(item.productId, item.size, item.color);
  }

  onDeliveryTypeChange(type: 'retiro' | 'envio'): void {
    this.deliveryType = type;
    if (type === 'retiro') {
      this.deliveryAddress.set('');
      this.showAddressError.set(false);
    }
  }

  openGoogleMaps(): void {
    // Abre Google Maps para que el usuario pueda buscar su dirección
    // El usuario puede copiar la dirección desde Maps y pegarla en el campo
    const mapsUrl = 'https://www.google.com/maps/search/?api=1';
    window.open(mapsUrl, '_blank');
  }

  checkout(): void {
    // Validar que se haya seleccionado un tipo de entrega
    if (!this.deliveryType) {
      // Podrías mostrar un mensaje aquí si quieres
      return;
    }

    // Validar que si es envío, tenga dirección
    if (this.deliveryType === 'envio') {
      if (!this.deliveryAddress() || this.deliveryAddress().trim() === '') {
        this.showAddressError.set(true);
        return;
      }
    }

    const items = this.cartService.getCartItems()();
    const total = this.cartService.totalPrice();

    let message = 'Hola! Quiero comprar las siguientes remeras:\n\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. Modelo: ${item.productName}\n`;
      message += `   - Talle: ${item.size}\n`;
      message += `   - Color: ${item.color}\n`;
      message += `   - Cantidad: ${item.quantity}\n\n`;
    });

    message += `Total: $${total.toLocaleString('es-AR')}\n\n`;

    // Agregar información de entrega
    if (this.deliveryType === 'retiro') {
      message += 'Tipo de entrega: Retiro en local\n';
    } else if (this.deliveryType === 'envio') {
      message += `Tipo de entrega: Envío a domicilio\n`;
      message += `Dirección: ${this.deliveryAddress()}\n`;
    }

    this.showAddressError.set(false);
    window.open(getWhatsAppUrl(message), '_blank');
  }
}
