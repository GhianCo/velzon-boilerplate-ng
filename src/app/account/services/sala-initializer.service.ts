import { inject, Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@sothy/services/auth.service';
import { SessionResponse, SalaService } from '@sothy/services/sala.service';
import { PersistenceService } from '@sothy/services/persistence.service';
import { KeycloakInitializerService } from '@app/account/services/keycloak-initializer.service';
import { environment } from '@environments/environment';

/**
 * Inicializador que corre en APP_INITIALIZER, DESPUÉS de que KC ha guardado el token.
 *
 * Espera a que `KeycloakInitializerService.authReady` resuelva (token Bearer listo)
 * y luego llama al backend de salas para obtener:
 *   - sala_id, nombre
 *   - gerente, gerente_id
 *   - supervisores []
 *
 * Los datos quedan disponibles en `SalaService` para cualquier store o servicio de la app.
 */
@Injectable({ providedIn: 'root' })
export class SalaInitializerService {
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _salaService = inject(SalaService);
  private _persistenceService = inject(PersistenceService);
  private _keycloakInitializer = inject(KeycloakInitializerService);

  async initialize(): Promise<void> {
    // Esperar a que KC haya guardado el token en AuthService.
    await this._keycloakInitializer.authReady;

    // Si el usuario no autenticó con KC no hay nada que cargar.
    if (!this._keycloakInitializer.isAuthenticated) {
      return;
    }

    const token = this._authService.accessToken;
    if (!token) return;

    try {
      const response = await firstValueFrom(
        this._http.get<SessionResponse>(`${environment.apiMasarisCore}/api/auth/session`, {
          headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
        })
      );
      const sessionData = response.data;
      this._persistenceService.set('data', sessionData);
      this._salaService.sala = sessionData;
    } catch (error) {
      if (isDevMode()) {
        console.warn('[SalaInitializerService] No se pudo cargar la sala:', error);
      }
      // La app continúa cargando; los guards o componentes deben manejar
      // el caso en que salaService.isLoaded === false.
    }
  }
}
