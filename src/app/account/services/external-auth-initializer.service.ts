import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthLoginRemoteReq } from '@app/account/data-access/auth.login.remote.req';
import { AuthService } from '@sothy/services/auth.service';
import { firstValueFrom } from 'rxjs';

/**
 * Servicio para manejar la autenticación con token externo en el app initializer
 */
@Injectable({
  providedIn: 'root'
})
export class ExternalAuthInitializerService {
  private _authLoginRemoteReq = inject(AuthLoginRemoteReq);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  /**
   * Verifica si hay parámetros de autenticación externa en la URL
   * y realiza el login automático si es necesario
   */
  async initialize(): Promise<void> {
    try {

      // Obtener parámetros de la URL actual
      // Con hash routing, los parámetros pueden estar antes o después del hash
      let salaId: string | null = null;
      let tokenJwt: string | null = null;

      // Caso 1: Parámetros ANTES del hash - http://app.com/?sala_id=5&token_jwt=abc#/
      const urlParamsBeforeHash = new URLSearchParams(window.location.search);
      salaId = urlParamsBeforeHash.get('sala_id');
      tokenJwt = urlParamsBeforeHash.get('token_jwt');

      // Caso 2: Parámetros DESPUÉS del hash - http://app.com/#/?sala_id=5&token_jwt=abc
      if (!salaId || !tokenJwt) {
        const hash = window.location.hash;
        if (hash && hash.includes('?')) {
          const queryString = hash.split('?')[1];
          const urlParamsAfterHash = new URLSearchParams(queryString);
          salaId = urlParamsAfterHash.get('sala_id');
          tokenJwt = urlParamsAfterHash.get('token_jwt');
        }
      }

      // Solo procesar si ambos parámetros están presentes
      if (!salaId || !tokenJwt) {
        return;
      }
      // Hacer la petición de autenticación
      const response = await firstValueFrom(
        this._authLoginRemoteReq.requestAuthWithExternalToken(salaId, tokenJwt)
      );

      if (response && response.data) {
        // Establecer el token de acceso (se guarda automáticamente en localStorage)
        this._authService.accessToken = response.data;

        // Limpiar los parámetros de la URL (compatible con hash routing)
        // Con hash routing, limpiamos tanto antes como después del hash
        const cleanUrl = window.location.pathname + '#/';
        window.history.replaceState({}, '', cleanUrl);

        // Redirigir al dashboard
        setTimeout(() => {
          this._router.navigate(['/signed-in-redirect']);
        }, 100);
      }
    } catch (error: any) {
      console.error('❌ Error en autenticación externa:', error);

      // Limpiar los parámetros de la URL en caso de error
      const cleanUrl = window.location.pathname + '#/';
      window.history.replaceState({}, '', cleanUrl);

    }
  }
}

