import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente reutilizable para mostrar estados vacíos
 * Útil cuando no hay datos para mostrar en tablas, listas, etc.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  /**
   * Título del mensaje
   */
  @Input() title: string = 'No se encontraron resultados';

  /**
   * Mensaje descriptivo opcional
   */
  @Input() message?: string;

  /**
   * Nombre del icono de lord-icon (opcional)
   */
  @Input() iconSrc?: string = 'https://cdn.lordicon.com/msoeawqm.json';

  /**
   * Mostrar o ocultar el icono
   */
  @Input() showIcon: boolean = true;

  /**
   * Colores del icono lord-icon
   */
  @Input() iconColors: string = 'primary:#405189,secondary:#0ab39c';

  /**
   * Tamaño del icono
   */
  @Input() iconSize: string = '72px';

  /**
   * Clase CSS adicional para personalización
   */
  @Input() customClass?: string;
}


