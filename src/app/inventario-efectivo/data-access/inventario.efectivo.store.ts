import {Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SignalStore} from "@shared/data-access/signal.store";
import {InventarioEfectivoRemoteReq} from "@app/inventario-efectivo/data-access/inventario.efectivo.remote.req";
import {catchError, finalize, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {PARAM} from "@shared/constants/app.const";
import {PersistenceService} from "@sothy/services/persistence.service";

export type IState = {
  inventarioEfectivoLoading: boolean,
  inventarioEfectivoData: any,
  inventarioEfectivoPagination: any,
  inventarioEfectivoError: any,

  filtersToApply: any,

  valoresWithDetailsLoading: boolean,
  valoresWithDetailsData: any,
  valoresWithDetailsError: any,

  catMovWithDetailsLoading: boolean,
  catMovWithDetailsData: any,
  catMovWithDetailsError: any,

  valoresSummary: any,
  chartSummary: any,

  saveInventarioEfectivoLoading: boolean,
  saveInventarioEfectivoError: any,

  cajasLoading: boolean,
  cajasData: any,
  cajasError: any,

  turnosLoading: boolean,
  turnosData: any,
  turnosError: any,

  // Campos para turno y tipo de operación seleccionados
  selectedTurnoId: string | null,
  selectedOperacion: string | null,
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

  catMovWithDetailsLoading: false,
  catMovWithDetailsData: null,
  catMovWithDetailsError: null,

  cajasLoading: false,
  cajasData: null,
  cajasError: null,

  turnosLoading: false,
  turnosData: [],
  turnosError: null,

  // Inicializar campos de turno y operación
  selectedTurnoId: null,
  selectedOperacion: null,

  valoresSummary: {
    diferencia: 0,
    totalLocal: 0,
    totalConvertido: 0,
    totalMovimientos: 0,
    total_real_turno: 0,
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

    'catMovWithDetailsLoading',
    'catMovWithDetailsData',
    'catMovWithDetailsError',

    'cajasLoading',
    'cajasData',
    'cajasError',
    'turnosLoading',
    'turnosData',
    'turnosError',

    'valoresSummary',
    'chartSummary',

    'saveInventarioEfectivoLoading',
    'saveInventarioEfectivoError',

    'selectedTurnoId',
    'selectedOperacion'
  ]);

  constructor(
    private _inventarioEfectivoRemoteReq: InventarioEfectivoRemoteReq,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _persistenceService: PersistenceService,
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

  public async loadOperacionTurnoWithDetails(operacionturno_id: any) {
    this._inventarioEfectivoRemoteReq.requestOperacionTurnoWithDetails(operacionturno_id).pipe(
      tap(async ({data}) => {
        // Transformar inventario_efectivo_detalle
        const valoresTransformados = data.inventario_efectivo_detalle?.map((valor: any) => {
          let acumuladoLocal = 0;
          let acumuladoConvertido = 0;

          const denominacionesTransformadas = valor.denominaciones?.map((denom: any) => {
            // Convertir array de cajas a objeto { "Boveda": 9689, "Caja 01": 0, ... }
            const cajasObj: any = {};

            denom.cajas?.forEach((caja: any) => {
              cajasObj[caja.caja_nombre] = caja.cantidad || 0;
            });

            // Calcular totales desde los datos del backend
            const importeLocal = denom.cajas?.reduce((sum: number, c: any) => sum + (c.importeLocal || 0), 0) || 0;
            const importeConvertido = denom.cajas?.reduce((sum: number, c: any) => sum + (c.importeConvertido || 0), 0) || 0;
            const cantidadTotal = denom.cajas?.reduce((sum: number, c: any) => sum + (c.cantidad || 0), 0) || 0;

            // Calcular el valor unitario real desde los datos del backend
            // Si hay cantidad, dividir importeLocal / cantidadTotal para obtener el valor unitario real
            let valorUnitario = denom.valor || 1;
            if (cantidadTotal > 0 && importeLocal > 0) {
              valorUnitario = importeLocal / cantidadTotal;
            }

            acumuladoLocal += importeLocal;
            acumuladoConvertido += importeConvertido;

            return {
              id: denom.denominacion_id,
              denominacion_id: denom.denominacion_id,
              descripcion: denom.descripcion,
              valor: valorUnitario,  // Usar el valor unitario real calculado
              cajas: cajasObj,
              cantidad: cantidadTotal,
              cantidadTotal,
              importeLocal,
              importeConvertido
            };
          });

          return {
            id: valor.valor_id,
            valor_id: valor.valor_id,
            name: valor.name,
            denominaciones: denominacionesTransformadas,
            acumuladoLocal,
            acumuladoConvertido,
            current_tc: parseFloat(valor.current_tc) || 1
          };
        });

        // Calcular totales y porcentajes
        const totalConvertido = valoresTransformados?.reduce((sum: number, v: any) => sum + (v.acumuladoConvertido || 0), 0) || 0;

        const valoresConPorcentaje = valoresTransformados?.map((valor: any) => {
          const porcentaje = totalConvertido > 0 ? ((valor.acumuladoConvertido || 0) / totalConvertido) * 100 : 0;
          return { ...valor, porcentaje };
        });

        // Summary
        const valoresSummary = {
          diferencia: 0,
          totalLocal: totalConvertido,
          totalConvertido,
          totalMovimientos: 0,
          total_real_turno: totalConvertido,
          suma_diaria_efectivo: totalConvertido,
          tipocambio: data.tipocambio || 0
        };

        // Chart
        const valoresConDatos = valoresConPorcentaje?.filter((v: any) => v.acumuladoConvertido > 0) || [];
        const chartSummary = {
          series: valoresConDatos.map((v: any) => v.acumuladoConvertido),
          labels: valoresConDatos.map((v: any) => v.name || 'Sin nombre'),
          chart: { type: "donut", height: 100 },
          plotOptions: {
            pie: {
              offsetX: 0,
              offsetY: 0,
              donut: { size: "70%", labels: { show: false } }
            }
          },
          dataLabels: { enabled: false },
          legend: { show: false },
          stroke: { lineCap: "round", width: 0 }
        };

        // Mezclar suma_diaria_detalle
        const currentCatMov = this.vm().catMovWithDetailsData || [];
        const sumaDiariaDelBackend = data.suma_diaria_detalle || [];

        const catMovActualizado = currentCatMov.map((catMov: any) => {
          const dataBackend = sumaDiariaDelBackend.find(
            (item: any) => item.sumdiamovimiento_id === catMov.id || item.sumdiamovimiento_id === catMov.sumdiamovimiento_id
          );

          if (dataBackend && dataBackend.details && catMov.details) {
            const detailsActualizados = catMov.details.map((detail: any, index: number) => {
              const detailBackend = dataBackend.details[index];
              return {
                ...detail,
                cantidad: detailBackend?.cantidad || 0
              };
            });

            const acumuladoLocal = detailsActualizados.reduce((sum: number, d: any) => sum + (d.cantidad || 0), 0);

            return {
              ...catMov,
              details: detailsActualizados,
              acumuladoLocal,
              acumuladoConvertido: acumuladoLocal
            };
          }

          return catMov;
        });

        this.patch({
          valoresWithDetailsData: valoresConPorcentaje,
          valoresSummary,
          chartSummary,
          catMovWithDetailsData: catMovActualizado
        });
      }),
      finalize(async () => {
      }),
      catchError((error) => {
        return of(this.patch({}));
      }),
    ).subscribe();
  };

  public async loadCajas() {
    this.patch({cajasLoading: true, cajasError: null});
    this._inventarioEfectivoRemoteReq.requestAllCajasBySala(this._persistenceService.getSalaId()).pipe(
      tap(async ({data, pagination}) => {
        this.patch({
          cajasData: data,
        })
      }),
      finalize(async () => {
        this.patch({cajasLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          cajasLoading: false,
          cajasError: error
        }));
      }),
    ).subscribe();
  };

  public async loadValoresWithDetails() {
    this.patch({valoresWithDetailsLoading: true, valoresWithDetailsError: null});
    this.initialize(initialState);
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

  public async loadCatMovWithDetails() {
    this.patch({catMovWithDetailsLoading: true, catMovWithDetailsError: null});
    this.initialize(initialState);
    this._inventarioEfectivoRemoteReq.requestGetCatMovWithDetails().pipe(
      tap(async ({data, pagination}) => {
        this.patch({
          catMovWithDetailsData: data,
        })
      }),
      finalize(async () => {
        this.patch({catMovWithDetailsLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          catMovWithDetailsError: error
        }));
      }),
    ).subscribe();
  };

  public async saveInventarioEfectivoWithDetils(turnoId?: string, operacionTurnoId?: string | null) {
    this.patch({saveInventarioEfectivoLoading: true, saveInventarioEfectivoError: null});
    const state = this.vm();

    // Transformar inventario_efectivo_detalle con array de cajas por denominación
    const inventarioDetallePorDenominacion: any[] = [];

    state.valoresWithDetailsData?.forEach((valorDetail: any) => {
      valorDetail.denominaciones?.forEach((denominacion: any) => {
        // Construir array de cajas para esta denominación
        const cajas: any[] = [];

        if (denominacion.cajas) {
          // Obtener todas las cajas del sistema
          state.cajasData?.forEach((cajaInfo: any) => {
            const cajaNombre = cajaInfo.caja_nombre;
            const cantidadCaja = denominacion.cajas[cajaNombre] || 0;

            // Agregar TODAS las cajas, incluso con cantidad 0
            cajas.push({
              caja_id: cajaInfo.caja_id,
              caja_nombre: cajaNombre,
              cantidad: cantidadCaja
            });
          });
        }

        // Agregar la denominación con su array de cajas
        inventarioDetallePorDenominacion.push({
          valor_id: valorDetail.id || valorDetail.valor_id,
          denominacion_id: denominacion.id || denominacion.denominacion_id,
          denominacion_descripcion: denominacion.descripcion,
          denominacion_valor: denominacion.valor,
          tipo_cambio: valorDetail.current_tc || 1,
          cajas: cajas
        });
      });
    });

    // Construir el payload con turno y tipo de operación
    const inventario = {
      turno_id: turnoId || state.selectedTurnoId,
      operacionturno_id: operacionTurnoId || null,
      tipo_operacion: state.selectedOperacion,
      total: state.valoresSummary.totalConvertido,
      diferencia: state.valoresSummary.diferencia,
      suma_diaria: state.valoresSummary.suma_diaria_efectivo,
      tipocambio: state.valoresSummary.tipocambio,
      inventario_efectivo_detalle: inventarioDetallePorDenominacion,
      suma_diaria_detalle: state.catMovWithDetailsData
    };

    this._inventarioEfectivoRemoteReq.requestSaveInventario(inventario).pipe(
      tap(async ({data, pagination}) => {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
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

  public actualizarTurnos(turnos: any[]) {
    this.patch({turnosData: turnos});
  }

  public async loadTurnos() {
    this.patch({turnosLoading: true});

    this._inventarioEfectivoRemoteReq.requestGetTurnos(this._persistenceService.getSalaId()).pipe(
      tap(async ({data}) => {
        this.patch({
          turnosData: data,
        });
      }),
      finalize(() => {
        this.patch({turnosLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          turnosLoading: false,
          turnosError: error
        }));
      })
    ).subscribe();
  }

  public changePagination(pageNumber: number) {
    const filtersToApply = this.vm().filtersToApply;
    filtersToApply.page = pageNumber;
    this.loadAllInvetarioEfectivoStore();
    this.patch({filtersToApply});
  };

  // Métodos para actualizar turno y tipo de operación
  public setSelectedTurnoId(turnoId: string | null) {
    this.patch({selectedTurnoId: turnoId});
  }

  public setSelectedOperacion(operacion: string | null) {
    this.patch({selectedOperacion: operacion});
  }

}
