import {Component, inject, OnInit} from '@angular/core';
import {BreadcrumbsComponent} from "@velzon/components/breadcrumbs/breadcrumbs.component";
import {ActivatedRoute} from "@angular/router";
import {CommonModule} from "@angular/common";
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";

/**
 * Componente para visualizar el resumen de una operación de turno
 * Muestra 3 tablas: Inventario Apertura, Inventario Cierre y Suma Diaria
 */
@Component({
  selector: 'app-inventario-efectivo-visualizar',
  templateUrl: './inventario.efectivo.visualizar.html',
  standalone: true,
  imports: [
    BreadcrumbsComponent,
    CommonModule,
  ],
  styles: [`
    .table-scroll-container {
      overflow-x: auto;
      overflow-y: visible;
      max-width: 100%;
      -webkit-overflow-scrolling: touch;
    }

    .sticky-col {
      position: sticky;
      left: 0;
      background-color: #fff;
      z-index: 10;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    .sticky-col-header {
      position: sticky;
      left: 0;
      background-color: #f8f9fa;
      z-index: 11;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    .table-fixed {
      min-width: 100%;
      white-space: nowrap;
    }

    .section-divider {
      border-top: 3px solid #0d6efd;
      margin: 2rem 0;
    }

    .badge-apertura {
      background-color: #28a745;
    }

    .badge-cierre {
      background-color: #dc3545;
    }

    .badge-suma-diaria {
      background-color: #17a2b8;
    }
  `]
})
export class InventarioEfectivoVisualizar implements OnInit {
  breadCrumbItems!: Array<{}>;
  private route = inject(ActivatedRoute);
  inventarioEfectivoStore = inject(InventarioEfectivoStore);

  operacionTurnoId: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      {label: 'Inventario efectivo'},
      {label: 'Visualizar resumen', active: true}
    ];

    // Obtener ID de la ruta y cargar resumen
    this.route.params.subscribe(params => {
      this.operacionTurnoId = params['id'];
      if (this.operacionTurnoId) {
        this.loadResumen(this.operacionTurnoId);
      }
    });
  }

  /**
   * Cargar el resumen de la operación de turno a través del store
   */
  loadResumen(operacionTurnoId: string) {
    this.inventarioEfectivoStore.loadResumenOperacionTurno(operacionTurnoId).subscribe();
  }

  /**
   * Getter para acceder a los datos del resumen desde el store
   */
  get resumenData() {
    return this.inventarioEfectivoStore.vm().resumenOperacionData;
  }

  /**
   * Getter para el estado de loading
   */
  get isLoading() {
    return this.inventarioEfectivoStore.vm().resumenOperacionLoading;
  }

  /**
   * Getter para el estado de error
   */
  get hasError() {
    return !!this.inventarioEfectivoStore.vm().resumenOperacionError;
  }

  /**
   * Obtener el total de denominaciones antes de un índice de valor
   * Esto ayuda a alinear los items de suma diaria con las denominaciones correctas
   */
  getTotalDenominacionesAntes(valorIndex: number): number {
    if (!this.resumenData || !this.resumenData.inventario_apertura) return 0;

    let total = 0;
    for (let i = 0; i < valorIndex; i++) {
      const valor = this.resumenData.inventario_apertura.valores[i];
      if (valor && valor.denominaciones) {
        total += valor.denominaciones.length;
      }
    }
    return total;
  }

  /**
   * Obtener el item de suma diaria correspondiente a una fila de denominación
   * Esto distribuye los items de suma diaria de manera uniforme entre las denominaciones
   */
  getSumaDiariaItem(rowIndex: number, resumenData: any): any {
    if (!resumenData || !resumenData.suma_diaria || !resumenData.suma_diaria.categorias) {
      return null;
    }

    // Aplanar todos los items de todas las categorías en un solo array
    const allItems: any[] = [];
    resumenData.suma_diaria.categorias.forEach((categoria: any) => {
      if (categoria.items && Array.isArray(categoria.items)) {
        categoria.items.forEach((item: any) => {
          allItems.push({
            ...item,
            tipo_operacion: categoria.tipo_operacion,
            categoria_nombre: categoria.nombre
          });
        });
      }
    });

    // Retornar el item correspondiente al índice de fila
    return allItems[rowIndex] || null;
  }
}

