import {Component, inject, OnInit, effect} from '@angular/core';
import {FormsModule, ReactiveFormsModule, FormControl} from "@angular/forms";
import {NgClass, DatePipe} from "@angular/common";
import {CuadreSumaDiariaStore} from "@app/control-interno/cuadre-suma-diaria/data-access/cuadre.suma.diaria.store";
import {FlatpickrModule} from "angularx-flatpickr";
import Spanish from 'flatpickr/dist/l10n/es.js';
import {ConfirmationService} from "@sothy/services/confirmation.service";

@Component({
    selector: 'app-cuadre-suma-diaria-new',
    templateUrl: './cuadre.suma.diaria.new.html',
  imports: [
    FormsModule,
    FlatpickrModule,
    ReactiveFormsModule,
    NgClass,
  ],
    standalone: true,
    styles: [`
        .table-danger {
            background-color: rgba(220, 53, 69, 0.1) !important;
        }

        .border-danger {
            border-color: #dc3545 !important;
            border-width: 2px !important;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
            opacity: 1;
        }
    `]
})
export class CuadreSumaDiariaNew implements OnInit {

    breadCrumbItems!: Array<{}>;
    cuadreSumaDiariaStore = inject(CuadreSumaDiariaStore);
    private confirmationService = inject(ConfirmationService);
    private datePipe = inject(DatePipe);

    // Control para el selector de fechas
    dateRangeControl = new FormControl();

