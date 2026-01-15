import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {CuadreSumaDiariaStore} from '../data-access/cuadre.suma.diaria.store';

export const cuadreSumaDiariaResolver: ResolveFn<boolean> = (route, state) => {
  const store = inject(CuadreSumaDiariaStore);

  // Inicializar filtros con fechas por defecto (primer día del mes hasta hoy)
  store.initializeDefaultFilters();

  // Cargar turnos
  store.loadTurnos();

  // Aplicar filtros (carga la lista)
  store.applyFilters();

  return true;
};

