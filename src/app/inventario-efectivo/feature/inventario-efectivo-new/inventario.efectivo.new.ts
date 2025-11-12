import {Component, effect, inject, OnInit} from '@angular/core';
import {
    NgbAccordionBody,
    NgbAccordionButton, NgbAccordionCollapse,
    NgbAccordionDirective,
    NgbAccordionHeader,
    NgbAccordionItem,
    NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbsComponent} from "@velzon/components/breadcrumbs/breadcrumbs.component";
import {RouterLink} from "@angular/router";
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {FormsModule} from "@angular/forms";
import {ChartComponent} from "ng-apexcharts";

@Component({
    selector: 'app-inventario-efectivo-new',
    templateUrl: './inventario.efectivo.new.html',
    imports: [
        BreadcrumbsComponent,
        RouterLink,
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
