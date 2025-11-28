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
import {CdkStep, CdkStepLabel} from "@angular/cdk/stepper";
import {NgClass} from "@angular/common";

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
    NgClass,
  ],
    standalone: true
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

    // Propiedades para selección de turno
    selectedTurnoId: string | null = null;
    selectedOperacion: string | null = null;

    constructor(private modalService: NgbModal) {
    }

    ngOnInit(): void {
        /**
         * BreadCrumb
         */
        this.breadCrumbItems = [
            {label: 'Inventario efectivo'},
            {label: 'Registrar', active: true}
        ];

        // Inicializar cajas para todas las denominaciones
        this.initializeAllCajas();

        // Inicializar movimientos
        this.initializeMovimientos();

        // Cargar turnos desde la API
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
        // Validar que se haya seleccionado turno y operación
        if (!this.selectedTurnoId || !this.selectedOperacion) {
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
                        <strong>Operación:</strong> <span class="badge ${this.selectedOperacion === 'apertura' ? 'bg-success' : 'bg-danger'}">${this.selectedOperacion}</span><br>
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
                // Agregar información del turno al store antes de guardar
                const inventarioData = {
                    turno_id: this.selectedTurnoId,
                    tipo_operacion: this.selectedOperacion,
                    turno_info: turnoInfo
                };

                console.log('Guardando inventario con datos de turno:', inventarioData);

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
        if (!this.selectedTurnoId) return null;

        const vm = this.inventarioEfectivoStore.vm();
        if (!vm.turnosData) return null;

        return vm.turnosData.find((turno: any) => turno.turno_id.toString() === this.selectedTurnoId);
    }

    // Método para obtener información completa de la selección actual
    getSelectionInfo(): any {
        const turno = this.getSelectedTurno();
        if (!turno || !this.selectedOperacion) return null;

        return {
            turno: turno,
            operacion: this.selectedOperacion,
            isValid: !!(this.selectedTurnoId && this.selectedOperacion)
        };
    }

    // ===== MÉTODOS PARA MANEJAR CATEGORÍAS DE MOVIMIENTO =====

    // Métodos para manejar cantidades de movimientos (catMovWithDetailsData)
    incrementCantidadMovimiento(detail: any) {
        detail.cantidad = (detail.cantidad || 0) + 1;
        this.updateTotalesMovimiento(detail);
    }

    decrementCantidadMovimiento(detail: any) {
        if (detail.cantidad && detail.cantidad > 0) {
            detail.cantidad--;
            this.updateTotalesMovimiento(detail);
        }
    }

    onCantidadMovimientoChange(detail: any, cantidad: number) {
        detail.cantidad = Math.max(0, cantidad || 0);
        this.updateTotalesMovimiento(detail);
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

    // ===== FIN MÉTODOS PARA CATEGORÍAS DE MOVIMIENTO =====

    /**
     * Open modal
     * @param content modal content
     */

    openModal(content: any) {
        this.submitted = false;
        this.modalService.open(content, {size: 'md', centered: true});
    }

}
