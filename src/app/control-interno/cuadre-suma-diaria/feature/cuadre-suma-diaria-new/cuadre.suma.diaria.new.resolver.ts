import {inject} from '@angular/core';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";

export const CuadreSumaDiariaNewResolver = () => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  inventarioEfectivoStore.loadTurnos();
  inventarioEfectivoStore.loadLastOperacionTurno();
  inventarioEfectivoStore.loadValoresWithDetails();
  return true;
}
