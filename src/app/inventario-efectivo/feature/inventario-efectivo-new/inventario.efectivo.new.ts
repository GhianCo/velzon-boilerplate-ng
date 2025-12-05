import {Component, inject, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbsComponent} from "@velzon/components/breadcrumbs/breadcrumbs.component";
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {PersistenceService} from "@sothy/services/persistence.service";
import {NgClass} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-inventario-efectivo-new',
    templateUrl: './inventario.efectivo.new.html',
  imports: [
    BreadcrumbsComponent,
    FormsModule,
    NgClass,
  ],
    standalone: true,
    styles: [`
        .selected-row {
            background-color: rgba(13, 110, 253, 0.08) !important;
            border-left: 4px solid #0d6efd !important;
        }

        .selected-row:hover {
            background-color: rgba(13, 110, 253, 0.25) !important;
        }

        tr:hover:not(.selected-row) {
            background-color: rgba(0, 0, 0, 0.05) !important;
        }

        .selected-row td {
            border-color: rgba(13, 110, 253, 0.2) !important;
        }
    `]
})

/**
 * OrdersDetails Component
 */
export class InventarioEfectivoNew implements OnInit {

    // bread crumb items
    breadCrumbItems!: Array<{}>;
    submitted = false;
    inventarioEfectivoStore = inject(InventarioEfectivoStore);
    persistenceService = inject(PersistenceService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    // Propiedades para modo cierre
    isCerrarMode: boolean = false;
    operacionTurnoId: string | null = null;
    turnoData: any = null; // Datos del turno abierto

    // Propiedades para manejo de selección de filas (solo una fila)
    selectedRowId: string | null = null;

    constructor(private modalService: NgbModal) {
    }

    ngOnInit(): void {
        // Detectar el modo según la ruta y procesar parámetros
        this.route.url.subscribe(urlSegments => {
            const rutaActual = urlSegments.map(segment => segment.path).join('/');

            // Detectar si es modo cierre o replicar
            const esModoCierre = rutaActual.includes('cerrar');

            this.isCerrarMode = esModoCierre;

            // Detectar automáticamente el tipo de operación según la ruta
            if (esModoCierre) {
                // Ruta "cerrar" → operación de cierre
                this.inventarioEfectivoStore.setSelectedOperacion('cierre');
            } else {
                // Rutas "replicar" o "new" → operación de apertura
                this.inventarioEfectivoStore.setSelectedOperacion('apertura');
            }

            // Procesar parámetros de ruta dentro del mismo contexto
            this.route.params.subscribe(params => {
                this.operacionTurnoId = params['id'];

                if (esModoCierre && this.operacionTurnoId) {
                    // Modo CIERRE: cargar datos del turno abierto para cerrarlo
                    this.inventarioEfectivoStore.loadAllInvetarioEfectivoStore();

                    // Esperar un momento para que los datos se carguen
                    setTimeout(() => {
                        this.loadTurnoData(this.operacionTurnoId as string);
                    }, 500);

                    // Inicializar movimientos para suma diaria
                    this.initializeMovimientos();
                } else if (this.operacionTurnoId) {
                    // Modo REPLICAR: cargar datos del turno anterior como plantilla para apertura
                    // Inicializar movimientos para suma diaria
                    this.initializeMovimientos();
                } else {
                    // Modo APERTURA normal: inicializar desde cero
                    this.initializeAllCajas();
                    this.initializeMovimientos();
                }
            });
        });

        /**
         * BreadCrumb
         */
        this.breadCrumbItems = [
            {label: 'Inventario efectivo'},
            {label: this.isCerrarMode ? 'Cerrar turno' : 'Registrar', active: true}
        ];
    }

    // Método para cargar datos del turno abierto
    loadTurnoData(operacionTurnoId: string) {
        const vm = this.inventarioEfectivoStore.vm();

        // Buscar el inventario en la lista por operacionturno_id
        if (vm?.inventarioEfectivoData?.body) {
            const inventarioApertura = vm.inventarioEfectivoData.body.find(
                (inv: any) => inv.operacionturno_id == operacionTurnoId
            );

            if (inventarioApertura) {
                this.turnoData = {
                    turno_id: inventarioApertura.turno_id,
                    turno_nombre: inventarioApertura.turno || 'Turno',
                    fecha_apertura: inventarioApertura.apertura || '',
                    monto_inicial: Number(inventarioApertura.totalinventario) || 0,
                    usuario_apertura: inventarioApertura.gerente || ''
                };
            }
        }

        // Actualizar el store con los datos del turno
        this.inventarioEfectivoStore.setSelectedTurnoId(operacionTurnoId);
        this.inventarioEfectivoStore.setSelectedOperacion('cierre');

        console.log('Datos del turno cargados:', this.turnoData);
    }

    // Método para simular datos de turnos - después reemplazarás con request real

    // Getter que asegura que las cajas estén inicializadas
    getCajas(denominacion: any) {
        this.initializeCajas(denominacion);
        return denominacion.cajas;
    }

    // Inicializar cajas para todas las denominaciones
    initializeAllCajas() {
        const vm = this.inventarioEfectivoStore.vm();
        if (vm?.valoresWithDetailsData) {
            vm.valoresWithDetailsData.forEach((valorDetail: any) => {
                // Inicializar porcentaje en 0 para evitar NaN
                if (!valorDetail.porcentaje || isNaN(valorDetail.porcentaje)) {
                    valorDetail.porcentaje = 0;
                }

                if (valorDetail.denominaciones) {
                    valorDetail.denominaciones.forEach((denominacion: any) => {
                        this.initializeCajas(denominacion);
                        // Calcular totales para cada denominación inicializada
                        this.updateTotales(denominacion);
                    });
                }
            });

            // Asegurar que el chart se inicialice después de cargar los datos
            this.updateTotalesGenerales();
        }
    }

    saveInventario() {
        const vm = this.inventarioEfectivoStore.vm();

        // Validar que se haya seleccionado turno y operación
        if (!vm.selectedTurnoId || !vm.selectedOperacion) {
            Swal.fire({
                title: 'Faltan datos',
                text: 'Por favor selecciona un turno y el tipo de operación antes de guardar.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const selectionInfo = this.getSelectionInfo();
        const turnoInfo = selectionInfo?.turno;

        Swal.fire({
            title: 'Todos los datos son correctos?',
            html: `
                <div class="text-start">
                    <p>He revisado que los datos sean los correctos!</p>
                    <div class="mt-3 p-3 bg-light rounded">
                        <strong>Turno:</strong> ${turnoInfo?.turno_nombre}<br>
                        <strong>Operación:</strong> <span class="badge ${vm.selectedOperacion === 'apertura' ? 'bg-success' : 'bg-danger'}">${vm.selectedOperacion}</span><br>
                    </div>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3cd188',
            cancelButtonColor: 'rgb(243, 78, 78)',
            confirmButtonText: 'Si, guardar inventario!',
            cancelButtonText: 'No, cerrar'
        }).then(result => {
            if (result.value) {
                // Obtener turno_id desde turnoData (si está en modo cierre) o desde selectedTurnoId
                const turnoId = this.turnoData?.turno_id || vm.selectedTurnoId;

                // Pasar operacionturno_id solo si está en modo cierre
                const operacionTurnoId = this.operacionTurnoId || null;

                this.inventarioEfectivoStore.saveInventarioEfectivoWithDetils(turnoId, operacionTurnoId);
            }
        });
    }

    // Métodos para manejar cantidades por caja
    incrementCantidadByCaja(denominacion: any, caja: string) {
        const cajas = this.getCajas(denominacion);
        // Convertir a número antes de incrementar
        const cantidadActual = Number(cajas[caja]) || 0;
        cajas[caja] = cantidadActual + 1;
        this.updateTotales(denominacion);
    }

    decrementCantidadByCaja(denominacion: any, caja: string) {
        const cajas = this.getCajas(denominacion);
        // Convertir a número antes de decrementar
        const cantidadActual = Number(cajas[caja]) || 0;
        if (cantidadActual > 0) {
            cajas[caja] = cantidadActual - 1;
            this.updateTotales(denominacion);
        }
    }

    onCantidadCajaChange(denominacion: any, caja: string, cantidad: number) {
        const cajas = this.getCajas(denominacion);
        // Convertir explícitamente a número para evitar concatenación
        cajas[caja] = Math.max(0, Number(cantidad) || 0);
        this.updateTotales(denominacion);
    }

    // Inicializar el objeto cajas si no existe
    initializeCajas(denominacion: any) {
        if (!denominacion.cajas) {
            denominacion.cajas = {};
        }

        // Obtener cajas dinámicas desde el store
        const vm = this.inventarioEfectivoStore.vm();
        if (vm?.cajasData) {
            vm.cajasData.forEach((caja: any) => {
                const cajaNombre = caja.caja_nombre;
                if (denominacion.cajas[cajaNombre] === undefined) {
                    denominacion.cajas[cajaNombre] = 0;
                }
            });
        }
    }

    updateTotales(denominacion: any) {
        // Asegurar que las cajas estén inicializadas
        const cajas = this.getCajas(denominacion);

        // Calcular total de cantidad por denominación dinámicamente
        const vm = this.inventarioEfectivoStore.vm();
        let cantidadTotal = 0;

        if (vm?.cajasData) {
            vm.cajasData.forEach((caja: any) => {
                const cajaNombre = caja.caja_nombre;
                // Convertir a número al sumar para evitar concatenación
                cantidadTotal += Number(cajas[cajaNombre]) || 0;
            });
        }

        // Asegurar que sean números
        denominacion.cantidadTotal = Number(cantidadTotal) || 0;
        const valor = Number(denominacion.valor) || 0;

        // Calcular importe local
        denominacion.importeLocal = denominacion.cantidadTotal * valor;


        // Actualizar totales de la categoría completa
        this.updateValorDetailTotales(denominacion);
    }

    // Nuevo método para calcular totales de toda la categoría de valor
    updateValorDetailTotales(denominacionChanged: any) {
        const vm = this.inventarioEfectivoStore.vm();
        if (!vm?.valoresWithDetailsData) return;

        // Buscar el valorDetail que contiene esta denominación
        let valorDetailFound: any = null;

        for (const valorDetail of vm.valoresWithDetailsData) {
            if (valorDetail.denominaciones && valorDetail.denominaciones.length > 0) {
                const found = valorDetail.denominaciones.find((denom: any) => denom === denominacionChanged);
                if (found) {
                    valorDetailFound = valorDetail;
                    break;
                }
            }
        }

        if (valorDetailFound && valorDetailFound.denominaciones) {
            // Convertir tipoCambio a número explícitamente
            const tipoCambio = Number(valorDetailFound.current_tc) || 1;

            // Recalcular totales sumando desde las denominaciones
            let totalAcumuladoLocal = 0;
            let totalAcumuladoConvertido = 0;

            valorDetailFound.denominaciones.forEach((denominacion: any) => {
                // Asegurar que importeLocal sea número
                const importeLocal = Number(denominacion.importeLocal) || 0;

                // Recalcular importeConvertido de cada denominación
                denominacion.importeConvertido = importeLocal * tipoCambio;

                totalAcumuladoLocal += importeLocal;
                totalAcumuladoConvertido += denominacion.importeConvertido;
            });

            valorDetailFound.acumuladoLocal = totalAcumuladoLocal;
            valorDetailFound.acumuladoConvertido = totalAcumuladoConvertido;


            // Recalcular totales generales del store
            this.updateTotalesGenerales();
        }
    }

    // Método para manejar cambios en la diferencia
    onDiferenciaChange(nuevaDiferencia: number) {
        const vm = this.inventarioEfectivoStore.vm();
        if (vm?.valoresSummary) {
            vm.valoresSummary.diferencia = nuevaDiferencia || 0;

            // Recalcular total real del turno
            const totalConvertido = vm.valoresSummary.totalConvertido || 0;
            const totalMovimientos = vm.valoresSummary.totalMovimientos || 0;
            vm.valoresSummary.total_real_turno = totalConvertido + totalMovimientos + vm.valoresSummary.diferencia;
            vm.valoresSummary.suma_diaria_efectivo = vm.valoresSummary.total_real_turno;

            console.log('Diferencia actualizada:', {
                diferencia: vm.valoresSummary.diferencia,
                totalConvertido: totalConvertido,
                totalMovimientos: totalMovimientos,
                total_real_turno: vm.valoresSummary.total_real_turno
            });
        }
    }

    // Nuevo método para actualizar totales generales
    updateTotalesGenerales() {
        const vm = this.inventarioEfectivoStore.vm();
        if (!vm?.valoresWithDetailsData) return;

        // Calcular el total convertido general
        let totalConvertido = 0;

        vm.valoresWithDetailsData.forEach((valorDetail: any) => {
            const acumulado = Number(valorDetail.acumuladoConvertido) || 0;
            totalConvertido += acumulado;
        });

        // Actualizar el summary
        if (vm.valoresSummary) {
            vm.valoresSummary.totalConvertido = totalConvertido;

            // Calcular porcentajes
            vm.valoresWithDetailsData.forEach((valorDetail: any) => {
                const acumulado = Number(valorDetail.acumuladoConvertido) || 0;
                if (totalConvertido > 0) {
                    valorDetail.porcentaje = (acumulado / totalConvertido) * 100;
                } else {
                    valorDetail.porcentaje = 0;
                }
            });

            // Calcular suma diaria de efectivo (total + diferencia)
            const diferencia = Number(vm.valoresSummary.diferencia) || 0;
            vm.valoresSummary.suma_diaria_efectivo = totalConvertido + diferencia;

            // 🔄 RECALCULAR total_real_turno según el modo
            const totalMovimientos = Number(vm.valoresSummary.totalMovimientos) || 0;

            if (vm.selectedOperacion === 'cierre' && this.turnoData?.monto_inicial) {
                // Modo CIERRE: total_real_turno = monto_inicial + movimientos
                const montoInicial = Number(this.turnoData.monto_inicial) || 0;
                vm.valoresSummary.total_real_turno = montoInicial + totalMovimientos;
            } else {
                // Modo APERTURA: total_real_turno = totalConvertido + movimientos + diferencia
                vm.valoresSummary.total_real_turno = totalConvertido + totalMovimientos + diferencia;
            }

            // Actualizar chartSummary solo con valores > 0
            const valoresConDatos = vm.valoresWithDetailsData.filter((v: any) => {
                const acumulado = Number(v.acumuladoConvertido) || 0;
                return acumulado > 0;
            });

            vm.chartSummary = {
                ...vm.chartSummary,
                series: valoresConDatos.map((v: any) => Number(v.acumuladoConvertido) || 0),
                labels: valoresConDatos.map((v: any) => v.name || 'Sin nombre')
            };
        }
    }


    // Método para manejar cambios en el tipo de cambio
    onTipoCambioChange(valorDetail: any, nuevoTipoCambio: number) {
        valorDetail.current_tc = nuevoTipoCambio;

        // Recalcular el acumuladoConvertido
        valorDetail.acumuladoConvertido = (valorDetail.acumuladoLocal || 0) * nuevoTipoCambio;

        // Actualizar totales generales
        this.updateTotalesGenerales();
    }

    getTotalByCaja(valorDetail: any, cajaNombre: string): number {
        if (!valorDetail.denominaciones) return 0;

        return valorDetail.denominaciones.reduce((total: number, denominacion: any) => {
            const cajas = this.getCajas(denominacion);
            return total + (cajas[cajaNombre] || 0);
        }, 0);
    }

    // Nuevo método para obtener la cantidad total de todas las cajas de una categoría
    getCantidadTotalGeneral(valorDetail: any): number {
        if (!valorDetail.denominaciones) return 0;

        return valorDetail.denominaciones.reduce((total: number, denominacion: any) => {
            return total + (denominacion.cantidadTotal || 0);
        }, 0);
    }

    // Método para obtener el turno seleccionado
    getSelectedTurno(): any {
        const vm = this.inventarioEfectivoStore.vm();
        if (!vm.selectedTurnoId) return null;

        if (!vm.turnosData) return null;

        return vm.turnosData.find((turno: any) => turno.turno_id.toString() === vm.selectedTurnoId);
    }

    // Método para obtener información completa de la selección actual
    getSelectionInfo(): any {
        const vm = this.inventarioEfectivoStore.vm();
        const turno = this.getSelectedTurno();
        if (!turno || !vm.selectedOperacion) return null;

        return {
            turno: turno,
            operacion: vm.selectedOperacion,
            isValid: !!(vm.selectedTurnoId && vm.selectedOperacion)
        };
    }

    // ===== MÉTODOS PARA MANEJAR CATEGORÍAS DE MOVIMIENTO =====

    // Métodos para manejar cantidades de movimientos (catMovWithDetailsData)
    incrementCantidadMovimiento(detail: any) {
        detail.cantidad = (detail.cantidad || 0) + 1;
        this.updateTotalesMovimiento(detail);
    }

    decrementCantidadMovimiento(detail: any) {
        const categoriaMovimiento = this.getCategoriaMovimientoByDetail(detail);
        const operador = categoriaMovimiento?.tipo_operacion || categoriaMovimiento?.operador;

        // Si es diferencia, permitir valores negativos
        if (operador === 'diff' || operador === 'diferencia') {
            detail.cantidad = (detail.cantidad || 0) - 1;
        } else {
            // Para otros tipos, solo decrementar si es mayor a 0
            if (detail.cantidad && detail.cantidad > 0) {
                detail.cantidad--;
            }
        }
        this.updateTotalesMovimiento(detail);
    }

    onCantidadMovimientoChange(detail: any, cantidad: number) {
        const categoriaMovimiento = this.getCategoriaMovimientoByDetail(detail);
        const operador = categoriaMovimiento?.tipo_operacion || categoriaMovimiento?.operador;

        // Si es diferencia, permitir valores negativos
        if (operador === 'diff' || operador === 'diferencia') {
            detail.cantidad = cantidad || 0;
        } else {
            // Para otros tipos, solo valores positivos
            detail.cantidad = Math.max(0, cantidad || 0);
        }
        this.updateTotalesMovimiento(detail);
    }

    // Método auxiliar para obtener la categoría padre de un detail
    getCategoriaMovimientoByDetail(detail: any): any {
        const vm = this.inventarioEfectivoStore.vm();
        if (vm?.catMovWithDetailsData) {
            return vm.catMovWithDetailsData.find((cat: any) =>
                cat.details && cat.details.includes(detail)
            );
        }
        return null;
    }

    // Inicializar cantidades para movimientos
    initializeMovimientos() {
        const vm = this.inventarioEfectivoStore.vm();
        if (vm?.catMovWithDetailsData) {
            vm.catMovWithDetailsData.forEach((catMovimiento: any) => {
                if (catMovimiento.details) {
                    catMovimiento.details.forEach((detail: any) => {
                        if (detail.cantidad === undefined || detail.cantidad === null) {
                            detail.cantidad = 0;
                        }
                    });
                }
                // Inicializar totales
                this.updateTotalesCategoriaMovimiento(catMovimiento);
            });
        }
    }

    // Actualizar totales para un detail específico
    updateTotalesMovimiento(detail: any) {
        // Buscar la categoría padre de este detail
        const vm = this.inventarioEfectivoStore.vm();
        if (vm?.catMovWithDetailsData) {
            const categoriaMovimiento = vm.catMovWithDetailsData.find((cat: any) =>
                cat.details && cat.details.includes(detail)
            );

            if (categoriaMovimiento) {
                this.updateTotalesCategoriaMovimiento(categoriaMovimiento);
            }
        }
    }

    // Actualizar totales de toda la categoría de movimiento
    updateTotalesCategoriaMovimiento(categoriaMovimiento: any) {
        if (categoriaMovimiento && categoriaMovimiento.details) {
            // Calcular acumuladoLocal sumando todas las cantidades
            categoriaMovimiento.acumuladoLocal = categoriaMovimiento.details.reduce((total: number, detail: any) => {
                return total + (detail.cantidad || 0);
            }, 0);

            // Para movimientos, acumuladoConvertido es igual a acumuladoLocal (en soles)
            categoriaMovimiento.acumuladoConvertido = categoriaMovimiento.acumuladoLocal;

            console.log(`Totales actualizados para ${categoriaMovimiento.nombre}:`, {
                acumuladoLocal: categoriaMovimiento.acumuladoLocal,
                acumuladoConvertido: categoriaMovimiento.acumuladoConvertido,
                details: categoriaMovimiento.details.map((d: any) => ({
                    nombre: d.nombre,
                    cantidad: d.cantidad
                }))
            });

            // Actualizar totales generales de movimientos
            this.updateTotalesGeneralesMovimientos();
        }
    }

    // Actualizar totales generales de todas las categorías de movimiento
    updateTotalesGeneralesMovimientos() {
        const vm = this.inventarioEfectivoStore.vm();
        if (vm?.catMovWithDetailsData) {
            // Calcular total general de movimientos con operadores
            let totalMovimientos = 0;

            vm.catMovWithDetailsData.forEach((categoriaMovimiento: any) => {
                const montoCategoria = categoriaMovimiento.acumuladoConvertido || 0;

                // Determinar el operador de la categoría
                const operador = categoriaMovimiento.tipo_operacion || categoriaMovimiento.operador || '+';

                switch (operador) {
                    case '+':
                        totalMovimientos += montoCategoria;
                        break;
                    case '-':
                        totalMovimientos -= montoCategoria;
                        break;
                    case 'diff':
                    case 'diferencia':
                        // Para diferencias, sumamos el valor tal como está (puede ser positivo o negativo)
                        totalMovimientos += montoCategoria;
                        break;
                    default:
                        // Si no tiene operador, se considera neutro (no afecta el total)
                        break;
                }

                console.log(`Categoría ${categoriaMovimiento.nombre}: ${operador}${montoCategoria} = ${totalMovimientos}`);
            });

            // Actualizar el summary de movimientos
            if (vm.valoresSummary) {
                vm.valoresSummary.totalMovimientos = totalMovimientos;

                // 🔄 SOLO EN MODO CIERRE: calcular total_real_turno desde monto_inicial
                if (vm.selectedOperacion === 'cierre' && this.turnoData?.monto_inicial) {
                    // En modo cierre: base es monto_inicial + movimientos
                    const montoInicial = Number(this.turnoData.monto_inicial) || 0;
                    vm.valoresSummary.total_real_turno = montoInicial + totalMovimientos;
                } else {
                    // En modo apertura: base es totalConvertido + movimientos + diferencia
                    const totalInventario = vm.valoresSummary.totalConvertido || 0;
                    const diferencia = vm.valoresSummary.diferencia || 0;
                    vm.valoresSummary.total_real_turno = totalInventario + totalMovimientos + diferencia;
                }

                vm.valoresSummary.suma_diaria_efectivo = vm.valoresSummary.total_real_turno;
            }

            console.log('Totales generales de movimientos actualizados:', {
                modo: vm.selectedOperacion,
                baseAmount: vm.selectedOperacion === 'cierre' ? this.turnoData?.monto_inicial : vm.valoresSummary?.totalConvertido,
                totalMovimientos: totalMovimientos,
                totalRealTurno: vm.valoresSummary?.total_real_turno
            });
        }
    }

    // Método para obtener la cantidad total de una categoría de movimiento
    getCantidadTotalMovimiento(categoriaMovimiento: any): number {
        if (!categoriaMovimiento.details) return 0;

        return categoriaMovimiento.details.reduce((total: number, detail: any) => {
            return total + (detail.cantidad || 0);
        }, 0);
    }

    // Método para obtener clases CSS según el tipo de operación
    getOperacionClass(tipoOperacion: string): string {
        switch (tipoOperacion) {
            case '+': return 'text-success';
            case '-': return 'text-danger';
            case 'diff':
            case 'diferencia': return 'text-warning';
            default: return 'text-success';
        }
    }

    // Método para obtener clase CSS según el valor de la cantidad (para diferencias)
    getCantidadClass(detail: any, categoriaMovimiento: any): string {
        const operador = categoriaMovimiento?.tipo_operacion || categoriaMovimiento?.operador;

        // Solo aplicar colores especiales si es diferencia
        if (operador === 'diff' || operador === 'diferencia') {
            const cantidad = detail.cantidad || 0;
            if (cantidad > 0) return 'text-success fw-bold';
            if (cantidad < 0) return 'text-danger fw-bold';
            return '';
        }

        return '';
    }

    // Método para verificar si un item permite valores negativos
    isNegativeAllowed(categoriaMovimiento: any): boolean {
        const operador = categoriaMovimiento?.tipo_operacion || categoriaMovimiento?.operador;
        return operador === 'diff' || operador === 'diferencia';
    }

    // ===== FIN MÉTODOS PARA CATEGORÍAS DE MOVIMIENTO =====

    // ===== MÉTODOS PARA SELECCIÓN DE FILAS (UNA SOLA FILA) =====

    // Generar ID único para cada fila
    private getRowId(valorDetail: any, denominacion: any): string {
        return `${valorDetail.id || valorDetail.nombre}_${denominacion.id || denominacion.descripcion}`;
    }

    // Seleccionar fila (solo una a la vez)
    toggleRowSelection(valorDetail: any, denominacion: any): void {
        const rowId = this.getRowId(valorDetail, denominacion);

        // Si la fila ya está seleccionada, deseleccionarla
        if (this.selectedRowId === rowId) {
            this.selectedRowId = null;
        } else {
            // Seleccionar la nueva fila (deselecciona automáticamente la anterior)
            this.selectedRowId = rowId;
        }

        console.log('Fila seleccionada:', {
            valorDetail: valorDetail.nombre,
            denominacion: denominacion.descripcion,
            seleccionada: this.selectedRowId === rowId,
            rowId: this.selectedRowId
        });
    }

    // Verificar si una fila está seleccionada
    isRowSelected(valorDetail: any, denominacion: any): boolean {
        const rowId = this.getRowId(valorDetail, denominacion);
        return this.selectedRowId === rowId;
    }

    // Obtener clase CSS para la fila
    getRowClass(valorDetail: any, denominacion: any): string {
        const isSelected = this.isRowSelected(valorDetail, denominacion);
        return isSelected ? 'table-primary selected-row' : '';
    }

    // Obtener información de la fila seleccionada
    getSelectedRowInfo(): any | null {
        if (!this.selectedRowId) return null;

        const vm = this.inventarioEfectivoStore.vm();

        if (vm?.valoresWithDetailsData) {
            for (const valorDetail of vm.valoresWithDetailsData) {
                if (valorDetail.denominaciones) {
                    for (const denominacion of valorDetail.denominaciones) {
                        if (this.getRowId(valorDetail, denominacion) === this.selectedRowId) {
                            return {
                                valorDetail: valorDetail,
                                denominacion: denominacion,
                                rowId: this.selectedRowId
                            };
                        }
                    }
                }
            }
        }

        return null;
    }

    // Mostrar información de la fila seleccionada en consola
    logSelectedRows(): void {
        const selectedRowInfo = this.getSelectedRowInfo();

        if (selectedRowInfo) {
            console.log('Fila seleccionada:', selectedRowInfo);

            // Mostrar información más legible
            const summary = {
                moneda: selectedRowInfo.valorDetail.nombre,
                denominacion: selectedRowInfo.denominacion.descripcion,
                valor: selectedRowInfo.denominacion.valor,
                importe: selectedRowInfo.denominacion.importeLocal,
                cantidadTotal: selectedRowInfo.denominacion.cantidadTotal
            };

            console.table([summary]);
        } else {
            console.log('Ninguna fila seleccionada');
        }
    }

    // ===== FIN MÉTODOS PARA SELECCIÓN DE FILAS =====

    // ===== MÉTODO AUXILIAR PARA TABLA =====

    // Método para generar array con el máximo de filas entre inventario y suma diaria
    getMaxRowsArray(denominacionesLength: number, detailsLength: number): number[] {
        const maxLength = Math.max(denominacionesLength, detailsLength);
        return Array.from({length: maxLength}, (_, i) => i);
    }

    // ===== FIN MÉTODO AUXILIAR =====

    // ===== MÉTODOS PARA ACTUALIZAR TURNO Y OPERACIÓN =====

    onTurnoChange(operacionTurnoId: string) {
        this.inventarioEfectivoStore.setSelectedTurnoId(operacionTurnoId);
        console.log('Turno seleccionado:', operacionTurnoId);
    }

    // ===== FIN MÉTODOS PARA ACTUALIZAR TURNO Y OPERACIÓN ====

    // ===== FIN MÉTODOS TURNO Y OPERACIÓN =====

    /**
     * Open modal
     * @param content modal content
     */

    openModal(content: any) {
        this.submitted = false;
        this.modalService.open(content, {size: 'md', centered: true});
    }

}
