import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AperturaCajaValidatorService } from '@app/inventario-caja/services/apertura-caja-validator.service';
import { of } from 'rxjs';

/**
 * Guard que valida si se puede aperturar una nueva caja
 * Delega toda la lógica al servicio centralizado AperturaCajaValidatorService
 */
export const AperturaCajaGuard: CanActivateFn = (_route, _state) => {
  const aperturaCajaValidator = inject(AperturaCajaValidatorService);

  // Delegar validación y redirección al servicio
  const canActivate = aperturaCajaValidator.validarYRedirigir();

  return of(canActivate);
};
