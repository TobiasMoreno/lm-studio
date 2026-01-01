import { inject, Injectable, signal, computed } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

const CART_STORAGE_KEY = 'lm-studio-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>(this.loadCartFromStorage());

  // Computed signals
  totalItems = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    // Sincronizar con localStorage cuando cambie el carrito
    this.cartItems.set(this.loadCartFromStorage());
  }

  getCartItems() {
    return this.cartItems.asReadonly();
  }

  addItem(item: CartItem): void {
    const currentItems = this.cartItems();
    
    // Buscar si ya existe el mismo producto con mismo talle y color
    const existingIndex = currentItems.findIndex(
      existing => 
        existing.productId === item.productId &&
        existing.size === item.size &&
        existing.color === item.color
    );

    if (existingIndex >= 0) {
      // Si existe, aumentar cantidad
      const updatedItems = [...currentItems];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + item.quantity
      };
      this.cartItems.set(updatedItems);
    } else {
      // Si no existe, agregar nuevo item
      this.cartItems.set([...currentItems, item]);
    }

    this.saveCartToStorage();
  }

  updateQuantity(productId: string, size: string, color: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId, size, color);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item =>
      item.productId === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    );
    
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  removeItem(productId: string, size: string, color: string): void {
    const currentItems = this.cartItems();
    const updatedItems = currentItems.filter(
      item => !(item.productId === productId && item.size === size && item.color === color)
    );
    
    this.cartItems.set(updatedItems);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItems.set([]);
    this.saveCartToStorage();
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveCartToStorage(): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cartItems()));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }
}
