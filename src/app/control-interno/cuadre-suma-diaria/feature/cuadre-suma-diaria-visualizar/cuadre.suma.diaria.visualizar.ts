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
   * Calcular subtotal de una columna (registrado, control o diferencia)
   */
  getSubtotal(items: any[], fecha: string, tipo: 'registrado' | 'control'): number {
    if (!items || !Array.isArray(items)) return 0;
    
    return items.reduce((sum, item) => {
      const valor = parseFloat(item[tipo][fecha]) || 0;
      return sum + valor;
    }, 0);
  }

  /**
   * Calcular diferencia de una columna
   */
  getDiferenciaTotal(items: any[], fecha: string): number {
    if (!items || !Array.isArray(items)) return 0;
    
    return items.reduce((sum, item) => {
      const registrado = parseFloat(item.registrado[fecha]) || 0;
      const control = parseFloat(item.control[fecha]) || 0;
      return sum + (control - registrado);
    }, 0);
  }

  /**
   * Calcular total general por columna
   */
  getTotalGeneral(tipo: 'registrado' | 'control'): { [fecha: string]: number } {
    if (!this.categoriasData || !this.categoriasData.categorias) return {};
    
    const totales: { [fecha: string]: number } = {};
    
    this.categoriasData.fechas.forEach((fecha: string) => {
      let total = 0;
      
      this.categoriasData.categorias.forEach((categoria: any) => {
        if (categoria.tipo_operacion === '+') {
          // Sumar ingresos
          total += this.getSubtotal(categoria.items, fecha, tipo);
        } else if (categoria.tipo_operacion === '-') {
          // Restar egresos
          total -= this.getSubtotal(categoria.items, fecha, tipo);
        } else if (categoria.tipo_operacion === 'diff') {
          // Las diferencias se suman al final
          total += this.getSubtotal(categoria.items, fecha, tipo);
        }
      });
      
      totales[fecha] = total;
    });
    
    return totales;
  }

  /**
   * Calcular total general de diferencia
   */
  getTotalGeneralDiferencia(): { [fecha: string]: number } {
    if (!this.categoriasData || !this.categoriasData.categorias) return {};
    
    const totalesRegistrado = this.getTotalGeneral('registrado');
    const totalesControl = this.getTotalGeneral('control');
    const totalesDiferencia: { [fecha: string]: number } = {};
    
    this.categoriasData.fechas.forEach((fecha: string) => {
      totalesDiferencia[fecha] = (totalesControl[fecha] || 0) - (totalesRegistrado[fecha] || 0);
    });
    
    return totalesDiferencia;
  }

  /**
   * Calcular suma total de una columna (para la última columna de totales)
   */
  getSumaTotalColumna(items: any[], tipo: 'registrado' | 'control'): number {
    if (!items || !Array.isArray(items) || !this.categoriasData) return 0;
    
    let total = 0;
    this.categoriasData.fechas.forEach((fecha: string) => {
      total += this.getSubtotal(items, fecha, tipo);
    });
    return total;
  }

  /**
   * Calcular suma total de diferencias por item
   */
  getSumaTotalDiferenciaItems(items: any[]): number {
    if (!items || !Array.isArray(items) || !this.categoriasData) return 0;
    
    let total = 0;
    this.categoriasData.fechas.forEach((fecha: string) => {
      total += this.getDiferenciaTotal(items, fecha);
    });
    return total;
  }

  /**
   * Calcular suma total de registrado para un item específico
   */
  getSumaTotalRegistradoItem(item: any): number {
    if (!item || !this.categoriasData) return 0;
    
    return this.categoriasData.fechas.reduce((sum: number, fecha: string) => {
      return sum + (parseFloat(item.registrado[fecha]) || 0);
    }, 0);
  }

  /**
   * Calcular suma total de control para un item específico
   */
  getSumaTotalControlItem(item: any): number {
    if (!item || !this.categoriasData) return 0;
    
    return this.categoriasData.fechas.reduce((sum: number, fecha: string) => {
      return sum + (parseFloat(item.control[fecha]) || 0);
    }, 0);
  }

  /**
   * Calcular suma total de diferencia para un item específico
   */
  getSumaTotalDiferenciaItem(item: any): number {
    if (!item || !this.categoriasData) return 0;
    
    return this.categoriasData.fechas.reduce((sum: number, fecha: string) => {
      const registrado = parseFloat(item.registrado[fecha]) || 0;
      const control = parseFloat(item.control[fecha]) || 0;
      return sum + (control - registrado);
    }, 0);
  }

  /**
   * Calcular suma total general de todas las fechas
   */
  getSumaTotalGeneralPorTipo(tipo: 'registrado' | 'control'): number {
    const totales = this.getTotalGeneral(tipo);
    return Object.values(totales).reduce((sum, val) => sum + val, 0);
  }

  /**
   * Calcular suma total general de diferencias
   */
  getSumaTotalGeneralDiferencia(): number {
    const totales = this.getTotalGeneralDiferencia();
    return Object.values(totales).reduce((sum, val) => sum + val, 0);
  }

  /**
   * Verificar si un valor es un array
   */
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}

