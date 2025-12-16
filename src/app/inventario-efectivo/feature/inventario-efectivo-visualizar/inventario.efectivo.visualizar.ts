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
    /* Tabla responsive con scroll */
    .table-responsive {
      overflow-x: auto;
      overflow-y: auto;
      max-height: 75vh;
      -webkit-overflow-scrolling: touch;
    }

    /* Asegurar que la tabla ocupe todo el ancho */
    .table {
      width: 100% !important;
      table-layout: auto;
      min-width: max-content;
    }

    /* Sticky column para la descripción */
    .sticky-col {
      position: sticky;
      left: 0;
      background-color: #fff;
      z-index: 10;
      box-shadow: 2px 0 5px rgba(0,0,0,0.05);
    }

    .sticky-col-header {
      position: sticky;
      left: 0;
      background-color: #f8f9fa;
      z-index: 11;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    /* Scrollbar personalizado */
    .table-responsive::-webkit-scrollbar {
      height: 8px;
      width: 8px;
    }

    .table-responsive::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .table-responsive::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    .table-responsive::-webkit-scrollbar-thumb:hover {
      background: #555;
    }

    /* Headers sticky en scroll vertical */
    thead th {
      position: sticky;
      top: 0;
      background-color: #f8f9fa;
      z-index: 5;
    }

    /* Asegurar que las celdas se ajusten al contenido */
    td, th {
      white-space: nowrap;
      padding: 0.5rem;
    }

    /* Mejorar la visualización en móviles */
    @media (max-width: 767.98px) {
      .table-responsive {
        max-height: 60vh;
      }

      td, th {
        font-size: 0.85rem;
        padding: 0.35rem;
      }
    }

    /* Cards del resumen */
    .section-divider {
      border-top: 3px solid #0d6efd;
      margin: 2rem 0;
    }

    /* Bordes para separar secciones */
    .border-section {
      border-left: 2px solid #dee2e6 !important;
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

