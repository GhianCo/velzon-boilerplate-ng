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
        ChartComponent
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
    }

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
                if (valorDetail.denominaciones) {
                    valorDetail.denominaciones.forEach((denominacion: any) => {
                        this.initializeCajas(denominacion);
                        // Calcular totales para cada denominación inicializada
                        this.updateTotales(denominacion);
                    });
                }
            });
        }
    }

    saveInventario() {
        Swal.fire({
            title: 'Todos los datos son correctos?',
            text: 'He revisado que los datos sean los correctos!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3cd188',
            cancelButtonColor: 'rgb(243, 78, 78)',
            confirmButtonText: 'Si, guardar inventario!',
            cancelButtonText: 'No, cerrar'
        }).then(result => {
            if (result.value) {
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

        // Buscar el valorDetail que contiene esta denominación
        const valorDetail = vm.valoresWithDetailsData.find((vd: any) =>
            vd.denominaciones && vd.denominaciones.includes(denominacionChanged)
        );

        if (valorDetail && valorDetail.denominaciones) {
            // Calcular el acumuladoLocal sumando todos los importeLocal de las denominaciones
            valorDetail.acumuladoLocal = valorDetail.denominaciones.reduce((total: number, denominacion: any) => {
                return total + (denominacion.importeLocal || 0);
            }, 0);

            // También calcular el acumuladoConvertido (para el resumen)
            const tipoCambio = valorDetail.current_tc || 1;
            valorDetail.acumuladoConvertido = valorDetail.acumuladoLocal * tipoCambio;

            // Actualizar totales generales del store si existe el método
            // this.inventarioEfectivoStore.updateTotalesGenerales();
        }
    }

    // Método para manejar cambios en el tipo de cambio
    onTipoCambioChange(valorDetail: any, nuevoTipoCambio: number) {
        valorDetail.current_tc = nuevoTipoCambio;

        // Recalcular el acumuladoConvertido
        valorDetail.acumuladoConvertido = (valorDetail.acumuladoLocal || 0) * nuevoTipoCambio;

        // Actualizar totales generales si es necesario
        // this.inventarioEfectivoStore.updateTotalesGenerales();
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

    /**
     * Open modal
     * @param content modal content
     */

    openModal(content: any) {
        this.submitted = false;
        this.modalService.open(content, {size: 'md', centered: true});
    }

}
