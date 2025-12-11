import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { Observable, from } from 'rxjs';

/**
 * Configuración para el servicio de confirmación usando SweetAlert2
 */
export interface ConfirmationConfig {
  title?: string;
  message?: string;
  icon?: {
    show?: boolean;
    name?: 'success' | 'error' | 'warning' | 'info' | 'question';
    color?: 'primary' | 'accent' | 'warn' | 'basic' | 'info' | 'success' | 'warning' | 'error';
  };
  actions?: {
    confirm?: {
      show?: boolean;
      label?: string;
      color?: 'primary' | 'accent' | 'warn' | 'success' | 'danger' | 'warning' | 'info';
    };
    cancel?: {
      show?: boolean;
      label?: string;
    };
    deny?: {
      show?: boolean;
      label?: string;
      color?: 'primary' | 'accent' | 'warn' | 'success' | 'danger' | 'warning' | 'info';
    };
  };
  dismissible?: boolean;
  html?: string; // Permite HTML personalizado en lugar de mensaje simple
}

/**
 * Resultado de la confirmación
 */
export interface ConfirmationResult {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value?: any;
}

/**
 * Servicio de confirmación usando SweetAlert2
 * Proporciona una interfaz similar a MatDialog pero usando SweetAlert2
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private _defaultConfig: ConfirmationConfig = {
    title: 'Confirmar acción',
    message: '¿Estás seguro de realizar esta acción?',
    icon: {
      show: true,
      name: 'warning',
      color: 'warn'
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirmar',
        color: 'warn'
      },
      cancel: {
        show: true,
        label: 'Cancelar'
      },
      deny: {
        show: false,
        label: 'Denegar',
        color: 'warning'
      }
    },
    dismissible: false
  };

  constructor() {}

  /**
   * Abre un diálogo de confirmación con SweetAlert2
   * @param config Configuración del diálogo
   * @returns Observable con el resultado
   */
  open(config: ConfirmationConfig = {}): Observable<ConfirmationResult> {
    // Merge de configuración por defecto con la del usuario
    const mergedConfig = this.mergeConfig(this._defaultConfig, config);

    // Mapear el icono
    const swalIcon = mergedConfig.icon?.show
      ? (mergedConfig.icon.name || 'warning')
      : undefined;

    // Mapear colores de botones a códigos hexadecimales
    const confirmButtonColor = this.mapColorToHex(mergedConfig.actions?.confirm?.color || 'warn');
    const denyButtonColor = this.mapColorToHex(mergedConfig.actions?.deny?.color || 'warning');
    const cancelButtonColor = '#6c757d'; // Color secundario por defecto

    // Configurar SweetAlert2
    const swalPromise = Swal.fire({
      title: mergedConfig.title,
      text: mergedConfig.html ? undefined : mergedConfig.message,
      html: mergedConfig.html || undefined,
      icon: swalIcon,
      showCancelButton: mergedConfig.actions?.cancel?.show ?? true,
      showDenyButton: mergedConfig.actions?.deny?.show ?? false,
      confirmButtonText: mergedConfig.actions?.confirm?.label || 'Confirmar',
      cancelButtonText: mergedConfig.actions?.cancel?.label || 'Cancelar',
      denyButtonText: mergedConfig.actions?.deny?.label || 'Denegar',
      confirmButtonColor: confirmButtonColor,
      denyButtonColor: denyButtonColor,
      cancelButtonColor: cancelButtonColor,
      allowOutsideClick: mergedConfig.dismissible ?? false,
      allowEscapeKey: mergedConfig.dismissible ?? false,
      reverseButtons: false,
      customClass: {
        confirmButton: 'btn btn-' + this.mapColorToBootstrap(mergedConfig.actions?.confirm?.color || 'warn') + ' mx-1',
        denyButton: 'btn btn-' + this.mapColorToBootstrap(mergedConfig.actions?.deny?.color || 'warning') + ' mx-1',
        cancelButton: 'btn btn-secondary mx-1',
        actions: 'd-flex gap-2 justify-content-center'
      },
      buttonsStyling: true // Usar estilos de SweetAlert2 que funcionan mejor con HTML
    });

    // Convertir la promesa a Observable y mapear el resultado
    return from(swalPromise).pipe(
      // map para transformar SweetAlertResult a ConfirmationResult si es necesario
    ) as Observable<ConfirmationResult>;
  }

  /**
   * Cierra todos los diálogos abiertos
   */
  close(): void {
    Swal.close();
  }

  /**
   * Muestra un mensaje de éxito
   */
  success(title: string, message?: string): Observable<ConfirmationResult> {
    return this.open({
      title,
      message,
      icon: { show: true, name: 'success' },
      actions: {
        confirm: { show: true, label: 'Aceptar', color: 'success' },
        cancel: { show: false }
      }
    });
  }

  /**
   * Muestra un mensaje de error
   */
  error(title: string, message?: string): Observable<ConfirmationResult> {
    return this.open({
      title,
      message,
      icon: { show: true, name: 'error' },
      actions: {
        confirm: { show: true, label: 'Aceptar', color: 'danger' },
        cancel: { show: false }
      }
    });
  }

  /**
   * Muestra un mensaje de advertencia
   */
  warning(title: string, message?: string): Observable<ConfirmationResult> {
    return this.open({
      title,
      message,
      icon: { show: true, name: 'warning' },
      actions: {
        confirm: { show: true, label: 'Aceptar', color: 'warning' },
        cancel: { show: false }
      }
    });
  }

  /**
   * Muestra un mensaje de información
   */
  info(title: string, message?: string): Observable<ConfirmationResult> {
    return this.open({
      title,
      message,
      icon: { show: true, name: 'info' },
      actions: {
        confirm: { show: true, label: 'Aceptar', color: 'info' },
        cancel: { show: false }
      }
    });
  }

  // ===== MÉTODOS PRIVADOS =====

  /**
   * Merge profundo de configuraciones
   */
  private mergeConfig(defaults: ConfirmationConfig, custom: ConfirmationConfig): ConfirmationConfig {
    return {
      title: custom.title ?? defaults.title,
      message: custom.message ?? defaults.message,
      html: custom.html,
      icon: {
        show: custom.icon?.show ?? defaults.icon?.show,
        name: custom.icon?.name ?? defaults.icon?.name,
        color: custom.icon?.color ?? defaults.icon?.color
      },
      actions: {
        confirm: {
          show: custom.actions?.confirm?.show ?? defaults.actions?.confirm?.show,
          label: custom.actions?.confirm?.label ?? defaults.actions?.confirm?.label,
          color: custom.actions?.confirm?.color ?? defaults.actions?.confirm?.color
        },
        cancel: {
          show: custom.actions?.cancel?.show ?? defaults.actions?.cancel?.show,
          label: custom.actions?.cancel?.label ?? defaults.actions?.cancel?.label
        },
        deny: {
          show: custom.actions?.deny?.show ?? defaults.actions?.deny?.show,
          label: custom.actions?.deny?.label ?? defaults.actions?.deny?.label,
          color: custom.actions?.deny?.color ?? defaults.actions?.deny?.color
        }
      },
      dismissible: custom.dismissible ?? defaults.dismissible
    };
  }

  /**
   * Mapea colores a códigos hexadecimales
   */
  private mapColorToHex(color: string): string {
    const colorMap: Record<string, string> = {
      primary: '#3085d6',
      accent: '#6366f1',
      warn: '#dc3545',
      danger: '#dc3545',
      success: '#28a745',
      warning: '#f39c12',
      info: '#17a2b8'
    };
    return colorMap[color] || '#3085d6';
  }

  /**
   * Mapea colores a clases de Bootstrap
   */
  private mapColorToBootstrap(color: string): string {
    const colorMap: Record<string, string> = {
      primary: 'primary',
      accent: 'primary',
      warn: 'danger',
      danger: 'danger',
      success: 'success',
      warning: 'warning',
      info: 'info'
    };
    return colorMap[color] || 'primary';
  }

  /**
   * Agrega iconos a los botones si están disponibles
   */
  private addIconToButton(label: string, show: boolean): string {
    if (!show) return label;

    // Si el label ya tiene HTML, retornarlo tal cual
    if (label.includes('<i ') || label.includes('<svg')) {
      return label;
    }

    return label;
  }
}

