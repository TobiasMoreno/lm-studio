import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyArs',
  standalone: true
})
export class CurrencyArsPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null || isNaN(value)) {
      return '$0';
    }

    // Formatear sin decimales, con separador de miles
    const formatted = Math.round(value).toLocaleString('es-AR');
    return `$${formatted}`;
  }
}
