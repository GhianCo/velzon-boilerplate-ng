import {inject} from '@angular/core';
import {CuadreSumaDiariaStore} from "@app/control-interno/cuadre-suma-diaria/data-access/cuadre.suma.diaria.store";

export const CuadreSumaDiariaNewResolver = () => {
  const cuadreSumaDiariaStore = inject(CuadreSumaDiariaStore);
  // Cargar datos necesarios para el cuadre
  // Por ahora no cargamos nada, los datos se cargan al buscar con el filtro de fechas
  return true;
}
