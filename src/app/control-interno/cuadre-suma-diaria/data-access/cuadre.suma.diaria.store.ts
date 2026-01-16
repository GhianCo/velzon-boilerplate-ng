import {computed, Injectable} from "@angular/core";
import {SignalStore} from "@shared/data-access/signal.store";
import {CuadreSumaDiariaRemoteReq} from "./cuadre.suma.diaria.remote.req";
import {catchError, finalize, tap} from "rxjs/operators";
import {of} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {PARAM} from "@shared/constants/app.const";

export type IState = {
  // Datos de lista
  cuadreSumaDiariaLoading: boolean,
  cuadreSumaDiariaData: any,
  cuadreSumaDiariaPagination: any,
  cuadreSumaDiariaError: any,

  filtersToApply: any,

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
  // Lista
  cuadreSumaDiariaLoading: false,
  cuadreSumaDiariaData: null,
  cuadreSumaDiariaPagination: null,
  cuadreSumaDiariaError: null,

  filtersToApply: {
    query: PARAM.UNDEFINED,
    page: 1,
    perPage: 10,
    startDate: null,
    endDate: null,
    turno_id: PARAM.UNDEFINED,
    sala_id: PARAM.UNDEFINED,
  },

  // Cuadre
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
  public readonly vm = this.selectMany([
    'cuadreSumaDiariaLoading',
    'cuadreSumaDiariaData',
    'cuadreSumaDiariaPagination',
    'cuadreSumaDiariaError',
    'filtersToApply',
    'cuadreLoading',
    'cuadreData',
    'cuadreError',
    'saveCuadreLoading',
    'saveCuadreSuccess',
    'saveCuadreError',
  ]);

  constructor(
    private remoteReq: CuadreSumaDiariaRemoteReq,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
    super();
    this.initialize(initialState);
  }

  /**
   * Cargar lista de operaciones turno con filtros
   */
  public async loadSearch(criteria: any) {
    this.patch({cuadreSumaDiariaLoading: true, cuadreSumaDiariaError: null});
    this.remoteReq.requestSearchByCriteria(criteria).pipe(
      tap(async ({data, pagination}) => {
        this.patch({
          cuadreSumaDiariaData: data,
          cuadreSumaDiariaPagination: pagination,
          filtersToApply: criteria
        })
      }),
      finalize(async () => {
        this.patch({cuadreSumaDiariaLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          cuadreSumaDiariaError: error
        }));
      }),
    ).subscribe();
  }

  // ===== MÉTODOS PARA GESTIONAR FILTROS =====

  /**
   * Inicializa los filtros con valores por defecto (primer día del mes hasta hoy)
   */
  public initializeDefaultFilters() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startDate = this.formatDateForAPI(firstDayOfMonth, true);
    const endDate = this.formatDateForAPI(now, false);

    this.patch({
      filtersToApply: {
        ...this.vm().filtersToApply,
        startDate,
        endDate,
      }
    });
  }

  /**
   * Establece el rango de fechas desde un array de Date
   */
  public setDateRange(dates: [Date, Date]) {
    const [startDate, endDate] = dates;

    // Convertir a formato API
    const startDateStr = this.formatDateForAPI(startDate, true);
    const endDateStr = this.formatDateForAPI(endDate, false);

    this.patch({
      filtersToApply: {
        ...this.vm().filtersToApply,
        startDate: startDateStr,
        endDate: endDateStr,
      }
    });
  }

  /**
   * Actualiza los filtros parcialmente
   */
  public setFilters(filters: Partial<any>) {
    this.patch({
      filtersToApply: {
        ...this.vm().filtersToApply,
        ...filters
      }
    });
  }

  /**
   * Limpia los filtros y vuelve a los valores por defecto
   */
  public clearFilters() {
    this.initializeDefaultFilters();
    this.applyFilters();
  }

  /**
   * Aplica los filtros actuales y ejecuta la búsqueda
   */
  public applyFilters() {
    const filters = this.vm().filtersToApply;
    this.loadSearch(filters);
  }

  /**
   * Formatea una fecha para el API (YYYY-MM-DD HH:mm:ss)
   */
  private formatDateForAPI(date: Date, isStart: boolean): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const time = isStart ? '00:00:00' : '23:59:59';

    return `${year}-${month}-${day} ${time}`;
  }

  /**
   * Obtiene el rango de fechas actual como array de Date para el componente
   */
  public getDateRangeForComponent(): [Date, Date] {
    const filters = this.vm().filtersToApply;

    if (filters.startDate && filters.endDate) {
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      return [startDate, endDate];
    }

    // Si no hay fechas, retornar el rango por defecto
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return [firstDayOfMonth, now];
  }

  /**
   * Cambiar página
   */
  public changePagination(pageNumber: number) {
    this.patch({
      filtersToApply: {
        ...this.vm().filtersToApply,
        page: pageNumber
      }
    });
    this.applyFilters();
  }

  // ===== FIN MÉTODOS PARA GESTIONAR FILTROS =====

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
          this._router.navigate(['cuadre-suma-diaria'])
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

