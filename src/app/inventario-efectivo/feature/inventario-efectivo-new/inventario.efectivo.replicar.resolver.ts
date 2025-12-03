import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";

export const InventarioEfectivoReplicarResolver = (route: ActivatedRouteSnapshot) => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  const id = route.params['id'];
  inventarioEfectivoStore.loadCajas();
  inventarioEfectivoStore.loadTurnos();
  inventarioEfectivoStore.loadCatMovWithDetails();
  inventarioEfectivoStore.loadOperacionTurnoWithDetails(id);
  return true;
}
