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
      console.log('🔍 Inicializando autenticación externa...');
      console.log('📍 URL completa:', window.location.href);
      console.log('📍 window.location.search:', window.location.search);
      console.log('📍 window.location.hash:', window.location.hash);

      // Obtener parámetros de la URL actual
      // Con hash routing, los parámetros pueden estar antes o después del hash
      let salaId: string | null = null;
      let tokenJwt: string | null = null;

      // Caso 1: Parámetros ANTES del hash - http://app.com/?sala_id=5&token_jwt=abc#/
      const urlParamsBeforeHash = new URLSearchParams(window.location.search);
      salaId = urlParamsBeforeHash.get('sala_id');
      tokenJwt = urlParamsBeforeHash.get('token_jwt');

      if (salaId && tokenJwt) {
        console.log('✅ Parámetros encontrados ANTES del hash');
      }

      // Caso 2: Parámetros DESPUÉS del hash - http://app.com/#/?sala_id=5&token_jwt=abc
      if (!salaId || !tokenJwt) {
        const hash = window.location.hash;
        if (hash && hash.includes('?')) {
          console.log('🔍 Buscando parámetros DESPUÉS del hash...');
          const queryString = hash.split('?')[1];
          const urlParamsAfterHash = new URLSearchParams(queryString);
          salaId = urlParamsAfterHash.get('sala_id');
          tokenJwt = urlParamsAfterHash.get('token_jwt');

          if (salaId && tokenJwt) {
            console.log('✅ Parámetros encontrados DESPUÉS del hash');
          }
        }
      }

      // Solo procesar si ambos parámetros están presentes
      if (!salaId || !tokenJwt) {
        console.log('ℹ️ No hay parámetros de autenticación externa');
        return;
      }

      console.log('🔑 Detectados parámetros de autenticación externa:', {
        sala_id: salaId,
        token_jwt: '***'
      });

      console.log('🔐 Iniciando autenticación con token externo...');

      // Hacer la petición de autenticación
      const response = await firstValueFrom(
        this._authLoginRemoteReq.requestAuthWithExternalToken(salaId, tokenJwt)
      );

      if (response && response.data) {
        console.log('✅ Autenticación externa exitosa');

        // Establecer el token de acceso (se guarda automáticamente en localStorage)
        this._authService.accessToken = response.data;

        console.log('✅ Sesión establecida, redirigiendo al dashboard...');

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

      // Si hay error, dejar que el usuario use el login normal
      console.log('⚠️ Autenticación externa falló, continuando con login normal');
    }
  }
}

