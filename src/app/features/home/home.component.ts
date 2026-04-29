import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="bg-black text-white py-24 md:py-36 relative overflow-hidden">
        <div class="absolute inset-0 opacity-[0.04]"
             style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 32px 32px;"></div>
        <div class="container mx-auto px-4 relative">
          <div class="max-w-3xl mx-auto text-center">
            <span class="inline-block text-xs uppercase tracking-[0.3em] text-brand-accent font-semibold mb-6">
              Streetwear · Arte · Córdoba
            </span>
            <h1 class="text-5xl md:text-7xl font-bold mb-6 leading-[0.95]">
              Remeras
              <span class="block">que son <span class="text-brand-accent">arte</span>.</span>
            </h1>
            <p class="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Diseños abstractos, urbanos y minimalistas. Cada pieza, una expresión.
            </p>
            <a routerLink="/products"
               class="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-md hover:bg-brand-accent hover:text-white transition-colors">
              Ver productos
              <i class="pi pi-arrow-right text-sm"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-20 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div class="text-center">
              <div class="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-5">
                <i class="pi pi-palette text-xl text-white"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Diseño único</h3>
              <p class="text-gray-600 text-sm">Cada remera es una obra de arte original.</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-5">
                <i class="pi pi-check-circle text-xl text-white"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Calidad premium</h3>
              <p class="text-gray-600 text-sm">Materiales 100% algodón seleccionado.</p>
            </div>
            <div class="text-center">
              <div class="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-5">
                <i class="pi pi-truck text-xl text-white"></i>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Envío local</h3>
              <p class="text-gray-600 text-sm">Coordinamos envío en Córdoba por WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {}
