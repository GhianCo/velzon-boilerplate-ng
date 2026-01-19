import {Component, inject, OnInit, effect} from '@angular/core';
import {BreadcrumbsComponent} from "@velzon/components/breadcrumbs/breadcrumbs.component";
import {ActivatedRoute} from "@angular/router";
import {CommonModule} from "@angular/common";
import {CuadreSumaDiariaStore} from "@app/control-interno/cuadre-suma-diaria/data-access/cuadre.suma.diaria.store";

/**
 * Componente para visualizar las categorías con control de un resumen
 * Muestra una tabla con fechas, categorías, items y totales
 */
@Component({
  selector: 'app-cuadre-suma-diaria-visualizar',
  templateUrl: './cuadre.suma.diaria.visualizar.html',
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
export class CuadreSumaDiariaVisualizar implements OnInit {
  breadCrumbItems!: Array<{}>;
  private route = inject(ActivatedRoute);
  cuadreSumaDiariaStore = inject(CuadreSumaDiariaStore);

  resumenId: string | null = null;
  isLoading: boolean = false;
  hasError: boolean = false;
  categoriasData: any = null;

  constructor() {
    // Effect para sincronizar datos del store con el componente
    effect(() => {
      const vm = this.cuadreSumaDiariaStore.vm();
      
      // Actualizar isLoading
      this.isLoading = vm.categoriasControlLoading;
      
      // Actualizar datos
      if (vm.categoriasControlData) {
        this.categoriasData = vm.categoriasControlData;
      }
      
      // Actualizar hasError
      this.hasError = !!vm.categoriasControlError;
    });
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      {label: 'Cuadre de suma diaria'},
      {label: 'Visualizar categorías con control', active: true}
    ];

    // Obtener ID de la ruta y cargar datos
    this.route.params.subscribe(params => {
      this.resumenId = params['id'];
      if (this.resumenId) {
        this.loadCategoriasConControl(this.resumenId);
      }
    });
  }

  /**
   * Cargar las categorías con control
   */
  loadCategoriasConControl(id: string) {
    this.cuadreSumaDiariaStore.loadCategoriasConControl(id);
  }

  /**
   * Verificar si un valor es un array
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}

