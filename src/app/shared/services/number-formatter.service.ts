import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NumberFormatterService {
  /**
   * Formatea un número (o string con número) a formato con separador de miles y 2 decimales.
   * Ejemplos: 1000 -> "1,000.00", 1 -> "1.00", 1000000 -> "1,000,000.00"
   */
  static formatNumber(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '0.00';
    }

    // Eliminar comas existentes si vienen en el string y convertir a número
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

    if (isNaN(numValue)) {
      return '0.00';
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
  }

  // Método de instancia por si se prefiere inyectar el servicio
  formatNumber(value: number | string | null | undefined): string {
    return NumberFormatterService.formatNumber(value);
  }
}

