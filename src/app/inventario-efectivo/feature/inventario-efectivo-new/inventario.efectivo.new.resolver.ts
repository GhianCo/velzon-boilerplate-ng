import {inject} from '@angular/core';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";

export const InventarioEfectivoNewResolver = () => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  inventarioEfectivoStore.loadTurnos();
  inventarioEfectivoStore.loadCajas();
  inventarioEfectivoStore.loadCatMovWithDetails();
  inventarioEfectivoStore.loadValoresWithDetails();
  return true;
}
