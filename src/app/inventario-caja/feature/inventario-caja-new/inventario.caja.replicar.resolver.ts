import {inject} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {InventarioCajaStore} from "@app/inventario-caja/data-access/inventario.caja.store";

export const InventarioCajaReplicarResolver = (route: ActivatedRouteSnapshot) => {
  const inventarioCajaStore = inject(InventarioCajaStore);

  const id = route.params['id'];

  // Cargar última operación
  // Las cajas ahora se cargan globalmente desde el CajaGlobalService (topbar)
  inventarioCajaStore.loadLastOperacionCaja();

  if (id) {
    // Con id (modo replicar): resetear estado y cargar todo desde loadOperacionCajaWithDetails
    // que ya provee valoresWithDetailsData completo con los montos.
    // No llamar loadValoresWithDetails para evitar race condition (sobreescritura con ceros).
    inventarioCajaStore.resetStore();
    inventarioCajaStore.loadOperacionCajaWithDetails(id);
  } else {
    // Sin id: cargar denominaciones base
    inventarioCajaStore.loadValoresWithDetails();
  }

  return {};
}
