import { Injectable, signal, computed, inject } from '@angular/core';
import { PersistenceService } from '@sothy/services/persistence.service';
import { HttpService } from '@sothy/services/http.service';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ControlActivosApiService } from '@sothy/services/control.activos.api.service';

export interface Caja {
  id: string | number;
  name: string;
  sala_id?: number;
  estado?: string;
  [key: string]: any;
}

export interface Turno {
  id: string | number;
  name: string;
  [key: string]: any;
}

/**
 * Servicio global para gestionar la caja y turno seleccionados en toda la aplicación
 * 
 * Este servicio:
 * - Carga las cajas disponibles de la sala actual
 * - Carga los turnos disponibles
 * - Mantiene la caja y turno seleccionados de forma global
 * - Permite seleccionar/cambiar desde cualquier parte de la app
 * - Persiste en el token JWT
 */
@Injectable({ providedIn: 'root' })
export class CajaGlobalService {
  private persistenceService = inject(PersistenceService);
  private http = inject(HttpService);
  private controlActivosApiService = inject(ControlActivosApiService);
  private REMOTE_API_URI = environment.apiRest;
  
  // Señales reactivas para cajas
  private _cajas = signal<Caja[]>([]);
  private _selectedCajaId = signal<string | number | null>(null);
  
  // Señales reactivas para turnos
  private _turnos = signal<Turno[]>([]);
  private _selectedTurnoId = signal<string | number | null>(null);
  
  // Señal reactiva para supervisor
  private _selectedSupervisor = signal<string | null>(null);
  
  // Señales de estado
  private _loading = signal<boolean>(false);
  private _error = signal<any>(null);

  // Señales computadas para cajas
  public readonly cajas = computed(() => this._cajas());
  public readonly selectedCajaId = computed(() => this._selectedCajaId());
  
  // Señales computadas para turnos
  public readonly turnos = computed(() => this._turnos());
  public readonly selectedTurnoId = computed(() => this._selectedTurnoId());
  
  // Señal computada para supervisor
  public readonly selectedSupervisor = computed(() => this._selectedSupervisor());
  
  // Supervisores disponibles (extraídos de los turnos)
  public readonly supervisoresDisponibles = computed(() => {
    const turnosData = this._turnos();
    if (!turnosData || turnosData.length === 0) {
      return [];
    }
    
    // Extraer supervisores únicos
    const supervisoresSet = new Set<string>();
    turnosData.forEach((turno: any) => {
      if (turno['supervisor'] && turno['supervisor'].trim() !== '') {
        supervisoresSet.add(turno['supervisor']);
      }
    });
    
    return Array.from(supervisoresSet).sort();
  });
  
  // Señales de estado
  public readonly loading = computed(() => this._loading());
  public readonly error = computed(() => this._error());
  
  // Caja seleccionada completa
  public readonly selectedCaja = computed(() => {
    const cajaId = this._selectedCajaId();
    if (!cajaId) return null;
    return this._cajas().find(c => c.id == cajaId) || null;
  });
  
  // Turno seleccionado completo
  public readonly selectedTurno = computed(() => {
    const turnoId = this._selectedTurnoId();
    if (!turnoId) return null;
    return this._turnos().find(t => t.id == turnoId) || null;
  });

  // Verificadores
  public readonly hasSelectedCaja = computed(() => !!this._selectedCajaId());
  public readonly hasSelectedTurno = computed(() => !!this._selectedTurnoId());
  public readonly hasSelectedSupervisor = computed(() => !!this._selectedSupervisor());

  constructor() {
    // Solo intentar recuperar datos si hay un token válido
    const hasToken = this.persistenceService.get('token');
    if (hasToken) {
      this.loadSelectedCajaFromStorage();
      this.loadSelectedTurnoFromStorage();
      this.loadSelectedSupervisorFromStorage();
    }
  }

  /**
   * Carga las cajas desde localStorage (key: cash_control_st_data)
   */
  loadCajas(_deApertura: number | string = -1): Observable<any> {
    this._loading.set(true);
    this._error.set(null);

    const cajas: Caja[] = this.persistenceService.get('core')?.cajas ?? [];
    this._cajas.set(cajas);

    const currentSelectedId = this._selectedCajaId();
    if (currentSelectedId) {
      const cajaExists = cajas.find((c: Caja) => c.id == currentSelectedId);
      if (!cajaExists) {
        this.clearSelectedCaja();
      }
    }

    this._loading.set(false);
    return of(cajas);
  }

  /**
   * Carga los turnos disponibles
   */
  loadTurnos(): Observable<any> {
    const turnos = this.persistenceService.get('core')?.turnos ?? [];
    this._turnos.set(turnos);
    this._loading.set(false);
    this._error.set(null);
    return of(turnos);
  }

  /**
   * Establece la caja seleccionada
   * @param cajaId - ID de la caja a seleccionar
   */
  async setSelectedCaja(cajaId: string | number | null): Promise<void> {
    if (cajaId === null) {
      await this.clearSelectedCaja();
      return;
    }
    
    // Verificar que la caja existe en la lista
    const caja = this._cajas().find(c => c.id == cajaId);
    if (!caja) {
      console.warn(`Caja con ID ${cajaId} no encontrada en la lista de cajas disponibles`);
      return;
    }
    
    this._selectedCajaId.set(cajaId);
  }

  /**
   * Limpia la caja seleccionada
   */
  async clearSelectedCaja(): Promise<void> {
    this._selectedCajaId.set(null);
    await this.removeSelectedCajaFromStorage();
  }