    // Opciones para Flatpickr
    flatpickrOptions: any = {
        mode: 'range',
        dateFormat: 'd/m/Y',
        locale: Spanish.es,
        maxDate: new Date(),
        onChange: (selectedDates: Date[], dateStr: string) => {
            console.log('📅 Flatpickr onChange:', { selectedDates, dateStr });

            if (selectedDates.length === 2) {
                const diffTime = Math.abs(selectedDates[1].getTime() - selectedDates[0].getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                console.log('📊 Diferencia de días:', diffDays);

                if (diffDays > 7) {
                    console.warn('⚠️ Rango mayor a 7 días');
                    this.confirmationService.warning(
                        'Rango inválido',
                        'El rango de fechas no puede ser mayor a 7 días'
                    );
                    this.dateRangeControl.setValue(null);
                } else {
                    console.log('✅ Rango válido, actualizando control:', dateStr);
                    // Asegurarse de que el valor se actualice correctamente
                    this.dateRangeControl.setValue(dateStr);
                }
            }
        }
    };

    // Datos del cuadre
    cuadreData: any = null;
    isLoading: boolean = false;
    isGuardando: boolean = false;

    constructor() {
        // Effect para sincronizar datos del store con el componente
        effect(() => {
            const vm = this.cuadreSumaDiariaStore.vm();

            // Actualizar isLoading
            this.isLoading = vm.cuadreLoading;

            // Actualizar cuadreData cuando llegan datos del backend
            if (vm.cuadreData) {
                console.log('📦 Effect: Datos recibidos del store:', vm.cuadreData);
                this.cuadreData = vm.cuadreData;
            }

            // Manejar errores de carga
            if (vm.cuadreError) {
                console.error('❌ Effect: Error en el store:', vm.cuadreError);
                this.confirmationService.error(
                    'Error al cargar datos',
                    'No se pudieron cargar los datos del cuadre. Por favor, intenta nuevamente.'
                );
            }

            // Actualizar estado de guardado
            this.isGuardando = vm.saveCuadreLoading;

            // Manejar éxito del guardado
            if (vm.saveCuadreSuccess && !this.isGuardando) {
                console.log('✅ Effect: Cuadre guardado exitosamente');
                this.confirmationService.success(
                    'Cuadre guardado',
                    'El cuadre de suma diaria se ha guardado correctamente'
                );
                // Limpiar datos
                this.cuadreData = null;
                this.dateRangeControl.setValue(null);
                // Resetear estado de guardado en el store
                this.cuadreSumaDiariaStore.resetSaveState();
            }

            // Manejar errores de guardado
            if (vm.saveCuadreError) {
                console.error('❌ Effect: Error al guardar:', vm.saveCuadreError);
                this.confirmationService.error(
                    'Error al guardar',
                    'No se pudo guardar el cuadre. Por favor, intenta nuevamente.'
                );
            }
        });
    }

    ngOnInit(): void {
        console.log('🚀 CuadreSumaDiariaNew inicializado');
        this.breadCrumbItems = [
            {label: 'Control Interno'},
            {label: 'Cuadre de Suma Diaria', active: true}
        ];

        // Verificar que Flatpickr esté configurado
        console.log('⚙️ Flatpickr options:', this.flatpickrOptions);
    }

    /**
     * Buscar sumas diarias por rango de fechas
     */
    buscarSumasDiarias(): void {
        console.log('🎯 Método buscarSumasDiarias ejecutado');
        console.log('📅 Valor del dateRangeControl:', this.dateRangeControl.value);

        if (!this.dateRangeControl.value) {
            console.warn('⚠️ dateRangeControl.value está vacío');
            this.confirmationService.warning(
                'Selecciona un rango de fechas',
                'Por favor, selecciona un rango de fechas para buscar'
            );
            return;
        }

        // El separador en español es " a " no " to "
        const dateRange = this.dateRangeControl.value.split(' a ');
        console.log('📊 Rango parseado:', dateRange);

        if (dateRange.length !== 2) {
            console.warn('⚠️ El rango no tiene 2 fechas:', dateRange.length);
            this.confirmationService.warning(
                'Rango inválido',
                'Por favor, selecciona un rango de fechas válido (fecha inicio y fecha fin)'
            );
            return;
        }

        // Convertir fechas de formato DD/MM/YYYY a YYYY-MM-DD
        const startDate = this.convertirFechaAFormatoISO(dateRange[0].trim());
        const endDate = this.convertirFechaAFormatoISO(dateRange[1].trim());

        console.log('🔍 Buscando sumas diarias:', {
            rangoOriginal: dateRange,
            startDate,
            endDate
        });

        this.isLoading = true;

        // Llamar al store para obtener los datos del backend
        this.cuadreSumaDiariaStore.loadCategoriasConRegistros(startDate, endDate);
    }

    /**
     * Convertir fecha de formato DD/MM/YYYY a YYYY-MM-DD
     */
    private convertirFechaAFormatoISO(fecha: string): string {
        const [day, month, year] = fecha.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }


    /**
     * Formatear fecha para mostrar en la tabla
     */
    formatearFecha(fecha: string): string {
        const date = new Date(fecha);
        return this.datePipe.transform(date, 'dd/MM/yyyy') || fecha;
    }

    /**
     * Obtener cantidad registrada de un item en una fecha
     */
    getCantidadRegistrada(item: any, fecha: string): number {
        return item.registrado[fecha] * 1 || 0;
    }

    /**
     * Calcular diferencia entre control y registrado
     */
    getDiferencia(item: any, fecha: string): number {
        const registrado = this.getCantidadRegistrada(item, fecha);
        const control = item.control[fecha] || 0;
        return control - registrado;
    }

    /**
     * Verificar si un item tiene diferencia en alguna fecha
     */
    getTieneDiferencia(item: any): boolean {
        if (!this.cuadreData) return false;

        return this.cuadreData.fechas.some((fecha: string) => {
            return this.getDiferencia(item, fecha) !== 0;
        });
    }

    /**
     * Calcular subtotal de una categoría en una fecha
     */
    getSubtotalCategoria(categoria: any, fecha: string): number {
        return categoria.items.reduce((sum: number, item: any) => {
            return sum + (item.control[fecha] || 0);
        }, 0);
    }

    /**
     * Calcular total registrado por fecha
     */
    getTotalRegistradoPorFecha(fecha: string): number {
        if (!this.cuadreData) return 0;

        return this.cuadreData.categorias.reduce((sum: number, categoria: any) => {
            return sum + categoria.items.reduce((itemSum: number, item: any) => {
                return itemSum * 1 + this.getCantidadRegistrada(item, fecha);
            }, 0);
        }, 0);
    }

    /**
     * Calcular total de control por fecha
     */
    getTotalControlPorFecha(fecha: string): number {
        if (!this.cuadreData) return 0;

        return this.cuadreData.categorias.reduce((sum: number, categoria: any) => {
            return sum + categoria.items.reduce((itemSum: number, item: any) => {
                return itemSum * 1 + (item.control[fecha] * 1 || 0);
            }, 0);
        }, 0);
    }

    /**
     * Calcular total diferencia por fecha
     */
    getTotalDiferenciaPorFecha(fecha: string): number {
        return this.getTotalControlPorFecha(fecha) - this.getTotalRegistradoPorFecha(fecha);
    }

    /**
     * Manejador cuando cambia la cantidad de control
     */
    onCantidadControlChange(item: any, fecha: string): void {
        // Aquí podrías agregar lógica adicional si es necesario
        console.log('Cantidad control cambiada:', item.nombre, fecha, item.control[fecha]);
    }

    /**
     * Verificar si hay cambios en el cuadre
     */
    hayCambios(): boolean {
        if (!this.cuadreData) return false;

        return this.cuadreData.categorias.some((categoria: any) => {
            return categoria.items.some((item: any) => {
                return this.cuadreData.fechas.some((fecha: string) => {
                    return (item.control[fecha] || 0) > 0;
                });
            });
        });
    }

    /**
     * Guardar el cuadre
     */
    guardarCuadre(): void {
        if (!this.hayCambios()) {
            this.confirmationService.warning(
                'Sin cambios',
                'No hay cambios para guardar'
            );
            return;
        }

        // Verificar si hay diferencias
        const hayDiferencias = this.cuadreData.fechas.some((fecha: string) => {
            return this.getTotalDiferenciaPorFecha(fecha) !== 0;
        });

        if (hayDiferencias) {
            this.confirmationService.openAndHandle(
                {
                    title: '¿Guardar con diferencias?',
                    message: 'Se detectaron diferencias en el cuadre. ¿Desea continuar?',
                    icon: { show: true, name: 'warning' },
                    actions: {
                        confirm: { show: true, label: 'Sí, guardar', color: 'warning' },
                        cancel: { show: true, label: 'Cancelar' }
                    }
                },
                () => {
                    this.procesarGuardado();
                }
            );
        } else {
            this.procesarGuardado();
        }
    }

    /**
     * Procesar el guardado del cuadre
     */
    private procesarGuardado(): void {
        console.log('💾 Procesando guardado del cuadre');

        // Preparar datos para enviar al backend
        const cuadreParaGuardar = {
            fechas: this.cuadreData.fechas,
            categorias: this.cuadreData.categorias.map((categoria: any) => ({
                categoria_id: categoria.id,
                nombre: categoria.nombre,
                tipo_operacion: categoria.tipo_operacion,
                items: categoria.items.map((item: any) => ({
                    item_id: item.id,
                    nombre: item.nombre,
                    registros: this.cuadreData.fechas.map((fecha: string) => ({
                        fecha: fecha,
                        cantidad_control: item.control[fecha] || 0,
                        cantidad_registrada: this.getCantidadRegistrada(item, fecha),
                        diferencia: this.getDiferencia(item, fecha)
                    }))
                }))
            }))
        };

        console.log('📤 Datos a enviar:', cuadreParaGuardar);

        // Llamar al store para guardar
        this.cuadreSumaDiariaStore.guardarCuadre(cuadreParaGuardar);
    }
}

