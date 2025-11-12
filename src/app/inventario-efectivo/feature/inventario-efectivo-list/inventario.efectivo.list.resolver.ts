import {inject} from '@angular/core';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";

export const InventarioEfectivoListResolver = () => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  return inventarioEfectivoStore.loadAllInvetarioEfectivoStore()
}
