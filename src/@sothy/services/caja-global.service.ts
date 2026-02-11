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

/**
 * Servicio global para gestionar la caja seleccionada en toda la aplicación
 * 
 * Este servicio:
 * - Carga las cajas disponibles de la sala actual
 * - Mantiene la caja seleccionada de forma global
 * - Permite seleccionar/cambiar la caja desde cualquier parte de la app
 * - Persiste la caja seleccionada en localStorage
 */
@Injectable({ providedIn: 'root' })
export class CajaGlobalService {
  private persistenceService = inject(PersistenceService);
  private http = inject(HttpService);
  private controlActivosApiService = inject(ControlActivosApiService);
  private REMOTE_API_URI = environment.apiRest;
  
  // Señales reactivas
  private _cajas = signal<Caja[]>([]);
  private _selectedCajaId = signal<string | number | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<any>(null);

  // Señales computadas
  public readonly cajas = computed(() => this._cajas());
  public readonly selectedCajaId = computed(() => this._selectedCajaId());
  public readonly loading = computed(() => this._loading());
  public readonly error = computed(() => this._error());
  
  // Caja seleccionada completa
  public readonly selectedCaja = computed(() => {
    const cajaId = this._selectedCajaId();
    if (!cajaId) return null;
    
    return this._cajas().find(c => c.caja_id == cajaId) || null;
  });

  // Verificar si hay una caja seleccionada
  public readonly hasSelectedCaja = computed(() => !!this._selectedCajaId());

  // Clave para localStorage
  private readonly STORAGE_KEY = 'selected_caja_id';

  constructor() {
    // Intentar recuperar la caja seleccionada del localStorage al iniciar
    this.loadSelectedCajaFromStorage();
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
   * Establece la caja seleccionada
   * @param cajaId - ID de la caja a seleccionar
   */
  setSelectedCaja(cajaId: string | number | null): void {
    if (cajaId === null) {
      this.clearSelectedCaja();
      return;
    }
    
    // Verificar que la caja existe en la lista
    const caja = this._cajas().find(c => c.caja_id == cajaId);
    if (!caja) {
      console.warn(`Caja con ID ${cajaId} no encontrada en la lista de cajas disponibles`);
      return;
    }
    
    this._selectedCajaId.set(cajaId);
    this.saveSelectedCajaToStorage(cajaId);
  }

  /**
   * Limpia la caja seleccionada
   */
  clearSelectedCaja(): void {
    this._selectedCajaId.set(null);
    this.removeSelectedCajaFromStorage();
  }

  /**
   * Recarga las cajas y mantiene la selección si es posible
   */
  reloadCajas(deApertura: number | string = -1): Observable<any> {
    return this.loadCajas(deApertura);
  }

  /**
   * Guarda el ID de la caja seleccionada en localStorage
   */
  private saveSelectedCajaToStorage(cajaId: string | number): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, String(cajaId));
    } catch (error) {
      console.error('Error al guardar caja en localStorage:', error);
    }
  }

  /**
   * Carga el ID de la caja seleccionada desde localStorage
   */
  private loadSelectedCajaFromStorage(): void {
    try {
      const savedCajaId = localStorage.getItem(this.STORAGE_KEY);
      if (savedCajaId) {
        this._selectedCajaId.set(savedCajaId);
      }
    } catch (error) {
      console.error('Error al cargar caja desde localStorage:', error);
    }
  }

  /**
   * Elimina el ID de la caja seleccionada del localStorage
   */
  private removeSelectedCajaFromStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error al eliminar caja de localStorage:', error);
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
}
