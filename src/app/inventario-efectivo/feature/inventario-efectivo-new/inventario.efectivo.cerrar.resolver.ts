import {inject} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";

export const InventarioEfectivoCerrarResolver = (route: ActivatedRouteSnapshot) => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  const operacionTurnoId = route.params['id'];
  inventarioEfectivoStore.loadTurnos();
  inventarioEfectivoStore.loadValoresWithDetailsByCaja(operacionTurnoId);
  return true;
}
