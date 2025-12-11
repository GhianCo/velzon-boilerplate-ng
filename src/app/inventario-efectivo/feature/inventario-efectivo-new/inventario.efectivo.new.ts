import {Component, inject, OnInit} from '@angular/core';
import {BreadcrumbsComponent} from "@velzon/components/breadcrumbs/breadcrumbs.component";
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {NgClass} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {CountUpModule} from "ngx-countup";

@Component({
    selector: 'app-inventario-efectivo-new',
    templateUrl: './inventario.efectivo.new.html',
  imports: [
    BreadcrumbsComponent,
    FormsModule,
    NgClass,
    CountUpModule,
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
    private route = inject(ActivatedRoute);

    // Propiedades para modo cierre
    isCerrarMode: boolean = false;
    operacionTurnoId: string | null = null;
    turnoData: any = null; // Datos del turno abierto

    // Propiedades para manejo de selección de filas (solo una fila)
    selectedRowId: string | null = null;
    num: number = 0;
    option = {
      startVal: this.num,
      useEasing: true,
      duration: 0.5,
      decimalPlaces: 2,
    };

    constructor() {
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
                } else if (this.operacionTurnoId) {
                    // Modo REPLICAR: cargar datos del turno anterior como plantilla para apertura
                } else {
                    // Modo APERTURA normal: inicializar desde cero
                    this.initializeAllCajas();
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


    // Inicializar cajas para todas las denominaciones
    initializeAllCajas() {
        this.inventarioEfectivoStore.initializeAllCajas();
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

        const turnoInfo = this.getSelectedTurno();

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

    // ===== MÉTODOS DELEGADOS AL STORE - CAJAS =====

    getCajas(denominacion: any): any {
        return denominacion.cajas || {};
    }

    incrementCantidadByCaja(denominacion: any, caja: string) {
        this.inventarioEfectivoStore.incrementCantidadByCaja(denominacion, caja);
    }

    decrementCantidadByCaja(denominacion: any, caja: string) {
        this.inventarioEfectivoStore.decrementCantidadByCaja(denominacion, caja);
    }

    onCantidadCajaChange(denominacion: any, caja: string, event: any) {
        this.inventarioEfectivoStore.onCantidadCajaChange(denominacion, caja, event);
    }

    // ===== MÉTODOS DELEGADOS AL STORE - MOVIMIENTOS =====

    incrementCantidadMovimiento(detail: any) {
        this.inventarioEfectivoStore.incrementCantidadMovimiento(detail);
    }

    decrementCantidadMovimiento(detail: any) {
        this.inventarioEfectivoStore.decrementCantidadMovimiento(detail);
    }

    onCantidadMovimientoChange(detail: any, event: any) {
        this.inventarioEfectivoStore.onCantidadMovimientoChange(detail, event);
    }

    // ===== MÉTODOS DELEGADOS AL STORE - TIPO DE CAMBIO =====

    onTipoCambioChange(valorDetail: any, nuevoTipoCambio: number) {
        this.inventarioEfectivoStore.onTipoCambioChange(valorDetail, nuevoTipoCambio);
    }

    // ===== FIN MÉTODOS DELEGADOS =====

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

}
