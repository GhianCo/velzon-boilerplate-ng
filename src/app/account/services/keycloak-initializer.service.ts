import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@sothy/services/auth.service';
import { KeycloakService } from '@app/account/services/keycloak.service';

/**
 * Inicializador que corre en APP_INITIALIZER.
 *
 * Con onLoad: 'login-required', keycloak.init() bloquea hasta que el usuario
 * está autenticado (redirigiendo a Keycloak si es necesario). Cuando llega aquí
 * authenticated siempre es true.
 *
 * Expone `authReady`: una Promise que resuelve una vez que el token Bearer
 * ha sido guardado. SalaInitializerService la awaita para garantizar orden.
 */
@Injectable({ providedIn: 'root' })
export class KeycloakInitializerService {
  private _keycloakService = inject(KeycloakService);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  /** Resuelve en cuanto el token está guardado en AuthService. */
  private _authReadyResolve!: () => void;
  readonly authReady = new Promise<void>(resolve => (this._authReadyResolve = resolve));

  /** True si KC autenticó con éxito al usuario. */
  isAuthenticated = false;

  async initialize(): Promise<void> {
    const authenticated = await this._keycloakService.init();

    if (!authenticated || !this._keycloakService.token) {
      // Resolver igualmente para que SalaInitializerService no quede bloqueado.
      this._authReadyResolve();
      return;
    }

    // Guardar el token Keycloak como accessToken de la app.
    // Esto ocurre ANTES de que el router Angular evalúe cualquier guard.
    this._authService.accessToken = this._keycloakService.token;
    this.isAuthenticated = true;

    // Notificar a SalaInitializerService que el token ya está disponible.
    this._authReadyResolve();

    // El router aún no ha arrancado; esperamos un tick.
    setTimeout(() => this._router.navigate(['/inventario-efectivo']), 0);
  }
}
