import {inject} from '@angular/core';
import {CuadreSumaDiariaStore} from "@app/control-interno/cuadre-suma-diaria/data-access/cuadre.suma.diaria.store";

export const CuadreSumaDiariaListResolver = () => {
  const cuadreSumaDiariaStore = inject(CuadreSumaDiariaStore);

  // Inicializar filtros con fechas por defecto (primer día del mes hasta hoy)
  cuadreSumaDiariaStore.initializeDefaultFilters();

  // Aplicar filtros (carga la lista)
  cuadreSumaDiariaStore.applyFilters();

  return true;
}
