/**
 * EJEMPLOS DE USO DEL TOKEN SERVICE
 *
 * Este archivo muestra cómo usar el PersistenceService para acceder
 * a las propiedades del token JWT desde cualquier parte de la aplicación.
 */

import { Injectable, inject } from '@angular/core';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class ExampleTokenUsage {
  private persistenceService = inject(PersistenceService);

  // EJEMPLO 1: Obtener propiedades específicas del token
  getUserData() {
    const salaId = this.persistenceService.getSalaId();
    const userId = this.persistenceService.getUserId();
    const userEmail = this.persistenceService.getUserEmail();
    const userName = this.persistenceService.getUserName();
    const userRole = this.persistenceService.getUserRole();
    const userPermissions = this.persistenceService.getUserPermissions();

    console.log('Datos del usuario:', {
      salaId,
      userId,
      userEmail,
      userName,
      userRole,
      userPermissions
    });

    return {
      salaId,
      userId,
      userEmail,
      userName,
      userRole,
      userPermissions
    };
  }

  // EJEMPLO 2: Obtener cualquier propiedad custom del token
  getCustomProperty(property: string, defaultValue: any = null) {
    return this.persistenceService.getTokenProperty(property, defaultValue);
  }

  // EJEMPLO 3: Obtener múltiples propiedades a la vez
  getMultipleProperties(properties: string[]) {
    return this.persistenceService.getTokenProperties(properties);
  }

  // EJEMPLO 4: Verificar si el token es válido antes de usar
  safeGetUserInfo() {
    if (this.persistenceService.isTokenValid()) {
      return this.persistenceService.getUserInfo();
    } else {
      console.warn('Token inválido o expirado');
      return null;
    }
  }

  // EJEMPLO 5: Uso en guards de rutas
  canAccess(requiredRole: string): boolean {
    if (!this.persistenceService.isTokenValid()) {
      return false;
    }

    const userRole = this.persistenceService.getUserRole();
    return userRole === requiredRole;
  }

  // EJEMPLO 6: Uso en interceptors HTTP
  getAuthorizationHeaders() {
    const salaId = this.persistenceService.getSalaId();
    const userId = this.persistenceService.getUserId();

    return {
      'X-Sala-ID': salaId || '',
      'X-User-ID': userId || ''
    };
  }

  // EJEMPLO 7: Limpiar cache al hacer logout
  logout() {
    this.persistenceService.remove('token'); // Esto automáticamente limpia el cache
    // O puedes limpiar manualmente:
    // this.persistenceService.clearTokenCache();
  }
}

// EJEMPLO DE USO EN COMPONENTES:

/*
export class MiComponente {
  private persistenceService = inject(PersistenceService);

  ngOnInit() {
    // Obtener sala_id
    const salaId = this.persistenceService.getSalaId();
    console.log('Sala ID:', salaId);

    // Obtener sub (user ID)
    const userId = this.persistenceService.getUserId();
    console.log('User ID:', userId);

    // Obtener propiedad custom
    const customProperty = this.persistenceService.getTokenProperty('mi_propiedad_custom');
    console.log('Propiedad custom:', customProperty);

    // Verificar si el token es válido
    if (this.persistenceService.isTokenValid()) {
      console.log('Token válido');
    } else {
      console.log('Token inválido o expirado');
    }

    // Obtener toda la info del usuario
    const userInfo = this.persistenceService.getUserInfo();
    console.log('Info completa del usuario:', userInfo);
  }
}
*/

// EJEMPLO DE USO EN SERVICIOS:

/*
@Injectable({ providedIn: 'root' })
export class MiService {
  private persistenceService = inject(PersistenceService);

  getData() {
    const salaId = this.persistenceService.getSalaId();

    if (!salaId) {
      throw new Error('No se pudo obtener el sala_id del token');
    }

    return this.http.get(`/api/sala/${salaId}/data`);
  }
}
*/

// EJEMPLO DE USO EN GUARDS:

/*
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private persistenceService = inject(PersistenceService);

  canActivate(): boolean {
    if (!this.persistenceService.isTokenValid()) {
      // Redirigir al login
      return false;
    }

    const userRole = this.persistenceService.getUserRole();
    if (userRole === 'admin' || userRole === 'user') {
      return true;
    }

    return false;
  }
}
*/
