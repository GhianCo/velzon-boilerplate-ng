import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AperturaTurnoValidatorService } from '@app/inventario-efectivo/services/apertura-turno-validator.service';
import { of } from 'rxjs';

/**
 * Guard que valida si se puede aperturar un nuevo turno
 * Delega toda la lógica al servicio centralizado AperturaTurnoValidatorService
 */
export const AperturaTurnoGuard: CanActivateFn = (_route, _state) => {
  const aperturaTurnoValidator = inject(AperturaTurnoValidatorService);

  // Delegar validación y redirección al servicio
  const canActivate = aperturaTurnoValidator.validarYRedirigir();

  return of(canActivate);
};