  /**
   * Establece el turno seleccionado
   * @param turnoId - ID del turno a seleccionar
   */
  async setSelectedTurno(turnoId: string | number | null): Promise<void> {
    if (turnoId === null) {
      await this.clearSelectedTurno();
      return;
    }
    
    // Verificar que el turno existe en la lista
    const turno = this._turnos().find(t => t.id == turnoId);
    if (!turno) {
      console.warn(`Turno con ID ${turnoId} no encontrado en la lista de turnos disponibles`);
      return;
    }
    
    this._selectedTurnoId.set(turnoId);
    
    // Auto-seleccionar el supervisor del turno si existe
    if (turno['supervisor']) {
      this._selectedSupervisor.set(turno['supervisor']);
    }
  }

  /**
   * Limpia el turno seleccionado
   */
  async clearSelectedTurno(): Promise<void> {
    this._selectedTurnoId.set(null);
    this._selectedSupervisor.set(null);
    await this.removeSelectedTurnoFromStorage();
    await this.removeSelectedSupervisorFromStorage();
  }

  /**
   * Limpia el supervisor seleccionado
   */
  async clearSelectedSupervisor(): Promise<void> {
    this._selectedSupervisor.set(null);
    await this.removeSelectedSupervisorFromStorage();
  }

  /**
   * Recarga las cajas y mantiene la selección si es posible
   */
  reloadCajas(deApertura: number | string = -1): Observable<any> {
    return this.loadCajas(deApertura);
  }

  /**
   * Carga el ID y nombre de la caja seleccionada desde el payload del JWT
   */
  private loadSelectedCajaFromStorage(): void {
    try {
      const savedCajaId = this.persistenceService.getTokenProperty('caja_id');
      const savedCajaNombre = this.persistenceService.getTokenProperty('caja_nombre');
      
      if (savedCajaId) {
        this._selectedCajaId.set(savedCajaId);
        
        // Si tenemos el nombre pero no está en la lista de cajas, agregarlo temporalmente
        if (savedCajaNombre && this._cajas().length === 0) {
          this._cajas.set([{
            id: savedCajaId,
            name: savedCajaNombre
          }]);
        }
      }
    } catch (error) {
      console.error('Error al cargar caja desde token:', error);
    }
  }

  /**
   * Elimina el ID y nombre de la caja seleccionada regenerando el JWT sin las propiedades
   */
  private async removeSelectedCajaFromStorage(): Promise<void> {
    try {
      await this.persistenceService.removeTokenProperties(
        ['caja_id', 'caja_nombre'], 
        environment.jwtSecret
      );
    } catch (error) {
      console.error('Error al eliminar caja del token:', error);
    }
  }
  /**
   * Carga el ID y nombre del turno seleccionado desde el payload del JWT
   */
  private loadSelectedTurnoFromStorage(): void {
    try {
      const savedTurnoId = this.persistenceService.getTokenProperty('turno_id');
      const savedTurnoNombre = this.persistenceService.getTokenProperty('turno_nombre');
      
      if (savedTurnoId) {
        this._selectedTurnoId.set(savedTurnoId);
        
        if (savedTurnoNombre && this._turnos().length === 0) {
          this._turnos.set([{
            id: savedTurnoId,
            name: savedTurnoNombre
          }]);
        }
      }
    } catch (error) {
      console.error('Error al cargar turno desde token:', error);
    }
  }

  /**
   * Elimina el ID y nombre del turno seleccionado regenerando el JWT sin las propiedades
   */
  private async removeSelectedTurnoFromStorage(): Promise<void> {
    try {
      await this.persistenceService.removeTokenProperties(
        ['turno_id', 'turno_nombre'], 
        environment.jwtSecret
      );
    } catch (error) {
      console.error('Error al eliminar turno del token:', error);
    }
  }

  /**
   * Carga el supervisor seleccionado desde el payload del JWT
   */
  private loadSelectedSupervisorFromStorage(): void {
    try {
      const savedSupervisor = this.persistenceService.getTokenProperty('supervisor');
      if (savedSupervisor) {
        this._selectedSupervisor.set(savedSupervisor);
      }
    } catch (error) {
      console.error('Error al cargar supervisor desde token:', error);
    }
  }

  /**
   * Elimina el supervisor seleccionado regenerando el JWT sin la propiedad
   */
  private async removeSelectedSupervisorFromStorage(): Promise<void> {
    try {
      await this.persistenceService.removeTokenProperties(
        ['supervisor'], 
        environment.jwtSecret
      );
    } catch (error) {
      console.error('Error al eliminar supervisor del token:', error);
    }
  }

  /**
   * Obtiene el ID de la caja seleccionada (método de conveniencia)
   */
  getSelectedCajaId(): string | number | null {
    return this._selectedCajaId();
  }

  /**
   * Obtiene la caja seleccionada completa (método de conveniencia)
   */
  getSelectedCaja(): Caja | null {
    return this.selectedCaja();
  }

  /**
   * Actualiza las señales de caja, turno y supervisor sin modificar el token
   * (útil cuando el token ya fue actualizado por el backend)
   */
  updateSelectionsFromBackend(
    cajaId: string | number,
    turnoId: string | number,
    supervisor: string
  ): void {
    this._selectedCajaId.set(cajaId);
    this._selectedTurnoId.set(turnoId);
    this._selectedSupervisor.set(supervisor);
  }

  /**
   * Limpia todo el estado del servicio (útil para logout)
   */
  clearAll(): void {
    this._cajas.set([]);
    this._selectedCajaId.set(null);
    this._turnos.set([]);
    this._selectedTurnoId.set(null);
    this._selectedSupervisor.set(null);
    this._loading.set(false);
    this._error.set(null);
  }
}
