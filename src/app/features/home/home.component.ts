import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="bg-gray-50 py-20 md:py-32">
        <div class="container mx-auto px-4">
          <div class="max-w-3xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Remeras Artísticas
              <span class="block text-gray-600">Diseño Único</span>
            </h1>
            <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Descubre nuestra colección de remeras con diseños abstractos, urbanos y minimalistas. 
              Cada pieza es una expresión de arte.
            </p>
            <p-button 
              label="Ver Productos" 
              [routerLink]="['/products']"
              styleClass="px-8 py-3 text-lg">
            </p-button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div class="text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-palette text-2xl text-gray-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Diseño Único</h3>
              <p class="text-gray-600">Cada remera es una obra de arte original</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-check-circle text-2xl text-gray-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Calidad Premium</h3>
              <p class="text-gray-600">Materiales de primera calidad</p>
            </div>
            <div class="text-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="pi pi-truck text-2xl text-gray-600"></i>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">Envío Local</h3>
              <p class="text-gray-600">Envíos a Córdoba con costo fijo</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {}
