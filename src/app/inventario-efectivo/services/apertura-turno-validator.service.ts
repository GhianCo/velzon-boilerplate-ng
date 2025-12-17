import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InventarioEfectivoStore } from '@app/inventario-efectivo/data-access/inventario.efectivo.store';
import { ConfirmationService } from '@sothy/services/confirmation.service';

/**
 * Servicio que centraliza la lógica de validación y acciones para apertura de turno
 * Evita duplicación de código entre guard y componentes
 */
@Injectable({
  providedIn: 'root'
})
export class AperturaTurnoValidatorService {
  private readonly _router = inject(Router);
  private readonly _inventarioEfectivoStore = inject(InventarioEfectivoStore);
  private readonly _confirmationService = inject(ConfirmationService);

  /**
   * Valida si se puede aperturar un turno desde el store
   */
  validar(): { canOpen: boolean; primerRegistro?: any } {
    return this._inventarioEfectivoStore.validarAperturaTurno();
  }

  /**
   * Muestra un diálogo de error cuando no se puede aperturar un turno
   * @param primerRegistro - El registro del turno que está abierto
   * @param onConfirm - Callback opcional a ejecutar después de confirmar
   */
  mostrarDialogoTurnoAbierto(primerRegistro: any, onConfirm?: () => void): void {
    this._confirmationService.openAndHandle(
      {
        title: '⚠️ Turno abierto detectado',
        message: `No se puede aperturar un nuevo turno porque existe un turno actualmente abierto.\n\nTurno: ${primerRegistro?.turno || 'N/A'}\nApertura: ${primerRegistro?.apertura || 'N/A'}\n\nPor favor, cierre el turno actual antes de aperturar uno nuevo.`,
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
   * Intenta navegar a la ruta de apertura de turno
   * Si no se puede, muestra el diálogo y redirige a la lista
   * @returns true si puede navegar, false si no
   */
  intentarAperturar(): boolean {
    const { canOpen, primerRegistro } = this.validar();

    if (canOpen) {
      this._router.navigate(['/inventario-efectivo/nuevo']);
      return true;
    } else {
      this.mostrarDialogoTurnoAbierto(primerRegistro, () => {
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
      this.mostrarDialogoTurnoAbierto(primerRegistro, () => {
        this._router.navigate(['/inventario-efectivo']);
      });
    }

    return canOpen;
  }
}

