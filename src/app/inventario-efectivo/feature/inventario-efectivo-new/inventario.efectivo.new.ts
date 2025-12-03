import {Component, inject, OnInit} from '@angular/core';
import {
    NgbAccordionBody,
    NgbAccordionButton, NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbsComponent} from "@velzon/components/breadcrumbs/breadcrumbs.component";
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {FormsModule} from "@angular/forms";
import {ChartComponent} from "ng-apexcharts";
import Swal from "sweetalert2";
import {PersistenceService} from "@sothy/services/persistence.service";
import {NgStepperModule} from "angular-ng-stepper";
import {CdkStep, CdkStepLabel, CdkStepperNext, CdkStepperPrevious} from "@angular/cdk/stepper";
import {NgClass} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-inventario-efectivo-new',
    templateUrl: './inventario.efectivo.new.html',
  imports: [
    BreadcrumbsComponent,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionBody,
    FormsModule,
    ChartComponent,
    NgStepperModule,
    CdkStep,
    CdkStepLabel,
    CdkStepperNext,
    CdkStepperPrevious,
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
        // Detectar si estamos en modo cierre
        this.route.params.subscribe(params => {
            this.operacionTurnoId = params['id'];
            this.isCerrarMode = !!this.operacionTurnoId;

            if (this.isCerrarMode && this.operacionTurnoId) {
                // Cargar datos de inventarios primero, luego buscar el turno específico
                this.inventarioEfectivoStore.loadAllInvetarioEfectivoStore();

                // Esperar un momento para que los datos se carguen
                setTimeout(() => {
                    this.loadTurnoData(this.operacionTurnoId as string);
                }, 500);
            }
        });

        /**
         * BreadCrumb
         */
        this.breadCrumbItems = [
            {label: 'Inventario efectivo'},
            {label: this.isCerrarMode ? 'Cerrar turno' : 'Registrar', active: true}
        ];

        // Inicializar cajas para todas las denominaciones
        this.initializeAllCajas();

        // Inicializar movimientos
        this.initializeMovimientos();

        // Cargar turnos desde la API (solo si es modo apertura)
        if (!this.isCerrarMode) {
            // Cargar turnos
        }
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
                    turno_id: operacionTurnoId,
                    turno_nombre: inventarioApertura.turno || 'Turno',
                    fecha_apertura: inventarioApertura.apertura || '',
                    monto_inicial: inventarioApertura.totalinventario || 0,
                    usuario_apertura: inventarioApertura.gerente || ''
                };
            } else {
                // Si no se encuentra en la lista, cargar valores por defecto
                this.turnoData = {
                    turno_id: operacionTurnoId,
                    turno_nombre: 'Turno',
                    fecha_apertura: new Date().toISOString(),
                    monto_inicial: 0,
                    usuario_apertura: ''
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
                console.log('Guardando inventario con datos de turno:', {
                    turno_id: vm.selectedTurnoId,
                    tipo_operacion: vm.selectedOperacion,
                    turno_info: turnoInfo
                });

                this.inventarioEfectivoStore.saveInventarioEfectivoWithDetils();
            }
        });
    }

    // Métodos para manejar cantidades por caja
    incrementCantidadByCaja(denominacion: any, caja: string) {
        const cajas = this.getCajas(denominacion);
        cajas[caja] = (cajas[caja] || 0) + 1;
        this.updateTotales(denominacion);
    }

    decrementCantidadByCaja(denominacion: any, caja: string) {
        const cajas = this.getCajas(denominacion);
        if (cajas[caja] && cajas[caja] > 0) {
            cajas[caja]--;
            this.updateTotales(denominacion);
        }
    }

    onCantidadCajaChange(denominacion: any, caja: string, cantidad: number) {
        const cajas = this.getCajas(denominacion);
        cajas[caja] = Math.max(0, cantidad || 0);
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
                cantidadTotal += (cajas[cajaNombre] || 0);
            });
        }

        denominacion.cantidadTotal = cantidadTotal;

        // Calcular importe local
        denominacion.importeLocal = denominacion.cantidadTotal * (denominacion.valor || 0);

        // Actualizar totales de la categoría completa
        this.updateValorDetailTotales(denominacion);
    }

    // Nuevo método para calcular totales de toda la categoría de valor
    updateValorDetailTotales(denominacionChanged: any) {
        const vm = this.inventarioEfectivoStore.vm();
        if (!vm?.valoresWithDetailsData) return;

        // Buscar el valorDetail que contiene esta denominación de forma más robusta
        let valorDetailFound: any = null;

        for (const valorDetail of vm.valoresWithDetailsData) {
            if (valorDetail.denominaciones && valorDetail.denominaciones.length > 0) {
                // Buscar si esta denominación específica está en este valorDetail
                const found = valorDetail.denominaciones.find((denom: any) => denom === denominacionChanged);
                if (found) {
                    valorDetailFound = valorDetail;
                    break;
                }
            }
        }

        if (valorDetailFound && valorDetailFound.denominaciones) {
            // Calcular el acumuladoLocal sumando todos los importeLocal de las denominaciones
            let totalAcumulado = 0;

            valorDetailFound.denominaciones.forEach((denominacion: any) => {
                if (denominacion.importeLocal && !isNaN(denominacion.importeLocal)) {
                    totalAcumulado += denominacion.importeLocal;
                }
            });

            valorDetailFound.acumuladoLocal = totalAcumulado;

            // También calcular el acumuladoConvertido (para el resumen)
            const tipoCambio = valorDetailFound.current_tc || 1;
            valorDetailFound.acumuladoConvertido = valorDetailFound.acumuladoLocal * tipoCambio;

            console.log(`Actualizados totales para ${valorDetailFound.name}:`, {
                acumuladoLocal: valorDetailFound.acumuladoLocal,
                acumuladoConvertido: valorDetailFound.acumuladoConvertido,
                denominaciones: valorDetailFound.denominaciones.map((d: any) => ({
                    descripcion: d.descripcion,
                    importeLocal: d.importeLocal,
                    cantidadTotal: d.cantidadTotal
                }))
            });

            // Recalcular totales generales del store
            this.updateTotalesGenerales();
        } else {
            console.error('No se encontró el valorDetail para la denominación:', denominacionChanged);
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
            if (valorDetail.acumuladoConvertido && !isNaN(valorDetail.acumuladoConvertido)) {
                totalConvertido += valorDetail.acumuladoConvertido;
            }
        });

        // Actualizar el summary
        if (vm.valoresSummary) {
            vm.valoresSummary.totalConvertido = totalConvertido;

            // Calcular porcentajes
            vm.valoresWithDetailsData.forEach((valorDetail: any) => {
                if (totalConvertido > 0 && valorDetail.acumuladoConvertido && !isNaN(valorDetail.acumuladoConvertido)) {
                    valorDetail.porcentaje = (valorDetail.acumuladoConvertido / totalConvertido) * 100;
                } else {
                    valorDetail.porcentaje = 0;
                }
            });

            // Calcular suma diaria de efectivo (total + diferencia)
            const diferencia = vm.valoresSummary.diferencia || 0;
            vm.valoresSummary.suma_diaria_efectivo = totalConvertido + diferencia;

            // ✅ MEJORADO: Actualizar chartSummary solo con valores > 0
            const valoresConDatos = vm.valoresWithDetailsData.filter((v: any) =>
                v.acumuladoConvertido && v.acumuladoConvertido > 0
            );

            vm.chartSummary = {
                ...vm.chartSummary,
                series: valoresConDatos.map((v: any) => v.acumuladoConvertido),
                labels: valoresConDatos.map((v: any) => v.name || 'Sin nombre')
            };
        }

        console.log('Totales generales actualizados:', {
            totalConvertido: totalConvertido,
            suma_diaria_efectivo: vm.valoresSummary?.suma_diaria_efectivo,
            chartSeries: vm.chartSummary?.series,
            chartLabels: vm.chartSummary?.labels,
            valoresConDatos: vm.valoresWithDetailsData?.filter((v: any) => v.acumuladoConvertido > 0).length
        });
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

                // Recalcular total real por turno
                const totalInventario = vm.valoresSummary.totalConvertido || 0;
                const diferencia = vm.valoresSummary.diferencia || 0;

                // Total real = inventario base + movimientos (con sus operadores) + diferencia manual
                vm.valoresSummary.total_real_turno = totalInventario + totalMovimientos + diferencia;
                vm.valoresSummary.suma_diaria_efectivo = vm.valoresSummary.total_real_turno;
            }

            console.log('Totales generales de movimientos actualizados:', {
                totalInventario: vm.valoresSummary?.totalConvertido,
                totalMovimientos: totalMovimientos,
                diferencia: vm.valoresSummary?.diferencia,
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

    // ===== MÉTODOS PARA ACTUALIZAR TURNO Y OPERACIÓN =====

    onTurnoChange(operacionTurnoId: string) {
        this.inventarioEfectivoStore.setSelectedTurnoId(operacionTurnoId);
        console.log('Turno seleccionado:', operacionTurnoId);
    }

    onOperacionChange(operacion: string) {
        this.inventarioEfectivoStore.setSelectedOperacion(operacion);
        console.log('Operación seleccionada:', operacion);
    }

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
