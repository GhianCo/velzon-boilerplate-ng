import {inject} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {switchMap} from 'rxjs/operators';
import {PARAM} from '@shared/constants/app.const';

export const InventarioEfectivoCerrarResolver = (route: ActivatedRouteSnapshot) => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  const operacionTurnoId = route.params['id'];
  
  // Primero cargamos cajas y turnos, luego cuando cajas esté listo, cargamos valores
  return inventarioEfectivoStore.loadCajas(PARAM.UNDEFINED).pipe(
    switchMap(() => {
      // Una vez cargadas las cajas, cargamos turnos y valores en paralelo
      inventarioEfectivoStore.loadTurnos();
      return inventarioEfectivoStore.loadValoresWithDetailsByCaja(operacionTurnoId);
    })
  );
}
