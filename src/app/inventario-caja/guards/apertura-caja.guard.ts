import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { AperturaCajaValidatorService } from '@app/inventario-caja/services/apertura-caja-validator.service';
import { of } from 'rxjs';

/**
 * Guard que valida si se puede aperturar una nueva caja.
 * Se omite la validación cuando la navegación proviene de una apertura
 * exitosa de bóveda (queryParam fromBoveda=1).
 */
export const AperturaCajaGuard: CanActivateFn = (route: ActivatedRouteSnapshot, _state) => {
  if (route.queryParamMap.get('fromBoveda') === '1') {
    return of(true);
  }

  const aperturaCajaValidator = inject(AperturaCajaValidatorService);
  return of(aperturaCajaValidator.validarYRedirigir());
};
