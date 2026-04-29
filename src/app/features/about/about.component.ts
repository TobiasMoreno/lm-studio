import { Component, ChangeDetectionStrategy } from '@angular/core';
import { getWhatsAppUrl } from '../../core/constants/whatsapp.constants';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen">
      <section class="bg-black text-white py-16 md:py-24">
        <div class="container mx-auto px-4 text-center">
          <span class="inline-block text-xs uppercase tracking-[0.3em] text-brand-accent font-semibold mb-4">
            Detrás de la marca
          </span>
          <h1 class="text-4xl md:text-6xl font-bold leading-tight">
            Sobre el <span class="text-brand-accent">artista</span>
          </h1>
        </div>
      </section>

      <div class="container mx-auto px-4 py-12 md:py-16">
        <div class="max-w-3xl mx-auto">
          
          <div class="prose prose-lg max-w-none">
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              LM Studio nace de la pasión por el arte y el diseño urbano. Cada remera es 
              una expresión única que combina estética minimalista con elementos del streetwear 
              y la cultura contemporánea.
            </p>
            
            <p class="text-gray-600 text-lg leading-relaxed mb-6">
              Nuestro objetivo es crear piezas que no solo sean prendas de vestir, sino 
              también obras de arte que puedas usar en tu día a día. Diseñamos pensando 
              en personas que buscan algo diferente, auténtico y con identidad propia.
            </p>
            
            <div class="bg-gray-50 rounded-lg p-8 my-8">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">¿Cómo comprar?</h2>
              <ol class="list-decimal list-inside space-y-3 text-gray-600">
                <li>Explorá nuestro catálogo de productos</li>
                <li>Seleccioná el modelo, talle y color que te guste</li>
                <li>Agregá al carrito o comprá directamente</li>
                <li>Contactanos por WhatsApp para finalizar tu compra</li>
                <li>Realizá el pago por transferencia bancaria</li>
                <li>Recibí tu pedido en Córdoba</li>
              </ol>
            </div>
            
            <div class="text-center mt-12">
              <a [href]="whatsappUrl" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 class="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                <i class="pi pi-whatsapp mr-2"></i>
                Contactanos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {
  whatsappUrl = getWhatsAppUrl('Hola! Me gustaría conocer más sobre LM Studio.');
}
