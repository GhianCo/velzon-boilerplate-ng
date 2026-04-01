import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@sothy/services/auth.service';
import { KeycloakService } from '@app/account/services/keycloak.service';

/**
 * Inicializador que corre en APP_INITIALIZER.
 *
 * Con onLoad: 'check-sso', keycloak.init() valida la sesión SSO activa via
 * un iframe silencioso sin redirigir el browser principal. Esto preserva el
 * hash de Angular al hacer F5. Si no hay sesión activa, se redirige a KC login.
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
      // Sin sesión activa → redirigir a KC login.
      // redirectUri apunta al origin para que KC vuelva a la raíz de la app.
      // SalaInitializerService no debe bloquearse — resolver antes de salir.
      this._authReadyResolve();
      await this._keycloakService.login(window.location.origin + '/');
      return;
    }

    // Guardar el token Keycloak como accessToken de la app.
    // Esto ocurre ANTES de que el router Angular evalúe cualquier guard.
    this._authService.accessToken = this._keycloakService.token;
    this.isAuthenticated = true;

    // Notificar a SalaInitializerService que el token ya está disponible.
    this._authReadyResolve();
  }
}
