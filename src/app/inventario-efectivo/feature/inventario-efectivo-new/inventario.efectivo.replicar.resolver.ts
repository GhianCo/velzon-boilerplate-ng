import {inject} from '@angular/core';
import {ActivatedRouteSnapshot} from '@angular/router';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {PersistenceService} from "@sothy/services/persistence.service";

export const InventarioEfectivoReplicarResolver = (route: ActivatedRouteSnapshot) => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  const persistenceService = inject(PersistenceService);
  const id = route.params['id'];

  const turnos = persistenceService.get('data')?.turnos ?? [];
  inventarioEfectivoStore.actualizarTurnos(turnos);

  inventarioEfectivoStore.loadCajas();
  inventarioEfectivoStore.loadLastOperacionTurno();
  inventarioEfectivoStore.loadCatMovWithDetails();
  inventarioEfectivoStore.loadOperacionTurnoWithDetails(id);
  return true;
}
