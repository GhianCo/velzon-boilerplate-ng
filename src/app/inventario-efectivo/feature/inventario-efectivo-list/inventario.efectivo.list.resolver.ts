import {inject} from '@angular/core';
import {InventarioEfectivoStore} from "@app/inventario-efectivo/data-access/inventario.efectivo.store";
import {PersistenceService} from "@sothy/services/persistence.service";

export const InventarioEfectivoListResolver = () => {
  const inventarioEfectivoStore = inject(InventarioEfectivoStore);
  const persistenceService = inject(PersistenceService);

  // Inicializar filtros por defecto (primer día del mes hasta hoy, turno y sala en -1)
  inventarioEfectivoStore.initDefaultFilters();

  // Cargar turnos desde localStorage (key: cash_control_st_data)
  const sessionData = persistenceService.get('data');
  const turnos = sessionData?.turnos ?? [];
  inventarioEfectivoStore.actualizarTurnos(turnos);

  // Cargar inventarios con los filtros ya inicializados
  return inventarioEfectivoStore.loadAllInvetarioEfectivoStore();
}
