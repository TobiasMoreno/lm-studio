import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { getWhatsAppUrl, WHATSAPP_NUMBER } from '../../core/constants/whatsapp.constants';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-gray-50 border-t border-gray-200 mt-auto">
      <div class="container mx-auto px-4 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Brand -->
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-4">LM Studio</h3>
            <p class="text-gray-600 text-sm">
              Remeras artísticas y urbanas diseñadas con pasión.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">Navegación</h4>
            <ul class="space-y-2">
              <li>
                <a routerLink="/" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a routerLink="/products" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Productos
                </a>
              </li>
              <li>
                <a routerLink="/about" class="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Sobre nosotros
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-4">Contacto</h4>
            <ul class="space-y-2">
              <li>
                <a [href]="whatsappUrl" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="text-gray-600 hover:text-gray-900 text-sm transition-colors flex items-center gap-2">
                  <i class="pi pi-whatsapp"></i>
                  WhatsApp
                </a>
              </li>
              <li class="text-gray-600 text-sm">
                Envíos a Córdoba
              </li>
              <li class="text-gray-600 text-sm">
                Pago por transferencia bancaria
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {{ currentYear }} LM Studio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  whatsappUrl = getWhatsAppUrl('Hola! Me gustaría hacer una consulta.');
}
