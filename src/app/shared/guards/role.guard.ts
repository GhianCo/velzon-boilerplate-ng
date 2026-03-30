import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@sothy/services/auth.service';

/**
 * Guard de roles Keycloak.
 *
 * Uso en rutas:
 *   data: { roles: ['caja.module'] }
 *
 * El usuario debe tener AL MENOS UNO de los roles listados en data.roles
 * (leídos de resource_access[clientId].roles en el token KC).
 * Si no los tiene, se redirige a /no-access.
 */
export const RoleGuard: CanActivateFn | CanActivateChildFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles: string[] = route.data?.['roles'] ?? [];

  if (requiredRoles.length === 0) {
    return true;
  }

  const hasRole = requiredRoles.some(role => authService.hasKcRole(role));

  if (!hasRole) {
    return router.parseUrl('/no-access');
  }

  return true;
};
