import {inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {InventarioCajaStore} from "@app/inventario-caja/data-access/inventario.caja.store";

export const InventarioCajaReplicarResolver = () => {
  const inventarioCajaStore = inject(InventarioCajaStore);
  const activatedRoute = inject(ActivatedRoute);

  const id = activatedRoute.snapshot.params['id'];

  // Cargar valores y última operación
  // Las cajas ahora se cargan globalmente desde el CajaGlobalService (topbar)
  inventarioCajaStore.loadValoresWithDetails();
  inventarioCajaStore.loadLastOperacionCaja();

  if (id) {
    // Cargar la operación de caja para replicar
    inventarioCajaStore.loadOperacionCajaWithDetails(id);
  }

  return {};
}
