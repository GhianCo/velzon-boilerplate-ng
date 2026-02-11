import {computed, Injectable} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {SignalStore} from "@shared/data-access/signal.store";
import {InventarioCajaRemoteReq} from "@app/inventario-caja/data-access/inventario.caja.remote.req";
import {catchError, finalize, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {ORDEN, PARAM} from "@shared/constants/app.const";
import {PersistenceService} from "@sothy/services/persistence.service";

export type IState = {
  inventarioCajaLoading: boolean,
  inventarioCajaData: any,
  inventarioCajaPagination: any,
  inventarioCajaError: any,

  filtersToApply: any,

  valoresWithDetailsLoading: boolean,
  valoresWithDetailsData: any,
  valoresWithDetailsError: any,

  catMovWithDetailsLoading: boolean,
  catMovWithDetailsData: any,
  catMovWithDetailsError: any,

  valoresSummary: any,
  chartSummary: any,

  saveInventarioCajaLoading: boolean,
  saveInventarioCajaError: any,

  cajasLoading: boolean,
  cajasData: any,
  cajasError: any,

  turnosLoading: boolean,
  turnosData: any,
  turnosError: any,

  // Último registro de operación caja (para determinar si se puede aperturar)
  lastOperacionCajaLoading: boolean,
  lastOperacionCaja: any,
  lastOperacionCajaError: any,

  // Campos para caja y tipo de operación seleccionados
  selectedCajaId: string | null,
  selectedOperacion: string | null,

  // Datos de la caja cargada (para modo cierre)
  cajaDataLoading: boolean,
  cajaData: any,
  cajaDataError: any,

  // Campos para el resumen de operación caja (visualizar)
  resumenOperacionLoading: boolean,
  resumenOperacionData: any,
  resumenOperacionError: any,
}

const initialState: IState = {
  inventarioCajaLoading: false,
  inventarioCajaData: null,
  inventarioCajaPagination: null,
  inventarioCajaError: null,

  filtersToApply: {
    query: PARAM.UNDEFINED,
    page: 1,
    perPage: 10,
    startDate: null,
    endDate: null,
    caja_id: PARAM.UNDEFINED,
    sala_id: PARAM.UNDEFINED,
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

  // Inicializar última operación de caja
  lastOperacionCajaLoading: false,
  lastOperacionCaja: null,
  lastOperacionCajaError: null,

  // Inicializar campos de caja y operación
  selectedCajaId: null,
  selectedOperacion: null,

  // Inicializar datos de la caja
  cajaDataLoading: false,
  cajaData: null,
  cajaDataError: null,

  // Inicializar campos de resumen
  resumenOperacionLoading: false,
  resumenOperacionData: null,
  resumenOperacionError: null,

  valoresSummary: {
    diferencia: 0,
    totalLocal: 0,
    totalConvertido: 0,
    totalMovimientos: 0,
    total_real_caja: 0,
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

  saveInventarioCajaLoading: false,
  saveInventarioCajaError: null,
};

@Injectable({providedIn: 'root'})
export class InventarioCajaStore extends SignalStore<IState> {

  public readonly vm = this.selectMany([
    'inventarioCajaLoading',
    'inventarioCajaData',
    'inventarioCajaPagination',
    'inventarioCajaError',

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

    'lastOperacionCajaLoading',
    'lastOperacionCaja',
    'lastOperacionCajaError',

    'valoresSummary',
    'chartSummary',

    'saveInventarioCajaLoading',
    'saveInventarioCajaError',

    'selectedCajaId',
    'selectedOperacion',

    // Datos de la caja cargada
    'cajaDataLoading',
    'cajaData',
    'cajaDataError',

    // Propiedades para visualizar resumen
    'resumenOperacionLoading',
    'resumenOperacionData',
    'resumenOperacionError'
  ]);

  /**
   * Computed signal que devuelve las cajas disponibles para aperturar
   * basándose en la última operación de caja obtenida desde el backend.
   */
  public readonly cajasDisponibles = computed(() => {
    const state = this.vm();
    const lastOperacionCaja = state.lastOperacionCaja;
    const cajasData = state.cajasData;

    // Si no hay cajas, retornar array vacío
    if (!cajasData || cajasData.length === 0) {
      return [];
    }

    // Si no hay última operación registrada, mostrar todas las cajas
    if (!lastOperacionCaja) {
      return cajasData;
    }

    // Si la última operación está abierta, solo retornar esa caja
    // (No se puede aperturar otra mientras una esté abierta)
    if (lastOperacionCaja.abierta === 1 || lastOperacionCaja.abierta === '1') {
      const cajaAbierta = cajasData.find(
        (c: any) => c.caja_id === lastOperacionCaja.caja_id
      );
      return cajaAbierta ? [cajaAbierta] : [];
    }

    // Si la última operación está cerrada, mostrar todas las cajas disponibles
    return cajasData;
  });

  constructor(
    private _inventarioCajaRemoteReq: InventarioCajaRemoteReq,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _persistenceService: PersistenceService,
  ) {
    super();
    this.initialize(initialState);
  }

  public async loadSearch(criteria: any) {
    this.patch({inventarioCajaLoading: true, inventarioCajaError: null});
    this._inventarioCajaRemoteReq.requestSearchByCriteria(criteria).pipe(
      tap(async ({data, pagination}) => {
        this.patch({
          inventarioCajaData: data,
          inventarioCajaPagination: pagination,
          filtersToApply: criteria // Guardar los filtros aplicados
        })
      }),
      finalize(async () => {
        this.patch({inventarioCajaLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          inventarioCajaError: error
        }));
      }),
    ).subscribe();
  };

  // Método público para buscar desde el componente
  public searchByCriteria(criteria: any) {
    this.loadSearch(criteria);
  }

  public async loadOperacionCajaWithDetails(operacioncaja_id: any) {
    this._inventarioCajaRemoteReq.requestOperacionCajaWithDetails(operacioncaja_id).pipe(
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
              valor: valorUnitario,
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
            codigo: valor.codigo,
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
          total_real_caja: totalConvertido,
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

  // Método para cargar datos de una operación caja por ID
  public loadOperacionCajaById(operacioncaja_id: number): void {
    this.patch({cajaDataLoading: true, cajaDataError: null});

    this._inventarioCajaRemoteReq.requestGetOperacionCajaById(operacioncaja_id).pipe(
      tap(({data}) => {
        // Mapear la respuesta del backend a cajaData
        const cajaData = {
          caja_id: data.caja_id,
          caja_nombre: data.caja || 'Caja',
          fecha_apertura: data.apertura || '',
          monto_inicial: data.totalinventario || 0,
          usuario_apertura: data.gerente || ''
        };

        this.patch({
          cajaData,
          selectedOperacion: 'cierre'
        });
        this.setSelectedCajaId(data.caja_id);
      }),
      finalize(() => {
        this.patch({cajaDataLoading: false});
      }),
      catchError((error) => {
        this.patch({
          cajaDataError: error,
          cajaData: null
        });
        return of(null);
      })
    ).subscribe();
  }

  public async loadCajas(de_apertura = PARAM.UNDEFINED) {
    this.patch({cajasLoading: true, cajasError: null});
    this._inventarioCajaRemoteReq.requestAllCajasBySala(this._persistenceService.getSalaId(), de_apertura).pipe(
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
    this._inventarioCajaRemoteReq.requestGetValoresWithDetails().pipe(
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
    this._inventarioCajaRemoteReq.requestGetCatMovWithDetails().pipe(
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

  public async saveInventarioCajaWithDetails(cajaId?: string, operacionCajaId?: string | null) {
    this.patch({saveInventarioCajaLoading: true, saveInventarioCajaError: null});
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

    const caja = state.cajasData.find(
      (caja: any) => caja.caja_id == state.selectedCajaId
    );

    // Construir el payload con caja y tipo de operación
    const inventario = {
      caja_id: state.selectedCajaId,
      caja: caja?.caja_nombre || '',
      operacioncaja_id: operacionCajaId || null,
      tipo_operacion: state.selectedOperacion,
      total: state.valoresSummary.totalConvertido,
      diferencia: state.valoresSummary.diferencia,
      suma_diaria: state.valoresSummary.suma_diaria_efectivo,
      tipocambio: state.valoresSummary.tipocambio,
      inventario_efectivo_detalle: inventarioDetallePorDenominacion,
      suma_diaria_detalle: state.catMovWithDetailsData,
      cajas: state.cajasData
    };

    this._inventarioCajaRemoteReq.requestSaveInventario(inventario).pipe(
      tap(async ({data, pagination}) => {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
      }),
      finalize(async () => {
        this.patch({saveInventarioCajaLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          saveInventarioCajaError: error
        }));
      }),
    ).subscribe();
  };

  public get filtersToApply() {
    const state = this.vm();
    return state.filtersToApply
  };

  public loadAllInventarioCajaStore(): Observable<any> {
    this.loadSearch(this.filtersToApply);
    return of(true);
  };

  /**
   * Valida si se puede aperturar una nueva caja
   * @returns objeto con { canOpen: boolean, primerRegistro?: any }
   */
  public validarAperturaCaja(): { canOpen: boolean; primerRegistro?: any } {
    const inventarioData = this.vm().inventarioCajaData;

    // Si no hay datos, permitir aperturar
    if (!inventarioData || inventarioData.length === 0) {
      return { canOpen: true };
    }

    // Obtener el primer registro
    const primerRegistro = inventarioData[0];

    // Verificar si el primer registro está abierto
    const estaAbierto = primerRegistro.abierta === 1 || primerRegistro.abierta === '1';

    return {
      canOpen: !estaAbierto,
      primerRegistro: estaAbierto ? primerRegistro : undefined
    };
  }

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

    this._inventarioCajaRemoteReq.requestGetTurnos(this._persistenceService.getSalaId()).pipe(
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

  /**
   * Cargar la última operación de caja registrada (aperturada o cerrada)
   * Se usa para determinar qué cajas están disponibles para aperturar
   */
  public async loadLastOperacionCaja() {
    this.patch({lastOperacionCajaLoading: true});

    this._inventarioCajaRemoteReq.requestGetLastOperacionCaja().pipe(
      tap(async ({data}) => {
        this.patch({
          lastOperacionCaja: data,
        });
      }),
      finalize(() => {
        this.patch({lastOperacionCajaLoading: false});
      }),
      catchError((error) => {
        return of(this.patch({
          lastOperacionCajaLoading: false,
          lastOperacionCajaError: error
        }));
      })
    ).subscribe();
  }

  public changePagination(pageNumber: number) {
    const filtersToApply = this.vm().filtersToApply;
    filtersToApply.page = pageNumber;
    this.loadAllInventarioCajaStore();
    this.patch({filtersToApply});
  };

  // ===== MÉTODOS PARA GESTIONAR FILTROS =====

  /**
   * Inicializa los filtros con el rango de fechas por defecto (primer día del mes hasta hoy)
   */
  public initDefaultFilters() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();

    const filtersToApply = {
      ...this.vm().filtersToApply,
      startDate: this.formatDateForAPI(firstDayOfMonth, true),
      endDate: this.formatDateForAPI(today, false),
      caja_id: PARAM.UNDEFINED,
      sala_id: PARAM.UNDEFINED,
    };

    this.patch({filtersToApply});
  }

  /**
   * Actualiza los filtros con los valores proporcionados
   */
  public setFilters(filters: {
    startDate?: string | null,
    endDate?: string | null,
    caja_id?: number | null,
    sala_id?: number | null
  }) {
    const filtersToApply = {
      ...this.vm().filtersToApply,
      ...filters
    };

    this.patch({filtersToApply});
  }

  /**
   * Actualiza el rango de fechas desde un array de Date
   */
  public setDateRange(dateRange: [Date, Date]) {
    const [startDate, endDate] = dateRange;

    const filtersToApply = {
      ...this.vm().filtersToApply,
      startDate: this.formatDateForAPI(startDate, true),
      endDate: this.formatDateForAPI(endDate, false),
    };

    this.patch({filtersToApply});
  }

  /**
   * Limpia los filtros y los resetea a los valores por defecto
   */
  public clearFilters() {
    this.initDefaultFilters();
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

  // ===== FIN MÉTODOS PARA GESTIONAR FILTROS =====

  // Métodos para actualizar caja y tipo de operación
  public setSelectedCajaId(cajaId: string | null) {
    this.patch({selectedCajaId: cajaId});
    const state = this.vm();
    
    if (state.selectedOperacion == 'apertura') {
      this.loadCajas(PARAM.SI);
    } else {
      this.loadCatMovWithDetails();
      this.loadCajas(PARAM.UNDEFINED);
    }
  }

  public setSelectedOperacion(operacion: string | null) {
    this.patch({selectedOperacion: operacion});
  }

  /**
   * Establece las cajas disponibles (usado por el servicio global)
   */
  public setCajasData(cajas: any[]) {
    this.patch({cajasData: cajas});
  }

  // ===== MÉTODOS PARA GESTIONAR CAJAS =====

  /**
   * Inicializa todas las cajas para todas las denominaciones
   */
  public initializeAllCajas() {
    const state = this.vm();
    const cajasData = state.cajasData;

    if (!cajasData || cajasData.length === 0) {
      return;
    }

    const valoresActualizados = state.valoresWithDetailsData?.map((valorDetail: any) => {
      const denominacionesActualizadas = valorDetail.denominaciones?.map((denominacion: any) => {
        if (!denominacion.cajas || Object.keys(denominacion.cajas).length === 0) {
          const cajasObj: any = {};
          cajasData.forEach((caja: any) => {
            cajasObj[caja.caja_nombre] = 0;
          });
          return { ...denominacion, cajas: cajasObj };
        }
        return denominacion;
      });

      return { ...valorDetail, denominaciones: denominacionesActualizadas };
    });

    this.patch({ valoresWithDetailsData: valoresActualizados });
  }

  /**
   * Actualiza la cantidad de una denominación en una caja específica
   */
  public onCantidadCajaChange(denominacion: any, cajaNombre: string, event: any) {
    let nuevaCantidad = parseFloat(event);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
      nuevaCantidad = 0;
    }
    this.updateCantidadByCaja(denominacion, cajaNombre, nuevaCantidad);
  }

  /**
   * Actualiza la cantidad de una denominación en una caja y recalcula totales
   */
  private updateCantidadByCaja(denominacion: any, cajaNombre: string, nuevaCantidad: number) {
    const state = this.vm();
    const isCerrarMode = state.selectedOperacion === 'cierre';

    const valoresActualizados = state.valoresWithDetailsData?.map((valorDetail: any) => {
      const tipoCambio = valorDetail.current_tc || 1;
      let acumuladoLocal = 0;
      let acumuladoConvertido = 0;

      const denominacionesActualizadas = valorDetail.denominaciones?.map((denom: any) => {
        if (denom === denominacion || denom.denominacion_id === denominacion.denominacion_id) {
          const cajasActualizadas = {
            ...denom.cajas,
            [cajaNombre]: Math.max(0, nuevaCantidad)
          };

          const cantidadTotal = Object.values(cajasActualizadas).reduce(
            (sum: number, cant: any) => sum + (parseFloat(cant) || 0),
            0
          );

          const valorUnitario = parseFloat(denom.valor) || 0;
          const importeLocal = valorUnitario * cantidadTotal;
          const importeConvertido = importeLocal * tipoCambio;

          acumuladoLocal += importeLocal;
          acumuladoConvertido += importeConvertido;

          return {
            ...denom,
            cajas: cajasActualizadas,
            cantidad: cantidadTotal,
            cantidadTotal,
            importeLocal,
            importeConvertido
          };
        } else {
          acumuladoLocal += denom.importeLocal || 0;
          acumuladoConvertido += denom.importeConvertido || 0;
          return denom;
        }
      });

      return {
        ...valorDetail,
        denominaciones: denominacionesActualizadas,
        acumuladoLocal,
        acumuladoConvertido
      };
    });

    // Calcular totales globales y porcentajes
    const totalConvertido = valoresActualizados?.reduce(
      (sum: number, v: any) => sum + (v.acumuladoConvertido || 0),
      0
    ) || 0;

    const valoresConPorcentaje = valoresActualizados?.map((valor: any) => {
      const porcentaje = totalConvertido > 0
        ? ((valor.acumuladoConvertido || 0) / totalConvertido) * 100
        : 0;
      return { ...valor, porcentaje };
    });

    // Calcular total_real_caja basado en el modo
    let totalRealCaja = totalConvertido;
    if (isCerrarMode) {
      const cajaData = state.cajaData;
      const montoInicial = Number(cajaData?.monto_inicial) || 0;
      const subtotalMovimientos = this.calculateSubtotalMovimientos();
      totalRealCaja = montoInicial + subtotalMovimientos;
    }

    // Actualizar summary
    const valoresSummary = {
      ...state.valoresSummary,
      totalConvertido,
      total_real_caja: totalRealCaja,
      suma_diaria_efectivo: totalRealCaja
    };

    // Actualizar chart
    const valoresConDatos = valoresConPorcentaje?.filter((v: any) => v.acumuladoConvertido > 0) || [];
    const chartSummary = {
      ...state.chartSummary,
      series: valoresConDatos.map((v: any) => v.acumuladoConvertido),
      labels: valoresConDatos.map((v: any) => v.name || 'Sin nombre')
    };

    this.patch({
      valoresWithDetailsData: valoresConPorcentaje,
      valoresSummary,
      chartSummary
    });
  }

  // ===== MÉTODOS PARA GESTIONAR MOVIMIENTOS =====

  /**
   * Actualiza la cantidad de un movimiento desde el input
   */
  public onCantidadMovimientoChange(detail: any, event: any) {
    let nuevaCantidad = parseFloat(event);
    if (isNaN(nuevaCantidad)) {
      nuevaCantidad = 0;
    }
    this.updateCantidadMovimiento(detail, nuevaCantidad);
  }

  /**
   * Actualiza la cantidad de un movimiento y recalcula totales
   */
  private updateCantidadMovimiento(detail: any, nuevaCantidad: number) {
    const state = this.vm();
    const isCerrarMode = state.selectedOperacion === 'cierre';

    const catMovActualizado = state.catMovWithDetailsData?.map((catMov: any) => {
      const detailsActualizados = catMov.details?.map((d: any) => {
        if (d === detail || d.sumdiamovimiento_id === detail.sumdiamovimiento_id) {
          return { ...d, cantidad: nuevaCantidad };
        }
        return d;
      });

      const acumuladoLocal = detailsActualizados?.reduce(
        (sum: number, d: any) => sum + (parseFloat(d.cantidad) || 0),
        0
      ) || 0;

      return {
        ...catMov,
        details: detailsActualizados,
        acumuladoLocal,
        acumuladoConvertido: acumuladoLocal
      };
    });

    // Recalcular total_real_caja si está en modo cierre
    let totalRealCaja = state.valoresSummary.totalConvertido;
    if (isCerrarMode) {
      const cajaData = state.cajaData;
      const montoInicial = Number(cajaData?.monto_inicial) || 0;
      const subtotalMovimientos = this.calculateSubtotalMovimientos(catMovActualizado);
      totalRealCaja = montoInicial + subtotalMovimientos;
    }

    const valoresSummary = {
      ...state.valoresSummary,
      total_real_caja: totalRealCaja,
      suma_diaria_efectivo: totalRealCaja
    };

    this.patch({
      catMovWithDetailsData: catMovActualizado,
      valoresSummary
    });
  }

  /**
   * Calcula el subtotal de movimientos considerando operadores
   */
  private calculateSubtotalMovimientos(catMovData?: any[]): number {
    const catMov = catMovData || this.vm().catMovWithDetailsData;
    if (!catMov) return 0;

    return catMov.reduce((total: number, catMovItem: any) => {
      const subtotal = catMovItem.acumuladoLocal || 0;
      const operador = catMovItem.operador;

      if (operador === '+') {
        return total + subtotal;
      } else if (operador === '-') {
        return total - subtotal;
      } else if (operador === 'diff') {
        const diffTotal = catMovItem.details?.reduce((sum: number, d: any) => {
          return sum + (parseFloat(d.cantidad) || 0);
        }, 0) || 0;
        return total + diffTotal;
      }
      return total;
    }, 0);
  }

  /**
   * Actualiza el tipo de cambio de una categoría de valor y recalcula totales
   */
  onTipoCambioChange(valorDetail: any, nuevoTipoCambio: number) {
    const state = this.vm();

    // Actualizar el tipo de cambio del valorDetail
    valorDetail.current_tc = Number(nuevoTipoCambio) || 1;

    // Recalcular acumuladoConvertido para este valorDetail
    if (valorDetail.denominaciones) {
      let totalAcumuladoLocal = 0;
      let totalAcumuladoConvertido = 0;

      valorDetail.denominaciones.forEach((denom: any) => {
        const importeLocal = Number(denom.importeLocal) || 0;
        denom.importeConvertido = importeLocal * valorDetail.current_tc;

        totalAcumuladoLocal += importeLocal;
        totalAcumuladoConvertido += denom.importeConvertido;
      });

      valorDetail.acumuladoLocal = totalAcumuladoLocal;
      valorDetail.acumuladoConvertido = totalAcumuladoConvertido;
    }

    // Recalcular totales generales
    const valoresActualizados = state.valoresWithDetailsData?.map((v: any) => {
      if (v === valorDetail || v.valor_id === valorDetail.valor_id) {
        return valorDetail;
      }
      return v;
    });

    // Calcular el nuevo total convertido
    const totalConvertido = valoresActualizados?.reduce(
      (sum: number, v: any) => sum + (Number(v.acumuladoConvertido) || 0),
      0
    ) || 0;

    // Calcular porcentajes
    const valoresConPorcentaje = valoresActualizados?.map((valor: any) => {
      const porcentaje = totalConvertido > 0
        ? ((Number(valor.acumuladoConvertido) || 0) / totalConvertido) * 100
        : 0;
      return { ...valor, porcentaje };
    });

    // Actualizar summary
    const valoresSummary = {
      ...state.valoresSummary,
      totalConvertido
    };

    // Actualizar chart
    const valoresConDatos = valoresConPorcentaje?.filter((v: any) => (Number(v.acumuladoConvertido) || 0) > 0) || [];
    const chartSummary = {
      ...state.chartSummary,
      series: valoresConDatos.map((v: any) => Number(v.acumuladoConvertido) || 0),
      labels: valoresConDatos.map((v: any) => v.name || 'Sin nombre')
    };

    this.patch({
      valoresWithDetailsData: valoresConPorcentaje,
      valoresSummary,
      chartSummary
    });
  }

  // ===== FIN MÉTODOS PARA GESTIONAR MOVIMIENTOS =====

  // ===== MÉTODOS PARA VISUALIZAR RESUMEN =====

  /**
   * Cargar el resumen completo de una operación de caja
   * Incluye: inventario apertura, inventario cierre y suma diaria
   */
  public loadResumenOperacionCaja(operacionCajaId: string): Observable<any> {
    this.patch({
      resumenOperacionLoading: true,
      resumenOperacionError: null
    });

    return this._inventarioCajaRemoteReq.requestResumenOperacionCaja(operacionCajaId).pipe(
      tap(async ({data}) => {
        this.patch({
          resumenOperacionData: data,
          resumenOperacionLoading: false
        })
      }),
      catchError((error) => {
        return of(this.patch({
          resumenOperacionError: error
        }));
      })
    );
  }

  // ===== FIN MÉTODOS PARA VISUALIZAR RESUMEN =====

  /**
   * Resetea el store a su estado inicial
   * Útil para limpiar todo el estado cuando se cierra sesión
   */
  public resetStore(): void {
    this.patch(initialState);
  }

}
