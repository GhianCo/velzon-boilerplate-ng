import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimplebarAngularModule } from 'simplebar-angular';

/**
 * Componente reutilizable para mostrar estados de carga
 * Útil cuando se están cargando datos desde el servidor
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, SimplebarAngularModule],
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  /**
   * Mensaje que se muestra debajo del spinner
   */
  @Input() message: string = 'Cargando...';

  /**
   * Tamaño del spinner: 'sm', 'md', 'lg'
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Color del spinner: 'primary', 'secondary', 'success', etc.
   */
  @Input() color: string = 'primary';

  /**
   * Usar simplebar wrapper o no
   */
  @Input() useSimplebar: boolean = true;

  /**
   * Clases CSS adicionales para el contenedor
   */
  @Input() containerClass?: string;

  /**
   * ID del elemento (útil para selectores)
   */
  @Input() elementId: string = 'elmLoader';

  /**
   * Obtiene la clase del tamaño del spinner
   */
  get sizeClass(): string {
    switch (this.size) {
      case 'sm': return 'spinner-border-sm';
      case 'lg': return 'avatar-lg';
      default: return 'avatar-sm';
    }
  }
}

