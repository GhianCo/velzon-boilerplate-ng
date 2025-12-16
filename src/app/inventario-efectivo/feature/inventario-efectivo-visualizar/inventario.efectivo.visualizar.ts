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
   * Calcular el número máximo de filas necesarias
   * Toma el mayor entre el total de denominaciones y el total de items de suma diaria
   */
  getMaxRows(): number {
    if (!this.resumenData) return 0;

    // Contar total de denominaciones
    let totalDenominaciones = 0;
    if (this.resumenData.inventario_apertura?.valores) {
      this.resumenData.inventario_apertura.valores.forEach((valor: any) => {
        totalDenominaciones += valor.denominaciones?.length || 0;
      });
    }

    // Contar total de items de suma diaria
    let totalItemsSumaDiaria = 0;
    if (this.resumenData.suma_diaria?.categorias) {
      this.resumenData.suma_diaria.categorias.forEach((categoria: any) => {
        totalItemsSumaDiaria += categoria.items?.length || 0;
      });
    }

    // Retornar el mayor
    return Math.max(totalDenominaciones, totalItemsSumaDiaria);
  }

  /**
   * Obtener la denominación correspondiente a un índice global de fila
   */
  getDenominacionByGlobalIndex(globalIndex: number): any {
    if (!this.resumenData || !this.resumenData.inventario_apertura) return null;

    let currentIndex = 0;
    for (const valor of this.resumenData.inventario_apertura.valores) {
      if (!valor.denominaciones) continue;

      for (const denominacion of valor.denominaciones) {
        if (currentIndex === globalIndex) {
          return { valor, denominacion };
        }
        currentIndex++;
      }
    }

    return null;
  }

  /**
   * Obtener la denominación de CIERRE correspondiente a un índice global de fila
   */
  getDenominacionCierreByGlobalIndex(globalIndex: number): any {
    if (!this.resumenData || !this.resumenData.inventario_cierre) return null;

    let currentIndex = 0;
    for (const valor of this.resumenData.inventario_cierre.valores) {
      if (!valor.denominaciones) continue;

      for (const denominacion of valor.denominaciones) {
        if (currentIndex === globalIndex) {
          return { valor, denominacion };
        }
        currentIndex++;
      }
    }

    return null;
  }

  /**
   * Obtener el item de suma diaria correspondiente a un índice global de fila
   */
  getSumaDiariaItemByGlobalIndex(globalIndex: number): any {
    if (!this.resumenData || !this.resumenData.suma_diaria?.categorias) return null;

    // Aplanar todos los items en un solo array
    const allItems: any[] = [];
    this.resumenData.suma_diaria.categorias.forEach((categoria: any) => {
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

    return allItems[globalIndex] || null;
  }

  /**
   * Crear un array de índices para iterar sobre el máximo de filas
   */
  getRowIndices(): number[] {
    const maxRows = this.getMaxRows();
    return Array.from({ length: maxRows }, (_, i) => i);
  }

  /**
   * Verificar si un valor es un array
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}

