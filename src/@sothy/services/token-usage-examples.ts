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

  getAuthorizationHeaders() {
    const salaId = this.persistenceService.getSalaId();
    const userId = this.persistenceService.getUserId();

    return {
      'X-Sala-ID': salaId || '',
      'X-User-ID': userId || ''
    };
  }

  logout() {
    this.persistenceService.remove('token'); // Esto automáticamente limpia el cache
  }
}