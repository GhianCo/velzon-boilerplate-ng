import {computed, Injectable} from "@angular/core";
import {SignalStore} from "@shared/data-access/signal.store";
import {CuadreSumaDiariaRemoteReq} from "./cuadre.suma.diaria.remote.req";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";

export type IState = {
  // Datos de cuadre
  cuadreLoading: boolean,
  cuadreData: any,
  cuadreError: any,

  // Guardado
  saveCuadreLoading: boolean,
  saveCuadreError: any,
}

const initialState: IState = {
  cuadreLoading: false,
  cuadreData: null,
  cuadreError: null,

  saveCuadreLoading: false,
  saveCuadreError: null,
}

@Injectable({
  providedIn: 'root'
})
export class CuadreSumaDiariaStore extends SignalStore<IState> {

  // Computed signals
  vm = computed(() => ({
    cuadreLoading: this.state().cuadreLoading,
    cuadreData: this.state().cuadreData,
    cuadreError: this.state().cuadreError,
    saveCuadreLoading: this.state().saveCuadreLoading,
    saveCuadreError: this.state().saveCuadreError,
  }));

  constructor(
    private remoteReq: CuadreSumaDiariaRemoteReq
  ) {
    super();
    this.initialize(initialState);
  }

  /**
   * Cargar categorías con registros por rango de fechas
   */
  loadCategoriasConRegistros(startDate: string, endDate: string): void {
    console.log('🏪 Store: Cargando categorías con registros', { startDate, endDate });

    this.patch({
      cuadreLoading: true,
      cuadreError: null
    });

    this.remoteReq.requestCategoriasConRegistros(startDate, endDate)
      .pipe(
        tap((response: any) => {
          console.log('✅ Store: Datos recibidos del backend:', response);
          this.patch({
            cuadreData: response.data,
            cuadreLoading: false
          });
        }),
        catchError((error) => {
          console.error('❌ Store: Error al cargar datos:', error);
          this.patch({
            cuadreError: error,
            cuadreLoading: false,
            cuadreData: null
          });
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Guardar cuadre
   */
  guardarCuadre(data: any): void {
    console.log('🏪 Store: Guardando cuadre', data);

    this.patch({
      saveCuadreLoading: true,
      saveCuadreError: null
    });

    this.remoteReq.requestGuardarCuadre(data)
      .pipe(
        tap((response: any) => {
          console.log('✅ Store: Cuadre guardado exitosamente:', response);
          this.patch({
            saveCuadreLoading: false
          });
        }),
        catchError((error) => {
          console.error('❌ Store: Error al guardar cuadre:', error);
          this.patch({
            saveCuadreError: error,
            saveCuadreLoading: false
          });
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Limpiar datos de cuadre
   */
  clearCuadreData(): void {
    this.patch({
      cuadreData: null,
      cuadreError: null
    });
  }

  /**
   * Reset del store
   */
  reset(): void {
    this.patch(initialState);
  }
}

