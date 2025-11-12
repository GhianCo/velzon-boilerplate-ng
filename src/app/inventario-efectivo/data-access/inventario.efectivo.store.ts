import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SignalStore} from "@shared/data-access/signal.store";
import {InventarioEfectivoRemoteReq} from "@app/inventario-efectivo/data-access/inventario.efectivo.remote.req";
import {catchError, finalize, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {PARAM} from "@shared/constants/app.const";

export type IState = {
  inventarioEfectivoLoading: boolean,
  inventarioEfectivoData: any,
  inventarioEfectivoPagination: any,
  inventarioEfectivoError: any,

  filtersToApply: any,

  valoresWithDetailsLoading: boolean,
  valoresWithDetailsData: any,
  valoresWithDetailsError: any,

  valoresSummary: any,
  chartSummary: any,

  saveInventarioEfectivoLoading: boolean,
  saveInventarioEfectivoError: any,
}

const initialState: IState = {
  inventarioEfectivoLoading: false,
  inventarioEfectivoData: null,
  inventarioEfectivoPagination: null,
  inventarioEfectivoError: null,

  filtersToApply: {
    query: PARAM.UNDEFINED,
    page: 1,
    perPage: 10,
  },

  valoresWithDetailsLoading: false,
  valoresWithDetailsData: null,
  valoresWithDetailsError: null,

  valoresSummary: {
    diferencia: 0,
    totalLocal: 0,
    totalConvertido: 0,
    suma_diaria_efectivo: 0,
    tipocambio: 0
  },
  chartSummary: {
    series: [],
    labels: [],
    chart: {
      type: "donut",
      height: 100,
    },
    plotOptions: {
      pie: {
        offsetX: 0,
        offsetY: 0,
        donut: {
          size: "70%",
          labels: {
            show: false,
          }
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      lineCap: "round",
      width: 0
    },
  },

  saveInventarioEfectivoLoading: false,
  saveInventarioEfectivoError: null,
};

@Injectable({providedIn: 'root'})
export class InventarioEfectivoStore extends SignalStore<IState> {

  public readonly vm = this.selectMany([
    'inventarioEfectivoLoading',
    'inventarioEfectivoData',
    'inventarioEfectivoPagination',
    'inventarioEfectivoError',

    'filtersToApply',

    'valoresWithDetailsLoading',
    'valoresWithDetailsData',
    'valoresWithDetailsError',

    'valoresSummary',
    'chartSummary',

    'saveInventarioEfectivoLoading',
    'saveInventarioEfectivoError'
  ]);

  constructor(
    private _inventarioEfectivoRemoteReq: InventarioEfectivoRemoteReq,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {
    super();
    this.initialize(initialState);
  }

  public async loadSearch(criteria: any) {
    this.patch({inventarioEfectivoLoading: true, inventarioEfectivoError: null});
    this._inventarioEfectivoRemoteReq.requestSearchByCriteria(criteria).pipe(
      tap(async ({data, pagination}) => {
        this.patch({
          inventarioEfectivoData: data,
          inventarioEfectivoPagination: pagination,
        })
      }),
      finalize(async () => {
        this.patch({inventarioEfectivoLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          inventarioEfectivoError: error
        }));
      }),
    ).subscribe();
  };

  public async loadValoresWithDetails() {
    this.patch({valoresWithDetailsLoading: true, valoresWithDetailsError: null});
    this._inventarioEfectivoRemoteReq.requestGetValoresWithDetails().pipe(
      tap(async ({data, pagination}) => {
        this.patch({
          valoresWithDetailsData: data,
        })
      }),
      finalize(async () => {
        this.patch({valoresWithDetailsLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          valoresWithDetailsError: error
        }));
      }),
    ).subscribe();
  };

  public async saveInventarioEfectivoWithDetils() {
    this.patch({saveInventarioEfectivoLoading: true, saveInventarioEfectivoError: null});
    const state = this.vm();
    const inventario = {
      total: state.valoresSummary.totalConvertido,
      diferencia: state.valoresSummary.diferencia,
      suma_diaria: state.valoresSummary.suma_diaria_efectivo,
      tipocambio: state.valoresSummary.tipocambio,
      detalle: state.valoresWithDetailsData
    };
    this._inventarioEfectivoRemoteReq.requestSaveInventario(inventario).pipe(
      tap(async ({data, pagination}) => {
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });
      }),
      finalize(async () => {
        this.patch({saveInventarioEfectivoLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          saveInventarioEfectivoError: error
        }));
      }),
    ).subscribe();
  };

  public get filtersToApply() {
    const state = this.vm();
    return state.filtersToApply
  };

  public loadAllInvetarioEfectivoStore(): Observable<any> {
    this.loadSearch(this.filtersToApply);
    return of(true);
  };

  public incrementDenominacionEfectivo(denominacion: any) {
    const cantidadActual = denominacion.cantidad || 0;
    this.updateDenominacionCantidad(denominacion, cantidadActual + 1);
  }

  public decrementDenominacionEfectivo(denominacion: any) {
    const cantidadActual = denominacion.cantidad || 0;
    this.updateDenominacionCantidad(denominacion, cantidadActual + -1);
  }

  public onCantidadChange(denominacion: any, nuevaCantidad: any) {
    this.updateDenominacionCantidad(denominacion, nuevaCantidad);
  }

  private updateDenominacionCantidad(denominacion: any, nuevaCantidad: number) {
    const state = this.vm();

    const valores = state.valoresWithDetailsData?.map((valor: any) => {
      const tipoCambio = valor.current_tc || 1;

      const nuevasDenominaciones = valor.denominaciones.map((d: any) => {
        if (d === denominacion) {
          const cantidad = Math.max(nuevaCantidad, 0);
          const importeLocal = (d.valor || 0) * cantidad;
          const importeConvertido = importeLocal * tipoCambio;

          return {
            ...d,
            cantidad,
            importeLocal,
            importeConvertido,
          };
        }
        return d;
      });

      const acumuladoLocal = nuevasDenominaciones.reduce(
        (t: number, d: any) => t + (d.importeLocal || 0),
        0
      );
      const acumuladoConvertido = nuevasDenominaciones.reduce(
        (t: number, d: any) => t + (d.importeConvertido || 0),
        0
      );

      return {
        ...valor,
        denominaciones: nuevasDenominaciones,
        acumuladoLocal,
        acumuladoConvertido,
      };
    });

    // --- Calcular el resumen global ---
    const totalLocal = valores?.reduce(
      (sum: number, v: any) => sum + (v.acumuladoLocal || 0),
      0
    ) ?? 0;

    const totalConvertido = valores?.reduce(
      (sum: number, v: any) => sum + (v.acumuladoConvertido || 0),
      0
    ) ?? 0;
    // Calcular el porcentaje global basado en totalConvertido
    const valoresConPorcentaje = valores?.map((valor: any) => {
      const porcentaje =
        totalConvertido > 0
          ? ((valor.acumuladoConvertido || 0) / totalConvertido) * 100
          : 0;

      return {...valor, porcentaje};
    });

    const valoresSummary = {
      ...state.valoresSummary,
      totalLocal,
      totalConvertido,
      suma_diaria_efectivo: totalConvertido + state.valoresSummary.diferencia
    };

    const chartSummary = {
      ...state.chartSummary,
      series: valores.map((v: any) => v.acumuladoConvertido || 0),
      labels: valores.map((v: any) => v.name || 'Sin nombre'),
    };

    this.patch({valoresWithDetailsData: valoresConPorcentaje, valoresSummary, chartSummary});
  }

  public onDiferenciaChange(diff: any) {
    const state = this.vm();
    const valoresSummary = {
      ...state.valoresSummary,
      suma_diaria_efectivo: state.valoresSummary.totalConvertido + diff
    };
    this.patch({valoresSummary});
  }

  public changePagination(pageNumber: number) {
    const filtersToApply = this.vm().filtersToApply;
    filtersToApply.page = pageNumber;
    this.loadAllInvetarioEfectivoStore();
    this.patch({filtersToApply});
  };

}
