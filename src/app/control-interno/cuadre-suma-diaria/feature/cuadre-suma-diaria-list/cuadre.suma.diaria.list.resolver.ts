import {inject} from '@angular/core';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";

export const CuadreSumaDiariaListResolver = () => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);

  // Inicializar filtros por defecto (primer día del mes hasta hoy, turno y sala en -1)
  inventarioEfectivoStore.initDefaultFilters();

  // Cargar turnos
  inventarioEfectivoStore.loadTurnos();

  // Cargar inventarios con los filtros ya inicializados
  return inventarioEfectivoStore.loadAllInvetarioEfectivoStore();
}
