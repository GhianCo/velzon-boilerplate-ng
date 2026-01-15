import {computed, Injectable} from "@angular/core";
import {SignalStore} from "@shared/data-access/signal.store";
import {CuadreSumaDiariaRemoteReq} from "./cuadre.suma.diaria.remote.req";
import {catchError, tap} from "rxjs/operators";
import {of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

export type IState = {
  // Datos de cuadre
  cuadreLoading: boolean,
  cuadreData: any,
  cuadreError: any,

  // Guardado
  saveCuadreLoading: boolean,
  saveCuadreSuccess: boolean,
  saveCuadreError: any,
}

const initialState: IState = {
  cuadreLoading: false,
  cuadreData: null,
  cuadreError: null,

  saveCuadreLoading: false,
  saveCuadreSuccess: false,
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
    saveCuadreSuccess: this.state().saveCuadreSuccess,
    saveCuadreError: this.state().saveCuadreError,
  }));

  constructor(
    private remoteReq: CuadreSumaDiariaRemoteReq,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
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
          this.patch({
            cuadreData: response.data,
            cuadreLoading: false
          });
        }),
        catchError((error) => {
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
    this.patch({
      saveCuadreLoading: true,
      saveCuadreSuccess: false,
      saveCuadreError: null
    });

    this.remoteReq.requestGuardarCuadre(data)
      .pipe(
        tap((response: any) => {
          this._router.navigate(['./'], {relativeTo: this._activatedRoute})
          this.patch({
            saveCuadreLoading: false,
            saveCuadreSuccess: true
          });
        }),
        catchError((error) => {
          this.patch({
            saveCuadreError: error,
            saveCuadreLoading: false,
            saveCuadreSuccess: false
          });
          return of(null);
        })
      )
      .subscribe();
  }

  /**
   * Resetear estado de guardado
   */
  resetSaveState(): void {
    this.patch({
      saveCuadreLoading: false,
      saveCuadreSuccess: false,
      saveCuadreError: null
    });
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

