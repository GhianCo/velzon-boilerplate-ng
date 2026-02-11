import {inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {InventarioCajaStore} from "@app/inventario-caja/data-access/inventario.caja.store";

export const InventarioCajaReplicarResolver = () => {
  const inventarioCajaStore = inject(InventarioCajaStore);
  const activatedRoute = inject(ActivatedRoute);

  const id = activatedRoute.snapshot.params['id'];

  // Cargar valores, cajas y última operación
  inventarioCajaStore.loadValoresWithDetails();
  inventarioCajaStore.loadCajas();
  inventarioCajaStore.loadLastOperacionCaja();

  if (id) {
    // Cargar la operación de caja para replicar
    inventarioCajaStore.loadOperacionCajaWithDetails(id);
  }

  return {};
}
