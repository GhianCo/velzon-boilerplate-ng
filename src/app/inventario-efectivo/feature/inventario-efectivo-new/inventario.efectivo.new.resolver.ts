import {inject} from '@angular/core';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {PersistenceService} from "@sothy/services/persistence.service";

export const InventarioEfectivoNewResolver = () => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  const persistenceService = inject(PersistenceService);

  const turnos = persistenceService.get('data')?.turnos ?? [];
  inventarioEfectivoStore.actualizarTurnos(turnos);

  inventarioEfectivoStore.loadLastOperacionTurno();
  inventarioEfectivoStore.loadValoresWithDetails();
  return true;
}
