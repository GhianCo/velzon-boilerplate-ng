import {Component, effect, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BreadcrumbsComponent} from "@velzon/components/breadcrumbs/breadcrumbs.component";
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {CountUpModule} from "ngx-countup";
import {ConfirmationService} from "@sothy/services/confirmation.service";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-inventario-efectivo-new',
    templateUrl: './inventario.efectivo.new.html',
  imports: [
    BreadcrumbsComponent,
    FormsModule,
    NgClass,
    CountUpModule
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

        /* Contenedor Grid para dos tablas side-by-side */
        .table-container-dual {
            display: grid;
            grid-template-columns: 60% 40%;
            max-height: 75vh;
            width: 100%;
        }

        .table-container-single {
            display: block;
            max-height: 75vh;
            overflow: auto;
        }

        /* Wrapper para cada tabla */
        .table-wrapper {
            overflow: auto;
            height: 75vh;
        }

        .inventario-wrapper {
            border-right: 2px solid #dee2e6;
            min-width: 0; /* Permite que el grid funcione correctamente */
        }

        .suma-diaria-wrapper {
            min-width: 0; /* Permite que el grid funcione correctamente */
        }

        /* Scrollbar personalizado */
        .table-wrapper::-webkit-scrollbar {
            height: 8px;
            width: 8px;
        }

        .table-wrapper::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .table-wrapper::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
        }

        .table-wrapper::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        /* Sticky header */
        .sticky-top {
            position: sticky !important;
            top: 0 !important;
            z-index: 10 !important;
            background-color: #f8f9fa !important;
        }

        /* Responsive para móviles y tablets */
        @media (max-width: 991.98px) {
            .table-container-dual {
                grid-template-columns: 1fr;
                grid-template-rows: auto auto;
            }

            .inventario-wrapper {
                border-right: none;
                border-bottom: 2px solid #dee2e6;
            }

            .suma-diaria-wrapper {
                width: 100%;
                max-width: 100%;
            }

            .table-wrapper {
                height: auto;
                max-height: 50vh;
            }
        }

        /* Mejorar inputs en tablas */
        .input-group-sm .btn {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
        }

        .input-group-sm input {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
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
    private confirmationService = inject(ConfirmationService);
    private offcanvasService = inject(NgbOffcanvas);

    // ViewChild para el template del modal
    @ViewChild('diferenciaModal', { static: false }) diferenciaModal!: TemplateRef<any>;
    @ViewChild('transferenciaModal', { static: false }) transferenciaModal!: TemplateRef<any>;

    // Propiedades para modo cierre
    isCerrarMode: boolean = false;
    operacionTurnoId: string | null = null;
    turnoData: any = null; // Datos del turno abierto

    // Propiedad para observaciones cuando hay diferencia
    observacionesDiferencia: string = '';

    // Propiedades para transferencia de efectivo por caja
    selectedCajaTransferencia: any = null;
    montoTransferencia: number | null = null;
    observacionTransferencia: string = '';

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
        // Effect para observar cambios en turnoData del store
        effect(() => {
            const turnoData = this.inventarioEfectivoStore.vm().turnoData;
            if (turnoData) {
              this.turnoData = turnoData;
            }
        });

        // Effect para seleccionar automáticamente el turno si solo hay uno disponible
        effect(() => {
            const turnosDisponibles = this.inventarioEfectivoStore.turnosDisponibles();
            const vm = this.inventarioEfectivoStore.vm();
            const selectedTurnoId = vm.selectedTurnoId;

            // Si hay exactamente un turno disponible y no hay ninguno seleccionado, seleccionarlo automáticamente
            if (turnosDisponibles.length === 1 && !selectedTurnoId) {
                const turnoId = turnosDisponibles[0].turno_id;
                this.inventarioEfectivoStore.setSelectedTurnoId(turnoId);
            }

            // Si el turno seleccionado ya no está disponible, limpiar la selección
            if (selectedTurnoId && turnosDisponibles.length > 0) {
                const turnoExiste = turnosDisponibles.find((t: any) => t.turno_id == selectedTurnoId);
                if (!turnoExiste) {
                    this.inventarioEfectivoStore.setSelectedTurnoId(null);
                }
            }
        });
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
                  this.loadTurnoData(this.operacionTurnoId as string);
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
        // Llamar al store para cargar la operación turno (sin subscribe)
        this.inventarioEfectivoStore.loadOperacionTurnoById(Number(operacionTurnoId));
        // El effect en el constructor se encargará de actualizar cuando turnoData cambie
    }


    // Inicializar cajas para todas las denominaciones
    initializeAllCajas() {
        this.inventarioEfectivoStore.initializeAllCajas();
    }

    // Método que se ejecuta al hacer click en "Guardar inventario"
    onClickGuardarInventario() {
        const vm = this.inventarioEfectivoStore.vm();

        // Validar que se haya seleccionado turno y operación
        if (!vm.selectedTurnoId || !vm.selectedOperacion) {
            this.confirmationService.warning(
                '⚠️ Faltan datos',
                'Por favor selecciona un turno y el tipo de operación antes de guardar.'
            );
            return;
        }

        // Verificar si hay diferencia en modo cierre
        // Usamos Math.abs para comparar el valor absoluto y tolerancia de 0.01 para evitar problemas de precisión
        const diferencia = Math.abs(this.getDiferenciaInventarioSuma());
        const TOLERANCIA = 0.01; // Tolerancia de 1 centavo

        if (this.isCerrarMode && diferencia > TOLERANCIA) {
            // Si hay diferencia significativa, abrir el modal
            this.offcanvasService.open(this.diferenciaModal, {
                position: 'end',
                backdrop: 'static',
                keyboard: false
            });
            return;
        }

        // Si no hay diferencia, guardar directamente
        this.proceedToSave();
    }

    // Método que se ejecuta al confirmar desde el modal de diferencia
    confirmGuardarInventario() {
        // Validar que se haya ingresado observación
        if (!this.observacionesDiferencia || this.observacionesDiferencia.trim().length === 0) {
            this.confirmationService.warning(
                '⚠️ Observación requerida',
                'Debes ingresar una observación sobre la diferencia encontrada.'
            );
            return;
        }

        // Cerrar el offcanvas
        this.offcanvasService.dismiss();

        // Proceder con el guardado
        this.proceedToSave();
    }

    // Método privado para proceder con el guardado
    private proceedToSave() {
        const vm = this.inventarioEfectivoStore.vm();
        const turnoInfo = this.isCerrarMode ? vm.turnoData : this.getSelectedTurno();

        const cajasAbiertasHtml = (vm.cajasAbiertasCierre?.length)
            ? `<div class="alert alert-warning border-warning d-flex align-items-start gap-2 py-2 px-3 mt-3 mb-0 text-start">
                <div>
                    <strong class="d-block mb-1">⚠️ Las siguientes cajas quedarán abiertas para el siguiente turno:</strong>
                    <div class="mb-2">${vm.cajasAbiertasCierre.map((c: any) => `<span class="badge bg-warning-subtle text-warning border border-warning me-1">${c.caja_nombre}</span>`).join('')}</div>
                    <small class="text-muted">Si esto no es correcto, cierra primero esas cajas y vuelve a realizar el inventario del turno antes de guardar.</small>
                </div>
               </div>`
            : '';

        this.confirmationService.openAndHandle({
            title: '✅ ¿Todos los datos son correctos?',
            html: `
                <div class="text-start">
                    <p>He revisado que los datos sean los correctos!</p>
                    ${cajasAbiertasHtml}
                    <div class="mt-3 p-3 bg-light rounded">
                        <strong>Turno:</strong> ${turnoInfo?.turno_nombre || 'No especificado'}<br>
                        <strong>Operación:</strong> <span class="badge ${vm.selectedOperacion === 'apertura' ? 'bg-success' : 'bg-danger'}">${vm.selectedOperacion}</span><br>
                    </div>
                </div>
            `,
            icon: {
                show: true,
                name: 'warning',
                color: 'warn'
            },
            actions: {
                confirm: {
                    show: true,
                    label: '💾 Si, guardar inventario!',
                    color: 'success'
                },
                cancel: {
                    show: true,
                    label: '❌ No, cerrar'
                }
            },
            dismissible: false
        }, () => {
            // onConfirm callback
            const turnoId = vm.turnoData?.turno_id || vm.selectedTurnoId;
            const operacionTurnoId = this.operacionTurnoId || null;
            this.inventarioEfectivoStore.saveInventarioEfectivoWithDetils(turnoId, operacionTurnoId);
        });
    }

    // ===== MÉTODOS DELEGADOS AL STORE - CAJAS =====

    getCajas(denominacion: any): any {
        return denominacion.cajas || {};
    }

    onCantidadCajaChange(denominacion: any, caja: string, event: any) {
        this.inventarioEfectivoStore.onCantidadCajaChange(denominacion, caja, event);
    }

    // ===== MÉTODOS DELEGADOS AL STORE - MOVIMIENTOS =====

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

    // Método para calcular diferencia entre total inventario y total suma diaria
    getDiferenciaInventarioSuma(): number {
        const vm = this.inventarioEfectivoStore.vm();

        if (!this.isCerrarMode) {
            return 0;
        }

        const totalInventario = vm.valoresSummary?.totalConvertido || 0;
        const totalSumaDiaria = vm.valoresSummary?.total_real_turno || 0;
        const diferencia = totalInventario - totalSumaDiaria;

        return diferencia;
    }

    // Método público para acceder al vm desde el template
    get vm() {
        return this.inventarioEfectivoStore.vm();
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

    // ===== VALIDACIÓN DE MÚLTIPLOS POR DENOMINACIÓN =====

    /** Devuelve true si el importe ingresado NO es múltiplo del valor de la denominación. */
    isInputInvalido(denominacion: any, cajaNombre: string): boolean {
        const valor = denominacion?.valor;
        if (!valor || valor <= 0) return false;
        const cantidad = this.getCajas(denominacion)[cajaNombre];
        if (cantidad === null || cantidad === undefined || cantidad === '' || Number(cantidad) === 0) return false;
        // Multiplicar por 100 y redondear para evitar problemas de punto flotante
        return Math.round(Number(cantidad) * 100) % Math.round(valor * 100) !== 0;
    }

    /** Genera el texto del tooltip mostrando ejemplos de múltiplos válidos para la denominación. */
    getTooltipMultiplos(denominacion: any): string {
        const valor = denominacion?.valor;
        if (!valor || valor <= 0) return '';
        const ejemplos = Array.from({ length: 5 }, (_, i) => valor * (i + 1));
        return `Sólo múltiplos de ${valor}. Ej: ${ejemplos.join(', ')}…`;
    }

    /** Devuelve true si algún input de denominación tiene un valor inválido (no múltiplo). */
    hasInputsInvalidos(): boolean {
        const vm = this.inventarioEfectivoStore.vm();
        if (!vm.valoresWithDetailsData) return false;
        const bovedaKey = InventarioEfectivoStore.BOVEDA_KEY;
        for (const valorDetail of vm.valoresWithDetailsData) {
            for (const denominacion of valorDetail.denominaciones || []) {
                // Siempre validar Bóveda
                if (this.isInputInvalido(denominacion, bovedaKey)) return true;
                // En cierre también validar cajas
                if (this.isCerrarMode && vm.cajasData) {
                    for (const caja of vm.cajasData) {
                        if (this.isInputInvalido(denominacion, caja.caja_nombre)) return true;
                    }
                }
            }
        }
        return false;
    }

    /** Número de columnas del thead/td colspan según modo (apertura vs cierre). */
    getTableColspan(vm: any): number {
        return this.isCerrarMode ? (vm.cajasData?.length || 0) + 3 : 3;
    }

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

            // Mostrar información más legible
            const summary = {
                moneda: selectedRowInfo.valorDetail.nombre,
                denominacion: selectedRowInfo.denominacion.descripcion,
                valor: selectedRowInfo.denominacion.valor,
                importe: selectedRowInfo.denominacion.importeLocal,
                cantidadTotal: selectedRowInfo.denominacion.cantidadTotal
            };
        } else {
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
    }

    onSupervisorChange(supervisorId: string) {
        this.inventarioEfectivoStore.setSelectedSupervisorId(supervisorId);
    }

    // ===== FIN MÉTODOS PARA ACTUALIZAR TURNO Y OPERACIÓN ====

    // ===== FIN MÉTODOS TURNO Y OPERACIÓN =====

}
