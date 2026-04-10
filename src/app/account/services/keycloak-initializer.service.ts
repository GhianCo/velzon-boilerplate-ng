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
    // Tokens provenientes del redirect PHP (ROPC server-side)
    const params = new URLSearchParams(window.location.search);
    const externalToken = params.get('access_token');

    if (externalToken) {
      // Limpiar la URL antes de que el router lea el hash
      window.history.replaceState(
        {},
        '',
        window.location.origin + window.location.pathname + window.location.hash
      );

      this._authService.accessToken = externalToken;
      this.isAuthenticated = true;
      this._authReadyResolve(); // desbloquea SalaInitializerService
      return;                   // ← no llama a keycloak.init(), no hay redirect
    }

    // F5 / reload: si ya hay token en storage (proveniente de sesión externa previa),
    // reutilizarlo sin pasar por KC para evitar redirect a la pantalla de login.
    if (this._authService.accessToken) {
      this.isAuthenticated = true;
      this._authReadyResolve();
      return;
    }

    // Flujo KC normal (acceso directo sin token externo)
    const authenticated = await this._keycloakService.init();

    if (!authenticated || !this._keycloakService.token) {
      this._authReadyResolve();
      await this._keycloakService.login(window.location.origin + '/');
      return;
    }

    this._authService.accessToken = this._keycloakService.token;
    this.isAuthenticated = true;
    this._authReadyResolve();
  }
}
