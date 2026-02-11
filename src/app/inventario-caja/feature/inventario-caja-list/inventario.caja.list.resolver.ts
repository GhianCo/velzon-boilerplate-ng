import {inject} from '@angular/core';
import {InventarioCajaStore} from "@app/inventario-caja/data-access/inventario.caja.store";

export const InventarioCajaListResolver = () => {
  const inventarioCajaStore = inject(InventarioCajaStore);

  // Inicializar filtros por defecto (primer día del mes hasta hoy, caja y sala en -1)
  inventarioCajaStore.initDefaultFilters();

  // Cargar turnos
  inventarioCajaStore.loadTurnos();

  // Cargar inventarios con los filtros ya inicializados
  return inventarioCajaStore.loadAllInventarioCajaStore();
}
