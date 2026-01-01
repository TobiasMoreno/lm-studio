import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, RouterLinkActive, BadgeModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
            LM Studio
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <a routerLink="/" routerLinkActive="text-gray-900 font-semibold" 
               [routerLinkActiveOptions]="{exact: true}"
               class="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </a>
            <a routerLink="/products" routerLinkActive="text-gray-900 font-semibold"
               class="text-gray-600 hover:text-gray-900 transition-colors">
              Productos
            </a>
            <a routerLink="/about" routerLinkActive="text-gray-900 font-semibold"
               class="text-gray-600 hover:text-gray-900 transition-colors">
              Sobre nosotros
            </a>
            
            <!-- Cart Icon -->
            <a routerLink="/cart" class="relative">
              <button pButton 
                      type="button" 
                      icon="pi pi-shopping-cart" 
                      [text]="true"
                      [rounded]="true"
                      class="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              </button>
              @if (cartService.totalItems() > 0) {
                <span pBadge 
                      [value]="cartService.totalItems()" 
                      severity="danger"
                      class="absolute -top-1 -right-1">
                </span>
              }
            </a>
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden p-2 text-gray-600 hover:text-gray-900"
                  (click)="mobileMenuOpen = !mobileMenuOpen"
                  aria-label="Toggle menu">
            <i [class]="mobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'" class="pi text-xl"></i>
          </button>
        </div>

        <!-- Mobile Navigation -->
        @if (mobileMenuOpen) {
          <div class="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div class="flex flex-col gap-4">
              <a routerLink="/" 
                 routerLinkActive="text-gray-900 font-semibold"
                 [routerLinkActiveOptions]="{exact: true}"
                 (click)="mobileMenuOpen = false"
                 class="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </a>
              <a routerLink="/products" 
                 routerLinkActive="text-gray-900 font-semibold"
                 (click)="mobileMenuOpen = false"
                 class="text-gray-600 hover:text-gray-900 transition-colors">
                Productos
              </a>
              <a routerLink="/about" 
                 routerLinkActive="text-gray-900 font-semibold"
                 (click)="mobileMenuOpen = false"
                 class="text-gray-600 hover:text-gray-900 transition-colors">
                Sobre nosotros
              </a>
              <a routerLink="/cart" 
                 (click)="mobileMenuOpen = false"
                 class="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <i class="pi pi-shopping-cart"></i>
                Carrito
                @if (cartService.totalItems() > 0) {
                  <span class="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {{ cartService.totalItems() }}
                  </span>
                }
              </a>
            </div>
          </div>
        }
      </nav>
    </header>
  `
})
export class HeaderComponent {
  cartService = inject(CartService);
  mobileMenuOpen = false;
}
