import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '@environments/environment';

/**
 * Servicio que envuelve el adaptador keycloak-js.
 *
 * Flujo con login-required:
 *  1. App carga → keycloak.init({ onLoad: 'login-required' })
 *  2. Sin sesión activa → redirect automático a Keycloak (10.45.1.80)
 *  3. Usuario se autentica → Keycloak redirige de vuelta a localhost:4200/?code=...
 *  4. keycloak.init() procesa el code, obtiene el token y devuelve true
 *  5. KeycloakInitializerService guarda el token y navega a /inventario-efectivo
 */
@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private _keycloak: Keycloak;

  constructor() {
    this._keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
    });
  }

  /**
   * Inicializa el adaptador con check-sso (iframe silencioso).
   * Si ya hay sesión SSO activa, KC la valida en un iframe oculto sin mover
   * el browser → el hash de Angular se preserva (F5 funciona correctamente).
   * Si no hay sesión, init() devuelve false y se llama a login() manualmente.
   */
  async init(): Promise<boolean> {
    try {
      return await this._keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        responseMode: 'query',
      });
    } catch (error) {
      console.error('[Keycloak] Error al inicializar el adaptador:', error);
      return false;
    }
  }

  /** Redirige al servidor Keycloak para iniciar sesión (uso manual si se necesita) */
  login(redirectUri?: string): Promise<void> {
    return this._keycloak.login({ redirectUri: redirectUri ?? window.location.origin + '/' });
  }

  /** Cierra la sesión en Keycloak */
  logout(redirectUri?: string): Promise<void> {
    return this._keycloak.logout({ redirectUri: redirectUri ?? window.location.origin + '/' });
  }

  /** Devuelve el token de acceso actual (string bruto, base64) */
  get token(): string | undefined {
    return this._keycloak.token;
  }

  /** Devuelve true si hay una sesión Keycloak activa */
  get authenticated(): boolean {
    return this._keycloak.authenticated ?? false;
  }

  /**
   * Refresca el token si expira antes de minValidity segundos.
   * Devuelve true si fue refrescado.
   */
  async updateToken(minValidity = 30): Promise<boolean> {
    try {
      return await this._keycloak.updateToken(minValidity);
    } catch {
      return false;
    }
  }
}
