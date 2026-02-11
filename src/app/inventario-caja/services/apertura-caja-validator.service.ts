import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InventarioCajaStore } from '@app/inventario-caja/data-access/inventario.caja.store';
import { ConfirmationService } from '@sothy/services/confirmation.service';

/**
 * Servicio que centraliza la lógica de validación y acciones para apertura de caja
 * Evita duplicación de código entre guard y componentes
 */
@Injectable({
  providedIn: 'root'
})
export class AperturaCajaValidatorService {
  private readonly _router = inject(Router);
  private readonly _inventarioCajaStore = inject(InventarioCajaStore);
  private readonly _confirmationService = inject(ConfirmationService);

  /**
   * Valida si se puede aperturar una caja desde el store
   */
  validar(): { canOpen: boolean; primerRegistro?: any } {
    return this._inventarioCajaStore.validarAperturaCaja();
  }

  /**
   * Muestra un diálogo de error cuando no se puede aperturar una caja
   * @param primerRegistro - El registro de la caja que está abierta
   * @param onConfirm - Callback opcional a ejecutar después de confirmar
   */
  mostrarDialogoCajaAbierta(primerRegistro: any, onConfirm?: () => void): void {
    this._confirmationService.openAndHandle(
      {
        title: '⚠️ Caja abierta detectada',
        message: `No se puede aperturar una nueva caja porque existe una caja actualmente abierta.\n\nCaja: ${primerRegistro?.caja || 'N/A'}\nApertura: ${primerRegistro?.apertura || 'N/A'}\n\nPor favor, cierre la caja actual antes de aperturar una nueva.`,
        icon: {
          show: true,
          name: 'warning',
          color: 'warning'
        },
        actions: {
          confirm: {
            show: true,
            label: 'Entendido',
            color: 'primary'
          },
          cancel: {
            show: false
          }
        },
        dismissible: true
      },
      () => {
        if (onConfirm) {
          onConfirm();
        }
      }
    );
  }

  /**
   * Intenta navegar a la ruta de apertura de caja
   * Si no se puede, muestra el diálogo y redirige a la lista
   * @returns true si puede navegar, false si no
   */
  intentarAperturar(): boolean {
    const { canOpen, primerRegistro } = this.validar();

    if (canOpen) {
      this._router.navigate(['/inventario-caja/nuevo']);
      return true;
    } else {
      this.mostrarDialogoCajaAbierta(primerRegistro, () => {
        // No hacer nada adicional cuando se usa desde el componente
      });
      return false;
    }
  }

  /**
   * Valida y redirige si no se puede aperturar (usado en guards)
   * @returns true si puede continuar, false si debe bloquear
   */
  validarYRedirigir(): boolean {
    const { canOpen, primerRegistro } = this.validar();

    if (!canOpen) {
      this.mostrarDialogoCajaAbierta(primerRegistro, () => {
        this._router.navigate(['/inventario-caja']);
      });
    }

    return canOpen;
  }
}
