import {Component, effect, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {BreadcrumbsComponent} from "@velzon/components/breadcrumbs/breadcrumbs.component";
import {
  NgbDropdown, NgbDropdownMenu, NgbDropdownToggle,
  NgbModal,
  NgbNavChangeEvent,
  NgbOffcanvas, NgbPagination
} from "@ng-bootstrap/ng-bootstrap";
import {GlobalComponent} from "@app/global-component";
import {FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {PaginationService} from "@velzon/services/pagination.service";
import {Store} from "@ngrx/store";
import {RootReducerState} from "@velzon/store";
import {deleteProduct} from "@velzon/store/Ecommerce/ecommerce_action";
import {selectDataLoading, selectProductData} from "@velzon/store/Ecommerce/ecommerce_selector";
import {cloneDeep} from "lodash";
import {FlatpickrModule} from "angularx-flatpickr";
import {HotTableComponent, HotTableModule} from "@handsontable/angular-wrapper";
import Handsontable from "handsontable";
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {CommonModule} from "@angular/common";
import {SimplebarAngularModule} from "simplebar-angular";
import {EmptyStateComponent} from "@shared/components/empty-state/empty-state.component";
import {LoadingSpinnerComponent} from "@shared/components/loading-spinner/loading-spinner.component";

@Component({
  standalone: true,
  templateUrl: 'inventario.efectivo.list.html',
  encapsulation: ViewEncapsulation.None,
  imports: [
    BreadcrumbsComponent,
    NgbDropdown,
    NgbDropdownMenu,
    NgbPagination,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownToggle,
    FlatpickrModule,
    HotTableModule,
    RouterLink,
    CommonModule,
    SimplebarAngularModule,
    EmptyStateComponent,
    LoadingSpinnerComponent
  ]
})
export class InventarioEfectivoList {
  @ViewChild(HotTableComponent, {static: false})
  readonly hotTable!: HotTableComponent;
  // bread crumb items
  breadCrumbItems!: Array<{}>;

  url = GlobalComponent.API_URL;
  products!: any;
  user = [];
  Brand: any = [];
  Rating: any = [];
  discountRates: number[] = [];
  contactsForm!: UntypedFormGroup;

  // FormControl para flatpickr
  dateRangeControl: FormControl;

  // Variable para el turno seleccionado en el modal
  selectedTurnoId: number = -1;

  // Variables para guardar el estado original de los filtros al abrir el modal
  private originalFilters: any = null;
  private originalDateRange: Date[] = [];

  // Configuración de flatpickr
  flatpickrOptions: any;

  total: any;
  totalbrand: any;
  totalrate: any;
  totaldiscount: any;
  allproduct: any;
  activeindex = '1';
  allpublish: any;
  grocery: any = 0;
  fashion: any = 0;
  watches: any = 0;
  electronics: any = 0;
  furniture: any = 0;
  accessories: any = 0;
  appliance: any = 0;
  kids: any = 0;
  totalpublish: any = 0;

  // Table data
  // allproductList: any;
  searchTerm: any;

  searchproducts: any;
  publishedproduct: any;
  ProductFilter: any;
  productRate: any;
  productPrice: any;
  searchResults: any;

  id = 'hotInstance';

  data = [
    // ...
  ];

  colHeaders = [];

  columns = [
    {data: 'fecha'},
    {data: 'nomape_gerente'},
    {data: 'nomape_created'},
    {data: 'total'},
    {data: 'diferencia'},
    {data: 'suma_diaria'},
    {data: 'sala'},
    {data: 'turno'},
  ];

  hotSettings: Handsontable.GridSettings = {
    rowHeaders: true,
    colHeaders: this.colHeaders,
    columns: this.columns,
    stretchH: 'all',
    width: '100%',
    height: 'auto',
    rowHeights: 28,
    manualColumnResize: true,
    manualRowResize: true,
    licenseKey: 'non-commercial-and-evaluation',
    readOnly: true,
    className: 'htMiddle htLeft',
    dropdownMenu: false,
    filters: true,
    contextMenu: false,
    afterOnCellMouseDown: (event: any, coords: any, TD: any) => {
      if (coords.row >= 0) this.showRowMenu(coords.row, event.event);
    }
  };

  showRowMenu(row: number, event: MouseEvent) {
    event.preventDefault();

    const selectedRow = this.data[row];
    const menu = document.createElement('div');
    menu.className = 'custom-context-menu';
    menu.innerHTML = `
      <ul>
        <li>Ver Boleta ${selectedRow[6]}-${selectedRow[7]}</li>
        <li>Anular y corregir</li>
        <li>Ver PDF</li>
        <li>Ver workflow</li>
      </ul>
    `;

    Object.assign(menu.style, {
      position: 'absolute',
      top: `${event.clientY}px`,
      left: `${event.clientX}px`,
      background: '#fff',
      border: '1px solid #ccc',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      zIndex: '9999',
      borderRadius: '6px',
      fontSize: '13px',
      width: '200px'
    });

    menu.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        alert((li as HTMLElement).innerText + ' → ' + selectedRow[0]);
        document.body.removeChild(menu);
      });
      li.style.padding = '8px 10px';
      li.style.cursor = 'pointer';
      li.addEventListener('mouseenter', () => li.style.background = '#f5f5f5');
      li.addEventListener('mouseleave', () => li.style.background = 'white');
    });

    document.body.appendChild(menu);
    const closeMenu = () => {
      if (document.body.contains(menu)) document.body.removeChild(menu);
      document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 50);
  }

  constructor(private modalService: NgbModal,
              private router: Router,
              public service: PaginationService,
              private formBuilder: UntypedFormBuilder,
              private store: Store<{ data: RootReducerState }>,
              public inventarioEfectivoStore: InventarioEfectivoStore,
              private offcanvasService: NgbOffcanvas,
  ) {
    // Inicializar FormControl con el rango de fechas del store
    this.dateRangeControl = new FormControl(this.inventarioEfectivoStore.getDateRangeForComponent());

    // Configurar flatpickr (los filtros ya están inicializados por el resolver)
    this.configureFlatpickr();

    // Escuchar cambios en el FormControl para actualizar el store
    this.dateRangeControl.valueChanges.subscribe((value: any) => {
      if (!value) {
        return;
      }

      // Manejar diferentes formatos que puede devolver flatpickr
      let dates: Date[] = [];

      if (Array.isArray(value)) {
        // Si es un array, convertir cada elemento a Date si es necesario
        dates = value.map((item: any) => {
          if (item instanceof Date) {
            return item;
          } else if (typeof item === 'string') {
            // Convertir formato dd/mm/yyyy a Date
            return this.parseDate(item);
          }
          return null;
        }).filter((d): d is Date => d !== null && !isNaN(d.getTime()));

      } else if (typeof value === 'string') {
        // Si es un string, puede estar separado por " to "
        const parts = value.split(' to ');
        if (parts.length === 2) {
          // Parsear fechas en formato dd/mm/yyyy
          const parsedDates = parts.map(p => this.parseDate(p)).filter((d): d is Date => d !== null && !isNaN(d.getTime()));
          dates = parsedDates;
        } else if (parts.length === 1) {
          // Solo se seleccionó una fecha
          const singleDate = this.parseDate(parts[0]);
          if (singleDate && !isNaN(singleDate.getTime())) {
            // Usar el mismo día como inicio y fin
            dates = [singleDate, singleDate];
          }
        }
      }

      // Verificar si se seleccionó el mismo día dos veces
      if (dates.length === 2) {
        const isSameDay = dates[0].getFullYear() === dates[1].getFullYear() &&
                         dates[0].getMonth() === dates[1].getMonth() &&
                         dates[0].getDate() === dates[1].getDate();
        this.inventarioEfectivoStore.setDateRange([dates[0], dates[1]]);
      } else if (dates.length === 1) {
        // Si solo hay una fecha, usar el mismo día como inicio y fin
        this.inventarioEfectivoStore.setDateRange([dates[0], dates[0]]);
      }
    });

    effect(() => {
      const data: any = this.inventarioEfectivoStore.vm().inventarioEfectivoData;
      const colHeaders = data?.header?.filter((h: any) => h.visible).map((h: any) => h.alias);
      this.hotSettings = {
        ...this.hotSettings,
        colHeaders,
      };
      this.data = data?.body;
    });

    // Sincronizar selectedTurnoId con el store
    effect(() => {
      const turnoId = this.inventarioEfectivoStore.vm().filtersToApply?.turno_id;
      if (turnoId !== undefined) {
        this.selectedTurnoId = turnoId;
      }
    });
  }

  private configureFlatpickr() {
    this.flatpickrOptions = {
      mode: 'range',
      dateFormat: 'd/m/Y',
      defaultDate: this.inventarioEfectivoStore.getDateRangeForComponent(),
      locale: {
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
          longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        },
        months: {
          shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        }
      },
      // Callback onChange de flatpickr (se ejecuta directamente)
      onChange: (selectedDates: Date[], dateStr: string, instance: any) => {
        if (selectedDates && selectedDates.length >= 1) {
          if (selectedDates.length === 1) {
            // Solo se seleccionó una fecha, usar el mismo día como inicio y fin
            this.inventarioEfectivoStore.setDateRange([selectedDates[0], selectedDates[0]]);
          } else if (selectedDates.length === 2) {
            // Verificar si es el mismo día
            const isSameDay = selectedDates[0].getFullYear() === selectedDates[1].getFullYear() &&
                             selectedDates[0].getMonth() === selectedDates[1].getMonth() &&
                             selectedDates[0].getDate() === selectedDates[1].getDate();
            this.inventarioEfectivoStore.setDateRange([selectedDates[0], selectedDates[1]]);
          }
        }
      }
    };
  }

  /**
   * Convierte una fecha en formato dd/mm/yyyy a objeto Date
   */
  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;

    // Formato esperado: dd/mm/yyyy
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Los meses en JS van de 0-11
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day);

      // Validar que la fecha sea válida
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    console.warn(`⚠️ [parseDate] No se pudo parsear: "${dateStr}"`);
    return null;
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      {label: 'Apertura y cierre de turno'},
      {label: 'Lista', active: true}
    ];
    /**
     * fetches data
     */
    //this.store.dispatch(fetchProductListData());
    this.store.select(selectDataLoading).subscribe((data) => {
      if (data == false) {
        document.getElementById('elmLoader')?.classList.add('d-none');
      }
    });

    this.store.select(selectProductData).subscribe((data) => {
      this.products = data;
      this.allproduct = cloneDeep(data);
      this.products = this.service.changePage(this.allproduct)
    });

    this.store.select(selectProductData).subscribe((data) => {
      this.products = data;
      this.allproduct = cloneDeep(data);
      this.products = this.service.changePage(this.allproduct)
    });

    setTimeout(() => {
      for (var i = 0; i < this.allproduct.length; i++) {
        if (this.allproduct[i].category == 'Kitchen Storage & Containers') {
          this.grocery += 1
        }
        if (this.allproduct[i].category == 'Clothes') {
          this.fashion += 1
        }
        if (this.allproduct[i].category == 'Watches') {
          this.watches += 1
        }
        if (this.allproduct[i].category == 'Electronics') {
          this.electronics += 1
        }
        if (this.allproduct[i].category == 'Furniture') {
          this.furniture += 1
        }
        if (this.allproduct[i].category == 'Bike Accessories') {
          this.accessories += 1
        }
        if (this.allproduct[i].category == 'Tableware & Dinnerware') {
          this.appliance += 1
        }
        if (this.allproduct[i].category == 'Bags, Wallets and Luggage') {
          this.kids += 1
        }
        if (this.allproduct[i].status == 'published') {
          this.totalpublish += 1
        }
      }
    }, 2000);

    /**
     * Form Validation
     */
    this.contactsForm = this.formBuilder.group({
      subItem: this.formBuilder.array([]),
    });
  }

  changePage(pageNumber: number) {
    this.inventarioEfectivoStore.changePagination(pageNumber)
  }

  // Search Data
  performSearch(): void {
    this.searchResults = this.allproduct.filter((item: any) => {
      return (
        item.image.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        || item.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    // this.orderes = this.searchResults.slice(0, 10);
    this.products = this.service.changePage(this.searchResults)
  }

  /**
   * change navigation
   */
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 1) {
      this.activeindex = '1'
      this.products = this.service.changePage(this.allproduct)
    }
    if (changeEvent.nextId === 2) {
      this.activeindex = '2'
      this.products = this.allproduct.filter((product: any) => product.status == 'published');
      // this.service.productStatus = 'published'
    }
    if (changeEvent.nextId === 3) {
      this.activeindex = '3'
    }
  }

  // sort data
  onSort(column: any) {
    this.products = this.service.onSort(column, this.products)
  }

  /**
   * Delete Model Open
   */
  deleteId: any;

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, {centered: true});
  }

  // Delete Data
  deleteData(id: any) {
    if (id) {
      this.store.dispatch(deleteProduct({id: this.deleteId.toString()}));
    } else {
      this.store.dispatch(deleteProduct({id: this.checkedValGet.toString()}));
      (document.getElementById("selection-element") as HTMLElement).style.display = "none"
    }
    this.deleteId = ''
  }

  // Price Slider
  minValue = 0;
  maxValue = 1000;
  options = {
    floor: 0,
    ceil: 1000
  };

  /**
   * Default Select2
   */
  multiDefaultOption = 'Watches';
  selectedAccount = 'This is a placeholder';
  Default = [
    {name: 'Watches'},
    {name: 'Headset'},
    {name: 'Sweatshirt'},
  ];

  // Check Box Checked Value Get
  checkedValGet: any[] = [];

  // Select Checkbox value Get
  onCheckboxChange(e: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    var checkedVal: any[] = [];
    var result
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        result = checkboxes[i].value;
        checkedVal.push(result);
      }
    }
    this.checkedValGet = checkedVal
    var checkBoxCount: any = document.getElementById('select-content') as HTMLElement;
    checkBoxCount.innerHTML = checkedVal.length;
    checkedVal.length > 0 ? (document.getElementById("selection-element") as HTMLElement).style.display = "block" : (document.getElementById("selection-element") as HTMLElement).style.display = "none";
  }

  /**
   * Brand Filter
   */
  changeBrand(e: any) {
    if (e.target.checked) {
      this.Brand.push(e.target.defaultValue)
    } else {
      for (var i = 0; i < this.Brand.length; i++) {
        if (this.Brand[i] === e.target.defaultValue) {
          this.Brand.splice(i, 1)
        }
      }
    }
    this.totalbrand = this.Brand.length
  }

  /**
   * Discount Filter
   */
  changeDiscount(e: any) {
    if (e.target.checked) {
      this.discountRates.push(e.target.defaultValue)

      this.products = this.allproduct.filter((product: any) => {
        return product.rating > e.target.defaultValue;
      });
    } else {
      for (var i = 0; i < this.discountRates.length; i++) {
        if (this.discountRates[i] === e.target.defaultValue) {
          this.discountRates.splice(i, 1)
        }
      }
    }
    this.totaldiscount = this.discountRates.length
  }


  /**
   * Rating Filter
   */
  changeRating(e: any, rate: any) {
    if (e.target.checked) {
      this.Rating.push(e.target.defaultValue)
      this.products = this.allproduct.filter((product: any) => product.rating >= rate);
    } else {
      for (var i = 0; i < this.Rating.length; i++) {
        if (this.Rating[i] === e.target.defaultValue) {
          this.Rating.splice(i, 1)
        }
      }
      this.productRate = rate;
    }
    this.totalrate = this.Rating.length
  }


  /**
   * Product Filtering
   */
  changeProducts(e: any, name: any, category: any) {
    const iconItems = document.querySelectorAll('.filter-list');
    iconItems.forEach((item: any) => {
      var el = item.querySelectorAll('a')
      el.forEach((item: any) => {
        var element = item.querySelector('h5').innerHTML
        if (element == category) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      })
    });
    this.products = this.allproduct.filter((product: any) => product.category == category);
  }


  /**
   * Search Product
   */
  search(value: string) {
    if (this.activeindex == '1') {
      if (value) {
        this.products = this.allproduct.filter((val: any) =>
          val.category.toLowerCase().includes(value)
        );
        this.total = this.products.length;
      } else {
        this.products = this.searchproducts
        this.total = this.allproduct.length;
      }
    } else if (this.activeindex == '2') {
      if (value) {
        this.publishedproduct = this.publishedproduct.filter((val: any) =>
          val.category.toLowerCase().includes(value)
        );
        this.total = this.publishedproduct.length;
      } else {
        this.publishedproduct = this.allpublish
        this.total = this.publishedproduct.length;
      }
    }

  }

  /**
   * Range Slider Wise Data Filter
   */
  valueChange(value: number, boundary: boolean): void {
    if (value > 0 && value < 1000) {
      if (this.activeindex == '1') {
        if (boundary) {
          this.minValue = value;
        } else {
          this.maxValue = value;
        }
      } else if (this.activeindex == '2') {
        if (boundary) {
          this.minValue = value;
        } else {
          this.maxValue = value;
        }
      }
    }
  }

  clearall(ev: any) {
    this.minValue = 0;
    this.maxValue = 1000;
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false
    }
    // this.service.searchTerm = ''
    this.totalbrand = 0;
    this.totaldiscount = 0;
    this.totalrate = 0;
    this.Brand = []
    this.Rating = []
    this.discountRates = []
    const iconItems = document.querySelectorAll('.filter-list');
    iconItems.forEach((item: any) => {
      var el = item.querySelectorAll('a')
      el.forEach((item: any) => {
        item.classList.remove("active");
      })
    });
    this.searchTerm = '';
    this.ProductFilter = '';
    this.productRate = 0;
    this.productPrice = 0;
    this.products = this.allproduct
  }

  cerrarTurno(id: any) {
    this.router.navigate(['/inventario-efectivo/cerrar/' + id])
  }

  replicarInventario(id: any) {
    this.router.navigate(['/inventario-efectivo/replicar/' + id])
  }

  openFilters(content: TemplateRef<any>) {
    // Guardar el estado original de los filtros ANTES de abrir el modal
    const currentFilters = this.inventarioEfectivoStore.vm().filtersToApply;
    this.originalFilters = {
      turno_id: currentFilters?.turno_id ?? -1,
      sala_id: currentFilters?.sala_id ?? -1,
      startDate: currentFilters?.startDate ? new Date(currentFilters.startDate) : null,
      endDate: currentFilters?.endDate ? new Date(currentFilters.endDate) : null,
    };

    // Guardar también el rango de fechas original
    if (this.dateRangeControl.value) {
      this.originalDateRange = Array.isArray(this.dateRangeControl.value)
        ? [...this.dateRangeControl.value]
        : [this.dateRangeControl.value];
    }

    // Sincronizar el valor del select con el store antes de abrir el modal
    const currentTurnoId = currentFilters?.turno_id;
    this.selectedTurnoId = currentTurnoId !== undefined ? currentTurnoId : -1;

    // Abrir el offcanvas y escuchar cuando se cierre
    const offcanvasRef = this.offcanvasService.open(content, {position: 'end'});

    // Escuchar cuando se cierre el modal (por cualquier método: backdrop, ESC, botón X)
    offcanvasRef.result.then(
      // Cuando se cierra con un método específico (no se usa en este caso)
      () => {},
      // Cuando se cierra por dismiss (backdrop, ESC, botón X)
      (reason) => {
        // Si se cerró sin aplicar filtros, restaurar el estado original
        if (reason !== 'apply') {
          this.cancelarFiltros();
        }
      }
    );
  }

  aplicarFiltros() {
    // Aplicar filtros (hace la llamada REST)
    this.inventarioEfectivoStore.applyFilters();

    // Cerrar offcanvas con razón 'apply' para indicar que se aplicaron los filtros
    this.offcanvasService.dismiss('apply');

    // Limpiar el estado original ya que se aplicaron los cambios
    this.originalFilters = null;
    this.originalDateRange = [];
  }

  cancelarFiltros() {
    // Restaurar los filtros originales en el store (sin aplicar)
    if (this.originalFilters) {
      this.inventarioEfectivoStore.setFilters({
        turno_id: this.originalFilters.turno_id,
        sala_id: this.originalFilters.sala_id,
      });

      // Restaurar el rango de fechas si existe
      if (this.originalFilters.startDate && this.originalFilters.endDate) {
        this.inventarioEfectivoStore.setDateRange([
          this.originalFilters.startDate,
          this.originalFilters.endDate
        ]);
      }

      // Restaurar el FormControl de fechas
      if (this.originalDateRange.length > 0) {
        this.dateRangeControl.setValue(this.originalDateRange, {emitEvent: false});
      }

      // Restaurar el turno seleccionado en el select
      this.selectedTurnoId = this.originalFilters.turno_id;
    }

    // Limpiar el estado guardado
    this.originalFilters = null;
    this.originalDateRange = [];
  }

  limpiarFiltros() {
    // Resetear filtros en el store
    this.inventarioEfectivoStore.clearFilters();

    // Resetear el turno seleccionado
    this.selectedTurnoId = -1;

    // Actualizar el FormControl con las nuevas fechas
    const newDateRange = this.inventarioEfectivoStore.getDateRangeForComponent();
    this.dateRangeControl.setValue(newDateRange);

    // Actualizar la configuración de flatpickr con las nuevas fechas
    this.flatpickrOptions = {
      ...this.flatpickrOptions,
      defaultDate: newDateRange
    };
  }

  // Método para cambiar turno desde el modal (NO aplica filtros automáticamente)
  onTurnoChangeFromModal(event: any) {
    const value = event?.value;
    const turnoId = value === 'null' || value === '' ? -1 : parseInt(value);
    this.inventarioEfectivoStore.setFilters({ turno_id: turnoId });
    // NO aplicar filtros aquí - solo actualizar el estado
  }

  // Método para remover el badge de turno (SÍ aplica filtros automáticamente)
  onTurnoRemove() {
    this.inventarioEfectivoStore.setFilters({ turno_id: -1 });
    // Aplicar filtros automáticamente (hace la llamada REST)
    this.inventarioEfectivoStore.applyFilters();
  }

  onSalaChange(event: any) {
    const value = event?.value;
    const salaId = value === 'null' || value === '' ? -1 : parseInt(value);
    this.inventarioEfectivoStore.setFilters({ sala_id: salaId });
    // NO aplicar filtros aquí - solo actualizar el estado
  }

  gopublishdetail(id: any) {
    this.router.navigate(['/ecommerce/product-detail/1', this.publishedproduct[id]])
  }
}
