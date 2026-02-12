import { Injectable, signal, computed, inject } from '@angular/core';
import { PersistenceService } from '@sothy/services/persistence.service';
import { HttpService } from '@sothy/services/http.service';
import { environment } from '@environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ControlActivosApiService } from '@sothy/services/control.activos.api.service';

export interface Caja {
  caja_id: string | number;
  caja_nombre: string;
  sala_id?: number;
  estado?: string;
  [key: string]: any;
}

export interface Turno {
  turno_id: string | number;
  turno_nombre: string;
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
  
  // Señales de estado
  private _loading = signal<boolean>(false);
  private _error = signal<any>(null);

  // Señales computadas para cajas
  public readonly cajas = computed(() => this._cajas());
  public readonly selectedCajaId = computed(() => this._selectedCajaId());
  
  // Señales computadas para turnos
  public readonly turnos = computed(() => this._turnos());
  public readonly selectedTurnoId = computed(() => this._selectedTurnoId());
  
  // Señales de estado
  public readonly loading = computed(() => this._loading());
  public readonly error = computed(() => this._error());
  
  // Caja seleccionada completa
  public readonly selectedCaja = computed(() => {
    const cajaId = this._selectedCajaId();
    if (!cajaId) return null;
    return this._cajas().find(c => c.caja_id == cajaId) || null;
  });
  
  // Turno seleccionado completo
  public readonly selectedTurno = computed(() => {
    const turnoId = this._selectedTurnoId();
    if (!turnoId) return null;
    return this._turnos().find(t => t.turno_id == turnoId) || null;
  });

  // Verificadores
  public readonly hasSelectedCaja = computed(() => !!this._selectedCajaId());
  public readonly hasSelectedTurno = computed(() => !!this._selectedTurnoId());

  constructor() {
    // Solo intentar recuperar datos si hay un token válido
    const hasToken = this.persistenceService.get('token');
    if (hasToken) {
      this.loadSelectedCajaFromStorage();
      this.loadSelectedTurnoFromStorage();
    }
  }

  /**
   * Carga las cajas disponibles de la sala actual
   * @param deApertura - Filtro para cajas de apertura (-1 = todas)
   */
  loadCajas(deApertura: number | string = -1): Observable<any> {
    this._loading.set(true);
    this._error.set(null);
    
    const salaId = this.persistenceService.getSalaId();
    
    return this.controlActivosApiService
      .get(`${this.REMOTE_API_URI}caja?sala=${salaId}&de_apertura=${deApertura}&operativa=1`)
      .pipe(
        tap((response: any) => {
          const cajas = response?.data || [];
          this._cajas.set(cajas);
          
          // Si había una caja seleccionada previamente, verificar que siga disponible
          const currentSelectedId = this._selectedCajaId();
          if (currentSelectedId) {
            const cajaExists = cajas.find((c: Caja) => c.caja_id == currentSelectedId);
            if (!cajaExists) {
              // La caja ya no está disponible, limpiar selección
              this.clearSelectedCaja();
            }
          }
          
          // Si solo hay una caja disponible, seleccionarla automáticamente
          if (cajas.length === 1 && !currentSelectedId) {
            this.setSelectedCaja(cajas[0].caja_id);
          }
          
          this._loading.set(false);
        }),
        catchError((error) => {
          this._error.set(error);
          this._loading.set(false);
          this._cajas.set([]);
          throw error;
        })
      );
  }

  /**
   * Carga los turnos disponibles
   */
  loadTurnos(): Observable<any> {
    this._loading.set(true);
    this._error.set(null);
    
    const salaId = this.persistenceService.getSalaId();
    
    return this.controlActivosApiService
      .get(`${this.REMOTE_API_URI}turno?sala=${salaId}`)
      .pipe(
        tap((response: any) => {
          const turnos = response?.data || [];
          this._turnos.set(turnos);
          
          // Si había un turno seleccionado previamente, verificar que siga disponible
          const currentSelectedId = this._selectedTurnoId();
          if (currentSelectedId) {
            const turnoExists = turnos.find((t: Turno) => t.turno_id == currentSelectedId);
            if (!turnoExists) {
              this.clearSelectedTurno();
            }
          }
          
          // Si solo hay un turno disponible, seleccionarlo automáticamente
          if (turnos.length === 1 && !currentSelectedId) {
            this.setSelectedTurno(turnos[0].turno_id);
          }
          
          this._loading.set(false);
        }),
        catchError((error) => {
          this._error.set(error);
          this._loading.set(false);
          this._turnos.set([]);
          throw error;
        })
      );
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
    const caja = this._cajas().find(c => c.caja_id == cajaId);
    if (!caja) {
      console.warn(`Caja con ID ${cajaId} no encontrada en la lista de cajas disponibles`);
      return;
    }
    
    this._selectedCajaId.set(cajaId);
    await this.saveSelectedCajaToStorage(cajaId);
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
    const turno = this._turnos().find(t => t.turno_id == turnoId);
    if (!turno) {
      console.warn(`Turno con ID ${turnoId} no encontrado en la lista de turnos disponibles`);
      return;
    }
    
    this._selectedTurnoId.set(turnoId);
    await this.saveSelectedTurnoToStorage(turnoId);
  }

  /**
   * Limpia el turno seleccionado
   */
  async clearSelectedTurno(): Promise<void> {
    this._selectedTurnoId.set(null);
    await this.removeSelectedTurnoFromStorage();
  }

  /**
   * Recarga las cajas y mantiene la selección si es posible
   */
  reloadCajas(deApertura: number | string = -1): Observable<any> {
    return this.loadCajas(deApertura);
  }

  /**
   * Guarda el ID y nombre de la caja seleccionada regenerando el JWT con las nuevas propiedades
   */
  private async saveSelectedCajaToStorage(cajaId: string | number): Promise<void> {
    try {
      // Obtener el nombre de la caja
      const caja = this._cajas().find(c => c.caja_id == cajaId);
      const cajaNombre = caja?.caja_nombre || '';
      
      // Usar la secret key desde environment para regenerar el JWT con ambas propiedades
      await this.persistenceService.updateTokenProperties(
        {
          caja_id: String(cajaId),
          caja_nombre: cajaNombre
        },
        environment.jwtSecret
      );
    } catch (error) {
      console.error('Error al guardar caja en token:', error);
    }
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
            caja_id: savedCajaId,
            caja_nombre: savedCajaNombre
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
   * Guarda el ID y nombre del turno seleccionado regenerando el JWT con las nuevas propiedades
   */
  private async saveSelectedTurnoToStorage(turnoId: string | number): Promise<void> {
    try {
      const turno = this._turnos().find(t => t.turno_id == turnoId);
      const turnoNombre = turno?.turno_nombre || '';
      
      await this.persistenceService.updateTokenProperties(
        {
          turno_id: String(turnoId),
          turno_nombre: turnoNombre
        },
        environment.jwtSecret
      );
    } catch (error) {
      console.error('Error al guardar turno en token:', error);
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
            turno_id: savedTurnoId,
            turno_nombre: savedTurnoNombre
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
   * Limpia todo el estado del servicio (útil para logout)
   */
  clearAll(): void {
    this._cajas.set([]);
    this._selectedCajaId.set(null);
    this._turnos.set([]);
    this._selectedTurnoId.set(null);
    this._loading.set(false);
    this._error.set(null);
  }
}
