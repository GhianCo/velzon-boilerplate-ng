import {inject} from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {PersistenceService} from "@sothy/services/persistence.service";
import {switchMap} from 'rxjs/operators';
import {PARAM} from '@shared/constants/app.const';

export const InventarioEfectivoCerrarResolver = (route: ActivatedRouteSnapshot) => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  const persistenceService = inject(PersistenceService);
  const operacionTurnoId = route.params['id'];

  const turnos = persistenceService.get('core')?.turnos ?? [];
  inventarioEfectivoStore.actualizarTurnos(turnos);

  // Primero cargamos cajas, luego cuando estén listas cargamos valores
  return inventarioEfectivoStore.loadCajas(PARAM.UNDEFINED).pipe(
    switchMap(() => inventarioEfectivoStore.loadValoresWithDetailsByCaja(operacionTurnoId))
  );
}
