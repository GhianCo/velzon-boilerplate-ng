import { Injectable } from '@angular/core';

export interface SalaInfo {
  id: string;
  name: string;
  code: string;
}

export interface Rol {
  id: string;
  name: string;
  code: string;
}

export interface Turno {
  id: string;
  name: string;
  order: number;
  first: number;
  last: number;
}

export interface Caja {
  id: string;
  name: string;
}

export interface SalaData {
  sala: SalaInfo;
  gerente: string;
  supervisor: string;
  usuario: string;
  rol: Rol;
  turnos: Turno[];
  cajas: Caja[];
}

export interface SessionResponse {
  code: number;
  message: string;
  data: SalaData;
}

/**
 * Servicio singleton que almacena en memoria los datos de la sala
 * cargados durante la inicialización de la app (antes de que cargue cualquier ruta).
 *
 * Se llena desde SalaInitializerService (APP_INITIALIZER) una vez que
 * Keycloak ha autenticado al usuario y el token Bearer está disponible.
 */
@Injectable({ providedIn: 'root' })
export class SalaService {
  private _sala: SalaData | null = null;

  /** Guarda los datos de sala recibidos del backend de salas. */
  set sala(data: SalaData) {
    this._sala = data;
  }

  /** Datos completos de la sala. Null si aún no se han cargado. */
  get sala(): SalaData | null {
    return this._sala;
  }

  get salaId(): string | null {
    return this._sala?.sala.id ?? null;
  }

  get nombre(): string {
    return this._sala?.sala.name ?? '';
  }

  get gerente(): string {
    return this._sala?.gerente ?? '';
  }

  get supervisor(): string {
    return this._sala?.supervisor ?? '';
  }

  get usuario(): string {
    return this._sala?.usuario ?? '';
  }

  get rol(): Rol | null {
    return this._sala?.rol ?? null;
  }

  get turnos(): Turno[] {
    return this._sala?.turnos ?? [];
  }

  get cajas(): Caja[] {
    return this._sala?.cajas ?? [];
  }

  /** Indica si los datos de sala fueron cargados exitosamente. */
  get isLoaded(): boolean {
    return this._sala !== null;
  }

  /** Limpia los datos de sala (p.ej. al hacer logout). */
  clear(): void {
    this._sala = null;
  }
}
